import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { refreshHomeCounts } from '$lib/server/community';

// ============================================================
// webhook הסנכרון של מוני דף הבית ("ועדי שכונות" ו"תושבים פעילים").
// אתר "קהילה בשכונה" קורא לכאן כשמצטרף רכז חדש, והכרטיסים בדף הבית
// מתעדכנים מיד במקום לחכות לרענון התקופתי.
//
//   POST https://neighborhoods.gofreeil.com/api/coordinators/sync
//   x-sync-secret: <COORDINATORS_SYNC_SECRET>
//
// הסוד לא נמצא בקוד המקור (המאגר ציבורי!) אלא במשתנה הסביבה
// COORDINATORS_SYNC_SECRET, שצריך להיות זהה בשני האתרים. בלעדיו
// הנתיב מושבת לגמרי ולא ניתן להפעיל ממנו קריאות למקור.
// ============================================================

/** השוואה בזמן קבוע, כדי שלא ניתן יהיה לגלות את הסוד תו-תו לפי זמן התגובה. */
function safeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return diff === 0;
}

export const POST: RequestHandler = async ({ request }) => {
    const expected = (env.COORDINATORS_SYNC_SECRET ?? '').trim();
    if (!expected) return json({ ok: false, error: 'sync_disabled' }, { status: 503 });

    const header = request.headers.get('x-sync-secret')
        ?? request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
        ?? '';
    if (!safeEqual(header.trim(), expected)) return json({ ok: false }, { status: 401 });

    const counts = await refreshHomeCounts();
    if (!counts) return json({ ok: false, error: 'source_unavailable' }, { status: 502 });
    return json({ ok: true, ...counts });
};
