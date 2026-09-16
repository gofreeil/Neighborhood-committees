// ============================================================
// letters.ts (server) — שכבת הנתונים של "מכתב משותף"
//
// כל מכתב הוא רשומה בקולקציית items המשותפת תחת קטגוריה מבודדת:
//   label       = כותרת הקמפיין (מה שהתושב רואה בכרטיס)
//   description = גוף המכתב
//   contact     = שם הרכז/ת שפתח/ה
//   extra_fields = { subject, to[], cc[], source, deadline }
//   status1     = active | closed | deleted
//
// מי שרשאי לפתוח ולערוך מכתבים: רכזי שכונות (coordinator_of / תפקיד
// neighborhood_admin) ואדמינים של האתר. התושבים רק "שולחים" - וזה נספר
// דרך רשומת מעורבות מסוג 'letter' (ראו toggleEngagement ב-db.ts).
// ============================================================

import type { Session } from '@auth/sveltekit';
import { createItem, updateItem, getDbItemById, getUserById, getUserByEmail, type DbItem } from './db';
import { strapiGet, StrapiContentTypeError } from './strapiClient';
import { resolveRole } from './adsAdmin';
import { parseRecipients } from '$lib/letters';

export const LETTER_CATEGORY = 'nc_letter';

export type LetterStatus = 'active' | 'closed';

export interface Letter {
    id: string;
    title: string;
    subject: string;
    body: string;
    to: string[];
    cc: string[];
    /** מאיפה הגיע המכתב - "הצבעת רכזים 12.9, 14 בעד" / קישור לדיון */
    source: string;
    /** תאריך יעד לשליחה (YYYY-MM-DD) או ריק */
    deadline: string;
    author: string;
    neighborhood: string;
    status: LetterStatus;
    user_id: string;
    created_at: string;
}

export interface LetterInput {
    title: string;
    subject: string;
    body: string;
    to: string[];
    cc: string[];
    source: string;
    deadline: string;
}

function asStringArray(v: unknown): string[] {
    return Array.isArray(v) ? v.map(String).filter(Boolean) : [];
}

function mapLetter(it: DbItem): Letter {
    let ef: Record<string, unknown> = {};
    try { ef = it.extra_fields ? JSON.parse(it.extra_fields) : {}; } catch { ef = {}; }
    return {
        id:           it.id,
        title:        it.label,
        subject:      String(ef.subject ?? ''),
        body:         it.description ?? '',
        to:           asStringArray(ef.to),
        cc:           asStringArray(ef.cc),
        source:       String(ef.source ?? ''),
        deadline:     String(ef.deadline ?? ''),
        author:       it.contact || 'רכז/ת שכונה',
        neighborhood: it.neighborhood ?? '',
        status:       it.status === 'closed' ? 'closed' : 'active',
        user_id:      it.user_id ?? '',
        created_at:   it.created_at,
    };
}

/** ממיר רשומת Strapi גולמית ל-DbItem (מראה של mapStrapiItem הפרטי ב-db.ts) */
function rawToDbItem(r: Record<string, unknown>): DbItem {
    return {
        id:           String(r.documentId ?? ''),
        category:     String(r.category ?? ''),
        label:        String(r.label ?? ''),
        description:  String(r.description ?? ''),
        contact:      String(r.contact ?? ''),
        phone:        String(r.phone ?? ''),
        address:      String(r.address ?? ''),
        icon:         String(r.icon ?? '✉️'),
        color:        String(r.color ?? 'sky'),
        neighborhood: String(r.neighborhood ?? ''),
        city:         String(r.city ?? ''),
        extra_fields: r.extra_fields && typeof r.extra_fields === 'object' ? JSON.stringify(r.extra_fields) : '{}',
        status:       String(r.status1 ?? 'active'),
        user_id:      (r.user_id as string | null) ?? null,
        created_at:   String(r.createdAt ?? ''),
        view_count:   Number(r.view_count ?? 0),
    };
}

/** כל המכתבים שלא נמחקו - פעילים קודם, ובתוך כל קבוצה חדש לישן */
export async function getLetters(): Promise<Letter[]> {
    try {
        const res = await strapiGet<{ data: unknown[] }>('/api/items', {
            'filters[category][$eq]': LETTER_CATEGORY,
            'filters[status1][$ne]':  'deleted',
            'sort':                   'createdAt:desc',
            'pagination[limit]':      '500',
        });
        const rows = (res.data ?? []) as Array<Record<string, unknown>>;
        return rows.map(rawToDbItem).map(mapLetter)
            .sort((a, b) => (a.status === b.status ? 0 : a.status === 'active' ? -1 : 1));
    } catch (e) {
        if (e instanceof StrapiContentTypeError) return [];
        throw e;
    }
}

export async function getLetter(id: string): Promise<Letter | undefined> {
    const it = await getDbItemById(id);
    if (!it || it.category !== LETTER_CATEGORY || it.status === 'deleted') return undefined;
    return mapLetter(it);
}

export async function createLetter(input: LetterInput, author: string, neighborhood: string, userId: string): Promise<Letter> {
    const item = await createItem({
        category:     LETTER_CATEGORY,
        label:        input.title,
        description:  input.body,
        contact:      author,
        neighborhood,
        icon:         '✉️',
        color:        'sky',
        user_id:      userId,
        extra_fields: {
            subject:  input.subject,
            to:       input.to,
            cc:       input.cc,
            source:   input.source,
            deadline: input.deadline,
        },
    });
    return mapLetter(item);
}

export async function updateLetter(id: string, input: LetterInput): Promise<void> {
    await updateItem(id, {
        label:        input.title,
        description:  input.body,
        extra_fields: {
            subject:  input.subject,
            to:       input.to,
            cc:       input.cc,
            source:   input.source,
            deadline: input.deadline,
        },
    });
}

/** ערכי הטופס כפי שהוקלדו - מוחזרים לטופס אחרי שגיאה */
export interface LetterFormValues {
    title: string;
    subject: string;
    body: string;
    to: string;
    cc: string;
    source: string;
    deadline: string;
}

export const LETTER_LIMITS = { title: 120, subject: 200, body: 6000, source: 300, recipients: 50 } as const;

/**
 * קורא ומאמת את טופס המכתב (פתיחה ועריכה חולקות אותו). מחזיר או קלט נקי
 * או הודעת שגיאה אחת - הראשונה שנמצאה - יחד עם הערכים שהוקלדו.
 */
export function parseLetterForm(fd: FormData): { input: LetterInput; values: LetterFormValues } | { error: string; values: LetterFormValues } {
    const str = (k: string) => String(fd.get(k) ?? '').trim();
    const values: LetterFormValues = {
        title:    str('title'),
        subject:  str('subject'),
        body:     String(fd.get('body') ?? '').replace(/\r\n/g, '\n').trim(),
        to:       str('to'),
        cc:       str('cc'),
        source:   str('source'),
        deadline: str('deadline'),
    };

    if (values.title.length < 4)  return { error: 'כותרת המכתב קצרה מדי (לפחות 4 תווים).', values };
    if (values.title.length > LETTER_LIMITS.title) return { error: `כותרת המכתב ארוכה מדי (עד ${LETTER_LIMITS.title} תווים).`, values };
    if (values.subject.length < 3) return { error: 'יש למלא נושא למייל (לפחות 3 תווים).', values };
    if (values.subject.length > LETTER_LIMITS.subject) return { error: `נושא המייל ארוך מדי (עד ${LETTER_LIMITS.subject} תווים).`, values };
    if (values.body.length < 20)  return { error: 'גוף המכתב קצר מדי (לפחות 20 תווים).', values };
    if (values.body.length > LETTER_LIMITS.body) return { error: `גוף המכתב ארוך מדי (עד ${LETTER_LIMITS.body.toLocaleString('he-IL')} תווים) - תוכנות מייל לא פותחות טקסט ארוך יותר.`, values };
    if (values.source.length > LETTER_LIMITS.source) return { error: `שדה "על סמך מה" ארוך מדי (עד ${LETTER_LIMITS.source} תווים).`, values };

    const to = parseRecipients(values.to);
    if (to.invalid.length) return { error: `כתובת נמען לא תקינה: ${to.invalid.slice(0, 3).join(', ')}`, values };
    if (!to.valid.length)  return { error: 'יש להזין לפחות כתובת מייל אחת של נמען.', values };
    const cc = parseRecipients(values.cc);
    if (cc.invalid.length) return { error: `כתובת "עותק" לא תקינה: ${cc.invalid.slice(0, 3).join(', ')}`, values };
    if (to.valid.length + cc.valid.length > LETTER_LIMITS.recipients) {
        return { error: `יותר מדי נמענים (עד ${LETTER_LIMITS.recipients} כתובות יחד).`, values };
    }

    if (values.deadline && !/^\d{4}-\d{2}-\d{2}$/.test(values.deadline)) {
        return { error: 'תאריך היעד לא תקין.', values };
    }

    return {
        input: {
            title:    values.title,
            subject:  values.subject,
            body:     values.body,
            to:       to.valid,
            cc:       cc.valid,
            source:   values.source,
            deadline: values.deadline,
        },
        values,
    };
}

export async function setLetterStatus(id: string, status: LetterStatus | 'deleted'): Promise<void> {
    await updateItem(id, { status });
}

/**
 * האם המשתמש המחובר רשאי לפתוח/לערוך מכתבים: אדמין של האתר (סופר-אדמין /
 * nc_admin) או רכז שכונה (coordinator_of לא ריק / תפקיד neighborhood_admin).
 * התפקיד יושב כבר בסשן; רק כשהוא 'user' רגיל נשלפת הרשומה המשותפת, כי
 * coordinator_of לא עובר לסשן.
 */
export async function canManageLetters(session: Session | null): Promise<boolean> {
    const u = session?.user;
    if (!u) return false;
    if (u.role === 'neighborhood_admin' || u.role === 'nc_admin' || u.role === 'super_admin') return true;

    const adminRole = await resolveRole(session).catch(() => null);
    if (adminRole) return true;

    let dbUser;
    try { if (u.id) dbUser = await getUserById(u.id); } catch { /* ignore */ }
    if (!dbUser && u.email) {
        try { dbUser = await getUserByEmail(u.email); } catch { /* ignore */ }
    }
    return (dbUser?.coordinator_of?.length ?? 0) > 0 || dbUser?.role === 'neighborhood_admin';
}
