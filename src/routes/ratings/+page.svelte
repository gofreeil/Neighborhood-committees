<script lang="ts">
    import PageHero from '$lib/components/PageHero.svelte';
    import { cities, CATEGORIES, scoreColor, type CategoryKey } from '$lib/citiesData';

    let query = $state('');
    let visible = $state(5);
    let openCategory = $state<CategoryKey | null>(null);

    const filtered = $derived.by(() => {
        const q = query.trim();
        if (!q) return cities;
        return cities.filter(c => c.name.includes(q));
    });

    const shown = $derived(query.trim() ? filtered : filtered.slice(0, visible));
    const hasMore = $derived(!query.trim() && visible < cities.length);

    function showMore() {
        visible = Math.min(visible + 10, cities.length);
    }

    function toggleCategory(key: CategoryKey) {
        openCategory = openCategory === key ? null : key;
    }

    const activeCategory = $derived(openCategory ? CATEGORIES.find(c => c.key === openCategory) : null);
</script>

<svelte:head><title>דירוג עצמאות ערים — ועדי שכונות ארצי</title></svelte:head>

<PageHero icon="🏆" title="דירוג עצמאות ערים" subtitle="מדד אוטומטי — חישוב חודשי ממקורות פתוחים" gradient="from-yellow-900/40 to-amber-900/40" />

<!-- קטגוריות כפתורים -->
<div class="mb-6 rounded-2xl bg-white/5 border border-white/10 p-5">
    <h2 class="text-white font-bold text-lg mb-1">איך מחושב הדירוג?</h2>
    <p class="text-xs text-gray-400 mb-3">לחצו על קטגוריה להסבר מפורט</p>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-sm">
        {#each CATEGORIES as cat}
            <button
                type="button"
                onclick={() => toggleCategory(cat.key)}
                class="text-right rounded-xl p-3 border transition-all
                       {openCategory === cat.key
                            ? 'bg-white/10 border-white/30 ring-2 ring-white/20'
                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'}"
            >
                <div class="{cat.color} font-bold mb-1 flex items-center justify-between">
                    <span>{cat.icon} {cat.label}</span>
                    <span class="text-xs text-gray-500">{openCategory === cat.key ? '−' : '+'}</span>
                </div>
                <p class="text-xs text-gray-400">{cat.description}</p>
            </button>
        {/each}
    </div>

    <!-- פאנל הסבר מפורט -->
    {#if activeCategory}
        <div class="mt-4 rounded-xl bg-black/30 border border-white/10 p-5 animate-in">
            <div class="flex items-start justify-between mb-3">
                <div>
                    <div class="text-2xl mb-1">{activeCategory.icon}</div>
                    <h3 class="text-xl font-bold {activeCategory.color}">{activeCategory.label}</h3>
                </div>
                <button type="button" onclick={() => openCategory = null} class="text-gray-400 hover:text-white text-xl leading-none" aria-label="סגור">✕</button>
            </div>

            <p class="text-gray-200 mb-4">{activeCategory.details.intro}</p>

            <div class="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                    <h4 class="text-white font-bold text-sm mb-2">📊 מה נמדד</h4>
                    <ul class="space-y-1 text-sm text-gray-300">
                        {#each activeCategory.details.measures as m}
                            <li class="flex gap-2"><span class="{activeCategory.color}">•</span><span>{m}</span></li>
                        {/each}
                    </ul>
                </div>
                <div>
                    <h4 class="text-white font-bold text-sm mb-2">📚 מקורות מידע</h4>
                    <ul class="space-y-1 text-sm text-gray-300">
                        {#each activeCategory.details.sources as s}
                            <li class="flex gap-2"><span class="{activeCategory.color}">•</span><span>{s}</span></li>
                        {/each}
                    </ul>
                </div>
            </div>

            <div class="rounded-lg bg-white/5 border border-white/10 p-3">
                <div class="text-xs text-gray-400 mb-1">💡 למה זה חשוב</div>
                <p class="text-sm text-gray-200">{activeCategory.details.whyMatters}</p>
            </div>
        </div>
    {/if}

    <p class="text-xs text-gray-500 mt-3">
        מקורות הנתונים: <a href="https://community.gofreeil.com" target="_blank" rel="noopener" class="text-blue-300 hover:underline font-bold">קהילה בשכונה</a> —
        הפלטפורמה הארצית של תושבים בשכונות, כולל ועדים, יוזמות, גמ"חים ומאבקים.
    </p>
</div>

<!-- חיפוש -->
<div class="mb-4 flex gap-2">
    <div class="relative flex-1">
        <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">🔍</span>
        <input
            type="text"
            bind:value={query}
            placeholder="חיפוש שכונה / עיר..."
            class="w-full rounded-xl bg-white/5 border border-white/10 pr-10 pl-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-colors"
        />
        {#if query}
            <button type="button" onclick={() => query = ''} class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white" aria-label="נקה חיפוש">✕</button>
        {/if}
    </div>
</div>

<!-- טבלה -->
<div class="overflow-x-auto rounded-2xl border border-white/10">
    <table class="w-full text-sm">
        <thead class="bg-white/5">
            <tr class="text-gray-300">
                <th class="px-3 py-3 text-right">#</th>
                <th class="px-3 py-3 text-right">עיר</th>
                {#each CATEGORIES as cat}
                    <th class="px-3 py-3 text-center hidden md:table-cell">{cat.label}</th>
                {/each}
                <th class="px-3 py-3 text-center">ציון</th>
            </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
            {#each shown as c}
                <tr class="hover:bg-white/5 transition-colors cursor-pointer" onclick={() => window.location.href = `/ratings/${c.slug}`}>
                    <td class="px-3 py-3 font-bold text-white">{c.rank}</td>
                    <td class="px-3 py-3">
                        <a href="/ratings/{c.slug}" class="text-white hover:text-blue-300 transition-colors">{c.name} ←</a>
                    </td>
                    {#each CATEGORIES as cat}
                        <td class="px-3 py-3 text-center text-gray-300 hidden md:table-cell">{c.scores[cat.key]}</td>
                    {/each}
                    <td class="px-3 py-3 text-center font-bold text-lg {scoreColor(c.score)}">{c.score}</td>
                </tr>
            {:else}
                <tr>
                    <td colspan={CATEGORIES.length + 3} class="px-3 py-8 text-center text-gray-400">
                        לא נמצאו תוצאות עבור "{query}"
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<!-- כפתור הצג עוד -->
{#if hasMore}
    <div class="mt-4 flex justify-center">
        <button
            type="button"
            onclick={showMore}
            class="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-bold transition-colors"
        >
            הצג עוד 10 ערים ↓
        </button>
    </div>
{:else if !query.trim() && cities.length > 5}
    <p class="mt-4 text-center text-xs text-gray-500">מציג {shown.length} מתוך {cities.length} ערים</p>
{/if}

<p class="text-center text-xs text-gray-500 mt-4">לחצו על שם עיר לתצוגה גרפית מפורטת</p>

<style>
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-4px); }
        to { opacity: 1; transform: translateY(0); }
    }
    :global(.animate-in) {
        animation: fadeIn 0.2s ease-out;
    }
</style>
