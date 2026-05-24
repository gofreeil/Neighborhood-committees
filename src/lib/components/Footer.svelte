<script lang="ts">
    const cols = [
        {
            title: 'המערכת',
            links: [
                { href: '/', label: 'דף הבית' },
                { href: '/news', label: 'חדשות' },
                { href: '/votes', label: 'הצבעות' },
                { href: '/discussions', label: 'דיונים' }
            ]
        },
        {
            title: 'פעולה',
            links: [
                { href: '/struggles', label: 'מאבקים משותפים' },
                { href: '/rights', label: 'מיצוי זכויות' },
                { href: '/status', label: 'סטטוס' },
                { href: '/sync', label: 'סינכרונים' }
            ]
        },
        {
            title: 'אודות',
            links: [
                { href: '/vision', label: 'חזון' },
                { href: '/action-plan', label: 'תוכנית פעולה' },
                { href: '/ratings', label: 'דירוג עצמאות ערים' },
                { href: '/coordinators', label: 'רכזי שכונות' }
            ]
        }
    ];
</script>

<footer class="bg-gradient-to-b from-[#070b14] to-black border-t-2 border-blue-600/30 mt-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div class="col-span-2 md:col-span-1">
                <div class="flex items-center gap-3 mb-3">
                    <div class="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl">
                        🏛️
                    </div>
                    <h3 class="text-xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        ועדי שכונות ארצי
                    </h3>
                </div>
                <p class="text-gray-400 text-sm">
                    פלטפורמה ארצית לחיבור, ארגון וקידום של ועדי שכונות —
                    קול אחד מאוחד מול הרשויות.
                </p>
                <a
                    href="https://community-blush.vercel.app"
                    target="_blank"
                    rel="noopener"
                    class="inline-block mt-3 text-sm text-blue-400 hover:text-blue-300 underline"
                >
                    מחובר לאתר "קהילה בשכונה" →
                </a>
            </div>
            {#each cols as col}
                <div>
                    <h4 class="text-white font-bold mb-3">{col.title}</h4>
                    <ul class="space-y-2">
                        {#each col.links as link}
                            <li>
                                <a href={link.href} class="text-gray-400 hover:text-white text-sm transition-colors">
                                    {link.label}
                                </a>
                            </li>
                        {/each}
                    </ul>
                </div>
            {/each}
        </div>
        <div class="border-t border-white/10 mt-8 pt-6 text-center text-gray-500 text-xs">
            © 2026 ועדי שכונות ארצי · כל הזכויות שמורות
        </div>
    </div>
</footer>
