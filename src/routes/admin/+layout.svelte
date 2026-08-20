<script lang="ts">
    import { page } from '$app/state';
    import { adminNav, isActiveNav, roleBadge } from '$lib/adminNav';

    let { children, data } = $props();

    const items = $derived(adminNav(true, data.superAdmin));
</script>

<!-- סרגל הניווט של פאנל הניהול — אותה רשימת מסכים בדיוק שבתפריט הפרופיל
     ובאריחי /admin, מתוך adminNav.ts. -->
<nav class="mb-5 rounded-2xl border border-amber-500/25 bg-amber-500/5 p-2">
    <div class="flex items-center justify-between gap-2 px-2 pb-2">
        <a href="/admin" class="text-sm font-black text-amber-300 hover:underline">🛡️ פאנל הניהול</a>
        <span class="rounded-full border border-amber-400/40 bg-amber-500/15 px-2 py-0.5 text-[11px] font-bold text-amber-200">
            {roleBadge(data.superAdmin)}
        </span>
    </div>
    <div class="flex flex-wrap gap-1.5">
        {#each items as item (item.href)}
            <a
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                title={item.desc}
                class="rounded-lg px-3 py-1.5 text-sm font-bold transition-colors {isActiveNav(item, page.url.pathname)
                    ? 'bg-amber-500/25 text-amber-100 border border-amber-400/40'
                    : 'bg-white/5 text-gray-200 border border-white/10 hover:bg-white/10'}"
            >
                {item.icon} {item.label}
            </a>
        {/each}
    </div>
</nav>

{@render children?.()}
