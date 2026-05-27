<script lang="ts">
    import PageHero from '$lib/components/PageHero.svelte';
    import { teamBySlug } from '$lib/teamsData';

    const team = teamBySlug('agriculture')!;
</script>

<svelte:head><title>{team.name} — ועדי שכונות ארצי</title></svelte:head>

<PageHero icon={team.emoji} title={team.name} subtitle={team.desc} gradient="from-lime-900/40 to-green-900/40" />

<div class="mb-4">
    <a href="/experts" class="text-sm text-amber-400 hover:text-amber-300">→ חזרה לכל הצוותים</a>
</div>

<section class="rounded-2xl bg-white/5 border border-white/10 p-6 md:p-8">
    <p class="text-gray-300">תוכן הצוות יתווסף בקרוב.</p>
</section>
