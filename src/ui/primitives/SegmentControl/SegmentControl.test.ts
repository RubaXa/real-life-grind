// @file: Unit tests for SegmentControl primitive — toggle behaviour.
// @consumers: vitest
// @tasks: TSK-06
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mount, unmount } from 'svelte';
import SegmentControl from './SegmentControl.svelte';

type SegmentControlContext = {
  container: HTMLDivElement;
  component: Record<string, any>;
};

function mountSegmentControl(
  container: HTMLDivElement,
  props?: Record<string, any>,
): SegmentControlContext {
  const component = mount(SegmentControl, {
    target: container,
    props: {
      options: [
        { id: 'morning', label: 'Morning' },
        { id: 'evening', label: 'Evening' },
      ],
      value: '',
      ...props,
    },
  });
  return { container, component };
}

describe('SegmentControl', () => {
  let ctx: SegmentControlContext;

  beforeEach(() => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    ctx = mountSegmentControl(container);
  });

  afterEach(() => {
    unmount(ctx.component);
    ctx.container.remove();
  });

  describe('SegmentControl toggle', () => {
    it('should render options as buttons', () => {
      const buttons = ctx.container.querySelectorAll('button');
      expect(buttons).toHaveLength(2);
      expect(buttons[0].textContent).toBe('Morning');
      expect(buttons[1].textContent).toBe('Evening');
    });

    it('should have no active option when value is empty', () => {
      const active = ctx.container.querySelector('.segment-active');
      expect(active).toBeNull();
    });

    it('should mark the matching value as active', () => {
      unmount(ctx.component);
      ctx = mountSegmentControl(ctx.container, { value: 'morning' });

      const active = ctx.container.querySelector('.segment-active');
      expect(active).not.toBeNull();
      expect(active!.textContent).toBe('Morning');
    });

    it('should switch active option when value changes', () => {
      unmount(ctx.component);
      ctx = mountSegmentControl(ctx.container, { value: 'evening' });

      const active = ctx.container.querySelector('.segment-active');
      expect(active).not.toBeNull();
      expect(active!.textContent).toBe('Evening');
    });
  });
});
