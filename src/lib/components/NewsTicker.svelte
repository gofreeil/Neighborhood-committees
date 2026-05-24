<script lang="ts">
    type NewsItem = { line1: string; line2: string; href?: string };

    const items: NewsItem[] = [
        { line1: 'ועד שכונת פלורנטין משיג תקציב לשיפוץ פארק', line2: 'תל אביב · ניצחון', href: '/news' },
        { line1: 'מאבק תושבי קטמון נגד בנייה רוויה', line2: 'ירושלים · מאבק', href: '/news' },
        { line1: 'דיון חירום על תחבורה ציבורית', line2: 'חיפה · דיון', href: '/news' },
        { line1: 'תושבי שכונה ד׳ מקבלים פיצוי', line2: 'באר שבע · ניצחון', href: '/news' },
        { line1: 'עתירה משותפת של 12 ועדי שכונות נגד היטל השבחה', line2: 'רמת גן · מאבק', href: '/news' },
        { line1: 'ועד קריית נורדאו דורש שקיפות בתב״ע', line2: 'נתניה · פנייה', href: '/news' }
    ];

    let paused = $state(false);
</script>

<section
    aria-label="חדשות ארציות"
    class="news-ticker-container relative overflow-hidden rounded-2xl border border-blue-900/40 bg-[#0f172a]/90 mb-8 backdrop-blur-md"
>
    <ul class="sr-only">
        {#each items as item}
            <li>{item.line1} – {item.line2}</li>
        {/each}
    </ul>

    <button
        onclick={() => (paused = !paused)}
        class="sr-only focus:not-sr-only focus:fixed focus:top-16 focus:right-4 focus:z-50 focus:bg-blue-700 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm"
        aria-label={paused ? 'המשך הפעלת טיקר חדשות' : 'עצור טיקר חדשות'}
    >
        {paused ? '▶ המשך' : '⏸ עצור'}
    </button>

    <div class="mx-auto max-w-7xl flex items-center" aria-hidden="true">
        <div
            class="z-10 bg-red-600 px-4 md:px-6 py-3 md:py-4 text-sm md:text-lg font-black text-white shadow-xl flex-shrink-0 ml-4 md:ml-6 flex flex-col items-center justify-center border-l border-red-400"
        >
            <span>חדשות</span>
            <span>ארציות</span>
        </div>

        <div class="overflow-hidden flex-grow relative h-14 md:h-16">
            <div
                class="ticker-content flex gap-12 md:gap-16 items-center absolute right-0 whitespace-nowrap h-full"
                class:paused
            >
                {#each [...items, ...items] as item}
                    <div class="flex items-center gap-12 md:gap-16 h-full">
                        <div class="flex flex-col justify-center text-center">
                            <a
                                href={item.href || '/news'}
                                class="text-base md:text-xl font-bold text-blue-100 hover:text-blue-300 transition-colors"
                            >{item.line1}</a>
                            <span class="text-sm md:text-base font-medium text-blue-300">{item.line2}</span>
                        </div>
                        <div class="h-10 md:h-12 w-px bg-gradient-to-b from-transparent via-gray-600 to-transparent"></div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</section>

<style>
    .ticker-content {
        right: 0;
        animation: ticker-move 85s linear infinite;
    }
    @keyframes ticker-move {
        from { transform: translateX(0); }
        to   { transform: translateX(50%); }
    }
    .news-ticker-container:hover .ticker-content,
    .ticker-content.paused {
        animation-play-state: paused;
    }
    @media (prefers-reduced-motion: reduce) {
        .ticker-content {
            animation: none;
            position: static;
            white-space: normal;
            flex-wrap: wrap;
        }
    }
</style>
