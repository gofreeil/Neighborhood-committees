import { getUserEngagements, getEngagementCounts, getDiscussions } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
    const session = await event.locals.auth();

    let userVotes: Record<string, string> = {};
    let voteCounts: Record<string, Record<string, number>> = {};
    let discussions: Array<{ id: string; title: string; author: string }> = [];

    try {
        const [countsMap, mine, realDiscussions] = await Promise.all([
            getEngagementCounts('vote'),
            session?.user ? getUserEngagements(session.user.id as string, 'vote') : Promise.resolve([]),
            getDiscussions(),
        ]);
        voteCounts = Object.fromEntries(Object.entries(countsMap).map(([k, v]) => [k, v.choices]));
        userVotes = Object.fromEntries(mine.map(e => [e.target, e.choice]));
        discussions = realDiscussions.map(d => ({ id: d.id, title: d.title, author: d.author }));
    } catch (e) {
        console.warn('[discussions] load failed:', e);
    }

    return { userVotes, voteCounts, discussions };
};
