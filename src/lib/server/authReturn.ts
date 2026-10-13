// יעד החזרה של דפי ההתחברות/הרשמה — ראו $lib/authIntent.
// יעד שהוא בקשה נשמר בעוגייה ל-3 ימים: מי שאישר את מייל ההרשמה בלשונית אחרת ונכנס
// מכפתור "התחברות" הכללי (בלי יעד) מגיע בכל זאת לבקשה הראשונה שלו.
// מסך הפתיחה (WelcomeScreen) מוחק את העוגייה כשהבקשה הוצגה.

import type { Cookies } from '@sveltejs/kit';
import { describeReturn, RETURN_COOKIE } from '$lib/authIntent';

function safe(raw: string | null | undefined): string {
    const v = String(raw ?? '');
    return v.startsWith('/') && !v.startsWith('//') && !v.startsWith('/\\') ? v : '/';
}

export function resolveReturn(url: URL, cookies: Cookies): string {
    const target = safe(url.searchParams.get('redirect'));
    if (describeReturn(target)) {
        cookies.set(RETURN_COOKIE, target, {
            path: '/', httpOnly: false, sameSite: 'lax', secure: url.protocol === 'https:', maxAge: 3 * 24 * 60 * 60,
        });
        return target;
    }
    const saved = safe(cookies.get(RETURN_COOKIE));
    return describeReturn(saved) ? saved : target;
}
