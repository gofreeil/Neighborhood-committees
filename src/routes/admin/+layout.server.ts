import type { LayoutServerLoad } from './$types';
import { getAdminContext } from '$lib/server/adsAdmin';

// שער אחד לכל מסכי /admin. כל +page.server.ts מתחתיו שומר על השער שלו
// (הגנה בשכבות) — כאן זה גם מה שמזין את סרגל הניווט בתפקיד הנוכחי.
export const load: LayoutServerLoad = async ({ locals, url }) => {
    const ctx = await getAdminContext(locals, url.pathname + url.search);
    return {
        isAdmin: true,
        superAdmin: ctx.superAdmin,
        adminName: ctx.user.name || ctx.user.email,
    };
};
