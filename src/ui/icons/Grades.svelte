<!-- @file: Grades SVG icon component (bar chart). -->
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
  ariaLabel = 'Оценки',
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
  <line x1="3" y1="20" x2="21" y2="20" />
  <line x1="7" y1="20" x2="7" y2="12" />
  <line x1="12" y1="20" x2="12" y2="6" />
  <line x1="17" y1="20" x2="17" y2="10" />
</svg>
