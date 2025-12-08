<script lang="ts">
    import { onMount } from "svelte";
    import {
        generateFractalPoints,
        type FractalType,
        fractals,
        parseRulesText,
        type FractalDef,
    } from "$lib/fractals";

    const types = Object.entries(fractals).map(([id, fractal]) => ({
        id,
        label: fractal.label || id,
    }));

    let type = $state<FractalType>("koch");
    let currentDef = $state<FractalDef>({ ...fractals["koch"] });
    let rulesText = $state("");

    // Update currentDef when type changes
    $effect(() => {
        currentDef = { ...fractals[type] };
    });

    // Update rulesText when currentDef.rules changes
    $effect(() => {
        rulesText = Object.entries(currentDef.rules)
            .map(([k, v]) => `${k}=${v}`)
            .join("\n");
    });

    // Do not use $effect here to avoid infinite loop
    function updateRules() {
        currentDef.rules = parseRulesText(rulesText);
    }

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
        width = rect.width;
        height = rect.height;

        // handle high DPI displays
        const dpr =
            typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
        canvas.width = Math.max(1, Math.floor(width * dpr));
        canvas.height = Math.max(1, Math.floor(height * dpr));
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        ctx.lineWidth = strokeWidth;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = color;

        const pts = generateFractalPoints(
            currentDef,
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

            <hr />

            <label for="axiom-input">Axiom</label>
            <input id="axiom-input" type="text" bind:value={currentDef.axiom} />

            <label for="rules-input">Rules</label>
            <textarea
                id="rules-input"
                bind:value={rulesText}
                onchange={updateRules}
            ></textarea>

            <label for="angle-input">Angle (degrees):</label>
            <input
                id="angle-number-input"
                type="number"
                max="360"
                bind:value={currentDef.angle}
            />
            <input
                id="angle-input"
                type="range"
                max="360"
                step="15"
                bind:value={currentDef.angle}
            />

            <label for="draw-letters-input">Draw Letters</label>
            <input
                id="draw-letters-input"
                type="text"
                bind:value={currentDef.drawLetters}
            />
        </div>
    </aside>

    <div class="canvas-wrap">
        <canvas bind:this={canvas} class="canvas-class"></canvas>
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

    .canvas-class {
        width: 80%;
        height: 80%;
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
    .controls input[type="color"],
    .controls input[type="text"],
    .controls input[type="number"],
    .controls textarea {
        width: 100%;
        background: #092131;
        color: #d8eefc;
        border: 1px solid #123246;
    }
    .controls textarea {
        resize: vertical;
        min-height: 60px;
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
