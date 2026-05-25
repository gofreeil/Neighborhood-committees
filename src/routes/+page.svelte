<script lang="ts">
    import NewsTicker from '$lib/components/NewsTicker.svelte';
    import StackedWindows from '$lib/components/StackedWindows.svelte';

    const stats = [
        { value: '247', label: 'ועדי שכונות' },
        { value: '12,500+', label: 'תושבים פעילים' },
        { value: '4', label: 'מאבקים פעילים' },
        { value: '156', label: 'ניצחונות' }
    ];

    const cityRanking = [
        {
            rank: 1,
            name: 'ירושלים',
            score: 92,
            gradient: 'from-yellow-400 via-orange-400 to-pink-500',
            traits: [
                { label: 'סולידריות קהילתית', value: 96 },
                { label: 'גמ"חים פעילים', value: 94 },
                { label: 'שקיפות עירונית', value: 88 },
                { label: 'מעורבות תושבים', value: 90 }
            ]
        },
        {
            rank: 2,
            name: 'חיפה',
            score: 84,
            gradient: 'from-emerald-400 via-teal-400 to-cyan-500',
            traits: [
                { label: 'דו-קיום ושכנות טובה', value: 92 },
                { label: 'איכות סביבה', value: 86 },
                { label: 'ועדי שכונות פעילים', value: 82 },
                { label: 'מיצוי זכויות', value: 76 }
            ]
        },
        {
            rank: 3,
            name: 'תל אביב',
            score: 78,
            gradient: 'from-blue-400 via-indigo-400 to-purple-500',
            traits: [
                { label: 'יוזמות אזרחיות', value: 88 },
                { label: 'נגישות שירותים', value: 84 },
                { label: 'חיי קהילה', value: 72 },
                { label: 'יוקר מחיה (הפוך)', value: 68 }
            ]
        }
    ];
</script>

<svelte:head><title>ועדי שכונות ארצי — קול התושב</title></svelte:head>

<!-- Hero -->
<section
    class="hero-parallax relative overflow-hidden rounded-3xl border border-white/10 p-6 md:p-8 mb-8 min-h-[55vh] md:min-h-[80vh]"
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

<!-- Chat + Polls (stacked 3D windows) -->
<section class="mb-10">
    <h2 class="text-2xl md:text-4xl font-black text-center mb-2 bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
        העיר העצמאית והסולידרית ביותר
    </h2>
    <div class="h-px bg-gradient-to-r from-transparent via-orange-400/40 to-transparent mb-4"></div>

    <!-- Mockup: City ranking -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {#each cityRanking as city}
            <div class="relative rounded-2xl bg-white/5 border border-white/10 p-5 overflow-hidden hover:bg-white/10 transition-colors">
                <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r {city.gradient}"></div>
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-gradient-to-br {city.gradient} flex items-center justify-center font-black text-slate-900 text-lg">
                            {city.rank}
                        </div>
                        <h3 class="text-xl font-black text-white">{city.name}</h3>
                    </div>
                    <div class="text-left">
                        <div class="text-2xl font-black bg-gradient-to-r {city.gradient} bg-clip-text text-transparent">{city.score}</div>
                        <div class="text-[10px] text-gray-400 uppercase tracking-wider">ניקוד</div>
                    </div>
                </div>
                <ul class="space-y-2">
                    {#each city.traits as t}
                        <li>
                            <div class="flex items-center justify-between text-xs text-gray-300 mb-1">
                                <span>{t.label}</span>
                                <span class="font-bold text-white">{t.value}</span>
                            </div>
                            <div class="h-1.5 rounded-full bg-white/10 overflow-hidden">
                                <div class="h-full bg-gradient-to-r {city.gradient}" style="width: {t.value}%"></div>
                            </div>
                        </li>
                    {/each}
                </ul>
                <div class="mt-3 text-[10px] text-gray-500 text-center">מוקאפ — נתונים לדוגמה</div>
            </div>
        {/each}
    </div>

    <!-- Current Struggles (above polls) -->
    <div class="mb-6">
        <h3 class="text-xl md:text-2xl font-black text-center mb-2 bg-gradient-to-r from-red-300 via-orange-300 to-yellow-300 bg-clip-text text-transparent">
            המאבקים הנוכחיים
        </h3>
        <div class="h-px bg-gradient-to-r from-transparent via-red-400/40 to-transparent mb-4"></div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="relative rounded-2xl bg-gradient-to-br from-emerald-900/40 to-slate-900/60 border border-emerald-500/30 p-5 overflow-hidden hover:scale-[1.01] transition-transform">
                <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-green-500"></div>
                <div class="flex items-center gap-3 mb-3">
                    <div class="text-4xl">💵</div>
                    <div>
                        <h4 class="text-xl font-black text-white">מלחמה על המזומן</h4>
                        <div class="text-xs text-emerald-300">חופש כלכלי · פרטיות פיננסית</div>
                    </div>
                </div>
                <p class="text-sm text-gray-300 leading-relaxed mb-3">
                    שמירה על הזכות לשלם במזומן — נגד חוקים שמגבילים שימוש בכסף פיזי
                    ודוחפים לעולם דיגיטלי במעקב מלא.
                </p>
                <div class="flex items-center justify-between text-xs">
                    <span class="text-gray-400">תומכים: <span class="text-white font-bold">3,420</span></span>
                    <a href="#" class="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30">הצטרפו</a>
                </div>
            </div>

            <div class="relative rounded-2xl bg-gradient-to-br from-indigo-900/40 to-slate-900/60 border border-indigo-500/30 p-5 overflow-hidden hover:scale-[1.01] transition-transform">
                <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 to-violet-500"></div>
                <div class="flex items-center gap-3 mb-3">
                    <div class="text-4xl">🛡️</div>
                    <div>
                        <h4 class="text-xl font-black text-white">המאבק על הפרטיות</h4>
                        <div class="text-xs text-indigo-300">מאגרי מידע · מעקב דיגיטלי</div>
                    </div>
                </div>
                <p class="text-sm text-gray-300 leading-relaxed mb-3">
                    התנגדות להעברת נתונים אישיים בלי הסכמה, מצלמות בכל פינה, וזיהוי
                    ביומטרי כפוי — שמירה על הזכות הבסיסית לאנונימיות.
                </p>
                <div class="flex items-center justify-between text-xs">
                    <span class="text-gray-400">תומכים: <span class="text-white font-bold">2,815</span></span>
                    <a href="#" class="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30">הצטרפו</a>
                </div>
            </div>
        </div>
    </div>

    <!-- News Ticker (right above polls) -->
    <div class="mb-4">
        <NewsTicker />
    </div>

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
        background-position: center center;
        background-size: contain;
        background-repeat: no-repeat;
        background-color: #0b1226;
    }
    @media (max-width: 768px) {
        /* iOS/Safari לא תומך טוב ב-fixed */
        .hero-parallax {
            background-attachment: scroll;
            background-size: cover;
        }
    }
    .hero-title {
        text-shadow: 0 2px 12px rgba(0, 0, 0, 0.55), 0 1px 3px rgba(0, 0, 0, 0.45);
    }
    .hero-sub {
        text-shadow: 0 1px 6px rgba(0, 0, 0, 0.6), 0 1px 2px rgba(0, 0, 0, 0.5);
    }
</style>
