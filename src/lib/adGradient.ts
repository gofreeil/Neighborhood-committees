// ============================================================
// adGradient.ts — תרגום הגרדיאנט של הפרסומת למחרוזת CSS
// ------------------------------------------------------------
// הבילדר של האתר הזה שומר את הגרדיאנט כמחרוזת CSS מלאה
// (linear-gradient(135deg, #f59e0b, #ea580c)) והכרטיסים מציבים אותה ישירות
// ב-style. הבילדר של "קהילה בשכונה" (וגם של אינדקס העסקים) שומר במקום זה
// זוג מחלקות Tailwind ("from-amber-500 to-orange-600") שהכרטיסים שם
// מרכיבים ל-bg-gradient-to-br. פרסומת שמיובאת משם הגיעה לכאן עם הזוג
// הזה, שכ-CSS הוא לא חוקי — הרצועה האלכסונית ורצועת ה-CTA נשארו בלי צבע.
//
// הטבלה כאן היא הפלטה של קהילה בשכונה מול הפלטה של הבילדר המקומי —
// אותם 22 צבעים, באותו סדר, באותם מזהים (amber, orange, ...).
// ============================================================

/** ברירת המחדל של הבילדר המקומי (ענבר) */
export const DEFAULT_AD_GRADIENT = 'linear-gradient(135deg, #f59e0b, #ea580c)';

const TAILWIND_TO_CSS: Record<string, string> = {
    'from-amber-500 to-orange-600':   'linear-gradient(135deg, #f59e0b, #ea580c)',
    'from-orange-500 to-red-500':     'linear-gradient(135deg, #f97316, #ef4444)',
    'from-yellow-400 to-amber-500':   'linear-gradient(135deg, #facc15, #f59e0b)',
    'from-red-600 to-pink-600':       'linear-gradient(135deg, #dc2626, #db2777)',
    'from-rose-500 to-fuchsia-600':   'linear-gradient(135deg, #f43f5e, #c026d3)',
    'from-rose-700 to-red-900':       'linear-gradient(135deg, #be123c, #7f1d1d)',
    'from-fuchsia-500 to-purple-600': 'linear-gradient(135deg, #d946ef, #9333ea)',
    'from-purple-600 to-pink-600':    'linear-gradient(135deg, #9333ea, #db2777)',
    'from-violet-600 to-indigo-700':  'linear-gradient(135deg, #7c3aed, #4338ca)',
    'from-indigo-600 to-blue-600':    'linear-gradient(135deg, #4f46e5, #2563eb)',
    'from-blue-600 to-cyan-600':      'linear-gradient(135deg, #2563eb, #0891b2)',
    'from-sky-400 to-blue-500':       'linear-gradient(135deg, #38bdf8, #3b82f6)',
    'from-teal-500 to-cyan-600':      'linear-gradient(135deg, #14b8a6, #0891b2)',
    'from-emerald-500 to-teal-700':   'linear-gradient(135deg, #10b981, #0f766e)',
    'from-green-600 to-emerald-600':  'linear-gradient(135deg, #16a34a, #059669)',
    'from-lime-400 to-green-500':     'linear-gradient(135deg, #a3e635, #22c55e)',
    'from-slate-500 to-gray-700':     'linear-gradient(135deg, #64748b, #374151)',
    'from-gray-800 to-slate-900':     'linear-gradient(135deg, #1f2937, #0f172a)',
    'from-orange-300 to-pink-400':    'linear-gradient(135deg, #fdba74, #f472b6)',
    'from-emerald-300 to-teal-400':   'linear-gradient(135deg, #6ee7b7, #2dd4bf)',
    'from-yellow-500 to-amber-700':   'linear-gradient(135deg, #eab308, #b45309)',
    'from-slate-700 to-blue-900':     'linear-gradient(135deg, #334155, #1e3a8a)',
};

/**
 * מחזיר גרדיאנט שאפשר להציב ב-style: מחרוזת CSS נשארת כמו שהיא; זוג
 * מחלקות Tailwind של אתר-אחות מתורגם לפלטה המקומית; כל דבר אחר (ריק,
 * ערך לא מוכר) נופל לברירת המחדל — עדיף צבע כלשהו על רצועה שקופה.
 */
export function toCssGradient(raw: unknown): string {
    const s = typeof raw === 'string' ? raw.trim() : '';
    if (!s) return DEFAULT_AD_GRADIENT;
    if (/^(linear|radial|conic)-gradient\(/.test(s)) return s;
    const tw = TAILWIND_TO_CSS[s.split(/\s+/).filter((c) => /^(from|to)-/.test(c)).join(' ')];
    return tw ?? DEFAULT_AD_GRADIENT;
}
