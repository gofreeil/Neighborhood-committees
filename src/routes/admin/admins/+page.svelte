<script lang="ts">
    import { enhance } from '$app/forms';
    import PageHero from '$lib/components/PageHero.svelte';

    let { data, form } = $props();

    // שדה החיפוש נזרע מ-q שב-URL בטעינה בלבד; משם ואילך חיפוש חי בצד הלקוח
    // svelte-ignore state_referenced_locally
    let q = $state(data.q ?? '');
    let busy = $state('');

    // ═══ חיפוש חי — debounce + שומר-רצף נגד תשובות ישנות ═══
    // svelte-ignore state_referenced_locally
    let results = $state(data.results ?? []);
    // svelte-ignore state_referenced_locally
    let searchedQ = $state(data.q ?? '');
    // התוצאות הן "דומים" (שגיאת כתיב) ולא התאמה מדויקת
    // svelte-ignore state_referenced_locally
    let fuzzy = $state(data.fuzzy ?? false);
    let searching = $state(false);
    let searchError = $state('');
    let seq = 0;
    let debounceTimer: ReturnType<typeof setTimeout> | undefined;

    async function runSearch(query: string) {
        const mySeq = ++seq;
        searching = true;
        searchError = '';
        try {
            const res = await fetch('/admin/admins/search?q=' + encodeURIComponent(query));
            const body = await res.json();
            if (mySeq !== seq) return; // תשובה ישנה — מתעלמים
            results = body.users ?? [];
            fuzzy = body.fuzzy ?? false;
            searchError = body.error ?? '';
            searchedQ = query;
        } catch {
            if (mySeq !== seq) return;
            results = [];
            fuzzy = false;
            searchError = 'החיפוש נכשל — אפשר לנסות שוב';
            searchedQ = query;
        } finally {
            if (mySeq === seq) searching = false;
        }
    }

    function onSearchInput() {
        clearTimeout(debounceTimer);
        const query = q.trim();
        if (query.length < 2) {
            seq++; // מבטל תשובות שבדרך
            searching = false;
            searchError = '';
            results = [];
            fuzzy = false;
            searchedQ = query;
            return;
        }
        searching = true; // חיווי מיידי עוד לפני תום ההשהיה
        debounceTimer = setTimeout(() => runSearch(query), 350);
    }

    function onSearchSubmit(e: SubmitEvent) {
        e.preventDefault();
        clearTimeout(debounceTimer);
        const query = q.trim();
        if (query.length >= 2) runSearch(query);
    }

    const ROLE_HE: Record<string, [string, string]> = {
        super_admin: ['👑 סופר-אדמין',         'bg-amber-500/10 text-amber-300 border-amber-500/40'],
        nc_admin:    ['🛡️ אדמין ועדי שכונות',  'bg-blue-500/10 text-blue-300 border-blue-500/40'],
        user:        ['משתמש רגיל',            'bg-white/5 text-gray-300 border-white/20'],
    };
    const roleHe = (r: string): [string, string] =>
        ROLE_HE[r] ?? [r, 'bg-white/5 text-gray-300 border-white/20'];
    /** תפקיד של אתר אחר (idx_admin, ref_admin וכד') — לא מנוהל מכאן */
    const foreignRole = (u: { app_role?: string }) => !!u.app_role && !(u.app_role in ROLE_HE);

    const OWNER = 'yahavanter@gmail.com';
    /** מוגן משינוי: בעל האתר, או אתה עצמך (נעילה-עצמית בטעות) */
    const isProtected = (u: { email?: string; externalId?: string }) =>
        u.email?.toLowerCase() === OWNER ||
        (!!u.externalId && u.externalId === data.user?.id) ||
        (!!u.email && u.email.toLowerCase() === data.user?.email?.toLowerCase());

    const fmtDate = (iso: string) => {
        if (!iso) return '';
        try {
            return new Date(iso).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: '2-digit' });
        } catch {
            return '';
        }
    };

    // תוצאות החיפוש בלי מי שכבר מופיע ברשימת הצוות למעלה
    const adminIds = $derived(new Set(data.admins.map((a: { id: number }) => a.id)));
    const searchResults = $derived(
        results.filter((u: { id: number }) => !adminIds.has(u.id)),
    );

    const submitFn = (id: string) => () => {
        busy = id;
        return async ({ update }: { update: (o?: { reset?: boolean }) => Promise<void> }) => {
            await update({ reset: false });
            busy = '';
        };
    };
</script>

<svelte:head>
    <title>ניהול אדמינים - ועדי שכונות ארצי</title>
    <meta name="robots" content="noindex" />
</svelte:head>

<PageHero
    icon="🔑"
    title="ניהול אדמינים"
    subtitle="מינוי והסרה של אדמינים לאתר הזה - לסופר-אדמין בלבד"
    gradient="from-amber-900/40 to-orange-900/40"
/>

{#if data.tokenMissing}
    <div class="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-200">
        <b>STRAPI_TOKEN אינו מוגדר בסביבת השרת.</b>
        רשימת המשתמשים המשותפת סגורה בפני טוקן אישי, ולכן בלי משתנה הסביבה
        <code dir="ltr" class="rounded bg-black/30 px-1">STRAPI_TOKEN</code>
        אי אפשר לחפש משתמשים או למנות אדמינים. יש להגדיר אותו בפריסה עם טוקן API של ה-Strapi המשותף.
    </div>
{:else}
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

    <!-- ═══ הצוות הנוכחי ═══ -->
    <section class="mb-8">
        <h2 class="mb-3 font-bold text-gray-200">
            הצוות הנוכחי
            <span class="mr-1 rounded-full bg-white/10 px-2 py-0.5 text-xs text-white">{data.admins.length}</span>
        </h2>

        {#if data.admins.length === 0}
            <p class="rounded-2xl border border-dashed border-white/15 py-10 text-center text-gray-500">
                אין עדיין אדמינים ממונים
            </p>
        {:else}
            <div class="space-y-2">
                {#each data.admins as u (u.id)}
                    {@const [lbl, cls] = roleHe(u.app_role)}
                    <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div class="flex flex-wrap items-center gap-3">
                            <div class="min-w-0 flex-1">
                                <div class="flex flex-wrap items-center gap-2">
                                    <span class="font-bold text-white">{u.name || u.email}</span>
                                    <span class="rounded-full border px-2 py-0.5 text-[11px] font-bold {cls}">{lbl}</span>
                                    {#if u.email?.toLowerCase() === OWNER}
                                        <span class="text-[11px] text-gray-500">(בעל האתר)</span>
                                    {/if}
                                    {#if u.neighborhood}
                                        <span class="text-[11px] text-gray-500">{u.neighborhood}</span>
                                    {/if}
                                </div>
                                <p class="mt-0.5 truncate text-xs text-gray-500" dir="ltr">
                                    {u.email} · #{u.id}{u.created_at ? ' · ' + fmtDate(u.created_at) : ''}
                                </p>
                            </div>

                            {#if !isProtected(u)}
                                <div class="flex flex-shrink-0 flex-wrap items-center gap-2">
                                    <form method="POST" action="?/setRole" use:enhance={submitFn(u.id + 'role')} class="flex items-center gap-2">
                                        <input type="hidden" name="userId" value={u.id} />
                                        <label class="sr-only" for="role-{u.id}">תפקיד</label>
                                        <select
                                            id="role-{u.id}"
                                            name="role"
                                            value={u.app_role}
                                            class="rounded-lg border border-white/20 bg-[#111827] px-2 py-1.5 text-xs text-white focus:outline-none"
                                        >
                                            <option value="nc_admin">אדמין ועדי שכונות</option>
                                            <option value="super_admin">סופר-אדמין</option>
                                        </select>
                                        <button
                                            disabled={busy === u.id + 'role'}
                                            class="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-blue-700 disabled:opacity-40"
                                        >
                                            {busy === u.id + 'role' ? '…' : 'עדכן תפקיד'}
                                        </button>
                                    </form>

                                    <form
                                        method="POST"
                                        action="?/setRole"
                                        use:enhance={({ cancel }) => {
                                            if (!confirm('להסיר את ' + (u.name || u.email) + ' מתפקיד ניהולי?')) {
                                                cancel();
                                                return;
                                            }
                                            busy = u.id + 'rm';
                                            return async ({ update }) => {
                                                await update({ reset: false });
                                                busy = '';
                                            };
                                        }}
                                    >
                                        <input type="hidden" name="userId" value={u.id} />
                                        <input type="hidden" name="role" value="user" />
                                        <button
                                            disabled={busy === u.id + 'rm'}
                                            class="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-300 transition hover:bg-red-500/20 disabled:opacity-40"
                                        >
                                            {busy === u.id + 'rm' ? '…' : 'הסר'}
                                        </button>
                                    </form>
                                </div>
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </section>

    <!-- ═══ מינוי אדמין חדש ═══ -->
    <section>
        <h2 class="mb-1 font-bold text-gray-200">מינוי אדמין חדש</h2>
        <p class="mb-3 text-xs text-gray-500">
            <b class="text-gray-400">אדמין ועדי שכונות</b> - הרשאה לאתר הזה בלבד (ניהול הפרסומות).
            <b class="text-gray-400">סופר-אדמין</b> - הרשאה בכל אתרי הרשת; לתת רק למי שאמור לנהל את כולם.
        </p>

        <form method="GET" onsubmit={onSearchSubmit} class="mb-4 flex gap-2">
            <label class="sr-only" for="q">חיפוש משתמש</label>
            <input
                id="q"
                type="search"
                name="q"
                bind:value={q}
                oninput={onSearchInput}
                placeholder="חיפוש לפי שם / מייל / טלפון (לפחות 2 תווים)…"
                class="w-full max-w-md rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-blue-500/60 focus:outline-none"
            />
            <button class="rounded-xl bg-white/10 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/20">
                🔎 חפש
            </button>
        </form>

        {#if searching}
            <p class="mb-3 text-xs text-gray-500">🔍 מחפש בין המשתמשים הרשומים…</p>
        {/if}
        {#if searchError}
            <p class="mb-3 rounded-xl border border-red-500/30 bg-red-500/10 p-2 text-center text-xs text-red-300">
                {searchError}
            </p>
        {/if}

        {#if searchedQ.length >= 2}
            {#if searchResults.length === 0}
                {#if !searching}
                    <p class="rounded-2xl border border-dashed border-white/15 py-10 text-center text-gray-500">
                        לא נמצא משתמש רשום התואם ל"{searchedQ}"
                    </p>
                {/if}
            {:else}
                {#if fuzzy}
                    <p class="mb-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-2 text-center text-xs text-amber-200">
                        לא נמצאה התאמה מדויקת ל"{searchedQ}" — אולי התכוונת לאחד מאלה:
                    </p>
                {/if}
                <div class="space-y-2">
                    {#each searchResults as u (u.id)}
                        <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <div class="flex flex-wrap items-center gap-3">
                                <div class="min-w-0 flex-1">
                                    <span class="font-bold text-white">{u.name || u.email}</span>
                                    <p class="mt-0.5 truncate text-xs text-gray-500" dir="ltr">
                                        {u.email} · #{u.id}{u.neighborhood ? ' · ' + u.neighborhood : ''}
                                    </p>
                                </div>

                                {#if foreignRole(u)}
                                    <span
                                        class="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[11px] font-bold text-gray-400"
                                        title="app_role: {u.app_role}"
                                    >
                                        תפקיד באתר אחר - מנוהל משם
                                    </span>
                                {:else if isProtected(u)}
                                    <span class="text-[11px] text-gray-500">(אתה)</span>
                                {:else}
                                    <form method="POST" action="?/setRole" use:enhance={submitFn(u.id + 'appoint')} class="flex flex-shrink-0 items-center gap-2">
                                        <input type="hidden" name="userId" value={u.id} />
                                        <label class="sr-only" for="new-role-{u.id}">תפקיד למינוי</label>
                                        <select
                                            id="new-role-{u.id}"
                                            name="role"
                                            class="rounded-lg border border-white/20 bg-[#111827] px-2 py-1.5 text-xs text-white focus:outline-none"
                                        >
                                            <option value="nc_admin">אדמין ועדי שכונות</option>
                                            <option value="super_admin">סופר-אדמין</option>
                                        </select>
                                        <button
                                            disabled={busy === u.id + 'appoint'}
                                            class="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-40"
                                        >
                                            {busy === u.id + 'appoint' ? '…' : '✚ מנה'}
                                        </button>
                                    </form>
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
        {:else}
            <p class="text-sm text-gray-500">
                חפשו משתמש קיים כדי למנות אותו. המשתמש חייב להירשם לאחד מאתרי הרשת פעם אחת לפני שאפשר למנות אותו.
            </p>
        {/if}
    </section>
{/if}
