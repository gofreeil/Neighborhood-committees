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

<Header
    userEmail={data?.userEmail ?? null}
    userName={data?.userName ?? null}
    isAdmin={data?.isAdmin ?? false}
    superAdmin={data?.superAdmin ?? false}
/>

<!-- פריסת הרשת (RTL), זהה ל-index/avedot ולשאר האתרים: המודעות
     בתשלום מימין (144px, מ-xl), התוכן במרכז, ואתרי הרשת משמאל
     (192px, מ-lg). מתחת ל-lg נשאר טור תוכן יחיד, ושני הטורים
     הצדדיים מוסתרים — הפרסומות עוברות לפרסומת-הביניים. -->
<div class="layout-container">
    <RightAdBanner />
    <main id="main" class="main-content">
        {@render children?.()}
    </main>
    <AdsSidebar />
</div>

<!-- פרסומת-הביניים (נייד) — שכבה גלובלית; נפתחת רק דרך adGate -->
<AdInterstitial />

<MobileAdsDrawer />

<Footer />
