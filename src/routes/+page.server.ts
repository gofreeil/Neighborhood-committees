import type { PageServerLoad } from './$types';
import { getHomeCounts } from '$lib/server/community';

export const load: PageServerLoad = async ({ fetch }) => {
    // "ועדי שכונות" בסרגל הנתונים = מספר הרכזים ב"קהילה בשכונה" (כמו בכותרת עמוד הרכזים),
    // "תושבים פעילים" = כל מי שרשום שם. שניהם מגיעים מקריאה אחת למקור.
    // אין כאן cache-control ציבורי כי ה-layout מחזיר נתוני משתמש מחובר;
    // ההגנה על ה-API החיצוני היא הקאש בזיכרון שב-getHomeCounts.
    // כשהמקור לא בקשר מגיע הערך האחרון שנשמר עם stale=true (ראו LiveValue).
    const counts = await getHomeCounts(fetch);
    return { committeesCount: counts.committees, residentsCount: counts.residents };
};
