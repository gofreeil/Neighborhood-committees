import type { PageServerLoad } from './$types';
import { getAdminContext } from '$lib/server/adsAdmin';
import { listAllForAdmin } from '$lib/server/adsStore';
import { getAllPendingEvents } from '$lib/server/db';

// לוח הכניסה של פאנל הניהול — עד עכשיו היה כאן redirect ל-/admin/ads, כי
// מסך הפרסומות היה המסך היחיד. האריחים עצמם נבנים מ-adminNav.ts, כדי שלא
// תהיה רשימת מסכים שנייה לצד סרגל הניווט ותפריט הפרופיל.
// השער נשמר גם כאן ולא רק ב-+layout.server.ts — הגנה בשכבות.
export const load: PageServerLoad = async ({ locals }) => {
    await getAdminContext(locals, '/admin');

    // המונים של "ממתינים לטיפול" — הבועה האדומה שעל האריח
    const [ads, events] = await Promise.all([
        listAllForAdmin().catch(() => []),
        getAllPendingEvents().catch(() => []),
    ]);

    return {
        pending: {
            '/admin/ads': ads.filter((a) => a.status === 'pending').length,
            '/admin/content': events.length,
        } as Record<string, number>,
    };
};
