<script lang="ts">
    import Label from "../atoms/Label.svelte";
    import Input from "../atoms/Input.svelte";

    interface Props {
        label: string;
        id?: string;
        value?: any;
        placeholder?: string;
    }

    let { label, id, value = $bindable(), placeholder }: Props = $props();
</script>

<div class="text-control">
    <Label for={id}>{label}</Label>
    <Input type="text" {id} bind:value {placeholder} />
</div>
