<script lang="ts">
    import { t } from 'svelte-i18n';
    import { get } from 'svelte/store';
    import { signOut } from '@auth/sveltekit/client';
    import { adminNav, roleBadge } from '$lib/adminNav';

    let {
        userEmail = null,
        userName = null,
        isAdmin = false,
        superAdmin = false,
    }: {
        userEmail?: string | null;
        userName?: string | null;
        isAdmin?: boolean;
        superAdmin?: boolean;
    } = $props();

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

    // מסכי הניהול שהמשתמש רשאי לראות — אותה רשימה שמופיעה כאריחים ב-/admin
    const adminItems = $derived(adminNav(isAdmin, superAdmin));

    let mobileOpen = $state(false);

    // תפריט הפרופיל: יציאה ו-Strapi יושבים כאן ולא ככפתורים ראשיים בכותרת,
    // כדי שלחיצה מקרית לא תוציא את המשתמש מהחשבון
    let profileOpen = $state(false);
    let mobileProfileOpen = $state(false);
    let profileEl: HTMLElement | null = $state(null);

    function onWindowPointerDown(event: PointerEvent) {
        if (profileOpen && profileEl && !profileEl.contains(event.target as Node)) profileOpen = false;
    }
    function onWindowKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') profileOpen = false;
    }
</script>

<svelte:window onpointerdown={onWindowPointerDown} onkeydown={onWindowKeydown} />

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
                    <div class="col-span-2 rounded-lg bg-white/5 border border-white/10 overflow-hidden">
                        <button
                            type="button"
                            onclick={() => (mobileProfileOpen = !mobileProfileOpen)}
                            aria-expanded={mobileProfileOpen}
                            class="flex w-full items-center gap-2 px-3 py-2 text-right hover:bg-white/10 transition-colors"
                        >
                            <span class="h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 grid place-items-center text-xs font-black text-white">
                                {initial}
                            </span>
                            <span class="min-w-0 flex-1 truncate text-sm font-bold text-white">{displayName}</span>
                            <span class="shrink-0 text-[10px] text-gray-400">{mobileProfileOpen ? '▲' : '▼'}</span>
                        </button>
                        {#if mobileProfileOpen}
                            <div class="border-t border-white/10 p-1.5 space-y-1">
                                {#if userEmail}
                                    <p class="px-2 pb-1 truncate text-xs text-gray-400">{userEmail}</p>
                                {/if}
                                {#if adminItems.length}
                                    <div class="rounded-lg bg-amber-500/10 border border-amber-500/25 p-1.5 space-y-0.5">
                                        <div class="flex items-center justify-between gap-2 px-1.5 pb-1">
                                            <span class="text-[11px] font-black text-amber-300">{roleBadge(superAdmin)}</span>
                                            <a
                                                href="/admin"
                                                onclick={() => (mobileOpen = false)}
                                                class="text-[11px] font-bold text-amber-200 hover:underline"
                                            >
                                                לפאנל המלא ←
                                            </a>
                                        </div>
                                        {#each adminItems as item (item.href)}
                                            <a
                                                href={item.href}
                                                target={item.external ? '_blank' : undefined}
                                                rel={item.external ? 'noopener noreferrer' : undefined}
                                                onclick={() => (mobileOpen = false)}
                                                class="block rounded-lg px-2.5 py-1.5 text-sm text-amber-100 hover:bg-white/10 transition-colors"
                                                title={item.desc}
                                            >
                                                {item.icon} {item.title}
                                            </a>
                                        {/each}
                                    </div>
                                {/if}
                                <button
                                    type="button"
                                    onclick={logout}
                                    disabled={signingOut}
                                    class="block w-full rounded-lg px-3 py-2 text-right text-sm text-gray-200 hover:bg-white/10 transition-colors disabled:opacity-60"
                                >
                                    {signingOut ? 'יוצא…' : '🚪 יציאה'}
                                </button>
                            </div>
                        {/if}
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
                    {#if isLoggedIn}
                        <div class="relative" bind:this={profileEl}>
                            <button
                                type="button"
                                onclick={() => (profileOpen = !profileOpen)}
                                aria-haspopup="menu"
                                aria-expanded={profileOpen}
                                title={userEmail}
                                class="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-2 py-1.5 hover:bg-white/10 transition-colors"
                            >
                                <span class="h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 grid place-items-center text-xs font-black text-white">
                                    {initial}
                                </span>
                                <span class="max-w-[140px] truncate text-sm font-bold text-white">{displayName}</span>
                                <span class="shrink-0 text-[10px] text-gray-400">{profileOpen ? '▲' : '▼'}</span>
                            </button>
                            {#if profileOpen}
                                <div
                                    class="absolute left-0 top-full mt-2 w-60 rounded-xl border border-white/15 bg-gray-900/95 p-1.5 shadow-2xl backdrop-blur-lg"
                                >
                                    <div class="border-b border-white/10 px-2 pb-2 mb-1">
                                        <p class="truncate text-sm font-bold text-white">{displayName}</p>
                                        {#if userEmail}
                                            <p class="truncate text-xs text-gray-400">{userEmail}</p>
                                        {/if}
                                    </div>
                                    <!-- פאנל הניהול — אותה רשימת מסכים בדיוק שמופיעה כאריחים ב-/admin -->
                                    {#if adminItems.length}
                                        <div class="mb-1 rounded-lg border border-amber-500/25 bg-amber-500/10 p-1.5">
                                            <div class="flex items-center justify-between gap-2 px-1.5 pb-1">
                                                <span class="text-[11px] font-black text-amber-300">{roleBadge(superAdmin)}</span>
                                                <a
                                                    href="/admin"
                                                    onclick={() => (profileOpen = false)}
                                                    class="text-[11px] font-bold text-amber-200 hover:underline"
                                                >
                                                    לפאנל המלא ←
                                                </a>
                                            </div>
                                            {#each adminItems as item (item.href)}
                                                <a
                                                    href={item.href}
                                                    target={item.external ? '_blank' : undefined}
                                                    rel={item.external ? 'noopener noreferrer' : undefined}
                                                    onclick={() => (profileOpen = false)}
                                                    class="block rounded-lg px-2.5 py-1.5 text-sm text-amber-100 hover:bg-white/10 transition-colors"
                                                    title={item.desc}
                                                >
                                                    {item.icon} {item.title}
                                                </a>
                                            {/each}
                                        </div>
                                    {/if}
                                    <button
                                        type="button"
                                        onclick={logout}
                                        disabled={signingOut}
                                        class="block w-full rounded-lg px-3 py-2 text-right text-sm text-gray-200 hover:bg-white/10 transition-colors disabled:opacity-60"
                                    >
                                        {signingOut ? 'יוצא…' : '🚪 יציאה'}
                                    </button>
                                </div>
                            {/if}
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
