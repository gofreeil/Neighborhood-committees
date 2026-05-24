<script lang="ts">
    import NewsTicker from '$lib/components/NewsTicker.svelte';
    import StackedWindows from '$lib/components/StackedWindows.svelte';

    const stats = [
        { value: '247', label: 'ועדי שכונות' },
        { value: '12,500+', label: 'תושבים פעילים' },
        { value: '4', label: 'מאבקים פעילים' },
        { value: '156', label: 'ניצחונות' }
    ];
</script>

<svelte:head><title>ועדי שכונות ארצי — קול התושב</title></svelte:head>

<!-- Hero -->
<section
    class="hero-parallax relative overflow-hidden rounded-3xl border border-white/10 p-8 md:p-12 mb-8"
    style="background-image: linear-gradient(to bottom, rgba(15, 23, 42, 0.15) 0%, rgba(15, 23, 42, 0.05) 40%, rgba(15, 23, 42, 0.35) 100%), url('/images/Fewer%20buildings_%20varied%20sky.png');"
>
    <div class="relative">
        <h1 class="hero-title text-3xl md:text-5xl font-black text-white leading-tight mb-4">
            אחד ומשול
        </h1>
        <p class="hero-sub text-lg md:text-xl text-white max-w-2xl mb-6">
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
        </div>
    </div>
</section>

<!-- Stats -->
<section class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
    {#each stats as s}
        <div class="rounded-2xl bg-white/5 border border-white/10 p-4 text-center">
            <div class="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {s.value}
            </div>
            <div class="text-xs md:text-sm text-gray-400 mt-1">{s.label}</div>
        </div>
    {/each}
</section>

<!-- News Ticker -->
<NewsTicker />

<!-- Chat + Polls (stacked 3D windows) -->
<section class="mb-10">
    <StackedWindows />
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

<style>
    .hero-parallax {
        background-attachment: fixed;
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
    }
    @media (max-width: 768px) {
        /* iOS/Safari לא תומך טוב ב-fixed; משאירים cover רגיל */
        .hero-parallax { background-attachment: scroll; }
    }
    .hero-title {
        text-shadow: 0 2px 12px rgba(0, 0, 0, 0.55), 0 1px 3px rgba(0, 0, 0, 0.45);
    }
    .hero-sub {
        text-shadow: 0 1px 6px rgba(0, 0, 0, 0.6), 0 1px 2px rgba(0, 0, 0, 0.5);
    }
</style>
