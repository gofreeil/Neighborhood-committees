// ============================================================
// seo.ts — מקור אמת יחיד לזהות האתר ב-SEO
// שם המותג, הדומיין הקנוני ובוני הכתובות — כל <svelte:head>
// שצריך canonical / og עובר מכאן. (הובא עם סטודיו הפרסומות.)
// ============================================================

/** הדומיין הקנוני היחיד. כל canonical / og:url מצביעים לכאן. */
export const SITE_URL = 'https://neighborhoods.gofreeil.com';
export const SITE_NAME = 'ועדי שכונות';
export const SITE_TAGLINE = 'הפלטפורמה הארצית לפעילות ועדי השכונות בישראל';
/** שם התנועה-האם. מצורף לכל <title>, לתיאור ולסכימות — כדי שחיפוש
 *  "יוצאים לחירות ועדי שכונות" יגיע לכאן ולא לאתרים זרים בשם דומה. */
export const PARENT_BRAND = 'יוצאים לחירות';
export const PARENT_SITE = { name: PARENT_BRAND, url: 'https://gofreeil.com' } as const;
export const SITE_DESCRIPTION =
    'ועדי שכונות של תנועת יוצאים לחירות — הפלטפורמה הארצית לפעילות ועדי השכונות בישראל: שיתופי פעולה בין השכונות והערים, מעגלי שיח והצבעות, צוות מומחים ומאבקים משותפים למיצוי זכויות התושבים.';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/neighborhoods.png`;

/** בונה URL מוחלט קנוני מנתיב יחסי. */
export function canonical(path = '/'): string {
    if (!path.startsWith('/')) path = '/' + path;
    return path === '/' ? SITE_URL : SITE_URL + path;
}

/** סכמת WebSite (JSON-LD) — שמות חלופיים כוללים את התנועה-האם. */
export function websiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: SITE_NAME,
        alternateName: [
            'ועדי שכונות ארצי',
            'ועדי שכונות של יוצאים לחירות',
            'יוצאים לחירות ועדי שכונות',
            'gofreeil neighborhoods',
        ],
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        inLanguage: 'he-IL',
        publisher: { '@id': `${SITE_URL}/#organization` },
    };
}

/** סכמת Organization (JSON-LD) — האתר הוא חלק מרשת "יוצאים לחירות". */
export function organizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        alternateName: ['ועדי שכונות של יוצאים לחירות', 'ועדי שכונות ארצי — יוצאים לחירות'],
        url: SITE_URL,
        logo: { '@type': 'ImageObject', url: DEFAULT_OG_IMAGE },
        image: DEFAULT_OG_IMAGE,
        description: SITE_DESCRIPTION,
        parentOrganization: { '@type': 'Organization', name: PARENT_SITE.name, url: PARENT_SITE.url },
    };
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
