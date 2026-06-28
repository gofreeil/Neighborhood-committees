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
    <div class="rounded-2xl border border-white/10 overflow-hidden">
        <!-- מיכל גלילה: הכותרת מוקפאת בראש בזמן גלילת הגוף -->
        <div class="max-h-[70vh] overflow-y-auto overflow-x-auto">
            <table class="w-full min-w-[640px] border-collapse text-right">
                <thead>
                    <tr class="sticky top-0 z-10 text-xs uppercase tracking-wide text-cyan-200/80"
                        style="background:#0d1426;">
                        <th class="py-3 px-4 font-semibold w-16">תמונה</th>
                        <th class="py-3 px-4 font-semibold">שם הרכז</th>
                        <th class="py-3 px-4 font-semibold">טלפון</th>
                        <th class="py-3 px-4 font-semibold">עיר</th>
                        <th class="py-3 px-4 font-semibold">שכונה</th>
                        <th class="py-3 px-4 font-semibold text-center">תושבים רשומים</th>
                    </tr>
                    <tr><th colspan="6" class="p-0"><div class="h-px bg-white/15"></div></th></tr>
                </thead>
                <tbody>
                    {#each coordinators as c, i (c.id)}
                        <tr class="border-b border-white/5 transition-colors hover:bg-white/5"
                            style={i % 2 === 1 ? 'background:rgba(255,255,255,0.025);' : ''}>
                            <!-- תמונה -->
                            <td class="py-3 px-4">
                                {#if c.avatar_url}
                                    <img src={c.avatar_url} alt={c.name}
                                        class="w-11 h-11 rounded-full object-cover border border-white/20" />
                                {:else}
                                    <div class="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                                        {c.name.charAt(0)}
                                    </div>
                                {/if}
                            </td>
                            <!-- שם -->
                            <td class="py-3 px-4 text-white font-bold whitespace-nowrap">{c.name}</td>
                            <!-- טלפון -->
                            <td class="py-3 px-4 whitespace-nowrap">
                                {#if c.phone}
                                    <a href={`tel:${c.phone}`} class="text-cyan-300 hover:underline" dir="ltr">{c.phone}</a>
                                {:else}
                                    <span class="text-gray-600">—</span>
                                {/if}
                            </td>
                            <!-- עיר -->
                            <td class="py-3 px-4 text-gray-300 whitespace-nowrap">{c.city || '—'}</td>
                            <!-- שכונה -->
                            <td class="py-3 px-4 text-gray-300">{c.neighborhoods.length ? c.neighborhoods.join(', ') : '—'}</td>
                            <!-- תושבים רשומים -->
                            <td class="py-3 px-4 text-center">
                                <span class="inline-block min-w-[2.5rem] rounded-lg bg-cyan-500/10 px-2 py-1 text-lg font-bold text-cyan-300">
                                    {c.residentsCount}
                                </span>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
{/if}
