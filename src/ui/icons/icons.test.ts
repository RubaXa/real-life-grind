// @file: Unit tests for SVG icon components — accessibility attributes.
// @consumers: vitest
// @tasks: TSK-06
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mount, unmount } from 'svelte';

import Star from './Star.svelte';
import Fire from './Fire.svelte';
import Check from './Check.svelte';
import Home from './Home.svelte';
import Tasks from './Tasks.svelte';
import Shop from './Shop.svelte';
import Grades from './Grades.svelte';
import Bell from './Bell.svelte';
import Hamburger from './Hamburger.svelte';

type IconContext = {
  container: HTMLDivElement;
  component: Record<string, any>;
};

function mountIcon(
  container: HTMLDivElement,
  component: any,
  props?: Record<string, any>,
): IconContext {
  const instance = mount(component, {
    target: container,
    props: { ...props },
  });
  return { container, component: instance };
}

const icons = [
  { name: 'Star', component: Star, defaultLabel: 'Звезда' },
  { name: 'Fire', component: Fire, defaultLabel: 'Огонь' },
  { name: 'Check', component: Check, defaultLabel: 'Галочка' },
  { name: 'Home', component: Home, defaultLabel: 'Домой' },
  { name: 'Tasks', component: Tasks, defaultLabel: 'Задачи' },
  { name: 'Shop', component: Shop, defaultLabel: 'Магазин' },
  { name: 'Grades', component: Grades, defaultLabel: 'Оценки' },
  { name: 'Bell', component: Bell, defaultLabel: 'Уведомления' },
  { name: 'Hamburger', component: Hamburger, defaultLabel: 'Меню' },
] as const;

describe('SVG icons a11y', () => {
  for (const { name, component, defaultLabel } of icons) {
    describe(name, () => {
      let ctx: IconContext;

      beforeEach(() => {
        const container = document.createElement('div');
        document.body.appendChild(container);
        ctx = mountIcon(container, component);
      });

      afterEach(() => {
        unmount(ctx.component);
        ctx.container.remove();
      });

      it(`should set role="img" on the SVG element`, () => {
        const svg = ctx.container.querySelector('svg');
        expect(svg).not.toBeNull();
        expect(svg!.getAttribute('role')).toBe('img');
      });

      it(`should have non-empty aria-label`, () => {
        const svg = ctx.container.querySelector('svg');
        expect(svg).not.toBeNull();
        const label = svg!.getAttribute('aria-label');
        expect(label).toBeTruthy();
        if (label) {
          expect(label.length).toBeGreaterThan(0);
        }
      });

      it(`should use ${defaultLabel} as default aria-label`, () => {
        const svg = ctx.container.querySelector('svg');
        expect(svg!.getAttribute('aria-label')).toBe(defaultLabel);
      });

      it('should accept custom ariaLabel prop', () => {
        unmount(ctx.component);
        ctx = mountIcon(ctx.container, component, { ariaLabel: 'Custom' });

        const svg = ctx.container.querySelector('svg');
        expect(svg!.getAttribute('aria-label')).toBe('Custom');
      });

      it('should render with default size 24', () => {
        const svg = ctx.container.querySelector('svg');
        expect(svg!.getAttribute('width')).toBe('24');
        expect(svg!.getAttribute('height')).toBe('24');
      });

      it('should accept custom size prop', () => {
        unmount(ctx.component);
        ctx = mountIcon(ctx.container, component, { size: 32 });

        const svg = ctx.container.querySelector('svg');
        expect(svg!.getAttribute('width')).toBe('32');
        expect(svg!.getAttribute('height')).toBe('32');
      });
    });
  }
});
