<script lang="ts">
    import Label from "../atoms/Label.svelte";
    import Input from "../atoms/Input.svelte";

    interface Props {
        label: string;
        id?: string;
        value?: any;
    }

    let { label, id, value = $bindable() }: Props = $props();
</script>

<Label for={id}>{label}</Label>
<Input type="color" {id} bind:value />
