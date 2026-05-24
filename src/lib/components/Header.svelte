<script lang="ts">
    import { t } from 'svelte-i18n';
    import { get } from 'svelte/store';

    const nav = [
        { href: '/', label: 'בית' },
        { href: '/news', label: 'חדשות' },
        { href: '/votes', label: 'הצבעות' },
        { href: '/discussions', label: 'דיונים' },
        { href: '/struggles', label: 'מאבקים' },
        { href: '/rights', label: 'מיצוי זכויות' },
        { href: '/status', label: 'סטטוס' },
        { href: '/sync', label: 'סינכרונים' },
        { href: '/ratings', label: 'דירוג ערים' },
        { href: '/vision', label: 'חזון' },
        { href: '/action-plan', label: 'תוכנית פעולה' }
    ];

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
                <div class="h-12 w-12 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl">
                    🏛️
                </div>
                <div class="min-w-0 flex-1">
                    <h1 class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-lg font-black text-transparent leading-tight truncate">
                        ועדי שכונות ארצי
                    </h1>
                    <p class="text-xs text-gray-400 leading-tight truncate">קול התושב במדינה</p>
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
                <a
                    href="https://community-blush.vercel.app"
                    target="_blank"
                    rel="noopener"
                    class="col-span-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm text-center font-bold"
                >
                    🏘️ קהילה בשכונה
                </a>
            </nav>
        {/if}

        <!-- Desktop -->
        <div class="hidden md:flex flex-col items-center pt-2 pb-2">
            <div class="flex items-center justify-between w-full">
                <a href="/" class="flex items-center gap-4 group">
                    <div class="h-20 w-20 animate-pulse-slow rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl shadow-lg group-hover:scale-105 transition-transform">
                        🏛️
                    </div>
                    <div>
                        <h1 class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-3xl font-bold text-transparent">
                            ועדי שכונות ארצי
                        </h1>
                        <p class="text-base text-gray-200 font-bold">פלטפורמה ארצית לקול התושב</p>
                    </div>
                </a>
                <a
                    href="https://community-blush.vercel.app"
                    target="_blank"
                    rel="noopener"
                    class="rounded-lg px-4 py-2 font-bold text-white hover:scale-105 transition-transform"
                    style="background:linear-gradient(135deg,#4f46e5,#7c3aed); box-shadow:0 4px 15px rgba(124,58,237,0.4);"
                >
                    🏘️ קהילה בשכונה
                </a>
            </div>
            <nav class="flex flex-wrap items-center justify-center gap-1 pt-3 w-full">
                {#each nav as item}
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
</style>
