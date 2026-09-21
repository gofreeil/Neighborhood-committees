// ============================================================
// liveValue.ts — עטיפה לנתון "חי" שמגיע ממקור חיצוני
// ------------------------------------------------------------
// כל מספר/רשימה שהאתר מושך משרת אחר (למשל "קהילה בשכונה") מגיע לדף
// בצורה הזאת, כדי שהממשק יוכל להציג את הנתון האחרון שנשמר גם כשהמקור
// לא בקשר — עם סימן אזהרה במקום מקף או רשימה ריקה.
//
//   value  — הנתון. null רק כשאין גם ערך שמור (טעינה ראשונה אי-פעם + המקור מת).
//   stale  — true = המקור לא ענה, וזה הנתון האחרון שנשמר.
//   at     — מתי הנתון נמשך בהצלחה בפעם האחרונה (ISO). null כשלא ידוע.
// ============================================================

export interface LiveValue<T> {
    value: T | null;
    stale: boolean;
    at: string | null;
}

export function live<T>(value: T, at: string = new Date().toISOString()): LiveValue<T> {
    return { value, stale: false, at };
}

export function staleValue<T>(value: T | null, at: string | null): LiveValue<T> {
    return { value, stale: true, at };
}

/** תאריך קצר בעברית, בשעון ישראל — זהה בשרת ובדפדפן כדי לא לשבור hydration */
export function formatStaleAt(at: string | null): string {
    if (!at) return '';
    const d = new Date(at);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleString('he-IL', {
        timeZone: 'Asia/Jerusalem',
        day: 'numeric',
        month: 'numeric',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/** הטקסט שמופיע ב-tooltip של סימן האזהרה */
export function staleTitle(at: string | null): string {
    const when = formatStaleAt(at);
    return when
        ? `השרת לא בקשר — מוצג הנתון האחרון שנשמר (${when})`
        : 'השרת לא בקשר — מוצג הנתון האחרון שנשמר';
}
