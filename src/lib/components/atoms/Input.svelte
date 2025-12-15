<script lang="ts">
    interface Props {
        type: string;
        id?: string;
        value?: any;
        min?: number;
        max?: number;
        step?: number;
        placeholder?: string;
        onchange?: (event: Event) => void;
        circular?: boolean;
    }

    let {
        type,
        id,
        value = $bindable(),
        min,
        max,
        step = 1,
        placeholder,
        onchange,
        circular = false,
    }: Props = $props();

    function handleWheel(event: WheelEvent) {
        if (type !== "number") return;
        
        event.preventDefault();
        
        const direction = event.deltaY > 0 ? -1 : 1;
        const currentValue = typeof value === "number" ? value : parseFloat(value) || 0;
        let newValue = currentValue + direction * step;
        
        if (circular && min !== undefined && max !== undefined) {
            // Wrap around circularly
            const range = max - min;
            newValue = ((newValue - min) % range + range) % range + min;
        } else {
            // Clamp to min/max bounds
            if (min !== undefined) newValue = Math.max(newValue, min);
            if (max !== undefined) newValue = Math.min(newValue, max);
        }
        
        value = newValue;
    }
</script>

<input {type} {id} bind:value {min} {max} {step} {placeholder} {onchange} onwheel={handleWheel} />

<style>
    input {
        background: var(--bg-input);
        color: var(--text-tertiary);
        border: 1px solid var(--border-secondary);
        width: 100%;
        margin: 0;
    }

    input[type="range"] {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: 0.5em;
        background: var(--bg-input);
        outline: none;
        opacity: 0.7;
        -webkit-transition: opacity 0.2s;
        transition: opacity 0.2s;
        border: 1px solid var(--border-secondary);
    }

    input[type="range"]:hover {
        opacity: 1;
    }

    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 1em;
        height: 1em;
        background: var(--border-tertiary);
        cursor: pointer;
    }

    input[type="range"]::-moz-range-thumb {
        width: 1.5em;
        height: 1.5em;
        background: var(--border-tertiary);
        cursor: pointer;
    }
</style>
