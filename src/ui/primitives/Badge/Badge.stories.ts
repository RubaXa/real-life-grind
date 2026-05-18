// @file: Storybook stories for Badge primitive — 3 variants, each as separate story with play function + a11y.
// @consumers: Storybook canvas
// @tasks: TSK-06, TSK-08
import type { Meta, StoryObj } from '@storybook/svelte-vite';
import { expect } from 'storybook/test';
import Badge from './Badge.svelte';

const meta: Meta = {
  title: 'Primitives/Badge',
  component: Badge,
  parameters: { a11y: { test: 'error' } },
};
export default meta;

type Story = StoryObj;

export const Points: Story = {
  args: { variant: 'points', label: '+50 ⭐' },
  parameters: {
    a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } },
  },
  play: async ({ canvas, step }) => {
    await step(
      'Render contract: badge has badge-points class + label text',
      async () => {
        const badge = canvas.getByText('+50 ⭐');
        await expect(badge).toBeInTheDocument();
        await expect(badge).toHaveClass('badge-points');
      },
    );
  },
};

export const Penalty: Story = {
  args: { variant: 'penalty', label: '-10 ⭐' },
  parameters: {
    a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } },
  },
  play: async ({ canvas, step }) => {
    await step(
      'Render contract: badge has badge-penalty class + label text',
      async () => {
        const badge = canvas.getByText('-10 ⭐');
        await expect(badge).toBeInTheDocument();
        await expect(badge).toHaveClass('badge-penalty');
      },
    );
  },
};

export const Count: Story = {
  args: { variant: 'count', label: '3' },
  play: async ({ canvas, step }) => {
    await step(
      'Render contract: badge has badge-count class + label text',
      async () => {
        const badge = canvas.getByText('3');
        await expect(badge).toBeInTheDocument();
        await expect(badge).toHaveClass('badge-count');
      },
    );
  },
};
