# Real-Life Grind

Семейная система обязанностей, баллов и поощрений — прозрачная балльная экономика для координации задач, школы и покупок привилегий.

## Быстрый старт

```bash
node --version   # ожидается 22.x

cp .env.example .env    # вставить VITE_FIREBASE_*-ключи
npm ci                  # детерминированная установка зависимостей
npx playwright install  # браузеры для e2e

npm run dev    # http://localhost:5173
npm run check  # typecheck + svelte-check + vitest + playwright + biome
```

## Скрипты

| Команда | Что делает |
|---|---|
| `npm run dev` | Vite dev-сервер |
| `npm run build` | Продакшен-сборка (SPA) |
| `npm run preview` | Локальный предпросмотр сборки |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run svelte-check` | Диагностика Svelte-специфичных ошибок |
| `npm run test` | Unit-тесты (Vitest) |
| `npm run test:e2e` | E2E-тесты (Playwright) |
| `npm run lint` | `biome check --write` |
| `npm run format` | `biome format --write` |
| `npm run check` | Полный прогон: typecheck → svelte-check → vitest → playwright → biome |
| `npm run ci-check` | Все проверки параллельно (для CI) |
| `npm run storybook` | Storybook dev (http://localhost:6006) |
| `npm run storybook:build` | Статическая сборка Storybook |

## Технологии

**Фундамент:** TypeScript, Vite, Svelte 5 (runes), Melt UI, Firebase, Dexie.js, PWA

**Качество:** Biome (lint + format), Vitest, Playwright, Lefthook (pre-commit), Storybook

Хостинг: GitHub Pages (SPA), Google Auth

## Документация

Вся архитектура, решения по инструментам, инвентарь компонентов и scope-граф — в **[specs/](./specs/)**.

- [Портал проекта](./specs/README.md) — Vision, Scope Graph, таблица скоупов
- [infra-base](./specs/infra-base/infra-base.spec.md) — фундамент сборки, стек инструментов, decision log
- [infra-ui](./specs/infra-ui/infra-ui.spec.md) — дизайн-система, UI-кит, Storybook
