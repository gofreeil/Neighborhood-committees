import { redirect, fail } from '@sveltejs/kit';
import { strapiRegister } from '$lib/server/strapiClient';
import { registerWithCredentials, updateUserProfile } from '$lib/server/db';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async (event) => {
    const session = await event.locals.auth();

    // כבר מחובר - אין מה להירשם
    if (session?.user) {
        throw redirect(302, '/');
    }

    return {
        redirectTo: event.url.searchParams.get('redirect') ?? '/',
    };
};

/** תרגום שגיאות Strapi להודעות בעברית */
function friendlyError(raw: string): string {
    const text = raw.toLowerCase();
    if (text.includes('email') && text.includes('taken')) return 'האימייל הזה כבר רשום. אפשר פשוט להתחבר.';
    if (text.includes('username') && text.includes('taken')) return 'האימייל הזה כבר רשום. אפשר פשוט להתחבר.';
    if (text.includes('password')) return 'הסיסמה אינה עומדת בדרישות. נסו סיסמה ארוכה יותר.';
    if (text.includes('email')) return 'כתובת האימייל אינה תקינה.';
    return 'ההרשמה נכשלה. נסו שוב בעוד רגע.';
}

export const actions: Actions = {
    /**
     * שלב 1: יצירת המשתמש ב-Strapi (users-permissions) וקישורו לרשומת הקהילה.
     * אם Strapi מחזיר JWT - שומרים בעוגייה והקליינט ממשיך ל-signIn('credentials'),
     * בדיוק כמו במסך ההתחברות. אם אישור אימייל מופעל ב-Strapi אין JWT,
     * ואז מבקשים מהמשתמש לאשר את המייל לפני ההתחברות.
     */
    register: async (event) => {
        const { cookies } = event;
        const formData = await event.request.formData();
        const name = (formData.get('name') as string)?.trim();
        const email = (formData.get('email') as string)?.trim().toLowerCase();
        const password = formData.get('password') as string;
        const passwordConfirm = formData.get('passwordConfirm') as string;

        if (!name || !email || !password) {
            return fail(400, { error: 'יש למלא שם, אימייל וסיסמה' });
        }
        if (name.length < 2) {
            return fail(400, { error: 'השם קצר מדי' });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return fail(400, { error: 'כתובת האימייל אינה תקינה' });
        }
        if (password.length < 6) {
            return fail(400, { error: 'הסיסמה חייבת להכיל לפחות 6 תווים' });
        }
        if (password !== passwordConfirm) {
            return fail(400, { error: 'הסיסמאות אינן תואמות' });
        }

        // username חייב להיות ייחודי ב-Strapi; האימייל ייחודי ממילא, לכן הוא המזהה
        // הבטוח ביותר. השם האמיתי נשמר ב-nickname, ומשם הוא מוצג באתר.
        let jwt: string | undefined;
        try {
            const res = await strapiRegister(email, email, password);
            jwt = res.jwt;
        } catch (e) {
            const raw = e instanceof Error ? e.message : String(e);
            console.warn('[register] strapiRegister failed:', raw);
            return fail(400, { error: friendlyError(raw) });
        }

        // קישור רשומת ה-Strapi ל-external_id (credentials_<email>) ושמירת השם להצגה
        try {
            await registerWithCredentials(name, email, password, jwt);
            await updateUserProfile(`credentials_${email}`, { name }, jwt);
        } catch (e) {
            // החשבון עצמו נוצר - לא מפילים את ההרשמה בגלל סנכרון הפרופיל
            console.warn('[register] community-user sync failed:', e);
        }

        // אישור אימייל מופעל ב-Strapi - אין JWT, אי אפשר להתחבר עדיין
        if (!jwt) {
            return { success: true, needsConfirmation: true };
        }

        cookies.set('strapi_jwt', jwt, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 * 365,
        });

        return { success: true, needsConfirmation: false };
    },
};
