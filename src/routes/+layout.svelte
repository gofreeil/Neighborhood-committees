<script lang="ts">
    import '../app.css';
    import 'flag-icons/css/flag-icons.min.css';
    import '$lib/i18n';
    import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import AdsSidebar from '$lib/components/AdsSidebar.svelte';
    import MobileAdsDrawer from '$lib/components/MobileAdsDrawer.svelte';

    let { children } = $props();
</script>

<a href="#main" class="skip-link">דלג לתוכן</a>
<Header />

<div class="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8 py-6">
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-6">
        <main id="main" class="min-w-0">
            {@render children?.()}
        </main>
        <AdsSidebar />
    </div>
</div>

<MobileAdsDrawer />

<Footer />
