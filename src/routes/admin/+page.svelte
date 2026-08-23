<script lang="ts">
    import PageHero from '$lib/components/PageHero.svelte';
    import { adminNav, roleBadge } from '$lib/adminNav';

    // superAdmin ו-adminName מגיעים מ-+layout.server.ts של /admin
    let { data } = $props();

    const items = $derived(adminNav(true, data.superAdmin));
</script>

<svelte:head>
    <title>פאנל ניהול - ועדי שכונות ארצי</title>
    <meta name="robots" content="noindex" />
</svelte:head>

<PageHero
    icon="🛡️"
    title="פאנל ניהול"
    subtitle="{data.adminName} · {roleBadge(data.superAdmin)}"
    plain
/>

<div class="grid gap-4 sm:grid-cols-2">
    {#each items as item (item.href)}
        {@const alert = data.pending?.[item.path] ?? 0}
        <a
            href={item.href}
            target={item.external ? '_blank' : undefined}
            rel={item.external ? 'noopener noreferrer' : undefined}
            class="relative rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-amber-500/40 hover:bg-white/10"
        >
            {#if alert > 0}
                <span
                    class="absolute -top-2 -left-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-rose-600 px-1.5 text-[11px] leading-none font-black text-white shadow-lg ring-2 ring-gray-900"
                >
                    <span class="sr-only">ממתינים לטיפול: </span>{alert}
                </span>
            {/if}
            <div class="text-4xl">{item.icon}</div>
            <h2 class="mt-3 text-lg font-bold text-white">
                {item.title}
                {#if item.external}<span class="text-xs font-normal text-gray-500">↗</span>{/if}
            </h2>
            <p class="mt-1 text-sm text-gray-400">{item.desc}</p>
        </a>
    {/each}
</div>
