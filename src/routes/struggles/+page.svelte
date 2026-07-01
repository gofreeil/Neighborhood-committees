<script lang="ts">
    import PageHero from '$lib/components/PageHero.svelte';
    import { toggleEngagement } from '$lib/engagement';

    let { data } = $props();

    const stages = ['פנייה ראשונית', 'דיון פנימי', 'הגשה רשמית', 'דיון משפטי/ציבורי', 'הכרעה'];

    const protestTopics = [
        {
            id: 'protest-0',
            title: 'נאבקים בתקנות WHO',
            emoji: '🌐',
            tag: 'בריאות עולמית',
            desc: 'התנגדות לתקנות הבריאות הבינלאומיות החדשות שמעבירות סמכויות מדינתיות ל-WHO וכופות מדיניות בריאות גלובלית על אזרחי המדינה.',
            cta: 'הצטרפו למאבק'
        },
        {
            id: 'protest-1',
            title: 'נאבקים במטבע הריכוזי - CBDC',
            emoji: '💵',
            tag: 'חופש כלכלי',
            desc: 'מאבק נגד מטבע דיגיטלי ריכוזי שמאפשר מעקב מלא, ביטול עסקאות והגבלת השימוש בכסף - שמירה על הזכות לפרטיות פיננסית ולמזומן.',
            cta: 'הצטרפו למאבק'
        },
        {
            id: 'protest-2',
            title: 'נאבקים בריסוסים',
            emoji: '🌥️',
            tag: 'סביבה ובריאות',
            desc: 'דרישה לשקיפות מלאה לגבי ריסוסים אווירונאוטיים ולהפסקת פעולות שמשפיעות על הסביבה ועל בריאות האוכלוסייה ללא הסכמה ציבורית.',
            cta: 'הצטרפו למאבק'
        },
        {
            id: 'protest-3',
            title: 'נאבקים בגזילת ילדים מהוריהם',
            emoji: '👨‍👩‍👧',
            tag: 'זכויות המשפחה',
            desc: 'מאבק נגד הוצאת ילדים מבתיהם ללא הליך הוגן - חיזוק זכויות ההורים, פיקוח על רווחת הילד ושקיפות בהליכים שמשפיעים על תאי משפחה שלמים.',
            cta: 'הצטרפו למאבק'
        }
    ];

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
            vs: 'כנסת - ועדת חוקה',
            vaadim: 42,
            supporters: 9650,
            progress: 55,
            status: 'פעיל',
            stage: 3,
            stageLabel: 'ועדת חוקה'
        },
        {
            title: 'מאבק התחבורה הציבורית - הושג',
            vs: 'משרד התחבורה',
            vaadim: 73,
            supporters: 31200,
            progress: 100,
            status: 'הושג',
            stage: 5,
            stageLabel: 'הושג!'
        }
    ];

    const successes = [
        {
            title: 'ביטול היטל ארנונה רטרואקטיבי',
            city: 'באר שבע',
            vaadim: 12,
            year: 2025,
            impact: 'אלפי תושבים נחסכו מחיוב של ₪2.4M',
            tag: 'משפטי',
            emoji: '⚖️'
        },
        {
            title: 'הוספת קו תחבורה ציבורית לשכונה',
            city: 'כרמיאל',
            vaadim: 4,
            year: 2025,
            impact: '6,800 תושבים מקבלים שירות תחבורה חדש',
            tag: 'תחבורה',
            emoji: '🚌'
        },
        {
            title: 'בניית גן ילדים נוסף בשכונת רמות',
            city: 'ירושלים',
            vaadim: 3,
            year: 2024,
            impact: '110 ילדים שלא היה להם מקום קיבלו פתרון',
            tag: 'חינוך',
            emoji: '🏫'
        },
        {
            title: 'שיפוץ מרכז קהילתי וגן ציבורי',
            city: 'חיפה',
            vaadim: 6,
            year: 2024,
            impact: 'תקציב של ₪1.8M שוחרר אחרי שנתיים של מאבק',
            tag: 'תשתיות',
            emoji: '🏞️'
        },
        {
            title: 'דרישה ליישום חוק נגישות במבני ציבור',
            city: 'נתניה',
            vaadim: 8,
            year: 2024,
            impact: '14 מבני ציבור הותאמו לנגישות מלאה',
            tag: 'נגישות',
            emoji: '♿'
        },
        {
            title: 'עצירת תוכנית בנייה ללא היתר',
            city: 'פתח תקווה',
            vaadim: 5,
            year: 2024,
            impact: 'שטח ירוק של 4 דונם נשמר לטובת הקהילה',
            tag: 'תכנון',
            emoji: '🌳'
        }
    ];

    // מזהה יציב למאבק לפי אינדקס (המערך סטטי)
    const struggleId = (i: number) => `struggle-${i}`;

    // מצב הצטרפות + תוספת תומכים אמיתית (baseline + מעורבות)
    const allIds = [...protestTopics.map(p => p.id), ...items.map((_, i) => struggleId(i))];
    let joined = $state<Record<string, boolean>>(
        Object.fromEntries(allIds.map(id => [id, data.myJoins.includes(id)]))
    );
    let extra = $state<Record<string, number>>(
        Object.fromEntries(allIds.map(id => [id, data.counts[id] ?? 0]))
    );
    let busy = $state<Record<string, boolean>>({});

    async function join(id: string) {
        if (busy[id]) return;
        busy = { ...busy, [id]: true };
        const res = await toggleEngagement('join', id, '', '/struggles');
        if (res) {
            joined = { ...joined, [id]: res.active };
            extra = { ...extra, [id]: (extra[id] ?? 0) + (res.active ? 1 : -1) };
        }
        busy = { ...busy, [id]: false };
    }
</script>

<svelte:head><title>מאבקים ונצחונות - ועדי שכונות ארצי</title></svelte:head>

<PageHero
    icon="✊"
    title="מאבקים ונצחונות"
    subtitle="לוקחים אחריות - יוצאים לחירות. עומדים על העצמאות שלנו ומציינים את ההישגים."
    gradient="from-red-900/40 to-orange-900/40"
/>

<!-- Section: National Protest Topics (from archive) -->
<section class="mb-12">
    <h2 class="text-2xl md:text-4xl font-black text-center mb-2 bg-gradient-to-r from-blue-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
        פעילויות מחאה ארציות
    </h2>
    <div class="h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent mb-6"></div>
    <p class="text-center text-gray-300 text-lg mb-6 font-bold">עומדים על העצמאות שלנו!</p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {#each protestTopics as p}
            <div class="relative rounded-2xl bg-gradient-to-br from-slate-800/60 to-slate-900/80 border border-white/10 p-5 overflow-hidden hover:scale-[1.01] transition-transform">
                <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                <div class="flex items-start gap-3 mb-3">
                    <div class="text-4xl flex-shrink-0">{p.emoji}</div>
                    <div class="flex-1 min-w-0">
                        <span class="inline-block text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 mb-1">
                            {p.tag}
                        </span>
                        <h3 class="text-xl font-black text-white leading-snug">{p.title}</h3>
                    </div>
                </div>
                <p class="text-sm text-gray-300 leading-relaxed mb-3">{p.desc}</p>
                <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-400">{#if extra[p.id] > 0}{extra[p.id].toLocaleString('he-IL')} הצטרפו{/if}</span>
                    <button
                        onclick={() => join(p.id)}
                        disabled={busy[p.id]}
                        class="px-4 py-1.5 rounded-lg font-bold text-sm transition-colors disabled:opacity-50 {joined[p.id] ? 'bg-cyan-500/25 border border-cyan-500/50 text-cyan-200' : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'}"
                    >
                        {joined[p.id] ? '✓ הצטרפת' : p.cta}
                    </button>
                </div>
            </div>
        {/each}
    </div>

    <div class="mt-6 text-center">
        <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdwqJaUner3G9vI_RR8_Uv7A001e0OMhZ5nIIrd2hEkubKlSw/viewform?usp=sf_link"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-base md:text-lg hover:scale-105 transition-transform shadow-lg"
        >
            אני רוצה להיות חלק מהעולם החדש
        </a>
    </div>
</section>

<!-- Section: Active national struggles vs government -->
<section class="mb-12">
    <h2 class="text-2xl md:text-4xl font-black text-center mb-2 bg-gradient-to-r from-red-300 via-orange-300 to-yellow-300 bg-clip-text text-transparent">
        מאבקים פעילים מול הרשויות
    </h2>
    <div class="h-px bg-gradient-to-r from-transparent via-red-400/40 to-transparent mb-6"></div>
    <p class="text-center text-gray-400 text-sm mb-6">מעקב חי אחר שלב כל מאבק</p>

    <div class="space-y-4">
        {#each items as s, i}
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
                    <button
                        onclick={() => join(struggleId(i))}
                        disabled={busy[struggleId(i)] || s.status === 'הושג'}
                        class="px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-colors disabled:opacity-50 {joined[struggleId(i)] ? 'bg-orange-500/25 border border-orange-500/50 text-orange-200' : 'bg-gradient-to-r from-red-600 to-orange-600 text-white'}"
                    >
                        {s.status === 'הושג' ? '🏆 הושג' : joined[struggleId(i)] ? '✓ הצטרפת' : 'הצטרף למאבק'}
                    </button>
                </div>

                <!-- מונים והתקדמות אחוזים -->
                <div class="flex items-center justify-between text-xs text-gray-300 mb-2">
                    <span><strong class="text-white">{s.vaadim}</strong> ועדי שכונות · <strong class="text-white">{(s.supporters + (extra[struggleId(i)] ?? 0)).toLocaleString('he-IL')}</strong> תומכים</span>
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
</section>

<!-- Section: Successes -->
<section class="mb-8">
    <h2 class="text-2xl md:text-4xl font-black text-center mb-2 bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
        הניצחונות שלנו 🏆
    </h2>
    <div class="h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent mb-6"></div>
    <p class="text-center text-gray-300 text-base mb-6">מה שכבר השגנו יחד - סיפורי הצלחה של ועדי שכונות שהובילו לשינוי אמיתי</p>

    <!-- Stats summary -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div class="rounded-2xl bg-white/5 border border-white/10 p-4 text-center">
            <div class="text-2xl md:text-3xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">156</div>
            <div class="text-xs md:text-sm text-gray-400 mt-1">נצחונות סה"כ</div>
        </div>
        <div class="rounded-2xl bg-white/5 border border-white/10 p-4 text-center">
            <div class="text-2xl md:text-3xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">₪4.2M</div>
            <div class="text-xs md:text-sm text-gray-400 mt-1">תקציבים ששוחררו</div>
        </div>
        <div class="rounded-2xl bg-white/5 border border-white/10 p-4 text-center">
            <div class="text-2xl md:text-3xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">38</div>
            <div class="text-xs md:text-sm text-gray-400 mt-1">ערים משתתפות</div>
        </div>
        <div class="rounded-2xl bg-white/5 border border-white/10 p-4 text-center">
            <div class="text-2xl md:text-3xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">45K+</div>
            <div class="text-xs md:text-sm text-gray-400 mt-1">תושבים שהושפעו</div>
        </div>
    </div>

    <!-- Successes grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {#each successes as s}
            <div class="rounded-2xl bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition-colors">
                <div class="flex items-start gap-3 mb-3">
                    <div class="text-3xl flex-shrink-0">{s.emoji}</div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 mb-1 flex-wrap">
                            <span class="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 border border-green-500/40">{s.tag}</span>
                            <span class="text-xs text-gray-400">📍 {s.city}</span>
                            <span class="text-xs text-gray-400">· {s.year}</span>
                        </div>
                        <h3 class="text-white font-bold text-lg leading-snug">{s.title}</h3>
                    </div>
                </div>
                <div class="pl-12 text-sm text-gray-300 mb-3">{s.impact}</div>
                <div class="pl-12 text-xs text-gray-400">
                    <strong class="text-white">{s.vaadim}</strong> ועדי שכונות הובילו את המאבק
                </div>
            </div>
        {/each}
    </div>
</section>
