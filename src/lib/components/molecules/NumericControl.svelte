<script lang="ts">
    import Label from "../atoms/Label.svelte";
    import Input from "../atoms/Input.svelte";

    interface Props {
        label: string;
        id?: string;
        value?: number;
        min?: number;
        max?: number;
        step?: number;
        circular?: boolean;
    }

    let { label, id, value = $bindable(), min, max, step, circular = false }: Props = $props();
</script>

<div class="numeric-control">
    <div class="input-row">
        <Label for={id}>{label}</Label>
        <Input type="number" {id} bind:value {min} {max} {step} {circular} />
    </div>
    <Input type="range" id="{id}-slider" bind:value {min} {max} {step} {circular} />
</div>

<style>
    .numeric-control {
        display: flex;
        flex-direction: column;
        gap: 0.25em;
    }

    .input-row {
        display: flex;
        align-items: baseline;
        gap: 0.5em;
    }
</style>
