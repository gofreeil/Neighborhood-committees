<script lang="ts">
    import PageHero from '$lib/components/PageHero.svelte';
    import { toggleEngagement } from '$lib/engagement';

    let { data } = $props();

    const events = [
        { id: 'evt-0', date: '2026-05-28', time: '20:00', title: 'ועידת רכזי המרכז', location: 'תל אביב + זום', attending: 47 },
        { id: 'evt-1', date: '2026-06-02', time: '19:30', title: 'הדרכת רכזים חדשים - מיצוי זכויות', location: 'זום', attending: 124 },
        { id: 'evt-2', date: '2026-06-10', time: '18:00', title: 'מפגש ארצי - תכנון אסטרטגי', location: 'ירושלים', attending: 89 },
        { id: 'evt-3', date: '2026-06-15', time: '20:30', title: 'דיון: שיתוף נתונים בין ועדים', location: 'זום', attending: 56 }
    ];

    // מצב אישור השתתפות + מונה (baseline + מעורבות אמיתית)
    let confirmed = $state<Record<string, boolean>>(
        Object.fromEntries(events.map(e => [e.id, data.myRsvps.includes(e.id)]))
    );
    let extra = $state<Record<string, number>>(
        Object.fromEntries(events.map(e => [e.id, data.counts[e.id] ?? 0]))
    );
    let busy = $state<Record<string, boolean>>({});

    async function rsvp(id: string) {
        if (busy[id]) return;
        busy = { ...busy, [id]: true };
        const res = await toggleEngagement('rsvp', id, '', '/sync');
        if (res) {
            confirmed = { ...confirmed, [id]: res.active };
            extra = { ...extra, [id]: (extra[id] ?? 0) + (res.active ? 1 : -1) };
        }
        busy = { ...busy, [id]: false };
    }

    const count = (e: { id: string; attending: number }) => e.attending + (extra[e.id] ?? 0);
</script>

<svelte:head><title>סינכרונים - ועדי שכונות ארצי</title></svelte:head>

<PageHero icon="🔄" title="סינכרונים" subtitle="פגישות, ועידות ותיאומים בין ועדי שכונות" gradient="from-teal-900/40 to-emerald-900/40" />

<div class="space-y-3">
    {#each events as e}
        <div class="rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center gap-4 flex-wrap">
            <div class="text-center bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/30 rounded-xl px-4 py-2 flex-shrink-0">
                <div class="text-xs text-teal-300">{e.date}</div>
                <div class="text-lg font-bold text-white">{e.time}</div>
            </div>
            <div class="flex-1 min-w-0">
                <h3 class="text-white font-bold">{e.title}</h3>
                <p class="text-xs text-gray-400 mt-1">📍 {e.location} · {count(e)} משתתפים מאושרים</p>
            </div>
            <button
                onclick={() => rsvp(e.id)}
                disabled={busy[e.id]}
                class="px-4 py-2 rounded-lg font-bold text-sm transition-colors disabled:opacity-50 {confirmed[e.id] ? 'bg-emerald-500/25 border border-emerald-500/50 text-emerald-200' : 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white'}"
            >
                {confirmed[e.id] ? '✓ אישרת' : 'אשר השתתפות'}
            </button>
        </div>
    {/each}
</div>

<div class="mt-6 rounded-2xl bg-white/5 border border-white/10 p-5">
    <h3 class="text-white font-bold mb-2">📤 שיתוף משאבים בין ועדים</h3>
    <p class="text-sm text-gray-400 mb-3">
        ועדי שכונות חולקים תבניות מכתבים, ייעוץ משפטי, ניסיון מצטבר ומסמכי עתירות.
        כניסה דרך פורטל הרכזים.
    </p>
    <a href="/coordinators" class="inline-block px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-colors">
        לפורטל הרכזים →
    </a>
</div>
