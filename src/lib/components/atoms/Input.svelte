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
    }

    let {
        type,
        id,
        value = $bindable(),
        min,
        max,
        step,
        placeholder,
        onchange,
    }: Props = $props();
</script>

<input {type} {id} bind:value {min} {max} {step} {placeholder} {onchange} />

<style>
    input {
        background: #092131;
        color: #d8eefc;
        border: 1px solid #123246;
        width: 100%;
        margin: 0;
    }

    input[type="range"] {
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

    input[type="range"]:hover {
        opacity: 1;
    }

    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 1em;
        height: 1em;
        background: #274e63;
        cursor: pointer;
    }

    input[type="range"]::-moz-range-thumb {
        width: 25px;
        height: 25px;
        background: #274e63;
        cursor: pointer;
    }
</style>
