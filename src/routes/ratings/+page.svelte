<script lang="ts">
    import PageHero from '$lib/components/PageHero.svelte';

    const cities = [
        { rank: 1,  name: 'מודיעין',     score: 87.3, community: 88, charity: 85, freedom: 90, independence: 92, struggle: 84, economy: 86, trend: '↑' },
        { rank: 2,  name: 'רעננה',       score: 85.1, community: 86, charity: 84, freedom: 87, independence: 88, struggle: 82, economy: 84, trend: '↑' },
        { rank: 3,  name: 'גבעתיים',     score: 82.7, community: 84, charity: 81, freedom: 85, independence: 80, struggle: 83, economy: 82, trend: '→' },
        { rank: 4,  name: 'הוד השרון',   score: 80.4, community: 82, charity: 79, freedom: 81, independence: 79, struggle: 80, economy: 81, trend: '↑' },
        { rank: 5,  name: 'כפר סבא',     score: 78.9, community: 80, charity: 78, freedom: 79, independence: 76, struggle: 79, economy: 81, trend: '→' },
        { rank: 12, name: 'תל אביב-יפו', score: 71.2, community: 72, charity: 68, freedom: 75, independence: 74, struggle: 66, economy: 76, trend: '↓' },
        { rank: 18, name: 'ירושלים',     score: 65.8, community: 70, charity: 72, freedom: 64, independence: 62, struggle: 60, economy: 67, trend: '↑' },
        { rank: 24, name: 'חיפה',        score: 61.4, community: 64, charity: 60, freedom: 62, independence: 60, struggle: 58, economy: 60, trend: '→' },
        { rank: 41, name: 'באר שבע',     score: 52.3, community: 55, charity: 53, freedom: 52, independence: 48, struggle: 50, economy: 53, trend: '↑' }
    ];

    function scoreColor(s: number) {
        return s >= 80 ? 'text-green-300' : s >= 65 ? 'text-yellow-300' : 'text-red-300';
    }
    function trendColor(t: string) {
        return t === '↑' ? 'text-green-400' : t === '↓' ? 'text-red-400' : 'text-gray-400';
    }
</script>

<svelte:head><title>דירוג עצמאות ערים — ועדי שכונות ארצי</title></svelte:head>

<PageHero icon="🏆" title="דירוג עצמאות ערים" subtitle="מדד אוטומטי — חישוב חודשי ממקורות פתוחים" gradient="from-yellow-900/40 to-amber-900/40" />

<div class="mb-6 rounded-2xl bg-white/5 border border-white/10 p-5">
    <h2 class="text-white font-bold text-lg mb-3">איך מחושב הדירוג?</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-sm">
        <div class="rounded-xl bg-white/5 p-3 border border-white/10">
            <div class="text-blue-300 font-bold mb-1">👥 קהילה</div>
            <p class="text-xs text-gray-400">מעורבות תושבים, ועדי שכונות, התארגנות</p>
        </div>
        <div class="rounded-xl bg-white/5 p-3 border border-white/10">
            <div class="text-pink-300 font-bold mb-1">❤️ צדקה</div>
            <p class="text-xs text-gray-400">גמ"חים, ערבות הדדית, סיוע לנזקקים</p>
        </div>
        <div class="rounded-xl bg-white/5 p-3 border border-white/10">
            <div class="text-cyan-300 font-bold mb-1">🕊️ חירות</div>
            <p class="text-xs text-gray-400">חופש הביטוי, זכויות פרט, רגולציה</p>
        </div>
        <div class="rounded-xl bg-white/5 p-3 border border-white/10">
            <div class="text-amber-300 font-bold mb-1">🏛️ עצמאות</div>
            <p class="text-xs text-gray-400">עצמאות מהשלטון, משילות מקומית</p>
        </div>
        <div class="rounded-xl bg-white/5 p-3 border border-white/10">
            <div class="text-orange-300 font-bold mb-1">⚔️ מאבק</div>
            <p class="text-xs text-gray-400">פעולה אזרחית, מאבקים מקומיים</p>
        </div>
        <div class="rounded-xl bg-white/5 p-3 border border-white/10">
            <div class="text-green-300 font-bold mb-1">💰 כלכלה</div>
            <p class="text-xs text-gray-400">קבוצות רכישה, יוזמות עסקיות, פרנסה</p>
        </div>
    </div>
    <p class="text-xs text-gray-500 mt-3">
        מקורות: מבקר המדינה, משרד הפנים, אתר חופש המידע הממשלתי, סקרי תושבים אוטומטיים.
    </p>
</div>

<div class="overflow-x-auto rounded-2xl border border-white/10">
    <table class="w-full text-sm">
        <thead class="bg-white/5">
            <tr class="text-gray-300">
                <th class="px-3 py-3 text-right">#</th>
                <th class="px-3 py-3 text-right">עיר</th>
                <th class="px-3 py-3 text-center hidden md:table-cell">קהילה</th>
                <th class="px-3 py-3 text-center hidden md:table-cell">צדקה</th>
                <th class="px-3 py-3 text-center hidden md:table-cell">חירות</th>
                <th class="px-3 py-3 text-center hidden md:table-cell">עצמאות</th>
                <th class="px-3 py-3 text-center hidden md:table-cell">מאבק</th>
                <th class="px-3 py-3 text-center hidden md:table-cell">כלכלה</th>
                <th class="px-3 py-3 text-center">מגמה</th>
                <th class="px-3 py-3 text-center">ציון</th>
            </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
            {#each cities as c}
                <tr class="hover:bg-white/5 transition-colors">
                    <td class="px-3 py-3 font-bold text-white">{c.rank}</td>
                    <td class="px-3 py-3 text-white">{c.name}</td>
                    <td class="px-3 py-3 text-center text-gray-300 hidden md:table-cell">{c.community}</td>
                    <td class="px-3 py-3 text-center text-gray-300 hidden md:table-cell">{c.charity}</td>
                    <td class="px-3 py-3 text-center text-gray-300 hidden md:table-cell">{c.freedom}</td>
                    <td class="px-3 py-3 text-center text-gray-300 hidden md:table-cell">{c.independence}</td>
                    <td class="px-3 py-3 text-center text-gray-300 hidden md:table-cell">{c.struggle}</td>
                    <td class="px-3 py-3 text-center text-gray-300 hidden md:table-cell">{c.economy}</td>
                    <td class="px-3 py-3 text-center text-xl {trendColor(c.trend)}">{c.trend}</td>
                    <td class="px-3 py-3 text-center font-bold text-lg {scoreColor(c.score)}">{c.score}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
