export interface Ad {
    id: number;
    title: string;
    description: string;
    cta: string;
    href: string;
    image: string;
    color: string;
    imageHeight?: string;
    imageScale?: number;
    hover?: string;
}

export const ads: Ad[] = [
    {
        id: 1,
        title: "בתי הפיוס",
        description: "מתנדבים לתת לך עזרה מלאה בדין / פיוס בכל סיכסוך",
        cta: "יש לך סיכסוך? לחץ לפתרון",
        href: "https://chachmim.vercel.app/",
        image: "/images/bati-hapius.png",
        color: "from-orange-600 to-red-600"
    },
    {
        id: 9,
        title: 'הגמ"ח הארצי',
        description: 'כל הגמחים תחת קורת גג אחת',
        cta: 'לאתר הגמ"ח הארצי',
        hover: 'מצא כל גמח בקלות!',
        href: "https://national-gemach.vercel.app/",
        image: "/images/gemach-harzi.png",
        color: "from-pink-600 via-fuchsia-600 to-purple-700",
    },
    {
        id: 11,
        title: "קהילה בשכונה",
        description: "האתר השכונתי המוביל — חיבור תושבים, גמ\"חים, חוגים ועוד",
        cta: "כנס לקהילה השכונתית שלך",
        href: "https://community-blush.vercel.app/",
        image: "/images/community-neighborhood.png",
        color: "from-blue-500 to-purple-600"
    },
    {
        id: 5,
        title: "מבקר רשויות המדינה",
        description: "מבקרים את הרשויות, ממצים את זכות התושב",
        cta: "מבקרים את הרשויות, ממצים את זכות התושב",
        href: "https://right-to-live.vercel.app/",
        image: "/images/mevaker-rashuyot.png",
        color: "from-blue-700 to-indigo-700",
        imageHeight: "120px",
        imageScale: 1.2,
    },
    {
        id: 10,
        title: "דירוג ציבורי",
        description: "העם מדרג את הרשויות ועובדי הציבור",
        cta: "העם מדרג את הרשויות ועובדי הציבור",
        href: "https://public-rating-il.vercel.app/",
        image: "/images/public-rating.jpeg",
        color: "from-indigo-600 to-blue-600",
        imageHeight: "200px",
        imageScale: 0.9,
    },
    {
        id: 8,
        title: "משאלי העם",
        description: "הבע דעתך על הסוגיות האקטואליות",
        cta: "הבע דעתך על הסוגיות האקטואליות",
        hover: "הבע דעתך על הסוגיות האקטואליות",
        href: "https://referendum-azure.vercel.app/",
        image: "/images/referendum.png",
        color: "from-purple-600 to-indigo-700"
    },
    {
        id: 3,
        title: "קבוצת רכישה",
        description: "הוזל את ההוצאות שלך",
        cta: "הצטרף לקבוצת הרכישה שלנו והוזל מיד את ההוצאות!",
        href: "https://purchasing-groups.vercel.app/",
        image: "/images/whatsapp_cta.png",
        color: "from-green-800 to-emerald-900"
    },
    {
        id: 4,
        title: "מועדון המשקיעים החברתי",
        description: "התחבר עם קבוצת המשקיעים שלנו",
        cta: "התחבר עם קבוצת המשקיעים שלנו",
        href: "https://www.melecshop.com/page/free",
        image: "/images/partners/investments.png",
        color: "from-amber-600 to-orange-600"
    },
    {
        id: 6,
        title: "בעלי מקצוע כשירים",
        description: "חתמו על תנאי הקהילה ונותנים לנו הנחות והטבות יחודיות",
        cta: "מחפש בעל מקצוע איכותי באזורך?",
        href: "https://index-chi-sage.vercel.app/",
        image: "/images/professionals.png",
        color: "from-yellow-500 to-orange-500"
    },
    {
        id: 7,
        title: "חנות החירות",
        description: "מוצרים נבחרים לבריאות טבעית, חקלאות ביתית, טכנולוגיה ועוד",
        cta: "כנסו לחנות לחיים טובים יותר",
        hover: "החנות שלנו!",
        href: "https://heirut-shop.vercel.app/",
        image: "/images/yotzim-lecherut.png",
        color: "from-emerald-600 to-teal-700"
    }
];
