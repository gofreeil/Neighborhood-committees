<script lang="ts">
    import PageHero from '$lib/components/PageHero.svelte';
    import { enhance } from '$app/forms';
    import { formDraft, clearDraft, resumeDraft } from '$lib/formDraft';

    let { data, form } = $props();
    let submitting = $state(false);

    // טיוטה אוטומטית — דיון שנכתב ולא נשלח לא הולך לאיבוד ביציאה מהדף
    const DRAFT_KEY = 'nc-discussion-new';
    let draftRestored = $state(false);
    let formEl = $state<HTMLFormElement | null>(null);

    function discardDraft() {
        clearDraft(DRAFT_KEY);
        resumeDraft(DRAFT_KEY);
        formEl?.reset();
        draftRestored = false;
    }
</script>

<svelte:head><title>פתיחת דיון חדש - ועדי שכונות ארצי</title></svelte:head>

<PageHero
    icon="💬"
    title="פתיחת דיון חדש"
    subtitle="נסחו שאלה או נושא לדיון פתוח עם ועדי שכונות מכל הארץ."
    gradient="from-purple-900/40 to-indigo-900/40"
/>

{#if form?.error}
    <div class="mb-5 px-4 py-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-200 text-sm">
        {form.error}
    </div>
{/if}

{#if draftRestored}
    <div class="max-w-2xl mx-auto mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-purple-500/40 bg-purple-900/20 px-4 py-3 text-sm text-purple-100">
        <span class="font-bold">💾 שחזרנו את מה שכתבת קודם — הטופס ממשיך מהמקום שעצרת.</span>
        <button type="button" onclick={discardDraft}
            class="rounded-full border border-purple-400/50 bg-purple-900/50 px-3 py-1 text-xs font-bold hover:bg-purple-800/60">
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
    <div>
        <label for="title" class="block text-sm text-gray-300 mb-1.5">נושא הדיון <span class="text-red-400">*</span></label>
        <input id="title" name="title" type="text" required minlength="8" maxlength="160"
            defaultValue={form?.title ?? ''}
            placeholder="לדוגמה: איך מתמודדים עם בנייה ללא היתר ברחוב הראשי?"
            class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
    </div>

    <div>
        <label for="author" class="block text-sm text-gray-300 mb-1.5">מפרסם/ת</label>
        <input id="author" name="author" type="text" maxlength="80"
            defaultValue={data.author ?? ''}
            placeholder="השם שיוצג לצד הדיון"
            class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
    </div>

    <div class="flex gap-3 pt-2">
        <button type="submit" disabled={submitting}
            class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100">
            {submitting ? 'פותח...' : '+ פתח דיון'}
        </button>
        <a href="/discussions" class="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-colors">
            ביטול
        </a>
    </div>
</form>
