<script lang="ts">
    import { ads } from '$lib/adsData';
</script>

<aside class="hidden lg:flex flex-col gap-4 sticky top-[200px] self-start">
    <h3 class="text-center text-sm font-bold text-gray-400 uppercase tracking-wider">פרסומות</h3>
    {#each ads as ad}
        <a
            href={ad.url ?? '#'}
            target={ad.url?.startsWith('http') ? '_blank' : undefined}
            rel={ad.url?.startsWith('http') ? 'noopener' : undefined}
            class="block rounded-2xl p-4 text-white shadow-lg hover:scale-105 transition-transform bg-gradient-to-br {ad.color}"
        >
            <div class="text-3xl mb-2">{ad.icon}</div>
            <h4 class="font-bold text-base mb-1">{ad.title}</h4>
            <p class="text-xs text-white/90 leading-snug">{ad.description}</p>
        </a>
    {/each}
</aside>
