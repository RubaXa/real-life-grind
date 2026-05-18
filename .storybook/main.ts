/*
 * @file: .storybook/main.ts
 * @consumers: storybook-builder
 * @tasks: TSK-05
 */

import type { StorybookConfig } from '@storybook/svelte-vite';
import { withoutVitePlugins } from '@storybook/builder-vite';

const config: StorybookConfig = {
	stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|svelte)'],
	addons: ['@storybook/addon-a11y', '@storybook/addon-themes'],
	framework: '@storybook/svelte-vite',
	async viteFinal(config) {
		config.plugins = await withoutVitePlugins(config.plugins, [
			'vite-plugin-pwa',
			'vite-plugin-pwa:build',
			'vite-plugin-pwa:dev-sw',
			'vite-plugin-pwa:info',
			'vite-plugin-pwa:pwa-assets',
		]);
		return config;
	},
};

export default config;
