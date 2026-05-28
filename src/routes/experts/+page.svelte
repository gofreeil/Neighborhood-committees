<script lang="ts">
    import { onMount } from 'svelte';
    import { teams } from '$lib/teamsData';

    // הגלגל מתחיל בזווית 180°- ובכניסה לתצוגה מתגלגל ל-0°
    // (חצי סיבוב עם כיוון השעון, סביב נקודת המרכז של העיגול האמצעי).
    let wheelAngle = $state(-180);
    let currentTopIndex = $state(0);

    onMount(() => {
        // עיכוב קצר כדי שהמצב ההתחלתי -180° ייצבע פעם אחת,
        // אחר כך שינוי ל-0 יפעיל את ה-CSS transition (חלק).
        const id = setTimeout(() => {
            wheelAngle = 0;
        }, 80);
        return () => clearTimeout(id);
    });

    // קליק על עלה — מסובב את הגלגל כדי שהעלה הזה יעלה לראש,
    // ובמקביל ה-<a> מנווט לדף של הצוות (לא קוראים ל-preventDefault).
    function handlePetalClick(i: number) {
        if (currentTopIndex === i) return;
        const targetMod = ((-i * 45) % 360 + 360) % 360;
        const currentMod = ((wheelAngle % 360) + 360) % 360;
        let delta = targetMod - currentMod;
        if (delta > 180) delta -= 360;
        else if (delta < -180) delta += 360;
        wheelAngle += delta;
        currentTopIndex = i;
    }

    // הפריט הראשון = מרכז הפרח, השאר = 8 העלים סביב
    const flowerCenter = teams[0];
    const flowerPetals = teams.slice(1);
</script>

<svelte:head><title>מומחים לייעוץ — ועדי שכונות ארצי</title></svelte:head>

<!-- פרח המומחים -->
<section class="my-8 sm:my-12">
    <div class="text-center mb-6">
        <h2 class="text-2xl sm:text-3xl font-bold text-white mb-2">סוגי המומחים שלנו</h2>
        <p class="text-gray-400 text-sm">העבירו את העכבר על כל מומחה לקבלת פרטים</p>
    </div>

    <div class="flex justify-center">
        <div class="flower-outer">
            <!-- הגלגל המסתובב — רק 8 העלים -->
            <div class="expert-flower" style="rotate: {wheelAngle}deg">
                {#each flowerPetals as p, i}
                    <a class="petal petal-{i}" style="--c:{p.color}; rotate: {-wheelAngle}deg" href="/experts/{p.slug}" aria-label={p.name} onclick={() => handlePetalClick(i)}>
                        <div class="petal-face">
                            {#if p.image}
                                <img src={p.image} alt={p.name} loading="lazy" />
                            {:else}
                                <span class="petal-emoji">{p.emoji}</span>
                            {/if}
                        </div>
                        <div class="petal-text">
                            <div class="petal-title">{p.name}</div>
                            <div class="petal-desc">{p.desc}</div>
                        </div>
                    </a>
                {/each}
            </div>

            <!-- המרכז — ציר קבוע, לא משתתף בסיבוב -->
            <a class="petal petal-center" style="--c:{flowerCenter.color}" href="/experts/{flowerCenter.slug}" aria-label={flowerCenter.name}>
                <div class="petal-face">
                    {#if flowerCenter.image}
                        <img src={flowerCenter.image} alt={flowerCenter.name} loading="lazy" />
                    {:else}
                        <span class="petal-emoji">{flowerCenter.emoji}</span>
                    {/if}
                </div>
                <div class="petal-text">
                    <div class="petal-title">{flowerCenter.name}</div>
                    <div class="petal-desc">{flowerCenter.desc}</div>
                </div>
            </a>
        </div>
    </div>
</section>

<style>
    /* קונטיינר חיצוני שמכיל גם את הגלגל וגם את המרכז הקבוע */
    .flower-outer {
        position: relative;
        width: min(95vw, 580px);
        aspect-ratio: 1 / 1;
    }

    .expert-flower {
        position: absolute;
        inset: 0;
        transition: rotate 0.9s cubic-bezier(0.45, 0, 0.2, 1);
    }

    .petal {
        position: absolute;
        display: block;
        text-decoration: none;
        color: inherit;
        border-radius: 9999px;
        overflow: hidden;
        transform: translate(-50%, -50%);
        box-shadow:
            0 8px 24px rgba(0, 0, 0, 0.4),
            0 0 0 3px rgba(0, 0, 0, 0.6),
            0 0 0 5px var(--c, #f59e0b);
        cursor: pointer;
        transition: transform 0.35s ease, box-shadow 0.35s ease, rotate 0.9s cubic-bezier(0.45, 0, 0.2, 1);
    }

    .petal:hover {
        z-index: 5;
        transform: translate(-50%, -50%) scale(1.08);
        box-shadow:
            0 12px 32px rgba(0, 0, 0, 0.55),
            0 0 0 3px rgba(0, 0, 0, 0.7),
            0 0 0 6px var(--c, #f59e0b),
            0 0 30px var(--c, #f59e0b);
    }

    @media (prefers-reduced-motion: reduce) {
        .expert-flower,
        .petal {
            transition: none;
        }
    }

    /* מרכז — ציר קבוע, יושב על ה-.flower-outer ולא משתתף בסיבוב */
    .petal-center {
        width: 24%;
        height: 24%;
        top: 50%;
        left: 50%;
        z-index: 10;
    }

    /* עלי-כותרת */
    .petal:not(.petal-center) {
        width: 22%;
        height: 22%;
    }

    /* 8 מיקומים על מעגל מדויק ברדיוס 38% — אותו מרחק מהמרכז לכל העיגולים.
       38% * cos(45°) = 38% * 0.7071 = 26.87% → אלכסונים ב-50% ± 26.87% = 23.13% / 76.87% */
    .petal-0 { top: 12%;    left: 50%;    }
    .petal-1 { top: 23.13%; left: 76.87%; }
    .petal-2 { top: 50%;    left: 88%;    }
    .petal-3 { top: 76.87%; left: 76.87%; }
    .petal-4 { top: 88%;    left: 50%;    }
    .petal-5 { top: 76.87%; left: 23.13%; }
    .petal-6 { top: 50%;    left: 12%;    }
    .petal-7 { top: 23.13%; left: 23.13%; }

    .petal-face,
    .petal-text {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 0.35s ease;
    }

    .petal-face {
        background:
            radial-gradient(circle at 30% 30%, color-mix(in srgb, var(--c, #f59e0b) 70%, white 10%), color-mix(in srgb, var(--c, #f59e0b) 70%, black 30%));
        opacity: 1;
    }
    .petal-face img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .petal-emoji {
        font-size: clamp(1.8rem, 5vw, 3.2rem);
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));
    }

    .petal-text {
        flex-direction: column;
        text-align: center;
        padding: 0.6rem;
        background: linear-gradient(135deg, rgba(0,0,0,0.92), color-mix(in srgb, var(--c, #f59e0b) 25%, rgba(0,0,0,0.92)));
        color: white;
        opacity: 0;
        gap: 0.25rem;
    }

    .petal:hover .petal-face {
        opacity: 0;
    }
    .petal:hover .petal-text {
        opacity: 1;
    }

    .petal-title {
        font-weight: 800;
        font-size: clamp(0.75rem, 1.8vw, 1rem);
        line-height: 1.1;
    }
    .petal-desc {
        font-size: clamp(0.6rem, 1.2vw, 0.75rem);
        line-height: 1.2;
        opacity: 0.9;
        white-space: pre-line;
    }

    .petal-center .petal-title {
        font-size: clamp(0.85rem, 2.2vw, 1.15rem);
    }
    .petal-center .petal-desc {
        font-size: clamp(0.65rem, 1.4vw, 0.85rem);
    }
</style>
