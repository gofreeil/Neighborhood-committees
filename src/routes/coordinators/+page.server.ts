import type { PageServerLoad } from './$types';

export interface CoordinatorRow {
    id: string;
    name: string;
    phone: string;
    avatar_url: string | null;
    city: string;
    neighborhoods: string[];
    residentsCount: number;
    itemsOnMap: number;
}

// המקור: אתר "קהילה בשכונה" - שם מוגדרים הרכזים ונרשמים התושבים
const COORDINATORS_API = 'https://community.gofreeil.com/api/coordinators';

export const load: PageServerLoad = async ({ fetch }) => {
    let coordinators: CoordinatorRow[] = [];
    try {
        const res = await fetch(COORDINATORS_API);
        if (res.ok) {
            const data = await res.json();
            coordinators = data.coordinators ?? [];
        } else {
            console.warn('[coordinators] API status', res.status);
        }
    } catch (e) {
        console.warn('[coordinators] fetch failed:', e);
    }

    return { coordinators };
};
