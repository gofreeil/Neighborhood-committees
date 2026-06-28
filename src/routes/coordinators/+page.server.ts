import type { PageServerLoad } from './$types';
import { getAllUsers } from '$lib/server/db';

export interface CoordinatorRow {
    id: string;
    name: string;
    phone: string;
    avatar_url: string | null;
    city: string;
    neighborhoods: string[];
    residentsCount: number;
}

export const load: PageServerLoad = async () => {
    let coordinators: CoordinatorRow[] = [];
    try {
        const users = await getAllUsers();

        // מפת ספירת תושבים רשומים לכל שכונה (חישוב חד-פעמי)
        const residentsByNeighborhood = new Map<string, number>();
        for (const u of users) {
            if (u.neighborhood) {
                residentsByNeighborhood.set(
                    u.neighborhood,
                    (residentsByNeighborhood.get(u.neighborhood) ?? 0) + 1,
                );
            }
        }

        coordinators = users
            .filter(u => (u.coordinator_of?.length ?? 0) > 0)
            .map(u => {
                const neighborhoods = u.coordinator_of ?? [];
                // סכום התושבים בכל השכונות שהרכז מנהל
                const residentsCount = neighborhoods.reduce(
                    (sum, n) => sum + (residentsByNeighborhood.get(n) ?? 0),
                    0,
                );
                return {
                    id:            u.id,
                    name:          u.name || u.nickname || 'רכז/ת',
                    phone:         u.phone ?? '',
                    avatar_url:    u.avatar_url ?? null,
                    city:          u.city ?? '',
                    neighborhoods,
                    residentsCount,
                };
            })
            .sort((a, b) => b.residentsCount - a.residentsCount);
    } catch (e) {
        console.warn('[coordinators] load failed:', e);
    }

    return { coordinators };
};
