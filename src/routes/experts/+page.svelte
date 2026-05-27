<script lang="ts">
    import PageHero from '$lib/components/PageHero.svelte';

    // עלי הכותרת של פרח המומחים — 8 סביב מרכז
    // image: יוחלף בקובץ אמיתי כשיגיע (לדוגמה '/images/experts/law.png')
    const flowerCenter = {
        name: 'צוות המומחים שלנו',
        desc: 'רשת ארצית של מומחים מתנדבים ובתעריף מוזל לשירות התושבים והוועדים',
        emoji: '🤝',
        image: '' as string,
        color: '#f59e0b'
    };
    const flowerPetals = [
        { name: 'משפט', desc: 'דיני מקרקעין, שכנים וזכויות התושב', emoji: '⚖️', image: '', color: '#3b82f6' },
        { name: 'נדל"ן', desc: 'הערכות שווי, עסקאות והתחדשות עירונית', emoji: '🏠', image: '', color: '#8b5cf6' },
        { name: 'רפואה', desc: 'זכויות מטופלים מול קופות החולים', emoji: '🩺', image: '', color: '#ef4444' },
        { name: 'חינוך', desc: 'ועדי הורים, שיבוץ ילדים ומאבקי חינוך', emoji: '🎓', image: '', color: '#22c55e' },
        { name: 'עבודה', desc: 'זכויות עובדים והעסקה הוגנת', emoji: '💼', image: '', color: '#fbbf24' },
        { name: 'תכנון ובנייה', desc: 'התנגדויות לתב"ע ולפרויקטים', emoji: '🏗️', image: '', color: '#f59e0b' },
        { name: 'פיננסים', desc: 'גמ"חים, חסכונות והלוואות לקהילה', emoji: '💰', image: '', color: '#06b6d4' },
        { name: 'מיסים', desc: 'החזרי מס וייעוץ מיסים לתושבים', emoji: '🧾', image: '', color: '#10b981' }
    ];
</script>

<svelte:head><title>מומחים לייעוץ — ועדי שכונות ארצי</title></svelte:head>

<PageHero
    icon="🧠"
    title="מומחים לייעוץ"
    subtitle="רשת מומחים ארצית הזמינה לתושבי השכונה — חלקם מתנדבים, חלקם בתעריף מוזל לוועדי שכונות."
    gradient="from-amber-900/40 to-orange-900/40"
/>

<!-- פרח המומחים -->
<section class="my-8 sm:my-12">
    <div class="text-center mb-6">
        <h2 class="text-2xl sm:text-3xl font-bold text-white mb-2">סוגי המומחים שלנו</h2>
        <p class="text-gray-400 text-sm">העבירו את העכבר על כל מומחה לקבלת פרטים</p>
    </div>

    <div class="flex justify-center">
        <div class="expert-flower">
            <!-- מרכז -->
            <div class="petal petal-center" style="--c:{flowerCenter.color}">
                <div class="petal-face">
                    {#if flowerCenter.image}
                        <img src={flowerCenter.image} alt={flowerCenter.name} />
                    {:else}
                        <span class="petal-emoji">{flowerCenter.emoji}</span>
                    {/if}
                </div>
                <div class="petal-text">
                    <div class="petal-title">{flowerCenter.name}</div>
                    <div class="petal-desc">{flowerCenter.desc}</div>
                </div>
            </div>

            <!-- 8 עלי כותרת -->
            {#each flowerPetals as p, i}
                <div class="petal petal-{i}" style="--c:{p.color}">
                    <div class="petal-face">
                        {#if p.image}
                            <img src={p.image} alt={p.name} />
                        {:else}
                            <span class="petal-emoji">{p.emoji}</span>
                        {/if}
                    </div>
                    <div class="petal-text">
                        <div class="petal-title">{p.name}</div>
                        <div class="petal-desc">{p.desc}</div>
                    </div>
                </div>
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
        width: 30%;
        height: 30%;
        top: 50%;
        left: 50%;
        z-index: 2;
    }

    /* עלי-כותרת */
    .petal:not(.petal-center) {
        width: 26%;
        height: 26%;
    }

    /* 8 מיקומים סביב המרכז בזוויות של 45° על מעגל ברדיוס ~35% */
    .petal-0 { top: 15%;    left: 50%;    }
    .petal-1 { top: 25.25%; left: 74.75%; }
    .petal-2 { top: 50%;    left: 85%;    }
    .petal-3 { top: 74.75%; left: 74.75%; }
    .petal-4 { top: 85%;    left: 50%;    }
    .petal-5 { top: 74.75%; left: 25.25%; }
    .petal-6 { top: 50%;    left: 15%;    }
    .petal-7 { top: 25.25%; left: 25.25%; }

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
    }

    .petal-center .petal-title {
        font-size: clamp(0.85rem, 2.2vw, 1.15rem);
    }
    .petal-center .petal-desc {
        font-size: clamp(0.65rem, 1.4vw, 0.85rem);
    }
</style>
