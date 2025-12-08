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
        background: #092131;
        color: #d8eefc;
        border: 1px solid #123246;
    }
</style>
