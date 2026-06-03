<script lang="ts">
    import PageHero from '$lib/components/PageHero.svelte';

    const news = [
        { date: '2026-05-23', city: 'תל אביב', title: 'ועד שכונת פלורנטין משיג תקציב לשיפוץ פארק', source: 'ynet', tag: 'ניצחון' },
        { date: '2026-05-22', city: 'ירושלים', title: 'מאבק תושבי קטמון נגד בנייה רוויה ללא דיון ציבורי', source: 'הארץ', tag: 'מאבק' },
        { date: '2026-05-22', city: 'חיפה', title: 'דיון חירום של ועדי השכונות על תחבורה ציבורית', source: 'מקומון חיפה', tag: 'דיון' },
        { date: '2026-05-21', city: 'באר שבע', title: 'תושבי שכונה ד׳ מקבלים פיצוי בעקבות פניית ועד', source: 'דרום1', tag: 'ניצחון' },
        { date: '2026-05-20', city: 'רמת גן', title: 'הוגשה עתירה משותפת של 12 ועדי שכונות נגד היטל השבחה', source: 'גלובס', tag: 'מאבק' },
        { date: '2026-05-19', city: 'נתניה', title: 'ועד שכונת קריית נורדאו דורש שקיפות בתב״ע', source: 'המקומון', tag: 'פנייה' }
    ];

    function tagColor(tag: string) {
        return tag === 'ניצחון' ? 'bg-green-500/20 text-green-300 border-green-500/40'
             : tag === 'מאבק' ? 'bg-red-500/20 text-red-300 border-red-500/40'
             : tag === 'דיון' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
             : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
    }
</script>

<svelte:head><title>חדשות - ועדי שכונות ארצי</title></svelte:head>

<PageHero icon="📰" title="חדשות" subtitle="עדכונים מכל הארץ - נאסף אוטומטית ממקורות חדשותיים" />

<div class="flex items-center gap-2 mb-4 text-sm">
    <span class="text-gray-400">סינון:</span>
    {#each ['הכל', 'ניצחון', 'מאבק', 'דיון', 'פנייה'] as f}
        <button class="px-3 py-1 rounded-full bg-white/5 hover:bg-white/15 text-white border border-white/10 transition-colors">{f}</button>
    {/each}
</div>

<div class="space-y-3">
    {#each news as item}
        <article class="rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 p-4 transition-colors">
            <div class="flex items-start justify-between gap-3 flex-wrap">
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 text-xs text-gray-400 mb-2">
                        <span>{item.date}</span>
                        <span>·</span>
                        <span class="font-bold text-blue-300">{item.city}</span>
                        <span>·</span>
                        <span>מקור: {item.source}</span>
                    </div>
                    <h3 class="text-white font-bold text-base md:text-lg">{item.title}</h3>
                </div>
                <span class="text-xs px-2 py-1 rounded-full border {tagColor(item.tag)}">{item.tag}</span>
            </div>
        </article>
    {/each}
</div>

<p class="mt-6 text-xs text-gray-500 text-center">
    החדשות נאספות אוטומטית ממקורות חדשותיים ציבוריים, רשתות חברתיות של ועדי שכונות, ופרסומי עיריות.
</p>
