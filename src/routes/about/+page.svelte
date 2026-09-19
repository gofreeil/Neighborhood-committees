<script lang="ts">
    import PageHero from '$lib/components/PageHero.svelte';
    import JsonLd from '$lib/components/JsonLd.svelte';
    import { ABOUT_FAQ } from '$lib/aboutFaq';
    import { SITE_NAME, SITE_TAGLINE, SITE_URL, canonical, faqSchema } from '$lib/seo';

    const description =
        'ועדי שכונות - הפלטפורמה הארצית לפעילות ועדי השכונות בישראל: שיתופי פעולה בין השכונות והערים, מעגלי שיח והצבעות, צוות מומחים ומאבקים משותפים למיצוי זכויות התושבים.';

    // AboutPage + FAQPage זו לצד זו — שתיהן מוזרקות ל-<head> ב-SSR
    const schema = [
        {
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: `אודותינו | ${SITE_NAME}`,
            url: canonical('/about'),
            description,
            isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL }
        },
        faqSchema(ABOUT_FAQ)
    ];
</script>

<svelte:head>
    <title>אודותינו | {SITE_NAME} | יוצאים לחירות</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical('/about')} />
    <meta property="og:title" content="אודותינו | {SITE_NAME} | יוצאים לחירות" />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical('/about')} />
</svelte:head>

<JsonLd {schema} />

<PageHero icon="🏘️" title="אודותינו" subtitle={SITE_TAGLINE} gradient="from-blue-900/40 to-cyan-900/40" />

<article class="space-y-8">
    <div class="rounded-2xl bg-white/5 border border-white/10 p-6 md:p-8 text-gray-300 leading-relaxed space-y-4">
        <p>
            ועדי שכונות הוא הפלטפורמה הארצית לפעילות ועדי השכונות בישראל - ניהול ועדי השכונות בארץ,
            שיתופי פעולה בין השכונות והערים, מעגלי שיח והצבעות, שימוש במומחים ומאבקים למיצוי זכויות משותפות.
        </p>
        <p>
            האתר הוא חלק מרשת האתרים של התנועה החברתית "יוצאים לחירות", ומטרתו לתת לקול התושב משקל אמיתי
            בקבלת ההחלטות - על ידי אחדות הוועדים, החלפת מידע ותיאום עמדות בין השכונות.
        </p>
    </div>

    <section id="faq" aria-labelledby="faq-title" class="rounded-2xl bg-white/5 border border-white/10 p-6 md:p-8">
        <h2 id="faq-title" class="text-2xl md:text-3xl font-black text-white mb-5">שאלות ותשובות</h2>
        <div class="space-y-3">
            {#each ABOUT_FAQ as item, i}
                <details
                    open={i < 2}
                    class="group rounded-xl bg-[#0d1426] border border-white/10 open:border-blue-500/40 transition-colors"
                >
                    <summary
                        class="cursor-pointer select-none list-none flex items-center justify-between gap-3 px-4 py-3 text-white font-bold hover:text-blue-200"
                    >
                        <span>{item.q}</span>
                        <span class="text-blue-300 text-xl leading-none transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                    </summary>
                    <p class="px-4 pb-4 text-gray-300 leading-relaxed">{item.a}</p>
                </details>
            {/each}
        </div>
    </section>
</article>

<style>
    summary::-webkit-details-marker {
        display: none;
    }
</style>
