// @file: Storybook stories for Modal primitive — open/closed states with play functions + a11y.
// @consumers: Storybook canvas
// @tasks: TSK-06, TSK-08
import type { Meta, StoryObj } from '@storybook/svelte-vite';
import { expect, screen } from 'storybook/test';
import Modal from './Modal.svelte';

const meta: Meta = {
  title: 'Primitives/Modal',
  component: Modal,
  parameters: { a11y: { test: 'error' } },
};
export default meta;

type Story = StoryObj;

export const Open: Story = {
  args: { open: true, title: 'Уведомление' },
  play: async ({ step }) => {
    await step(
      'Render contract: dialog is visible via screen.getByRole',
      async () => {
        const dialog = screen.getByRole('dialog');
        await expect(dialog).toBeVisible();
      },
    );
  },
};

export const Closed: Story = {
  args: { open: false, title: 'Уведомление' },
  play: async ({ step }) => {
    await step(
      'Render contract: dialog is not accessible when closed',
      async () => {
        await expect(screen.queryByRole('dialog')).toBeNull();
      },
    );
  },
};
