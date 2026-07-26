import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
    let userEmail: string | null = null;
    let userName: string | null = null;
    try {
        const session = await event.locals.auth();
        userEmail = session?.user?.email ?? null;
        userName = session?.user?.name ?? null;
    } catch { /* ignore */ }
    return { userEmail, userName };
};
