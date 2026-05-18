<!-- @file: PointsBadge demo component — verifies infra-ui chain: tokens → primitives → Storybook. -->
<!-- @consumers: Storybook, web -->
<!-- @tasks: TSK-07 -->
<script lang="ts">
import Star from '../../icons/Star.svelte';
import Badge from '../../primitives/Badge/Badge.svelte';

/**
 * @purpose Points badge with gold star icon, points count, and glow effect.
 * @param points Point count displayed in the badge.
 */
let {
  points = 0,
}: {
  points?: number;
} = $props();

let displayLabel = $derived(String(points));
</script>

<span class="points-badge">
  <Star size={16} class="points-badge__icon" />
  <Badge variant="points" label={displayLabel} />
</span>

<style>
  .points-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    box-shadow: var(--glow-gold);
    border-radius: var(--radius-pill);
    padding: 0 var(--space-2) 0 0;
  }

  .points-badge :global(.points-badge__icon) {
    color: var(--c-gold);
  }
</style>
