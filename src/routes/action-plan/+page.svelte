<script lang="ts">
    import PageHero from '$lib/components/PageHero.svelte';
    const phases = [
        {
            num: 1, title: 'הקמת תשתית (2026)', status: 'בביצוע',
            color: 'from-green-500 to-emerald-600',
            items: ['השקת הפלטפורמה ומאגר ועדי שכונות', 'גיוס 250 רכזי שכונה ראשונים', 'בניית מערכת דירוג ערים אוטומטית', 'חיבור לפלטפורמת קהילה בשכונה']
        },
        {
            num: 2, title: 'הרחבה ארצית (2027)', status: 'מתוכנן',
            color: 'from-blue-500 to-indigo-600',
            items: ['1,500 ועדי שכונות פעילים', 'מאבקים ארציים מתואמים', 'מערך משפטי משותף', 'שיתופי פעולה עם ארגוני חברה אזרחית']
        },
        {
            num: 3, title: 'השפעה פוליטית (2028)', status: 'יעד',
            color: 'from-purple-500 to-pink-600',
            items: ['ייצוג רשמי בועדות תכנון', 'הצעת חוק להסדרת ועדי שכונות', 'בחירות פנימיות לנציגי על-עירוניים', 'שולחן עגול ארצי קבוע מול הממשלה']
        },
        {
            num: 4, title: 'מוסד אזרחי קבוע (2029+)', status: 'חזון',
            color: 'from-amber-500 to-orange-600',
            items: ['חוק יסוד: ועדי שכונות', 'תקציב ממשלתי קבוע', 'נציגות במוסדות בינלאומיים', 'מודל לייצוא לדמוקרטיות אחרות']
        }
    ];
</script>

<svelte:head><title>תוכנית פעולה — ועדי שכונות ארצי</title></svelte:head>

<PageHero icon="🗺️" title="תוכנית הפעולה" subtitle="המפת דרכים מהיום לעתיד שאנחנו רוצים" gradient="from-indigo-900/40 to-blue-900/40" />

<div class="space-y-5">
    {#each phases as p}
        <div class="rounded-2xl bg-white/5 border border-white/10 p-6 relative overflow-hidden">
            <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r {p.color}"></div>
            <div class="flex items-start gap-4 mb-4">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br {p.color} flex items-center justify-center text-2xl font-black text-white flex-shrink-0">
                    {p.num}
                </div>
                <div class="flex-1">
                    <h3 class="text-xl md:text-2xl font-bold text-white">{p.title}</h3>
                    <span class="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300 mt-1 inline-block">{p.status}</span>
                </div>
            </div>
            <ul class="space-y-2 mr-2">
                {#each p.items as item}
                    <li class="flex items-start gap-2 text-gray-300">
                        <span class="text-blue-400 mt-0.5 flex-shrink-0">●</span>
                        <span>{item}</span>
                    </li>
                {/each}
            </ul>
        </div>
    {/each}
</div>
