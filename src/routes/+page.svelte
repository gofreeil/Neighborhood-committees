<script lang="ts">
    import { onMount } from 'svelte';
    import NewsTicker from '$lib/components/NewsTicker.svelte';
    import StackedWindows from '$lib/components/StackedWindows.svelte';

    let heroEl: HTMLElement | undefined = $state();
    let parallaxImg: HTMLElement | undefined = $state();

    // Smooth per-character gradient (RTL: right = green, left = purple)
    const heroAnchors = [
        '#7cff7a', // ירוק לימון
        '#5eff8a', // ירוק
        '#52ff9c', // ירוק-מנטה
        '#4effae', // ירוק-בוהק
        '#52ffc0', // ירוק-תורכיז
        '#5cffd0', // מנטה
        '#5cffe0', // מנטה-תכלת
        '#5fffe6', // אקווה
        '#5ff5fa', // ציאן-בהיר
        '#5fe0ff', // ציאן
        '#5ccdff', // תכלת בהיר
        '#5cb6ff', // תכלת
        '#5ca0ff', // תכלת-כחול
        '#5e90ff', // כחול-בהיר
        '#6582ff', // כחול
        '#7a82ff'  // כחול עם רמז עדין מאוד של לבנדר (שמאל)
    ];
    // עוגנים כהים יותר לכותרת (ופחות גוונים → פחות הדרגתיות)
    const titleAnchors = [
        '#4ade80', // ירוק 400
        '#14b8a6', // תורכיז 500
        '#0ea5e9', // תכלת 500
        '#2563eb'  // כחול 600
    ];
    function interpolate(anchors: string[], progress: number): string {
        const p = Math.max(0, Math.min(1, progress));
        const n = anchors.length - 1;
        const seg = Math.min(Math.floor(p * n), n - 1);
        const t = p * n - seg;
        const parse = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
        const [r1, g1, b1] = parse(anchors[seg]);
        const [r2, g2, b2] = parse(anchors[seg + 1]);
        const r = Math.round(r1 + (r2 - r1) * t);
        const g = Math.round(g1 + (g2 - g1) * t);
        const b = Math.round(b1 + (b2 - b1) * t);
        return `rgb(${r}, ${g}, ${b})`;
    }
    function colorAt(progress: number): string {
        return interpolate(heroAnchors, progress);
    }
    function titleColorAt(progress: number): string {
        // דחיסת טווח: 0..1 → 0.125..0.875 (טווח הצבעים מ-ח עד 2nd ו, פרוס על כל האותיות)
        const compressed = 0.125 + progress * 0.75;
        return interpolate(titleAnchors, compressed);
    }
    const heroTitle = 'אחד ומשול';
    const heroSubtitle = 'ניהול ועדי השכונות בארץ -שיתופי פעולה בין השכונות, מעגלי שיח והצבעות, שימוש במומחים ומאבקים למיצוי זכויות משותפות.';

    let heroTitleEl: HTMLElement | undefined = $state();
    let heroSubEl: HTMLElement | undefined = $state();

    function paintByXPosition(container: HTMLElement, fn: (p: number) => string = colorAt) {
        const spans = Array.from(container.querySelectorAll('span[data-ch]')) as HTMLElement[];
        if (!spans.length) return;
        // קבץ אותיות לפי שורה (לפי Y)
        const lines: { top: number; left: number; right: number; spans: HTMLElement[] }[] = [];
        const TOL = 4; // px tolerance
        spans.forEach((sp) => {
            const r = sp.getBoundingClientRect();
            if (r.width === 0 && r.height === 0) return;
            const cy = (r.top + r.bottom) / 2;
            let line = lines.find((l) => Math.abs(l.top - cy) < TOL);
            if (!line) {
                line = { top: cy, left: r.left, right: r.right, spans: [] };
                lines.push(line);
            } else {
                line.left = Math.min(line.left, r.left);
                line.right = Math.max(line.right, r.right);
            }
            line.spans.push(sp);
        });
        // לכל שורה — צבע על בסיס X יחסי לרוחב השורה (מימין לשמאל)
        lines.forEach((line) => {
            const w = line.right - line.left;
            if (w <= 0) return;
            line.spans.forEach((sp) => {
                const r = sp.getBoundingClientRect();
                const cx = (r.left + r.right) / 2;
                const progress = Math.max(0, Math.min(1, (line.right - cx) / w));
                sp.style.color = fn(progress);
            });
        });
    }

    function paintTitleWithLockedRight(container: HTMLElement) {
        const spans = Array.from(container.querySelectorAll('span[data-ch]')) as HTMLElement[];
        if (spans.length < 5) return;
        const lineRect = container.getBoundingClientRect();
        const w = lineRect.width;
        if (w <= 0) return;
        // ו הראשונה של "ומשול" = אינדקס 4 ב-"אחד ומשול"
        const lockRect = spans[4].getBoundingClientRect();
        const lockCx = (lockRect.left + lockRect.right) / 2;
        const lockProgress = Math.max(0, Math.min(1, (lineRect.right - lockCx) / w));
        const lockedColor = titleColorAt(lockProgress);
        spans.forEach((sp) => {
            const r = sp.getBoundingClientRect();
            if (r.width === 0 && r.height === 0) return;
            const cx = (r.left + r.right) / 2;
            if (cx >= lockCx) {
                // ימינה מ-ו (כולל ו עצמה) — צבע אחיד
                sp.style.color = lockedColor;
            } else {
                // שמאלה מ-ו — גרדיאנט טבעי לפי X
                const progress = Math.max(0, Math.min(1, (lineRect.right - cx) / w));
                sp.style.color = titleColorAt(progress);
            }
        });
    }

    onMount(() => {
        const paint = () => {
            if (heroTitleEl) paintTitleWithLockedRight(heroTitleEl);
            if (heroSubEl) paintByXPosition(heroSubEl);
        };
        paint();
        // Re-paint on resize (line wrapping changes)
        const ro = new ResizeObserver(paint);
        if (heroTitleEl) ro.observe(heroTitleEl);
        if (heroSubEl) ro.observe(heroSubEl);
        // Also after fonts load
        if ('fonts' in document) (document as any).fonts?.ready?.then(paint);
        return () => ro.disconnect();
    });

    onMount(() => {
        if (!heroEl || !parallaxImg) return;
        let raf = 0;
        const update = () => {
            raf = 0;
            if (!heroEl || !parallaxImg) return;
            const rect = heroEl.getBoundingClientRect();
            const vh = window.innerHeight;
            // progress: 0 when section's top is at bottom of viewport, 1 when section's bottom is at top of viewport
            const progress = Math.max(0, Math.min(1, 1 - (rect.bottom / (vh + rect.height))));
            // image is taller than container; translate it so progress 0 -> show top, progress 1 -> show bottom
            const imgH = parallaxImg.offsetHeight;
            const containerH = rect.height;
            const maxShift = Math.max(0, imgH - containerH);
            parallaxImg.style.transform = `translate3d(0, ${-progress * maxShift}px, 0)`;
        };
        const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            if (raf) cancelAnimationFrame(raf);
        };
    });

    const stats = [
        { value: '60', label: 'ועדי שכונות' },
        { value: '10,000+', label: 'תושבים פעילים' },
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

<!-- Hero text (מעל התמונה) -->
<div class="mb-4 md:mb-6 px-1 text-center">
    <h1 bind:this={heroTitleEl} class="hero-title text-3xl md:text-5xl font-black leading-tight mb-3 inline-block">
        {#each [...heroTitle] as ch}<span data-ch>{ch}</span>{/each}
    </h1>
    <p bind:this={heroSubEl} class="hero-sub text-lg md:text-xl font-bold max-w-3xl mx-auto">
        {#each [...heroSubtitle] as ch}<span data-ch>{ch}</span>{/each}
    </p>
</div>

<!-- Hero image (קישור לחזון) -->
<a
    href="/vision"
    bind:this={heroEl}
    class="hero-parallax block relative overflow-hidden rounded-3xl border border-white/10 mb-8 min-h-[35vh] md:min-h-[45vh] bg-[#0b1226] group"
>
    <img
        bind:this={parallaxImg}
        src="/images/Gemini_Generated_Image_6ev05q6ev05q6ev0.png"
        alt="החזון שלנו ותוכנית הפעולה"
        class="parallax-img absolute top-0 left-0 w-full min-h-[140%] object-cover object-left pointer-events-none select-none will-change-transform"
    />
    <div class="relative p-6 md:p-8 text-center">
        <h2 class="text-2xl md:text-4xl font-black text-white" style="text-shadow: 0 0 6px rgba(0,0,0,1), 0 0 14px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,1), 0 4px 18px rgba(0,0,0,0.85);">
            החזון שלנו ותוכנית הפעולה
        </h2>
    </div>
</a>

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
    .parallax-img {
        transition: transform 0.05s linear;
    }
    .hero-title {
        text-shadow: 0 2px 12px rgba(0, 0, 0, 0.55), 0 1px 3px rgba(0, 0, 0, 0.45);
    }
    .hero-sub {
        text-shadow: 0 1px 6px rgba(0, 0, 0, 0.6), 0 1px 2px rgba(0, 0, 0, 0.5);
    }
</style>
