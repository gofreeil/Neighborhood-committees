import { getUserEngagements, getEngagementCounts } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
    const session = await event.locals.auth();

    let myRsvps: string[] = [];
    let counts: Record<string, number> = {};

    try {
        const [countsMap, mine] = await Promise.all([
            getEngagementCounts('rsvp'),
            session?.user ? getUserEngagements(session.user.id as string, 'rsvp') : Promise.resolve([]),
        ]);
        counts = Object.fromEntries(Object.entries(countsMap).map(([k, v]) => [k, v.total]));
        myRsvps = mine.map(e => e.target);
    } catch (e) {
        console.warn('[sync] load engagement failed:', e);
    }

    return { myRsvps, counts };
};
