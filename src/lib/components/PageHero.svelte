<script lang="ts">
    interface Props {
        icon: string;
        title: string;
        subtitle?: string;
        gradient?: string;
        /** כותרת חשופה — בלי מסגרת ורקע */
        plain?: boolean;
        /** תוכן בקצה השמאלי של הכותרת (למשל כפתור פעולה) */
        children?: Snippet;
    }
    import type { Snippet } from 'svelte';
    let { icon, title, subtitle = '', gradient = 'from-blue-900/40 to-purple-900/40', plain = false, children }: Props = $props();
</script>

<section class={plain
    ? 'mb-8'
    : `relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} border border-white/10 p-6 md:p-8 mb-8`}>
    <div class="flex items-center gap-4">
        <div class="text-5xl md:text-6xl">{icon}</div>
        <div>
            <h1 class="text-2xl md:text-4xl font-black bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                {title}
            </h1>
            {#if subtitle}
                <p class="text-gray-300 text-sm md:text-base mt-1">{subtitle}</p>
            {/if}
        </div>
        {#if children}
            <div class="ms-auto self-start md:self-center shrink-0">{@render children()}</div>
        {/if}
    </div>
</section>
