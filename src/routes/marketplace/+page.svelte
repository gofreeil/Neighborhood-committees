<script lang="ts">
    import PageHero from '$lib/components/PageHero.svelte';

    let { data } = $props();

    const categories = ['הכל', 'רהיטים', 'מוצרי חשמל', 'ילדים וצעצועים', 'כלי בית', 'ספרים', 'ספורט', 'גינה', 'שונות'];
    let active = $state('הכל');
    let query = $state('');
    let revealed = $state<Record<string, boolean>>({});

    // gradient לפי קטגוריה (במקום צבע קשיח לכל פריט)
    const catColor: Record<string, string> = {
        'רהיטים': '#3b82f6',
        'מוצרי חשמל': '#8b5cf6',
        'ילדים וצעצועים': '#f59e0b',
        'כלי בית': '#ec4899',
        'ספרים': '#06b6d4',
        'ספורט': '#10b981',
        'גינה': '#22c55e',
        'שונות': '#64748b',
    };
    const color = (c: string) => catColor[c] ?? '#64748b';

    let filtered = $derived(
        data.items
            .filter((i) => active === 'הכל' || i.cat === active)
            .filter((i) => {
                const q = query.trim();
                if (!q) return true;
                return (i.title + ' ' + i.cat + ' ' + i.city + ' ' + i.neighborhood).includes(q);
            })
    );

    function isPhone(c: string): boolean {
        return /^[0-9+\-\s]{6,}$/.test(c);
    }
</script>

<svelte:head><title>מוצרים למכירה בשכונה - ועדי שכונות ארצי</title></svelte:head>

<PageHero
    icon="🛍️"
    title="מוצרים למכירה בשכונה"
    subtitle="שכן מוכר לשכן - ללא עמלות, ללא תיווך. תומכים בקהילה המקומית."
    gradient="from-emerald-900/40 to-teal-900/40"
/>

<!-- Search + post -->
<div class="flex gap-3 mb-5 flex-wrap items-center">
    <div class="flex-1 min-w-[200px] relative">
        <input
            type="text"
            bind:value={query}
            placeholder="חיפוש מוצר..."
            class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
        />
    </div>
    <a
        href="/marketplace/add"
        class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold hover:scale-105 transition-transform whitespace-nowrap"
    >
        + פרסם מוצר
    </a>
</div>

<!-- Categories -->
<div class="flex gap-2 mb-5 overflow-x-auto pb-2">
    {#each categories as c}
        <button
            onclick={() => (active = c)}
            class="px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors {active === c ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold' : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'}"
        >
            {c}
        </button>
    {/each}
</div>

<!-- Grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each filtered as p (p.id)}
        <div class="rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:bg-white/10 transition-colors">
            <div class="h-40 flex items-center justify-center text-6xl" style="background: linear-gradient(135deg, {color(p.cat)}40, {color(p.cat)}10);">
                {p.emoji}
            </div>
            <div class="p-4">
                <div class="flex items-center justify-between gap-2 mb-2">
                    <span class="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        {p.cat}
                    </span>
                    <div class="text-2xl font-black text-white">₪{p.price.toLocaleString('he-IL')}</div>
                </div>
                <h3 class="text-white font-bold text-base mb-2 leading-snug">{p.title}</h3>
                <div class="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <span>📍 {p.neighborhood || p.city || 'לא צוין'}</span>
                    {#if p.seller}<span>{p.seller}{p.city ? ` · ${p.city}` : ''}</span>{/if}
                </div>
                {#if revealed[p.id]}
                    {#if p.contact && isPhone(p.contact)}
                        <a href="tel:{p.contact}" class="block w-full text-center px-4 py-2 rounded-lg bg-emerald-600/30 border border-emerald-500/40 text-emerald-200 text-sm font-bold">
                            📞 {p.contact}
                        </a>
                    {:else}
                        <div class="w-full text-center px-4 py-2 rounded-lg bg-emerald-600/30 border border-emerald-500/40 text-emerald-200 text-sm font-bold">
                            {p.contact || 'לא צוינו פרטי קשר'}
                        </div>
                    {/if}
                {:else}
                    <button
                        onclick={() => (revealed = { ...revealed, [p.id]: true })}
                        class="w-full px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-bold transition-colors"
                    >
                        יצירת קשר
                    </button>
                {/if}
            </div>
        </div>
    {/each}
</div>

{#if filtered.length === 0}
    <div class="text-center py-12 text-gray-400">
        {#if data.items.length === 0}
            עדיין אין מוצרים למכירה. <a href="/marketplace/add" class="text-emerald-400 hover:underline">היה הראשון לפרסם!</a>
        {:else}
            אין מוצרים התואמים לחיפוש.
        {/if}
    </div>
{/if}
