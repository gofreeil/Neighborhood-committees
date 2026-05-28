<script lang="ts">
    import { page } from '$app/state';
    import PageHero from '$lib/components/PageHero.svelte';
    import { getCityBySlug, CATEGORIES, scoreColor, scoreHex, cities, formatPopulation } from '$lib/citiesData';

    const slug = $derived(page.params.slug);
    const city = $derived(getCityBySlug(slug));

    // ממוצע ארצי לכל קטגוריה (להשוואה)
    const national = $derived.by(() => {
        const out: Record<string, number> = {};
        for (const cat of CATEGORIES) {
            const sum = cities.reduce((acc, c) => acc + c.scores[cat.key], 0);
            out[cat.key] = Math.round(sum / cities.length);
        }
        return out;
    });

    // === תרשים רדאר ===
    const RADAR_SIZE = 360;
    const RADAR_CENTER = RADAR_SIZE / 2;
    const RADAR_RADIUS = 130;
    const N = CATEGORIES.length;

    // כל קטגוריה ב-360/6 = 60° — מתחילים מלמעלה
    function polarPoint(value: number, index: number, maxRadius = RADAR_RADIUS) {
        const angle = (Math.PI * 2 * index) / N - Math.PI / 2;
        const r = (value / 100) * maxRadius;
        return {
            x: RADAR_CENTER + r * Math.cos(angle),
            y: RADAR_CENTER + r * Math.sin(angle)
        };
    }

    const cityPolygon = $derived(
        city ? CATEGORIES.map((cat, i) => polarPoint(city.scores[cat.key], i)).map(p => `${p.x},${p.y}`).join(' ') : ''
    );
    const nationalPolygon = $derived(
        CATEGORIES.map((cat, i) => polarPoint(national[cat.key], i)).map(p => `${p.x},${p.y}`).join(' ')
    );

    // טבעות רקע (20, 40, 60, 80, 100)
    const rings = [20, 40, 60, 80, 100];
    const axes = $derived(CATEGORIES.map((_, i) => polarPoint(100, i)));
    const labels = $derived(CATEGORIES.map((cat, i) => ({ ...polarPoint(118, i), ...cat })));
</script>

<svelte:head><title>{city ? `${city.name} — דירוג מפורט` : 'עיר לא נמצאה'}</title></svelte:head>

{#if !city}
    <div class="text-center py-20">
        <h1 class="text-2xl text-white font-bold mb-4">עיר לא נמצאה</h1>
        <a href="/ratings" class="text-blue-300 hover:underline">→ חזרה לדירוג</a>
    </div>
{:else}
    <PageHero
        icon="🏙️"
        title={city.name}
        subtitle={`מקום ${city.rank} בדירוג הארצי`}
        gradient="from-yellow-900/40 to-amber-900/40"
    />

    <div class="mb-4">
        <a href="/ratings" class="text-sm text-blue-300 hover:underline">→ חזרה לדירוג הארצי</a>
    </div>

    <!-- כרטיס ציון כללי -->
    <div class="mb-6 rounded-2xl bg-white/5 border border-white/10 p-6 text-center">
        <div class="text-xs text-gray-400 mb-2">ציון כללי</div>
        <div class="text-6xl font-bold {scoreColor(city.score)}">{city.score}</div>
        <div class="text-sm text-gray-400 mt-2">מבוסס על 6 קטגוריות · עודכן לאחרונה: היום</div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- תרשים רדאר -->
        <div class="rounded-2xl bg-white/5 border border-white/10 p-5 lg:order-2">
            <div class="flex items-start justify-between mb-3 gap-3 flex-wrap">
                <div>
                    <h2 class="text-white font-bold text-lg">פרופיל העיר</h2>
                    <p class="text-xs text-gray-400 mt-1">ההיקף הירוק = ממוצע ארצי · המילוי הצבעוני = {city.name}</p>
                </div>
                <div class="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-center min-w-[110px]">
                    <div class="text-[10px] text-gray-400 uppercase tracking-wider">👥 תושבים</div>
                    <div class="text-xl font-black text-white leading-tight">{formatPopulation(city.population)}</div>
                </div>
            </div>
            <div class="flex justify-center" dir="ltr">
                <svg width={RADAR_SIZE} height={RADAR_SIZE} viewBox="0 0 {RADAR_SIZE} {RADAR_SIZE}">
                    <!-- טבעות רקע -->
                    {#each rings as r}
                        <polygon
                            points={CATEGORIES.map((_, i) => polarPoint(r, i)).map(p => `${p.x},${p.y}`).join(' ')}
                            fill="none"
                            stroke="rgba(255,255,255,0.08)"
                            stroke-width="1"
                        />
                    {/each}

                    <!-- צירים -->
                    {#each axes as a}
                        <line x1={RADAR_CENTER} y1={RADAR_CENTER} x2={a.x} y2={a.y} stroke="rgba(255,255,255,0.1)" stroke-width="1" />
                    {/each}

                    <!-- ממוצע ארצי -->
                    <polygon
                        points={nationalPolygon}
                        fill="rgba(134,239,172,0.08)"
                        stroke="#86efac"
                        stroke-width="1.5"
                        stroke-dasharray="4 3"
                    />

                    <!-- העיר -->
                    <polygon
                        points={cityPolygon}
                        fill="{scoreHex(city.score)}33"
                        stroke={scoreHex(city.score)}
                        stroke-width="2"
                    />

                    <!-- נקודות -->
                    {#each CATEGORIES as cat, i}
                        {@const p = polarPoint(city.scores[cat.key], i)}
                        <circle cx={p.x} cy={p.y} r="4" fill={cat.stroke} />
                    {/each}

                    <!-- תוויות -->
                    {#each labels as l}
                        <text
                            x={l.x}
                            y={l.y}
                            text-anchor="middle"
                            dominant-baseline="middle"
                            fill="#d1d5db"
                            font-size="12"
                            font-weight="600"
                        >
                            {l.icon} {l.label}
                        </text>
                    {/each}
                </svg>
            </div>
        </div>

        <!-- ברים -->
        <div class="rounded-2xl bg-white/5 border border-white/10 p-5 lg:order-1">
            <h2 class="text-white font-bold text-lg mb-4">פירוט קטגוריות</h2>
            <div class="space-y-4">
                {#each CATEGORIES as cat}
                    {@const v = city.scores[cat.key]}
                    {@const nat = national[cat.key]}
                    {@const diff = v - nat}
                    <div>
                        <div class="flex items-center justify-between mb-1">
                            <div class="flex items-center gap-2">
                                <span class="text-lg">{cat.icon}</span>
                                <span class="text-sm font-bold {cat.color}">{cat.label}</span>
                            </div>
                            <div class="flex items-baseline gap-2">
                                <span class="text-xs text-gray-500">ארצי: {nat}</span>
                                <span class="text-xs {diff >= 0 ? 'text-green-400' : 'text-red-400'}">
                                    {diff >= 0 ? '+' : ''}{diff}
                                </span>
                                <span class="text-lg font-bold {scoreColor(v)} w-10 text-left">{v}</span>
                            </div>
                        </div>
                        <div class="relative h-3 bg-white/5 rounded-full overflow-hidden">
                            <!-- קו ממוצע ארצי -->
                            <div class="absolute top-0 bottom-0 w-px bg-white/30 z-10" style="right: {nat}%"></div>
                            <!-- בר העיר -->
                            <div class="h-full rounded-full transition-all" style="width: {v}%; background: {cat.stroke};"></div>
                        </div>
                        <p class="text-xs text-gray-500 mt-1">{cat.description}</p>
                    </div>
                {/each}
            </div>
            <p class="text-xs text-gray-500 mt-4 text-center">קו אנכי לבן = ממוצע ארצי</p>
        </div>
    </div>

    <!-- מקורות -->
    <div class="rounded-2xl bg-white/5 border border-white/10 p-5 text-sm">
        <h2 class="text-white font-bold mb-2">מקורות חישוב</h2>
        <p class="text-gray-400 text-xs leading-relaxed">
            הציון מחושב אוטומטית מנתוני
            <a href="https://community.gofreeil.com" target="_blank" rel="noopener" class="text-blue-300 hover:underline font-bold">קהילה בשכונה</a> —
            הפלטפורמה הארצית של תושבים המאורגנים בשכונה: כמות חברים פעילים, ועדים רשומים, יוזמות מקומיות,
            גמ"חים ומאבקים אזרחיים בעיר. ככל שיש יותר פעילות אזרחית עצמאית בעיר — הציון עולה.
        </p>
    </div>
{/if}
