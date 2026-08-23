// ============================================================
// adminNav.ts — מקור אמת יחיד למסכי פאנל הניהול ולהרשאות שלהם.
// בדגם של האינדקס (src/lib/adminNav.js) והגמ"ח הארצי.
//
// שלושה צרכנים: תפריט הפרופיל בהאדר, סרגל הניווט של /admin, ולוח
// האריחים ב-/admin — כדי שרשימת המסכים והגבלות התפקיד לא יתפצלו.
//
// הקובץ נטען גם בדפדפן — אסור לייבא לכאן מודולי $lib/server.
// ההרשאה כאן היא תצוגתית בלבד; כל מסך ניהול נשען על השער בצד השרת
// (getAdminContext ב-lib/server/adsAdmin.ts).
// ============================================================

export interface AdminNavItem {
    /** הקישור המלא */
    href: string;
    /** הנתיב בלי query — לבדיקת "פעיל" */
    path: string;
    icon: string;
    /** תווית קצרה — לסרגל הניווט ולתפריט הפרופיל */
    label: string;
    /** כותרת מלאה — לאריח בלוח הניהול */
    title: string;
    /** משפט הסבר — לאריח */
    desc: string;
    /** רק לסופר-אדמין */
    superOnly?: boolean;
    /** יעד חיצוני — נפתח בלשונית חדשה */
    external?: boolean;
}

const ITEMS: AdminNavItem[] = [
    {
        href: '/admin/ads',
        path: '/admin/ads',
        icon: '📢',
        label: 'פרסומות',
        title: 'ניהול פרסומות',
        desc: 'אישור מודעות, לוח תפוסה ונתוני מפרסמים',
    },
    {
        href: '/admin/content',
        path: '/admin/content',
        icon: '📝',
        label: 'תוכן',
        title: 'ניהול תוכן',
        desc: 'נקודות איסוף, דיונים ואירועים שממתינים לאישור',
    },
    {
        href: '/admin/admins',
        path: '/admin/admins',
        icon: '🔑',
        label: 'אדמינים',
        title: 'ניהול אדמינים',
        desc: 'מינוי אדמינים לאתר והסרת הרשאות',
        superOnly: true,
    },
];

/** המסכים שהמשתמש רשאי לראות. */
export function adminNav(isAdmin: boolean, superAdmin = false): AdminNavItem[] {
    if (!isAdmin) return [];
    return ITEMS.filter((item) => !item.superOnly || superAdmin);
}

/** האם פריט הניווט הוא המסך הנוכחי. */
export function isActiveNav(item: AdminNavItem, pathname: string): boolean {
    if (item.external) return false;
    return pathname === item.path || pathname.startsWith(item.path + '/');
}

/** תג התפקיד שמוצג לצד הכותרת בפאנל ובתפריט הפרופיל. */
export function roleBadge(superAdmin: boolean): string {
    return superAdmin ? '👑 סופר-אדמין' : '🛡️ אדמין';
}
