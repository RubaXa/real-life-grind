// @file: Unit tests for Badge primitive — variant rendering.
// @consumers: vitest
// @tasks: TSK-06

import { mount, unmount } from 'svelte';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import Badge from './Badge.svelte';

type BadgeContext = {
  container: HTMLDivElement;
  component: Record<string, any>;
};

function mountBadge(
  container: HTMLDivElement,
  props?: Record<string, any>,
): BadgeContext {
  const component = mount(Badge, {
    target: container,
    props: { label: '42', ...props },
  });
  return { container, component };
}

describe('Badge', () => {
  let ctx: BadgeContext;

  beforeEach(() => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    ctx = mountBadge(container);
  });

  afterEach(() => {
    unmount(ctx.component);
    ctx.container.remove();
  });

  const variants = [
    { variant: 'points', expectedClass: 'badge-points' },
    { variant: 'penalty', expectedClass: 'badge-penalty' },
    { variant: 'count', expectedClass: 'badge-count' },
  ] as const;

  for (const { variant, expectedClass } of variants) {
    it(`should render ${variant} variant with CSS token class ${expectedClass}`, () => {
      unmount(ctx.component);
      ctx = mountBadge(ctx.container, { variant, label: variant });

      const badge = ctx.container.querySelector('span');
      expect(badge).not.toBeNull();
      expect(badge!.className).toContain(expectedClass);
    });
  }

  it('should display label text', () => {
    const badge = ctx.container.querySelector('span');
    expect(badge!.textContent).toBe('42');
  });
});
