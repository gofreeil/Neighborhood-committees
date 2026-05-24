<script lang="ts">
    import PageHero from '$lib/components/PageHero.svelte';
    const items = [
        { title: 'עתירה נגד היטל ארנונה רטרואקטיבי', stage: 4, total: 5, label: 'בית משפט מחוזי' },
        { title: 'פנייה למבקר המדינה — שקיפות תכנון', stage: 2, total: 5, label: 'בבדיקה' },
        { title: 'הצעת חוק להחלת חובת התייעצות', stage: 3, total: 5, label: 'ועדת חוקה' },
        { title: 'מאבק התחבורה הציבורית', stage: 5, total: 5, label: 'הושג!' }
    ];
    const stages = ['פנייה ראשונית', 'דיון פנימי', 'הגשה רשמית', 'דיון משפטי/ציבורי', 'הכרעה'];
</script>

<svelte:head><title>סטטוס — ועדי שכונות ארצי</title></svelte:head>

<PageHero icon="📊" title="סטטוס" subtitle="מעקב חי אחר כל הפניות, העתירות והמאבקים" gradient="from-cyan-900/40 to-blue-900/40" />

<div class="space-y-5">
    {#each items as i}
        <div class="rounded-2xl bg-white/5 border border-white/10 p-5">
            <div class="flex items-center justify-between mb-4 gap-3 flex-wrap">
                <h3 class="text-white font-bold text-base">{i.title}</h3>
                <span class="text-xs px-3 py-1 rounded-full {i.stage === i.total ? 'bg-green-500/20 text-green-300 border border-green-500/40' : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'}">
                    {i.label}
                </span>
            </div>
            <div class="flex items-center gap-1">
                {#each stages as st, idx}
                    <div class="flex-1 flex flex-col items-center">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold {idx < i.stage ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' : 'bg-white/10 text-gray-500'}">
                            {idx < i.stage ? '✓' : idx + 1}
                        </div>
                        <span class="text-[10px] text-gray-400 mt-1 text-center hidden md:block">{st}</span>
                    </div>
                    {#if idx < stages.length - 1}
                        <div class="h-0.5 flex-1 {idx < i.stage - 1 ? 'bg-blue-500' : 'bg-white/10'}"></div>
                    {/if}
                {/each}
            </div>
        </div>
    {/each}
</div>
