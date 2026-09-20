// ============================================================
// adsImport.ts — ייבוא פרסומת מהאתר "קהילה בשכונה" למסך ניהול הפרסומות
// ------------------------------------------------------------
// כל אתרי הרשת חולקים את אוסף submitted-ads ב-Strapi אחד. השיוך לאתר
// נשמר ב-landing._site: פרסומת של "קהילה בשכונה" היא בלי _site (ותיקה)
// או עם _site='community'; פרסומת של האתר הזה מסומנת 'neighborhoods'.
//
// הייבוא יוצר *עותק* של פרסומת שרצה בקהילה בשכונה כרשומה חדשה של האתר
// הזה, במעמד "ממתינה" — המנהל מאשר אותה כרגיל (וקובע תקופה) ורק אז היא
// עולה לטור. המקור לא נוגע. העותק מסומן _importedFrom=<מזהה המקור> ולכן
// ייבוא חוזר של אותה פרסומת נחסם (במקום להיווצר כפילות).
//
// המראה של "קהילה בשכונה": מפתחות העיצוב שם בלי קו תחתון (mainImageFit,
// adStyle) ויש להם תמונת נייד (mobileImage) שאין לה תמיכה כאן — המתאם
// מתרגם לשמות של האתר הזה ומשמיט את מה שלא נתמך. זו תמונת הראי של
// adsSyndication.ts בקהילה בשכונה (שדוחף עותקים לאתרים אחרים).
// ============================================================

import { strapiGet, strapiPost } from './strapiClient.js';
import { normalizePlanDays } from '../adPlans.js';
import { parseAdImageFit } from '../adImageFit.js';
import { parseAdStyle } from '../adStyle.js';
import { toCssGradient } from '../adGradient.js';
import { imageStamp } from './inlineImage.js';
import { invalidateAdsCache, type AdStatus } from './adsStore.js';

const ENDPOINT = '/api/submitted-ads';
const SOURCE_SITE = 'community';
const TARGET_SITE = 'neighborhoods';
/** מוצג למנהל ונשמר על העותק כמקור */
export const SOURCE_SITE_LABEL = 'קהילה בשכונה';

type Row = Record<string, any>;

function landingOf(r: Row | null | undefined): Record<string, any> {
    const l = r?.landing;
    return l && typeof l === 'object' ? (l as Record<string, any>) : {};
}

/** פרסומת של "קהילה בשכונה": בלי _site (ותיקה) או מסומנת community */
function isCommunityRow(r: Row): boolean {
    const site = landingOf(r)._site;
    return site === undefined || site === null || site === SOURCE_SITE;
}

function isOurImport(r: Row): string | null {
    const l = landingOf(r);
    return l._site === TARGET_SITE && typeof l._importedFrom === 'string' ? l._importedFrom : null;
}

/**
 * מפתחות פנימיים בתוך landing של קהילה בשכונה שאינם תוכן דף הנחיתה.
 * מפתח בקידומת קו תחתון הוא פנימי בכל אתרי הרשת; אלה המפתחות ההיסטוריים
 * שנשמרו שם בלי קידומת (תמונת הנייד כבדה ואין לה שימוש כאן).
 */
const NON_CONTENT_KEYS = new Set(['mainImageFit', 'mobileImage', 'mobileImageFit', 'adStyle']);

function contentLanding(raw: Record<string, any>): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(raw)) {
        if (k.startsWith('_') || NON_CONTENT_KEYS.has(k)) continue;
        out[k] = v;
    }
    return out;
}

/**
 * שליפה רזה של כל הרשומות באוסף (כל האתרים) — בלי logo/main_image שהם
 * base64 כבד. אם Strapi דוחה בחירת עמודת json (landing) נופלים לשליפה
 * מלאה, שעדיין עובדת רק יקרה יותר.
 */
async function fetchLeanRows(): Promise<Row[]> {
    const lean: Record<string, string> = {
        'fields[0]': 'documentId',
        'fields[1]': 'title',
        'fields[2]': 'subtitle',
        'fields[3]': 'ad_status',
        'fields[4]': 'submitted_by_name',
        'fields[5]': 'expires_at',
        'fields[6]': 'decided_at',
        'fields[7]': 'landing',
    };
    try {
        return await fetchAllPages(lean);
    } catch {
        return await fetchAllPages({});
    }
}

async function fetchAllPages(extra: Record<string, string>): Promise<Row[]> {
    const out: Row[] = [];
    let page = 1;
    for (;;) {
        const res = await strapiGet<{ data: Row[]; meta?: { pagination?: { pageCount?: number } } }>(ENDPOINT, {
            ...extra,
            sort: 'submitted_at:desc',
            'pagination[pageSize]': '100',
            'pagination[page]': String(page),
        });
        out.push(...(Array.isArray(res.data) ? res.data : []));
        const pageCount = res.meta?.pagination?.pageCount ?? 1;
        if (page >= pageCount) return out;
        page++;
    }
}

async function fetchFullRow(id: string): Promise<Row | null> {
    try {
        const res = await strapiGet<{ data: Row | null }>(`${ENDPOINT}/${encodeURIComponent(id)}`);
        return res?.data ?? null;
    } catch {
        return null;
    }
}

function statusOf(r: Row): AdStatus {
    return r.ad_status === 'approved' ? 'approved' : r.ad_status === 'rejected' ? 'rejected' : 'pending';
}

/** פרסומת של קהילה בשכונה שאפשר לייבא — רק מה שנדרש לרשימה במסך הניהול */
export interface ImportableAd {
    id: string;
    title: string;
    subtitle: string;
    advertiser: string;
    /** עד מתי היא רצה שם (ריק = בלי תאריך) */
    expiresAt: string;
    /** מספר המקום שלה בלוח של קהילה בשכונה (1-based) — מבדיל בין עותקים
     *  של אותה מודעה שיושבים שם בכמה משבצות; null = בלי מספר */
    slot: number | null;
    /** העותק שכבר קיים כאן, אם יובאה בעבר */
    imported: { id: string; status: AdStatus } | null;
}

/**
 * הפרסומות שרצות כרגע ב"קהילה בשכונה" (מאושרות, לא פגו, לא מושהות ולא
 * גרסה ישנה שהוחלפה), עם סימון מי מהן כבר יובאה לכאן.
 */
export async function listImportableCommunityAds(): Promise<ImportableAd[]> {
    const rows = await fetchLeanRows();
    const now = Date.now();

    // מיפוי מקור → עותק שלנו (הכי חדש קודם — הרשימה ממוינת לפי submitted_at יורד)
    const importedBySource = new Map<string, { id: string; status: AdStatus }>();
    for (const r of rows) {
        const src = isOurImport(r);
        if (src && typeof r.documentId === 'string' && !importedBySource.has(src)) {
            importedBySource.set(src, { id: r.documentId, status: statusOf(r) });
        }
    }

    return rows
        .filter((r) => isCommunityRow(r) && r.ad_status === 'approved' && typeof r.documentId === 'string')
        .filter((r) => {
            const l = landingOf(r);
            if (l._supersededBy || l._paused === true) return false;
            const exp = r.expires_at ? Date.parse(r.expires_at) : NaN;
            return Number.isNaN(exp) || exp > now;
        })
        .map((r) => ({
            id: r.documentId as string,
            title: r.title ?? '',
            subtitle: r.subtitle ?? '',
            advertiser: r.submitted_by_name ?? '',
            expiresAt: r.expires_at ?? '',
            slot: typeof landingOf(r)._order === 'number' ? landingOf(r)._order + 1 : null,
            imported: importedBySource.get(r.documentId) ?? null,
        }))
        // בסדר הלוח שם — כמו שהגולש רואה בקהילה בשכונה
        .sort((a, b) => (a.slot ?? 9999) - (b.slot ?? 9999));
}

export type ImportResult =
    | { action: 'created'; id: string; title: string }
    | { action: 'exists'; id: string; title: string; status: AdStatus }
    | { action: 'not-found' };

/**
 * מייבא פרסומת של קהילה בשכונה כרשומה חדשה של האתר הזה במעמד "ממתינה".
 * לא נוגע במקור. אם כבר קיים כאן עותק של אותה פרסומת — מחזיר אותו במקום
 * ליצור כפילות.
 */
export async function importCommunityAd(sourceId: string): Promise<ImportResult> {
    const src = await fetchFullRow(sourceId);
    if (!src || !isCommunityRow(src) || src.ad_status !== 'approved') return { action: 'not-found' };

    const existing = (await fetchLeanRows()).find((r) => isOurImport(r) === sourceId);
    if (existing && typeof existing.documentId === 'string') {
        return { action: 'exists', id: existing.documentId, title: existing.title ?? src.title ?? '', status: statusOf(existing) };
    }

    const srcLanding = landingOf(src);
    const logo: string = src.logo ?? '';
    const mainImage: string = src.main_image ?? '';
    const content = contentLanding(srcLanding);
    const landingImages: string[] = [
        typeof content.image === 'string' ? content.image : '',
        ...(Array.isArray(content.products)
            ? (content.products as Array<{ image?: string }>).map((p) => p?.image ?? '')
            : []),
    ];

    const landing: Record<string, unknown> = {
        ...content,
        // שיוך קשיח לאתר הזה — בלעדיו העותק נבלע באוסף המשותף
        _site: TARGET_SITE,
        // פרסומת שכבר רצה ברשת — נכנסת כמו "שולם", בלי בקשת קוד
        _payment: 'code',
        _codeRequested: false,
        _requestedDurationDays: normalizePlanDays(src.duration_days),
        // תרגום מפתחות העיצוב של קהילה בשכונה לשמות של האתר הזה
        _mainImageFit: parseAdImageFit(srcLanding.mainImageFit ?? srcLanding._mainImageFit),
        _adStyle: parseAdStyle(srcLanding.adStyle ?? srcLanding._adStyle),
        _imgV: imageStamp(logo, mainImage, ...landingImages),
        // עותק מיובא הוא מודעה בפני עצמה: האישור שלו לא מוריד שום מודעה
        // אחרת של אותו מפרסם שכבר רצה כאן
        _standalone: true,
        _importedFrom: sourceId,
        _importedFromSite: SOURCE_SITE,
    };

    const res = await strapiPost<{ data: { documentId: string } }>(ENDPOINT, {
        data: {
            ad_status: 'pending',
            title: src.title ?? '',
            subtitle: src.subtitle ?? '',
            hover_text: src.hover_text ?? '',
            cta: src.cta ?? '',
            // קהילה בשכונה שומרת זוג מחלקות Tailwind; כאן הכרטיס מציב CSS
            gradient: toCssGradient(src.gradient),
            logo,
            main_image: mainImage,
            landing,
            submitted_by_id: src.submitted_by_id ?? null,
            submitted_by_email: src.submitted_by_email ?? null,
            submitted_by_name: src.submitted_by_name ?? null,
            submitted_at: new Date().toISOString(),
        },
    });
    invalidateAdsCache();
    return { action: 'created', id: res.data?.documentId ?? '', title: src.title ?? '' };
}
