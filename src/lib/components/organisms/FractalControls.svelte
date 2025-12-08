<script lang="ts">
    import SelectControl from "../molecules/SelectControl.svelte";
    import NumericControl from "../molecules/NumericControl.svelte";
    import TextControl from "../molecules/TextControl.svelte";
    import TextareaControl from "../molecules/TextareaControl.svelte";
    import ColorControl from "../molecules/ColorControl.svelte";
    import Button from "../atoms/Button.svelte";

    import {
        type FractalType,
        fractals,
        parseRulesText,
        type FractalDef,
    } from "$lib/fractals";

    interface Props {
        type?: FractalType;
        currentDef?: FractalDef;
        rulesText?: string;
        iterations?: number;
        step?: number;
        strokeWidth?: number;
        color?: string;
        updateRules?: () => void;
    }

    let {
        type = $bindable<FractalType>("koch"),
        currentDef = $bindable<FractalDef>({ ...fractals["koch"] }),
        rulesText = $bindable(""),
        iterations = $bindable(3),
        step = $bindable(12),
        strokeWidth = $bindable(1.5),
        color = $bindable("#ff6b6b"),
        updateRules = () => {
            currentDef.rules = parseRulesText(rulesText);
        },
    }: Props = $props();

    const types = Object.entries(fractals).map(([id, fractal]) => ({
        value: id,
        label: fractal.label || id,
    }));
</script>

<div class="controls">
    <SelectControl
        label="Type"
        id="type-select"
        bind:value={type}
        options={types}
    />

    <NumericControl
        label="Iterations"
        id="iterations-input"
        bind:value={iterations}
        min={0}
        max={12}
    />

    <NumericControl
        label="Segment length"
        id="step-input"
        bind:value={step}
        min={1}
        max={128}
    />

    <NumericControl
        label="Stroke width"
        id="stroke-width-input"
        bind:value={strokeWidth}
        min={0.5}
        max={12}
        step={0.5}
    />

    <ColorControl label="Color" id="color-input" bind:value={color} />

    <hr />

    <TextControl label="Axiom" id="axiom-input" bind:value={currentDef.axiom} />

    <TextareaControl
        label="Rules"
        id="rules-input"
        bind:value={rulesText}
        onchange={updateRules}
    />

    <NumericControl
        label="Angle (degrees)"
        id="angle-input"
        bind:value={currentDef.angle}
        max={360}
        step={15}
    />

    <TextControl
        label="Draw Letters"
        id="draw-letters-input"
        bind:value={currentDef.drawLetters}
    />
</div>

<style>
    .controls {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 8px;
        color: var(--text-tertiary);
        box-sizing: border-box;
        width: 250px;
    }

    .controls hr {
        border: none;
        border-top: 1px solid var(--border-secondary);
        margin: 8px 0;
    }
</style>
