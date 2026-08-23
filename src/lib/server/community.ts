// ============================================================
// community.ts — הנתונים של אתר "קהילה בשכונה", שם מוגדרים הרכזים
// ונרשמים התושבים. משמש גם את מסך הרכזים וגם את מונה ועדי השכונות
// בדף הבית. הסנכרון של המונה מתואר ליד הקאש למטה.
// ============================================================

const COORDINATORS_API = 'https://community.gofreeil.com/api/coordinators';

export interface CoordinatorRow {
    id: string;
    name: string;
    phone: string;
    avatar_url: string | null;
    city: string;
    neighborhoods: string[];
    residentsCount: number;
    itemsOnMap: number;
}

type Fetch = typeof globalThis.fetch;

/** null = הקריאה נכשלה. מערך ריק = באמת אין רכזים. */
export async function fetchCoordinators(
    fetch: Fetch,
    opts: { bypassCdn?: boolean } = {},
): Promise<CoordinatorRow[] | null> {
    // המקור מגיש Cache-Control: public, max-age=300, ולכן קריאה רגילה עשויה
    // לקבל תשובה בת עד חמש דקות מה-CDN שלו. רענון יזום (webhook) מוסיף
    // פרמטר חד-פעמי כדי לקבל מפתח קאש חדש ולהגיע לנתון האמיתי.
    const url = opts.bypassCdn ? `${COORDINATORS_API}?fresh=${Date.now()}` : COORDINATORS_API;
    try {
        const res = await fetch(url, opts.bypassCdn ? { cache: 'no-store' } : undefined);
        if (!res.ok) {
            console.warn('[coordinators] API status', res.status);
            return null;
        }
        const data = await res.json();
        return data.coordinators ?? [];
    } catch (e) {
        console.warn('[coordinators] fetch failed:', e);
        return null;
    }
}

/**
 * ועד שכונה = שכונה שיש לה רכז. שכונה נספרת פעם אחת גם אם רשומים בה כמה
 * רכזים, והשם מזוהה יחד עם העיר כדי ששכונות בעלות אותו שם בערים שונות
 * (מרכז העיר, שכונה א') לא יתמזגו לאחת.
 */
export function countNeighborhoodsWithCoordinator(coordinators: CoordinatorRow[]): number {
    const seen = new Set<string>();
    for (const c of coordinators) {
        const city = (c.city ?? '').trim();
        for (const n of c.neighborhoods ?? []) {
            const name = (n ?? '').trim();
            if (name) seen.add(`${city}|${name}`);
        }
    }
    return seen.size;
}

// ============================================================
// המונה של דף הבית
//
// הסנכרון עובד בדחיפה: כשמצטרף רכז חדש ב"קהילה בשכונה" הוא קורא ל-
// POST /api/coordinators/sync, וזה מרענן את המונה מיד. הקאש כאן הוא רק
// רשת ביטחון למקרה שהקריאה לא הגיעה — הוא מגיש את הערך האחרון מיד
// ומרענן ברקע, כך שטעינת דף הבית לעולם לא מחכה ל-181KB של ה-API.
//
// הקאש יושב על המונה ולא על fetchCoordinators, כדי שכפתור הרענון במסך
// הרכזים ימשיך להביא נתונים טריים.
// ============================================================

const FRESH_MS = 5 * 60 * 1000;
let countCache: { at: number; value: number } | null = null;
let inFlight: Promise<number | null> | null = null;

function reload(fetch: Fetch): Promise<number | null> {
    if (inFlight) return inFlight;
    inFlight = (async () => {
        try {
            const coordinators = await fetchCoordinators(fetch);
            // כשה-API נופל עדיף להישאר על הערך האחרון מאשר לאפס את המונה
            if (!coordinators) return countCache?.value ?? null;
            const value = countNeighborhoodsWithCoordinator(coordinators);
            countCache = { at: Date.now(), value };
            return value;
        } finally {
            inFlight = null;
        }
    })();
    return inFlight;
}

/** null = אין מספר להציג (הקריאה נכשלה ואין ערך קודם בזיכרון). */
export async function getCommitteesCount(fetch: Fetch): Promise<number | null> {
    if (!countCache) return reload(fetch);
    if (Date.now() - countCache.at < FRESH_MS) return countCache.value;
    // מיושן: מגישים מיד ומרעננים ברקע. הרענון על ה-fetch הגלובלי ולא על זה
    // של הבקשה, כי הבקשה כבר תיסגר לפני שהוא יסתיים.
    void reload(globalThis.fetch).catch(() => {});
    return countCache.value;
}

/**
 * רענון יזום מה-webhook, כשהצטרף רכז חדש. עוקף את ה-CDN של המקור כדי
 * שהרכז שזה עתה נרשם ייספר. מחזיר null אם המקור לא זמין — במקרה כזה
 * הערך הישן נשאר על כנו ורשת הביטחון תתפוס אותו בהמשך.
 */
export async function refreshCommitteesCount(): Promise<number | null> {
    const coordinators = await fetchCoordinators(globalThis.fetch, { bypassCdn: true });
    if (!coordinators) return null;
    const value = countNeighborhoodsWithCoordinator(coordinators);
    countCache = { at: Date.now(), value };
    return value;
}
