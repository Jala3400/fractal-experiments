<script lang="ts">
    interface Props {
        for?: string;
        children?: import("svelte").Snippet;
    }

    let { for: htmlFor, children }: Props = $props();
</script>

<label for={htmlFor}>
    {@render children?.()}
</label>

<style>
    label {
        display: block;
        margin: 4px 0;
        font-size: 0.9rem;
        color: var(--text-secondary);

        white-space: nowrap;
    }
</style>
