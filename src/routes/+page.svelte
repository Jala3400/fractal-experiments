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

        // Get container size
        const rect = canvas.getBoundingClientRect();
        width = rect.width - 20;
        height = rect.height - 20;

        // handle high DPI displays
        const dpr =
            typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
        canvas.width = Math.max(1, Math.floor(width * dpr));
        canvas.height = Math.max(1, Math.floor(height * dpr));
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // background
        ctx.fillStyle = "#0b1220";
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
        // Resize observer to redraw on container size change
        const resizeObserver = new ResizeObserver(() => {
            if (canvas) draw();
        });
        if (canvas) resizeObserver.observe(canvas);
        return () => resizeObserver.disconnect();
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
        <canvas bind:this={canvas} style="width:100%; height:100%;"></canvas>
    </div>
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100vh;
    }

    .page {
        display: flex;
        gap: 12px;
        background: #07101a;
        color: #e6eef6;
        height: 100%;
    }
    .sidebar {
        width: 260px;
        padding: 8px;
        border-right: 1px solid #133045;
        background: #081421;
    }
    h3 {
        color: #cfe6ff;
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
        color: #cfe6ff;
    }
    .controls input[type="range"] {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: 5px;
        background: #092131;
        outline: none;
        opacity: 0.7;
        -webkit-transition: opacity 0.2s;
        transition: opacity 0.2s;
        border: 1px solid #123246;
    }
    .controls input[type="range"]:hover {
        opacity: 1;
    }
    .controls input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 1em;
        height: 1em;
        background: #274e63;
        cursor: pointer;
    }
    .controls input[type="range"]::-moz-range-thumb {
        width: 25px;
        height: 25px;
        background: #274e63;
        cursor: pointer;
    }
    .controls select,
    .controls input[type="color"] {
        width: 100%;
        background: #092131;
        color: #d8eefc;
        border: 1px solid #123246;
    }
    .controls button {
        padding: 6px 8px;
        border-radius: 4px;
        border: 1px solid #274e63;
        background: transparent;
        color: #d8eefc;
        cursor: pointer;
    }
    /* dark mode removed */
</style>
