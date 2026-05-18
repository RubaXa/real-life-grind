// @file: Unit tests for Button primitive — variant rendering, disabled state, click handler.
// @consumers: vitest
// @tasks: TSK-06

import { mount, unmount } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Button from './Button.svelte';

type ButtonContext = {
  container: HTMLDivElement;
  component: Record<string, any>;
};

function mountButton(
  container: HTMLDivElement,
  props?: Record<string, any>,
): ButtonContext {
  const component = mount(Button, {
    target: container,
    props: { label: 'Test', ...props },
  });
  return { container, component };
}

describe('Button', () => {
  let ctx: ButtonContext;

  beforeEach(() => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    ctx = mountButton(container);
  });

  afterEach(() => {
    unmount(ctx.component);
    ctx.container.remove();
  });

  describe('Button variants', () => {
    const variants = [
      { variant: 'primary', expectedClass: 'btn-primary' },
      { variant: 'approve', expectedClass: 'btn-approve' },
      { variant: 'reject', expectedClass: 'btn-reject' },
      { variant: 'buy', expectedClass: 'btn-buy' },
      { variant: 'ghost', expectedClass: 'btn-ghost' },
    ] as const;

    for (const { variant, expectedClass } of variants) {
      it(`should render ${variant} variant with CSS token class ${expectedClass}`, () => {
        unmount(ctx.component);
        ctx = mountButton(ctx.container, { variant, label: variant });

        const button = ctx.container.querySelector('button');
        expect(button).not.toBeNull();
        expect(button!.className).toContain(expectedClass);
      });
    }
  });

  it('should display label text', () => {
    const button = ctx.container.querySelector('button');
    expect(button!.textContent).toBe('Test');
  });

  it('should fire onclick handler when clicked', () => {
    const handleClick = vi.fn();
    unmount(ctx.component);
    ctx = mountButton(ctx.container, { onclick: handleClick });

    const button = ctx.container.querySelector('button')!;
    button.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not fire onclick handler when disabled', () => {
    const handleClick = vi.fn();
    unmount(ctx.component);
    ctx = mountButton(ctx.container, { disabled: true, onclick: handleClick });

    const button = ctx.container.querySelector('button')!;
    button.click();
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should apply disabled attribute when disabled', () => {
    unmount(ctx.component);
    ctx = mountButton(ctx.container, { disabled: true });

    const button = ctx.container.querySelector('button')!;
    expect(button.disabled).toBe(true);
  });
});
