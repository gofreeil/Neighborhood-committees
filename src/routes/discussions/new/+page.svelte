<script lang="ts">
    import PageHero from '$lib/components/PageHero.svelte';
    import { enhance } from '$app/forms';

    let { data, form } = $props();
    let submitting = $state(false);
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

<form
    method="POST"
    dir="rtl"
    class="max-w-2xl mx-auto space-y-4"
    use:enhance={() => {
        submitting = true;
        return async ({ update }) => { await update(); submitting = false; };
    }}
>
    <div>
        <label for="title" class="block text-sm text-gray-300 mb-1.5">נושא הדיון <span class="text-red-400">*</span></label>
        <input id="title" name="title" type="text" required minlength="8" maxlength="160"
            value={form?.title ?? ''}
            placeholder="לדוגמה: איך מתמודדים עם בנייה ללא היתר ברחוב הראשי?"
            class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
    </div>

    <div>
        <label for="author" class="block text-sm text-gray-300 mb-1.5">מפרסם/ת</label>
        <input id="author" name="author" type="text" maxlength="80"
            value={data.author ?? ''}
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
