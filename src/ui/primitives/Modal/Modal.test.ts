// @file: Unit tests for Modal primitive — open/close behaviour, accessibility.
// @consumers: vitest
// @tasks: TSK-06
import { describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest';
import { mount, unmount } from 'svelte';
import Modal from './Modal.svelte';

beforeAll(() => {
  HTMLDialogElement.prototype.showModal ??= function () { this.setAttribute('open', ''); };
  HTMLDialogElement.prototype.close ??= function () { this.removeAttribute('open'); };
  HTMLElement.prototype.showPopover ??= function () {};
  HTMLElement.prototype.hidePopover ??= function () {};
});

type ModalContext = {
  container: HTMLDivElement;
  component: Record<string, any>;
};

function mountModal(
  container: HTMLDivElement,
  props?: Record<string, any>,
): ModalContext {
  const component = mount(Modal, {
    target: container,
    props: { title: 'Test Modal', ...props },
  });
  return { container, component };
}

describe('Modal', () => {
  let ctx: ModalContext;

  beforeEach(() => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    ctx = mountModal(container);
  });

  afterEach(() => {
    unmount(ctx.component);
    ctx.container.remove();
  });

  describe('Modal open/close', () => {
    it('should not show dialog content when closed', () => {
      const dialog = ctx.container.querySelector('dialog');
      expect(dialog).not.toBeNull();
      expect(dialog!.open).toBe(false);
    });

    it('should show dialog content when open', () => {
      unmount(ctx.component);
      ctx = mountModal(ctx.container, { open: true, title: 'Opened' });

      const dialog = ctx.container.querySelector('dialog');
      expect(dialog).not.toBeNull();
    });

    it('should display title in dialog header', () => {
      unmount(ctx.component);
      ctx = mountModal(ctx.container, { open: true, title: 'Hello World' });

      const title = ctx.container.querySelector('.modal-title');
      expect(title).not.toBeNull();
      expect(title!.textContent).toBe('Hello World');
    });
  });
});
