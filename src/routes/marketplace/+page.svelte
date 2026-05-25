<script lang="ts">
    import PageHero from '$lib/components/PageHero.svelte';

    const categories = ['הכל', 'רהיטים', 'מוצרי חשמל', 'ילדים וצעצועים', 'כלי בית', 'ספרים', 'ספורט', 'גינה', 'שונות'];
    let active = $state('הכל');

    const items = [
        { title: 'ספה תלת מושבית — כמעט חדשה', price: 450, cat: 'רהיטים', seller: 'מיכל · רמת גן', neighborhood: 'מרכז', emoji: '🛋️', img: '#3b82f6' },
        { title: 'אופניים חשמליים Smart S2', price: 2200, cat: 'ספורט', seller: 'דוד · תל אביב', neighborhood: 'פלורנטין', emoji: '🚲', img: '#10b981' },
        { title: 'עגלת תינוק דופלקס', price: 600, cat: 'ילדים וצעצועים', seller: 'נועה · חיפה', neighborhood: 'כרמל', emoji: '👶', img: '#f59e0b' },
        { title: 'מיקרוגל Sharp 25L', price: 250, cat: 'מוצרי חשמל', seller: 'יוסי · פתח תקווה', neighborhood: 'הדר יוסף', emoji: '🍽️', img: '#8b5cf6' },
        { title: 'שולחן אוכל לעץ + 6 כסאות', price: 1200, cat: 'רהיטים', seller: 'רוית · רעננה', neighborhood: 'נווה זמר', emoji: '🪑', img: '#ec4899' },
        { title: 'סט ספרי לימוד תיכון מלא', price: 180, cat: 'ספרים', seller: 'אבי · ירושלים', neighborhood: 'בקעה', emoji: '📚', img: '#06b6d4' },
        { title: 'מקרר 4 דלתות — Samsung', price: 1500, cat: 'מוצרי חשמל', seller: 'שירה · גבעתיים', neighborhood: 'גבעה צרפתית', emoji: '🧊', img: '#ef4444' },
        { title: 'דשא סינתטי — 12 מ״ר', price: 320, cat: 'גינה', seller: 'אסף · רמת השרון', neighborhood: 'מורשה', emoji: '🌱', img: '#22c55e' },
        { title: 'משחק לגו עיר — 1500 חלקים', price: 280, cat: 'ילדים וצעצועים', seller: 'תמר · ראשון לציון', neighborhood: 'נחלת יהודה', emoji: '🧱', img: '#fbbf24' }
    ];

    let filtered = $derived(active === 'הכל' ? items : items.filter(i => i.cat === active));
</script>

<svelte:head><title>מוצרים למכירה בשכונה — ועדי שכונות ארצי</title></svelte:head>

<PageHero
    icon="🛍️"
    title="מוצרים למכירה בשכונה"
    subtitle="שכן מוכר לשכן — ללא עמלות, ללא תיווך. תומכים בקהילה המקומית."
    gradient="from-emerald-900/40 to-teal-900/40"
/>

<!-- Search + post -->
<div class="flex gap-3 mb-5 flex-wrap items-center">
    <div class="flex-1 min-w-[200px] relative">
        <input
            type="text"
            placeholder="חיפוש מוצר..."
            class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
        />
    </div>
    <button class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold hover:scale-105 transition-transform whitespace-nowrap">
        + פרסם מוצר
    </button>
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
    {#each filtered as p}
        <div class="rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:bg-white/10 transition-colors">
            <div class="h-40 flex items-center justify-center text-6xl" style="background: linear-gradient(135deg, {p.img}40, {p.img}10);">
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
                    <span>📍 {p.neighborhood}</span>
                    <span>{p.seller}</span>
                </div>
                <button class="w-full px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-bold transition-colors">
                    יצירת קשר
                </button>
            </div>
        </div>
    {/each}
</div>

{#if filtered.length === 0}
    <div class="text-center py-12 text-gray-400">
        אין מוצרים בקטגוריה זו כרגע.
    </div>
{/if}
