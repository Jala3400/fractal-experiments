<script lang="ts">
    import { onMount } from "svelte";
    import { generateFractalPoints, type FractalType } from "$lib/fractals";

    const types: Array<{ id: FractalType; label: string }> = [
        { id: "koch", label: "Koch Curve / Snowflake" },
        { id: "dragon", label: "Dragon Curve" },
        { id: "sierpinski", label: "Sierpinski (L-system)" },
    ];

    let type = $state<FractalType>("koch");
    let iterations = $state(3);
    let step = $state(12);
    let strokeWidth = $state(1.5);
    let color = $state("#ff6b6b");
    let width = $state(800);
    let height = $state(600);
    let canvas = $state<HTMLCanvasElement | null>(null);

    function draw() {
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // handle high DPI displays
        const dpr =
            typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        canvas.width = Math.max(1, Math.floor(width * dpr));
        canvas.height = Math.max(1, Math.floor(height * dpr));
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);

        ctx.lineWidth = strokeWidth;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = color;

        const pts = generateFractalPoints(
            type,
            iterations,
            step,
            width,
            height
        );
        // we no longer keep debug state here
        if (pts.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.stroke();
    }

    $effect(() => {
        if (canvas) draw();
    });

    onMount(() => {
        const resize = () => {
            const w = Math.max(300, Math.floor(window.innerWidth * 0.6));
            const h = Math.max(240, Math.floor(window.innerHeight * 0.7));
            width = w;
            height = h;
        };
        resize();
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    });
</script>

<div class="page">
    <aside class="sidebar">
        <h3>Fractal options</h3>
        <div class="controls">
            <label for="type-select">Type</label>
            <select id="type-select" bind:value={type}>
                {#each types as t}
                    <option value={t.id}>{t.label}</option>
                {/each}
            </select>

            <label for="iterations-input">Iterations: {iterations}</label>
            <input
                id="iterations-input"
                type="range"
                min="0"
                max="12"
                bind:value={iterations}
            />

            <label for="step-input">Segment length: {step}</label>
            <input
                id="step-input"
                type="range"
                min="1"
                max="128"
                bind:value={step}
            />

            <label for="stroke-width-input">Stroke width: {strokeWidth}</label>
            <input
                id="stroke-width-input"
                type="range"
                min="0.5"
                max="12"
                step="0.5"
                bind:value={strokeWidth}
            />

            <label for="color-input">Color</label>
            <input id="color-input" type="color" bind:value={color} />

                <!-- theme controls removed -->

            <hr />
            <button
                onclick={() => {
                    iterations = Math.max(0, iterations - 1);
                }}>Less iterations</button
            >
            <button
                onclick={() => {
                    iterations = iterations + 1;
                }}>More iterations</button
            >
        </div>
    </aside>

    <div class="canvas-wrap">
        <canvas bind:this={canvas} {width} {height}></canvas>
    </div>
</div>

<style>
    .page {
        display: flex;
        gap: 12px;
        padding: 12px;
    }
    .sidebar {
        width: 260px;
        padding: 8px;
        border-right: 1px solid #e5e7eb;
    }
    .canvas-wrap {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .controls label {
        display: block;
        margin: 8px 0 4px;
        font-size: 0.9rem;
    }
    .controls input[type="range"] {
        width: 100%;
    }
    .controls select,
    .controls input[type="color"] {
        width: 100%;
    }
    .controls button {
        padding: 6px 8px;
        border-radius: 4px;
        border: 1px solid #cbd5e1;
        background: transparent;
        cursor: pointer;
    }
    /* dark mode removed */
</style>
