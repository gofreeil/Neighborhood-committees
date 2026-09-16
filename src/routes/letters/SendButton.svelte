<script lang="ts">
    // כפתור "פתח את המייל שלי": בונה mailto עם הנמענים, הנושא והגוף, פותח את
    // תוכנת המייל של התושב ומסמן בשרת שהוא שלח (רשומת מעורבות 'letter').
    // מי שאין לו תוכנת מייל מקבל חלופות: Gmail / Outlook בדפדפן, או העתקה.
    import { toggleEngagement } from '$lib/engagement';
    import { buildMailto, buildGmailUrl, buildOutlookUrl, personalize } from '$lib/letters';

    interface Props {
        letter: { id: string; to: string[]; cc: string[]; subject: string; body: string };
        userName: string;
        loggedIn: boolean;
        /** האם המשתמש כבר סימן שהוא שלח */
        sent?: boolean;
        /** שינוי במונה השולחים (+1 / -1) - להורה שמציג ספירה */
        onchange?: (delta: number) => void;
        /** כפתור גדול (דף המכתב) או קומפקטי (כרטיס ברשימה) */
        size?: 'lg' | 'md';
        /** לאן לחזור אחרי התחברות */
        returnTo?: string;
    }
    let { letter, userName, loggedIn, sent = false, onchange, size = 'md', returnTo = '/letters' }: Props = $props();

    // svelte-ignore state_referenced_locally
    let isSent = $state(sent);
    let busy = $state(false);
    let moreOpen = $state(false);
    let copied = $state(false);
    let loginHint = $state(false);

    const draft = $derived({
        to: letter.to,
        cc: letter.cc,
        subject: letter.subject,
        body: personalize(letter.body, userName),
    });
    const mailto  = $derived(buildMailto(draft));
    const gmail   = $derived(buildGmailUrl(draft));
    const outlook = $derived(buildOutlookUrl(draft));

    /** מסמן שליחה בשרת (פעם אחת). לא חוסם את פתיחת המייל - רץ ברקע */
    async function markSent() {
        moreOpen = false;
        if (!loggedIn) { loginHint = true; return; }
        if (isSent || busy) return;
        busy = true;
        const res = await toggleEngagement('letter', letter.id, '', returnTo);
        if (res?.active) { isSent = true; onchange?.(1); }
        busy = false;
    }

    async function unmark() {
        if (!isSent || busy) return;
        busy = true;
        const res = await toggleEngagement('letter', letter.id, '', returnTo);
        if (res && !res.active) { isSent = false; onchange?.(-1); }
        busy = false;
    }

    async function copyText() {
        const text = `אל: ${draft.to.join(', ')}\n${draft.cc.length ? `עותק: ${draft.cc.join(', ')}\n` : ''}נושא: ${draft.subject}\n\n${draft.body}`;
        try { await navigator.clipboard.writeText(text); copied = true; setTimeout(() => (copied = false), 2500); } catch { /* ignore */ }
        markSent();
    }

    const big = $derived(size === 'lg');
</script>

<div class="relative" dir="rtl">
    <div class="flex flex-wrap items-center gap-2">
        <a
            href={mailto}
            onclick={markSent}
            class="inline-flex items-center gap-2 rounded-xl font-black text-white shadow-lg transition-transform hover:scale-105 {big ? 'px-6 py-3.5 text-lg' : 'px-4 py-2.5 text-sm'} {isSent ? 'bg-emerald-600' : 'bg-gradient-to-r from-sky-600 to-blue-600'}"
        >
            {#if isSent}
                ✅ שלחתי - לפתוח שוב
            {:else}
                ✉️ פתח את המייל שלי ושלח
            {/if}
        </a>
        <button
            type="button"
            onclick={() => (moreOpen = !moreOpen)}
            aria-expanded={moreOpen}
            class="rounded-xl border border-white/15 bg-white/5 text-gray-200 hover:bg-white/10 {big ? 'px-4 py-3.5 text-sm' : 'px-3 py-2.5 text-xs'}"
        >
            אין לי תוכנת מייל ▾
        </button>
    </div>

    {#if moreOpen}
        <div class="mt-2 flex flex-wrap gap-2 rounded-xl border border-white/10 bg-gray-900/80 p-2 text-sm">
            <a href={gmail} target="_blank" rel="noopener" onclick={markSent}
                class="rounded-lg bg-white/5 px-3 py-2 text-gray-100 hover:bg-white/10">📮 Gmail בדפדפן</a>
            <a href={outlook} target="_blank" rel="noopener" onclick={markSent}
                class="rounded-lg bg-white/5 px-3 py-2 text-gray-100 hover:bg-white/10">📨 Outlook בדפדפן</a>
            <button type="button" onclick={copyText}
                class="rounded-lg bg-white/5 px-3 py-2 text-gray-100 hover:bg-white/10">
                {copied ? '✓ הועתק' : '📋 העתק נמענים וטקסט'}
            </button>
        </div>
    {/if}

    {#if loginHint && !loggedIn}
        <p class="mt-2 text-xs text-amber-200">
            המייל נפתח אצלך. כדי שהשליחה שלך תיספר -
            <a href={`/login?redirect=${encodeURIComponent(returnTo)}`} class="underline font-bold">התחברו</a>
            ולחצו שוב.
        </p>
    {:else if isSent}
        <p class="mt-2 text-xs text-gray-400">
            תודה! נספרת בין השולחים.
            <button type="button" onclick={unmark} disabled={busy} class="underline hover:text-white">לא שלחתי בסוף</button>
        </p>
    {/if}
</div>
