import { getUserEngagements, getEngagementCounts } from '$lib/server/db';
import { getLetters, canManageLetters, type Letter } from '$lib/server/letters';
import type { PageServerLoad } from './$types';

// רשימת המכתבים המשותפים: פתוחים לכולם לקריאה ולשליחה; פתיחת מכתב חדש
// רק לרכזים/אדמינים (canManage). מונה השולחים = רשומות מעורבות 'letter'.
export const load: PageServerLoad = async (event) => {
    const session = await event.locals.auth();
    const userId = session?.user?.id ?? '';

    let letters: Letter[] = [];
    let counts: Record<string, number> = {};
    let mySent: string[] = [];
    let canManage = false;

    try {
        const [list, countsMap, mine, manage] = await Promise.all([
            getLetters(),
            getEngagementCounts('letter'),
            userId ? getUserEngagements(userId, 'letter') : Promise.resolve([]),
            canManageLetters(session),
        ]);
        letters = list;
        counts = Object.fromEntries(Object.entries(countsMap).map(([k, v]) => [k, v.total]));
        mySent = mine.map((e) => e.target);
        canManage = manage;
    } catch (e) {
        console.warn('[letters] load failed:', e);
    }

    return {
        letters,
        counts,
        mySent,
        canManage,
        loggedIn: !!session?.user,
        userName: session?.user?.name ?? '',
    };
};
