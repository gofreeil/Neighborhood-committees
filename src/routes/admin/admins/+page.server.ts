import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getAdminContext, OWNER_EMAIL } from '$lib/server/adsAdmin';
import {
    ASSIGNABLE,
    requireSuperAdmin,
    hasAdminToken,
    listAdminUsers,
    searchUsersDeep,
    getUserSlim,
    setAppRole,
} from '$lib/server/adminUsers';

// מסך מינוי האדמינים — לסופר-אדמין בלבד. כל הפעולות עוברות דרך
// adminUsers.ts, שקובע app_role על הרשומה המשותפת ב-Strapi.

const ROLE_LABEL: Record<string, string> = {
    super_admin: 'מונה לסופר-אדמין',
    nc_admin:    'מונה לאדמין ועדי שכונות',
    user:        'הוסר מתפקיד ניהולי',
};

function isAssignable(v: string): boolean {
    return (ASSIGNABLE as readonly string[]).includes(v);
}

export const load: PageServerLoad = async ({ locals, url }) => {
    const { user, role } = await getAdminContext(locals, '/admin/admins');
    requireSuperAdmin(role);

    // בלי טוקן שרת הרשימה תחזור ריקה ותיראה כאילו אין אדמינים — עדיף הסבר
    if (!hasAdminToken()) {
        return { user, admins: [], results: [], q: '', tokenMissing: true };
    }

    const q = (url.searchParams.get('q') ?? '').trim();
    const [admins, results] = await Promise.all([
        listAdminUsers().catch(() => []),
        q.length >= 2 ? searchUsersDeep(q).catch(() => []) : Promise.resolve([]),
    ]);

    return { user, admins, results, q, tokenMissing: false };
};

export const actions: Actions = {
    setRole: async ({ request, locals }) => {
        const { user, role } = await getAdminContext(locals, '/admin/admins');
        requireSuperAdmin(role);
        if (!hasAdminToken()) return fail(503, { error: 'STRAPI_TOKEN אינו מוגדר בשרת' });

        const fd = await request.formData();
        const userId = Number(fd.get('userId') ?? 0);
        const newRole = String(fd.get('role') ?? '');
        if (!userId || !isAssignable(newRole)) return fail(400, { error: 'בקשה לא תקינה' });

        const target = await getUserSlim(userId);
        if (!target) return fail(404, { error: 'המשתמש לא נמצא' });

        // הגנות: לא משנים את עצמך (נעילה-עצמית בטעות) ולא את בעל האתר.
        // שתי ההשוואות מותנות בערך לא-ריק — אחרת שני שדות ריקים היו נחשבים
        // "אותו אדם" וחוסמים שינוי תפקיד למשתמש בלי אימייל או בלי external_id.
        const myEmail = user.email.trim().toLowerCase();
        const targetEmail = target.email.trim().toLowerCase();
        if (target.externalId && target.externalId === user.id) {
            return fail(400, { error: 'אי אפשר לשנות את התפקיד של עצמך' });
        }
        if (myEmail && targetEmail === myEmail) {
            return fail(400, { error: 'אי אפשר לשנות את התפקיד של עצמך' });
        }
        if (targetEmail === OWNER_EMAIL) {
            return fail(400, { error: 'אי אפשר לשנות את בעל האתר' });
        }
        // app_role הוא שדה אחד לכל הרשת — מינוי כאן היה דורס תפקיד של אתר אחר
        if (!isAssignable(target.app_role)) {
            return fail(400, {
                error: `למשתמש יש תפקיד באתר אחר (${target.app_role}) — יש לנהל אותו מהאתר שלו`,
            });
        }

        try {
            await setAppRole(userId, newRole);
        } catch (e) {
            return fail(502, {
                error: 'עדכון התפקיד נכשל: ' + (e instanceof Error ? e.message.slice(0, 160) : ''),
            });
        }
        return { success: true, message: `${target.name || target.email} — ${ROLE_LABEL[newRole]}` };
    },
};
