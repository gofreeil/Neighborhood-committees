// "הבקשה הראשונה" של מי שנשלח להירשם/להתחבר באמצע פעולה.
//
// אורח שלוחץ על פעולה שדורשת חשבון נשלח להתחברות עם יעד חזרה. בסיום ההרשמה/התחברות
// הוא נוחת ביעד עם ?welcome=..., ומסך הפתיחה (WelcomeScreen) מציג:
// "השלמת את ההרשמה! כעת תועבר לבקשתך הראשונה — <תיאור>" ונסגר אל הבקשה עצמה.
// תיאור יש רק ליעדים שהם פעולה; דף הבית, דפי עיון והאזור האישי אינם "בקשה".
// פעולה בתוך דף רגיל (הצבעה, הצטרפות למאבק וכו') מסומנת ביעד ב-?intent=.

export const INTENT_PARAM = 'intent';

/** עוגיית הבקשה הממתינה (ראו $lib/server/authReturn) — נמחקת כשמסך הפתיחה הציג אותה */
export const RETURN_COOKIE = 'gf_return';
export function clearPendingReturn(): void {
    try { document.cookie = `${RETURN_COOKIE}=; Max-Age=0; path=/`; } catch { /* ignore */ }
}

const INTENTS: Record<string, string> = {
    vote: 'הצבעה בדיון',
    join: 'הצטרפות למאבק',
    rsvp: 'אישור הגעה לאירוע',
    letter: 'שליחת המכתב המשותף',
};

const ROUTE_LABELS: Array<[RegExp, string]> = [
    [/^\/marketplace\/add$/, 'פרסום מוצר בשוק השכונתי'],
    [/^\/letters\/new$/, 'כתיבת מכתב משותף חדש'],
    [/^\/letters\/[^/]+$/, 'המכתב המשותף'],
    [/^\/discussions\/new$/, 'פתיחת דיון חדש'],
    [/^\/coordinators\/guide$/, 'מדריך רכז השכונה'],
    [/^\/advertise\/manage(\/|$)/, 'ניהול המודעות שלך'],
    [/^\/advertise(\/|$)/, 'בניית מודעה'],
    [/^\/admin(\/|$)/, 'ממשק הניהול'],
];

/** נתיב + intent, למשל withIntent('/struggles', 'join') → '/struggles?intent=join' */
export function withIntent(path: string, intent: string): string {
    const u = new URL(path, 'http://x');
    u.searchParams.set(INTENT_PARAM, intent);
    return `${u.pathname}${u.search}${u.hash}`;
}

/** תיאור הבקשה לפי נתיב היעד (כולל query), או null כשהיעד אינו בקשה */
export function describeReturn(pathAndSearch: string): string | null {
    let url: URL;
    try { url = new URL(pathAndSearch, 'http://x'); } catch { return null; }
    const intent = url.searchParams.get(INTENT_PARAM);
    if (intent && INTENTS[intent]) return INTENTS[intent];
    const path = url.pathname.replace(/\/+$/, '') || '/';
    for (const [re, label] of ROUTE_LABELS) if (re.test(path)) return label;
    return null;
}
