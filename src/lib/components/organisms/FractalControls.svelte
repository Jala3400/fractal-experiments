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
        strokeWidth?: number;
        color?: string;
        rotation?: number;
        updateRules?: () => void;
    }

    let {
        type = $bindable<FractalType>("koch"),
        currentDef = $bindable<FractalDef>({ ...fractals["koch"] }),
        rulesText = $bindable(""),
        iterations = $bindable(3),
        strokeWidth = $bindable(1.5),
        color = $bindable("#ff6b6b"),
        rotation = $bindable(0),
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
        label="Stroke width"
        id="stroke-width-input"
        bind:value={strokeWidth}
        min={0.5}
        max={12}
        step={0.5}
    />

    <NumericControl
        label="Rotation (degrees)"
        id="rotation-input"
        bind:value={rotation}
        min={0}
        max={360}
        step={5}
        circular={true}
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
        min={0}
        max={360}
        step={5}
        circular={true}
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
        gap: 0.5em;
        padding: 0.5em;
        color: var(--text-tertiary);
        box-sizing: border-box;
    }

    .controls hr {
        border: none;
        border-top: 1px solid var(--border-secondary);
        margin: 0.5em 0;
    }
</style>
