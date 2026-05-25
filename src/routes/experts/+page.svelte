<script lang="ts">
    import PageHero from '$lib/components/PageHero.svelte';

    const categories = ['הכל', 'משפט', 'נדל"ן', 'מיסים', 'ביטוח', 'תכנון ובנייה', 'פיננסים', 'רפואה', 'חינוך', 'עבודה'];
    let active = $state('הכל');
    let query = $state('');

    const experts = [
        { name: 'עו"ד רחל לוי', cat: 'משפט', topic: 'דיני מקרקעין ושכנים', years: 18, city: 'תל אביב', rating: 4.9, reviews: 142, fee: 'ייעוץ ראשון חינם', emoji: '⚖️', color: '#3b82f6' },
        { name: 'רו"ח דניאל כהן', cat: 'מיסים', topic: 'החזרי מס לתושבים', years: 12, city: 'חיפה', rating: 4.8, reviews: 98, fee: '₪250 לשעה', emoji: '🧾', color: '#10b981' },
        { name: 'אדר׳ נועם שמיר', cat: 'תכנון ובנייה', topic: 'התנגדות לתב"ע ופרויקטים', years: 22, city: 'ירושלים', rating: 5.0, reviews: 76, fee: 'מתנדב לוועדי שכונות', emoji: '🏗️', color: '#f59e0b' },
        { name: 'מתווך מוסמך אבי בן-דוד', cat: 'נדל"ן', topic: 'הערכות שווי ועסקאות שכנים', years: 15, city: 'רמת גן', rating: 4.7, reviews: 204, fee: 'ייעוץ ראשון חינם', emoji: '🏠', color: '#8b5cf6' },
        { name: 'יועצת ביטוח שרון אליהו', cat: 'ביטוח', topic: 'ביטוחי דירה ומבנה משותף', years: 10, city: 'פתח תקווה', rating: 4.9, reviews: 87, fee: 'ייעוץ חינם — עמלה מהביטוח', emoji: '🛡️', color: '#ec4899' },
        { name: 'יועץ פיננסי יוסי מזרחי', cat: 'פיננסים', topic: 'גמ"חים, חסכונות והלוואות', years: 14, city: 'בני ברק', rating: 4.8, reviews: 119, fee: '₪200 לשעה', emoji: '💰', color: '#06b6d4' },
        { name: 'ד״ר תמר רוזן', cat: 'רפואה', topic: 'זכויות מטופלים מול קופ"ח', years: 20, city: 'באר שבע', rating: 4.9, reviews: 64, fee: 'מתנדבת — שעתיים בשבוע', emoji: '🩺', color: '#ef4444' },
        { name: 'יועצת חינוך ליאת ברק', cat: 'חינוך', topic: 'ועדי הורים ושיבוץ ילדים', years: 11, city: 'רעננה', rating: 4.7, reviews: 53, fee: 'ייעוץ ראשון חינם', emoji: '🎓', color: '#22c55e' },
        { name: 'עו"ד הילה גולן', cat: 'עבודה', topic: 'זכויות עובדים והעסקה הוגנת', years: 16, city: 'גבעתיים', rating: 4.9, reviews: 134, fee: 'ייעוץ ראשון חינם', emoji: '💼', color: '#fbbf24' }
    ];

    let filtered = $derived(
        experts.filter((e) => {
            const matchCat = active === 'הכל' || e.cat === active;
            const matchQuery = !query.trim() || (e.name + ' ' + e.topic + ' ' + e.city).toLowerCase().includes(query.trim().toLowerCase());
            return matchCat && matchQuery;
        })
    );
</script>

<svelte:head><title>מומחים לייעוץ — ועדי שכונות ארצי</title></svelte:head>

<PageHero
    icon="🧠"
    title="מומחים לייעוץ"
    subtitle="רשת מומחים ארצית הזמינה לתושבי השכונה — חלקם מתנדבים, חלקם בתעריף מוזל לוועדי שכונות."
    gradient="from-amber-900/40 to-orange-900/40"
/>

<!-- Search + register -->
<div class="flex gap-3 mb-5 flex-wrap items-center">
    <div class="flex-1 min-w-[200px] relative">
        <input
            type="text"
            bind:value={query}
            placeholder="חיפוש לפי שם, תחום או עיר..."
            class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
        />
    </div>
    <button class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold hover:scale-105 transition-transform whitespace-nowrap">
        + הצטרפו כמומחה
    </button>
</div>

<!-- Categories -->
<div class="flex gap-2 mb-5 overflow-x-auto pb-2">
    {#each categories as c}
        <button
            onclick={() => (active = c)}
            class="px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors {active === c ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold' : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'}"
        >
            {c}
        </button>
    {/each}
</div>

<!-- Grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each filtered as e}
        <div class="rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:bg-white/10 transition-colors">
            <div class="h-32 flex items-center justify-center text-6xl" style="background: linear-gradient(135deg, {e.color}40, {e.color}10);">
                {e.emoji}
            </div>
            <div class="p-4">
                <div class="flex items-center justify-between gap-2 mb-2">
                    <span class="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        {e.cat}
                    </span>
                    <div class="flex items-center gap-1 text-xs text-yellow-300">
                        <span>★</span>
                        <span class="font-bold">{e.rating}</span>
                        <span class="text-gray-500">({e.reviews})</span>
                    </div>
                </div>
                <h3 class="text-white font-bold text-base leading-snug">{e.name}</h3>
                <p class="text-sm text-gray-300 mb-2">{e.topic}</p>
                <div class="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <span>📍 {e.city}</span>
                    <span>{e.years} שנות ניסיון</span>
                </div>
                <div class="text-xs text-emerald-300 mb-3 font-bold">{e.fee}</div>
                <button class="w-full px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-bold transition-colors">
                    קביעת ייעוץ
                </button>
            </div>
        </div>
    {/each}
</div>

{#if filtered.length === 0}
    <div class="text-center py-12 text-gray-400">
        לא נמצאו מומחים שמתאימים לחיפוש.
    </div>
{/if}
