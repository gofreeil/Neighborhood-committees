import type { PageServerLoad } from './$types';
import { getCommitteesCount } from '$lib/server/community';

export const load: PageServerLoad = async ({ fetch }) => {
    // "ועדי שכונות" בסרגל הנתונים = מספר הרכזים ב"קהילה בשכונה" (כמו בכותרת עמוד הרכזים).
    // אין כאן cache-control ציבורי כי ה-layout מחזיר נתוני משתמש מחובר;
    // ההגנה על ה-API החיצוני היא הקאש בזיכרון שב-getCommitteesCount.
    // כשהמקור לא בקשר מגיע הערך האחרון שנשמר עם stale=true (ראו LiveValue).
    return { committeesCount: await getCommitteesCount(fetch) };
};
