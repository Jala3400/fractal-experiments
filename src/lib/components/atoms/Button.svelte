<script lang="ts">
    interface Props {
        onclick?: () => void;
        children?: import("svelte").Snippet;
    }

    let { onclick, children }: Props = $props();
</script>

<button {onclick}>
    {@render children?.()}
</button>

<style>
    button {
        padding: 0.375em 0.5em;
        border-radius: 0.25em;
        border: 1px solid var(--border-tertiary);
        background: transparent;
        color: var(--text-tertiary);
        cursor: pointer;
    }
</style>
