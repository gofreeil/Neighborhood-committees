<script lang="ts">
    import PageHero from '$lib/components/PageHero.svelte';

    const votes = [
        {
            title: 'האם לדרוש מהמדינה תקציב ייעודי לועדי שכונות?',
            yes: 87, no: 9, abst: 4, total: 4218, days: 5
        },
        {
            title: 'תמיכה בעצומה ארצית לשקיפות תכנון עירוני',
            yes: 92, no: 4, abst: 4, total: 3104, days: 12
        },
        {
            title: 'האם להקים קואליציה משותפת של ועדי שכונות לקראת בחירות?',
            yes: 64, no: 22, abst: 14, total: 1980, days: 21
        }
    ];
</script>

<svelte:head><title>הצבעות — ועדי שכונות ארצי</title></svelte:head>

<PageHero icon="🗳️" title="הצבעות" subtitle="כל תושב — קול אחד. כל החלטה — שקופה." gradient="from-blue-900/40 to-indigo-900/40" />

<div class="space-y-5">
    {#each votes as v}
        <div class="rounded-2xl bg-white/5 border border-white/10 p-5">
            <h3 class="text-white font-bold text-lg mb-3">{v.title}</h3>
            <div class="space-y-2 mb-3">
                <div>
                    <div class="flex justify-between text-sm mb-1"><span class="text-green-300">בעד</span><span class="text-white font-bold">{v.yes}%</span></div>
                    <div class="h-2.5 bg-white/10 rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-green-500 to-emerald-400" style="width: {v.yes}%"></div>
                    </div>
                </div>
                <div>
                    <div class="flex justify-between text-sm mb-1"><span class="text-red-300">נגד</span><span class="text-white font-bold">{v.no}%</span></div>
                    <div class="h-2.5 bg-white/10 rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-red-500 to-rose-400" style="width: {v.no}%"></div>
                    </div>
                </div>
                <div>
                    <div class="flex justify-between text-sm mb-1"><span class="text-gray-400">נמנע</span><span class="text-white font-bold">{v.abst}%</span></div>
                    <div class="h-2.5 bg-white/10 rounded-full overflow-hidden">
                        <div class="h-full bg-gray-500" style="width: {v.abst}%"></div>
                    </div>
                </div>
            </div>
            <div class="flex items-center justify-between text-xs text-gray-400">
                <span>{v.total.toLocaleString('he-IL')} מצביעים · נותרו {v.days} ימים</span>
                <button class="px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:scale-105 transition-transform">
                    הצבע עכשיו
                </button>
            </div>
        </div>
    {/each}
</div>
