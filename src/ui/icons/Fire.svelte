<!-- @file: Fire SVG icon component (flame). -->
<!-- @consumers: infra-ui primitives, components -->
<!-- @tasks: TSK-06 -->
<script lang="ts">
  interface Props {
    size?: number;
    class?: string;
    ariaLabel?: string;
  }
  let { size = 24, class: className = '', ariaLabel = 'Огонь' }: Props = $props();
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
  <path d="M12 2c-2.5 3.5-5 6-5 10a5 5 0 0 0 10 0c0-4-2.5-6.5-5-10z" />
  <path d="M12 19a3 3 0 0 0 3-3c0-2.5-1.5-4-3-7-1.5 3-3 4.5-3 7a3 3 0 0 0 3 3z" />
</svg>
