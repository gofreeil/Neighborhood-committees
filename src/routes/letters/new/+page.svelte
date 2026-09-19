<script lang="ts">
    import PageHero from '$lib/components/PageHero.svelte';
    import { enhance } from '$app/forms';
    import { formDraft, clearDraft, resumeDraft } from '$lib/formDraft';
    import LetterForm from '../LetterForm.svelte';

    let { data, form } = $props();

    let submitting = $state(false);

    // טיוטה אוטומטית - ניסוח מכתב לוקח זמן, ורענון לא אמור למחוק אותו
    const DRAFT_KEY = 'nc-letter-new';
    let draftRestored = $state(false);
    let formEl = $state<HTMLFormElement | null>(null);

    function discardDraft() {
        clearDraft(DRAFT_KEY);
        resumeDraft(DRAFT_KEY);
        formEl?.reset();
        draftRestored = false;
    }

    const values = $derived(form?.values ?? data.values);
</script>

<svelte:head>
    <title>מכתב חדש - מכתב משותף | ועדי שכונות ארצי | יוצאים לחירות</title>
    <meta name="robots" content="noindex" />
</svelte:head>

<PageHero
    icon="✍️"
    title="פתיחת מכתב משותף"
    subtitle="הנמענים, הנושא והטקסט שתכניסו כאן יופיעו מוכנים במייל של כל תושב שילחץ"
    gradient="from-sky-900/40 to-blue-900/40"
/>

<div class="mb-4">
    <a href="/letters" class="text-sm text-sky-400 hover:text-sky-300">→ חזרה למכתבים</a>
</div>

{#if form?.error}
    <div class="mb-5 px-4 py-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-200 text-sm">
        {form.error}
    </div>
{/if}

{#if draftRestored}
    <div class="max-w-2xl mx-auto mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-sky-500/40 bg-sky-900/20 px-4 py-3 text-sm text-sky-100">
        <span class="font-bold">💾 שחזרנו את מה שמילאת קודם - הטופס ממשיך מהמקום שעצרת.</span>
        <button type="button" onclick={discardDraft}
            class="rounded-full border border-sky-400/50 bg-sky-900/50 px-3 py-1 text-xs font-bold hover:bg-sky-800/60">
            התחל מטופס ריק
        </button>
    </div>
{/if}

<form
    bind:this={formEl}
    method="POST"
    dir="rtl"
    class="max-w-2xl mx-auto space-y-4"
    use:formDraft={{ key: DRAFT_KEY, onRestore: () => (draftRestored = true) }}
    use:enhance={() => {
        submitting = true;
        return async ({ result, update }) => {
            if (result.type === 'redirect' || result.type === 'success') clearDraft(DRAFT_KEY);
            await update();
            submitting = false;
        };
    }}
>
    {#key values}
        <LetterForm {values} />
    {/key}

    <div class="flex gap-3 pt-2">
        <button type="submit" disabled={submitting}
            class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 text-white font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100">
            {submitting ? 'פותח...' : '✉️ פרסם את המכתב לתושבים'}
        </button>
        <a href="/letters" class="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-colors">
            ביטול
        </a>
    </div>
</form>
