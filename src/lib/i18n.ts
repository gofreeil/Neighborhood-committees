import { register, init, getLocaleFromNavigator } from 'svelte-i18n';

register('he', () => Promise.resolve({
    site_title: "ועדי שכונות ארצי",
    site_subtitle: "הפלטפורמה הארצית לחיבור ועדי שכונות מכל עיר בישראל",
    nav_home: "בית",
    nav_news: "חדשות",
    nav_votes: "הצבעות",
    nav_discussions: "דיונים",
    nav_struggles: "מאבקים משותפים",
    nav_rights: "מיצוי זכויות",
    nav_status: "סטטוס",
    nav_sync: "סינכרונים",
    nav_vision: "חזון",
    nav_plan: "תוכנית פעולה",
    nav_ratings: "דירוג ערים",
    community_link: "קהילה בשכונה",
    coordinators: "רכזי שכונות"
}));

init({ fallbackLocale: 'he', initialLocale: 'he' });
