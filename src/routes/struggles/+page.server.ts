import { getUserEngagements, getEngagementCounts } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
    const session = await event.locals.auth();

    let myJoins: string[] = [];
    let counts: Record<string, number> = {};

    try {
        const [countsMap, mine] = await Promise.all([
            getEngagementCounts('join'),
            session?.user ? getUserEngagements(session.user.id as string, 'join') : Promise.resolve([]),
        ]);
        counts = Object.fromEntries(Object.entries(countsMap).map(([k, v]) => [k, v.total]));
        myJoins = mine.map(e => e.target);
    } catch (e) {
        console.warn('[struggles] load engagement failed:', e);
    }

    return { myJoins, counts };
};
