<script lang="ts">
    // שדות טופס המכתב - משותפים לפתיחה (/letters/new) ולעריכה (/letters/[id]).
    // ההורה עוטף ב-<form> עם use:enhance ומטפל בשליחה.
    import { parseRecipients, NAME_PLACEHOLDER } from '$lib/letters';

    interface Values { title: string; subject: string; body: string; to: string; cc: string; source: string; deadline: string }
    let { values }: { values: Values } = $props();

    // svelte-ignore state_referenced_locally
    let to = $state(values.to);
    // svelte-ignore state_referenced_locally
    let body = $state(values.body);

    const toParsed = $derived(parseRecipients(to));
    const inputCls = 'w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-sky-500';
</script>

<div>
    <label for="title" class="block text-sm text-gray-300 mb-1.5">כותרת הקמפיין <span class="text-red-400">*</span></label>
    <input id="title" name="title" type="text" required maxlength="120" defaultValue={values.title}
        placeholder="לדוגמה: דרישה לפתיחת גן ילדים נוסף בשכונה"
        class={inputCls} />
    <p class="mt-1 text-xs text-gray-500">מה שהתושבים יראו בכרטיס. לא נשלח במייל.</p>
</div>

<div>
    <label for="to" class="block text-sm text-gray-300 mb-1.5">נמענים - כתובות המייל <span class="text-red-400">*</span></label>
    <textarea id="to" name="to" rows="3" required bind:value={to}
        placeholder="mayor@city.gov.il, sar@knesset.gov.il&#10;כתובת בכל שורה או מופרדות בפסיק"
        class="{inputCls} resize-y font-mono text-sm" dir="ltr"></textarea>
    <p class="mt-1 text-xs {toParsed.invalid.length ? 'text-red-300' : 'text-gray-500'}">
        {#if toParsed.invalid.length}
            לא תקין: {toParsed.invalid.slice(0, 3).join(', ')}
        {:else if toParsed.valid.length}
            {toParsed.valid.length} נמענים תקינים
        {:else}
            ראש העיר, חברי מועצה, משרד ממשלתי - כל מי שהרכזים החליטו לפנות אליו.
        {/if}
    </p>
</div>

<div>
    <label for="cc" class="block text-sm text-gray-300 mb-1.5">עותק (CC) - לא חובה</label>
    <textarea id="cc" name="cc" rows="2" defaultValue={values.cc}
        placeholder="למשל כתובת הוועד - כדי שכל מכתב שנשלח יגיע גם אליכם"
        class="{inputCls} resize-y font-mono text-sm" dir="ltr"></textarea>
</div>

<div>
    <label for="subject" class="block text-sm text-gray-300 mb-1.5">נושא המייל <span class="text-red-400">*</span></label>
    <input id="subject" name="subject" type="text" required maxlength="200" defaultValue={values.subject}
        placeholder="הנושא שיופיע בשורת הנושא של המייל"
        class={inputCls} />
</div>

<div>
    <label for="body" class="block text-sm text-gray-300 mb-1.5">גוף המכתב <span class="text-red-400">*</span></label>
    <textarea id="body" name="body" rows="14" required maxlength="6000" bind:value={body}
        placeholder={`לכבוד ראש העיר,\n\nאני תושב/ת השכונה ומצטרף/ת לדרישה...\n\nבברכה,\n${NAME_PLACEHOLDER}`}
        class="{inputCls} resize-y leading-relaxed"></textarea>
    <div class="mt-1 flex flex-wrap justify-between gap-2 text-xs text-gray-500">
        <span>כתבו <code class="rounded bg-white/10 px-1 text-sky-200">{NAME_PLACEHOLDER}</code> במקום שבו שם התושב צריך להופיע - הוא ימולא אוטומטית למי שמחובר.</span>
        <span class={body.length > 2000 ? 'text-amber-300' : ''}>{body.length.toLocaleString('he-IL')} / 6,000</span>
    </div>
    {#if body.length > 2000}
        <p class="mt-1 text-xs text-amber-300">מכתב ארוך מ-2,000 תווים עלול להיחתך בחלק מתוכנות המייל בטלפון. קצר יותר = יותר שליחות.</p>
    {/if}
</div>

<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
        <label for="source" class="block text-sm text-gray-300 mb-1.5">על סמך מה</label>
        <input id="source" name="source" type="text" maxlength="300" defaultValue={values.source}
            placeholder="למשל: הצבעת רכזי השכונות 12.9.2026 - 14 בעד, 2 נגד"
            class={inputCls} />
        <p class="mt-1 text-xs text-gray-500">הדיון וההצבעה שהובילו למכתב. מוצג לתושבים כדי שידעו שזו החלטה משותפת.</p>
    </div>
    <div>
        <label for="deadline" class="block text-sm text-gray-300 mb-1.5">תאריך יעד לשליחה</label>
        <input id="deadline" name="deadline" type="date" defaultValue={values.deadline}
            class={inputCls} />
        <p class="mt-1 text-xs text-gray-500">לא חובה. אחרי התאריך המכתב עדיין נשאר פתוח עד שתסגרו אותו.</p>
    </div>
</div>
