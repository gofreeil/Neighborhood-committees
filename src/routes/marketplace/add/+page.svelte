<script lang="ts">
    import PageHero from '$lib/components/PageHero.svelte';
    import { enhance } from '$app/forms';

    let { data, form } = $props();

    const categories = ['רהיטים', 'מוצרי חשמל', 'ילדים וצעצועים', 'כלי בית', 'ספרים', 'ספורט', 'גינה', 'שונות'];
    let submitting = $state(false);
</script>

<svelte:head><title>פרסום מוצר - ועדי שכונות ארצי</title></svelte:head>

<PageHero
    icon="🏷️"
    title="פרסום מוצר למכירה"
    subtitle="פרסום חינם לשכנים. המוצר יופיע מיד בלוח."
    gradient="from-emerald-900/40 to-teal-900/40"
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
        return async ({ update }) => {
            await update();
            submitting = false;
        };
    }}
>
    <div>
        <label for="title" class="block text-sm text-gray-300 mb-1.5">שם המוצר <span class="text-red-400">*</span></label>
        <input id="title" name="title" type="text" required maxlength="120"
            value={form?.values?.title ?? ''}
            placeholder="לדוגמה: ספה תלת מושבית - כמעט חדשה"
            class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500" />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
            <label for="price" class="block text-sm text-gray-300 mb-1.5">מחיר (₪) <span class="text-red-400">*</span></label>
            <input id="price" name="price" type="number" min="0" step="1" required
                value={form?.values?.priceRaw ?? ''}
                placeholder="450"
                class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500" />
        </div>
        <div>
            <label for="product_category" class="block text-sm text-gray-300 mb-1.5">קטגוריה</label>
            <select id="product_category" name="product_category"
                class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500">
                {#each categories as c}
                    <option value={c} class="bg-gray-900">{c}</option>
                {/each}
            </select>
        </div>
    </div>

    <div>
        <label for="description" class="block text-sm text-gray-300 mb-1.5">תיאור</label>
        <textarea id="description" name="description" rows="4" maxlength="1000"
            placeholder="מצב המוצר, סיבת המכירה, פרטים נוספים..."
            class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 resize-none">{form?.values?.description ?? ''}</textarea>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
            <label for="seller_name" class="block text-sm text-gray-300 mb-1.5">שם המוכר</label>
            <input id="seller_name" name="seller_name" type="text" maxlength="60"
                value={data.name ?? ''}
                placeholder="השם שיוצג לקונים"
                class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500" />
        </div>
        <div>
            <label for="phone" class="block text-sm text-gray-300 mb-1.5">טלפון ליצירת קשר <span class="text-red-400">*</span></label>
            <input id="phone" name="phone" type="tel" required
                value={form?.values?.phone ?? ''}
                placeholder="050-1234567"
                class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500" />
        </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
            <label for="city" class="block text-sm text-gray-300 mb-1.5">עיר</label>
            <input id="city" name="city" type="text" maxlength="60"
                value={data.city ?? ''}
                placeholder="עיר"
                class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500" />
        </div>
        <div>
            <label for="neighborhood" class="block text-sm text-gray-300 mb-1.5">שכונה</label>
            <input id="neighborhood" name="neighborhood" type="text" maxlength="60"
                value={data.neighborhood ?? ''}
                placeholder="שכונה"
                class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500" />
        </div>
    </div>

    <div class="flex gap-3 pt-2">
        <button type="submit" disabled={submitting}
            class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100">
            {submitting ? 'מפרסם...' : '+ פרסם מוצר'}
        </button>
        <a href="/marketplace" class="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-colors">
            ביטול
        </a>
    </div>
</form>
