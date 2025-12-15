<script lang="ts">
    interface Props {
        id?: string;
        value?: any;
        placeholder?: string;
        onchange?: (event: Event) => void;
    }

    let { id, value = $bindable(), placeholder, onchange }: Props = $props();
</script>

<textarea
    {id}
    bind:value
    {placeholder}
    {onchange}
    onkeydown={(e) => {
        if (e.key === "Enter" && e.shiftKey === false) {
            e.preventDefault();
            onchange?.(e);
        }
    }}
></textarea>

<style>
    textarea {
        width: 100%;
        background: var(--bg-input);
        color: var(--text-tertiary);
        border: 1px solid var(--border-secondary);
        resize: vertical;
        height: 6em;
    }
</style>
