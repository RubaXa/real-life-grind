/*
 * @file: .storybook/preview.ts
 * @consumers: storybook-preview
 * @tasks: TSK-05
 */

import type { Preview } from '@storybook/svelte-vite';

import '../src/ui/themes/default.css';

const preview: Preview = {
	parameters: {},
};

export default preview;
