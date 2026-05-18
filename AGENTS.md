# AGENTS.md — AI Navigation Guide

## Quick code navigation

Every file contains machine-readable markup. Use grep as your primary search tool:

```bash
# Find all files of a specific scope/module
rg "@file:.*Button" src/

# Find all files consumed by a specific consumer
rg "@consumers:.*web" src/

# Find files for a specific task
rg "@tasks:.*TSK-06" src/

# Find all exported entities with semantics
rg "@purpose" src/ --after-context 1

# Find all Svelte components
rg "^<!-- @file:" src/
```

## Project structure (co-location per entity)

```
src/ui/primitives/Button/
├── Button.svelte      # component (Svelte 5 runes + Melt UI)
├── Button.test.ts     # unit tests (Vitest)
├── Button.stories.ts  # Storybook stories (+ play + a11y)
```

Rule: every `.svelte` has a `.test.ts` and `.stories.ts` in the same folder. When changing a component, edit all three files.

## Stack and commands

```
Node.js 22.x    | npm ci (NOT npm install)
TypeScript 6    | strict + verbatimModuleSyntax
Svelte 5 runes  | $props(), $state(), $derived(), $effect()
Melt UI         | headless primitives (not native HTML elements)
Biome           | linter + formatter (single quotes, semicolons, 2 spaces)
Vitest 4        | jsdom, Svelte integration
Playwright      | 3 browsers
Lefthook        | pre-commit: biome → tsc → vitest --changed
```

```bash
npm run check     # full run (typecheck → svelte-check → vitest → playwright → biome)
npm run ci-check  # all checks in parallel (faster, interleaved logs)
npm run dev       # http://localhost:5173
npm run storybook # http://localhost:6006
```

Important: `npm ci` for installs (deterministic), `npm run check` before every commit.

## CSS tokens (never write raw values)

All visual attributes must use CSS custom properties from `src/ui/tokens/`:

```css
/* ✅ correct */
color: var(--c-red);
padding: var(--space-3);
font: var(--label);
border-radius: var(--radius-pill);

/* ❌ incorrect */
color: #ff4444;
padding: 12px;
```

## Constraints and conventions

- **Language:** all code and project documentation is in Russian.
- **SDD process:** decisions and requirements → `specs/`, tasks → `tasks/`. Read the scope spec before writing code.
- **Dexie.js** for local-first (IndexedDB), **Firebase** for Auth + Firestore. Offline-first: write to Dexie, sync to Firebase.
- **Do not duplicate existing documentation.** `specs/`, `draft/`, `README.md` already contain architecture, design, and PRD. Reference them — don't paraphrase.
- **Biome lints only `src/**` and `tests/**`** — files outside these folders are not checked.
- **Vite alias `$lib`** → `src/lib` (not actively used yet, but reserved).
- **PWA:** vite-plugin-pwa with autoUpdate. Service worker caches static assets (CacheFirst) and API (NetworkFirst).
