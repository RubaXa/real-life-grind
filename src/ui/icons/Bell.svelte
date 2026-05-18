<!-- @file: Bell SVG icon component (notification bell). -->
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
  ariaLabel = 'Уведомления',
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
  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
</svg>
