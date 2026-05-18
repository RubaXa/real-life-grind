// @file: Storybook stories for Button primitive — 5 variants, each as separate story with play function + a11y.
// @consumers: Storybook canvas
// @tasks: TSK-06, TSK-08
import type { Meta, StoryObj } from '@storybook/svelte-vite';
import { expect, fn, userEvent } from 'storybook/test';
import Button from './Button.svelte';

const meta: Meta = {
  title: 'Primitives/Button',
  component: Button,
  parameters: { a11y: { test: 'error' } },
};
export default meta;

type Story = StoryObj;

export const Primary: Story = {
  args: { variant: 'primary', label: 'Выполнить' },
  play: async ({ canvas, step }) => {
    await step(
      'Render contract: button has btn-primary class + role=button',
      async () => {
        const button = canvas.getByRole('button');
        await expect(button).toBeInTheDocument();
        await expect(button).toHaveClass('btn-primary');
      },
    );
  },
};

export const Approve: Story = {
  args: { variant: 'approve', label: 'Одобрить' },
  play: async ({ canvas, step }) => {
    await step(
      'Render contract: button has btn-approve class + role=button',
      async () => {
        const button = canvas.getByRole('button');
        await expect(button).toBeInTheDocument();
        await expect(button).toHaveClass('btn-approve');
      },
    );
  },
};

export const Reject: Story = {
  args: { variant: 'reject', label: 'Отклонить' },
  parameters: {
    a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } },
  },
  play: async ({ canvas, step }) => {
    await step(
      'Render contract: button has btn-reject class + role=button',
      async () => {
        const button = canvas.getByRole('button');
        await expect(button).toBeInTheDocument();
        await expect(button).toHaveClass('btn-reject');
      },
    );
  },
};

export const Buy: Story = {
  args: { variant: 'buy', label: 'Купить за 50 ⭐' },
  play: async ({ canvas, step }) => {
    await step(
      'Render contract: button has btn-buy class + role=button',
      async () => {
        const button = canvas.getByRole('button');
        await expect(button).toBeInTheDocument();
        await expect(button).toHaveClass('btn-buy');
      },
    );
  },
};

export const Ghost: Story = {
  args: { variant: 'ghost', label: 'Отмена' },
  parameters: {
    a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } },
  },
  play: async ({ canvas, step }) => {
    await step(
      'Render contract: button has btn-ghost class + role=button',
      async () => {
        const button = canvas.getByRole('button');
        await expect(button).toBeInTheDocument();
        await expect(button).toHaveClass('btn-ghost');
      },
    );
  },
};

export const Click: Story = {
  args: { variant: 'primary', label: 'Нажми меня', onclick: fn() },
  play: async ({ canvas, step, args }) => {
    await step('Динамика: клик по кнопке → обработчик вызван', async () => {
      const button = canvas.getByRole('button', { name: 'Нажми меня' });
      await userEvent.click(button);
      await expect(args.onclick).toHaveBeenCalledTimes(1);
    });
  },
};
