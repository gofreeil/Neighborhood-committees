import type { PageServerLoad } from './$types';
import { loadCoordinators } from '$lib/server/community';

export type { CoordinatorRow } from '$lib/server/community';

export const load: PageServerLoad = async ({ fetch }) => {
    // כשהמקור לא בקשר מגיעה הרשימה האחרונה שנשמרה, ו-stale מסמן להציג אזהרה
    const result = await loadCoordinators(fetch);
    return { coordinators: result.value ?? [], stale: result.stale, staleAt: result.at };
};
