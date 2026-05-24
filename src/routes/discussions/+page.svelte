<script lang="ts">
    import PageHero from '$lib/components/PageHero.svelte';
    const threads = [
        { title: 'איך מתמודדים עם בנייה ללא היתר ברחוב הראשי?', author: 'יוסי כהן · ועד פתח תקווה', replies: 42, views: 1280, hot: true },
        { title: 'מודל ניהול תקציב שכונתי עצמאי — שיתוף', author: 'דנה לוי · רכזת רעננה', replies: 28, views: 890, hot: false },
        { title: 'תיאום פעולה בין ועדי הצפון בנושא תחבורה', author: 'עומר ברקת · ועד קריות', replies: 17, views: 540, hot: false },
        { title: 'כלי שיתוף תושבים שעובדים בשטח — מליצים?', author: 'שירה אבן · ועד גבעתיים', replies: 36, views: 1102, hot: true },
        { title: 'איך לפנות לאמצעי תקשורת בצורה אפקטיבית', author: 'מרים נחום · ועד אשדוד', replies: 19, views: 612, hot: false }
    ];
</script>

<svelte:head><title>דיונים — ועדי שכונות ארצי</title></svelte:head>

<PageHero icon="💬" title="דיונים" subtitle="פורום פתוח לרכזי שכונות ותושבים פעילים" gradient="from-purple-900/40 to-pink-900/40" />

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
