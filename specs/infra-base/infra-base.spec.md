# infra-base: Infrastructure Specification

## scope-type
infrastructure

## 1. Vision

Единая, быстрая и надёжная инструментальная база для AI-управляемой разработки: императивные проверки на pre-commit, детерминированные билды, изолированные тесты и жёсткие performance-бюджеты — чтобы ни один пулл-реквест не ломал прод.

## 2. Tool Stack

### 2.1 Categories Covered

| Category | Class | Covered | Rationale |
|---|---|---|---|
| vcs | mandatory | ✅ | git — фундамент любого проекта |
| package-management | mandatory | ✅ | npm — зафиксирован в PRD |
| git-hooks | mandatory | ✅ | lefthook — pre-commit gate для Biome +Vitest |
| type-check | optional | ✅ | TypeScript 5.x — статическая типизация |
| linting | optional | ✅ | Biome — единый инструмент линтинга |
| formatting | optional | ✅ | Biome — zero-config форматтер |
| test-unit | optional | ✅ | Vitest — Vite-native, быстрый |
| test-e2e | optional | ✅ | Playwright — кросс-браузерный |
| bundler | optional | ✅ | Vite 6.x — dev-server + production build |
| ui-framework | optional | ✅ | Svelte 5 (runes) — компилируемый, малый бандл |
| ui-primitives | optional | ✅ | Melt UI — headless, Svelte-native |
| backend | optional | ✅ | Firebase (Auth, Firestore) |
| hosting | optional | ✅ | GitHub Pages |
| auth | optional | ✅ | Google Authentication |
| env | optional | ✅ | Vite env (VITE_-префикс) — инжекция конфигурации |
| pwa | optional | ✅ | vite-plugin-pwa — service worker, manifest, caching |
| local-storage | optional | ✅ | Dexie.js — IndexedDB wrapper для local-first |
| svelte-check | optional | ✅ | svelte-check — диагностика Svelte-специфичных ошибок |

Not covered (deferred): ci, monorepo-tool, docs, observability, renovate (dependency updates).
Partially covered: test-ui (Storybook — build + deploy через `gh-pages`, без visual regression testing).

### 2.2 Tool Choices

| Category | Tool | Version Constraint | Rationale |
|---|---|---|---|
| vcs | git | any modern | D-001 |
| package-management | npm | ^10 | D-002 |
| git-hooks | lefthook | ^1 | D-003 |
| type-check | TypeScript | ^5.5 | D-004 |
| linting+formatting | Biome | ^2 | D-005 |
| test-unit | Vitest | ^3 | D-006 |
| test-e2e | Playwright | ^1.50 | D-007 |
| bundler | Vite | ^6 | D-008 |
| ui-framework | Svelte | ^5 | D-009 |
| ui-primitives | Melt UI | ^1 | D-010 |
| backend | Firebase | ^11 | D-011 |
| hosting | GitHub Pages | — | D-012 |
| auth | Google Auth (Firebase Auth) | — | D-013 |
| env | Vite (import.meta.env) | — | D-014 |
| pwa | vite-plugin-pwa | ^1 | D-015 |
| local-storage | Dexie.js | ^4 | D-016 |
| svelte-check | svelte-check | ^4 | D-005 |

## 3. Developer Workflow Example

### 3.1 Первичная настройка (один раз)

```bash
# 1. Клонировать репо
git clone <repo-url> && cd real-life-grind

# 2. Активировать правильную версию Node.js
node --version  # должно быть 22.x

# 3. Скопировать .env.example → .env и вставить Firebase-конфигурацию
cp .env.example .env

# 4. Установить зависимости
npm ci

# 5. Установить браузеры Playwright
npx playwright install

# 6. Убедиться, что всё работает
npm run check
```

### 3.2 Ежедневный цикл разработки

```bash
# Старт dev-сервера
npm run dev              # Vite dev server на localhost:5173

# Итерация: код → проверка → коммит
npm run check            # typecheck + svelte-check + vitest + playwright + biome (последовательно)
npm run ci-check         # все проверки параллельно (для CI: видит все ошибки сразу)
npm run typecheck        # только TypeScript
npm run svelte-check     # диагностика Svelte-специфичных ошибок
npm run test             # только unit-тесты
npm run test:e2e         # только e2e-тесты
npm run lint             # biome check (линтинг + автофикс)
npm run format           # biome format --write
```

### 3.3 Pre-commit Flow (автоматический через lefthook)

```bash
git add <files>
git commit -m "feat: ..."
# lefthook запускает автоматически:
#   1. biome check --write (staged files)
#   2. tsc --noEmit
#   3. vitest run --changed (только затронутые тесты)
# Если любая проверка падает → коммит блокирован
```

### 3.4 Debug Flow

```bash
# Локальный дебаг unit-теста
npx vitest --ui          # Vitest UI для интерактивного дебага

# E2E дебаг
npx playwright test --debug  # Playwright Inspector

# Firebase эмуляторы (локальная разработка без прода)
npx firebase emulators:start
```

### 3.5 Deploy Flow (ручной)

```bash
# Полный деплой: SPA (корень) + Storybook (/storybook/) на GitHub Pages
npm run deploy

# Деплой только SPA
npm run deploy:app

# Деплой только Storybook (в /storybook/)
npm run deploy:storybook
```

**Принцип работы `npm run deploy`:**
1. `npm run build` → `dist/` (SPA: index.html, 404.html, sw.js, manifest, assets)
2. `npm run storybook:build` → `storybook-static/`
3. `rm -rf dist/storybook && cp -r storybook-static dist/storybook` — Storybook внутри SPA-папки
4. `touch dist/.nojekyll` — отключает Jekyll-обработку на GitHub Pages
5. Создаёт временный git-репозиторий, копирует `dist/` → коммит → `git push origin gh-pages --force`
6. Временная директория удаляется

**Важно:** `vite.config.ts` должен содержать `base: '/real-life-grind/'` для корректной загрузки ассетов на project site. PWA manifest: `start_url: '/real-life-grind/'`, `scope: '/real-life-grind/'`. Деплой использует чистый git (сила пуша), без npm-пакета `gh-pages` — пакет некорректно фильтрует файлы при `--no-history`.

GitHub Pages настроен на ветку `gh-pages` (корень). SPA доступен по `https://<user>.github.io/real-life-grind/`, Storybook — по `https://<user>.github.io/real-life-grind/storybook/`.

## 4. File Structure

### 4.1 Repository Root Layout

```
real-life-grind/
├── ai/
│   └── directives/          # SDD directives (managed by SDD framework)
├── specs/                   # SDD specifications
│   ├── README.md            # Portal
│   └── infra-base/
│       └── infra-base.spec.md
├── src/                     # Application source (future — web scope)
├── tests/                   # E2E tests (future — web scope)
├── .claude/                 # Claude Code config
├── .gitignore
├── .node-version            # Node.js version pin (22)
├── .env.example             # Шаблон переменных окружения (VITE_-префикс)
├── .env                     # В gitignore — реальные ключи Firebase
├── package.json             # Dependencies + scripts (включая deploy-скрипты)
├── package-lock.json        # Lockfile (deterministic installs)
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Vite config
├── biome.json               # Biome config (linter + formatter)
├── lefthook.yml             # Git hooks orchestration
├── firebase.json            # Firebase config (emulators, hosting)
├── .firebaserc              # Firebase project alias (для CLI) → в .gitignore, генерируется `firebase use`)
├── index.html               # SPA entry point
├── dist/                    # Билд SPA (в .gitignore)
│   └── storybook/           # Storybook static (копируется при deploy)
└── storybook-static/        # Билд Storybook (в .gitignore)
```

### 4.2 Config File ↔ Tool Mapping

| Config File | Tool | Purpose |
|---|---|---|
| `.node-version` | Node.js | Версия рантайма (читается fnm/volta/nvm) |
| `package.json` | npm | Зависимости, скрипты (включая `deploy`, `deploy:app`, `deploy:storybook`) |
| `package-lock.json` | npm | Детерминированные installs |
| `tsconfig.json` | TypeScript | Компиляция, strict-режим, paths |
| `vite.config.ts` | Vite | Бандл, dev-server, плагины |
| `biome.json` | Biome | Правила линтинга + форматирования |
| `lefthook.yml` | lefthook | Pre-commit хуки |
| `firebase.json` | Firebase | Эмуляторы, деплой |
| `.firebaserc` | Firebase CLI | Project alias (генерируется `firebase use <project>`) |
| `.gitignore` | git | Исключения из VCS |
| `.env.example` | Vite | Шаблон: VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, ... |
| `.env` | Vite | В gitignore: реальные значения Firebase-конфигурации |

## 5. Effective Rules (for cascade)

| Rule | Category | File | Source | Triggers |
|---|---|---|---|---|
| nodejs-npm-setup | infra | `ai/directives/infra/nodejs-npm-setup.xml` | D-002 | package.json, engines, check-command |
| git-setup | infra | `ai/directives/infra/git-setup.xml` | D-001 | .gitignore, hooks, commit discipline |
| typescript-rules | coding | `ai/directives/coding/typescript-rules.xml` | D-004 | .ts, .tsx, .svelte.ts файлы |
| svelte5-runes | coding | `ai/directives/coding/svelte5-runes.xml` | D-009 | .svelte, .svelte.ts файлы |
| vitest-rules | testing | `ai/directives/testing/vitest-rules.xml` | D-006 | .test.ts, .spec.ts файлы |
| playwright-cli | testing | `ai/directives/testing/playwright-cli.xml` | D-007 | Исследование UI перед e2e |
| playwright-e2e | testing | `ai/directives/testing/playwright-e2e.xml` | D-007 | .e2e.ts, .spec.e2e.ts файлы |

**Missing rule — Biome:** Правило для Biome отсутствует в `ai/directives/infra/`. Решение: **deferred** (см. Open Risks в Handoff). До создания правила агенты руководствуются дефолтной конфигурацией Biome (`biome.json`).

**Missing rule — svelte-check:** Правило для `svelte-check` отсутствует в `ai/directives/infra/`. Решение: **deferred** (см. Open Risks). До создания — использовать дефолтный запуск `svelte-check --tsconfig ./tsconfig.json`.

## 6. Verification Commands

| Command Name | Invocation | Phase | Context |
|---|---|---|---|
| typecheck-command | `tsc --noEmit` | typecheck | pre-commit, CI |
| svelte-check-command | `svelte-check --tsconfig ./tsconfig.json` | typecheck | pre-commit, CI |
| test-command | `vitest run` | test | CI (full suite) |
| test-command (pre-commit) | `vitest run --changed` | test | pre-commit (быстрый, только затронутые тесты) |
| test-e2e-command | `playwright test` | test | CI |
| lint-command | `biome check --write` | lint | pre-commit, CI |
| format-command | `biome format --write` | format | pre-commit, CI |
| check-command | `tsc --noEmit && svelte-check --tsconfig ./tsconfig.json && vitest run && playwright test && biome check` | all | pre-commit (fail-fast, последовательный) |
| ci-check-command | `tsc --noEmit & svelte-check --tsconfig ./tsconfig.json & vitest run & playwright test & biome check; wait` | all | CI (параллельный, все ошибки за один прогон) |

**CheckPhaseOrder:** typecheck → test → lint → format

`check-command` — для pre-commit: fail-fast, останавливается на первой ошибке.
`ci-check-command` — для CI: параллельный запуск всех проверок с агрегацией результатов, чтобы видеть все ошибки сразу.

## 7. Decision Log

### D-001 — Git как VCS
- **Status:** active
- **Recorded:** session Discovery, infra-base
- **Why:** Стандарт индустрии. Бесплатный хостинг на GitHub. Полная интеграция с GitHub Pages и Actions.
- **Risk accepted:** Отсутствие альтернатив не является риском — git универсален.
- **Rejected alternatives:** Mercurial (мёртвая экосистема), SVN (legacy).

### D-002 — npm как package manager
- **Status:** active
- **Recorded:** session Discovery, infra-base
- **Why:** Зафиксирован в PRD. Полная совместимость с экосистемой Node.js. Не требует дополнительной установки (встроен в Node.js). Достаточен для проекта без monorepo.
- **Risk accepted:** Медленнее pnpm при больших монорепах (не релевантно для v1 — один пакет).
- **Version pinning:** Exact-версии для инфраструктурных зависимостей (Biome, TypeScript, Vite, Vitest) — гарантируют детерминированные билды. Caret (^) для прикладных (Melt UI, Firebase, Dexie.js). Renovate/Dependabot в deferred для автоматизации обновлений.
- **Rejected alternatives:** pnpm (быстрее, но требует установки; избыточен без monorepo), yarn (фрагментация экосистемы, меньше преимуществ перед npm с workspaces).

### D-003 — lefthook как git-hooks менеджер
- **Status:** active
- **Recorded:** session Discovery, infra-base
- **Why:** Быстрый (скомпилирован в Go), кросс-платформенный. Параллельное выполнение хуков. Простая конфигурация в YAML. Не требует node_modules для работы (в отличие от husky).
- **Risk accepted:** Менее популярен, чем husky — меньше community-рецептов.
- **Rejected alternatives:** husky (медленный старт, зависит от node_modules), simple-git-hooks (слишком минимальный — нет параллельного выполнения, нет fallback).

### D-004 — TypeScript как type-checker
- **Status:** active
- **Recorded:** session Discovery, infra-base
- **Why:** Стандарт для frontend-разработки. Строгий режим (`strict: true`) предотвращает целый класс багов. Полная интеграция с Vite (через esbuild/vite plugin). Svelte 5 имеет первоклассную поддержку TS.
- **Risk accepted:** Увеличение времени компиляции на больших проектах. Build-time overhead на CI.
- **Rejected alternatives:** JavaScript + JSDoc (не даёт compile-time гарантий), Flow (мёртвая экосистема).

### D-005 — Biome как линтер + форматтер
- **Status:** active
- **Recorded:** session Discovery, infra-base
- **Why:** Один инструмент вместо двух (ESLint + Prettier), одна конфигурация. Скорость: написан на Rust, на порядок быстрее ESLint. Встроенный автофикс для линтинга и форматирования. Совместимость с правилами, аналогичными recommended ESLint.
- **Risk accepted:** Меньше плагинов, чем у ESLint. Нет правил для Svelte-специфичных паттернов (runes: $state, $derived, $effect). Компенсация: `svelte-check` в check-command — официальный инструмент диагностики Svelte-специфичных ошибок от команды Svelte.
- **Rejected alternatives:** ESLint + Prettier (два конфига, медленнее, сложнее поддерживать синхронизацию правил), oxlint (быстрый, но нет форматтера — всё равно нужен Prettier).

### D-006 — Vitest как unit-test runner
- **Status:** active
- **Recorded:** session Discovery, infra-base
- **Why:** Vite-native — общая конфигурация с dev-сервером и билдом, общий кэш трансформаций. API, совместимый с Jest (expect, describe, it). Быстрый старт, HMR для тестов, UI-режим. Поддержка ESM из коробки.
- **Risk accepted:** Меньше экосистема плагинов, чем у Jest (компенсируется тем, что большинство Jest-плагинов совместимы).
- **Rejected alternatives:** Jest (медленный старт, отдельная конфигурация, хуже ESM-поддержка), node:test (встроенный, но минимальный функционал, нет UI, нет HMR).

### D-007 — Playwright как e2e-test runner
- **Status:** active
- **Recorded:** session Discovery, infra-base
- **Why:** Кросс-браузерное тестирование (Chromium, Firefox, WebKit). Надёжные авто-ожидания (auto-wait). Полный контроль над сетью (intercept, mock). Интеграция с VS Code и CI. Трассировка (trace viewer) для дебага упавших тестов. Адаптер для Svelte существует.
- **Risk accepted:** Большой размер установки (браузеры). Медленнее Cypress на холодном старте.
- **Rejected alternatives:** Cypress (только Chrome-family, нет нативных multi-tab сценариев), WebDriverIO (legacy-архитектура, медленнее, сложнее конфигурация).

### D-008 — Vite как bundler
- **Status:** active
- **Recorded:** session Discovery, infra-base
- **Why:** Мгновенный HMR, esbuild-powered сборка, нативная поддержка Svelte через плагин. Единая конфигурация для dev и production. Ленивая загрузка модулей из коробки. Лучший DX для Svelte-проектов.
- **Risk accepted:** Зависимость от esbuild и rollup под капотом (два слоя трансформации).
- **Rejected alternatives:** webpack (тяжёлая конфигурация, медленная сборка), Turbopack (экспериментальный, нестабильный).

### D-009 — Svelte 5 как UI-фреймворк
- **Status:** active
- **Recorded:** session Discovery, infra-base
- **Why:** Компилируемый фреймворк — маленький бандл, быстрое выполнение. Runes ($state, $derived, $effect) — чистая реактивность без виртуального DOM. SvelteKit опционален (можно использовать standalone Svelte с Vite). Зафиксирован в PRD и дизайн-спеке.
- **Risk accepted:** Меньше экосистема компонентов, чем у React. Runes — новый API, возможны нестабильности.
- **Rejected alternatives:** React (большой бандл, виртуальный DOM — противоречит performance-бюджетам), Vue (компромисс, но Svelte даёт лучший bundle size).

### D-010 — Melt UI как UI-примитивы
- **Status:** active
- **Recorded:** session Discovery, infra-base
- **Why:** Headless UI-библиотека, нативная для Svelte. Строит на Svelte 5 runes ($state, $derived). WAI-ARIA compliant из коробки. Позволяет полностью контролировать стилизацию (CSS-токены, описанные в дизайн-спеке). Лучшая альтернатива, чем порты React-библиотек.
- **Risk accepted:** Меньше готовых styled-компонентов (компенсируется дизайн-системой на CSS-токенах).
- **Rejected alternatives:** Shadcn-Svelte (порт React-библиотеки — риск несовместимости, чужеродные паттерны), Skeleton UI (тяжеловесный, навязывает стили).

### D-011 — Firebase как backend
- **Status:** active
- **Recorded:** session Discovery, infra-base
- **Why:** Зафиксирован в PRD. Managed-сервис: не нужно поднимать сервер. Firestore — документо-ориентированная БД с real-time синхронизацией. Firebase Auth — готовая интеграция с Google. Бесплатный тир достаточен для семейного использования.
- **Risk accepted:** Vendor lock-in (Firestore — проприетарная БД). Сложность локального тестирования без эмуляторов.
- **Rejected alternatives:** Supabase (лучше SQL, но требует отдельного хостинга), custom Node.js backend (дороже в разработке и поддержке).

### D-012 — GitHub Pages как хостинг (superseded)
- **Status:** superseded
- **Recorded:** session Discovery, infra-base
- **Superseded by:** D-018
- **Why superseded:** GitHub Actions account заблокирован из-за billing issue — CI workflow недоступен. Деплой перенесён на ручной запуск через npm-скрипт.
- **Was:** Автоматический деплой SPA на GitHub Pages через GitHub Actions (`peaceiris/actions-gh-pages@v4`) при push в main. Storybook деплоился отдельно.
- **Risk accepted:** Автоматический деплой через CI был удобен, но не критичен для семейного проекта на v1.

### D-013 — Google Authentication через Firebase Auth
- **Status:** active
- **Recorded:** session Discovery, infra-base
- **Why:** Бесплатный, безлимитный для семейного масштаба. Готовый UI (Firebase UI) или кастомный. Google-аккаунт есть у всех целевых пользователей (семья с Android/iOS/web). Безопасность на стороне Google — не нужно хранить пароли.
- **Risk accepted:** Зависимость от Google-инфраструктуры. Пользователь без Google-аккаунта не сможет войти (приемлемо для v1).
- **Rejected alternatives:** Email/Password (нужен сброс пароля, верификация — overhead для v1), Apple Sign-In (только для iOS, фрагментация).

### D-014 — Vite env как механизм конфигурации
- **Status:** active
- **Recorded:** session Discovery, infra-base
- **Why:** Vite предоставляет `import.meta.env` с префиксом `VITE_` для клиентских переменных. Firebase-конфигурация (apiKey, authDomain, projectId — публичные ключи, не секреты) инжектируется через `.env` файл. `.env.example` — шаблон в репозитории, `.env` — в `.gitignore`.
- **Risk accepted:** Разработчик должен вручную создать `.env` из `.env.example` после клонирования.
- **Rejected alternatives:** hardcode в коде (нарушает security — ключи в VCS), внешний конфиг-сервис (overkill для SPA).

### D-015 — vite-plugin-pwa как PWA tooling
- **Status:** active
- **Recorded:** session Discovery, infra-base
- **Why:** Генерирует service worker через Workbox, автоматически кэширует статические ассеты (precaching), создаёт `manifest.webmanifest` для установки на устройство. Необходим для PWA-установки и офлайн-доступа к shell. Стратегия кэширования: CacheFirst для статики (JS, CSS, шрифты), NetworkFirst для API/Firestore, StaleWhileRevalidate для изображений.
- **Risk accepted:** Увеличение сложности билда (service worker + Workbox). Потенциальные проблемы с обновлением кэша при деплое (требуется версионирование прекэша).
- **Rejected alternatives:** Ручной service worker (сложнее, больше кода), workbox-build без vite-плагина (требует ручной интеграции с Vite).

### D-016 — Dexie.js как local-storage (IndexedDB wrapper)
- **Status:** active
- **Recorded:** session Discovery, infra-base
- **Why:** Local-first архитектура: устройство — первый источник записи. Dexie.js — минимальная, зрелая обёртка над IndexedDB с Promise-based API, поддержкой TypeScript, индексами и транзакциями. Используется как локальное хранилище для офлайн-очереди и локальных проекций данных. Firestore используется как сервер синхронизации (вторичный источник).
- **Risk accepted:** Два источника данных (IndexedDB + Firestore) требуют явного протокола синхронизации. Стратегия синхронизации (CRDT, last-write-wins, заказная) определяется в scope `domain-lib`.
- **Rejected alternatives:** localStorage (синхронный, ограничение 5MB, нет индексов), idb (низкоуровневый, больше кода), Firestore offline persistence как единственное хранилище (не local-first, а cloud-first с офлайн-кэшем — противоречит архитектуре из PRD).

### D-017 — svelte-check как Svelte-диагностика
- **Status:** active
- **Recorded:** session Discovery, infra-base
- **Why:** Официальный инструмент диагностики от команды Svelte. Проверяет: корректность runes ($state мутации, $derived циклы, $effect зависимости), типы в шаблонах, a11y-проблемы, неиспользуемые CSS. Компенсирует отсутствие Svelte-правил в Biome.
- **Risk accepted:** Пересекается с Biome по некоторым проверкам (дублирование предупреждений).
- **Rejected alternatives:** ESLint + eslint-plugin-svelte (нужен ESLint — конфликтует с D-005), полагаться только на TypeScript (не покрывает семантику runes и template-ошибки).

### D-018 — Ручной деплой через gh-pages пакет (rework)
- **Status:** active
- **Recorded:** session Discovery, infra-base, pivot
- **Supersedes:** D-012
- **Pre-rework state:** git ref `21ad60efe1fba7e72a7045428da29bb4e19d9f9a` (ci.yml с `peaceiris/actions-gh-pages@v4`, деплой SPA через GitHub Actions при push в main)
- **Was:** Автоматический деплой SPA на GitHub Pages через GitHub Actions (`peaceiris/actions-gh-pages@v4`) при push в main. Storybook деплоился отдельно.
- **Now:** Ручной деплой SPA + Storybook через чистый git (`git push origin gh-pages --force` из временной директории) одной командой `npm run deploy`. Storybook публикуется в поддиректорию `/storybook/` на том же GitHub Pages. CI workflow (`.github/workflows/ci.yml`) удалён — GitHub Actions недоступен.
- **Why:** GitHub Actions account заблокирован из-за billing issue. Ручной деплой через `gh-pages` — минимальное изменение без смены хостинг-провайдера. Storybook объединён с SPA в один деплой (один source of truth для статики).
- **Risk accepted:** Деплой только вручную — оператор должен помнить запушить после изменений. Storybook и SPA деплоятся вместе — нельзя обновить только один.
- **Rejected alternatives:** Vercel/Netlify (другой провайдер — overhead миграции), Firebase Hosting (платный), раздельные деплой-команды для SPA и Storybook (усложнение без выигрыша на v1).

### D-019 — GitHub Pages 404.html конфликт с поддиректориями
- **Status:** active
- **Recorded:** session Discovery, infra-base, deploy verification
- **Why:** GitHub Pages с `404.html` (SPA fallback) перехватывает ВСЕ не-файловые пути, включая директории с `index.html` внутри (`/storybook/` → `404.html` вместо `storybook/index.html`). Это известное ограничение GitHub Pages: когда `404.html` существует, он имеет приоритет над directory index resolution.
- **Solution:** В исходный `index.html` (Vite) добавлен inline-скрипт ПЕРЕД SPA-кодом, который редиректит storybook-пути на `storybook/index.html`. Поскольку `404.html` — копия `index.html`, скрипт срабатывает в обоих случаях. Storybook-файлы (`storybook/index.html`) не содержат этого скрипта (это отдельный билд), поэтому редирект-лупа нет.
- **Verification:** `curl -sI /storybook/` → 301 → `/storybook/index.html` → 200 (Storybook HTML). `curl -sI /some-spa-route` → 200 (SPA HTML через 404). `curl -sI /` → 200 (SPA HTML).
- **Risk accepted:** Глубокие ссылки Storybook (`/storybook/iframe.html?id=...`) работают напрямую (это файлы, не проходят через 404). Ненайденные storybook-пути редиректятся на корень Storybook (приемлемо).

## 8. Scope Dependencies

- **Depends on:** None (инфраструктурный скоп — листовой узел)
- **Provides rules to:** `web` (product), `domain-lib` (library)
- **Downstream constraint for `domain-lib`:** `domain-lib` определяет интерфейсы репозиториев и доменные сущности без зависимости от Firebase SDK. Реализация адаптеров (Firebase, IndexedDB) находится в `web` scope. Это гарантирует, что vendor lock-in (Firebase) затрагивает только инфраструктурный слой, а не домен.

## 9. Bootstrap Requirements

> Все пакеты из секции 2.2 Tool Choices являются `this-scope-task`. В таблице ниже перечислены только позиции, требующие особой обработки (бинарная установка, внешние сервисы, rule-файлы, операторские действия). Рядовые npm-пакеты (`svelte`, `firebase`, `typescript`, `vite`, `biome`, `vitest`, `melt`, `lefthook`) устанавливаются стандартной командой `npm install` в bootstrap-тикете.

| Requirement | Kind | Owner | Resolution |
|---|---|---|---|
| Node.js 22 | tool | operator-action | Установить Node.js 22+ через fnm/volta/nvm |
| npm (comes with Node.js) | tool | operator-action | Поставляется с Node.js 22 |
| Google Firebase project | service | operator-action | Создать проект в Firebase Console, получить конфигурацию |
| Firebase конфигурация | env | operator-action | Скопировать `.env.example` → `.env`, вставить значения `VITE_FIREBASE_*` |
| Git-репозиторий на GitHub | service | operator-action | Создать репозиторий, подключить к локальному |
| `@sveltejs/vite-plugin-svelte` | package | this-scope-task | `npm install -D @sveltejs/vite-plugin-svelte` |
| `firebase-tools` | package | this-scope-task | `npm install -D firebase-tools` |
| `@playwright/test` | package | this-scope-task | `npm install -D @playwright/test` |
| Playwright browsers | tool | this-scope-task | `npx playwright install` (Chromium, Firefox, WebKit) |
| `vite-plugin-pwa` | package | this-scope-task | `npm install -D vite-plugin-pwa` |
| `dexie` | package | this-scope-task | `npm install dexie` |
| `svelte-check` | package | this-scope-task | `npm install -D svelte-check` |
| `.firebaserc` | file | this-scope-task | `npx firebase use <project-id>` (генерирует алиас проекта) |
| `ai/directives/infra/nodejs-npm-setup.xml` | file | external-prereq-scope | Существует в `ai/directives/` |
| `ai/directives/infra/git-setup.xml` | file | external-prereq-scope | Существует в `ai/directives/` |
| `ai/directives/coding/typescript-rules.xml` | file | external-prereq-scope | Существует в `ai/directives/` |
| `ai/directives/coding/svelte5-runes.xml` | file | external-prereq-scope | Существует в `ai/directives/` |
| `ai/directives/testing/vitest-rules.xml` | file | external-prereq-scope | Существует в `ai/directives/` |
| `ai/directives/testing/playwright-cli.xml` | file | external-prereq-scope | Существует в `ai/directives/` |
| `ai/directives/testing/playwright-e2e.xml` | file | external-prereq-scope | Существует в `ai/directives/` |

## 10. Handoff

- **Setup tasks to scaffold:**
  1. Инициализация npm-проекта (`package.json`, `package-lock.json`, `.node-version`)
  2. Конфигурация TypeScript (`tsconfig.json` с strict-режимом)
  3. Конфигурация Biome (`biome.json` с правилами линтинга + форматирования)
  4. Конфигурация Vite + Svelte (`vite.config.ts` + `@sveltejs/vite-plugin-svelte` + SPA fallback: копирование `index.html` → `404.html` при билде)
  5. Конфигурация lefthook (`lefthook.yml` с pre-commit: biome + typecheck + vitest --changed)
  6. Конфигурация Vitest (`vitest.config.ts` или в `vite.config.ts`)
  7. Конфигурация Playwright (`playwright.config.ts`)
  8. Конфигурация PWA (`vite-plugin-pwa` в `vite.config.ts`, стратегии кэширования)
  9. Конфигурация Firebase (`firebase.json`, эмуляторы)
  10. Переменные окружения (`.env.example` с VITE_FIREBASE_*-ключами, `.env` в `.gitignore`)
  11. `.gitignore` (node_modules, dist, storybook-static, .firebase, coverage, .env, env-файлы)
  12. npm-скрипты: `dev`, `build`, `preview`, `check`, `ci-check`, `typecheck`, `svelte-check`, `test`, `test:e2e`, `lint`, `format`, `deploy`, `deploy:app`, `deploy:storybook`
  13. Деплой: чистый git (сила пуш `dist/` в `gh-pages`), замена CI и `gh-pages` npm-пакета (D-018, pivot D-012)

- **Effective rules ready for cascade:** см. раздел 5

- **Verification Commands ready for cascade:** см. раздел 6

- **Bootstrap tickets ready for cascade:** см. раздел 9

- **Open risks:**
  1. **Biome rule file отсутствует** — агенты, конфигурирующие Biome, используют дефолтные настройки из `biome.json`. Требуется создать `ai/directives/infra/biome-setup.xml` (deferred, Owner: operator-action).
  2. **SvelteKit не выбран** — проект использует standalone Svelte 5 + Vite (SPA), а не SvelteKit. Если в будущем потребуется SSR/SSG, потребуется миграция на SvelteKit (pivot).
  3. **Firebase эмуляторы** — локальная разработка с Firebase требует настройки эмуляторов. Без них разработка offline-режима затруднена.
  4. **Playwright браузеры** — требуют отдельной установки (`npx playwright install`). Должны быть частью bootstrap-процесса.
  5. **Melt UI версионирование** — библиотека активно развивается под Svelte 5 runes. Возможны breaking changes между минорными версиями.
  6. **Синхронизация IndexedDB ↔ Firestore** — Dexie.js + Firestore требуют явного протокола синхронизации. Стратегия (CRDT, last-write-wins, заказная) определяется в scope `domain-lib`. До этого все данные пишутся напрямую в Firestore с offline persistence.
  7. **svelte-check rule file отсутствует** — правило для `svelte-check` отсутствует в `ai/directives/`. Аналогично Biome — deferred до создания `ai/directives/infra/svelte-check-setup.xml`.
  8. **Firebase free-tier квоты** — 50K reads/day, 20K writes/day. При активном использовании (10 задач × 4 чел × 20 обновлений/день = ~800 writes/day) запас >20x. Тем не менее, отсутствует мониторинг — deferred до observability-скопа. Требуется проверка расчёта на реальных данных в v1.
  9. **GitHub Actions недоступен** — деплой только вручную через `npm run deploy`. CI-проверки (`npm run ci-check`) по-прежнему работают локально, но нет автоматического прогона при PR/push. При разблокировке GitHub Actions — создать новый CI workflow (без деплоя, только `npm run ci-check` + `npm run build` для валидации).

### 10.1 Pivot Invalidation List (D-018)
- **Module specs requiring refine:** None (инфраструктурный скоп — не имеет модулей)
- **Tasks requiring reopen:**
  - **TSK-04** — Round 2: замена CI-деплоя на ручной (`gh-pages` пакет, deploy-скрипты, удаление `ci.yml`)
- **Rules to revisit:** None (правило CI отсутствовало — было deferred)
