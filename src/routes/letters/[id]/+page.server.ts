import { error, fail, redirect } from '@sveltejs/kit';
import { getUserEngagements, getEngagementCounts } from '$lib/server/db';
import { getLetter, canManageLetters, updateLetter, setLetterStatus, parseLetterForm } from '$lib/server/letters';
import type { PageServerLoad, Actions, RequestEvent } from './$types';

// דף מכתב בודד: קריאה ושליחה לכולם; עריכה / סגירה / מחיקה לרכזים ואדמינים.
export const load: PageServerLoad = async (event) => {
    const id = event.params.id;
    const letter = await getLetter(id).catch(() => undefined);
    if (!letter) throw error(404, 'המכתב לא נמצא או הוסר.');

    const session = await event.locals.auth();
    const userId = session?.user?.id ?? '';

    let sentCount = 0;
    let mySent = false;
    let canManage = false;
    try {
        const [countsMap, mine, manage] = await Promise.all([
            getEngagementCounts('letter'),
            userId ? getUserEngagements(userId, 'letter') : Promise.resolve([]),
            canManageLetters(session),
        ]);
        sentCount = countsMap[id]?.total ?? 0;
        mySent = mine.some((e) => e.target === id);
        canManage = manage;
    } catch (e) {
        console.warn('[letters/id] load failed:', e);
    }

    return {
        letter,
        sentCount,
        mySent,
        canManage,
        loggedIn: !!session?.user,
        userName: session?.user?.name ?? '',
    };
};

/** שער משותף לכל פעולות הניהול על מכתב */
async function guard(event: RequestEvent) {
    const session = await event.locals.auth();
    if (!session?.user) throw redirect(302, `/login?redirect=/letters/${event.params.id}`);
    if (!(await canManageLetters(session))) throw error(403, 'אין לך הרשאה לערוך מכתב זה.');
    const letter = await getLetter(event.params.id).catch(() => undefined);
    if (!letter) throw error(404, 'המכתב לא נמצא.');
    return letter;
}

export const actions: Actions = {
    update: async (event) => {
        await guard(event);
        const parsed = parseLetterForm(await event.request.formData());
        if ('error' in parsed) return fail(400, { error: parsed.error, values: parsed.values });
        try {
            await updateLetter(event.params.id, parsed.input);
        } catch (e) {
            console.error('[letters/id] update failed:', e);
            return fail(500, { error: 'השמירה נכשלה. נסו שוב.', values: parsed.values });
        }
        return { success: true, message: 'המכתב עודכן' };
    },

    setStatus: async (event) => {
        await guard(event);
        const status = String((await event.request.formData()).get('status') ?? '');
        if (status !== 'active' && status !== 'closed') return fail(400, { error: 'בקשה לא תקינה' });
        try {
            await setLetterStatus(event.params.id, status);
        } catch (e) {
            console.error('[letters/id] setStatus failed:', e);
            return fail(500, { error: 'העדכון נכשל. נסו שוב.' });
        }
        return { success: true, message: status === 'closed' ? 'המכתב נסגר לשליחה' : 'המכתב נפתח מחדש' };
    },

    remove: async (event) => {
        await guard(event);
        try {
            await setLetterStatus(event.params.id, 'deleted');
        } catch (e) {
            console.error('[letters/id] remove failed:', e);
            return fail(500, { error: 'המחיקה נכשלה. נסו שוב.' });
        }
        throw redirect(303, '/letters');
    },
};
