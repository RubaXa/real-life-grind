// @file: Unit tests for PointsBadge — gold star icon, points display, glow effect.
// @consumers: vitest
// @tasks: TSK-07

import { mount, unmount } from 'svelte';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import PointsBadge from './PointsBadge.svelte';

type PointsBadgeContext = {
  container: HTMLDivElement;
  component: Record<string, any>;
};

function mountPointsBadge(
  container: HTMLDivElement,
  props?: Record<string, any>,
): PointsBadgeContext {
  const component = mount(PointsBadge, {
    target: container,
    props: { points: 0, ...props },
  });
  return { container, component };
}

describe('PointsBadge', () => {
  let ctx: PointsBadgeContext;

  beforeEach(() => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    ctx = { container, component: {} as Record<string, any> };
  });

  afterEach(() => {
    if (ctx.component.$destroy) unmount(ctx.component);
    ctx.container.remove();
  });

  // #region START_should_render_points_START_SETUP
  it('should render points count with gold star icon and glow effect', () => {
    // contract: PointsBadge wraps Badge + Star with --c-gold / --glow-gold tokens
    ctx = mountPointsBadge(ctx.container, { points: 240 });

    // #region TRIGGER
    // #endregion TRIGGER

    // #region OBSERVE
    const root = ctx.container.querySelector('.points-badge');
    expect(root).not.toBeNull();

    const star = root!.querySelector('svg[role="img"]');
    expect(star).not.toBeNull();
    expect(star!.getAttribute('aria-label')).toBe('Звезда');
    expect(star!.getAttribute('class')).toContain('points-badge__icon');

    const badge = root!.querySelector('.badge-points');
    expect(badge).not.toBeNull();
    // #endregion OBSERVE

    // #region ASSERT
    expect(badge!.textContent).toBe('240');
    // #endregion ASSERT
  });
  // #endregion END_should_render_points

  // #region START_should_display_zero_START_SETUP
  it('should display zero without errors', () => {
    // contract: zero points renders "0" — no crash, no NaN, no empty string
    ctx = mountPointsBadge(ctx.container, { points: 0 });

    // #region OBSERVE
    const badge = ctx.container.querySelector('.badge');
    expect(badge).not.toBeNull();
    // #endregion OBSERVE

    // #region ASSERT
    expect(badge!.textContent).toBe('0');
    // #endregion ASSERT
  });
  // #endregion END_should_display_zero
});
