<script lang="ts">
    import Label from "../atoms/Label.svelte";
    import Select from "../atoms/Select.svelte";

    interface Props {
        label: string;
        id?: string;
        value?: any;
        options: { value: any; label: string }[];
    }

    let { label, id, value = $bindable(), options }: Props = $props();
</script>

<div class="select-control">
    <Label for={id}>{label}</Label>
    <Select {id} bind:value {options} />
</div>
