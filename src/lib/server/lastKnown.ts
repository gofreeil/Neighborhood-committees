// ============================================================
// lastKnown.ts — "הערך האחרון שהוצג" לכל נתון חי, שמור ב-Strapi
// ------------------------------------------------------------
// הקאש בזיכרון של פונקציית Vercel נמחק בכל הפעלה קרה, ולכן כשהמקור
// החיצוני נופל דף הבית היה מציג "—". כאן כל נתון חי נשמר גם ב-Strapi
// (פריט פנימי אחד לכל מפתח, קטגוריה __nc_last_known באוסף ה-items
// המשותף — אותו דפוס כמו adStats), כך שאפשר להגיש אותו מכל מופע.
//
//   getLastKnown('committees_count') → { value, at } | null
//   setLastKnown('committees_count', 82)
//
// הכתיבה נעשית רק כשהערך באמת השתנה (השוואת JSON), ולעולם לא זורקת:
// כישלון שמירה לא אמור להפיל דף שהצליח למשוך נתון חי.
// ============================================================

import { strapiGet, strapiPost, strapiPut, StrapiContentTypeError } from './strapiClient.js';

const CATEGORY = '__nc_last_known';
/** כמה זמן סומכים על עותק הזיכרון לפני שקוראים שוב ל-Strapi (ל-null בלבד) */
const MISS_TTL_MS = 60_000;

export interface LastKnown<T> {
    value: T;
    /** מתי הנתון נמשך בהצלחה מהמקור (ISO) */
    at: string;
}

interface StrapiItem {
    documentId: string;
    label: string;
    extra_fields: Record<string, unknown> | null;
}

interface Entry {
    id: string | null;
    record: LastKnown<unknown> | null;
    /** JSON של הערך השמור — כדי לא לכתוב שוב אותו דבר */
    json: string | null;
    loadedAt: number;
}

const memory = new Map<string, Entry>();
const loading = new Map<string, Promise<Entry>>();

function label(key: string): string {
    return `neighborhoods-last-known:${key}`;
}

async function loadEntry(key: string): Promise<Entry> {
    const cached = memory.get(key);
    if (cached && (cached.record || Date.now() - cached.loadedAt < MISS_TTL_MS)) return cached;
    const pending = loading.get(key);
    if (pending) return pending;

    const p = (async (): Promise<Entry> => {
        let entry: Entry = { id: null, record: null, json: null, loadedAt: Date.now() };
        try {
            const res = await strapiGet<{ data: StrapiItem[] }>('/api/items', {
                'filters[category][$eq]': CATEGORY,
                'filters[label][$eq]': label(key),
                'pagination[limit]': '1',
            });
            const item = (res.data ?? [])[0];
            if (item) {
                const extra = (item.extra_fields ?? {}) as Record<string, unknown>;
                const rec = extra.last_known as Partial<LastKnown<unknown>> | undefined;
                const record =
                    rec && rec.value !== undefined && typeof rec.at === 'string'
                        ? { value: rec.value, at: rec.at }
                        : null;
                entry = {
                    id: item.documentId,
                    record,
                    json: record ? JSON.stringify(record.value) : null,
                    loadedAt: Date.now(),
                };
            }
        } catch (e) {
            if (!(e instanceof StrapiContentTypeError)) {
                console.error('[neighborhoods] lastKnown load failed:', key, e);
            }
        } finally {
            loading.delete(key);
        }
        memory.set(key, entry);
        return entry;
    })();
    loading.set(key, p);
    return p;
}

/** הערך האחרון שנשמר עבור המפתח, או null אם מעולם לא נשמר. לעולם לא זורק. */
export async function getLastKnown<T>(key: string): Promise<LastKnown<T> | null> {
    const entry = await loadEntry(key);
    return (entry.record as LastKnown<T> | null) ?? null;
}

/**
 * שומר ערך חדש (בזיכרון מיד, ב-Strapi ברקע). מדלג על הכתיבה אם הערך
 * זהה לשמור. מחזיר Promise שמסתיים אחרי הכתיבה — אפשר גם לא להמתין לו.
 */
export async function setLastKnown<T>(key: string, value: T, at: string = new Date().toISOString()): Promise<void> {
    const json = JSON.stringify(value);
    const entry = await loadEntry(key);
    const changed = entry.json !== json;
    entry.record = { value, at };
    entry.json = json;
    entry.loadedAt = Date.now();
    memory.set(key, entry);
    if (!changed && entry.id) return;

    const extra_fields = { last_known: { value, at } };
    try {
        if (entry.id) {
            await strapiPut(`/api/items/${entry.id}`, { data: { extra_fields } });
        } else {
            const res = await strapiPost<{ data: StrapiItem }>('/api/items', {
                data: {
                    label: label(key),
                    category: CATEGORY,
                    description: `[SYSTEM] הנתון האחרון שהוצג — ${key} — ועדי שכונות`,
                    icon: '🧷',
                    extra_fields,
                    status1: 'active',
                    publishedAt: new Date().toISOString(),
                },
            });
            entry.id = res.data?.documentId ?? null;
        }
    } catch (e) {
        if (!(e instanceof StrapiContentTypeError)) {
            console.error('[neighborhoods] lastKnown save failed:', key, e);
        }
    }
}
