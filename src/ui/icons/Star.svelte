<!-- @file: Star SVG icon component (5-pointed filled star). -->
<!-- @consumers: infra-ui primitives, components -->
<!-- @tasks: TSK-06 -->
<script lang="ts">
  interface Props {
    size?: number;
    class?: string;
    ariaLabel?: string;
  }
  let { size = 24, class: className = '', ariaLabel = 'Звезда' }: Props = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="currentColor"
  stroke="none"
  role="img"
  aria-label={ariaLabel}
  class={className}
>
  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
</svg>
