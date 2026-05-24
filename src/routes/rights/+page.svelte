<script lang="ts">
    import PageHero from '$lib/components/PageHero.svelte';
    const cats = [
        {
            title: 'זכויות מול הרשות המקומית', icon: '🏛️',
            items: ['קבלת מידע ציבורי תוך 30 יום', 'התנגדות לתב״ע במועד פרסום', 'תיק תושב פתוח', 'הנחות בארנונה', 'פיצוי על נזקי תשתיות']
        },
        {
            title: 'זכויות שכונתיות', icon: '🏘️',
            items: ['ייצוג בוועדות תכנון', 'הקצאת מבני ציבור', 'תקציב השתתפותי', 'גני שעשועים תקניים', 'נגישות במרחב הציבורי']
        },
        {
            title: 'זכויות פרטניות', icon: '👤',
            items: ['הגנה צרכנית', 'דיור ציבורי', 'קצבאות ביטוח לאומי', 'זכויות בריאות', 'חינוך חינם']
        },
        {
            title: 'זכויות מול המדינה', icon: '⚖️',
            items: ['חופש מידע מגופים ציבוריים', 'הגשת עתירה לבג״ץ', 'פנייה לנציב תלונות הציבור', 'מבקר המדינה', 'הגנת המתריע בציבור']
        }
    ];
</script>

<svelte:head><title>מיצוי זכויות — ועדי שכונות ארצי</title></svelte:head>

<PageHero icon="⚖️" title="מיצוי זכויות" subtitle="המדריך המלא — מה מגיע לכם ואיך לקבל את זה" gradient="from-amber-900/40 to-orange-900/40" />

<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    {#each cats as c}
        <div class="rounded-2xl bg-white/5 border border-white/10 p-5">
            <div class="flex items-center gap-3 mb-3">
                <span class="text-3xl">{c.icon}</span>
                <h3 class="text-white font-bold text-lg">{c.title}</h3>
            </div>
            <ul class="space-y-2">
                {#each c.items as item}
                    <li class="flex items-start gap-2 text-sm text-gray-300">
                        <span class="text-amber-400 mt-0.5">▸</span>
                        <a href="#" class="hover:text-white transition-colors">{item}</a>
                    </li>
                {/each}
            </ul>
        </div>
    {/each}
</div>

<div class="mt-6 rounded-2xl bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-500/30 p-5 text-center">
    <p class="text-white font-bold mb-2">לא מצאת את הזכות שלך?</p>
    <p class="text-gray-300 text-sm mb-3">צוות התומכים שלנו עוזר לועדי שכונות ולתושבים למצות זכויות מול הרשויות.</p>
    <a href="/discussions" class="inline-block px-5 py-2 rounded-lg bg-white text-amber-900 font-bold text-sm hover:scale-105 transition-transform">
        שאל בפורום
    </a>
</div>
