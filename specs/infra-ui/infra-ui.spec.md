# infra-ui: UI Infrastructure Specification

## scope-type
infrastructure

## 1. Vision

Единая дизайн-система, UI-кит компонентов и среда изолированной разработки интерфейсов (Storybook) на базе Svelte 5 runes + Melt UI — чтобы компоненты были автономно тестируемы, стилизованы через CSS-токены, темонезависимы и переиспользуемы во всех экранах продукта.

### 1.1 Non-Goals (v1)

- SSR/SSG (только client-side rendering)
- Form validation (зона domain-lib)
- Data fetching / API-интеграция
- Управление состоянием приложения (зона web)
- Визуальные регрессии Chromatic (deferred до v2)
- Анимационные библиотеки (Motion One, GSAP) — только CSS + Svelte spring
- Интеграция с темами ОС (prefers-color-scheme) — v1 всегда dark

### 1.2 Success Metrics

| Metric | Target | Measured |
|---|---|---|
| Storybook build time | < 30s | CI (storybook:build) |
| Storybook test run | < 60s (all stories) | CI (test-storybook) |
| a11y audit score | 100 (axe-core, по всем stories) | CI (test-storybook + addon-a11y) |
| Component CSS bundle | < 5 KB gzipped per component | Vite build analysis |
| Story HMR latency | < 500ms (change → browser update) | local dev |

## 2. Tool Stack

### 2.1 Categories Covered

| Category | Class | Covered | Rationale |
|---|---|---|---|
| test-ui | mandatory | ✅ | Storybook 8 — изолированная разработка + визуальные регрессии + a11y-аудит |
| design-tokens | mandatory | ✅ | CSS custom properties — единый источник визуальной идентичности, подмена токенов = смена темы |
| ui-kit | mandatory | ✅ | Svelte 5 runes + Melt UI — headless-примитивы с полным контролем стилизации |
| theming | optional | ✅ | Многотемность через подмену CSS-файла токенов (default → minecraft → geodash → pastel) |
| animation | optional | ✅ | CSS @keyframes + Svelte spring() + CSS @property (Houdini, progressive) |
| icon-system | optional | ✅ | SVG-иконки (inline Svelte-компоненты), анимируемые через CSS/SMIL |
| a11y | mandatory | ✅ | WAI-ARIA через Melt UI + axe-core в Storybook + видимый focus ring + keyboard nav |

### 2.2 Tool Choices

| Category | Tool | Version Constraint | Rationale |
|---|---|---|---|
| test-ui | Storybook | >=8 | D-IU01 |
| test-ui | @storybook/svelte-vite | >=8 | D-IU01 |
| test-ui | @storybook/addon-essentials | >=8 | D-IU01 |
| test-ui | @storybook/addon-a11y | >=8 | D-IU01 |
| test-ui | @storybook/addon-interactions | >=8 | D-IU01 |
| test-ui | @storybook/addon-themes | >=8 | D-IU01 |
| ui-framework | Svelte 5 (runes) | ^5 | D-009 |
| ui-primitives | Melt UI | ^1 | D-010 |
| bundler | Vite (через @sveltejs/vite-plugin-svelte) | ^6 | D-008 |
| design-tokens | CSS custom properties | — | D-IU02 |
| type-check | TypeScript | ^5 | D-004 |

### 2.3 Design Tokens

Полная система токенов описана в дизайн-спеке (`draft/real-life-grind.draft-design.md`):

| Token Group | Spec § | Tokens | Source File |
|---|---|---|---|
| Colors | §1.1 | 13 base + glow variants, navy layers | `src/ui/tokens/colors.css` |
| Typography | §1.2 | 8 tokens (points 40px/800 → caption 12px/400) | `src/ui/tokens/typography.css` |
| Spacing | §1.3 | scale space-1…space-10 (4px–40px) | `src/ui/tokens/spacing.css` |
| Border Radius | §1.4 | sm/md/lg/pill (8/16/24/999px) | `src/ui/tokens/radius.css` |
| Motion | §1.5 | 3 curves + 4 durations | `src/ui/tokens/motion.css` |
| Elevation & Depth | §1.6 | 3 levels + glow rules | `src/ui/tokens/elevation.css` |
| Animation Hooks | §1.7 | 7 presets (shimmer, tick-up, gold-pulse, etc.) | `src/ui/tokens/animations.css` |
| Component Style Tokens | §1.8 | 15+ component classes (card, button, badge, etc.) | `src/ui/tokens/components.css` |

## 3. Developer Workflow Example

### 3.1 Первичная настройка (один раз)

```bash
# 1. Установка Storybook и зависимостей
npm install -D storybook @storybook/svelte-vite @storybook/addon-essentials \
  @storybook/addon-a11y @storybook/addon-interactions @storybook/addon-themes \
  @storybook/blocks @storybook/test-runner @storybook/test serve

# 2. Ручное создание .storybook/ (НЕ использовать storybook init)
mkdir -p .storybook
cat > .storybook/main.ts << 'EOF'
import type { StorybookConfig } from '@storybook/svelte-vite';
const config: StorybookConfig = {
  stories: ['../src/ui/**/*.stories.@(js|ts|svelte)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
    '@storybook/addon-themes',
  ],
  framework: '@storybook/svelte-vite',
};
export default config;
EOF

# 3. Создание .storybook/preview.ts (импорт токенов)
cat > .storybook/preview.ts << 'EOF'
import '../src/ui/themes/default.css';
EOF

# 4. Создание структуры src/ui/
mkdir -p src/ui/{tokens,themes,icons,primitives,components,stories}

# 5. Создание CSS-токенов из дизайн-спеки (§1.1–1.8) + темы
# Файлы токенов наполняются скриптом генерации из дизайн-спеки
# (см. src/ui/tokens/generate-tokens.ts)
touch src/ui/tokens/{colors,typography,spacing,radius,motion,elevation,animations,components}.css
touch src/ui/themes/default.css

# 6. Проверка: Storybook собирается и стартует
npm run storybook:build && echo "Storybook build OK"
```

### 3.2 Ежедневный цикл разработки UI-компонента

```bash
# Старт Storybook dev-сервера
npm run storybook               # Storybook на localhost:6006

# Итерация: компонент → story → проверка
# 1. Пишешь компонент в src/ui/components/TaskCard/TaskCard.svelte
# 2. Пишешь story в src/ui/components/TaskCard/TaskCard.stories.ts
# 3. Смотришь в Storybook (HMR)

# Проверка типов и Svelte-диагностика
npm run svelte-check            # диагностика runes + a11y

# Запуск interaction-тестов в CI-режиме
npm run storybook:build         # статическая сборка Storybook
npx test-storybook              # прогон stories + a11y audit

# Перед коммитом — общий check (из infra-base)
npm run check
```

### 3.3 Добавление нового компонента в UI-кит

```bash
# 1. Создать директорию
mkdir -p src/ui/components/NewComponent

# 2. Создать файлы
touch src/ui/components/NewComponent/NewComponent.svelte
touch src/ui/components/NewComponent/NewComponent.stories.ts
touch src/ui/components/NewComponent/NewComponent.test.ts

# 3. Реализовать компонент (через Melt UI примитив)
# 4. Написать 3+ stories (default + состояния + a11y exposure)
# 5. Экспортировать в src/ui/index.ts
# 6. Проверить: npm run storybook → npm run svelte-check → npx test-storybook
```

### 3.4 Debug Flow

```bash
# Storybook dev tools
npm run storybook -- --debug     # verbose логи

# Svelte-компонент: console.log в $effect
# $effect(() => { console.log('state:', someState); });

# Interaction test debug
npx test-storybook --watch       # watch mode для отладки play-функций

# Проверка конкретного компонента
npx test-storybook --only TaskCard
```

## 4. Component Inventory (UIKit)

### 4.1 Core Components

| # | Component | Melt UI Primitive | Animation | Story | Design Spec § |
|---|---|---|---|---|---|
| 1 | **TaskCard** | Accordion | slide-up, shimmer | ✅ | §3.1 |
| 2 | **SlideToComplete** | Slider | Svelte spring | ✅ | §3.2 |
| 3 | **BalanceDisplay** | — | tick-up, gold-pulse | ✅ | §3.3 |
| 4 | **InboxStrip** | — | — | ✅ | §3.4 |
| 5 | **InboxPanel** | — | — | ✅ | §3.5 |
| 6 | **TabBar** | ToggleGroup | — | ✅ | §3.7 |
| 7 | **UrgencyTimer** | — | shake, pulse | ✅ | §3.8 |
| 8 | **StoreItem** | Accordion | slide-up | ✅ | §3.6 |
| 9 | **SegmentControl** | ToggleGroup | — | ✅ | §3.5, §5.1 |
| 10 | **Button** (primary/approve/reject/buy/ghost) | — | — | ✅ | §1.8 |
| 11 | **Badge** (points/penalty/count) | — | — | ✅ | §1.8 |
| 12 | **Avatar** | — | — | ✅ | §5.2 |
| 13 | **Modal / Overlay / BottomSheet** | Dialog | fade + scale | ✅ | §1.6 |
| 14 | **ChipSelector** | — | — | ✅ | §4.1 |
| 15 | **PillSelector** | ToggleGroup | — | ✅ | §4.2 |
| 16 | **FormField** (text, select, time) | — | — | ✅ | §4.1–4.2 |
| 17 | **GradeCard** | — | — | ✅ | §5.6 |
| 18 | **ConfettiOverlay** | — | pop-confetti | ✅ | §1.7 |
| 19 | **Header** (mobile: hamburger + family name + bell/badge; desktop: logo + family name + bell/badge) | — | — | ✅ | §5.1, §8.1–8.12 |

### 4.2 States Covered per Component

Каждый компонент покрывает все состояния, описанные в дизайн-спеке:

| Component | States |
|---|---|
| TaskCard | pending, done, awaiting_approval, approved, rejected, burned, urgent, expanded |
| SlideToComplete | idle, dragging, complete, snap-back |
| BalanceDisplay | static, earning (tick-up), spending (red dim), idle |
| InboxStrip | has-items (with badge), empty ("Всё в порядке ✓") |
| UrgencyTimer | calm, moderate, warning, urgent (shake + red glow) |
| Button | rest, hover, active, disabled, loading |
| StoreItem | collapsed, expanded, pending (gold border), purchased |
| GradeCard | approved (green dot), pending (gold dot), penalty (red accent) |
| Header | mobile (hamburger + family + bell), desktop (logo + family + bell), with badge, without badge, with balance inline |

## 5. File Structure

```
src/ui/
├── tokens/                    # CSS design tokens (источник визуальной идентичности)
│   ├── colors.css             # §1.1 — 13+ цветовых токенов + glow
│   ├── typography.css         # §1.2 — 8 типографических токенов
│   ├── spacing.css            # §1.3 — шкала отступов
│   ├── radius.css             # §1.4 — радиусы скругления
│   ├── motion.css             # §1.5 — кривые и длительности
│   ├── elevation.css          # §1.6 — уровни глубины + glow
│   ├── animations.css         # §1.7 — пресеты анимаций
│   └── components.css         # §1.8 — компонентные токены
├── themes/                    # Файлы тем (подмена токенов)
│   ├── default.css            # v1 — dark premium (Balatro-like)
│   ├── minecraft.css          # v2 — pixel art, blocky
│   ├── geodash.css            # v2 — neon dark
│   └── pastel.css             # v2 — light neutral
├── icons/                     # SVG-иконки как Svelte-компоненты
│   ├── Star.svelte
│   ├── Fire.svelte
│   ├── Check.svelte
│   ├── Home.svelte
│   ├── Tasks.svelte
│   ├── Shop.svelte
│   ├── Grades.svelte
│   ├── Bell.svelte
│   └── Hamburger.svelte
├── primitives/                # Базовые UI-примитивы (обёртки над Melt UI)
│   ├── Button/
│   │   ├── Button.svelte
│   │   ├── Button.stories.ts
│   │   └── Button.test.ts
│   ├── Badge/
│   ├── Avatar/
│   ├── Modal/
│   ├── SegmentControl/
│   ├── PillSelector/
│   ├── ChipSelector/
│   ├── FormField/
│   ├── TabGroup/
│   └── Accordion/
├── components/                # Бизнес-компоненты (семантика семейного приложения)
│   ├── TaskCard/
│   │   ├── TaskCard.svelte
│   │   ├── TaskCard.stories.ts
│   │   └── TaskCard.test.ts
│   ├── SlideToComplete/
│   ├── BalanceDisplay/
│   ├── InboxStrip/
│   ├── InboxPanel/
│   ├── TabBar/
│   ├── UrgencyTimer/
│   ├── StoreItem/
│   ├── GradeCard/
│   ├── ConfettiOverlay/
│   └── Header/
├── stories/                   # Корневые Storybook-конфигурации
│   ├── introduction.stories.mdx
│   └── tokens.stories.ts       # демонстрация design-токенов
├── index.ts                   # public API (реэкспорт компонентов)
└── lib.ts                     # shared утилиты (formatTime, calcUrgency, etc.)
```

## 6. Storybook Configuration

### 6.1 Runtime Dependencies

| Package | Purpose |
|---|---|
| `storybook` | CLI + core |
| `@storybook/svelte-vite` | Svelte 5 + Vite framework adapter |
| `@storybook/addon-essentials` | Actions, controls, docs, viewport, backgrounds, toolbars |
| `@storybook/addon-a11y` | Axe-core accessibility audit per story |
| `@storybook/addon-interactions` | Play function testing + step debugging |
| `@storybook/addon-themes` | Theme switcher in toolbar |
| `@storybook/blocks` | MDX Doc Blocks |

### 6.2 Build Script

```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "storybook:build": "storybook build -o dist/storybook",
    "storybook:preview": "npx serve dist/storybook"
  }
}
```

### 6.3 Configuration File

Storybook config: `.storybook/main.ts` (`@storybook/svelte-vite` framework, stories glob `src/ui/**/*.stories.@(js|ts|svelte)`).

### 6.4 Story Format

Stories следуют CSF3 (Component Story Format) в `.stories.ts`:
- `.stories.ts` — для Svelte-компонентов (CSF3 render-функция + play). Storybook 10.x не поддерживает `.stories.ts`.

Каждый компонент имеет минимум 3 состояния:
1. Default / Rest
2. Each semantic state (см. таблицу 3.2)
3. With a11y violations intentionally exposed

### 6.5 Testing Methodology — Play Functions + A11y Tree

Каждая story обязана содержать **play-функцию**, которая верифицирует не статический рендер, а **динамическое поведение** компонента в реальном браузере (Playwright headless через `test-storybook`).

**Три уровня проверок на каждую story:**

| Уровень | Что проверяется | Инструмент |
|---|---|---|
| **Render contract** | Компонент рендерится без ошибок, DOM-дерево соответствует ожидаемому при заданных props | `expect(canvas.getByRole(...)).toBeInTheDocument()` |
| **Property reactivity** | Изменение props меняет DOM-структуру: текст, классы, aria-атрибуты, вложенные элементы | `step('Change props', async () => { args.points = 999; await expect(...) })` |
| **A11y tree** | Axe-core не находит violations. Все интерактивные элементы имеют role + label. Контраст проходит WCAG AA. | `parameters: { a11y: { test: 'error' } }` |

**Контракт play-функции (CSF3, Svelte 5):**

```ts
import type { Meta, StoryObj } from '@storybook/svelte-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import MyComponent from './MyComponent.svelte';

const meta: Meta = {
  component: MyComponent,
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    points: { control: 'number' },
  },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: { points: 240 },
  play: async ({ canvas, step, args }) => {
    await step('Verify initial render', async () => {
      const badge = canvas.getByText('240');
      await expect(badge).toBeInTheDocument();
      const star = canvas.getByRole('img', { name: 'Звезда' });
      await expect(star).toBeVisible();
    });

    await step('Property change: points=0 → структура меняется', async () => {
      args.points = 0;
      const badge = canvas.getByText('0');
      await expect(badge).toBeInTheDocument();
      // Звезда всё ещё видна (иконка не исчезает при нуле)
    });

    await step('A11y: no violations', async () => {
      // Проверяется автоматически через addon-a11y test='error'
    });
  },
};
```

**Правила:**
- Каждая story содержит минимум 2 шага (`step`): initial render + property change
- `canvas.getByRole()` — приоритетный query (a11y-first)
- `canvas.getByText()` — для статического текста
- `data-testid` — только в крайнем случае
- `expect` — всегда с `await`
- Кнопки проверяются через `userEvent.click()` + проверка эффекта
- `args` мутируется напрямую для проверки property reactivity (Svelte 5 `$props` реактивность)

**CI-запуск:**
```bash
npm run storybook:build && npx test-storybook --index-json
```
`test-storybook` запускает все stories в headless Chromium (Playwright), выполняет play-функции, проверяет a11y через addon-a11y. Exit 0 = все проверки пройдены.

**V2 (deferred):** визуальные скриншоты через `postVisit` hook или Chromatic. Мультимодальные модели смогут сравнивать скриншоты до/после изменений.

## 7. Dependency Policy

### 7.1 Adapter Boundary
- UI-кит использует Melt UI как **единственную** headless-зависимость. Замена Melt UI на другую библиотеку (например, Bits UI) требует изменения только в primitives-слое.
- Компоненты продуктового слоя (`web`) импортируют UI-кит через `src/ui/index.ts` — не напрямую из primitives или Melt UI.

### 7.2 Style Discipline
- Компоненты не содержат жёстко закодированных цветов — только ссылки на CSS-токены.
- Каждый компонент принимает `class` prop для внешней кастомизации.
- Glow-эффекты используют исключительно `--c-*-glow` токены, не дублируются в компонентах.

### 7.3 Animation Discipline
- GPU path only: `transform`, `opacity`, `filter`.
- Никогда не анимировать `width`, `height`, `top`, `left`.
- Интерактивные жесты (slide-to-complete) → Svelte `spring()` + Web Animations API.
- Декоративные анимации (glow, pulse, shake) → CSS `@keyframes`.
- Прогрессивное улучшение: `@property` (Houdini) для градиентов; fallback — статический градиент.

### 7.4 Icon Discipline
- Все иконки — inline SVG Svelte-компоненты (без растровых изображений).
- Иконки принимают `size` + `color` props через CSS-токены.
- Анимация иконок — через CSS `transition` / `@keyframes` (SMIL не используется).

## 8. Effective Rules (for cascade)

| Rule | Category | File | Source | Triggers |
|---|---|---|---|---|
| svelte5-storybook | infra | `ai/directives/infra/svelte5-storybook.xml` | D-IU01 | `.stories.ts`, `.stories.ts` файлы |
| design-tokens-theme | infra | `ai/directives/infra/design-tokens-theme.xml` | D-IU02 | `src/ui/tokens/`, `src/ui/themes/` файлы |
| svelte-ui-conventions | coding | `ai/directives/coding/svelte-ui-conventions.xml` | D-IU03 | `src/ui/components/`, `src/ui/primitives/` файлы |

> Правила для `svelte5-storybook`, `design-tokens-theme`, `svelte-ui-conventions` — **deferred** (аналогично Biome и svelte-check в infra-base). До создания агенты руководствуются данным спеком.

## 9. Verification Commands

| Command Name | Invocation | Phase | Context |
|---|---|---|---|
| storybook-dev | `npm run storybook` | dev | Локальная разработка компонентов |
| storybook-build | `npm run storybook:build` | build | CI — проверка, что Storybook собирается без ошибок |
| storybook-test | `npx test-storybook --index-json --url http://localhost:6006` | test | CI — interaction tests + a11y audit (требует запущенный Storybook) |
| svelte-check | `svelte-check --tsconfig ./tsconfig.json` | typecheck | Проверка Svelte-специфичных ошибок в компонентах |
| check-command | `svelte-check --tsconfig ./tsconfig.json && npm run storybook:build && npx test-storybook --index-json` | all | Полная проверка UI-кита: типы → сборка Storybook → interaction tests + a11y |

> **CheckPhaseOrder:** typecheck → build → test. `test-storybook --index-json` работает со статическим `storybook-static/index.json` (не требует запущенного dev-сервера). Зависимость: `npm run storybook:build` должен выполниться до `test-storybook`. Biome lint/format наследуется из infra-base.

## 10. Decision Log

### D-IU01 — Storybook 8 как test-ui

- **Status:** active
- **Recorded:** session Discovery, infra-ui
- **Why:** Storybook 8 — индустриальный стандарт для изолированной разработки UI-компонентов. Нативная интеграция с Svelte 5 через `@storybook/svelte-vite`. Встроенный a11y-аудит (axe-core), interaction testing (play-функции), theme switching. Vite-совместимость — общий кэш трансформаций с dev-сервером проекта.
- **Risk accepted:** Адаптер `@storybook/svelte-vite` для Svelte 5 может иметь нестабильности (см. риск #10). Компенсация: spike на первом bootstrap-тикете, fallback на `.stories.ts` с render-функцией. HMR с Svelte 5 runes ($state, $derived) может не подхватывать изменения — проверка на старте, при проблемах — флаг `--force-build-preview`.
- **Rejected alternatives:**
  - **Histoire** — Svelte-native, но молодая экосистема (< 1k звёзд), нет a11y-аддона, нет test-runner для CI. Слишком рискованно для production-проекта.
  - **Ladle** — быстрый (esbuild), но только React. Нет адаптера для Svelte.
  - **Vitest UI** — не предназначен для изолированной визуальной разработки компонентов; ориентирован на unit-тесты.
  - **Chromatic** — визуальные регрессии (не замена Storybook, а дополнение). Deferred до v2.

### D-IU02 — CSS custom properties как design-tokens

- **Status:** active
- **Recorded:** session Discovery, infra-ui
- **Why:** CSS custom properties — нативный механизм браузера для токенов дизайна. Не требуют препроцессора (Sass, Less), работают во всех целевых браузерах, поддерживают динамическое переопределение (темизация через подмену файла). Полная совместимость с Svelte 5 (стили — обычный CSS). Позволяют реализовать многотемность без изменения компонентов: смена темы = подмена CSS-файла токенов.
- **Risk accepted:** Нет compile-time валидации токенов (опечатка в `var(--c-goldd)` не отловится на этапе сборки). Компенсация: svelte-check подсвечивает неиспользуемые CSS-переменные; storybook stories демонстрируют все токены визуально. CSS @property (Houdini) для анимируемых градиентов не поддерживается в Firefox до v128 — progressive enhancement с fallback на статический градиент.
- **Rejected alternatives:**
  - **Style Dictionary (Amazon)** — мощный (трансформация, платформенные артефакты), но избыточен: дополнительный билд-степ, своя конфигурация, генерация кода. Для v1 с одним веб-таргетом — overhead.
  - **Sass/SCSS variables** — требуют препроцессора (sass), не поддерживают динамическое переопределение без перекомпиляции, ломают темизацию «на лету».
  - **Tailwind CSS design tokens** — привязка к утилитарному фреймворку, противоречит принципу «тонкий UI, толстый домен» (архитектурная спека §2.6). Токены должны быть независимы от CSS-фреймворка.
  - **Figma Tokens plugin → JSON** — добавляет внешнюю зависимость (Figma), не решает проблему доставки токенов в браузер без дополнительного билд-степа.

### D-IU03 — Svelte 5 + Melt UI как ui-kit фундамент

- **Status:** active
- **Recorded:** session Discovery, infra-ui
- **Why:** Svelte 5 runes ($state, $derived, $effect) — чистая реактивность без виртуального DOM, минимальный бандл. Melt UI — headless-примитивы, WAI-ARIA compliant, написаны на Svelte 5 runes. Вместе дают: полный контроль над стилизацией (через CSS-токены), доступность из коробки, отсутствие vendor lock-in на styled-компоненты. Замена Melt UI на Bits UI или другую headless-библиотеку требует изменений только в primitives-слое.
- **Risk accepted:** Melt UI активно развивается — возможны breaking changes между минорными версиями (см. риск #1). Компенсация: adapter layer в `src/ui/primitives/`. Зафиксирована версия `^1` (совместимость в пределах мажорной). Перед обновлением — прогон test-storybook на всех компонентах.
- **Rejected alternatives:**
  - **Shadcn-Svelte** — порт React-библиотеки. Чужеродные паттерны (React-образный API), риск несовместимости с Svelte 5 runes при обновлениях. Нарушает принцип «Svelte-native».
  - **Skeleton UI** — тяжеловесный, навязывает готовые стили (конфликтует с собственной дизайн-системой на CSS-токенах). Избыточен: infra-ui предоставляет собственные стилизованные компоненты.
  - **Прямое использование ARIA-атрибутов без библиотеки** — больше кода (50–100 строк на компонент для a11y), выше риск ошибок доступности. Melt UI даёт проверенную a11y-базу.
  - **Bits UI** — альтернатива Melt UI с похожей философией. **Deferred alternative:** adapter layer проектируется с учётом замены, но v1 реализация — Melt-only.

### D-IU04 — CSS @keyframes + Svelte spring как animation approach

- **Status:** active
- **Recorded:** session Discovery, infra-ui
- **Why:** GPU-совместимые анимации (transform, opacity, filter) покрывают 95% UI-потребностей: shimmer, pulse, shake, slide-up, tick-up — все через CSS @keyframes. Интерактивные жесты (slide-to-complete) — через Svelte `spring()` + Web Animations API. Никаких дополнительных зависимостей, bundle-size impact = 0. Дизайн-спека явно предписывает CSS-first (§1.5, §9.4).
- **Risk accepted:** Сложные sequenced-анимации (конфетти при аппруве, цепочка из 3+ фаз) потребуют больше boilerplate на чистом CSS. Компенсация: Canvas 2D для конфетти (lazy-loaded, progressive); Svelte `$effect` для оркестрации последовательностей.
- **Rejected alternatives:**
  - **Motion One** (~5 KB) — Web Animations API обёртка. Добавляет зависимость для edge-случаев (sequenced animations), которые в v1 покрываются CSS + Svelte spring. Может быть добавлена позже без переписывания компонентов.
  - **GSAP** — мощный, но 30+ KB, коммерческая лицензия, не tree-shakeable. Избыточен для CSS-токен-базированной дизайн-системы.
  - **Framer Motion (React)** — несовместим со Svelte.

## 11. Scope Dependencies

- **Depends on:** `infra-base` (TypeScript, Vite, Svelte 5, Biome, Vitest)
- **Provides rules to:** `web` (product)
- **Constraint for `web`:** `web` импортирует UI-кит через `src/ui/index.ts`. Запрещены прямые импорты Melt UI из `web`.
- **Boundary rule:** `infra-ui` поставляет механизм доставки дизайн-токенов и UI-компонентов, но не определяет их семантику — семантика (какой цвет что означает) задаётся product-скоупом (`web`) и дизайн-спекой. Имена токенов (`--c-gold`, `--c-teal`) фиксированы спекой, их переопределение — прерогатива `web`.

## 12. Bootstrap Requirements

| Requirement | Kind | Owner | Resolution |
|---|---|---|---|---|
| Storybook packages | package | this-scope-task | `npm install -D storybook @storybook/svelte-vite @storybook/addon-essentials @storybook/addon-a11y @storybook/addon-interactions @storybook/addon-themes @storybook/blocks @storybook/test-runner @storybook/test` |
| `serve` (preview) | package | this-scope-task | `npm install -D serve` |
| `src/ui/` directory structure | file | this-scope-task | Создать структуру: tokens/ themes/ icons/ primitives/ components/ stories/ |
| CSS design tokens | file | this-scope-task | Создать 8 CSS-файлов токенов из §1.1–1.8 дизайн-спеки |
| `default` theme | file | this-scope-task | `src/ui/themes/default.css` — импортирует все токены |
| Primitives: Button, Badge, Modal, SegmentControl | file | this-scope-task | Обёртки над Melt UI с CSS-токенами |
| SVG icons (9 шт.) | file | this-scope-task | Star, Fire, Check, Home, Tasks, Shop, Grades, Bell, Hamburger — inline Svelte-компоненты |
| `.storybook/main.ts` | file | this-scope-task | Конфигурация Storybook (framework: svelte-vite, glob pattern) |
| `.storybook/preview.ts` | file | this-scope-task | Импорт токенов + темы в preview |
| npm scripts: storybook, storybook:build, storybook:preview | script | this-scope-task | Добавить в `package.json` |
| Base UIKit components (9 шт.) | file | this-scope-task | TaskCard, BalanceDisplay, TabBar, SlideToComplete, UrgencyTimer, InboxStrip, StoreItem, GradeCard, Header — каждый отдельным тикетом |
| Stories per component | file | this-scope-task | Минимум 3 состояния на компонент + a11y exposure |
| `src/ui/index.ts` (public API) | file | this-scope-task | Реэкспорт всех компонентов |
| `src/ui/lib.ts` (shared utils) | file | this-scope-task | formatTime, calcUrgency, mapUrgencyToVariant, classNames |

## 13. Handoff

- **Setup tasks to scaffold (порядок и зависимости):**
  1. **(pre-flight check)** Убедиться, что infra-base bootstrap завершён: TypeScript ^5, Vite ^6, Svelte 5 runes, Melt UI ^1, Biome, Vitest установлены и сконфигурированы.
  2. Установка Storybook-пакетов (`package.json`, `package-lock.json`)
  3. Создание структуры `src/ui/` (tokens, themes, icons, primitives, components, stories)
  4. Создание CSS design-токенов (8 файлов из дизайн-спеки §1.1–1.8)
  5. Создание темы `default.css` (импорт всех токенов) ← зависит от 4
  6. ∥ Создание базовых примитивов (Button, Badge, Modal, SegmentControl) — обёртки над Melt UI
  7. ∥ Создание иконок как Svelte-компонентов (Star, Fire, Check, Home, Tasks, Shop, Grades, Bell, Hamburger)
  8. Конфигурация Storybook (`.storybook/main.ts`, `.storybook/preview.ts`) ← зависит от 3, 5
  9. npm-скрипты: `storybook`, `storybook:build`, `storybook:preview`, `svelte-check` ← зависит от 8
  10. Создание `src/ui/lib.ts` — shared утилиты (formatTime, calcUrgency, mapUrgencyToVariant, classNames)
  11. ∥ Создание базовых компонентов UI-кита: TaskCard, BalanceDisplay, TabBar, SlideToComplete, UrgencyTimer, InboxStrip, StoreItem, GradeCard, Header — **каждый компонент — отдельный тикет**. Компоненты с 5+ состояниями (TaskCard, Button) — stories вынести в отдельный под-тикет. ← зависит от 6, 7, 8, 10
  12. ∥ Stories для каждого компонента (минимум 3 состояния + a11y) ← зависит от 11
  13. Создание `src/ui/index.ts` — public API (реэкспорт) ← зависит от 11

  > ∥ = параллелизуемые задачи (независимые файловые наборы)

- **Effective rules:** deferred (см. раздел 8)
- **Verification Commands ready for cascade:** см. раздел 9
- **Bootstrap tickets ready for cascade:** см. раздел 12

- **Open risks:**
  1. **Melt UI версионирование** — библиотека активно развивается под Svelte 5 runes. Возможны breaking changes между минорными версиями. Компенсация: adapter layer в primitives.
  2. **Storybook 8 + Svelte 5** — адаптер `@storybook/svelte-vite` должен поддерживать runes ($state, $derived, $effect). Проверить совместимость на старте bootstrap.
  3. **CSS @property (Houdini)** — не поддерживается в Firefox до v128. Fallback: статический градиент для burn-эффекта в Firefox.
  4. **Web Animations API** — полифил может потребоваться для Safari < 15. В v1 — progressive enhancement (slide-to-complete работает через Svelte spring в любом случае).
  5. **axe-core в CI** — `test-storybook` + `@storybook/addon-a11y` требуют headless-браузер. Требуется проверка интеграции с Playwright (Chromium) в CI.
  6. **Размер бандла UI-кита** — при импорте всего UI-кита через `index.ts` возможен раздутый initial bundle. Решение: tree-shaking через именованные экспорты + ленивая загрузка компонентов на уровне роутов.
  7. **SVG performance** — inline SVG-компоненты увеличивают размер JS-бандла (нет внешних спрайтов). Компенсация: Svelte компилирует SVG в статический DOM, минимизируя runtime-оверхед.
  8. **Storybook rule files отсутствуют** — `ai/directives/infra/svelte5-storybook.xml`, `design-tokens-theme.xml`, `svelte-ui-conventions.xml` — deferred до создания. Аналогично Biome и svelte-check в infra-base.
  9. **Storybook 8 HMR + Svelte 5 runes** — `$state` / `$derived` изменения могут не подхватываться HMR Storybook (компиляторная реактивность вместо Proxy-based). Compensating action: проверить на первом bootstrap-тикете; при проблемах — `storybook dev --force-build-preview` или полная перезагрузка.
  10. **`@storybook/svelte-vite` maturity gap** — адаптер для Svelte 5 ещё не достиг зрелости `@storybook/react-vite`. Autodocs, source code panel, controls для `$bindable()` props могут быть нестабильны. Mitigation: зафиксировать минимальную версию (≥8.2), мониторить changelog, держать fallback-план на `.stories.ts` с render-функцией.
  11. **CSF `.stories.ts` vs `test-storybook`** — `@storybook/test-runner` и `addon-interactions` (play-функции) в основном документированы для `.stories.ts` с `render` из `@storybook/svelte`. Прохождение interaction-тестов в CI через `.stories.ts` может потребовать дополнительной настройки. Mitigation: провести spike на первом bootstrap-тикете; при проблемах — перейти на `.stories.ts` + `render: () => ({ Component })`.
  12. **`$effect` cleanup в Storybook canvas** — каждая story рендерится в изолированном iframe, но Svelte `$effect` может не очищаться при unmount между stories, вызывая state leak и недетерминированные падения interaction-тестов. Mitigation: оборачивать `$effect` с явным cleanup return; добавить `beforeEach` reset в `.storybook/preview.ts`.
  13. **TypeScript path alias resolution в Storybook** — алиасы из `tsconfig.json` (например `$lib/ui`) должны быть продублированы в `viteFinal` конфиге `.storybook/main.ts`. Без этого импорты внутри stories сломаны. Mitigation: добавить `viteFinal` блок с `resolve.alias` в bootstrap-тикет конфигурации.
  14. **`@storybook/addon-themes` без ThemeProvider** — аддон рассчитан на ThemeProvider-обёртку (React/Vue), но infra-ui использует чистые CSS custom properties (подмена файла токенов). Интеграция аддона с декларативным CSS-подходом может не работать. Mitigation: проверить в bootstrap; при несовместимости — реализовать кастомный theme switcher через `Toolbar` API.
  15. **Inline SVG accessibility** — SVG-иконки (Svelte-компоненты без явных `role="img"` и `aria-label`) будут невидимы для screen readers. Mitigation: добавить обязательные `role` и `aria-label` props в каждый иконочный компонент; включить проверку в storybook a11y audit.
