import { goto } from '$app/navigation';

export interface ToggleResponse { active: boolean; choice: string }

/**
 * שולח toggle מעורבות לשרת. אם המשתמש לא מחובר - מפנה להתחברות.
 * מחזיר את המצב החדש, או null אם הופנה להתחברות / נכשל.
 */
export async function toggleEngagement(
    kind: 'rsvp' | 'join' | 'vote',
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
            goto(`/login?redirect=${encodeURIComponent(redirectAfterLogin)}`);
            return null;
        }
        const data = await res.json();
        if (!data.success) return null;
        return { active: data.active, choice: data.choice };
    } catch {
        return null;
    }
}
