import { getItemsByCategory, MARKETPLACE_CATEGORY } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
    const session = await event.locals.auth();

    let items: Array<{
        id: string;
        title: string;
        price: number;
        cat: string;
        seller: string;
        neighborhood: string;
        city: string;
        contact: string;
        emoji: string;
    }> = [];

    try {
        const raw = await getItemsByCategory(MARKETPLACE_CATEGORY);
        items = raw.map((it) => {
            let ef: Record<string, unknown> = {};
            try { ef = it.extra_fields ? JSON.parse(it.extra_fields) : {}; } catch { ef = {}; }
            const productCat = String(ef.product_category ?? 'שונות');
            return {
                id:           it.id,
                title:        it.label,
                price:        Number(ef.price ?? 0),
                cat:          productCat,
                seller:       String(ef.seller_name ?? '').trim(),
                neighborhood: it.neighborhood || '',
                city:         it.city || '',
                contact:      it.phone || it.contact || '',
                emoji:        it.icon || '🛍️',
            };
        });
    } catch (e) {
        console.warn('[marketplace] load failed:', e);
    }

    return {
        items,
        isLoggedIn: !!session?.user,
    };
};
