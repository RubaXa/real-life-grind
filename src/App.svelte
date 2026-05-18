<script lang="ts">
// @file: Root Svelte 5 component — infra-base shell placeholder
// @consumers: src/main.ts
// @tasks: TSK-02
// biome-ignore lint/correctness/noUnusedVariables: children is used in Svelte template ({@render})
let { children } = $props<{ children?: import('svelte').Snippet }>();
</script>

<main>
  <h1>Real-Life Grind</h1>
  <p>Загрузка...</p>
  {@render children?.()}
</main>

<style>
  main {
    min-height: 100vh;
    background: var(--c-bg-base, #0F0F1A);
    color: var(--c-text-1, #F0F0FA);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: Inter, system-ui, sans-serif;
  }
  h1 {
    font-size: 28px;
    font-weight: 700;
    color: var(--c-gold, #F5C842);
  }
</style>
