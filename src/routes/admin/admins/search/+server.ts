// ============================================================
// חיפוש חי בין המשתמשים הרשומים (לסופר-אדמין) — מסך מינוי האדמינים.
// מחפש ברשימת המשתמשים המאוחדת של ה-Strapi המשותף בשני שלבים
// (שאילתת $containsi ואז סריקה מקומית של כל שדות הטקסט) — ראו
// searchUsersDeep ב-adminUsers.ts. מחזיר צורות SlimUser רזות בלבד.
// ============================================================

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAdminContext } from '$lib/server/adsAdmin';
import { requireSuperAdmin, hasAdminToken, searchUsersDeep } from '$lib/server/adminUsers';

export const GET: RequestHandler = async ({ locals, url }) => {
    const { role } = await getAdminContext(locals, '/admin/admins');
    requireSuperAdmin(role);

    const q = (url.searchParams.get('q') ?? '').trim();
    if (q.length < 2 || !hasAdminToken()) return json({ users: [] });

    try {
        return json({ users: await searchUsersDeep(q) });
    } catch (e) {
        console.error('[admin] user search failed:', e);
        return json({ users: [], error: 'החיפוש ברשימת המשתמשים נכשל — אפשר לנסות שוב' });
    }
};
