import { redirect, error, fail } from '@sveltejs/kit';
import { getUserById } from '$lib/server/db';
import { canManageLetters, createLetter, parseLetterForm } from '$lib/server/letters';
import type { PageServerLoad, Actions } from './$types';

const EMPTY = { title: '', subject: '', body: '', to: '', cc: '', source: '', deadline: '' };

// פתיחת מכתב חדש - רכזי שכונות ואדמינים בלבד
export const load: PageServerLoad = async (event) => {
    const session = await event.locals.auth();
    if (!session?.user) throw redirect(302, '/login?redirect=/letters/new');
    if (!(await canManageLetters(session))) {
        throw error(403, 'פתיחת מכתב משותף שמורה לרכזי השכונות. רוצים לפתוח מכתב? פנו לרכז/ת השכונה שלכם.');
    }
    return { values: EMPTY };
};

export const actions: Actions = {
    default: async (event) => {
        const session = await event.locals.auth();
        if (!session?.user) return fail(401, { error: 'יש להתחבר כדי לפתוח מכתב.', values: EMPTY });
        if (!(await canManageLetters(session))) return fail(403, { error: 'אין לך הרשאה לפתוח מכתב.', values: EMPTY });

        const parsed = parseLetterForm(await event.request.formData());
        if ('error' in parsed) return fail(400, { error: parsed.error, values: parsed.values });

        // שם הרכז ושכונתו - מהפרופיל המשותף, ובנפילה-אחורה מהסשן
        let name = session.user.name ?? '';
        let neighborhood = session.user.neighborhood ?? '';
        try {
            const profile = await getUserById(session.user.id);
            if (profile) {
                name = profile.name || name;
                neighborhood = profile.neighborhood || neighborhood;
            }
        } catch { /* use session defaults */ }

        let id = '';
        try {
            const letter = await createLetter(parsed.input, name || 'רכז/ת שכונה', neighborhood, session.user.id);
            id = letter.id;
        } catch (e) {
            console.error('[letters/new] createLetter failed:', e);
            return fail(500, { error: 'פתיחת המכתב נכשלה. נסו שוב בעוד רגע.', values: parsed.values });
        }

        throw redirect(303, `/letters/${id}`);
    },
};
