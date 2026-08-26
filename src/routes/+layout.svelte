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
    import { navigating } from '$app/state';

    let { children, data } = $props();
</script>

<a href="#main" class="skip-link">דלג לתוכן</a>

<!-- פס התקדמות בזמן ניווט: SvelteKit נשאר על הדף הקודם עד שהחדש מוכן, ובלי סימן כלשהו הלחיצה מרגישה כאילו לא קרה כלום. הפס מופיע רק אחרי ~150ms, כך שניווט מיידי לא מהבהב. -->
{#if navigating.to}
    <div class="nav-progress" role="status" aria-label="טוען…"></div>
{/if}

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
    /* פס ההתקדמות של הניווט */
    .nav-progress {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        z-index: 100;
        transform-origin: left center;
        background: linear-gradient(90deg, #4f46e5, #7c3aed, #f5d57a);
        animation: nav-progress 8s cubic-bezier(0.15, 0.85, 0.25, 1) forwards;
    }
    :global(html[dir="rtl"]) .nav-progress {
        transform-origin: right center;
    }
    @keyframes nav-progress {
        0% { transform: scaleX(0); opacity: 0; }
        2% { transform: scaleX(0.06); opacity: 0; }
        4% { opacity: 1; }
        25% { transform: scaleX(0.55); }
        60% { transform: scaleX(0.82); }
        100% { transform: scaleX(0.97); opacity: 1; }
    }
    @media (prefers-reduced-motion: reduce) {
        .nav-progress { animation-duration: 0s; transform: scaleX(1); opacity: 1; }
    }

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
