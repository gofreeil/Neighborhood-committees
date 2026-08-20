import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getAdminContext } from '$lib/server/adsAdmin';
import {
    getAllItems,
    getDiscussions,
    getAllPendingEvents,
    adminDeleteItem,
    updateEventStatus,
    deleteEvent,
    DISCUSSION_CATEGORY,
    ENGAGEMENT_CATEGORY,
    type DbItem,
} from '$lib/server/db';

// מסך ניהול התוכן — פתוח לכל אדמין (לא רק סופר-אדמין), באותו דגם של
// מסך הפרסומות: מה שהתושבים העלו, במקום אחד, עם אישור/הסרה.
//
// שלושה סוגים: אירועים שממתינים לאישור רכז, נקודות איסוף (items), ודיונים.
// דיונים ונקודות איסוף חיים באותה טבלת items ונבדלים ב-category, ולכן
// שניהם נשלפים בקריאה אחת ומופרדים כאן.

/** קטגוריות פנימיות שאינן "תוכן" — רשומות מעורבות (לייקים/הצבעות) */
const HIDDEN_CATEGORIES = new Set<string>([DISCUSSION_CATEGORY, ENGAGEMENT_CATEGORY]);

function slimItem(it: DbItem) {
    return {
        id:           it.id,
        category:     it.category,
        label:        it.label,
        description:  it.description,
        neighborhood: it.neighborhood,
        city:         it.city,
        status:       it.status,
        icon:         it.icon,
        createdAt:    it.created_at,
        views:        it.view_count,
    };
}

export const load: PageServerLoad = async ({ locals }) => {
    const { user } = await getAdminContext(locals, '/admin/content');

    const [items, discussions, events] = await Promise.all([
        getAllItems().catch((): DbItem[] => []),
        getDiscussions().catch(() => []),
        getAllPendingEvents().catch(() => []),
    ]);

    const points = items
        .filter((it) => !HIDDEN_CATEGORIES.has(it.category) && it.status !== 'deleted')
        .sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''))
        .slice(0, 200)
        .map(slimItem);

    return {
        user,
        events,
        points,
        discussions: discussions.slice(0, 200),
        counts: {
            events: events.length,
            points: points.length,
            discussions: discussions.length,
        },
    };
};

export const actions: Actions = {
    /** אישור או דחייה של אירוע שהתושב הגיש */
    setEventStatus: async ({ request, locals }) => {
        await getAdminContext(locals, '/admin/content');
        const fd = await request.formData();
        const id = String(fd.get('id') ?? '');
        const status = String(fd.get('status') ?? '');
        if (!id || (status !== 'approved' && status !== 'rejected')) {
            return fail(400, { error: 'בקשה לא תקינה' });
        }
        try {
            await updateEventStatus(id, status);
        } catch (e) {
            return fail(502, { error: 'העדכון נכשל: ' + (e instanceof Error ? e.message.slice(0, 160) : '') });
        }
        return { success: true, message: status === 'approved' ? 'האירוע אושר' : 'האירוע נדחה' };
    },

    deleteEvent: async ({ request, locals }) => {
        await getAdminContext(locals, '/admin/content');
        const fd = await request.formData();
        const id = String(fd.get('id') ?? '');
        if (!id) return fail(400, { error: 'בקשה לא תקינה' });
        try {
            await deleteEvent(id);
        } catch (e) {
            return fail(502, { error: 'המחיקה נכשלה: ' + (e instanceof Error ? e.message.slice(0, 160) : '') });
        }
        return { success: true, message: 'האירוע נמחק' };
    },

    /** הסרת פריט (נקודת איסוף או דיון) — סימון deleted, לא מחיקה קשה */
    removeItem: async ({ request, locals }) => {
        const { user } = await getAdminContext(locals, '/admin/content');
        const fd = await request.formData();
        const id = String(fd.get('id') ?? '');
        if (!id) return fail(400, { error: 'בקשה לא תקינה' });
        try {
            await adminDeleteItem(id, user.email || user.id);
        } catch (e) {
            return fail(502, { error: 'ההסרה נכשלה: ' + (e instanceof Error ? e.message.slice(0, 160) : '') });
        }
        return { success: true, message: 'הפריט הוסר' };
    },
};
