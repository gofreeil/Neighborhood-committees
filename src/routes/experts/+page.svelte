<script lang="ts">
    import { onMount } from 'svelte';
    import { teams } from '$lib/teamsData';

    let flowerEl: HTMLElement | undefined = $state();
    let hasSpun = false;

    function triggerSpin() {
        if (hasSpun || !flowerEl) return;
        hasSpun = true;
        const flower = flowerEl;
        flower.classList.add('spinning');
        for (const p of flower.querySelectorAll('.petal')) p.classList.add('spinning');
        setTimeout(() => {
            flower.classList.remove('spinning');
            for (const p of flower.querySelectorAll('.petal')) p.classList.remove('spinning');
        }, 2200);
    }

    function isInView(el: HTMLElement) {
        const r = el.getBoundingClientRect();
        return r.top < window.innerHeight * 0.85 && r.bottom > window.innerHeight * 0.15;
    }

    onMount(() => {
        if (!flowerEl) return;
        const startIfVisible = () => {
            if (!flowerEl || hasSpun) return;
            if (isInView(flowerEl)) triggerSpin();
        };
        const onScroll = () => startIfVisible();
        setTimeout(startIfVisible, 250);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    });

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
        <div class="expert-flower" bind:this={flowerEl}>
            <!-- מרכז -->
            <a class="petal petal-center" style="--c:{flowerCenter.color}" href="/experts/{flowerCenter.slug}" aria-label={flowerCenter.name}>
                <div class="petal-face">
                    <span class="petal-emoji">{flowerCenter.emoji}</span>
                </div>
                <div class="petal-text">
                    <div class="petal-title">{flowerCenter.name}</div>
                    <div class="petal-desc">{flowerCenter.desc}</div>
                </div>
            </a>

            <!-- 8 עלי כותרת -->
            {#each flowerPetals as p, i}
                <a class="petal petal-{i}" style="--c:{p.color}" href="/experts/{p.slug}" aria-label={p.name}>
                    <div class="petal-face">
                        <span class="petal-emoji">{p.emoji}</span>
                    </div>
                    <div class="petal-text">
                        <div class="petal-title">{p.name}</div>
                        <div class="petal-desc">{p.desc}</div>
                    </div>
                </a>
            {/each}
        </div>
    </div>
</section>

<style>
    .expert-flower {
        position: relative;
        width: min(95vw, 580px);
        aspect-ratio: 1 / 1;
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
        transition: transform 0.35s ease, box-shadow 0.35s ease;
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

    /* מרכז */
    .petal-center {
        width: 24%;
        height: 24%;
        top: 50%;
        left: 50%;
        z-index: 2;
    }

    /* עלי-כותרת */
    .petal:not(.petal-center) {
        width: 22%;
        height: 22%;
    }

    /* 8 מיקומים סביב המרכז בזוויות של 45° על מעגל ברדיוס 38% — עם רווח בין העיגולים */
    .petal-0 { top: 12%;    left: 50%;    }
    .petal-1 { top: 22.86%; left: 77.14%; }
    .petal-2 { top: 50%;    left: 88%;    }
    .petal-3 { top: 77.14%; left: 77.14%; }
    .petal-4 { top: 88%;    left: 50%;    }
    .petal-5 { top: 77.14%; left: 22.86%; }
    .petal-6 { top: 50%;    left: 12%;    }
    .petal-7 { top: 22.86%; left: 22.86%; }

    /* סיבוב חד-פעמי של כל הפרח עם הכניסה לתצוגה — כיוון השעון.
       העיגולים מקיפים את המרכז, אבל התוכן בתוכם נשאר מאונך (counter-rotation). */
    @keyframes flower-spin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
    }
    @keyframes petal-counter-spin {
        from { transform: translate(-50%, -50%) rotate(0deg); }
        to   { transform: translate(-50%, -50%) rotate(-360deg); }
    }
    .expert-flower.spinning {
        animation: flower-spin 2s cubic-bezier(0.45, 0, 0.2, 1) 1;
    }
    .petal.spinning {
        animation: petal-counter-spin 2s cubic-bezier(0.45, 0, 0.2, 1) 1;
    }
    /* בזמן הסיבוב נטרל את ה-hover scale כדי שלא יתערב באנימציה */
    .petal.spinning:hover {
        transform: translate(-50%, -50%);
        animation: petal-counter-spin 2s cubic-bezier(0.45, 0, 0.2, 1) 1;
    }
    @media (prefers-reduced-motion: reduce) {
        .expert-flower.spinning,
        .petal.spinning {
            animation: none;
        }
    }

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
