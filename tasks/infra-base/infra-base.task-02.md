# Task: TSK-02 — Конфигурация сборки: Vite, Svelte, TypeScript, PWA

## 1. Meta
- **Task-ID:** TSK-02
- **Status:** [x] DONE
- **Purpose:** Сконфигурировать TypeScript (strict), Vite с Svelte-плагином, PWA (service worker + manifest) и SPA fallback для GitHub Pages.
- **Scope:** infra-base
- **Module:** N/A
- **Dependencies:** TSK-01
- **Reopens:** 0
- **Spec References:**
  - Contract: [Decision Log D-004 (TypeScript), D-008 (Vite), D-009 (Svelte 5), D-015 (PWA)](../../specs/infra-base/infra-base.spec.md#7-decision-log)
  - Constraints: [File Structure](../../specs/infra-base/infra-base.spec.md#4-file-structure)
  - SPA fallback: [D-012 SPA fallback mechanism](../../specs/infra-base/infra-base.spec.md#d-012--github-pages-как-хостинг)
- **Runtime Backing:** `not-implemented` (конфигурационные файлы)
- **Verification Levels:** `integration`
- **Deferred Runtime Scope:** None

## 2. Phases Overview
| ID | Kind | Deps | Status |
|----|------|------|--------|
| P1 | config | — | [x] |
| P2 | test | P1 | [x] |

## 3. Phases

### P1 — config
- **Objective:** Создать `tsconfig.json` (strict mode), `vite.config.ts` (Svelte-плагин, PWA-плагин, SPA fallback), `index.html` (SPA entry point).
- **Rules:**
  *(config phase — coding rules не активируются, т.к. SkipWhen: «Config-only task; infra-setup task without code files». Конфигурация руководствуется спецификацией infra-base.)*
- **Target Files:**
  - `tsconfig.json`
  - `vite.config.ts`
  - `index.html`
- **Inputs:** none
- **Exit:**
  - `tsconfig.json`: `strict: true`, `module: ESNext`, `moduleResolution: bundler`, `target: ES2022`, paths для `$lib`
  - `vite.config.ts`: Svelte-плагин, PWA-плагин (стратегии кэширования: CacheFirst для статики, NetworkFirst для API), resolve alias `$lib`, `writeBundle`-хук для копирования `index.html` → `404.html` после билда
  - `index.html`: минимальный SPA shell с `<div id="app">` и `<script type="module" src="/src/main.ts">`
  - `npm run build` завершается без ошибок и создаёт `dist/`
  - `dist/404.html` существует (сгенерирован `writeBundle`-хуком в `vite.config.ts` для SPA fallback на GitHub Pages)

### P2 — test
- **Objective:** Проверить, что dev-сервер стартует, production-билд собирается, PWA-манифест генерируется.
- **Rules:**
  *(No test framework rules — это инфраструктурная верификация без тестовых файлов.)*
- **Target Files:**
  *(верификация без создания файлов)*
- **Inputs:** P1 handoff
- **Exit:**
  - `npm run dev` стартует без ошибок (проверить stdout на `localhost:5173`)
  - `npm run build` → exit code 0, `dist/` содержит `index.html`, assets
  - `npm run preview` → стартует, отвечает 200 на `/`
  - `dist/manifest.webmanifest` существует и валиден
  - `dist/sw.js` (service worker) существует

## 4. Acceptance Criteria (BDD)
Contract: [infra-base spec Decision Log D-004, D-008, D-009, D-015](../../specs/infra-base/infra-base.spec.md#7-decision-log)

**Feature:** Сборка Svelte 5 SPA через Vite

**Scenario:** Успешный production-билд [`integration`]
- **Given** `tsconfig.json`, `vite.config.ts`, `index.html` созданы
- **When** запускается `npm run build`
- **Then** процесс завершается с exit code 0
- **And** директория `dist/` содержит `index.html`, JS/CSS-бандлы
- **And** `dist/404.html` существует (копия index.html, SPA fallback для GitHub Pages)

**Scenario:** PWA-манифест генерируется [`integration`]
- **Given** `vite-plugin-pwa` сконфигурирован в `vite.config.ts`
- **When** запускается `npm run build`
- **Then** `dist/manifest.webmanifest` существует с полями `name`, `short_name`, `start_url`, `display: standalone`
- **And** `dist/sw.js` (service worker) существует

**Scenario:** Dev-сервер стартует [`integration`]
- **Given** все конфигурационные файлы на месте
- **When** запускается `npm run dev`
- **Then** Vite dev server стартует на `localhost:5173`

## 5. Verification
| Command | Required by |
|---------|-------------|
| `npm run build` | тsk-scaffolding.directive.xml, D-008, D-015 |
| `npm run dev` | D-008 |
| `npm run preview` | D-008 |

- **Completion additions:** `npm run build` должен создавать валидный `dist/`; `npm run dev` должен запускать dev-сервер; `npm run preview` должен обслуживать production-билд.

## 6. Test Scenario Coverage
- Scenario «Успешный production-билд» → `npm run build :: exit-0` (integration)
- Scenario «PWA-манифест генерируется» → `dist/manifest.webmanifest :: exists` (integration)
- Scenario «Dev-сервер стартует» → `npm run dev :: localhost-5173` (integration)

## 7. Execution Log
*(Round = one execute-then-audit attempt. Token vocabulary + protocol in [tasks/README.md#execution-log-template](../../README.md#execution-log-template).)*

### Round 1 — 2026-05-17, initial

#### P1
- [x] `2026-05-17T14:00:05Z` recon targets=absent divergence=none
- [x] `2026-05-17T14:00:05Z` rules (none — config phase)
- [x] `2026-05-17T14:00:05Z` verified typescript@6.0.3 — tsconfig API unchanged, strict + ESNext + bundler supported
- [x] `2026-05-17T14:00:05Z` verified vite@8.0.13 — defineConfig, resolve.alias, closeBundle hook supported
- [x] `2026-05-17T14:00:05Z` verified @sveltejs/vite-plugin-svelte@7.1.2 — standard svelte() plugin import
- [x] `2026-05-17T14:00:05Z` verified vite-plugin-pwa@1.3.0 — VitePWA(), generateSW strategy, runtimeCaching via workbox
- [x] `2026-05-17T14:05:28Z` file `tsconfig.json`
- [x] `2026-05-17T14:05:28Z` file `vite.config.ts`
- [x] `2026-05-17T14:05:28Z` file `index.html`
- [x] `2026-05-17T14:07:30Z` ver `npm run build` → pass exit=0 (placeholder — `echo 'build placeholder'`, нет `dist/`)
- 🛑 `2026-05-17T14:07:30Z` BLOCKED: скрипт `build` в `package.json` — placeholder (`echo 'build placeholder'`), не запускает Vite. Для создания `dist/` и `dist/404.html` требуется `"build": "vite build"`. Обновление `package.json` вне Target Files P1 (`tsconfig.json`, `vite.config.ts`, `index.html`).
  - 🔗 axiom: AX_PHASE_SCOPE_LOCK
  - 💬 unblock: оператору добавить `"build": "vite build"` в `package.json` → scripts, либо переназначить Target Files P1 включив `package.json`.
- [x] `2026-05-17T14:13:11Z` recon targets=exists divergence=none (build-скрипт исправлен оператором — `"vite build && cp dist/index.html dist/404.html"`)
- [x] `2026-05-17T14:13:11Z` rules (none — config phase)
- [x] `2026-05-17T14:13:11Z` file `vite.config.ts` (удалён избыточный closeBundle-хук: копирование 404.html теперь в build-скрипте)
- [x] `2026-05-17T14:13:11Z` ver `npm run build` → fail exit=1 (ошибка: `Failed to resolve /src/main.ts` — entry point не существует)
- 🛑 `2026-05-17T14:13:11Z` BLOCKED: `npm run build` требует `src/main.ts` (entry point из `index.html`), но `src/` не входит в Target Files P1 (`tsconfig.json`, `vite.config.ts`, `index.html`). Создание `src/main.ts` — запись вне Target Files. Спек (§4.1 File Structure) помечает `src/` как «future — web scope».
  - 🔗 axiom: AX_PHASE_SCOPE_LOCK
  - 💬 unblock: оператору добавить `src/` в Target Files P1, либо создать `src/main.ts` в TSK-00 (web-скоп), либо перенести P1 в TSK-00 где `src/` — целевая директория. Альтернативно: ослабить Exit P1 — убрать требование `npm run build` (заменить на `npx vite build --dry-run` или проверку конфигурации через `tsc --noEmit`).

#### P1 — resume: src/main.ts + src/App.svelte теперь существуют
- [x] `2026-05-17T14:27:16Z` recon targets=exists divergence=none
- [x] `2026-05-17T14:27:16Z` rules (none — config phase)
- [x] `2026-05-17T14:27:16Z` verified typescript@6.0.3 — API без изменений, strict/ESNext/bundler/ES2022/paths работают
- [x] `2026-05-17T14:27:16Z` verified vite@8.0.13 — defineConfig, resolve.alias, svelte(), VitePWA() работают
- [x] `2026-05-17T14:27:16Z` verified @sveltejs/vite-plugin-svelte@7.1.2 — стандартный импорт svelte()
- [x] `2026-05-17T14:27:16Z` verified vite-plugin-pwa@1.3.0 — generateSW, runtimeCaching (CacheFirst для статики, NetworkFirst для API), manifest
- [x] `2026-05-17T14:29:20Z` file `tsconfig.json` (проверен — strict:true, ESNext, bundler, ES2022, paths $lib)
- [x] `2026-05-17T14:29:20Z` file `vite.config.ts` (проверен — svelte(), VitePWA(), alias $lib; 404.html через build-скрипт)
- [x] `2026-05-17T14:29:20Z` file `index.html` (проверен — SPA shell, div#app, script src=/src/main.ts)
- [x] `2026-05-17T14:29:20Z` insight `writeBundle`-хук заменён на `cp` в build-скрипте → D-012 (SPA fallback), exit criteria P1 — оператор принял решение, результат эквивалентен
- [x] `2026-05-17T14:29:20Z` ver `npm run build` → pass exit=0
- [x] `2026-05-17T14:49:00Z` ver `npm run dev` → pass (localhost:5173, Vite v8.0.13 ready)
- [x] `2026-05-17T14:49:15Z` ver `npm run preview` → pass (localhost:4173, Vite v8.0.13)
- [x] `2026-05-17T15:50:39Z` DONE
**Handoff →** artifacts: [tsconfig.json, vite.config.ts, index.html]; decisions: [module-system=esm, strict-mode=enabled, pwa-strategy=generateSW, spa-fallback=build-script-cp]; open: [H-001: svelte.config.js отсутствует — vite-plugin-svelte использует default configuration, H-002: src/lib/ не существует — пути $lib настроены но директория не создана]

#### P2
- [x] `2026-05-17T15:53:26Z` recon targets=absent divergence=none
- [x] `2026-05-17T15:53:26Z` rules (none — infra verification)
- [x] `2026-05-17T15:53:26Z` ver `npm run build` → pass exit=0
- [x] `2026-05-17T15:53:26Z` ver `npm run dev` → pass (localhost:5173, стартует без ошибок)
- [x] `2026-05-17T15:53:26Z` ver `npm run preview` → pass (HTTP 200 на /)
- [x] `2026-05-17T15:53:26Z` ver `dist/manifest.webmanifest` → pass (валидный JSON: name, short_name, start_url, display=standalone)
- [x] `2026-05-17T15:53:26Z` ver `dist/sw.js` → pass (существует)
- [x] `2026-05-17T15:53:26Z` DONE
**Handoff →** artifacts: []; decisions: [dev-server-ok=true, build-ok=true, pwa-manifest-valid=true, sw-exists=true]; open: []

#### Round close
- [x] `2026-05-17T14:35:00Z` sync infra-base+root
- [x] `2026-05-17T14:35:00Z` DONE
