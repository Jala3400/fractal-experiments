<script lang="ts">
    interface Props {
        id?: string;
        value?: any;
        placeholder?: string;
        onchange?: (event: Event) => void;
    }

    let { id, value = $bindable(), placeholder, onchange }: Props = $props();
</script>

<textarea {id} bind:value {placeholder} {onchange}></textarea>

<style>
    textarea {
        width: 100%;
        background: #092131;
        color: #d8eefc;
        border: 1px solid #123246;
        resize: vertical;
        min-height: 60px;
    }
</style>
