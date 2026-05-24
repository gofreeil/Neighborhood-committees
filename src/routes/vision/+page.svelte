<script lang="ts">
    import PageHero from '$lib/components/PageHero.svelte';
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
