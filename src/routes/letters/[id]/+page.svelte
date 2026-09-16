<script lang="ts">
    import PageHero from '$lib/components/PageHero.svelte';
    import { enhance } from '$app/forms';
    import { canonical, SITE_NAME } from '$lib/seo';
    import { fmtDeadline, isPastDeadline, personalize } from '$lib/letters';
    import SendButton from '../SendButton.svelte';
    import LetterForm from '../LetterForm.svelte';

    let { data, form } = $props();

    const l = $derived(data.letter);
    // svelte-ignore state_referenced_locally
    let sentCount = $state(data.sentCount);
    $effect(() => { sentCount = data.sentCount; });

    let editing = $state(false);
    let busy = $state('');

    // ערכי הטופס לעריכה: אחרי שגיאה - מה שהוקלד; אחרת - המכתב השמור
    const editValues = $derived(form?.values ?? {
        title:    l.title,
        subject:  l.subject,
        body:     l.body,
        to:       l.to.join('\n'),
        cc:       l.cc.join('\n'),
        source:   l.source,
        deadline: l.deadline,
    });
    $effect(() => { if (form?.error && form?.values) editing = true; });

    const previewBody = $derived(personalize(l.body, data.userName || '________'));
    const late = $derived(isPastDeadline(l.deadline));
</script>

<svelte:head>
    <title>{l.title} - מכתב משותף | {SITE_NAME}</title>
    <meta name="description" content={`${l.subject} - מכתב משותף של ועדי השכונות. לחיצה אחת פותחת את המייל שלכם עם הנמענים והטקסט מוכנים.`} />
    <link rel="canonical" href={canonical(`/letters/${l.id}`)} />
</svelte:head>

<PageHero
    icon="✉️"
    title={l.title}
    subtitle={l.status === 'closed' ? 'המכתב הזה נסגר לשליחה' : 'הכל מוכן - נשאר רק ללחוץ "שלח" במייל שלכם'}
    gradient="from-sky-900/40 to-blue-900/40"
/>

<div class="mb-4 flex flex-wrap items-center justify-between gap-3">
    <a href="/letters" class="text-sm text-sky-400 hover:text-sky-300">→ כל המכתבים</a>
    {#if data.canManage}
        <div class="flex flex-wrap gap-2 text-xs">
            <button type="button" onclick={() => (editing = !editing)}
                class="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-gray-200 hover:bg-white/10">
                {editing ? 'סגור עריכה' : '✏️ עריכת המכתב'}
            </button>
            <form method="POST" action="?/setStatus" use:enhance={() => { busy = 'status'; return async ({ update }) => { await update({ reset: false }); busy = ''; }; }}>
                <input type="hidden" name="status" value={l.status === 'closed' ? 'active' : 'closed'} />
                <button type="submit" disabled={busy === 'status'}
                    class="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-gray-200 hover:bg-white/10 disabled:opacity-50">
                    {l.status === 'closed' ? '🔓 פתח מחדש לשליחה' : '🔒 סגור לשליחה'}
                </button>
            </form>
            <form method="POST" action="?/remove" use:enhance={({ cancel }) => {
                if (!confirm('למחוק את המכתב לצמיתות? התושבים לא יוכלו לשלוח אותו יותר.')) { cancel(); return; }
                busy = 'remove';
                return async ({ update }) => { await update(); busy = ''; };
            }}>
                <button type="submit" disabled={busy === 'remove'}
                    class="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-red-200 hover:bg-red-500/20 disabled:opacity-50">
                    🗑️ מחיקה
                </button>
            </form>
        </div>
    {/if}
</div>

{#if form?.success}
    <div class="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center text-emerald-300">✓ {form.message}</div>
{/if}
{#if form?.error}
    <div class="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-center text-red-300">{form.error}</div>
{/if}

{#if editing && data.canManage}
    <form
        method="POST"
        action="?/update"
        dir="rtl"
        class="mb-8 max-w-2xl mx-auto space-y-4 rounded-2xl border border-sky-500/30 bg-sky-900/10 p-5"
        use:enhance={() => {
            busy = 'update';
            return async ({ result, update }) => {
                await update({ reset: false });
                if (result.type === 'success') editing = false;
                busy = '';
            };
        }}
    >
        <h2 class="text-white font-bold text-lg">עריכת המכתב</h2>
        {#key editValues}
            <LetterForm values={editValues} />
        {/key}
        <div class="flex gap-3 pt-2">
            <button type="submit" disabled={busy === 'update'}
                class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 text-white font-bold hover:scale-105 transition-transform disabled:opacity-50">
                {busy === 'update' ? 'שומר...' : '💾 שמור שינויים'}
            </button>
            <button type="button" onclick={() => (editing = false)}
                class="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10">ביטול</button>
        </div>
    </form>
{/if}

<div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
    <!-- המכתב עצמו -->
    <article class="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6" dir="rtl">
        <dl class="space-y-2 text-sm border-b border-white/10 pb-4 mb-4">
            <div class="flex gap-2">
                <dt class="text-gray-500 w-14 flex-shrink-0">אל:</dt>
                <dd class="text-gray-200 break-all" dir="ltr">{l.to.join(', ')}</dd>
            </div>
            {#if l.cc.length}
                <div class="flex gap-2">
                    <dt class="text-gray-500 w-14 flex-shrink-0">עותק:</dt>
                    <dd class="text-gray-200 break-all" dir="ltr">{l.cc.join(', ')}</dd>
                </div>
            {/if}
            <div class="flex gap-2">
                <dt class="text-gray-500 w-14 flex-shrink-0">נושא:</dt>
                <dd class="text-white font-bold">{l.subject}</dd>
            </div>
        </dl>
        <pre class="whitespace-pre-wrap font-sans text-gray-100 leading-relaxed text-[15px]">{previewBody}</pre>
        {#if !data.loggedIn && l.body.includes('{שם}')}
            <p class="mt-4 text-xs text-gray-500">הקו הריק הוא המקום של השם שלכם - <a href={`/login?redirect=/letters/${l.id}`} class="underline text-sky-300">התחברו</a> והוא ימולא אוטומטית.</p>
        {/if}
    </article>

    <!-- שליחה -->
    <aside class="space-y-4">
        <div class="rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-900/30 to-blue-900/20 p-5">
            <div class="text-4xl font-black text-white">{sentCount.toLocaleString('he-IL')}</div>
            <div class="text-sm text-sky-200 mb-4">תושבים כבר שלחו</div>
            {#if l.status === 'active'}
                <SendButton
                    letter={l}
                    userName={data.userName}
                    loggedIn={data.loggedIn}
                    sent={data.mySent}
                    onchange={(d) => (sentCount = Math.max(0, sentCount + d))}
                    size="lg"
                    returnTo={`/letters/${l.id}`}
                />
                <p class="mt-3 text-xs text-gray-400">המייל יוצא מהכתובת האישית שלכם - אנחנו לא שולחים כלום בשמכם. אפשר לערוך את הטקסט לפני השליחה.</p>
            {:else}
                <p class="text-sm text-gray-300">המכתב נסגר לשליחה. תודה לכל מי ששלח!</p>
            {/if}
        </div>

        <div class="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm space-y-2 text-gray-300">
            <div><span class="text-gray-500">📨 נמענים:</span> {l.to.length}{l.cc.length ? ` (+${l.cc.length} בעותק)` : ''}</div>
            {#if l.deadline}
                <div class={late ? 'text-amber-300' : ''}><span class="text-gray-500">⏰ יעד לשליחה:</span> {fmtDeadline(l.deadline)}{late ? ' (עבר)' : ''}</div>
            {/if}
            {#if l.source}
                <div><span class="text-gray-500">🗳️ על סמך:</span> {l.source}</div>
            {/if}
            <div><span class="text-gray-500">✍️ נפתח על ידי:</span> {l.author}{l.neighborhood ? ` · ${l.neighborhood}` : ''}</div>
        </div>
    </aside>
</div>
