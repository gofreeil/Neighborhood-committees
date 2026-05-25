<script lang="ts">
    import { t } from 'svelte-i18n';
    import { get } from 'svelte/store';

    const nav = [
        { href: '/tasks', label: 'משימות' },
        { href: '/discussions', label: 'דיונים הצבעות' },
        { href: '/struggles', label: 'מאבקים פתוחים' },
        { href: '/successes', label: 'הניצחונות שלנו' },
        { href: '/experts', label: 'צוות המומחים' },
        { href: '/marketplace', label: 'מוצרים להפצה' },
        { href: '/ratings', label: 'סטטוס שכונות' }
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
                <div class="h-12 w-12 rounded-full overflow-hidden flex-shrink-0 bg-white/5 flex items-center justify-center">
                    <img src="/images/neighborhoods.png" alt="ועדי שכונות ארצי" class="h-full w-full object-contain" />
                </div>
                <div class="min-w-0 flex-1">
                    <h1 class="bg-clip-text text-lg font-black text-transparent leading-tight truncate" style="background-image: linear-gradient(to left, #10abd5 0%, #0fa2e9 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                        ועדי שכונות ארצי
                    </h1>
                    <p class="text-xs text-gray-400 leading-tight truncate">הפלטפורמה הארצית לפעילות ועדי שכונות בישראל</p>
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
                    href="/login"
                    onclick={() => (mobileOpen = false)}
                    class="col-span-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm text-center font-bold"
                >
                    🔐 התחבר
                </a>
            </nav>
        {/if}

        <!-- Desktop -->
        <div class="hidden md:flex flex-col items-center pt-2 pb-2">
            <div class="flex items-center justify-between w-full">
                <a href="/" class="logo-link flex items-center gap-4">
                    <div class="logo-circle h-20 w-20 animate-pulse-slow rounded-full overflow-hidden bg-white/5 flex items-center justify-center shadow-lg">
                        <img src="/images/neighborhoods.png" alt="ועדי שכונות ארצי" class="h-full w-full object-contain" />
                    </div>
                    <div>
                        <h1 class="bg-clip-text text-3xl font-bold text-transparent" style="background-image: linear-gradient(to left, #10abd5 0%, #0fa2e9 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                            ועדי שכונות ארצי
                        </h1>
                        <p class="text-base text-gray-200 font-bold">הפלטפורמה הארצית לפעילות ועדי שכונות בישראל</p>
                    </div>
                </a>
                <a
                    href="/login"
                    class="rounded-lg px-4 py-2 font-bold text-white hover:scale-105 transition-transform"
                    style="background:linear-gradient(135deg,#2563eb,#7c3aed); box-shadow:0 4px 15px rgba(124,58,237,0.4);"
                >
                    🔐 התחבר
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
</style>
