// המקור: אתר "קהילה בשכונה" - שם מוגדרים הרכזים ונרשמים התושבים
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
export async function fetchCoordinators(fetch: Fetch): Promise<CoordinatorRow[] | null> {
    try {
        const res = await fetch(COORDINATORS_API);
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

// דף הבית נטען הרבה והמספר משתנה לאט, לכן הוא נשמר בזיכרון לזמן קצר.
// הקאש כאן ולא ב-fetchCoordinators כדי שכפתור הרענון במסך הרכזים ימשיך
// להביא נתונים טריים.
const COUNT_TTL_MS = 5 * 60 * 1000;
let countCache: { at: number; value: number } | null = null;

/** null = אין מספר להציג (הקריאה נכשלה ואין ערך קודם בקאש). */
export async function getCommitteesCount(fetch: Fetch): Promise<number | null> {
    if (countCache && Date.now() - countCache.at < COUNT_TTL_MS) return countCache.value;
    const coordinators = await fetchCoordinators(fetch);
    // כשה-API נופל עדיף להישאר על הערך האחרון שהיה מאשר לאפס את המונה
    if (!coordinators) return countCache?.value ?? null;
    const value = countNeighborhoodsWithCoordinator(coordinators);
    countCache = { at: Date.now(), value };
    return value;
}
