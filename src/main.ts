// @file: Svelte 5 SPA entry point — infra-base shell
// @consumers: Vite dev server, Vite build
// @tasks: TSK-02
import { mount } from 'svelte';
import App from './App.svelte';

const root = document.getElementById('app');
if (!root) throw new Error('#app not found');
const app = mount(App, {
  target: root,
  props: {},
});

export default app;
