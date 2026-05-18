<!-- @file: Svelte 5 Modal primitive — wraps Melt Dialog builder with fade animation and CSS tokens. -->
<!-- @consumers: infra-ui components, web -->
<!-- @tasks: TSK-06 -->
<script lang="ts">
  import { Dialog } from 'melt/builders';
  import { classNames } from '../../lib';

  /**
   * @purpose Renders a modal dialog with backdrop overlay, fade animation, and bindable open state.
   * @invariant Uses native <dialog> + popover overlay for accessibility and animation support.
   * @param open Bindable boolean controlling dialog visibility.
   * @param title Heading text rendered inside the dialog.
   * @param children Snippet for modal body content.
   */
  let {
    open = $bindable(false),
    title = '',
    children
  }: {
    open?: boolean;
    title?: string;
    children?: import('svelte').Snippet;
  } = $props();

  const dialog = new Dialog({ open, onOpenChange: (v) => open = v });

  $effect(() => {
    dialog.open = open;
  });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div {...dialog.overlay} class="modal-overlay"></div>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<dialog {...dialog.content} class="modal-content">
  <div class="modal-header">
    {#if title}
      <h2 class="modal-title">{title}</h2>
    {/if}
    <button
      {...dialog.trigger}
      class="modal-close"
      aria-label="Закрыть"
    >✕</button>
  </div>
  <div class="modal-body">
    {#if children}
      {@render children()}
    {/if}
  </div>
</dialog>

<style>
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: var(--c-bg-overlay, #0F0F1A99);
    z-index: 100;
    opacity: 0;
    transition: opacity var(--duration-base) var(--motion-ease);
  }
  .modal-overlay[data-open] {
    opacity: 1;
  }

  .modal-content {
    position: fixed;
    inset: 0;
    margin: auto;
    max-width: 360px;
    width: calc(100% - var(--space-8));
    max-height: 80vh;
    background: var(--c-bg-elevated);
    border: var(--border-default);
    border-radius: var(--radius-lg);
    padding: 0;
    overflow: hidden;
    z-index: 101;
    opacity: 0;
    transform: scale(0.92);
    transition: opacity var(--duration-fast) var(--motion-quick),
                transform var(--duration-fast) var(--motion-quick);
    color: var(--c-text-1);
  }
  .modal-content[open],
  .modal-content[data-open] {
    opacity: 1;
    transform: scale(1);
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-4) var(--space-4) 0;
  }
  .modal-title {
    font: var(--heading);
    color: var(--c-text-1);
    margin: 0;
  }
  .modal-close {
    background: none;
    border: none;
    color: var(--c-text-2);
    font: var(--body);
    cursor: pointer;
    padding: var(--space-1);
    border-radius: var(--radius-sm);
    transition: color var(--duration-fast) var(--motion-quick);
  }
  .modal-close:hover {
    color: var(--c-text-1);
  }

  .modal-body {
    padding: var(--space-4);
  }
</style>
