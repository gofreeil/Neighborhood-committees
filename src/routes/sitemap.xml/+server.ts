import type { RequestHandler } from './$types';
import { SITE_URL } from '$lib/seo';
import { cities } from '$lib/citiesData';
import { listApproved } from '$lib/server/adsStore';

// דפים ציבוריים קבועים - בלי ניהול, API, התחברות, דפים שדורשים סשן או נתיבי redirect
const STATIC_PAGES: Array<{ path: string; priority: number; changefreq: string }> = [
    { path: '/',                     priority: 1.0, changefreq: 'daily' },
    { path: '/struggles',            priority: 0.9, changefreq: 'daily' },   // מאבקים + הצלחות
    { path: '/discussions',          priority: 0.9, changefreq: 'daily' },   // דיונים והצבעות
    { path: '/letters',              priority: 0.9, changefreq: 'daily' },   // מכתב משותף
    { path: '/sync',                 priority: 0.8, changefreq: 'daily' },   // סנכרון / אירועים
    { path: '/marketplace',          priority: 0.8, changefreq: 'daily' },   // לוח יד שנייה
    { path: '/coordinators',         priority: 0.8, changefreq: 'weekly' },  // רכזי שכונות
    { path: '/coordinators/guide',   priority: 0.6, changefreq: 'monthly' }, // מדריך לרכז
    { path: '/experts',              priority: 0.8, changefreq: 'weekly' },  // צוותי מומחים
    { path: '/experts/agriculture',  priority: 0.6, changefreq: 'monthly' },
    { path: '/experts/economy',      priority: 0.6, changefreq: 'monthly' },
    { path: '/experts/education',    priority: 0.6, changefreq: 'monthly' },
    { path: '/experts/ethics',       priority: 0.6, changefreq: 'monthly' },
    { path: '/experts/health',       priority: 0.6, changefreq: 'monthly' },
    { path: '/experts/law',          priority: 0.6, changefreq: 'monthly' },
    { path: '/experts/rights',       priority: 0.6, changefreq: 'monthly' },
    { path: '/experts/technology',   priority: 0.6, changefreq: 'monthly' },
    { path: '/experts/admin',        priority: 0.6, changefreq: 'monthly' }, // צוות מינהל (דף ציבורי, לא מסך ניהול)
    { path: '/ratings',              priority: 0.8, changefreq: 'weekly' },  // דירוג ערים
    { path: '/news',                 priority: 0.7, changefreq: 'daily' },
    { path: '/tasks',                priority: 0.6, changefreq: 'weekly' },
    { path: '/vision',               priority: 0.6, changefreq: 'monthly' },
    { path: '/advertise',            priority: 0.5, changefreq: 'monthly' },
    { path: '/advertise/terms',      priority: 0.3, changefreq: 'yearly' },
    { path: '/about',                priority: 0.5, changefreq: 'monthly' },
];

function xmlEscape(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function urlEntry(path: string, opts: { lastmod?: string; priority?: number; changefreq?: string } = {}): string {
    const loc = xmlEscape(SITE_URL + path);
    const parts = [`    <loc>${loc}</loc>`];
    if (opts.lastmod) parts.push(`    <lastmod>${opts.lastmod.slice(0, 10)}</lastmod>`);
    if (opts.changefreq) parts.push(`    <changefreq>${opts.changefreq}</changefreq>`);
    if (opts.priority !== undefined) parts.push(`    <priority>${opts.priority.toFixed(1)}</priority>`);
    return `  <url>\n${parts.join('\n')}\n  </url>`;
}

export const GET: RequestHandler = async ({ setHeaders }) => {
    const urls: string[] = STATIC_PAGES.map((p) => urlEntry(p.path, { priority: p.priority, changefreq: p.changefreq }));

    // דירוג ערים - נתונים סטטיים מהקוד, דף לכל עיר
    for (const city of cities) {
        if (city.slug) urls.push(urlEntry(`/ratings/${city.slug}`, { priority: 0.6, changefreq: 'monthly' }));
    }

    // דפי נחיתה של פרסומות מאושרות ופעילות (/ads/[id]) - אם Strapi נופל, ממשיכים בלעדיהן
    try {
        const ads = await listApproved();
        for (const ad of ads) {
            if (ad.id) urls.push(urlEntry(`/ads/${ad.id}`, { priority: 0.5, changefreq: 'weekly' }));
        }
    } catch { /* מחזירים לפחות את הדפים הקבועים */ }

    const body =
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        urls.join('\n') +
        `\n</urlset>\n`;

    setHeaders({
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    });
    return new Response(body);
};
