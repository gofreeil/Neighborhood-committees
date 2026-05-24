<script lang="ts">
    import { ads } from '$lib/adsData';
    let activeTab = $state(0);
</script>

<div class="lg:hidden mb-4">
    <div class="flex gap-1 overflow-x-auto pb-1 scrollbar-thin">
        {#each ads as ad, i}
            <button
                onclick={() => (activeTab = i)}
                class="flex-shrink-0 px-3 py-1.5 rounded-t-lg text-xs font-bold whitespace-nowrap transition-colors {activeTab === i ? 'bg-gradient-to-br text-white ' + ad.color : 'bg-white/5 text-gray-400'}"
            >
                {ad.icon} {ad.title}
            </button>
        {/each}
    </div>
    {#if ads[activeTab]}
        <a
            href={ads[activeTab].url ?? '#'}
            target={ads[activeTab].url?.startsWith('http') ? '_blank' : undefined}
            rel={ads[activeTab].url?.startsWith('http') ? 'noopener' : undefined}
            class="block rounded-b-2xl rounded-tl-2xl p-4 text-white bg-gradient-to-br {ads[activeTab].color}"
        >
            <p class="text-sm">{ads[activeTab].description}</p>
        </a>
    {/if}
</div>
