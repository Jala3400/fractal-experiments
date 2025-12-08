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
        margin: 8px 0 4px;
        font-size: 0.9rem;
        color: #cfe6ff;

        white-space: nowrap;
    }
</style>
