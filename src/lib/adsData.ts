export interface Ad {
    id: number;
    title: string;
    description: string;
    color: string;
    icon: string;
    url?: string;
}

export const ads: Ad[] = [
    {
        id: 1,
        title: "קהילה בשכונה",
        description: "האתר השכונתי המוביל — חיבור תושבים, גמ\"חים, חוגים ועוד",
        color: "from-blue-500 to-purple-600",
        icon: "🏘️",
        url: "https://community-blush.vercel.app"
    },
    {
        id: 2,
        title: "דירוג עצמאות ערים",
        description: "מדד ארצי לעצמאות וחוסן הרשויות המקומיות",
        color: "from-green-500 to-emerald-600",
        icon: "📊",
        url: "/ratings"
    },
    {
        id: 3,
        title: "מיצוי זכויות",
        description: "מדריך מלא לזכויות התושב מול הרשות והמדינה",
        color: "from-orange-500 to-red-600",
        icon: "⚖️",
        url: "/rights"
    },
    {
        id: 4,
        title: "מאבקים פעילים",
        description: "הצטרפו למאבקים משותפים של ועדי שכונות בארץ",
        color: "from-pink-500 to-rose-600",
        icon: "✊",
        url: "/struggles"
    },
    {
        id: 5,
        title: "תוכנית פעולה",
        description: "המפת דרכים שלנו לעצמאות שכונתית אמיתית",
        color: "from-indigo-500 to-blue-600",
        icon: "🗺️",
        url: "/action-plan"
    }
];
