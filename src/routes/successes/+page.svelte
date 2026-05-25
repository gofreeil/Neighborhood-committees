<script lang="ts">
    import PageHero from '$lib/components/PageHero.svelte';

    const successes = [
        {
            title: 'ביטול היטל ארנונה רטרואקטיבי',
            city: 'באר שבע',
            vaadim: 12,
            year: 2025,
            impact: 'אלפי תושבים נחסכו מחיוב של ₪2.4M',
            tag: 'משפטי',
            emoji: '⚖️'
        },
        {
            title: 'הוספת קו תחבורה ציבורית לשכונה',
            city: 'כרמיאל',
            vaadim: 4,
            year: 2025,
            impact: '6,800 תושבים מקבלים שירות תחבורה חדש',
            tag: 'תחבורה',
            emoji: '🚌'
        },
        {
            title: 'בניית גן ילדים נוסף בשכונת רמות',
            city: 'ירושלים',
            vaadim: 3,
            year: 2024,
            impact: '110 ילדים שלא היה להם מקום קיבלו פתרון',
            tag: 'חינוך',
            emoji: '🏫'
        },
        {
            title: 'שיפוץ מרכז קהילתי וגן ציבורי',
            city: 'חיפה',
            vaadim: 6,
            year: 2024,
            impact: 'תקציב של ₪1.8M שוחרר אחרי שנתיים של מאבק',
            tag: 'תשתיות',
            emoji: '🏞️'
        },
        {
            title: 'דרישה ליישום חוק נגישות במבני ציבור',
            city: 'נתניה',
            vaadim: 8,
            year: 2024,
            impact: '14 מבני ציבור הותאמו לנגישות מלאה',
            tag: 'נגישות',
            emoji: '♿'
        },
        {
            title: 'עצירת תוכנית בנייה ללא היתר',
            city: 'פתח תקווה',
            vaadim: 5,
            year: 2024,
            impact: 'שטח ירוק של 4 דונם נשמר לטובת הקהילה',
            tag: 'תכנון',
            emoji: '🌳'
        }
    ];
</script>

<svelte:head><title>נצחונות — ועדי שכונות ארצי</title></svelte:head>

<PageHero
    icon="🏆"
    title="נצחונות"
    subtitle="מה שכבר השגנו יחד — סיפורי הצלחה של ועדי שכונות שהובילו לשינוי אמיתי"
    gradient="from-green-900/40 to-emerald-900/40"
/>

<!-- Stats summary -->
<div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
    <div class="rounded-2xl bg-white/5 border border-white/10 p-4 text-center">
        <div class="text-2xl md:text-3xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">156</div>
        <div class="text-xs md:text-sm text-gray-400 mt-1">נצחונות סה"כ</div>
    </div>
    <div class="rounded-2xl bg-white/5 border border-white/10 p-4 text-center">
        <div class="text-2xl md:text-3xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">₪4.2M</div>
        <div class="text-xs md:text-sm text-gray-400 mt-1">תקציבים ששוחררו</div>
    </div>
    <div class="rounded-2xl bg-white/5 border border-white/10 p-4 text-center">
        <div class="text-2xl md:text-3xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">38</div>
        <div class="text-xs md:text-sm text-gray-400 mt-1">ערים משתתפות</div>
    </div>
    <div class="rounded-2xl bg-white/5 border border-white/10 p-4 text-center">
        <div class="text-2xl md:text-3xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">45K+</div>
        <div class="text-xs md:text-sm text-gray-400 mt-1">תושבים שהושפעו</div>
    </div>
</div>

<!-- Successes grid -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    {#each successes as s}
        <div class="rounded-2xl bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition-colors">
            <div class="flex items-start gap-3 mb-3">
                <div class="text-3xl flex-shrink-0">{s.emoji}</div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1 flex-wrap">
                        <span class="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 border border-green-500/40">{s.tag}</span>
                        <span class="text-xs text-gray-400">📍 {s.city}</span>
                        <span class="text-xs text-gray-400">· {s.year}</span>
                    </div>
                    <h3 class="text-white font-bold text-lg leading-snug">{s.title}</h3>
                </div>
            </div>
            <div class="pl-12 text-sm text-gray-300 mb-3">{s.impact}</div>
            <div class="pl-12 text-xs text-gray-400">
                <strong class="text-white">{s.vaadim}</strong> ועדי שכונות הובילו את המאבק
            </div>
        </div>
    {/each}
</div>
