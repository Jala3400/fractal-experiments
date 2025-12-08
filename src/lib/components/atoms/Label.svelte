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
        margin: 0.25em 0;
        font-size: 0.9em;
        color: var(--text-secondary);

        white-space: nowrap;
    }
</style>
