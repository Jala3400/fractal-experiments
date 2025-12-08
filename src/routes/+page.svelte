<script lang="ts">
    import { onMount } from "svelte";
    import {
        generateFractalPoints,
        type FractalType,
        fractals,
        parseRulesText,
        type FractalDef,
    } from "$lib/fractals";
    import FractalControls from "$lib/components/organisms/FractalControls.svelte";

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
        <FractalControls
            bind:type
            bind:currentDef
            bind:rulesText
            bind:iterations
            bind:step
            bind:strokeWidth
            bind:color
            {updateRules}
        />
    </aside>

    <div class="canvas-wrap">
        <canvas bind:this={canvas} class="canvas-class"></canvas>
    </div>
</div>

<style>
    .page {
        display: flex;
        background: var(--bg-primary);
        color: var(--text-primary);
        height: 100%;
    }
    .sidebar {
        padding: 8px;
        border-right: 1px solid var(--border-primary);
        background: var(--bg-secondary);
    }
    h3 {
        color: var(--text-secondary);
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
</style>
