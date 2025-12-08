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
        padding: 6px 8px;
        border-radius: 4px;
        border: 1px solid #274e63;
        background: transparent;
        color: #d8eefc;
        cursor: pointer;
    }
</style>
