import { redirect, fail } from '@sveltejs/kit';
import { createDiscussion, getUserById } from '$lib/server/db';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async (event) => {
    const session = await event.locals.auth();
    if (!session?.user) {
        throw redirect(302, '/login?redirect=/discussions/new');
    }

    let name = session.user.name ?? '';
    let neighborhood = (session.user as { neighborhood?: string }).neighborhood ?? '';
    try {
        const profile = await getUserById(session.user.id as string);
        if (profile) {
            name = profile.name || name;
            neighborhood = profile.neighborhood || neighborhood;
        }
    } catch { /* use session defaults */ }

    const author = neighborhood ? `${name} · ${neighborhood}` : name;
    return { author };
};

export const actions: Actions = {
    default: async (event) => {
        const session = await event.locals.auth();
        if (!session?.user) {
            return fail(401, { error: 'יש להתחבר כדי לפתוח דיון.', title: '' });
        }

        const fd = await event.request.formData();
        const title  = (fd.get('title')  as string ?? '').trim();
        const author = (fd.get('author') as string ?? '').trim() || 'תושב/ה';

        if (title.length < 8) {
            return fail(400, { error: 'כותרת הדיון קצרה מדי (לפחות 8 תווים).', title });
        }

        try {
            await createDiscussion(title, author, session.user.id as string);
        } catch (e) {
            console.error('[discussions/new] createDiscussion failed:', e);
            return fail(500, { error: 'פתיחת הדיון נכשלה. נסו שוב.', title });
        }

        throw redirect(303, '/discussions');
    },
};
