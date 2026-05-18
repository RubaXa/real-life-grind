// @file: Storybook stories for SegmentControl primitive — 2 selection states with play functions + a11y.
// @consumers: Storybook canvas
// @tasks: TSK-06, TSK-08
import type { Meta, StoryObj } from '@storybook/svelte-vite';
import { expect } from 'storybook/test';
import SegmentControl from './SegmentControl.svelte';

const meta: Meta = {
  title: 'Primitives/SegmentControl',
  component: SegmentControl,
  parameters: { a11y: { test: 'error' } },
};
export default meta;

type Story = StoryObj;

const options = [
  { id: 'tasks', label: 'Задачи' },
  { id: 'grades', label: 'Оценки' },
  { id: 'shop', label: 'Магазин' },
];

export const Morning: Story = {
  args: { options, value: 'tasks' },
  play: async ({ canvas, step }) => {
    await step(
      'Render contract: tasks pill has segment-active class',
      async () => {
        const buttons = canvas.getAllByRole('button');
        await expect(buttons).toHaveLength(3);
        await expect(buttons[0]).toHaveClass('segment-active');
        await expect(buttons[1]).not.toHaveClass('segment-active');
        await expect(buttons[2]).not.toHaveClass('segment-active');
      },
    );
  },
};

export const Evening: Story = {
  args: { options, value: 'shop' },
  play: async ({ canvas, step }) => {
    await step(
      'Render contract: shop pill has segment-active class',
      async () => {
        const buttons = canvas.getAllByRole('button');
        await expect(buttons).toHaveLength(3);
        await expect(buttons[0]).not.toHaveClass('segment-active');
        await expect(buttons[1]).not.toHaveClass('segment-active');
        await expect(buttons[2]).toHaveClass('segment-active');
      },
    );
  },
};
