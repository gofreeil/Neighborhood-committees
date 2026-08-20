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

<style>
    /* מכל התוכן של הרשת - העתק מ-index/avedot כדי שכל האתרים יתנהגו
       אותו דבר: 1440px, שתי מסילות פרסום, והתוכן ביניהן. */
    .layout-container {
        max-width: 1440px;
        margin: 0 auto;
        display: flex;
        gap: 2rem;
        padding: 2rem 2rem 0;
        width: 100%;
    }
    .main-content {
        flex: 1;
        min-width: 0;
    }
    @media (max-width: 1023px) {
        .layout-container {
            flex-direction: column;
            gap: 0;
            /* ריפוד הנייד של האתר הזה נשמר כפי שהיה (px-3 / py-6) */
            padding: 1.5rem 0.75rem;
            max-width: 100vw;
            /* clip ולא hidden: hidden הופך למכל גלילה ושובר sticky של צאצאים */
            overflow-x: clip;
        }
        .main-content {
            max-width: 100vw;
            overflow-x: clip;
        }
    }
    @media (min-width: 640px) and (max-width: 1023px) {
        .layout-container {
            padding: 1.5rem 1rem;
        }
    }
</style>
