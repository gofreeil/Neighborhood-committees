<script lang="ts">
    const features = [
        { href: '/news', icon: '📰', title: 'חדשות', desc: 'עדכונים מכל שכונה בארץ — מקובץ אוטומטית ממקורות שונים' },
        { href: '/votes', icon: '🗳️', title: 'הצבעות', desc: 'הצביעו בנושאים שמשפיעים עליכם — כל קול נשמע' },
        { href: '/discussions', icon: '💬', title: 'דיונים', desc: 'פורום פתוח לדיון בין ועדי שכונות' },
        { href: '/struggles', icon: '✊', title: 'מאבקים משותפים', desc: 'מאבקים נגד החלטות רשויות המדינה' },
        { href: '/rights', icon: '⚖️', title: 'מיצוי זכויות', desc: 'מדריך מלא לזכויות התושב והשכונה' },
        { href: '/status', icon: '📊', title: 'סטטוס', desc: 'מעקב אחר התקדמות מאבקים ופניות' },
        { href: '/sync', icon: '🔄', title: 'סינכרונים', desc: 'תיאום פעולות בין ועדי שכונות שונים' },
        { href: '/ratings', icon: '🏆', title: 'דירוג עצמאות ערים', desc: 'מדד אוטומטי לעצמאות הרשויות המקומיות' }
    ];

    const stats = [
        { value: '247', label: 'ועדי שכונות' },
        { value: '12,500+', label: 'תושבים פעילים' },
        { value: '38', label: 'מאבקים פעילים' },
        { value: '156', label: 'ניצחונות' }
    ];
</script>

<svelte:head><title>ועדי שכונות ארצי — קול התושב</title></svelte:head>

<!-- Hero -->
<section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-pink-900/30 border border-white/10 p-8 md:p-12 mb-8">
    <div class="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
    <div class="relative">
        <h1 class="text-3xl md:text-5xl font-black bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent leading-tight mb-4">
            קול אחד מאוחד.<br />כוח שכונתי אמיתי.
        </h1>
        <p class="text-lg md:text-xl text-gray-200 max-w-2xl mb-6">
            פלטפורמה ארצית לחיבור של ועדי שכונות מכל הארץ — מאבקים משותפים,
            מיצוי זכויות, דירוג אוטומטי של עצמאות הרשויות ומסד נתונים פתוח לכל תושב.
        </p>
        <div class="flex flex-wrap gap-3">
            <a href="/vision" class="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-lg hover:scale-105 transition-transform">
                החזון שלנו
            </a>
            <a href="/action-plan" class="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors border border-white/20">
                תוכנית הפעולה
            </a>
            <a href="/coordinators" class="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors border border-white/20">
                רכזי שכונות
            </a>
        </div>
    </div>
</section>

<!-- Stats -->
<section class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
    {#each stats as s}
        <div class="rounded-2xl bg-white/5 border border-white/10 p-4 text-center">
            <div class="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {s.value}
            </div>
            <div class="text-xs md:text-sm text-gray-400 mt-1">{s.label}</div>
        </div>
    {/each}
</section>

<!-- Features Grid -->
<section class="mb-10">
    <h2 class="text-2xl md:text-3xl font-bold text-white mb-6">מה תמצאו כאן</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {#each features as f}
            <a
                href={f.href}
                class="group rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 p-5 transition-all"
            >
                <div class="flex items-start gap-4">
                    <div class="text-4xl">{f.icon}</div>
                    <div class="flex-1">
                        <h3 class="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">{f.title}</h3>
                        <p class="text-sm text-gray-400 mt-1">{f.desc}</p>
                    </div>
                </div>
            </a>
        {/each}
    </div>
</section>

<!-- Community Connection -->
<section class="rounded-3xl bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-purple-500/30 p-6 md:p-8 mb-10">
    <div class="flex flex-col md:flex-row items-center gap-6">
        <div class="text-6xl">🏘️</div>
        <div class="flex-1 text-center md:text-right">
            <h3 class="text-xl md:text-2xl font-bold text-white mb-2">מחוברים לקהילה בשכונה</h3>
            <p class="text-gray-300 text-sm md:text-base">
                האתר משולב באופן מלא עם פלטפורמת "קהילה בשכונה". רכז שכונה שם —
                הוא אוטומטית גם רכז כאן. אותם התושבים, אותה הקהילה, פעולה אחת מאוחדת.
            </p>
        </div>
        <a
            href="https://community-blush.vercel.app"
            target="_blank"
            rel="noopener"
            class="px-6 py-3 rounded-xl bg-white text-purple-900 font-bold hover:scale-105 transition-transform"
        >
            לאתר קהילה בשכונה
        </a>
    </div>
</section>
