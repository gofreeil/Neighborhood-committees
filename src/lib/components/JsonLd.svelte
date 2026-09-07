<script lang="ts">
    // מזריק סכמת schema.org ל-<head> כ-JSON-LD (מרונדר ב-SSR).
    let { schema }: { schema: object | object[] } = $props();
    const json = $derived(JSON.stringify(schema).replace(/</g, '\\u003c'));
</script>

<svelte:head>
    {@html `<script type="application/ld+json">${json}</` + 'script>'}
</svelte:head>
