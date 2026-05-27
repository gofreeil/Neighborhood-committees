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

<article class="prose prose-invert max-w-none space-y-6">
    <!-- החזון שלנו -->
    <div class="rounded-2xl bg-white/5 border border-white/10 p-6 md:p-8">
        <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">🎯 החזון שלנו</h2>
        <div class="space-y-4 text-gray-300 leading-relaxed">
            <p>
                לתפקד כעיר עצמאית, שמסוגלת לספק לעצמה את כל מה שתושבים זקוקים על מנת לנהל שגרת חיים,
                בשאיפה לפרק לבנה אחר לבנה את התלות של התושבים בחסדי הממשלה.
            </p>
            <p>
                הוועדים וחברי האסיפה, בעלי זכות חוקית להיות מעורבים בקבלת ההחלטות בכל מה שקשור לשכונה ולעיר שלהם.
                ראשי מועצה וראשי עיריה לא רוצים להסתכסך עם ראשי וועדים, כיוון שלהם יש קשר ישיר לציבור!
            </p>
            <p class="border-r-4 border-amber-500 pr-4 text-white font-medium">
                על ידי האחדות של הוועדים והחלפת מידע ותיאום עמדות תדיר, לכל וועד יהיה כח של כל הוועדים יחד!
                על ידי זה נוכל להביא לתיקונים חסרי תקדים בזכויות התושב הן מול העיריות והן מול הממשלה!
            </p>
        </div>
    </div>

    <!-- עיר בת קיימה -->
    <div class="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
        <div class="aspect-[16/6] bg-gradient-to-br from-emerald-900/40 to-green-700/30 flex items-center justify-center text-gray-500 text-sm border-b border-white/10">
            <div class="text-center">
                <div class="text-5xl mb-2">🌿</div>
                <div>תמונה — עיר בת קיימה</div>
            </div>
        </div>
        <div class="p-6 md:p-8">
            <h2 class="text-2xl md:text-3xl font-bold text-white mb-3">🏙️ מה נקראת בשבילנו עיר בת קיימה?</h2>
            <p class="text-gray-300 mb-5">
                תו תקן יינתן לעיר עצמאית אם יש בה לפחות את הקריטריונים הבאים:
            </p>
            <ul class="space-y-3 text-gray-300">
                <li class="flex gap-3"><span class="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-sm">1</span><span>גינות ירק למאכל בכל שכונה</span></li>
                <li class="flex gap-3"><span class="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-sm">2</span><span>הורדת יוקר המחיה על ידי מפגש שכונתי בין חקלאים לצרכנים</span></li>
                <li class="flex gap-3"><span class="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-sm">3</span><span>כיתת כוננות אזרחית</span></li>
                <li class="flex gap-3"><span class="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-sm">5</span><span>הקמת חמשת גמ"חים מרכזיים בכל שכונה: לאישה, לגבר, לעזרה ראשונה, לזקנים ולתינוקות</span></li>
                <li class="flex gap-3"><span class="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-sm">6</span><span>התערבות ההורים בתכני הלימוד בבתי הספר</span></li>
                <li class="flex gap-3"><span class="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-sm">7</span><span>פיקוח ושקיפות על כספי הציבור</span></li>
                <li class="flex gap-3"><span class="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-sm">8</span><span>חוגים התומכים בעצמאות וידע לנוער</span></li>
            </ul>
            <p class="text-sm text-amber-300 mt-5">📖 פרטים נוספים בתקנון</p>
        </div>
    </div>

    <!-- טכנולוגיה -->
    <div class="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
        <div class="aspect-[16/6] bg-gradient-to-br from-cyan-900/40 to-blue-700/30 flex items-center justify-center text-gray-500 text-sm border-b border-white/10">
            <div class="text-center">
                <div class="text-5xl mb-2">⚡</div>
                <div>תמונה — טכנולוגיה</div>
            </div>
        </div>
        <div class="p-6 md:p-8">
            <h2 class="text-2xl md:text-3xl font-bold text-white mb-3">⚙️ טכנולוגיה בשירות התושב</h2>
            <p class="text-gray-300 mb-5">
                אנו מקדמים פיתוח ושימוש למוצרי הטכנולוגיה הבאים:
            </p>
            <ul class="space-y-4 text-gray-300">
                <li class="flex gap-3">
                    <span class="flex-shrink-0 w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center text-sm">1</span>
                    <div>
                        <strong class="text-white">מחוללי מים</strong> — מכשיר המייצר מים על ידי הפרשי אטמוספרות
                    </div>
                </li>
                <li class="flex gap-3">
                    <span class="flex-shrink-0 w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center text-sm">2</span>
                    <div>
                        <strong class="text-white">לורה (LoRa)</strong> — מכשירי קשר בפריסה ארצית שאינם תלויים באנטנות הרדיו, הלווינים או הקבלים בארץ.
                        למעשה אפילו ניתן לתקשר ביניהם גם כשהטלפון על מצב טיסה.
                    </div>
                </li>
                <li class="flex gap-3">
                    <span class="flex-shrink-0 w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center text-sm">3</span>
                    <div>
                        <strong class="text-white">מחוללי חשמל</strong> — על ידי טכנולוגיות פירוק מימן. פרטים בקרוב.
                    </div>
                </li>
                <li class="flex gap-3">
                    <span class="flex-shrink-0 w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center text-sm">4</span>
                    <div>
                        <strong class="text-white">מכשיר זיהוי רעידות אדמה</strong> — מזהה רעידת אדמה ומתריע עליה חצי שעה לפני התרחשותה.
                    </div>
                </li>
            </ul>
        </div>
    </div>

    <!-- ציטוט סיום -->
    <div class="rounded-2xl bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-white/10 p-6 md:p-8">
        <p class="text-center text-lg md:text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            "השכונה היא הבית. הוועד הוא הקול. ביחד — אנחנו הכוח."
        </p>
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
