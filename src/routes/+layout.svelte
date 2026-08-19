<script lang="ts">
    import '../app.css';
    import 'flag-icons/css/flag-icons.min.css';
    import '$lib/i18n';
    import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import AdsSidebar from '$lib/components/AdsSidebar.svelte';
    import RightAdBanner from '$lib/components/RightAdBanner.svelte';
    import AdInterstitial from '$lib/components/AdInterstitial.svelte';
    import MobileAdsDrawer from '$lib/components/MobileAdsDrawer.svelte';
    import WelcomeScreen from '$lib/components/WelcomeScreen.svelte';

    let { children, data } = $props();
</script>

<a href="#main" class="skip-link">דלג לתוכן</a>

<!-- מסך פתיחה אחרי התחברות / הרשמה — גלובלי, מופעל ע"י ?welcome ב-URL -->
<WelcomeScreen userName={data?.userName ?? ''} />

<Header userEmail={data?.userEmail ?? null} userName={data?.userName ?? null} />

<div class="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8 py-6">
    <!-- שלוש עמודות בדסקטופ (RTL): טור הפרסומות בתשלום מימין, התוכן
         במרכז, ואתרי הרשת משמאל. מתחת ל-lg נשאר טור תוכן יחיד — שני
         הטורים הצדדיים מוסתרים, והפרסומות עוברות לפרסומת-הביניים. -->
    <div class="grid grid-cols-1 lg:grid-cols-[240px_1fr_220px] gap-6">
        <RightAdBanner />
        <main id="main" class="min-w-0">
            {@render children?.()}
        </main>
        <AdsSidebar />
    </div>
</div>

<!-- פרסומת-הביניים (נייד) — שכבה גלובלית; נפתחת רק דרך adGate -->
<AdInterstitial />

<MobileAdsDrawer />

<Footer />
