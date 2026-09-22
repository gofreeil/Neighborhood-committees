// ============================================================
// community.ts — הנתונים של אתר "קהילה בשכונה", שם מוגדרים הרכזים
// ונרשמים התושבים. משמש גם את מסך הרכזים וגם את המונים בדף הבית
// ("ועדי שכונות" = מספר הרכזים, "תושבים פעילים" = כל הרשומים באתר).
//
// עמידות: הקריאה למקור מוגבלת בזמן (FETCH_TIMEOUT_MS), וכל משיכה
// מוצלחת נשמרת גם ב-Strapi דרך lastKnown. כשהמקור לא עונה הדף לא
// נתקע — הוא מקבל את הנתון האחרון שנשמר עם stale=true, והממשק מציג
// אותו עם סימן אזהרה.
// ============================================================

import { getLastKnown, setLastKnown } from './lastKnown.js';
import { live, staleValue, type LiveValue } from '$lib/liveValue';

const COORDINATORS_API = 'https://community.gofreeil.com/api/coordinators';
/** אחרי כמה זמן מוותרים על המקור ומגישים את הנתון השמור */
const FETCH_TIMEOUT_MS = 5_000;
/** אחרי כישלון לא מנסים שוב במשך פרק הזמן הזה — מגישים מיד את הנתון השמור */
const DOWN_COOLDOWN_MS = 30_000;

/** מפתחות ב-lastKnown */
const KEY_COUNT = 'committees_count';
const KEY_RESIDENTS = 'residents_count';
const KEY_LIST = 'coordinators';

export interface CoordinatorRow {
    id: string;
    name: string;
    phone: string;
    avatar_url: string | null;
    city: string;
    neighborhoods: string[];
    residentsCount: number;
    itemsOnMap: number;
    /** מועד ההצטרפות (ISO). ריק ב-API ישן שעוד לא מחזיר אותו */
    createdAt?: string;
}

type Fetch = typeof globalThis.fetch;

/** מה שה-API של "קהילה בשכונה" מחזיר */
interface CommunityPayload {
    coordinators: CoordinatorRow[];
    /** סך כל הרשומים באתר. null/חסר = המקור לא הצליח לספור (או API ישן) */
    registeredUsers?: number | null;
}

/** true = הניסיון האחרון מול המקור נכשל (המקור "לא בקשר") */
let sourceDown = false;
/** מועד הכישלון האחרון (ms) — בסיס ל-cooldown */
let downAt = 0;

function markDown(): void {
    sourceDown = true;
    downAt = Date.now();
}

/** null = הקריאה נכשלה. מערך ריק = באמת אין רכזים. */
export async function fetchCoordinators(
    fetch: Fetch,
    opts: { bypassCdn?: boolean } = {},
): Promise<CoordinatorRow[] | null> {
    // המקור מגיש Cache-Control: public, max-age=300, ולכן קריאה רגילה עשויה
    // לקבל תשובה בת עד חמש דקות מה-CDN שלו. רענון יזום (webhook) מוסיף
    // פרמטר חד-פעמי כדי לקבל מפתח קאש חדש ולהגיע לנתון האמיתי.
    const url = opts.bypassCdn ? `${COORDINATORS_API}?fresh=${Date.now()}` : COORDINATORS_API;
    // המקור נפל לפני רגע: לא מחכים שוב ל-timeout בכל בקשה. ה-webhook (bypassCdn) תמיד מנסה.
    if (!opts.bypassCdn && Date.now() - downAt < DOWN_COOLDOWN_MS) return null;
    try {
        const res = await fetch(url, {
            signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
            ...(opts.bypassCdn ? { cache: 'no-store' as const } : {}),
        });
        if (!res.ok) {
            console.warn('[coordinators] API status', res.status);
            markDown();
            return null;
        }
        const data = (await res.json()) as CommunityPayload;
        const coordinators: CoordinatorRow[] = data.coordinators ?? [];
        remember(coordinators, typeof data.registeredUsers === 'number' ? data.registeredUsers : null);
        return coordinators;
    } catch (e) {
        console.warn('[coordinators] fetch failed:', e);
        markDown();
        return null;
    }
}

/** משיכה מוצלחת: מעדכנים את הזיכרון ושומרים ב-Strapi ברקע */
function remember(coordinators: CoordinatorRow[], residents: number | null): void {
    const at = new Date().toISOString();
    sourceDown = false;
    downAt = 0;
    // המקור ענה אבל בלי מונה רשומים (API ישן / הספירה אצלו נכשלה): שומרים את
    // הערך הקודם שבזיכרון כדי לא למחוק נתון טוב.
    countCache = { at, committees: countCommittees(coordinators), residents: residents ?? countCache?.residents ?? null };
    void setLastKnown(KEY_LIST, coordinators, at).catch(() => {});
    void setLastKnown(KEY_COUNT, countCache.committees, at).catch(() => {});
    if (residents !== null) void setLastKnown(KEY_RESIDENTS, residents, at).catch(() => {});
}

/**
 * רשימת הרכזים למסך הרכזים. כשהמקור לא עונה — הרשימה האחרונה שנשמרה
 * (stale=true), ו-null רק אם מעולם לא נשמרה.
 */
export async function loadCoordinators(fetch: Fetch): Promise<LiveValue<CoordinatorRow[]>> {
    const coordinators = await fetchCoordinators(fetch);
    if (coordinators) return live(coordinators, countCache?.at);
    const saved = await getLastKnown<CoordinatorRow[]>(KEY_LIST);
    return staleValue(saved?.value ?? null, saved?.at ?? null);
}

/**
 * ועד שכונה = רכז. המונה בדף הבית זהה למספר שבכותרת עמוד הרכזים
 * (מספר הרכזים הרשומים ב"קהילה בשכונה"), ולא לספירת שכונות.
 */
export function countCommittees(coordinators: CoordinatorRow[]): number {
    return coordinators.length;
}

// ============================================================
// המונים של דף הבית: "ועדי שכונות" (רכזים) ו"תושבים פעילים" (כל הרשומים)
//
// הסנכרון עובד בדחיפה: כשמצטרף רכז חדש ב"קהילה בשכונה" הוא קורא ל-
// POST /api/coordinators/sync, וזה מרענן את המונים מיד. הקאש בזיכרון הוא
// רשת ביטחון — הוא מגיש את הערך האחרון מיד ומרענן ברקע, כך שטעינת דף
// הבית לא מחכה ל-181KB של ה-API. מתחתיו יש את lastKnown ב-Strapi,
// שמחזיק את הערך גם בין הפעלות קרות של הפונקציה.
// ============================================================

const FRESH_MS = 5 * 60 * 1000;

export interface HomeCounts {
    /** מספר הרכזים = ועדי שכונות */
    committees: LiveValue<number>;
    /** כל הרשומים באתר "קהילה בשכונה" = תושבים פעילים */
    residents: LiveValue<number>;
}

let countCache: { at: string; committees: number; residents: number | null } | null = null;
let inFlight: Promise<HomeCounts> | null = null;

function fromMemory(): HomeCounts | null {
    if (!countCache) return null;
    const { at, committees, residents } = countCache;
    return sourceDown
        ? { committees: staleValue(committees, at), residents: staleValue(residents, at) }
        : { committees: live(committees, at), residents: { value: residents, stale: false, at } };
}

/** הערכים השמורים ב-Strapi — כשהמקור נפל ואין כלום בזיכרון (הפעלה קרה) */
async function fromLastKnown(): Promise<HomeCounts> {
    const [committees, residents] = await Promise.all([
        getLastKnown<number>(KEY_COUNT),
        getLastKnown<number>(KEY_RESIDENTS),
    ]);
    return {
        committees: staleValue(committees?.value ?? null, committees?.at ?? null),
        residents: staleValue(residents?.value ?? null, residents?.at ?? null),
    };
}

function reload(fetch: Fetch): Promise<HomeCounts> {
    if (inFlight) return inFlight;
    inFlight = (async () => {
        try {
            // המקור ענה: remember כבר עדכן את הזיכרון. נפל: הזיכרון (אם יש),
            // ואחריו הערכים השמורים ב-Strapi.
            await fetchCoordinators(fetch);
            return fromMemory() ?? (await fromLastKnown());
        } finally {
            inFlight = null;
        }
    })();
    return inFlight;
}

/** value=null רק כשהמקור לא עונה ואין שום ערך שמור. */
export async function getHomeCounts(fetch: Fetch): Promise<HomeCounts> {
    const mem = fromMemory();
    if (!mem || !countCache) return reload(fetch);
    if (Date.now() - Date.parse(countCache.at) < FRESH_MS) return mem;
    // מיושן: מגישים מיד ומרעננים ברקע. הרענון על ה-fetch הגלובלי ולא על זה
    // של הבקשה, כי הבקשה כבר תיסגר לפני שהוא יסתיים.
    void reload(globalThis.fetch).catch(() => {});
    return mem;
}

/**
 * רענון יזום מה-webhook, כשהצטרף רכז חדש. עוקף את ה-CDN של המקור כדי
 * שהרכז שזה עתה נרשם ייספר. מחזיר null אם המקור לא זמין — במקרה כזה
 * הערך הישן נשאר על כנו ורשת הביטחון תתפוס אותו בהמשך.
 */
export async function refreshHomeCounts(): Promise<{ committees: number; residents: number | null } | null> {
    const coordinators = await fetchCoordinators(globalThis.fetch, { bypassCdn: true });
    if (!coordinators) return null;
    return { committees: countCommittees(coordinators), residents: countCache?.residents ?? null };
}
