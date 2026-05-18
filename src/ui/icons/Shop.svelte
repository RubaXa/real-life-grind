<!-- @file: Shop SVG icon component (shopping bag). -->
<!-- @consumers: infra-ui primitives, components -->
<!-- @tasks: TSK-06 -->
<script lang="ts">
interface Props {
  size?: number;
  class?: string;
  ariaLabel?: string;
}
let {
  size = 24,
  class: className = '',
  ariaLabel = 'Магазин',
}: Props = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  role="img"
  aria-label={ariaLabel}
  class={className}
>
  <path d="M20 10v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10" />
  <path d="M3 10h18" />
  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
</svg>
