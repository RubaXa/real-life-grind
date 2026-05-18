<!-- @file: Home SVG icon component (house). -->
<!-- @consumers: infra-ui primitives, components -->
<!-- @tasks: TSK-06 -->
<script lang="ts">
  interface Props {
    size?: number;
    class?: string;
    ariaLabel?: string;
  }
  let { size = 24, class: className = '', ariaLabel = 'Домой' }: Props = $props();
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
  <path d="M3 12l9-9 9 9" />
  <path d="M5 10v10a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V10" />
</svg>
