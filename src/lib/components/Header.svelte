<script lang="ts">
    import { t } from 'svelte-i18n';
    import { get } from 'svelte/store';
    import { signOut } from '@auth/sveltekit/client';

    let { userEmail = null, userName = null }: { userEmail?: string | null; userName?: string | null } = $props();

    // מחובר = יש אימייל בסשן (מגיע מ-+layout.server.ts)
    const isLoggedIn = $derived(!!userEmail);
    const displayName = $derived(userName?.trim() || userEmail?.split('@')[0] || 'המשתמש שלי');
    const initial = $derived(displayName.charAt(0).toUpperCase());

    // יציאה: Auth.js מוחק את הסשן ומפנה ל-/logout שמנקה גם את טוקן ה-Strapi
    let signingOut = $state(false);
    async function logout() {
        if (signingOut) return;
        signingOut = true;
        try {
            await signOut({ redirectTo: '/logout' });
        } catch {
            signingOut = false;
        }
    }

    const nav = [
        { href: '/vision', label: 'החזון' },
        { href: '/struggles', label: 'מאבקים ונצחונות' },
        { href: '/discussions', label: 'דיונים הצבעות' },
        { href: '/experts', label: 'צוות המומחים' },
        { href: '/marketplace', label: 'נקודות איסוף' },
        { href: '/coordinators', label: 'רכזי השכונות' },
        { href: '/ratings', label: 'סטטוס שכונות' }
    ];

    // קישור פרטי שלי בלבד - גישה ישירה ל-Strapi DB
    const isPrimaryAdmin = $derived(userEmail === 'yahavanter@gmail.com');

    let mobileOpen = $state(false);
</script>

<header
    class="sticky top-0 z-50 border-b-2 md:border-b-4 border-blue-600 shadow-lg backdrop-blur-lg"
    style="background: linear-gradient(to bottom, rgba(17, 24, 39, 0.92) 0%, rgba(17, 24, 39, 0.88) 66%, rgba(17, 24, 39, 0.4) 100%);"
>
    <div class="relative mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
        <!-- Mobile -->
        <div class="md:hidden h-[72px] flex items-center justify-between">
            <a href="/" class="flex items-center gap-2.5 flex-1 min-w-0">
                <div class="h-12 w-12 rounded-full overflow-hidden flex-shrink-0 bg-white/5 flex items-center justify-center">
                    <img src="/images/neighborhoods.png" alt="ועדי שכונות ארצי" class="h-full w-full object-contain" />
                </div>
                <div class="min-w-0 flex-1">
                    <h1 class="bg-clip-text text-lg font-black text-transparent leading-tight" style="background-image: linear-gradient(to left, #10abd5 0%, #0fa2e9 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                        ועדי שכונות ארצי
                    </h1>
                    <p class="text-xs text-gray-400 leading-tight">הפלטפורמה הארצית לפעילות ועדי השכונות בישראל</p>
                </div>
            </a>
            <button
                onclick={() => (mobileOpen = !mobileOpen)}
                class="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="תפריט"
            >
                <span class="text-xl text-white">{mobileOpen ? '✕' : '☰'}</span>
            </button>
        </div>

        {#if mobileOpen}
            <nav class="md:hidden pb-3 grid grid-cols-2 gap-1.5">
                {#each nav as item}
                    <a
                        href={item.href}
                        onclick={() => (mobileOpen = false)}
                        class="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/15 text-white text-sm text-center"
                    >
                        {item.label}
                    </a>
                {/each}
                {#if isLoggedIn}
                    <div class="col-span-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                        <span class="h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 grid place-items-center text-xs font-black text-white">
                            {initial}
                        </span>
                        <span class="min-w-0 flex-1 truncate text-sm font-bold text-white">{displayName}</span>
                        <button
                            type="button"
                            onclick={logout}
                            disabled={signingOut}
                            class="shrink-0 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-gray-200 hover:bg-white/15 transition-colors disabled:opacity-60"
                        >
                            {signingOut ? 'יוצא…' : 'יציאה'}
                        </button>
                    </div>
                {:else}
                    <a
                        href="/login"
                        onclick={() => (mobileOpen = false)}
                        class="col-span-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm text-center font-bold"
                    >
                        🔐 התחבר
                    </a>
                {/if}
                {#if isPrimaryAdmin}
                    <a
                        href="https://api.gofreeil.com/admin"
                        target="_blank"
                        rel="noopener noreferrer"
                        onclick={() => (mobileOpen = false)}
                        class="col-span-2 px-3 py-2 rounded-lg bg-rose-600/20 border border-rose-500/40 text-rose-200 text-sm text-center font-bold"
                        title="גישה ישירה ל-Strapi (פרטי - רק לך)"
                    >
                        🗄️ Strapi DB
                    </a>
                {/if}
            </nav>
        {/if}

        <!-- Desktop -->
        <div class="hidden md:flex flex-col items-center pt-2 pb-2">
            <div class="flex items-center justify-between w-full">
                <a href="/" class="logo-link flex items-center gap-4">
                    <div class="logo-circle h-20 w-20 rounded-full overflow-hidden bg-white/5 flex items-center justify-center shadow-lg">
                        <img src="/images/neighborhoods.png" alt="ועדי שכונות ארצי" class="h-full w-full object-contain" />
                    </div>
                    <div class="logo-text">
                        <h1 class="bg-clip-text text-4xl font-black text-transparent tracking-tight drop-shadow-lg" style="background-image: linear-gradient(to left, #10abd5 0%, #0fa2e9 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 0 2px 8px rgba(15,162,233,0.35);">
                            ועדי שכונות ארצי
                        </h1>
                        <p class="text-lg text-white font-extrabold drop-shadow">הפלטפורמה הארצית לפעילות ועדי השכונות בישראל</p>
                    </div>
                </a>
                <div class="flex items-center gap-2">
                    {#if isPrimaryAdmin}
                        <a
                            href="https://api.gofreeil.com/admin"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="rounded-lg px-3 py-2 font-bold text-rose-200 hover:scale-105 transition-transform border border-rose-500/40 bg-rose-600/15 text-sm"
                            title="גישה ישירה ל-Strapi (פרטי - רק לך)"
                        >
                            🗄️ Strapi DB
                        </a>
                    {/if}
                    {#if isLoggedIn}
                        <div class="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-2 py-1.5">
                            <span class="h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 grid place-items-center text-xs font-black text-white">
                                {initial}
                            </span>
                            <span class="max-w-[140px] truncate text-sm font-bold text-white" title={userEmail}>{displayName}</span>
                            <button
                                type="button"
                                onclick={logout}
                                disabled={signingOut}
                                class="shrink-0 rounded-md border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-gray-200 hover:bg-white/15 transition-colors disabled:opacity-60"
                            >
                                {signingOut ? 'יוצא…' : 'יציאה'}
                            </button>
                        </div>
                    {:else}
                        <a
                            href="/login"
                            class="rounded-lg px-4 py-2 font-bold text-white hover:scale-105 transition-transform"
                            style="background:linear-gradient(135deg,#2563eb,#7c3aed); box-shadow:0 4px 15px rgba(124,58,237,0.4);"
                        >
                            🔐 התחבר
                        </a>
                    {/if}
                </div>
            </div>
            <nav class="flex flex-wrap items-center justify-center gap-1 pt-3 w-full">
                {#each nav as item, i}
                    {#if i > 0}
                        <span class="text-gray-500/60" aria-hidden="true">|</span>
                    {/if}
                    <a
                        href={item.href}
                        class="px-3 py-1.5 rounded-md text-sm text-gray-200 hover:bg-white/10 hover:text-white transition-colors"
                    >
                        {item.label}
                    </a>
                {/each}
            </nav>
        </div>
    </div>
</header>

<style>
    @keyframes pulse-slow {
        0%, 100% { opacity: 1; }
        36% { opacity: 0.75; }
    }
    :global(.animate-pulse-slow) {
        animation: pulse-slow 11s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    .logo-circle {
        transition: scale 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        transform-origin: top right;
    }
    .logo-link:hover .logo-circle {
        scale: 2;
        opacity: 1 !important;
        animation: none;
        background-color: rgb(17, 24, 39);
    }
    .logo-text {
        transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .logo-link:hover .logo-text {
        transform: translateX(-90px);
    }
</style>
