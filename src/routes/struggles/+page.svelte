<script lang="ts">
    import PageHero from '$lib/components/PageHero.svelte';
    const struggles = [
        { title: 'נגד הקפאת תקציבי תחבורה ציבורית', vs: 'משרד התחבורה', vaadim: 38, supporters: 12400, progress: 65, status: 'פעיל' },
        { title: 'דרישה לשקיפות בוועדות תכנון מחוזיות', vs: 'מנהל התכנון', vaadim: 24, supporters: 7890, progress: 40, status: 'פעיל' },
        { title: 'ביטול היטל ארנונה רטרואקטיבי', vs: 'משרד הפנים', vaadim: 51, supporters: 18230, progress: 80, status: 'פעיל' },
        { title: 'חובת התייעצות עם ועדי שכונות לפני שינוי תב״ע', vs: 'הוועדה הארצית', vaadim: 67, supporters: 22100, progress: 25, status: 'בהקמה' }
    ];
</script>

<svelte:head><title>מאבקים משותפים — ועדי שכונות ארצי</title></svelte:head>

<PageHero icon="✊" title="מאבקים משותפים" subtitle="כשמתאחדים — הקול נשמע. מאבקים פעילים כנגד רשויות המדינה." gradient="from-red-900/40 to-orange-900/40" />

<div class="space-y-4">
    {#each struggles as s}
        <div class="rounded-2xl bg-white/5 border border-white/10 p-5">
            <div class="flex items-start justify-between gap-3 mb-3 flex-wrap">
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="text-xs px-2 py-0.5 rounded-full {s.status === 'פעיל' ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'}">
                            {s.status}
                        </span>
                        <span class="text-xs text-gray-400">נגד: {s.vs}</span>
                    </div>
                    <h3 class="text-white font-bold text-lg">{s.title}</h3>
                </div>
                <button class="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold text-sm whitespace-nowrap">
                    הצטרף למאבק
                </button>
            </div>
            <div class="flex items-center justify-between text-xs text-gray-300 mb-2">
                <span><strong class="text-white">{s.vaadim}</strong> ועדי שכונות · <strong class="text-white">{s.supporters.toLocaleString('he-IL')}</strong> תומכים</span>
                <span>{s.progress}%</span>
            </div>
            <div class="h-2 bg-white/10 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-red-500 to-orange-400" style="width: {s.progress}%"></div>
            </div>
        </div>
    {/each}
</div>
