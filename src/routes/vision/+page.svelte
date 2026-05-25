<script lang="ts">
    import PageHero from '$lib/components/PageHero.svelte';
    const phases = [
        {
            num: 1, title: 'הקמת תשתית (2026)', status: 'בביצוע',
            color: 'from-green-500 to-emerald-600',
            items: ['השקת הפלטפורמה ומאגר ועדי שכונות', 'גיוס 250 רכזי שכונה ראשונים', 'בניית מערכת דירוג ערים אוטומטית', 'חיבור לפלטפורמת קהילה בשכונה']
        },
        {
            num: 2, title: 'הרחבה ארצית (2027)', status: 'מתוכנן',
            color: 'from-blue-500 to-indigo-600',
            items: ['1,500 ועדי שכונות פעילים', 'מאבקים ארציים מתואמים', 'מערך משפטי משותף', 'שיתופי פעולה עם ארגוני חברה אזרחית']
        },
        {
            num: 3, title: 'השפעה פוליטית (2028)', status: 'יעד',
            color: 'from-purple-500 to-pink-600',
            items: ['ייצוג רשמי בועדות תכנון', 'הצעת חוק להסדרת ועדי שכונות', 'בחירות פנימיות לנציגי על-עירוניים', 'שולחן עגול ארצי קבוע מול הממשלה']
        },
        {
            num: 4, title: 'מוסד אזרחי קבוע (2029+)', status: 'חזון',
            color: 'from-amber-500 to-orange-600',
            items: ['חוק יסוד: ועדי שכונות', 'תקציב ממשלתי קבוע', 'נציגות במוסדות בינלאומיים', 'מודל לייצוא לדמוקרטיות אחרות']
        }
    ];
</script>

<svelte:head><title>חזון — ועדי שכונות ארצי</title></svelte:head>

<PageHero icon="🌅" title="החזון שלנו" subtitle="עתיד שבו לקול התושב יש משקל אמיתי בקבלת החלטות" gradient="from-pink-900/40 to-purple-900/40" />

<article class="prose prose-invert max-w-none">
    <div class="rounded-2xl bg-white/5 border border-white/10 p-6 md:p-8 space-y-6">
        <section>
            <h2 class="text-2xl font-bold text-white mb-3">🎯 המטרה</h2>
            <p class="text-gray-300 leading-relaxed">
                להפוך כל ועד שכונה בישראל לכוח אזרחי משפיע, מאורגן ומחובר, שמסוגל להוביל
                שינוי אמיתי ברמת השכונה, העיר והמדינה. שום שכונה אינה לבד.
            </p>
        </section>

        <section>
            <h2 class="text-2xl font-bold text-white mb-3">💡 העקרונות</h2>
            <ul class="space-y-3 text-gray-300">
                <li class="flex gap-3"><span class="text-2xl flex-shrink-0">🤝</span><span><strong class="text-white">סולידריות שכונתית</strong> — מאבק של ועד אחד הוא מאבק של כולם</span></li>
                <li class="flex gap-3"><span class="text-2xl flex-shrink-0">🔍</span><span><strong class="text-white">שקיפות מלאה</strong> — כל החלטה, כל תקציב, כל פעולה — פתוחים לציבור</span></li>
                <li class="flex gap-3"><span class="text-2xl flex-shrink-0">⚖️</span><span><strong class="text-white">דמוקרטיה השתתפותית</strong> — כל תושב משפיע, לא רק מצביע</span></li>
                <li class="flex gap-3"><span class="text-2xl flex-shrink-0">📊</span><span><strong class="text-white">החלטות מבוססות נתונים</strong> — לא תחושות, אלא עובדות</span></li>
                <li class="flex gap-3"><span class="text-2xl flex-shrink-0">🌐</span><span><strong class="text-white">פלורליזם</strong> — מקום לכל קהילה, כל זרם, כל קול</span></li>
            </ul>
        </section>

        <section>
            <h2 class="text-2xl font-bold text-white mb-3">🚀 לאן אנחנו הולכים</h2>
            <p class="text-gray-300 leading-relaxed">
                אנו רואים עתיד שבו ועדי שכונות חזקים מהווים שכבת ממשל שלישית — אחרי הממשלה
                והרשות המקומית — עם נציגות, תקציב וסמכות. עתיד שבו פלטפורמת
                <strong class="text-white">"ועדי שכונות ארצי"</strong>
                היא המוסד האזרחי המוביל לקבלת החלטות מקומיות, ושבו לא ניתן יותר להעביר
                החלטה שמשפיעה על שכונה — בלי לדבר עם ועד השכונה.
            </p>
        </section>

        <section class="border-t border-white/10 pt-6">
            <p class="text-center text-lg font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                "השכונה היא הבית. הוועד הוא הקול. ביחד — אנחנו הכוח."
            </p>
        </section>
    </div>
</article>

<section class="mt-10">
    <div class="text-center mb-6">
        <div class="text-4xl mb-2">🗺️</div>
        <h2 class="text-3xl font-black text-white">תוכנית הפעולה</h2>
        <p class="text-gray-400">המפת דרכים מהיום לעתיד שאנחנו רוצים</p>
    </div>
    <div class="space-y-5">
        {#each phases as p}
            <div class="rounded-2xl bg-white/5 border border-white/10 p-6 relative overflow-hidden">
                <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r {p.color}"></div>
                <div class="flex items-start gap-4 mb-4">
                    <div class="w-14 h-14 rounded-2xl bg-gradient-to-br {p.color} flex items-center justify-center text-2xl font-black text-white flex-shrink-0">
                        {p.num}
                    </div>
                    <div class="flex-1">
                        <h3 class="text-xl md:text-2xl font-bold text-white">{p.title}</h3>
                        <span class="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300 mt-1 inline-block">{p.status}</span>
                    </div>
                </div>
                <ul class="space-y-2 mr-2">
                    {#each p.items as item}
                        <li class="flex items-start gap-2 text-gray-300">
                            <span class="text-blue-400 mt-0.5 flex-shrink-0">●</span>
                            <span>{item}</span>
                        </li>
                    {/each}
                </ul>
            </div>
        {/each}
    </div>
</section>
