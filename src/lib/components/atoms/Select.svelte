<script lang="ts">
    interface Props {
        id?: string;
        value?: any;
        options: { value: any; label: string }[];
    }

    let { id, value = $bindable(), options }: Props = $props();
</script>

<select {id} bind:value>
    {#each options as option}
        <option value={option.value}>{option.label}</option>
    {/each}
</select>

<style>
    select {
        width: 100%;
        background: var(--bg-input);
        color: var(--text-tertiary);
        border: 1px solid var(--border-secondary);
    }
</style>
