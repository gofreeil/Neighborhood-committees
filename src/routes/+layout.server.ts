import type { LayoutServerLoad } from './$types';
import { OWNER_EMAIL } from '$lib/server/adsAdmin';

export const load: LayoutServerLoad = async (event) => {
    let userEmail: string | null = null;
    let userName: string | null = null;
    let isAdmin = false;
    let superAdmin = false;
    try {
        const session = await event.locals.auth();
        userEmail = session?.user?.email ?? null;
        userName = session?.user?.name ?? null;

        // התפקיד כבר יושב בסשן: db.ts ממפה app_role -> role, וה-jwt callback
        // מעביר אותו לטוקן. לכן דגלי הניהול כאן לא עולים קריאה נוספת ל-Strapi
        // בכל טעינת דף. הם תצוגתיים בלבד — כל מסך ניהול נשען על getAdminContext.
        const role = session?.user?.role ?? 'user';
        superAdmin = role === 'super_admin' || (userEmail ?? '').trim().toLowerCase() === OWNER_EMAIL;
        isAdmin = superAdmin || role === 'nc_admin';
    } catch { /* ignore */ }
    return { userEmail, userName, isAdmin, superAdmin };
};
