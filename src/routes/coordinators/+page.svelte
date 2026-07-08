<script lang="ts">
    import PageHero from '$lib/components/PageHero.svelte';
    import { onMount } from 'svelte';
    import { SvelteSet } from 'svelte/reactivity';
    let { data } = $props();
    const coordinators = $derived(data.coordinators ?? []);

    // בחירת שורות: סימון וי בריבוע לכל רכז
    const selected = new SvelteSet<string>();
    const toggle = (id: string) => (selected.has(id) ? selected.delete(id) : selected.add(id));
    const allSelected = $derived(coordinators.length > 0 && coordinators.every((c) => selected.has(c.id)));
    const someSelected = $derived(selected.size > 0 && !allSelected);
    function toggleAll() {
        if (allSelected) selected.clear();
        else for (const c of coordinators) selected.add(c.id);
    }
    // מצב "חלקי" של checkbox "בחר הכול" (אינו ניתן להגדרה כ-attribute)
    let selectAllEl: HTMLInputElement | undefined = $state();
    $effect(() => {
        if (selectAllEl) selectAllEl.indeterminate = someSelected;
    });

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
    {#if selected.size > 0}
        <div class="mb-3 flex items-center gap-3 text-sm text-cyan-200">
            <span class="font-bold">נבחרו {selected.size} רכזים</span>
            <button type="button" onclick={() => selected.clear()}
                class="rounded-lg border border-white/15 bg-white/5 px-3 py-1 hover:bg-white/10 transition-colors">
                נקה בחירה
            </button>
        </div>
    {/if}
    <div class="rounded-2xl border border-white/10">
        <!-- הטבלה יושבת ישר על הדף (בלי גלילה פנימית); הכותרת דביקה לחלון -->
        <table class="w-full border-collapse text-right">
            <thead>
                <tr class="sticky z-20 text-xs uppercase tracking-wide text-cyan-200/80"
                    style="top:{headerOffset}px;">
                    <th class="py-3 px-4 border-b border-white/15 rounded-tr-2xl w-12 text-center" style="background:#0d1426;">
                        <input type="checkbox" bind:this={selectAllEl} checked={allSelected} onchange={toggleAll}
                            class="h-5 w-5 rounded accent-cyan-500 cursor-pointer align-middle" aria-label="בחר הכול" />
                    </th>
                    <th class="py-3 px-4 font-semibold w-16 border-b border-white/15" style="background:#0d1426;"><span class="sr-only">תמונה</span></th>
                    <th class="py-3 px-4 font-semibold border-b border-white/15" style="background:#0d1426;">שם הרכז</th>
                    <th class="py-3 px-4 font-semibold border-b border-white/15" style="background:#0d1426;">עיר</th>
                    <th class="py-3 px-4 font-semibold border-b border-white/15" style="background:#0d1426;">שכונה</th>
                    <th class="py-3 px-4 font-semibold text-center border-b border-white/15" style="background:#0d1426;">תושבים רשומים</th>
                    <th class="py-3 px-4 font-semibold text-center border-b border-white/15" style="background:#0d1426;">פריטים על המפה</th>
                    <th class="py-3 px-4 font-semibold border-b border-white/15 rounded-tl-2xl" style="background:#0d1426;">טלפון</th>
                </tr>
            </thead>
            <tbody>
                    {#each coordinators as c, i (c.id)}
                        <tr class="border-b border-white/5 transition-colors hover:bg-white/5"
                            style={selected.has(c.id)
                                ? 'background:rgba(34,211,238,0.12);'
                                : (i % 2 === 1 ? 'background:rgba(255,255,255,0.025);' : '')}>
                            <!-- סימון בחירה -->
                            <td class="py-3 px-4 text-center">
                                <input type="checkbox" checked={selected.has(c.id)} onchange={() => toggle(c.id)}
                                    class="h-5 w-5 rounded accent-cyan-500 cursor-pointer align-middle" aria-label={`בחר את ${c.name}`} />
                            </td>
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
                            <!-- טלפון (בקצה השמאלי) -->
                            <td class="py-3 px-4 whitespace-nowrap">
                                {#if c.phone}
                                    <a href={`tel:${c.phone}`} class="text-cyan-300 hover:underline" dir="ltr">{c.phone}</a>
                                {:else}
                                    <span class="text-gray-600">—</span>
                                {/if}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
    </div>
{/if}
