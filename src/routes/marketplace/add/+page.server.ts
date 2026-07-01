import { redirect, fail } from '@sveltejs/kit';
import { createItem, getUserById, MARKETPLACE_CATEGORY } from '$lib/server/db';
import type { PageServerLoad, Actions } from './$types';

const CATEGORY_EMOJI: Record<string, string> = {
    'רהיטים': '🛋️',
    'מוצרי חשמל': '📺',
    'ילדים וצעצועים': '🧸',
    'כלי בית': '🍽️',
    'ספרים': '📚',
    'ספורט': '🚲',
    'גינה': '🌱',
    'שונות': '📦',
};

export const load: PageServerLoad = async (event) => {
    const session = await event.locals.auth();
    if (!session?.user) {
        throw redirect(302, '/login?redirect=/marketplace/add');
    }

    // ברירות מחדל מהפרופיל
    let neighborhood = (session.user as { neighborhood?: string }).neighborhood ?? '';
    let city = '';
    let name = session.user.name ?? '';
    try {
        const profile = await getUserById(session.user.id as string);
        if (profile) {
            neighborhood = profile.neighborhood || neighborhood;
            city = profile.city || '';
            name = profile.name || name;
        }
    } catch { /* ignore - use session defaults */ }

    return { neighborhood, city, name };
};

export const actions: Actions = {
    default: async (event) => {
        const session = await event.locals.auth();
        if (!session?.user) {
            return fail(401, { error: 'יש להתחבר כדי לפרסם מוצר.', values: { title: '', priceRaw: '', description: '', phone: '' } });
        }

        const fd = await event.request.formData();
        const title    = (fd.get('title')    as string ?? '').trim();
        const priceRaw = (fd.get('price')     as string ?? '').trim();
        const productCategory = (fd.get('product_category') as string ?? 'שונות').trim();
        const description = (fd.get('description') as string ?? '').trim();
        const phone    = (fd.get('phone')     as string ?? '').trim();
        const sellerName = (fd.get('seller_name') as string ?? '').trim();
        const neighborhood = (fd.get('neighborhood') as string ?? '').trim();
        const city     = (fd.get('city')      as string ?? '').trim();

        const isFree = fd.get('is_free') === 'on';
        const price = isFree ? 0 : Number(priceRaw.replace(/[^\d.]/g, ''));

        if (!title) return fail(400, { error: 'יש למלא שם מוצר.', values: { title, priceRaw, description, phone } });
        if (!isFree && (!priceRaw || Number.isNaN(price) || price < 0)) {
            return fail(400, { error: 'יש למלא מחיר תקין, או לסמן "מסירה חינם".', values: { title, priceRaw, description, phone } });
        }
        if (!phone) return fail(400, { error: 'יש למלא פרטי קשר (טלפון).', values: { title, priceRaw, description, phone } });

        try {
            await createItem({
                category:     MARKETPLACE_CATEGORY,
                label:        title,
                description,
                contact:      sellerName,
                phone,
                neighborhood,
                city,
                icon:         isFree ? '🎁' : (CATEGORY_EMOJI[productCategory] ?? '🛍️'),
                color:        'emerald',
                user_id:      session.user.id as string,
                extra_fields: {
                    price,
                    is_free: isFree,
                    product_category: productCategory,
                    seller_name: sellerName,
                },
            });
        } catch (e) {
            console.error('[marketplace/add] createItem failed:', e);
            return fail(500, { error: 'הפרסום נכשל. נסו שוב בעוד רגע.', values: { title, priceRaw, description, phone } });
        }

        throw redirect(303, '/marketplace');
    },
};
