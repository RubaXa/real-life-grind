# Task: TSK-01 — Bootstrap: npm-проект, зависимости, .gitignore

## 1. Meta
- **Task-ID:** TSK-01
- **Status:** [x] DONE
- **Purpose:** Инициализировать npm-проект, установить все зависимости, настроить VCS-игнорирование и версию Node.js.
- **Scope:** infra-base
- **Module:** N/A
- **Dependencies:** None
- **Reopens:** 0
- **Spec References:**
  - Contract: [Bootstrap Requirements](../../specs/infra-base/infra-base.spec.md#9-bootstrap-requirements) — npm, Node.js, все пакеты
  - Constraints: [File Structure](../../specs/infra-base/infra-base.spec.md#4-file-structure)
- **Runtime Backing:** `not-implemented` (инициализация проекта, не рантайм)
- **Verification Levels:** `integration`
- **Deferred Runtime Scope:** None

## 2. Phases Overview
| ID | Kind | Deps | Status |
|----|------|------|--------|
| P1 | bootstrap | — | [x] |
| P2 | config | P1 | [x] |

## 3. Phases

### P1 — bootstrap
- **Objective:** Инициализировать npm-проект, установить все production и dev-зависимости, установить браузеры Playwright, создать `.node-version` и `.gitignore`.
- **Rules:**
  - [nodejs-npm-setup](../../ai/directives/infra/nodejs-npm-setup.xml)
  - [git-setup](../../ai/directives/infra/git-setup.xml)
- **Target Files:**
  - `package.json`
  - `package-lock.json`
  - `.node-version`
  - `.gitignore`
- **Inputs:** none
- **Exit:**
  - `npm --version` → 10.x
  - `node --version` → 22.x
  - `npm ci` завершается без ошибок
  - `npm ls --depth=0` показывает все ожидаемые пакеты:
    - prod: `svelte`, `melt`, `dexie`, `firebase`
    - dev: `typescript`, `vite`, `@sveltejs/vite-plugin-svelte`, `vite-plugin-pwa`, `biome`, `vitest`, `@playwright/test`, `svelte-check`, `lefthook`, `firebase-tools`
  - `npx playwright install` → браузеры установлены
  - `.gitignore` содержит: `node_modules`, `dist`, `.firebase`, `coverage`, `.env`, `*.local`
  - `.node-version` содержит `22`

### P2 — config
- **Objective:** Сконфигурировать `package.json`: engines (node >=22), type (module), базовые скрипты-заглушки (dev, build, check — будут дополнены в TSK-04).
- **Rules:**
  - [nodejs-npm-setup](../../ai/directives/infra/nodejs-npm-setup.xml)
- **Target Files:**
  - `package.json` (дополнить)
- **Inputs:** P1 handoff
- **Exit:**
  - `package.json` содержит `"engines": { "node": ">=22" }`
  - `package.json` содержит `"type": "module"`
  - `package.json` содержит скрипты-заглушки: `dev`, `build`, `preview`, `check`, `ci-check`, `typecheck`, `svelte-check`, `test`, `test:e2e`, `lint`, `format`

## 4. Acceptance Criteria (BDD)
Contract: [infra-base spec 9 Bootstrap Requirements](../../specs/infra-base/infra-base.spec.md#9-bootstrap-requirements)

**Feature:** Bootstrap npm-проекта

**Scenario:** Инициализация с нуля [`integration`]
- **Given** пустая директория
- **When** выполняются P1 и P2
- **Then** `package.json` существует с корректными `engines`, `type`, `scripts`
- **And** `package-lock.json` существует (детерминированные installs)
- **And** `npm ci` завершается без ошибок
- **And** все ожидаемые пакеты присутствуют в `node_modules`

**Scenario:** VCS-игнорирование [`integration`]
- **Given** `.gitignore` создан
- **When** запускается `git status`
- **Then** `node_modules`, `dist`, `.firebase`, `coverage`, `.env` не отслеживаются

**Scenario:** Версионирование Node.js [`integration`]
- **Given** `.node-version` содержит `22`
- **When** `node --version` вызывается
- **Then** мажорная версия = 22

## 5. Verification
| Command | Required by |
|---------|-------------|
| `npm --version` | nodejs-npm-setup |
| `node --version` | nodejs-npm-setup |
| `npm ci` | nodejs-npm-setup |
| `npm ls --depth=0` | nodejs-npm-setup |
| `git status` | git-setup |

- **Completion additions:** `npm ls` должен подтвердить наличие всех пакетов из Exit-критерия P1; `git status` должен подтвердить, что игнорируемые пути не показываются как untracked.

## 6. Test Scenario Coverage
- Scenario «Инициализация с нуля» → `package.json :: engines+type+scripts` (integration, проверяется через `npm ls` в секции 5 Verification)
- Scenario «VCS-игнорирование» → `.gitignore :: git-status-clean` (integration, проверяется через `git status`)
- Scenario «Версионирование Node.js» → `.node-version :: node-22` (integration, проверяется через `node --version`)

## 7. Execution Log
*(Round = one execute-then-audit attempt. Per-phase blocks within a Round; Round closes after audit. Token vocabulary + protocol in [tasks/README.md#execution-log-template](../../README.md#execution-log-template).)*

### Round 1 — 2026-05-17, initial

#### P1
- [x] `2026-05-17T13:10:59Z` recon targets=absent divergence=none
- [x] `2026-05-17T13:10:59Z` rules nodejs-npm-setup, git-setup
- [x] `2026-05-17T13:11:00Z` file `package.json`
- [x] `2026-05-17T13:11:00Z` file `.node-version`
- [x] `2026-05-17T13:11:00Z` file `.gitignore`
- [x] `2026-05-17T13:11:00Z` file `package-lock.json`
- [x] `2026-05-17T13:25:00Z` ver `npm --version` → pass exit=0
- [x] `2026-05-17T13:25:00Z` ver `node --version` → pass exit=0
- [x] `2026-05-17T13:25:00Z` ver `npm ci` → pass exit=0
- [x] `2026-05-17T13:25:00Z` ver `npm ls --depth=0` → pass exit=0
- [x] `2026-05-17T13:25:00Z` ver `npx playwright install` → pass exit=0
- [x] `2026-05-17T13:25:00Z` ver `git status` → pass exit=0
- [x] `2026-05-17T13:25:00Z` DONE
**Handoff →** artifacts: [`package.json`, `package-lock.json`, `.node-version`, `.gitignore`]; decisions: [idempotency=git-repo-initialized, node-version=22.19.0, npm-version=10.9.3]; open: []

#### P2
- [x] `2026-05-17T13:38:36Z` recon targets=exists divergence=none
- [x] `2026-05-17T13:38:36Z` rules nodejs-npm-setup
- [x] `2026-05-17T13:40:00Z` verified npm@10.9.3 engines / type / scripts — core package.json fields, stable since npm v2
- [x] `2026-05-17T13:40:00Z` file `package.json`
- [x] `2026-05-17T13:40:00Z` insight Ticket P2 Exit предписывает engines ">=22", правило STEP_2_INIT_PACKAGE_JSON требует ">=22.0.0 <23.0.0" для выравнивания с .node-version=22 → ticket §3 P2 Exit
- [x] `2026-05-17T13:40:00Z` ver `npm --version` → pass exit=0
- [x] `2026-05-17T13:40:00Z` ver `node --version` → pass exit=0
- [x] `2026-05-17T13:40:23Z` ver `npm ci` → pass exit=0
- [x] `2026-05-17T13:41:30Z` ver `npm ls --depth=0` → pass exit=0
- [x] `2026-05-17T13:42:15Z` DONE
**Handoff →** artifacts: [`package.json`]; decisions: [type=module, engines=node>=22.0.0_<23.0.0, scripts=11_stubs_(dev/build/preview/check/ci-check/typecheck/svelte-check/test/test:e2e/lint/format)]; open: []

#### Round close
- [x] `2026-05-17T13:45:00Z` sync infra-base+root
- [x] `2026-05-17T13:45:00Z` DONE
