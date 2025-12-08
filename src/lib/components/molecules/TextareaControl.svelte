<script lang="ts">
    import Label from "../atoms/Label.svelte";
    import Textarea from "../atoms/Textarea.svelte";

    interface Props {
        label: string;
        id?: string;
        value?: any;
        placeholder?: string;
        onchange?: (event: Event) => void;
    }

    let {
        label,
        id,
        value = $bindable(),
        placeholder,
        onchange,
    }: Props = $props();
</script>

<Label for={id}>{label}</Label>
<Textarea {id} bind:value {placeholder} {onchange} />
