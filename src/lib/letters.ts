// ============================================================
// letters.ts — "מכתב משותף": מה שנטען גם בדפדפן
//
// רכזי השכונות מנסחים מכתב (נמענים + נושא + גוף) אחרי דיון והצבעה,
// והתושבים לוחצים על כפתור אחד: תוכנת המייל שלהם נפתחת עם הכל מוכן,
// ונשאר רק ללחוץ "שלח". הקובץ הזה בונה את קישורי mailto / Gmail ומטפל
// במילוי השם של השולח — בלי שום ייבוא מצד השרת.
// ============================================================

export interface LetterDraft {
    to: string[];
    cc: string[];
    subject: string;
    body: string;
}

/** מציין-מקום שהרכז יכול לשים בגוף המכתב; מוחלף בשם התושב המחובר */
export const NAME_PLACEHOLDER = '{שם}';

/** ממלא את שם השולח במכתב. בלי שם - מוריד את מציין-המקום ומשאיר שורה נקייה */
export function personalize(body: string, name: string): string {
    const clean = (name ?? '').trim();
    return body.split(NAME_PLACEHOLDER).join(clean);
}

/** mailto: תקני - שורות חדשות כ-CRLF, הכל מקודד, נמענים מופרדים בפסיק */
export function buildMailto(d: LetterDraft): string {
    const to = d.to.join(',');
    const params: string[] = [];
    if (d.cc.length) params.push('cc=' + encodeURIComponent(d.cc.join(',')));
    if (d.subject) params.push('subject=' + encodeURIComponent(d.subject));
    if (d.body) params.push('body=' + encodeURIComponent(d.body.replace(/\r?\n/g, '\r\n')));
    return 'mailto:' + to + (params.length ? '?' + params.join('&') : '');
}

/** חלון כתיבה של Gmail בדפדפן - למי שאין לו תוכנת מייל מותקנת */
export function buildGmailUrl(d: LetterDraft): string {
    const u = new URL('https://mail.google.com/mail/');
    u.searchParams.set('view', 'cm');
    u.searchParams.set('fs', '1');
    u.searchParams.set('to', d.to.join(','));
    if (d.cc.length) u.searchParams.set('cc', d.cc.join(','));
    u.searchParams.set('su', d.subject);
    u.searchParams.set('body', d.body);
    return u.toString();
}

/** חלון כתיבה של Outlook בדפדפן */
export function buildOutlookUrl(d: LetterDraft): string {
    const u = new URL('https://outlook.live.com/mail/0/deeplink/compose');
    u.searchParams.set('to', d.to.join(','));
    if (d.cc.length) u.searchParams.set('cc', d.cc.join(','));
    u.searchParams.set('subject', d.subject);
    u.searchParams.set('body', d.body);
    return u.toString();
}

const EMAIL_RE = /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]{2,}$/;

/**
 * מפרק רשימת נמענים חופשית (פסיקים / נקודה-פסיק / שורות / רווחים) לכתובות
 * תקינות, קטנות ובלי כפילויות. מחזיר גם מה שנפסל - כדי להראות לרכז.
 */
export function parseRecipients(raw: string): { valid: string[]; invalid: string[] } {
    const seen = new Set<string>();
    const valid: string[] = [];
    const invalid: string[] = [];
    // תמיכה גם בפורמט "שם מלא <כתובת>" - קודם שולפים את מה שבסוגריים
    // (כולל השם שלפניהם, שאחרת היה נספר כ"כתובת לא תקינה"), ואז מפרקים את השאר
    const bracketed: string[] = [];
    const rest = (raw ?? '').replace(/[^<>,;\n]*<([^>]+)>/g, (_m, a: string) => { bracketed.push(a); return ' '; });
    for (const piece of [...bracketed, ...rest.split(/[\s,;]+/)]) {
        const addr = piece.trim().toLowerCase();
        if (!addr) continue;
        if (!EMAIL_RE.test(addr)) { invalid.push(piece); continue; }
        if (seen.has(addr)) continue;
        seen.add(addr);
        valid.push(addr);
    }
    return { valid, invalid };
}

/** תאריך יעד קריא; ריק אם אין */
export function fmtDeadline(iso: string): string {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** האם תאריך היעד כבר עבר */
export function isPastDeadline(iso: string): boolean {
    if (!iso) return false;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return false;
    d.setHours(23, 59, 59, 999);
    return d.getTime() < Date.now();
}
