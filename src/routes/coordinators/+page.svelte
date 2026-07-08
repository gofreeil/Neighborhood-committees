<script lang="ts">
    import PageHero from '$lib/components/PageHero.svelte';
    import { onMount } from 'svelte';
    let { data } = $props();
    const coordinators = $derived(data.coordinators ?? []);

    // הכותרת מוקפאת מתחת לניווט העליון של האתר (Header דביק בגובה משתנה)
    let headerOffset = $state(0);
    onMount(() => {
        const header = document.querySelector('header');
        if (!header) return;
        const update = () => (headerOffset = header.getBoundingClientRect().height);
        update();
        const ro = new ResizeObserver(update);
        ro.observe(header);
        window.addEventListener('resize', update);
        return () => {
            ro.disconnect();
            window.removeEventListener('resize', update);
        };
    });
</script>

<svelte:head><title>רכזי השכונות - ועדי שכונות ארצי</title></svelte:head>

<PageHero icon="👥" title="רכזי השכונות" subtitle="האנשים שמובילים את השינוי בשטח" gradient="from-blue-900/40 to-cyan-900/40" />

{#if coordinators.length === 0}
    <div class="rounded-2xl bg-white/5 border border-white/10 p-8 text-center">
        <div class="text-4xl mb-3">🗂️</div>
        <p class="text-gray-300">עדיין לא הוגדרו רכזי שכונות.</p>
    </div>
{:else}
    <div class="rounded-2xl border border-white/10">
        <!-- הטבלה יושבת ישר על הדף (בלי גלילה פנימית); הכותרת דביקה לחלון -->
        <table class="w-full border-collapse text-right">
            <thead>
                <tr class="sticky z-20 text-xs uppercase tracking-wide text-cyan-200/80"
                    style="top:{headerOffset}px;">
                    <th class="py-3 px-4 font-semibold w-16 border-b border-white/15 rounded-tr-2xl" style="background:#0d1426;"><span class="sr-only">תמונה</span></th>
                    <th class="py-3 px-4 font-semibold border-b border-white/15" style="background:#0d1426;">שם הרכז</th>
                    <th class="py-3 px-4 font-semibold border-b border-white/15" style="background:#0d1426;">טלפון</th>
                    <th class="py-3 px-4 font-semibold border-b border-white/15" style="background:#0d1426;">עיר</th>
                    <th class="py-3 px-4 font-semibold border-b border-white/15" style="background:#0d1426;">שכונה</th>
                    <th class="py-3 px-4 font-semibold text-center border-b border-white/15" style="background:#0d1426;">תושבים רשומים</th>
                    <th class="py-3 px-4 font-semibold text-center border-b border-white/15 rounded-tl-2xl" style="background:#0d1426;">פריטים על המפה</th>
                </tr>
            </thead>
            <tbody>
                    {#each coordinators as c, i (c.id)}
                        <tr class="border-b border-white/5 transition-colors hover:bg-white/5"
                            style={i % 2 === 1 ? 'background:rgba(255,255,255,0.025);' : ''}>
                            <!-- תמונה (ריק אם לא הועלתה תמונה) -->
                            <td class="py-3 px-4">
                                {#if c.avatar_url}
                                    <img src={c.avatar_url} alt={c.name}
                                        class="w-11 h-11 rounded-full object-cover border border-white/20" />
                                {:else}
                                    <div class="w-11 h-11" aria-hidden="true"></div>
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
                            <!-- פריטים שכבר על המפה בשכונה (בעלי קואורדינטות) -->
                            <td class="py-3 px-4 text-center">
                                <span class="inline-block min-w-[2.5rem] rounded-lg bg-emerald-500/10 px-2 py-1 text-lg font-bold text-emerald-300"
                                    title="פריטים שכבר מופיעים על המפה בשכונה">
                                    📍 {c.itemsOnMap ?? 0}
                                </span>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
    </div>
{/if}
