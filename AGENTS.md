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

## Figma MCP Integration

### Вызов инструментов Figma

MCP-сервер `figma-developer-mcp` предоставляет два инструмента: `get_figma_data` и `download_figma_images`.

**Если инструменты НЕ отображаются в списке доступных** (ограничение llm-proxy) — вызывай их напрямую через bash:

```bash
# Получить данные макета
echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"get_figma_data","arguments":{"fileKey":"<fileKey>","nodeId":"<nodeId>"}}}' | \
  npx -y figma-developer-mcp --stdio

# Скачать изображения
echo '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"download_figma_images","arguments":{"fileKey":"<fileKey>","nodes":[{"nodeId":"<nodeId>","fileName":"icon.svg"}],"localPath":"src/ui/icons"}}}' | \
  npx -y figma-developer-mcp --stdio
```

- `<fileKey>` — из Figma URL (`figma.com/design/<fileKey>/...`)
- `<nodeId>` — из параметра `node-id=<nodeId>` (дефисы заменить на двоеточия: `6-4093` → `6:4093`)
- `FIGMA_API_KEY` подтягивается из окружения автоматически

### Rate Limits

Figma API имеет лимиты на запросы. При 429 (Too Many Requests) — подождать сброса (обычно до 1 часа для Viewer-прав). Для повышения лимита нужен Full/Professional seat.

### Санитизация

Имена компонентов и текстовые слои из Figma проходят санитизацию перед подстановкой в prompt:

- **Ограничение длины:** максимум 64 символа; превышение обрезается с добавлением `…`
- **Допустимые символы:** `[a-zA-Zа-яА-Я0-9 _-]` — всё остальное удаляется

### Генерация кода (Svelte 5)

При генерации Svelte-кода из Figma-макета агент должен:

- Использовать **Svelte 5 runes**: `$props()`, `$state()`, `$derived()`, `$effect()`
- Для интерактивных элементов применять **Melt UI** (headless primitives), не нативные HTML-элементы
- Все визуальные атрибуты задавать через **CSS custom properties** из `src/ui/tokens/`:
  - `colors.css` — палитра (`var(--c-*)`)
  - `spacing.css` — отступы (`var(--space-*)`)
  - `radius.css` — скругления (`var(--radius-*)`)
  - `typography.css` — шрифты (`var(--font-*)`, `var(--label)`)
  - `elevation.css` — тени
  - `motion.css`, `animations.css` — анимации
- Следовать структуре `src/ui/primitives/<Component>/`:
  - `Component.svelte` — runes + Melt UI
  - `Component.test.ts` — Vitest
  - `Component.stories.ts` — Storybook

### Маппинг Figma → Svelte

| Figma-имя | Svelte-компонент | Статус |
|---|---|---|
| `Button` | `src/ui/primitives/Button/` | ✓ mapped |
| `Icon` | `src/ui/icons/` (Bell, Shop, Star, Tasks, Home, Hamburger, Grades, Fire, Check) | ⚠ partial (9 иконок) |
| `Counter` | — | ✗ unmapped |
| `Badge` | `src/ui/primitives/Badge/` | ✓ mapped |
| `Modal` | `src/ui/primitives/Modal/` | ✓ mapped |
| `SegmentControl` | `src/ui/primitives/SegmentControl/` | ✓ mapped |
| `PointsBadge` | `src/ui/components/PointsBadge/` | ✓ mapped |

### Пример промпта

```
Реализуй этот макет как Svelte 5 компонент:
[вставь Figma-ссылку на фрейм]

Используй:
- Svelte 5 runes ($props, $state, $derived, $effect)
- Melt UI для интерактивных элементов
- CSS-токены из src/ui/tokens/ (var(--c-*), var(--space-*), var(--radius-*))
- Существующие компоненты из src/ui/primitives/ и src/ui/icons/
- Структуру: Component.svelte + Component.test.ts + Component.stories.ts

Перед генерацией проверь маппинг Figma-имён на существующие компоненты
в секции «Маппинг Figma → Svelte» этого файла.
```
