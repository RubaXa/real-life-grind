<!-- @file: Check SVG icon component (checkmark). -->
<!-- @consumers: infra-ui primitives, components -->
<!-- @tasks: TSK-06 -->
<script lang="ts">
  interface Props {
    size?: number;
    class?: string;
    ariaLabel?: string;
  }
  let { size = 24, class: className = '', ariaLabel = 'Галочка' }: Props = $props();
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
  <polyline points="20 6 9 17 4 12" />
</svg>
