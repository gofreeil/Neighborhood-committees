<script lang="ts">
    import PageHero from '$lib/components/PageHero.svelte';
    import { onMount } from 'svelte';
    import { invalidateAll } from '$app/navigation';
    import { SvelteSet } from 'svelte/reactivity';
    let { data } = $props();
    const coordinators = $derived(data.coordinators ?? []);

    // סינון: חיפוש חופשי (שם רכז / עיר / שכונה) + בחירת עיר מרשימה
    let query = $state('');
    let cityFilter = $state('');
    const cities = $derived(
        [...new Set(coordinators.map((c) => c.city).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'he'))
    );
    const filtered = $derived(
        coordinators.filter((c) => {
            if (cityFilter && c.city !== cityFilter) return false;
            const q = query.trim().toLowerCase();
            if (!q) return true;
            return [c.name, c.city, ...(c.neighborhoods ?? [])].join(' ').toLowerCase().includes(q);
        })
    );
    const isFiltering = $derived(query.trim() !== '' || cityFilter !== '');
    function clearFilters() {
        query = '';
        cityFilter = '';
    }

    // רענון: מריץ מחדש את ה-load בשרת ומביא את הרכזים העדכניים
    let refreshing = $state(false);
    async function refresh() {
        if (refreshing) return;
        refreshing = true;
        try {
            await invalidateAll();
        } finally {
            refreshing = false;
        }
    }

    // בחירת שורות: סימון וי בריבוע לכל רכז
    const selected = new SvelteSet<string>();
    const toggle = (id: string) => (selected.has(id) ? selected.delete(id) : selected.add(id));
    // "בחר הכול" חל על השורות המוצגות בלבד (אחרי סינון)
    const allSelected = $derived(filtered.length > 0 && filtered.every((c) => selected.has(c.id)));
    const someSelected = $derived(selected.size > 0 && !allSelected);
    function toggleAll() {
        if (allSelected) for (const c of filtered) selected.delete(c.id);
        else for (const c of filtered) selected.add(c.id);
    }
    // מצב "חלקי" של checkbox "בחר הכול" (אינו ניתן להגדרה כ-attribute)
    let selectAllEl: HTMLInputElement | undefined = $state();
    $effect(() => {
        if (selectAllEl) selectAllEl.indeterminate = someSelected;
    });

    // רמז הגלילה לצדדים מוצג רק אם הטבלה באמת רחבה מהמסגרת
    let tableWrap: HTMLDivElement | undefined = $state();
    let scrollableX = $state(false);
    $effect(() => {
        const el = tableWrap;
        if (!el) {
            scrollableX = false;
            return;
        }
        const check = () => (scrollableX = el.scrollWidth - el.clientWidth > 4);
        check();
        const ro = new ResizeObserver(check);
        ro.observe(el);
        if (el.firstElementChild) ro.observe(el.firstElementChild);
        return () => ro.disconnect();
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

<!-- סינון: חיפוש חופשי לפי שם/עיר/שכונה + בחירת עיר -->
{#if coordinators.length > 0}
    <div class="-mt-2 sm:mt-0 mb-2 sm:mb-3 flex flex-wrap items-center gap-2 sm:gap-3">
        <div class="relative flex-1 min-w-[180px]">
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">🔍</span>
            <input
                type="text"
                bind:value={query}
                placeholder="חיפוש שם רכז / עיר / שכונה..."
                aria-label="חיפוש שם רכז, עיר או שכונה"
                class="w-full rounded-xl bg-white/5 border border-white/10 pr-10 pl-9 py-2 sm:py-2.5 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-colors"
            />
            {#if query}
                <button type="button" onclick={() => (query = '')}
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white" aria-label="נקה חיפוש">✕</button>
            {/if}
        </div>
        <select
            bind:value={cityFilter}
            aria-label="סינון לפי עיר"
            class="rounded-xl bg-white/5 border border-white/10 px-3 py-2 sm:py-2.5 text-sm sm:text-base text-white focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-colors"
        >
            <option value="" style="background:#0d1426;">כל הערים</option>
            {#each cities as city}
                <option value={city} style="background:#0d1426;">{city}</option>
            {/each}
        </select>
        {#if isFiltering}
            <button type="button" onclick={clearFilters}
                class="rounded-xl border border-white/15 bg-white/5 px-3 py-2 sm:py-2.5 text-xs sm:text-sm text-cyan-200 hover:bg-white/10 transition-colors whitespace-nowrap">
                נקה סינון
            </button>
            <span class="text-xs sm:text-sm text-gray-400 whitespace-nowrap">
                מציג {filtered.length} מתוך {coordinators.length}
            </span>
        {/if}
    </div>
{/if}

<!-- סרגל כלים: רענון (בכל הגרסאות) + מידע על השורות שנבחרו -->
<div class="-mt-4 sm:mt-0 mb-2 sm:mb-3 flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-cyan-200">
    <button type="button" onclick={refresh} disabled={refreshing}
        class="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 sm:px-3 sm:py-1.5 hover:bg-white/10 transition-colors disabled:opacity-60"
        aria-label="רענן את רשימת הרכזים">
        <span class="text-sm sm:text-base leading-none" class:spin={refreshing} aria-hidden="true">🔄</span>
        {refreshing ? 'מרענן…' : 'רענן'}
    </button>
    {#if selected.size > 0}
        <span class="font-bold">נבחרו {selected.size} רכזים</span>
        <button type="button" onclick={() => selected.clear()}
            class="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 sm:px-3 sm:py-1.5 hover:bg-white/10 transition-colors">
            נקה בחירה
        </button>
    {/if}
    {#if scrollableX}
        <span class="ms-auto text-[11px] text-gray-400 lg:hidden">↔ ניתן לגלול את הטבלה לצדדים</span>
    {/if}
</div>

{#if coordinators.length === 0}
    <div class="rounded-2xl bg-white/5 border border-white/10 p-8 text-center">
        <div class="text-4xl mb-3">🗂️</div>
        <p class="text-gray-300">עדיין לא הוגדרו רכזי שכונות.</p>
    </div>
{:else if filtered.length === 0}
    <div class="rounded-2xl bg-white/5 border border-white/10 p-8 text-center">
        <div class="text-4xl mb-3">🔍</div>
        <p class="text-gray-300">לא נמצאו רכזים התואמים לסינון.</p>
        <button type="button" onclick={clearFilters}
            class="mt-3 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-cyan-200 hover:bg-white/10 transition-colors">
            נקה סינון
        </button>
    </div>
{:else}
    <!-- עד lg: גלילה אופקית בתוך המסגרת (הטבלה רחבה). מ-lg: יושבת ישר על הדף והכותרת דביקה לחלון -->
    <div bind:this={tableWrap} class="table-wrap rounded-2xl border border-white/10">
        <table class="w-full border-collapse text-right text-[13px] sm:text-base">
            <thead>
                <tr class="sticky z-20 text-[10px] sm:text-xs uppercase tracking-wide text-cyan-200/80"
                    style="top:{headerOffset}px;">
                    <th class="py-1.5 px-2 sm:py-3 sm:px-4 border-b border-white/15 rounded-tr-2xl w-9 sm:w-12 text-center" style="background:#0d1426;">
                        <input type="checkbox" bind:this={selectAllEl} checked={allSelected} onchange={toggleAll}
                            class="h-4 w-4 sm:h-5 sm:w-5 rounded accent-cyan-500 cursor-pointer align-middle" aria-label="בחר הכול" />
                    </th>
                    <th class="py-1.5 px-2 sm:py-3 sm:px-4 font-semibold w-10 sm:w-16 border-b border-white/15" style="background:#0d1426;"><span class="sr-only">תמונה</span></th>
                    <th class="py-1.5 px-2 sm:py-3 sm:px-4 font-semibold border-b border-white/15 whitespace-nowrap" style="background:#0d1426;">שם הרכז</th>
                    <th class="py-1.5 px-2 sm:py-3 sm:px-4 font-semibold border-b border-white/15 whitespace-nowrap" style="background:#0d1426;">עיר</th>
                    <th class="py-1.5 px-2 sm:py-3 sm:px-4 font-semibold border-b border-white/15 whitespace-nowrap" style="background:#0d1426;">שכונה</th>
                    <th class="py-1.5 px-2 sm:py-3 sm:px-4 font-semibold text-center border-b border-white/15 whitespace-nowrap" style="background:#0d1426;">תושבים רשומים</th>
                    <th class="py-1.5 px-2 sm:py-3 sm:px-4 font-semibold text-center border-b border-white/15 whitespace-nowrap" style="background:#0d1426;">פריטים על המפה</th>
                    <th class="py-1.5 px-2 sm:py-3 sm:px-4 font-semibold border-b border-white/15 rounded-tl-2xl whitespace-nowrap" style="background:#0d1426;">טלפון</th>
                </tr>
            </thead>
            <tbody>
                    {#each filtered as c, i (c.id)}
                        <tr class="border-b border-white/5 transition-colors hover:bg-white/5"
                            style={selected.has(c.id)
                                ? 'background:rgba(34,211,238,0.12);'
                                : (i % 2 === 1 ? 'background:rgba(255,255,255,0.025);' : '')}>
                            <!-- סימון בחירה -->
                            <td class="py-1 px-2 sm:py-3 sm:px-4 text-center">
                                <input type="checkbox" checked={selected.has(c.id)} onchange={() => toggle(c.id)}
                                    class="h-4 w-4 sm:h-5 sm:w-5 rounded accent-cyan-500 cursor-pointer align-middle" aria-label={`בחר את ${c.name}`} />
                            </td>
                            <!-- תמונה (ריק אם לא הועלתה תמונה) -->
                            <td class="py-1 px-2 sm:py-3 sm:px-4">
                                {#if c.avatar_url}
                                    <img src={c.avatar_url} alt={c.name}
                                        class="w-7 h-7 sm:w-11 sm:h-11 rounded-full object-cover border border-white/20" />
                                {:else}
                                    <div class="w-7 h-7 sm:w-11 sm:h-11" aria-hidden="true"></div>
                                {/if}
                            </td>
                            <!-- שם -->
                            <td class="py-1 px-2 sm:py-3 sm:px-4 text-white font-bold whitespace-nowrap">{c.name}</td>
                            <!-- עיר -->
                            <td class="py-1 px-2 sm:py-3 sm:px-4 text-gray-300 whitespace-nowrap">{c.city || '—'}</td>
                            <!-- שכונה -->
                            <td class="py-1 px-2 sm:py-3 sm:px-4 text-gray-300">{c.neighborhoods.length ? c.neighborhoods.join(', ') : '—'}</td>
                            <!-- תושבים רשומים -->
                            <td class="py-1 px-2 sm:py-3 sm:px-4 text-center">
                                <span class="inline-block min-w-[1.75rem] sm:min-w-[2.5rem] rounded-md sm:rounded-lg bg-cyan-500/10 px-1.5 py-0.5 sm:px-2 sm:py-1 text-[13px] sm:text-lg font-bold text-cyan-300">
                                    {c.residentsCount}
                                </span>
                            </td>
                            <!-- פריטים שכבר על המפה בשכונה (בעלי קואורדינטות) -->
                            <td class="py-1 px-2 sm:py-3 sm:px-4 text-center">
                                <span class="inline-block min-w-[1.75rem] sm:min-w-[2.5rem] rounded-md sm:rounded-lg bg-emerald-500/10 px-1.5 py-0.5 sm:px-2 sm:py-1 text-[13px] sm:text-lg font-bold text-emerald-300 whitespace-nowrap"
                                    title="פריטים שכבר מופיעים על המפה בשכונה">
                                    📍 {c.itemsOnMap ?? 0}
                                </span>
                            </td>
                            <!-- טלפון (בקצה השמאלי) -->
                            <td class="py-1 px-2 sm:py-3 sm:px-4 whitespace-nowrap">
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

<style>
    /* אנימציית סיבוב לאייקון הרענון בזמן טעינה */
    .spin {
        display: inline-block;
        animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    /* נייד וטאבלט: הטבלה רחבה מהמסך — גלילה/משיכה אופקית בתוך המסגרת */
    @media (max-width: 1023px) {
        .table-wrap {
            overflow-x: auto;
            overscroll-behavior-x: contain;
            -webkit-overflow-scrolling: touch;
        }
        /* בתוך מכל גלילה אין משמעות ל-sticky אנכי, ולכן הכותרת רגילה */
        .table-wrap thead tr {
            position: static;
        }
        /* פס גלילה דק ונראה, כרמז שאפשר למשוך לצדדים */
        .table-wrap::-webkit-scrollbar {
            height: 6px;
        }
        .table-wrap::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.04);
        }
        .table-wrap::-webkit-scrollbar-thumb {
            background: rgba(34, 211, 238, 0.4);
            border-radius: 999px;
        }
    }
</style>
