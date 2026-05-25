<script lang="ts">
    import PageHero from '$lib/components/PageHero.svelte';

    const stages = ['פנייה ראשונית', 'דיון פנימי', 'הגשה רשמית', 'דיון משפטי/ציבורי', 'הכרעה'];

    const items = [
        {
            title: 'נגד הקפאת תקציבי תחבורה ציבורית',
            vs: 'משרד התחבורה',
            vaadim: 38,
            supporters: 12400,
            progress: 65,
            status: 'פעיל',
            stage: 3,
            stageLabel: 'הגשה רשמית'
        },
        {
            title: 'דרישה לשקיפות בוועדות תכנון מחוזיות',
            vs: 'מנהל התכנון',
            vaadim: 24,
            supporters: 7890,
            progress: 40,
            status: 'פעיל',
            stage: 2,
            stageLabel: 'בבדיקה'
        },
        {
            title: 'ביטול היטל ארנונה רטרואקטיבי',
            vs: 'משרד הפנים',
            vaadim: 51,
            supporters: 18230,
            progress: 80,
            status: 'פעיל',
            stage: 4,
            stageLabel: 'בית משפט מחוזי'
        },
        {
            title: 'חובת התייעצות עם ועדי שכונות לפני שינוי תב״ע',
            vs: 'הוועדה הארצית',
            vaadim: 67,
            supporters: 22100,
            progress: 25,
            status: 'בהקמה',
            stage: 1,
            stageLabel: 'פנייה ראשונית'
        },
        {
            title: 'הצעת חוק להחלת חובת התייעצות',
            vs: 'כנסת — ועדת חוקה',
            vaadim: 42,
            supporters: 9650,
            progress: 55,
            status: 'פעיל',
            stage: 3,
            stageLabel: 'ועדת חוקה'
        },
        {
            title: 'מאבק התחבורה הציבורית — הושג',
            vs: 'משרד התחבורה',
            vaadim: 73,
            supporters: 31200,
            progress: 100,
            status: 'הושג',
            stage: 5,
            stageLabel: 'הושג!'
        }
    ];
</script>

<svelte:head><title>מאבקים וסטטוס — ועדי שכונות ארצי</title></svelte:head>

<PageHero
    icon="✊"
    title="מאבקים וסטטוס"
    subtitle="מאבקים משותפים כנגד רשויות המדינה — עם מעקב חי אחר שלב כל מאבק"
    gradient="from-red-900/40 to-orange-900/40"
/>

<div class="space-y-4">
    {#each items as s}
        <div class="rounded-2xl bg-white/5 border border-white/10 p-5">
            <!-- שורת כותרת -->
            <div class="flex items-start justify-between gap-3 mb-3 flex-wrap">
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1 flex-wrap">
                        <span class="text-xs px-2 py-0.5 rounded-full {s.status === 'הושג' ? 'bg-green-500/20 text-green-300 border border-green-500/40' : s.status === 'פעיל' ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'}">
                            {s.status}
                        </span>
                        <span class="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                            {s.stageLabel}
                        </span>
                        <span class="text-xs text-gray-400">נגד: {s.vs}</span>
                    </div>
                    <h3 class="text-white font-bold text-lg">{s.title}</h3>
                </div>
                <button class="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold text-sm whitespace-nowrap hover:scale-105 transition-transform">
                    הצטרף למאבק
                </button>
            </div>

            <!-- מונים והתקדמות אחוזים -->
            <div class="flex items-center justify-between text-xs text-gray-300 mb-2">
                <span><strong class="text-white">{s.vaadim}</strong> ועדי שכונות · <strong class="text-white">{s.supporters.toLocaleString('he-IL')}</strong> תומכים</span>
                <span>{s.progress}%</span>
            </div>
            <div class="h-2 bg-white/10 rounded-full overflow-hidden mb-4">
                <div class="h-full bg-gradient-to-r from-red-500 to-orange-400" style="width: {s.progress}%"></div>
            </div>

            <!-- שלבי סטטוס -->
            <div class="pt-3 border-t border-white/10">
                <div class="text-xs text-gray-400 mb-2">שלב נוכחי: <strong class="text-white">{s.stageLabel}</strong></div>
                <div class="flex items-center gap-1">
                    {#each stages as st, idx}
                        <div class="flex-1 flex flex-col items-center">
                            <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold {idx < s.stage ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' : 'bg-white/10 text-gray-500'}">
                                {idx < s.stage ? '✓' : idx + 1}
                            </div>
                            <span class="text-[10px] text-gray-400 mt-1 text-center hidden md:block">{st}</span>
                        </div>
                        {#if idx < stages.length - 1}
                            <div class="h-0.5 flex-1 {idx < s.stage - 1 ? 'bg-blue-500' : 'bg-white/10'}"></div>
                        {/if}
                    {/each}
                </div>
            </div>
        </div>
    {/each}
</div>
