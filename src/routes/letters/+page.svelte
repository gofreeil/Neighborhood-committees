<script lang="ts">
    import PageHero from '$lib/components/PageHero.svelte';
    import { canonical, SITE_NAME } from '$lib/seo';
    import { fmtDeadline, isPastDeadline } from '$lib/letters';
    import SendButton from './SendButton.svelte';

    let { data } = $props();

    // מונה השולחים חי - מתעדכן מיד כשהתושב לוחץ, בלי רענון
    // svelte-ignore state_referenced_locally
    let counts = $state<Record<string, number>>({ ...data.counts });
    const bump = (id: string) => (delta: number) => {
        counts = { ...counts, [id]: Math.max(0, (counts[id] ?? 0) + delta) };
    };

    const active = $derived(data.letters.filter((l) => l.status === 'active'));
    const closed = $derived(data.letters.filter((l) => l.status === 'closed'));
    let showClosed = $state(false);

    const steps = [
        { icon: '🗳️', title: 'הרכזים מחליטים', text: 'אחרי דיון והצבעה, רכזי השכונות מנסחים מכתב אחד ומכניסים את הנמענים - ראש העיר, משרד, חברי כנסת.' },
        { icon: '✉️', title: 'אתם לוחצים', text: 'כפתור אחד פותח את המייל שלכם עם הנמענים, הנושא והמכתב כבר בפנים. השם שלכם ממולא אוטומטית.' },
        { icon: '📣', title: 'רק "שלח"', text: 'המכתב יוצא מהכתובת האישית שלכם. אלף מיילים מאלף תושבים - זה מה שמזיז מקבלי החלטות.' },
    ];
</script>

<svelte:head>
    <title>מכתב משותף - שולחים יחד למקבלי ההחלטות | {SITE_NAME}</title>
    <meta name="description" content="רכזי השכונות מנסחים מכתב אחד אחרי דיון והצבעה, והתושבים שולחים אותו מהמייל האישי שלהם בלחיצת כפתור - נמענים, נושא וטקסט כבר מוכנים." />
    <link rel="canonical" href={canonical('/letters')} />
</svelte:head>

<PageHero
    icon="✉️"
    title="מכתב משותף"
    subtitle="הרכזים מנסחים - התושבים שולחים. אלף מיילים מאלף כתובות, בלחיצה אחת."
    gradient="from-sky-900/40 to-blue-900/40"
/>

<!-- איך זה עובד -->
<section class="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
    {#each steps as s, i}
        <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div class="flex items-center gap-2 mb-1.5">
                <span class="text-2xl">{s.icon}</span>
                <span class="text-xs font-bold text-sky-300">שלב {i + 1}</span>
            </div>
            <h3 class="text-white font-bold">{s.title}</h3>
            <p class="text-sm text-gray-400 mt-1">{s.text}</p>
        </div>
    {/each}
</section>

<div class="flex justify-between items-center mb-4 gap-3 flex-wrap">
    <p class="text-gray-400 text-sm">{active.length} מכתבים פתוחים לשליחה</p>
    {#if data.canManage}
        <a href="/letters/new" class="px-4 py-2 rounded-lg bg-gradient-to-r from-sky-600 to-blue-600 text-white font-bold text-sm">
            + מכתב חדש
        </a>
    {/if}
</div>

{#if active.length === 0}
    <div class="rounded-2xl border border-dashed border-white/15 bg-white/5 p-8 text-center text-gray-400">
        <div class="text-4xl mb-2">📭</div>
        <p>אין כרגע מכתב פתוח. כשרכזי השכונות יסיימו דיון והצבעה - המכתב הבא יופיע כאן.</p>
        {#if data.canManage}
            <a href="/letters/new" class="mt-3 inline-block text-sky-300 underline">פתחו את המכתב הראשון</a>
        {/if}
    </div>
{/if}

<div class="space-y-4">
    {#each active as l (l.id)}
        {@const n = counts[l.id] ?? 0}
        {@const late = isPastDeadline(l.deadline)}
        <article class="rounded-2xl bg-white/5 border border-white/10 p-5 hover:bg-white/[0.07] transition-colors">
            <div class="flex items-start gap-3">
                <div class="text-3xl">✉️</div>
                <div class="flex-1 min-w-0">
                    <a href={`/letters/${l.id}`} class="block">
                        <h2 class="text-white font-bold text-lg hover:text-sky-200">{l.title}</h2>
                    </a>
                    <p class="text-sm text-gray-300 mt-1"><span class="text-gray-500">נושא:</span> {l.subject}</p>
                    <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                        <span>📨 {l.to.length} נמענים</span>
                        <span class="text-emerald-300 font-bold">👥 {n.toLocaleString('he-IL')} שלחו</span>
                        {#if l.deadline}
                            <span class={late ? 'text-amber-300' : ''}>⏰ עד {fmtDeadline(l.deadline)}</span>
                        {/if}
                        {#if l.source}
                            <span>🗳️ {l.source}</span>
                        {/if}
                        <span>{l.author}{l.neighborhood ? ` · ${l.neighborhood}` : ''}</span>
                    </div>
                </div>
            </div>
            <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
                <SendButton
                    letter={l}
                    userName={data.userName}
                    loggedIn={data.loggedIn}
                    sent={data.mySent.includes(l.id)}
                    onchange={bump(l.id)}
                    returnTo="/letters"
                />
                <a href={`/letters/${l.id}`} class="text-sm text-sky-300 hover:text-sky-200 underline">לקריאת המכתב המלא ←</a>
            </div>
        </article>
    {/each}
</div>

{#if closed.length}
    <div class="mt-8">
        <button type="button" onclick={() => (showClosed = !showClosed)} class="text-sm text-gray-400 hover:text-white underline">
            {showClosed ? 'הסתר' : 'הצג'} {closed.length} מכתבים שהסתיימו
        </button>
        {#if showClosed}
            <div class="mt-3 space-y-2">
                {#each closed as l (l.id)}
                    <a href={`/letters/${l.id}`} class="block rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm hover:bg-white/5">
                        <span class="text-gray-300 font-bold">{l.title}</span>
                        <span class="text-gray-500"> · {(counts[l.id] ?? 0).toLocaleString('he-IL')} שלחו · הסתיים</span>
                    </a>
                {/each}
            </div>
        {/if}
    </div>
{/if}
