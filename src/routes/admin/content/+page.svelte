<script lang="ts">
    import { enhance } from '$app/forms';
    import PageHero from '$lib/components/PageHero.svelte';

    let { data, form } = $props();

    // הלשונית הפותחת נקבעת פעם אחת בטעינה: אם יש אירועים ממתינים — מתחילים שם
    // svelte-ignore state_referenced_locally
    let tab = $state<'events' | 'points' | 'discussions'>(
        data.counts.events > 0 ? 'events' : 'points',
    );
    let busy = $state('');

    const fmtDate = (iso: string) => {
        if (!iso) return '';
        try {
            return new Date(iso).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: '2-digit' });
        } catch {
            return '';
        }
    };

    const submitFn = (id: string) => () => {
        busy = id;
        return async ({ update }: { update: (o?: { reset?: boolean }) => Promise<void> }) => {
            await update({ reset: false });
            busy = '';
        };
    };

    /** אישור סופי לפעולה הרסנית — הסרה ומחיקה בלבד */
    const confirmSubmit = (id: string, question: string) => ({ cancel }: { cancel: () => void }) => {
        if (!confirm(question)) {
            cancel();
            return;
        }
        busy = id;
        return async ({ update }: { update: (o?: { reset?: boolean }) => Promise<void> }) => {
            await update({ reset: false });
            busy = '';
        };
    };

    const TABS = $derived([
        { key: 'events' as const, label: '📅 אירועים ממתינים', count: data.counts.events },
        { key: 'points' as const, label: '📍 נקודות איסוף', count: data.counts.points },
        { key: 'discussions' as const, label: '💬 דיונים', count: data.counts.discussions },
    ]);
</script>

<svelte:head>
    <title>ניהול תוכן - ועדי שכונות ארצי</title>
    <meta name="robots" content="noindex" />
</svelte:head>

<PageHero
    icon="📝"
    title="ניהול תוכן"
    subtitle="מה שהתושבים העלו לאתר - אירועים, נקודות איסוף ודיונים"
    gradient="from-amber-900/40 to-orange-900/40"
/>

<div class="mb-4">
    <a href="/admin" class="text-sm text-amber-400 hover:text-amber-300">→ חזרה לפאנל הניהול</a>
</div>

{#if form?.success}
    <div class="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center text-emerald-300">
        ✓ {form.message}
    </div>
{/if}
{#if form?.error}
    <div class="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-center text-red-300">
        {form.error}
    </div>
{/if}

<div class="mb-5 flex flex-wrap gap-1.5">
    {#each TABS as item (item.key)}
        <button
            type="button"
            onclick={() => (tab = item.key)}
            class="rounded-lg border px-3 py-1.5 text-sm font-bold transition-colors {tab === item.key
                ? 'border-amber-400/40 bg-amber-500/20 text-amber-100'
                : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'}"
        >
            {item.label}
            <span class="mr-1 rounded-full bg-black/30 px-1.5 py-0.5 text-[11px]">{item.count}</span>
        </button>
    {/each}
</div>

{#if tab === 'events'}
    <!-- ═══ אירועים שממתינים לאישור ═══ -->
    {#if data.events.length === 0}
        <p class="rounded-2xl border border-dashed border-white/15 py-10 text-center text-gray-500">
            אין אירועים שממתינים לאישור 🎉
        </p>
    {:else}
        <div class="space-y-2">
            {#each data.events as ev (ev.id)}
                <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div class="flex flex-wrap items-center gap-3">
                        <span class="text-2xl" aria-hidden="true">{ev.icon || '📅'}</span>
                        <div class="min-w-0 flex-1">
                            <p class="font-bold text-white">{ev.title}</p>
                            <p class="mt-0.5 truncate text-xs text-gray-500">
                                {ev.date}{ev.time ? ' · ' + ev.time : ''}{ev.location ? ' · ' + ev.location : ''}
                                {ev.neighborhood ? ' · ' + ev.neighborhood : ''}{ev.city ? ', ' + ev.city : ''}
                            </p>
                            {#if ev.description}
                                <p class="mt-1 line-clamp-2 text-xs text-gray-400">{ev.description}</p>
                            {/if}
                        </div>
                        <div class="flex flex-shrink-0 flex-wrap items-center gap-2">
                            <form method="POST" action="?/setEventStatus" use:enhance={submitFn(ev.id + 'ok')}>
                                <input type="hidden" name="id" value={ev.id} />
                                <input type="hidden" name="status" value="approved" />
                                <button
                                    disabled={busy === ev.id + 'ok'}
                                    class="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-40"
                                >
                                    {busy === ev.id + 'ok' ? '…' : '✓ אשר'}
                                </button>
                            </form>
                            <form method="POST" action="?/setEventStatus" use:enhance={submitFn(ev.id + 'no')}>
                                <input type="hidden" name="id" value={ev.id} />
                                <input type="hidden" name="status" value="rejected" />
                                <button
                                    disabled={busy === ev.id + 'no'}
                                    class="rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-bold text-gray-200 transition hover:bg-white/15 disabled:opacity-40"
                                >
                                    {busy === ev.id + 'no' ? '…' : 'דחה'}
                                </button>
                            </form>
                            <form
                                method="POST"
                                action="?/deleteEvent"
                                use:enhance={confirmSubmit(ev.id + 'rm', 'למחוק לצמיתות את האירוע "' + ev.title + '"?')}
                            >
                                <input type="hidden" name="id" value={ev.id} />
                                <button
                                    disabled={busy === ev.id + 'rm'}
                                    class="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-300 transition hover:bg-red-500/20 disabled:opacity-40"
                                >
                                    {busy === ev.id + 'rm' ? '…' : 'מחק'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
{:else if tab === 'points'}
    <!-- ═══ נקודות איסוף ═══ -->
    {#if data.points.length === 0}
        <p class="rounded-2xl border border-dashed border-white/15 py-10 text-center text-gray-500">
            אין עדיין נקודות איסוף
        </p>
    {:else}
        <div class="space-y-2">
            {#each data.points as it (it.id)}
                <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div class="flex flex-wrap items-center gap-3">
                        <span class="text-2xl" aria-hidden="true">{it.icon || '📍'}</span>
                        <div class="min-w-0 flex-1">
                            <div class="flex flex-wrap items-center gap-2">
                                <span class="font-bold text-white">{it.label}</span>
                                <span class="rounded-full border border-white/20 bg-white/5 px-2 py-0.5 text-[11px] text-gray-300">
                                    {it.category}
                                </span>
                            </div>
                            <p class="mt-0.5 truncate text-xs text-gray-500">
                                {it.neighborhood}{it.city ? ', ' + it.city : ''}
                                {it.createdAt ? ' · ' + fmtDate(it.createdAt) : ''}
                                {it.views ? ' · ' + it.views + ' צפיות' : ''}
                            </p>
                            {#if it.description}
                                <p class="mt-1 line-clamp-2 text-xs text-gray-400">{it.description}</p>
                            {/if}
                        </div>
                        <form
                            method="POST"
                            action="?/removeItem"
                            use:enhance={confirmSubmit(it.id, 'להסיר את "' + it.label + '" מהאתר?')}
                        >
                            <input type="hidden" name="id" value={it.id} />
                            <button
                                disabled={busy === it.id}
                                class="flex-shrink-0 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-300 transition hover:bg-red-500/20 disabled:opacity-40"
                            >
                                {busy === it.id ? '…' : 'הסר'}
                            </button>
                        </form>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
{:else}
    <!-- ═══ דיונים ═══ -->
    {#if data.discussions.length === 0}
        <p class="rounded-2xl border border-dashed border-white/15 py-10 text-center text-gray-500">
            אין עדיין דיונים
        </p>
    {:else}
        <div class="space-y-2">
            {#each data.discussions as d (d.id)}
                <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div class="flex flex-wrap items-center gap-3">
                        <span class="text-2xl" aria-hidden="true">💬</span>
                        <div class="min-w-0 flex-1">
                            <p class="font-bold text-white">{d.title}</p>
                            <p class="mt-0.5 truncate text-xs text-gray-500">
                                {d.author}{d.created_at ? ' · ' + fmtDate(d.created_at) : ''}
                            </p>
                        </div>
                        <form
                            method="POST"
                            action="?/removeItem"
                            use:enhance={confirmSubmit(d.id, 'להסיר את הדיון "' + d.title + '"?')}
                        >
                            <input type="hidden" name="id" value={d.id} />
                            <button
                                disabled={busy === d.id}
                                class="flex-shrink-0 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-300 transition hover:bg-red-500/20 disabled:opacity-40"
                            >
                                {busy === d.id ? '…' : 'הסר'}
                            </button>
                        </form>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
{/if}
