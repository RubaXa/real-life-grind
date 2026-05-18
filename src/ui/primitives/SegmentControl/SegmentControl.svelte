<!-- @file: Svelte 5 SegmentControl primitive — pill-shaped toggle group using Melt Toggle builders. -->
<!-- @consumers: infra-ui components, web -->
<!-- @tasks: TSK-06 -->
<script lang="ts">
  import { Toggle } from 'melt/builders';
  import { classNames } from '../../lib';

  /**
   * @purpose Renders a horizontally-stacked pill-toggle group where exactly one option is selected.
   * @invariant Each segment is a Melt Toggle; only one can be active at a time.
   * @param options Array of {id, label} defining the segments.
   * @param value Bindable string matching the id of the selected option.
   */
  let {
    options = $bindable([] as Array<{ id: string; label: string }>),
    value = $bindable(''),
  }: {
    options?: Array<{ id: string; label: string }>;
    value?: string;
  } = $props();
</script>

<div class="segment-control">
  {#each options as option (option.id)}
    {@const toggle = new Toggle({
      value: () => value === option.id,
      onValueChange: (v) => {
        if (v) value = option.id;
        else if (value === option.id) value = '';
      }
    })}
    <button
      {...toggle.trigger}
      class={classNames('segment-option', value === option.id && 'segment-active')}
      type="button"
      aria-label={option.label}
    >
      {option.label}
    </button>
  {/each}
</div>

<style>
  .segment-control {
    display: inline-flex;
    flex-direction: row;
    background: var(--c-bg-elevated);
    border-radius: var(--radius-pill);
    padding: var(--space-1);
    gap: var(--space-1);
  }

  .segment-option {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-2) var(--space-4);
    font: var(--label);
    color: var(--c-text-2);
    background: transparent;
    border: none;
    border-radius: var(--radius-pill);
    cursor: pointer;
    transition: background var(--duration-fast) var(--motion-quick),
                color var(--duration-fast) var(--motion-quick),
                box-shadow var(--duration-fast) var(--motion-quick);
    white-space: nowrap;
  }
  .segment-option:hover {
    color: var(--c-text-1);
  }

  .segment-active {
    background: var(--c-bg-surface);
    color: var(--c-text-1);
  }
</style>
