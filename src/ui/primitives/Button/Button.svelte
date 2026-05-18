<!-- @file: Svelte 5 Button primitive — 5 semantic variants styled via CSS tokens. -->
<!-- @consumers: infra-ui components, web -->
<!-- @tasks: TSK-06 -->
<script lang="ts">
  import { classNames } from '../../lib';

  type ButtonVariant = 'primary' | 'approve' | 'reject' | 'buy' | 'ghost';

  /**
   * @purpose Renders a styled button using one of five semantic variants.
   * @param variant Visual variant mapped to component CSS tokens.
   * @param label Text displayed inside the button.
   * @param disabled Prevents interaction when true.
   * @param onclick Callback fired on click.
   */
  let {
    variant = 'primary',
    label = '',
    disabled = false,
    onclick,
  }: {
    variant?: ButtonVariant;
    label?: string;
    disabled?: boolean;
    onclick?: () => void;
  } = $props();
</script>

<button
  type="button"
  class={classNames('btn', `btn-${variant}`)}
  {disabled}
  onclick={onclick}
>
  {label}
</button>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-5);
    font: var(--label);
    border: 1px solid transparent;
    border-radius: var(--radius-pill);
    cursor: pointer;
    transition: opacity var(--duration-fast) var(--motion-quick),
                transform var(--duration-fast) var(--motion-quick);
    outline-offset: 2px;
  }
  .btn:active {
    transform: scale(0.97);
  }
  .btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }

  .btn-primary {
    background: var(--c-teal);
    color: var(--c-bg-base);
  }
  .btn-approve {
    background: var(--c-green);
    color: var(--c-bg-base);
  }
  .btn-reject {
    background: transparent;
    color: var(--c-red);
    border-color: var(--c-red);
  }
  .btn-buy {
    background: var(--c-teal);
    color: var(--c-bg-base);
    box-shadow: var(--glow-teal);
  }
  .btn-ghost {
    background: transparent;
    color: var(--c-text-2);
  }
</style>
