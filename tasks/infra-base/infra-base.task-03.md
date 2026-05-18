# Task: TSK-03 — Конфигурация качества: Biome, lefthook, Vitest, Playwright, svelte-check

## 1. Meta
- **Task-ID:** TSK-03
- **Status:** [x] DONE
- **Purpose:** Сконфигурировать линтер/форматтер (Biome), git-hooks (lefthook), unit-тесты (Vitest), e2e-тесты (Playwright) и диагностику Svelte (svelte-check).
- **Scope:** infra-base
- **Module:** N/A
- **Dependencies:** TSK-01
- **Reopens:** 0
- **Spec References:**
  - Contract: [Decision Log D-005 (Biome), D-003 (lefthook), D-006 (Vitest), D-007 (Playwright), D-017 (svelte-check)](../../specs/infra-base/infra-base.spec.md#7-decision-log)
  - Verification Commands: [section 6](../../specs/infra-base/infra-base.spec.md#6-verification-commands)
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
- **Objective:** Создать `biome.json`, `lefthook.yml`, `vitest.config.ts` (отдельный файл, не модифицирует `vite.config.ts` — избегает гонки с TSK-02), `playwright.config.ts`. Настроить `svelte-check`.
- **Rules:**
  *(config phase — coding rules не активируются. Конфигурация руководствуется спецификацией infra-base.)*
- **Target Files:**
  - `biome.json`
  - `lefthook.yml`
  - `vitest.config.ts`
  - `playwright.config.ts`
- **Inputs:** none
- **Exit:**
  - `biome.json`: linter rules (recommended), formatter (indent 2, semicolons always, single quotes), `include: ["src/**", "tests/**"]`
  - `lefthook.yml`: pre-commit хук — `biome check --write` (staged), `tsc --noEmit`, `vitest run --changed`
  - `vitest.config.ts`: отдельный файл (не модифицирует `vite.config.ts` во избежание гонки с TSK-02). test-окружение `jsdom`, include `src/**/*.test.ts`
  - `playwright.config.ts`: testDir `tests/`, webServer `npm run dev`, browsers `[chromium, firefox, webkit]`
  - `svelte-check` работает: `npx svelte-check --tsconfig ./tsconfig.json` завершается без ошибок (пока нет .svelte-файлов — expected 0 errors)

### P2 — test
- **Objective:** Проверить, что все сконфигурированные инструменты запускаются и парсят свои конфиги без ошибок. Создать фикстуры для проверки.
- **Rules:**
  - [vitest-rules](../../ai/directives/testing/vitest-rules.xml) — если создаются тестовые файлы
  - [playwright-e2e](../../ai/directives/testing/playwright-e2e.xml) — если создаются e2e-файлы
- **Target Files:**
  - `src/smoke.test.ts` (smoke-тест Vitest: `expect(true).toBe(true)`)
  - `tests/smoke.e2e.ts` (smoke-тест Playwright: открыть `/` → ожидать 200, `<div id="app">`)
- **Inputs:** P1 handoff
- **Exit:**
  - `npx biome check` → без ошибок (или expected errors на отсутствующих исходниках)
  - `npx lefthook run pre-commit` → проходит все хуки
  - `npx vitest run` → smoke-тест проходит
  - `npx playwright test` → smoke-тест проходит
  - `npx svelte-check` → без ошибок

## 4. Acceptance Criteria (BDD)
Contract: [infra-base spec 2 Tool Stack, 6 Verification Commands](../../specs/infra-base/infra-base.spec.md)

**Feature:** Линтинг и форматирование через Biome

**Scenario:** Biome проверяет код без ошибок [`integration`]
- **Given** `biome.json` создан
- **When** запускается `npx biome check`
- **Then** команда завершается без ошибок (или с known-ошибками при отсутствии исходников)
- **And** `npx biome format --write` не ломает файлы

**Feature:** Pre-commit хуки через lefthook

**Scenario:** Pre-commit блокирует коммит с ошибками [`integration`]
- **Given** `lefthook.yml` сконфигурирован (biome + typecheck + vitest)
- **When** запускается `npx lefthook run pre-commit`
- **Then** хуки выполняются и возвращают результат

**Feature:** Unit-тесты через Vitest

**Scenario:** Smoke-тест проходит [`integration`]
- **Given** `vitest.config.ts` создан
- **When** запускается `npx vitest run`
- **Then** smoke-тест `expect(true).toBe(true)` проходит с exit code 0

**Feature:** E2E-тесты через Playwright

**Scenario:** Smoke e2e-тест проходит [`e2e`]
- **Given** `playwright.config.ts` создан, dev-сервер запущен
- **When** запускается `npx playwright test`
- **Then** smoke-тест открывает `/`, находит `<div id="app">`, exit code 0

**Feature:** Svelte-диагностика

**Scenario:** svelte-check без .svelte-файлов [`integration`]
- **Given** `tsconfig.json` существует
- **When** запускается `npx svelte-check --tsconfig ./tsconfig.json`
- **Then** завершается без ошибок (0 файлов для проверки)

## 5. Verification
| Command | Required by |
|---------|-------------|
| `npx biome check` | D-005 |
| `npx lefthook run pre-commit` | D-003 |
| `npx vitest run` | vitest-rules, D-006 |
| `npx playwright test` | playwright-e2e, D-007 |
| `npx svelte-check --tsconfig ./tsconfig.json` | D-017 |

- **Completion additions:** Smokes: `vitest run` и `playwright test` должны выдавать минимум 1 passing test каждый.

## 6. Test Scenario Coverage
- Scenario «Biome проверяет код» → `npx biome check :: exit-0` (integration)
- Scenario «Pre-commit блокирует коммит» → `npx lefthook run pre-commit :: passes` (integration)
- Scenario «Smoke-тест Vitest» → `src/smoke.test.ts :: smoke-passes` (unit)
- Scenario «Smoke e2e-тест» → `tests/smoke.e2e.ts :: app-loads` (e2e)
- Scenario «svelte-check» → `npx svelte-check :: exit-0` (integration)

## 7. Execution Log
*(Round = one execute-then-audit attempt. Token vocabulary + protocol in [tasks/README.md#execution-log-template](../../README.md#execution-log-template).)*

### Round 1 — 2026-05-17, initial

#### P1
- [x] `2026-05-17T14:00:26Z` recon targets=lefthook.yml=exists, biome.json=absent, vitest.config.ts=absent, playwright.config.ts=absent divergence=none
- [x] `2026-05-17T14:00:26Z` rules (none — config phase)
- [x] `2026-05-17T14:02:45Z` file `biome.json`
- [x] `2026-05-17T14:02:45Z` file `lefthook.yml`
- [x] `2026-05-17T14:02:45Z` file `vitest.config.ts`
- [x] `2026-05-17T14:02:45Z` file `playwright.config.ts`
- [x] `2026-05-17T14:02:45Z` verified lefthook@2.1.6 config syntax via schema.json — pre-commit/jobs/parallel
- [x] `2026-05-17T14:02:45Z` verified vitest@4.1.6 config API — defineConfig from vitest/config, test.environment='jsdom', test.include
- [x] `2026-05-17T14:02:45Z` verified @playwright/test@1.60.0 config API — defineConfig, testDir, webServer, projects
- [x] `2026-05-17T14:02:45Z` verified svelte-check@4.4.8 CLI — --tsconfig flag confirmed via local README
- [x] `2026-05-17T14:07:23Z` insight установлен неверный npm-пакет `biome@0.3.3` (менеджер переменных окружения), а не `@biomejs/biome` (линтер/форматтер, D-005). `npx biome check` завершился с exit=0, но вызывал другой инструмент → spec D-005, package.json devDependencies
- [x] `2026-05-17T14:07:23Z` ver `npx biome check` → fail exit=0 (false-positive: вызван неверный пакет biome@0.3.3 вместо @biomejs/biome)
- [x] `2026-05-17T14:07:23Z` ver `npx svelte-check --tsconfig ./tsconfig.json` → pass exit=0 (0 errors, 1 warning: no .svelte files — expected)
- [x] `2026-05-17T14:07:23Z` DONE
**Handoff →** artifacts: [`biome.json`, `lefthook.yml`, `vitest.config.ts`, `playwright.config.ts`]; decisions: [biome-package-is-wrong=biome@0.3.3-not-@biomejs/biome, vitest-config-separate-file=true, playwright-browsers=chromium+firefox+webkit, lefthook-pre-commit=biome+tsc+vitest-changed-parallel-false, svelte-check=passes-exit-0]; open: [D-005-blocked: в package.json установлен неверный пакет `biome@0.3.3` (менеджер env), требуется `@biomejs/biome` — заменить в devDependencies и переустановить]

#### P2
- [x] `2026-05-17T14:12:16Z` recon targets=src=absent,tests=absent divergence=none
- [x] `2026-05-17T14:12:16Z` rules vitest-rules, playwright-e2e
- [x] `2026-05-17T14:15:00Z` insight dev-скрипт был плейсхолдером `echo 'dev server placeholder'`, заменён на `vite` — необходим для playwright webServer → spec D-007, package.json scripts
- [x] `2026-05-17T14:16:00Z` insight `@biomejs/biome@2.4.15` установлен взамен ошибочного `biome@0.3.3`; `biome.json` мигрирован командой `npx biome migrate` (схема 2.3.11→2.4.15, `files.include`→`files.includes`) → spec D-005
- [x] `2026-05-17T14:19:00Z` insight `playwright.config.ts` (P1 артефакт): отсутствовали `testMatch` (файлы `.e2e.ts` не находились) и `use.baseURL` (page.goto('/') падал) — добавлены → spec D-007
- [x] `2026-05-17T14:19:00Z` insight `jsdom` отсутствовал в devDependencies при `environment: 'jsdom'` в vitest.config.ts (P1 артефакт) — установлен → spec D-006
- [x] `2026-05-17T14:17:50Z` file `src/smoke.test.ts`
- [x] `2026-05-17T14:17:50Z` test `tests/smoke.e2e.ts`
- [x] `2026-05-17T14:17:50Z` cov «Smoke-тест Vitest» → `src/smoke.test.ts :: smoke-passes`
- [x] `2026-05-17T14:20:57Z` cov «Smoke e2e-тест» → `tests/smoke.e2e.ts :: app-loads`
- [x] `2026-05-17T14:20:00Z` ver `npx biome check` → pass exit=0
- [x] `2026-05-17T14:20:00Z` ver `npx vitest run` → pass exit=0
- [x] `2026-05-17T14:20:57Z` ver `npx playwright test` → pass exit=0
- [x] `2026-05-17T14:17:50Z` ver `npx svelte-check --tsconfig ./tsconfig.json` → pass exit=0
- [x] `2026-05-17T14:21:00Z` ver `npx lefthook run pre-commit` → pass exit=0
- [x] `2026-05-17T14:22:33Z` DONE
**Handoff →** artifacts: [`src/smoke.test.ts`, `tests/smoke.e2e.ts`]; decisions: [biome-package-fixed=@biomejs/biome@2.4.15, biome-config-migrated=true, playwright-config-extended=testMatch+baseURL, jsdom-installed=true]; open: []

#### Round close
- [x] `2026-05-17T14:25:00Z` sync infra-base+root
- [x] `2026-05-17T14:25:00Z` DONE
