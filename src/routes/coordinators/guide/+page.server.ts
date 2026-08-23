import { redirect, error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getUserById, getUserByEmail, getItemsByCategory, createItem, updateItem, type DbUser } from '$lib/server/db';
import { resolveRole } from '$lib/server/adsAdmin';
import { DEFAULT_GUIDE, mergeGuide, type GuideContent } from './defaults';

// רשומת התוכן של המדריך ב-Strapi המשותף: קטגוריה בקידומת '__' = רשומת
// תשתית של הרשת, לא תוכן - לא מוצגת במסכי התוכן ולא נספרת במונים
const GUIDE_CATEGORY = '__site_content';
const GUIDE_LABEL    = 'coordinator_guide';

/** התוכן השמור מ-Strapi ממוזג מעל ברירות המחדל; כל כשל → ברירות המחדל */
async function loadStoredGuide(): Promise<GuideContent> {
    try {
        const rows = await getItemsByCategory(GUIDE_CATEGORY);
        const row = rows.find((r) => r.label === GUIDE_LABEL);
        if (!row?.extra_fields) return DEFAULT_GUIDE;
        return mergeGuide(DEFAULT_GUIDE, JSON.parse(row.extra_fields));
    } catch {
        return DEFAULT_GUIDE;
    }
}

/** רשומת המשתמש המשותפת - לפי מזהה, ובנפילה-אחורה לפי אימייל (חשבון ממוזג) */
async function loadDbUser(sessionUser: { id?: string; email?: string | null }): Promise<DbUser | undefined> {
    let user: DbUser | undefined;
    try { if (sessionUser.id) user = await getUserById(sessionUser.id); } catch { /* ignore */ }
    if (!user && sessionUser.email) {
        try { user = await getUserByEmail(sessionUser.email); } catch { /* ignore */ }
    }
    return user;
}

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.auth();
    if (!session?.user) throw redirect(302, '/login?redirect=' + encodeURIComponent('/coordinators/guide'));

    // שתי הבדיקות במקביל: תפקיד ניהול באתר (סופר-אדמין / nc_admin) ורשומת
    // המשתמש המשותפת - שם יושבים coordinator_of ותפקיד רכז השכונה
    const [adminRole, user] = await Promise.all([
        resolveRole(session).catch(() => null),
        loadDbUser(session.user),
    ]);

    const isCoordinator =
        ((user?.coordinator_of?.length ?? 0) > 0) || user?.role === 'neighborhood_admin';
    if (!adminRole && !isCoordinator) {
        throw error(403, 'המדריך זמין רק לרכזי שכונות');
    }

    return {
        guide:   await loadStoredGuide(),
        isSuper: adminRole === 'super_admin',
    };
};

export const actions: Actions = {
    // שמירת תוכן המדריך שנערך מהאתר (גלגל השיניים) - סופר-אדמין בלבד.
    // הרשומה נוצרת בפעם הראשונה ומעודכנת מאז; כולם רואים את הגרסה השמורה.
    saveGuide: async ({ request, locals }) => {
        const session = await locals.auth();
        if (!session?.user) return fail(401, { error: 'נדרשת התחברות' });
        const role = await resolveRole(session).catch(() => null);
        if (role !== 'super_admin') return fail(403, { error: 'עריכת המדריך שמורה לסופר-אדמין' });

        const raw = (await request.formData()).get('content')?.toString() ?? '';
        if (!raw || raw.length > 300_000) return fail(400, { error: 'תוכן לא תקין' });
        let parsed: unknown;
        try { parsed = JSON.parse(raw); } catch { return fail(400, { error: 'תוכן לא תקין' }); }
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
            return fail(400, { error: 'תוכן לא תקין' });
        }
        // מיזוג מעל ברירות המחדל גם בשמירה - מהדק את המבנה לצורת המדריך בלבד
        const content = mergeGuide(DEFAULT_GUIDE, parsed);

        try {
            const rows = await getItemsByCategory(GUIDE_CATEGORY);
            const row = rows.find((r) => r.label === GUIDE_LABEL);
            if (row) {
                await updateItem(row.id, { extra_fields: content });
            } else {
                await createItem({
                    category:     GUIDE_CATEGORY,
                    label:        GUIDE_LABEL,
                    description:  'תוכן מדריך הרכזים - נערך מדף המדריך באתר בלבד',
                    icon:         '📘',
                    color:        'amber',
                    user_id:      session.user.id ?? '',
                    extra_fields: content,
                });
            }
            return { saved: true };
        } catch (e) {
            console.warn('[coordinators/guide] save failed:', e);
            return fail(500, { error: 'השמירה נכשלה - נסה שוב' });
        }
    },
};
