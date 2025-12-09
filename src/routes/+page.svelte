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

    // New state for zoom and pan
    let zoom = $state(1);
    let offsetX = $state(0);
    let offsetY = $state(0);
    let dragging = $state(false);
    let lastMouseX = $state(0);
    let lastMouseY = $state(0);

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

        // Apply zoom and pan to points
        const transformedPts = pts.map((p) => ({
            x: (p.x - width / 2) * zoom + width / 2 + offsetX,
            y: (p.y - height / 2) * zoom + height / 2 + offsetY,
        }));

        ctx.beginPath();
        ctx.moveTo(transformedPts[0].x, transformedPts[0].y);
        for (let i = 1; i < transformedPts.length; i++)
            ctx.lineTo(transformedPts[i].x, transformedPts[i].y);
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

    // Zoom handler with mouse position consideration
    function handleWheel(event: WheelEvent) {
        event.preventDefault();
        const rect = canvas!.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        // World coordinates before zoom (relative to center)
        const centerX = width / 2;
        const centerY = height / 2;
        const worldX = (mouseX - centerX - offsetX) / zoom + centerX;
        const worldY = (mouseY - centerY - offsetY) / zoom + centerY;

        // Zoom factor
        const factor = event.deltaY > 0 ? 0.9 : 1.1;
        zoom *= factor;

        // Adjust offset to keep mouse position fixed
        offsetX = mouseX - (worldX - centerX) * zoom - centerX;
        offsetY = mouseY - (worldY - centerY) * zoom - centerY;

        draw();
    }

    // Pan handlers
    function handleMouseDown(event: MouseEvent) {
        dragging = true;
        const rect = canvas!.getBoundingClientRect();
        lastMouseX = event.clientX - rect.left;
        lastMouseY = event.clientY - rect.top;
    }

    function handleMouseMove(event: MouseEvent) {
        if (!dragging) return;
        const rect = canvas!.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        offsetX += mouseX - lastMouseX;
        offsetY += mouseY - lastMouseY;

        lastMouseX = mouseX;
        lastMouseY = mouseY;

        draw();
    }

    function handleMouseUp() {
        dragging = false;
    }
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
        <canvas
            bind:this={canvas}
            class="canvas-class"
            onwheel={handleWheel}
            onmousedown={handleMouseDown}
            onmousemove={handleMouseMove}
            onmouseup={handleMouseUp}
            onmouseleave={handleMouseUp}
        ></canvas>
    </div>
</div>

<style>
    .page {
        display: flex;
        background: var(--bg-primary);
        color: var(--text-primary);
        height: 100%;
        overflow: hidden;
    }
    .sidebar {
        padding: 0.5em;
        border-right: 1px solid var(--border-primary);
        background: var(--bg-secondary);
        width: 15em;
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
        width: 100%;
        height: 100%;
        cursor: grab;
    }

    .canvas-class:active {
        cursor: grabbing;
    }
</style>
