<script lang="ts">
    import PageHero from '$lib/components/PageHero.svelte';

    const cities = [
        { rank: 1, name: 'מודיעין', score: 87.3, fiscal: 92, transparency: 85, services: 84, response: 88, trend: '↑' },
        { rank: 2, name: 'רעננה', score: 85.1, fiscal: 88, transparency: 84, services: 82, response: 86, trend: '↑' },
        { rank: 3, name: 'גבעתיים', score: 82.7, fiscal: 80, transparency: 88, services: 81, response: 82, trend: '→' },
        { rank: 4, name: 'הוד השרון', score: 80.4, fiscal: 79, transparency: 82, services: 81, response: 80, trend: '↑' },
        { rank: 5, name: 'כפר סבא', score: 78.9, fiscal: 76, transparency: 80, services: 79, response: 81, trend: '→' },
        { rank: 12, name: 'תל אביב-יפו', score: 71.2, fiscal: 74, transparency: 65, services: 76, response: 70, trend: '↓' },
        { rank: 18, name: 'ירושלים', score: 65.8, fiscal: 62, transparency: 68, services: 67, response: 66, trend: '↑' },
        { rank: 24, name: 'חיפה', score: 61.4, fiscal: 60, transparency: 64, services: 60, response: 62, trend: '→' },
        { rank: 41, name: 'באר שבע', score: 52.3, fiscal: 48, transparency: 55, services: 53, response: 53, trend: '↑' }
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
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div class="rounded-xl bg-white/5 p-3 border border-white/10">
            <div class="text-blue-300 font-bold mb-1">💰 איתנות פיננסית</div>
            <p class="text-xs text-gray-400">חוב לתקציב, גרעון, כוח גבייה</p>
        </div>
        <div class="rounded-xl bg-white/5 p-3 border border-white/10">
            <div class="text-purple-300 font-bold mb-1">📋 שקיפות</div>
            <p class="text-xs text-gray-400">חופש מידע, פרסום החלטות, מכרזים</p>
        </div>
        <div class="rounded-xl bg-white/5 p-3 border border-white/10">
            <div class="text-pink-300 font-bold mb-1">🛠️ איכות שירותים</div>
            <p class="text-xs text-gray-400">חינוך, ניקיון, גינון, תשתיות</p>
        </div>
        <div class="rounded-xl bg-white/5 p-3 border border-white/10">
            <div class="text-amber-300 font-bold mb-1">⏱️ מהירות תגובה</div>
            <p class="text-xs text-gray-400">פניות תושבים, מענה לועדים</p>
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
                <th class="px-3 py-3 text-center">ציון</th>
                <th class="px-3 py-3 text-center hidden md:table-cell">פיננסי</th>
                <th class="px-3 py-3 text-center hidden md:table-cell">שקיפות</th>
                <th class="px-3 py-3 text-center hidden md:table-cell">שירותים</th>
                <th class="px-3 py-3 text-center hidden md:table-cell">תגובה</th>
                <th class="px-3 py-3 text-center">מגמה</th>
            </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
            {#each cities as c}
                <tr class="hover:bg-white/5 transition-colors">
                    <td class="px-3 py-3 font-bold text-white">{c.rank}</td>
                    <td class="px-3 py-3 text-white">{c.name}</td>
                    <td class="px-3 py-3 text-center font-bold {scoreColor(c.score)}">{c.score}</td>
                    <td class="px-3 py-3 text-center text-gray-300 hidden md:table-cell">{c.fiscal}</td>
                    <td class="px-3 py-3 text-center text-gray-300 hidden md:table-cell">{c.transparency}</td>
                    <td class="px-3 py-3 text-center text-gray-300 hidden md:table-cell">{c.services}</td>
                    <td class="px-3 py-3 text-center text-gray-300 hidden md:table-cell">{c.response}</td>
                    <td class="px-3 py-3 text-center text-xl {trendColor(c.trend)}">{c.trend}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
