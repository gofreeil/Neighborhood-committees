<script lang="ts">
    // סימן אזהרה קטן ליד נתון חי שמוצג מהגיבוי כי המקור לא בקשר.
    // ה-tooltip אומר מתי הנתון נמשך בפעם האחרונה.
    import { staleTitle } from '$lib/liveValue';
    let { at = null, class: cls = '' }: { at?: string | null; class?: string } = $props();
    const title = $derived(staleTitle(at));
</script>

<span
    class="inline-flex items-center justify-center rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-[0.7em] leading-none px-1 py-0.5 cursor-help select-none {cls}"
    {title}
    role="img"
    aria-label={title}
>⚠️</span>
