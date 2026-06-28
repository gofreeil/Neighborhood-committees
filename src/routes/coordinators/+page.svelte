<script lang="ts">
    import PageHero from '$lib/components/PageHero.svelte';
    let { data } = $props();
    const coordinators = $derived(data.coordinators ?? []);
</script>

<svelte:head><title>רכזי השכונות - ועדי שכונות ארצי</title></svelte:head>

<PageHero icon="👥" title="רכזי השכונות" subtitle="האנשים שמובילים את השינוי בשטח" gradient="from-blue-900/40 to-cyan-900/40" />

{#if coordinators.length === 0}
    <div class="rounded-2xl bg-white/5 border border-white/10 p-8 text-center">
        <div class="text-4xl mb-3">🗂️</div>
        <p class="text-gray-300">עדיין לא הוגדרו רכזי שכונות.</p>
    </div>
{:else}
    <div class="space-y-3">
        {#each coordinators as c (c.id)}
            <div class="rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center gap-4">
                <!-- תמונה -->
                {#if c.avatar_url}
                    <img
                        src={c.avatar_url}
                        alt={c.name}
                        class="w-14 h-14 rounded-full object-cover flex-shrink-0 border border-white/20"
                    />
                {:else}
                    <div class="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                        {c.name.charAt(0)}
                    </div>
                {/if}

                <!-- שם + מיקום + טלפון -->
                <div class="flex-1 min-w-0">
                    <h3 class="text-white font-bold truncate">{c.name}</h3>
                    <p class="text-xs text-gray-400 truncate">
                        {#if c.neighborhoods.length}{c.neighborhoods.join(', ')}{/if}{#if c.city}{c.neighborhoods.length ? ' · ' : ''}{c.city}{/if}
                    </p>
                    {#if c.phone}
                        <a href={`tel:${c.phone}`} class="text-xs text-cyan-300 hover:underline" dir="ltr">
                            📞 {c.phone}
                        </a>
                    {/if}
                </div>

                <!-- תושבים רשומים -->
                <div class="text-center flex-shrink-0 px-2">
                    <div class="text-xl font-bold text-cyan-300">{c.residentsCount}</div>
                    <div class="text-[10px] text-gray-500 leading-tight">תושבים<br/>רשומים</div>
                </div>
            </div>
        {/each}
    </div>
{/if}
