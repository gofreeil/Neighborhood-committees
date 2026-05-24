<script lang="ts">
    import PageHero from '$lib/components/PageHero.svelte';
    const coordinators = [
        { name: 'יוסי כהן', city: 'תל אביב', neighborhood: 'פלורנטין', joined: '2024', cases: 12 },
        { name: 'דנה לוי', city: 'רעננה', neighborhood: 'מערב', joined: '2024', cases: 18 },
        { name: 'מרים נחום', city: 'אשדוד', neighborhood: 'רובע יא׳', joined: '2025', cases: 9 },
        { name: 'עומר ברקת', city: 'קריית ביאליק', neighborhood: 'מרכז', joined: '2025', cases: 7 },
        { name: 'שירה אבן', city: 'גבעתיים', neighborhood: 'בורוכוב', joined: '2024', cases: 14 },
        { name: 'אסף ישראלי', city: 'ירושלים', neighborhood: 'קטמון', joined: '2025', cases: 11 }
    ];
</script>

<svelte:head><title>רכזי שכונות — ועדי שכונות ארצי</title></svelte:head>

<PageHero icon="👥" title="רכזי שכונות" subtitle="האנשים שמובילים את השינוי בשטח" gradient="from-blue-900/40 to-cyan-900/40" />

<div class="mb-6 rounded-2xl bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 p-5">
    <div class="flex items-start gap-4 flex-wrap">
        <div class="text-4xl">🔗</div>
        <div class="flex-1 min-w-0">
            <h3 class="text-white font-bold text-lg mb-1">חיבור אוטומטי לקהילה בשכונה</h3>
            <p class="text-sm text-gray-300">
                כל מי שמשמש כרכז שכונה באתר <strong>"קהילה בשכונה"</strong> מקבל אוטומטית
                גם הרשאת רכז כאן — אותם אישורים, אותם משתמשים, פעולה אחת מאוחדת.
            </p>
            <a
                href="https://community-blush.vercel.app/coordinator"
                target="_blank"
                rel="noopener"
                class="inline-block mt-3 px-4 py-2 rounded-lg bg-white text-purple-900 font-bold text-sm hover:scale-105 transition-transform"
            >
                הרשמה כרכז דרך קהילה בשכונה →
            </a>
        </div>
    </div>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
    {#each coordinators as c}
        <div class="rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                {c.name.charAt(0)}
            </div>
            <div class="flex-1 min-w-0">
                <h3 class="text-white font-bold">{c.name}</h3>
                <p class="text-xs text-gray-400">{c.neighborhood}, {c.city} · רכז מאז {c.joined}</p>
            </div>
            <div class="text-center flex-shrink-0">
                <div class="text-lg font-bold text-cyan-300">{c.cases}</div>
                <div class="text-[10px] text-gray-500">תיקים</div>
            </div>
        </div>
    {/each}
</div>
