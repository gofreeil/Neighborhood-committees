import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
    let userEmail: string | null = null;
    try {
        const session = await event.locals.auth();
        userEmail = session?.user?.email ?? null;
    } catch { /* ignore */ }
    return { userEmail };
};
