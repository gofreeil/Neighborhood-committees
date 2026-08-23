import type { PageServerLoad } from './$types';
import { getCommitteesCount } from '$lib/server/community';

export const load: PageServerLoad = async ({ fetch }) => {
    // "ועדי שכונות" בסרגל הנתונים = שכונות שיש להן רכז ב"קהילה בשכונה".
    // אין כאן cache-control ציבורי כי ה-layout מחזיר נתוני משתמש מחובר;
    // ההגנה על ה-API החיצוני היא הקאש בזיכרון שב-getCommitteesCount.
    return { committeesCount: await getCommitteesCount(fetch) };
};
