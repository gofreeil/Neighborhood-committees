import type { PageServerLoad } from './$types';
import { fetchCoordinators } from '$lib/server/community';

export type { CoordinatorRow } from '$lib/server/community';

export const load: PageServerLoad = async ({ fetch }) => {
    const coordinators = (await fetchCoordinators(fetch)) ?? [];
    return { coordinators };
};
