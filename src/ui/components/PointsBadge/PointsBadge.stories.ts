// @file: Storybook stories for PointsBadge demo component — 3 states with play functions + a11y.
// @consumers: Storybook canvas
// @tasks: TSK-07, TSK-08
import type { Meta, StoryObj } from '@storybook/svelte-vite';
import { expect } from 'storybook/test';
import PointsBadge from './PointsBadge.svelte';

const meta: Meta = {
  title: 'Components/PointsBadge',
  component: PointsBadge,
  parameters: { a11y: { test: 'error' } },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: { points: 240 },
  parameters: {
    a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } },
  },
  play: async ({ canvas, step }) => {
    await step(
      'Render contract: points=240 text + star visible + role=img',
      async () => {
        const text = canvas.getByText('240');
        await expect(text).toBeInTheDocument();
        const star = canvas.getByRole('img', { name: 'Звезда' });
        await expect(star).toBeVisible();
      },
    );
  },
};

export const LargeNumber: Story = {
  args: { points: 9999 },
  parameters: {
    a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } },
  },
  play: async ({ canvas, step }) => {
    await step(
      'Render contract: points=9999 text + star visible + role=img',
      async () => {
        const text = canvas.getByText('9999');
        await expect(text).toBeInTheDocument();
        const star = canvas.getByRole('img', { name: 'Звезда' });
        await expect(star).toBeVisible();
      },
    );
  },
};

export const Empty: Story = {
  args: { points: 0 },
  play: async ({ canvas, step }) => {
    await step(
      'Render contract: points=0 text + star visible + role=img',
      async () => {
        const badge = canvas.getByText('0');
        await expect(badge).toBeInTheDocument();
        const star = canvas.getByRole('img', { name: 'Звезда' });
        await expect(star).toBeVisible();
      },
    );
  },
};
