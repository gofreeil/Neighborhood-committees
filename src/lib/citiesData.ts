// נתוני דירוג ערים - דמו עד שיתחבר הבאקאנד
// 6 קטגוריות: קהילה, צדקה, חירות, עצמאות, מאבק, כלכלה
// הציון הכולל מחושב כממוצע משוקלל (כרגע ממוצע פשוט בבאקאנד הזמני)

export type CategoryKey = 'community' | 'charity' | 'freedom' | 'independence' | 'struggle' | 'economy';

export interface CategoryMeta {
    key: CategoryKey;
    label: string;
    icon: string;
    color: string;        // tailwind text color
    stroke: string;       // hex for SVG
    description: string;
    details: {
        intro: string;
        measures: string[];   // מה נמדד
        sources: string[];    // מקורות
        whyMatters: string;   // למה זה חשוב
    };
}

export const CATEGORIES: CategoryMeta[] = [
    {
        key: 'community',
        label: 'קהילה',
        icon: '👥',
        color: 'text-blue-300',
        stroke: '#93c5fd',
        description: 'מעורבות תושבים, ועדי שכונות, התארגנות',
        details: {
            intro: 'מדד הקהילה בוחן עד כמה התושבים מעורבים, מאורגנים ופועלים יחד מתחת לרדאר של העירייה.',
            measures: [
                'מספר ועדי שכונות פעילים ביחס לאוכלוסייה',
                'תדירות מפגשי קהילה ואסיפות תושבים',
                'אחוז התושבים החברים בקבוצות התארגנות מקומיות',
                'מספר יוזמות תושבים שזכו לתמיכה'
            ],
            sources: ['קהילה בשכונה - רישום ועדי שכונות פעילים', 'קהילה בשכונה - חברים פעילים בקבוצות מקומיות', 'קהילה בשכונה - אסיפות תושבים מדווחות'],
            whyMatters: 'כשתושבים מאורגנים - השלטון המקומי חייב להקשיב. קהילה חזקה היא הבסיס לכל שאר הקטגוריות.'
        }
    },
    {
        key: 'charity',
        label: 'צדקה',
        icon: '❤️',
        color: 'text-pink-300',
        stroke: '#f9a8d4',
        description: 'גמ"חים, ערבות הדדית, סיוע לנזקקים',
        details: {
            intro: 'מדד הצדקה בוחן את מערכת ההסיוע ההדדי הלא־ממשלתית בעיר - גמ"חים, ארגוני חסד ויוזמות פרטיות לעזרה.',
            measures: [
                'מספר גמ"חים פעילים בעיר',
                'היקף הסיוע השנתי דרך גופי צדקה מקומיים',
                'אחוז משפחות שמקבלות סיוע מגופים פרטיים מול ממשלתי',
                'מהירות התגובה של הקהילה למשפחות במצוקה'
            ],
            sources: ['קהילה בשכונה - גמ"חים פעילים בשכונה', 'קהילה בשכונה - מאגר הסיוע ההדדי', 'קהילה בשכונה - דיווחי תושבים על קבלת/נתינת סיוע'],
            whyMatters: 'ערבות הדדית פנים־קהילתית מחליפה תלות במערכת הרווחה הממשלתית ויוצרת חוסן אמיתי.'
        }
    },
    {
        key: 'freedom',
        label: 'חירות',
        icon: '🕊️',
        color: 'text-cyan-300',
        stroke: '#67e8f9',
        description: 'חופש הביטוי, זכויות פרט, רגולציה',
        details: {
            intro: 'מדד החירות בוחן עד כמה הרגולציה המקומית מכבדת את זכויות הפרט, חופש הביטוי וחופש העיסוק.',
            measures: [
                'כמות החוקי עזר מגבילים שנחקקו לאחרונה',
                'אישורי עסק - זמן ממוצע ושיעור דחיות',
                'אכיפה לא־פרופורציונלית (דוחות, פינויים)',
                'חופש הפגנה ומחאה ברחבי העיר'
            ],
            sources: ['קהילה בשכונה - דיווחי תושבים על רגולציה מקומית', 'קהילה בשכונה - תלונות על אכיפה', 'קהילה בשכונה - מאבקים על חופש עיסוק וביטוי'],
            whyMatters: 'עיר חופשית מאפשרת לאזרח לחיות, לעבוד ולהביע את דעתו בלי לבקש רשות.'
        }
    },
    {
        key: 'independence',
        label: 'עצמאות',
        icon: '🏛️',
        color: 'text-amber-300',
        stroke: '#fcd34d',
        description: 'עצמאות מהשלטון, משילות מקומית',
        details: {
            intro: 'מדד העצמאות בוחן עד כמה העיר עצמאית כלכלית, אדמיניסטרטיבית ומבחינת קבלת החלטות מהשלטון המרכזי.',
            measures: [
                'אחוז התקציב העירוני שמגיע ממקורות עצמיים מול מענקי ממשלה',
                'מספר ההחלטות שהתקבלו ללא אישור ממשלתי',
                'יחסי כוחות בין מועצת העיר לבין משרד הפנים',
                'חוסן פיננסי - חוב נמוך, יתרות גבוהות'
            ],
            sources: ['קהילה בשכונה - דיווחי תושבים על תפקוד העירייה', 'קהילה בשכונה - יוזמות אזרחיות עצמאיות', 'קהילה בשכונה - מעורבות בקבלת החלטות מקומית'],
            whyMatters: 'עיר עצמאית יכולה לפעול לפי רצון תושביה ולא להיות תלויה בכפיות ממשלתית.'
        }
    },
    {
        key: 'struggle',
        label: 'מאבק',
        icon: '⚔️',
        color: 'text-orange-300',
        stroke: '#fdba74',
        description: 'פעולה אזרחית, מאבקים מקומיים',
        details: {
            intro: 'מדד המאבק בוחן את היכולת והנכונות של תושבי העיר לפעול אזרחית מול עוולות - מקומיות וארציות.',
            measures: [
                'מספר מאבקים מקומיים פעילים שמדווחים באתר',
                'אחוז ההשתתפות בעצומות והפגנות',
                'הצלחות מתועדות של מאבקים (חוקים שבוטלו, החלטות ששונו)',
                'התארגנויות סביב נושאים כמו דיור, חינוך, בריאות'
            ],
            sources: ['קהילה בשכונה - מאבקים מקומיים פעילים', 'קהילה בשכונה - עצומות וחתימות תושבים', 'קהילה בשכונה - תיעוד הצלחות מאבק'],
            whyMatters: 'מאבק אזרחי הוא הכלי האחרון של האזרח לתקן עוולות כשהמערכת המוסדית נכשלת.'
        }
    },
    {
        key: 'economy',
        label: 'כלכלה',
        icon: '💰',
        color: 'text-green-300',
        stroke: '#86efac',
        description: 'קבוצות רכישה, יוזמות עסקיות, פרנסה',
        details: {
            intro: 'מדד הכלכלה בוחן את היצירתיות הכלכלית האזרחית - קבוצות רכישה, יוזמות עצמאיות וכלכלה ללא תיווך.',
            measures: [
                'מספר קבוצות רכישה פעילות ביחס לאוכלוסייה',
                'יוזמות "מהיצרן לצרכן" מקומיות',
                'אחוז העסקים הקטנים-בינוניים בעיר',
                'יזמות חברתית - עמותות וסטארטאפים מקומיים'
            ],
            sources: ['קהילה בשכונה - קבוצות רכישה פעילות בשכונה', 'קהילה בשכונה - יוזמות "מהיצרן לצרכן"', 'קהילה בשכונה - עסקים קטנים מומלצים על ידי תושבים'],
            whyMatters: 'כלכלה בריאה ברמה המקומית מקטינה תלות בשרשרת הספקים הריכוזית ומחזירה כסף לקהילה.'
        }
    }
];

export interface City {
    rank: number;
    slug: string;
    name: string;
    score: number;
    population: number;   // אומדן תושבים
    scores: Record<CategoryKey, number>;
}

export function formatPopulation(n: number): string {
    return n.toLocaleString('he-IL');
}

export const cities: City[] = [
    { rank: 1,  slug: 'modiin',         name: 'מודיעין',       score: 87.3, population: 100000, scores: { community: 88, charity: 85, freedom: 90, independence: 92, struggle: 84, economy: 86 } },
    { rank: 2,  slug: 'raanana',        name: 'רעננה',         score: 85.1, population: 80000,  scores: { community: 86, charity: 84, freedom: 87, independence: 88, struggle: 82, economy: 84 } },
    { rank: 3,  slug: 'givatayim',      name: 'גבעתיים',       score: 82.7, population: 60000,  scores: { community: 84, charity: 81, freedom: 85, independence: 80, struggle: 83, economy: 82 } },
    { rank: 4,  slug: 'hod-hasharon',   name: 'הוד השרון',     score: 80.4, population: 65000,  scores: { community: 82, charity: 79, freedom: 81, independence: 79, struggle: 80, economy: 81 } },
    { rank: 5,  slug: 'kfar-saba',      name: 'כפר סבא',       score: 78.9, population: 110000, scores: { community: 80, charity: 78, freedom: 79, independence: 76, struggle: 79, economy: 81 } },
    { rank: 6,  slug: 'ramat-gan',      name: 'רמת גן',         score: 77.5, population: 170000, scores: { community: 78, charity: 76, freedom: 79, independence: 77, struggle: 75, economy: 80 } },
    { rank: 7,  slug: 'herzliya',       name: 'הרצליה',         score: 76.8, population: 100000, scores: { community: 75, charity: 74, freedom: 78, independence: 77, struggle: 74, economy: 83 } },
    { rank: 8,  slug: 'nes-ziona',      name: 'נס ציונה',       score: 75.9, population: 53000,  scores: { community: 77, charity: 75, freedom: 76, independence: 74, struggle: 75, economy: 78 } },
    { rank: 9,  slug: 'rishon-lezion',  name: 'ראשון לציון',     score: 74.6, population: 260000, scores: { community: 75, charity: 73, freedom: 75, independence: 73, struggle: 74, economy: 77 } },
    { rank: 10, slug: 'rehovot',        name: 'רחובות',         score: 73.8, population: 150000, scores: { community: 74, charity: 73, freedom: 74, independence: 73, struggle: 72, economy: 77 } },
    { rank: 11, slug: 'petah-tikva',    name: 'פתח תקווה',       score: 72.5, population: 260000, scores: { community: 73, charity: 75, freedom: 71, independence: 70, struggle: 70, economy: 76 } },
    { rank: 12, slug: 'tel-aviv',       name: 'תל אביב-יפו',     score: 71.2, population: 470000, scores: { community: 72, charity: 68, freedom: 75, independence: 74, struggle: 66, economy: 76 } },
    { rank: 13, slug: 'ramat-hasharon', name: 'רמת השרון',       score: 70.8, population: 50000,  scores: { community: 71, charity: 69, freedom: 72, independence: 70, struggle: 69, economy: 74 } },
    { rank: 14, slug: 'holon',          name: 'חולון',           score: 69.5, population: 200000, scores: { community: 70, charity: 71, freedom: 68, independence: 68, struggle: 68, economy: 72 } },
    { rank: 15, slug: 'bat-yam',        name: 'בת ים',           score: 68.3, population: 130000, scores: { community: 69, charity: 70, freedom: 67, independence: 67, struggle: 66, economy: 71 } },
    { rank: 16, slug: 'ashdod',         name: 'אשדוד',           score: 67.4, population: 230000, scores: { community: 69, charity: 71, freedom: 65, independence: 65, struggle: 65, economy: 70 } },
    { rank: 17, slug: 'netanya',        name: 'נתניה',           score: 66.5, population: 230000, scores: { community: 67, charity: 65, freedom: 66, independence: 66, struggle: 65, economy: 70 } },
    { rank: 18, slug: 'jerusalem',      name: 'ירושלים',         score: 65.8, population: 980000, scores: { community: 70, charity: 72, freedom: 64, independence: 62, struggle: 60, economy: 67 } },
    { rank: 19, slug: 'ashkelon',       name: 'אשקלון',         score: 64.7, population: 160000, scores: { community: 66, charity: 65, freedom: 64, independence: 63, struggle: 63, economy: 67 } },
    { rank: 20, slug: 'bnei-brak',      name: 'בני ברק',         score: 63.9, population: 220000, scores: { community: 75, charity: 80, freedom: 55, independence: 60, struggle: 55, economy: 58 } },
    { rank: 21, slug: 'beit-shemesh',   name: 'בית שמש',         score: 63.2, population: 150000, scores: { community: 72, charity: 78, freedom: 54, independence: 58, struggle: 54, economy: 56 } },
    { rank: 22, slug: 'kiryat-ata',     name: 'קריית אתא',       score: 62.4, population: 60000,  scores: { community: 63, charity: 62, freedom: 62, independence: 61, struggle: 62, economy: 64 } },
    { rank: 23, slug: 'lod',            name: 'לוד',             score: 61.9, population: 85000,  scores: { community: 62, charity: 64, freedom: 60, independence: 60, struggle: 61, economy: 63 } },
    { rank: 24, slug: 'haifa',          name: 'חיפה',            score: 61.4, population: 290000, scores: { community: 64, charity: 60, freedom: 62, independence: 60, struggle: 58, economy: 60 } },
    { rank: 25, slug: 'ramla',          name: 'רמלה',           score: 60.8, population: 80000,  scores: { community: 61, charity: 62, freedom: 60, independence: 60, struggle: 60, economy: 62 } },
    { rank: 26, slug: 'kiryat-gat',     name: 'קריית גת',       score: 60.2, population: 60000,  scores: { community: 61, charity: 60, freedom: 60, independence: 59, struggle: 60, economy: 61 } },
    { rank: 27, slug: 'kiryat-bialik',  name: 'קריית ביאליק',     score: 59.7, population: 45000,  scores: { community: 60, charity: 59, freedom: 60, independence: 59, struggle: 59, economy: 61 } },
    { rank: 28, slug: 'kiryat-yam',     name: 'קריית ים',         score: 59.1, population: 40000,  scores: { community: 60, charity: 58, freedom: 59, independence: 59, struggle: 58, economy: 60 } },
    { rank: 29, slug: 'kiryat-motzkin', name: 'קריית מוצקין',     score: 58.6, population: 45000,  scores: { community: 59, charity: 58, freedom: 59, independence: 58, struggle: 58, economy: 59 } },
    { rank: 30, slug: 'tiberias',       name: 'טבריה',           score: 57.9, population: 50000,  scores: { community: 59, charity: 60, freedom: 56, independence: 57, struggle: 57, economy: 58 } },
    { rank: 31, slug: 'tzfat',          name: 'צפת',             score: 57.2, population: 40000,  scores: { community: 60, charity: 62, freedom: 55, independence: 55, struggle: 54, economy: 57 } },
    { rank: 32, slug: 'akko',           name: 'עכו',             score: 56.5, population: 50000,  scores: { community: 58, charity: 57, freedom: 56, independence: 55, struggle: 55, economy: 58 } },
    { rank: 33, slug: 'nahariya',       name: 'נהריה',           score: 55.8, population: 60000,  scores: { community: 57, charity: 55, freedom: 56, independence: 55, struggle: 55, economy: 57 } },
    { rank: 34, slug: 'afula',          name: 'עפולה',           score: 55.1, population: 60000,  scores: { community: 56, charity: 56, freedom: 54, independence: 54, struggle: 55, economy: 56 } },
    { rank: 35, slug: 'nazareth-illit', name: 'נצרת עילית',       score: 54.5, population: 45000,  scores: { community: 55, charity: 55, freedom: 54, independence: 54, struggle: 54, economy: 55 } },
    { rank: 36, slug: 'nazareth',       name: 'נצרת',             score: 54.0, population: 80000,  scores: { community: 56, charity: 56, freedom: 53, independence: 52, struggle: 53, economy: 54 } },
    { rank: 37, slug: 'eilat',          name: 'אילת',             score: 53.5, population: 55000,  scores: { community: 53, charity: 50, freedom: 55, independence: 53, struggle: 52, economy: 58 } },
    { rank: 38, slug: 'dimona',         name: 'דימונה',           score: 53.1, population: 35000,  scores: { community: 54, charity: 53, freedom: 53, independence: 52, struggle: 53, economy: 54 } },
    { rank: 39, slug: 'arad',           name: 'ערד',             score: 52.8, population: 30000,  scores: { community: 53, charity: 52, freedom: 53, independence: 52, struggle: 53, economy: 54 } },
    { rank: 40, slug: 'sderot',         name: 'שדרות',           score: 52.5, population: 35000,  scores: { community: 56, charity: 54, freedom: 51, independence: 50, struggle: 55, economy: 49 } },
    { rank: 41, slug: 'beer-sheva',     name: 'באר שבע',         score: 52.3, population: 220000, scores: { community: 55, charity: 53, freedom: 52, independence: 48, struggle: 50, economy: 53 } }
];

export function getCityBySlug(slug: string): City | undefined {
    return cities.find(c => c.slug === slug);
}

export function scoreColor(s: number): string {
    return s >= 80 ? 'text-green-300' : s >= 65 ? 'text-yellow-300' : 'text-red-300';
}

export function scoreHex(s: number): string {
    return s >= 80 ? '#86efac' : s >= 65 ? '#fde047' : '#fca5a5';
}
