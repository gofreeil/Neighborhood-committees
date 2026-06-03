<script lang="ts">
    import PageHero from '$lib/components/PageHero.svelte';

    const threads = [
        { title: 'איך מתמודדים עם בנייה ללא היתר ברחוב הראשי?', author: 'יוסי כהן · ועד פתח תקווה', replies: 42, views: 1280, hot: true },
        { title: 'מודל ניהול תקציב שכונתי עצמאי - שיתוף', author: 'דנה לוי · רכזת רעננה', replies: 28, views: 890, hot: false },
        { title: 'תיאום פעולה בין ועדי הצפון בנושא תחבורה', author: 'עומר ברקת · ועד קריות', replies: 17, views: 540, hot: false },
        { title: 'כלי שיתוף תושבים שעובדים בשטח - מליצים?', author: 'שירה אבן · ועד גבעתיים', replies: 36, views: 1102, hot: true },
        { title: 'איך לפנות לאמצעי תקשורת בצורה אפקטיבית', author: 'מרים נחום · ועד אשדוד', replies: 19, views: 612, hot: false }
    ];

    const votes = [
        {
            title: 'האם לדרוש מהמדינה תקציב ייעודי לועדי שכונות?',
            yes: 87, no: 9, abst: 4, total: 4218, days: 5
        },
        {
            title: 'תמיכה בעצומה ארצית לשקיפות תכנון עירוני',
            yes: 92, no: 4, abst: 4, total: 3104, days: 12
        },
        {
            title: 'האם להקים קואליציה משותפת של ועדי שכונות לקראת בחירות?',
            yes: 64, no: 22, abst: 14, total: 1980, days: 21
        }
    ];

    let tab: 'discussions' | 'votes' = $state('discussions');
</script>

<svelte:head><title>דיונים והצבעות - ועדי שכונות ארצי</title></svelte:head>

<PageHero
    icon="💬"
    title="דיונים והצבעות"
    subtitle="מעגלי שיח פתוחים - מהדיון להחלטה, בשקיפות מלאה"
    gradient="from-purple-900/40 to-indigo-900/40"
/>

<!-- Tabs -->
<div class="flex gap-2 mb-5 border-b border-white/10">
    <button
        onclick={() => (tab = 'discussions')}
        class="px-4 py-2 font-bold text-sm border-b-2 transition-colors {tab === 'discussions' ? 'text-white border-purple-500' : 'text-gray-400 border-transparent hover:text-white'}"
    >
        💬 דיונים ({threads.length})
    </button>
    <button
        onclick={() => (tab = 'votes')}
        class="px-4 py-2 font-bold text-sm border-b-2 transition-colors {tab === 'votes' ? 'text-white border-blue-500' : 'text-gray-400 border-transparent hover:text-white'}"
    >
        🗳️ הצבעות ({votes.length})
    </button>
</div>

{#if tab === 'discussions'}
    <div class="flex justify-between items-center mb-4">
        <p class="text-gray-400 text-sm">{threads.length} דיונים פעילים</p>
        <button class="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm">
            + פתח דיון חדש
        </button>
    </div>

    <div class="space-y-3">
        {#each threads as t}
            <a href="#" class="block rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 p-4 transition-colors">
                <div class="flex items-start gap-3">
                    <div class="text-2xl">{t.hot ? '🔥' : '💬'}</div>
                    <div class="flex-1 min-w-0">
                        <h3 class="text-white font-bold text-base">{t.title}</h3>
                        <p class="text-xs text-gray-400 mt-1">{t.author}</p>
                    </div>
                    <div class="text-left text-xs text-gray-400 flex-shrink-0">
                        <div>{t.replies} תגובות</div>
                        <div>{t.views} צפיות</div>
                    </div>
                </div>
            </a>
        {/each}
    </div>
{:else}
    <div class="space-y-5">
        {#each votes as v}
            <div class="rounded-2xl bg-white/5 border border-white/10 p-5">
                <h3 class="text-white font-bold text-lg mb-3">{v.title}</h3>
                <div class="space-y-2 mb-3">
                    <div>
                        <div class="flex justify-between text-sm mb-1"><span class="text-green-300">בעד</span><span class="text-white font-bold">{v.yes}%</span></div>
                        <div class="h-2.5 bg-white/10 rounded-full overflow-hidden">
                            <div class="h-full bg-gradient-to-r from-green-500 to-emerald-400" style="width: {v.yes}%"></div>
                        </div>
                    </div>
                    <div>
                        <div class="flex justify-between text-sm mb-1"><span class="text-red-300">נגד</span><span class="text-white font-bold">{v.no}%</span></div>
                        <div class="h-2.5 bg-white/10 rounded-full overflow-hidden">
                            <div class="h-full bg-gradient-to-r from-red-500 to-rose-400" style="width: {v.no}%"></div>
                        </div>
                    </div>
                    <div>
                        <div class="flex justify-between text-sm mb-1"><span class="text-gray-400">נמנע</span><span class="text-white font-bold">{v.abst}%</span></div>
                        <div class="h-2.5 bg-white/10 rounded-full overflow-hidden">
                            <div class="h-full bg-gray-500" style="width: {v.abst}%"></div>
                        </div>
                    </div>
                </div>
                <div class="flex items-center justify-between text-xs text-gray-400">
                    <span>{v.total.toLocaleString('he-IL')} מצביעים · נותרו {v.days} ימים</span>
                    <button class="px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:scale-105 transition-transform">
                        הצבע עכשיו
                    </button>
                </div>
            </div>
        {/each}
    </div>
{/if}
