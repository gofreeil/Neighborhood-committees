// ============================================================
// adminUsers.ts — מינוי אדמינים לאתר הזה (בדגם /admin/admins של המשאלים)
//
// מינוי = קביעת app_role על הרשומה ברשימת המשתמשים המשותפת של Strapi.
// app_role הוא שדה אחד לכל הרשת, ולכן מכאן מנהלים רק את התפקיד המקומי
// (nc_admin) ואת super_admin הגלובלי; משתמש שכבר נושא תפקיד של אתר אחר
// (idx_admin, ref_admin וכד') מוצג כנעול — מינוי כאן היה דורס אותו.
//
// כל הפעולות כאן דורשות STRAPI_TOKEN: רשימת המשתמשים המשותפת סגורה בפני
// JWT אישי, ו-findStrapiUpUsers בולע 401/403 ומחזיר [] — כלומר בלי טוקן
// המסך היה נראה כאילו אין אף משתמש. hasAdminToken מונע את הבלבול הזה.
// ============================================================

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { findStrapiUpUsers, updateStrapiUpUser, bestStrapiName, friendlyName } from './strapiClient';
import { ADMIN_ROLES, type AdminRole } from './adsAdmin';

/** התפקידים שמותר לקבוע מהמסך הזה. 'user' = הסרה מתפקיד ניהולי. */
export const ASSIGNABLE = ['super_admin', 'nc_admin', 'user'] as const;

export function requireSuperAdmin(role: AdminRole): void {
    if (role !== 'super_admin') throw error(403, 'פעולה זו מותרת לסופר-אדמין בלבד');
}

/** האם מוגדר טוקן שרת — בלעדיו המסך מציג הסבר במקום רשימה ריקה מטעה */
export function hasAdminToken(): boolean {
    return Boolean((env.STRAPI_TOKEN ?? process.env.STRAPI_TOKEN ?? '').trim());
}

/** רשומת המשתמש המלאה מכילה שדות רגישים — ללקוח עוברת צורה רזה בלבד */
export interface SlimUser {
    /** מזהה Strapi המספרי — מה שהטופס שולח בחזרה */
    id: number;
    /** המזהה שבסשן (credentials_… / google_…) — להשוואה מול המשתמש המחובר */
    externalId: string;
    name: string;
    email: string;
    app_role: string;
    neighborhood: string;
    created_at: string;
}

function toSlim(u: unknown): SlimUser {
    const raw = u as {
        id: number;
        email?: string;
        username?: string;
        nickname?: string | null;
        external_id?: string | null;
        neighborhood?: string | null;
        app_role?: string | null;
        createdAt?: string;
    };
    return {
        id:           raw.id,
        externalId:   raw.external_id ?? '',
        // nickname הוא שם התצוגה כאן (גובר על username, שהוא שם כניסה)
        name:         friendlyName(raw.nickname || bestStrapiName(raw), raw.email),
        email:        raw.email ?? '',
        app_role:     raw.app_role || 'user',
        neighborhood: raw.neighborhood ?? '',
        created_at:   raw.createdAt ?? '',
    };
}

/** כל מי שנושא תפקיד ניהולי באתר הזה */
export async function listAdminUsers(): Promise<SlimUser[]> {
    const params: Record<string, string> = {
        'pagination[pageSize]': '200',
        'sort':                 'id:asc',
    };
    ADMIN_ROLES.forEach((r, i) => { params[`filters[app_role][$in][${i}]`] = r; });
    return (await findStrapiUpUsers(params)).map(toSlim);
}

/** חיפוש משתמש למינוי — לפי אימייל / שם כניסה / שם תצוגה */
export async function searchUsers(q: string): Promise<SlimUser[]> {
    const arr = await findStrapiUpUsers({
        'filters[$or][0][email][$containsi]':    q,
        'filters[$or][1][username][$containsi]': q,
        'filters[$or][2][nickname][$containsi]': q,
        'pagination[pageSize]':                  '20',
        'sort':                                  'id:desc',
    });
    return arr.map(toSlim);
}

// ---- חיפוש עמוק (לחיפוש החי במסך המינוי) ----
const SCAN_PAGE_SIZE = 1000; // maxLimit של השרת
const MAX_SCAN       = 5000; // תקרת רשומות לסריקה המקומית
const MAX_RESULTS    = 10;

/** האם אחד משדות הטקסט של הרשומה מכיל את מחרוזת החיפוש */
function matchesLocally(u: unknown, q: string): boolean {
    const needle = q.toLowerCase();
    return Object.values(u as Record<string, unknown>).some(
        (v) => typeof v === 'string' && v.toLowerCase().includes(needle),
    );
}

/**
 * חיפוש דו-שלבי: קודם שאילתת $containsi בצד Strapi (email/username/nickname);
 * אם אין תוצאות — סריקה מקומית של כל שדות הטקסט בדפדוף מוגבל, שתופסת גם
 * שמות בעברית ושדות לא-סטנדרטיים (טלפון וכד').
 */
export async function searchUsersDeep(q: string): Promise<SlimUser[]> {
    let matches: unknown[] = [];
    try {
        matches = await findStrapiUpUsers({
            'filters[$or][0][email][$containsi]':    q,
            'filters[$or][1][username][$containsi]': q,
            'filters[$or][2][nickname][$containsi]': q,
            'pagination[pageSize]':                  String(MAX_RESULTS * 5),
            'sort':                                  'id:desc',
        });
    } catch {
        // סינון לא נתמך בקונפיגורציה הזו — נמשיך לסריקה המקומית
    }

    if (matches.length === 0) {
        for (let start = 0; start < MAX_SCAN; start += SCAN_PAGE_SIZE) {
            const batch = await findStrapiUpUsers({
                'pagination[start]': String(start),
                'pagination[limit]': String(SCAN_PAGE_SIZE),
            });
            matches.push(...batch.filter((u) => matchesLocally(u, q)));
            if (batch.length < SCAN_PAGE_SIZE || matches.length >= MAX_RESULTS) break;
        }
    }

    const seen = new Set<number>();
    const users: SlimUser[] = [];
    for (const raw of matches) {
        const u = toSlim(raw);
        if (!u.id || seen.has(u.id)) continue;
        seen.add(u.id);
        users.push(u);
        if (users.length >= MAX_RESULTS) break;
    }
    return users;
}

/** משתמש בודד — לבדיקות ההגנה לפני שינוי תפקיד */
export async function getUserSlim(id: number): Promise<SlimUser | null> {
    try {
        const arr = await findStrapiUpUsers({
            'filters[id][$eq]':     String(id),
            'pagination[pageSize]': '1',
        });
        return arr.length > 0 ? toSlim(arr[0]) : null;
    } catch {
        return null;
    }
}

/** קביעת התפקיד. users-permissions מצפה לגוף שטוח, בלי עטיפת data. */
export async function setAppRole(id: number, role: string): Promise<void> {
    await updateStrapiUpUser(id, { app_role: role });
}
