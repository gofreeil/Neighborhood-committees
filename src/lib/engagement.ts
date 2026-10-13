import { goto } from '$app/navigation';
import { withIntent } from '$lib/authIntent';

export interface ToggleResponse { active: boolean; choice: string }

/**
 * שולח toggle מעורבות לשרת. אם המשתמש לא מחובר - מפנה להתחברות.
 * מחזיר את המצב החדש, או null אם הופנה להתחברות / נכשל.
 */
export async function toggleEngagement(
    kind: 'rsvp' | 'join' | 'vote' | 'letter',
    target: string,
    choice = '',
    redirectAfterLogin = '/',
): Promise<ToggleResponse | null> {
    try {
        const res = await fetch('/api/engagement', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ kind, target, choice }),
        });
        if (res.status === 401) {
            // intent: מסך הפתיחה אחרי ההרשמה יציג "כעת תועבר לבקשתך — <הצבעה/הצטרפות...>"
            goto(`/login?redirect=${encodeURIComponent(withIntent(redirectAfterLogin, kind))}`);
            return null;
        }
        const data = await res.json();
        if (!data.success) return null;
        return { active: data.active, choice: data.choice };
    } catch {
        return null;
    }
}
