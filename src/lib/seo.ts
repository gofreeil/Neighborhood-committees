// ============================================================
// seo.ts — מקור אמת יחיד לזהות האתר ב-SEO
// שם המותג, הדומיין הקנוני ובוני הכתובות — כל <svelte:head>
// שצריך canonical / og עובר מכאן. (הובא עם סטודיו הפרסומות.)
// ============================================================

/** הדומיין הקנוני היחיד. כל canonical / og:url מצביעים לכאן. */
export const SITE_URL = 'https://neighborhoods.gofreeil.com';
export const SITE_NAME = 'ועדי שכונות';
export const SITE_TAGLINE = 'הפלטפורמה הארצית לפעילות ועדי השכונות בישראל';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/neighborhoods.png`;

/** בונה URL מוחלט קנוני מנתיב יחסי. */
export function canonical(path = '/'): string {
    if (!path.startsWith('/')) path = '/' + path;
    return path === '/' ? SITE_URL : SITE_URL + path;
}

/** סכמת FAQPage (JSON-LD) — נבנית מאותו מקור אמת של השו"ת המוצג בדף. */
export function faqSchema(items: { q: string; a: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((i) => ({
            '@type': 'Question',
            name: i.q,
            acceptedAnswer: { '@type': 'Answer', text: i.a }
        }))
    };
}
