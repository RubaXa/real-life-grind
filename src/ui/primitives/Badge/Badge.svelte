<!-- @file: Svelte 5 Badge primitive — 3 semantic variants: points (gold), penalty (red), count (muted). -->
<!-- @consumers: infra-ui components, web -->
<!-- @tasks: TSK-06 -->
<script lang="ts">
import { classNames } from '../../lib';

type BadgeVariant = 'points' | 'penalty' | 'count';

/**
 * @purpose Renders a compact label badge with variant-driven styling.
 * @param variant Visual variant driving color and background token.
 * @param label Text displayed inside the badge.
 */
let {
  variant = 'points',
  label = '',
}: {
  variant?: BadgeVariant;
  label?: string;
} = $props();
</script>

<span class={classNames('badge', `badge-${variant}`)}>
  {label}
</span>

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-1) var(--space-3);
    font: var(--label);
    border-radius: var(--radius-pill);
  }

  .badge-points {
    background: transparent;
    color: var(--c-gold);
  }
  .badge-penalty {
    background: transparent;
    color: var(--c-red);
  }
  .badge-count {
    background: var(--c-muted);
    color: var(--c-text-1);
  }
</style>
