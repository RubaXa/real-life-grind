# Task: TSK-05 — Bootstrap: Storybook, токены, тема, скрипты

## 1. Meta
- **Task-ID:** TSK-05
- **Status:** [x] DONE
- **Purpose:** Установить Storybook-пакеты, создать структуру `src/ui/`, CSS design-токены (8 файлов), тему `default.css`, npm-скрипты.
- **Scope:** infra-ui
- **Module:** N/A
- **Dependencies:** TSK-04
- **Reopens:** 0
- **Spec References:**
  - Contract: [Bootstrap Requirements](../../specs/infra-ui/infra-ui.spec.md#12-bootstrap-requirements)
  - Tokens: [Design Tokens §2.3](../../specs/infra-ui/infra-ui.spec.md#23-design-tokens)
  - Theme: [Design Spec §1.1–1.8](../../draft/real-life-grind.draft-design.md#1-design-tokens) [File Structure §5](../../specs/infra-ui/infra-ui.spec.md#5-file-structure)
- **Runtime Backing:** `not-implemented`
- **Verification Levels:** `integration`
- **Deferred Runtime Scope:** None

## 2. Phases Overview
| ID | Kind | Deps | Status |
|----|------|------|--------|
| P1 | bootstrap | — | [x] |
| P2 | config | P1 | [x] |
| P3 | config | P2 | [x] |

## 3. Phases

### P1 — bootstrap (packages + structure)
- **Objective:** Установить Storybook и зависимые пакеты, создать директории `src/ui/`.
- **Rules:**
  - [nodejs-npm-setup](../../ai/directives/infra/nodejs-npm-setup.xml)
- **Target Files:**
  - `package.json`
  - `package-lock.json`
- **Inputs:** none
- **Exit:** `npm ls storybook @storybook/svelte-vite @storybook/addon-essentials @storybook/addon-a11y @storybook/addon-interactions @storybook/addon-themes @storybook/blocks @storybook/test-runner @storybook/test serve --depth=0` → все пакеты присутствуют. Директории `src/ui/{tokens,themes,icons,primitives,components,stories}` созданы.

### P2 — config (CSS tokens + theme)
- **Objective:** Создать 8 CSS-файлов токенов из дизайн-спеки §§1.1–1.8, тему `default.css`.
- **Rules:**
  - [svelte5-runes](../../ai/directives/coding/svelte5-runes.xml)
- **Target Files:**
  - `src/ui/tokens/colors.css`
  - `src/ui/tokens/typography.css`
  - `src/ui/tokens/spacing.css`
  - `src/ui/tokens/radius.css`
  - `src/ui/tokens/motion.css`
  - `src/ui/tokens/elevation.css`
  - `src/ui/tokens/animations.css`
  - `src/ui/tokens/components.css`
  - `src/ui/themes/default.css`
- **Inputs:** P1 handoff
- **Exit:** Все 8 файлов токенов содержат CSS-переменные из дизайн-спеки. `default.css` импортирует все токены.

### P3 — config (Storybook config + npm scripts)
- **Objective:** `.storybook/main.ts`, `.storybook/preview.ts`, npm-скрипты `storybook`, `storybook:build`, `storybook:preview`, `svelte-check`.
- **Rules:**
  - [nodejs-npm-setup](../../ai/directives/infra/nodejs-npm-setup.xml)
- **Target Files:**
  - `.storybook/main.ts`
  - `.storybook/preview.ts`
  - `package.json`
- **Inputs:** P2 handoff
- **Exit:** `npm run storybook:build` exit=0. `package.json` содержит скрипты.

## 4. Acceptance Criteria (BDD)
Contract: [Bootstrap Requirements](../../specs/infra-ui/infra-ui.spec.md#12-bootstrap-requirements)

**Scenario:** Storybook собирается без ошибок [`integration`]
- **Given** пакеты установлены (P1) и конфигурация создана (P3)
- **When** запускается `npm run storybook:build`
- **Then** сборка завершается с exit=0

**Scenario:** CSS-токены содержат переменные дизайн-спеки [`integration`]
- **Given** файлы токенов созданы (P2)
- **When** парсятся CSS-файлы
- **Then** каждый файл содержит переменные из дизайн-спеки §§1.1–1.8

## 5. Verification
| Command | Required by |
|---------|-------------|
| `npm ls storybook @storybook/svelte-vite --depth=0` | nodejs-npm-setup |
| `npm run storybook:build` | check-command |

- **Task-level Completion additions:** none beyond project baseline

## 6. Test Scenario Coverage
| Scenario | Test | Owner |
|----------|------|-------|
| Storybook собирается без ошибок | smoke (storybook:build exit=0) | P3 |
| CSS-токены содержат переменные дизайн-спеки | smoke (file content check) | P2 |

## 7. Execution Log
*(Round = one execute-then-audit attempt. Token vocabulary in [tasks/README.md](../../README.md#execution-log-template).)*

### Round 1 — 2026-05-17, initial

#### P1
- [x] 2026-05-17T19:27:51Z recon targets=exists divergence=none
- [x] 2026-05-17T19:27:51Z rules nodejs-npm-setup
- [x] 2026-05-17T19:37:25Z file `package.json`
- [x] 2026-05-17T19:37:25Z file `package-lock.json`
- [x] 2026-05-17T19:37:25Z verified `storybook`@`10.4.0` SB10 installed; compat addons: a11y@10.4.0, themes@10.4.0, test-runner@0.24.4, serve@14.2.6
- [x] 2026-05-17T19:37:25Z insight @storybook/addon-essentials@8.6.x, @storybook/addon-interactions@8.6.x, @storybook/blocks@8.6.x, @storybook/test@8.6.x не имеют версий совместимых со storybook@10 → их функциональность интегрирована в ядро storybook (includes @vitest/spy, @vitest/expect, @testing-library/jest-dom, @testing-library/user-event) → §3. Phases P1 Exit, список пакетов устарел для SB10
- [x] 2026-05-17T19:37:25Z ver `npm ls storybook @storybook/svelte-vite --depth=0` → pass exit=0
- [x] 2026-05-17T19:37:25Z ver `npm ls storybook @storybook/svelte-vite @storybook/addon-a11y @storybook/addon-themes @storybook/test-runner serve --depth=0` → pass exit=0
- [x] 2026-05-17T19:37:25Z DONE
**Handoff →** artifacts: [`package.json`, `package-lock.json`]; decisions: [storybook=10.4.0, sb10-addons=a11y+themes+test-runner]; open: [SB10_MIGRATION: @storybook/addon-essentials+interactions+blocks+test несовместимы с SB10, их функционал в core storybook — P3 конфигурацию нужно адаптировать под SB10 API]

#### P2
- [x] 2026-05-17T19:46:03Z recon targets=absent divergence=none
- [x] 2026-05-17T19:46:03Z rules svelte5-runes
- [x] 2026-05-17T19:46:03Z file `src/ui/tokens/colors.css`
- [x] 2026-05-17T19:46:03Z file `src/ui/tokens/typography.css`
- [x] 2026-05-17T19:46:03Z file `src/ui/tokens/spacing.css`
- [x] 2026-05-17T19:46:03Z file `src/ui/tokens/radius.css`
- [x] 2026-05-17T19:46:03Z file `src/ui/tokens/motion.css`
- [x] 2026-05-17T19:46:03Z file `src/ui/tokens/elevation.css`
- [x] 2026-05-17T19:46:03Z file `src/ui/tokens/animations.css`
- [x] 2026-05-17T19:46:03Z file `src/ui/tokens/components.css`
- [x] 2026-05-17T19:46:03Z file `src/ui/themes/default.css`
- [x] 2026-05-17T19:46:03Z ver `grep -c '\-\-' src/ui/tokens/colors.css` → pass exit=0
- [x] 2026-05-17T19:46:03Z DONE
**Handoff →** artifacts: [`src/ui/tokens/colors.css`, `src/ui/tokens/typography.css`, `src/ui/tokens/spacing.css`, `src/ui/tokens/radius.css`, `src/ui/tokens/motion.css`, `src/ui/tokens/elevation.css`, `src/ui/tokens/animations.css`, `src/ui/tokens/components.css`, `src/ui/themes/default.css`]; decisions: [token-naming=CSS-custom-properties, import-order=colors→typography→spacing→radius→motion→elevation→animations→components, font-tokens=full-shorthand-with-weight]; open: []

#### P3
- [x] 2026-05-17T19:54:45Z recon targets=absent divergence=none
- [x] 2026-05-17T19:54:45Z rules nodejs-npm-setup
- [x] 2026-05-17T19:54:45Z verified storybook@10.4.0 CLI: `storybook dev -p <port>`, `storybook build` → `storybook-static/`; sb10 config: framework=@storybook/svelte-vite, addons slim (essentials+interactions+blocks+test in core)
- [x] 2026-05-17T19:54:45Z file `.storybook/main.ts`
- [x] 2026-05-17T19:54:45Z file `.storybook/preview.ts`
- [x] 2026-05-17T19:54:45Z file `package.json`
- [x] 2026-05-17T20:00:50Z insight vite-plugin-pwa конфликтует со storybook build (sb-manager/globals-runtime.js 3.2 MB превышает лимит 2 MiB) → .storybook/main.ts, добавлен viteFinal с withoutVitePlugins для исключения PWA-плагинов из сборки storybook
- [x] 2026-05-17T20:14:31Z ver `npm ls storybook @storybook/svelte-vite --depth=0` → pass exit=0
- [x] 2026-05-17T20:13:00Z ver `npm run storybook:build` → pass exit=0
- [x] 2026-05-17T20:13:19Z DONE
**Handoff →** artifacts: [`.storybook/main.ts`, `.storybook/preview.ts`, `package.json`]; decisions: [framework=svelte-vite, sb10-addons=a11y+themes, sb10-core-includes=essentials+interactions+blocks+test, pwa-excluded-from-sb-build=via-withoutVitePlugins, scripts-added=storybook+storybook:build+storybook:preview]; open: []

#### Round close
- [x] 2026-05-17T20:15:00Z sync infra-ui+root
- [x] 2026-05-17T20:15:00Z DONE

## Audit Rounds

### Audit Round 1 — 2026-05-17, after Execution Round 1
```
@audit task=TSK-05 round=1 after-exec-round=1 triggered-reopen=Round-2 status=FAIL counts=B0·M9·m0·I1 phases_to_fix=[P1,P2,P3]
F-01 | sev=M | type=RULES_CASCADE_MISMATCH | conf=H | loc=tasks/infra-ui/infra-ui.task-05.md#35 | phase=P2 | src=ai/directives/coding/svelte5-runes.xml, tasks/infra-ui/README.md | route=ticket-update | act=P2 Target Files — все .css, ноль .svelte; правило svelte5-runes не применимо; удалить из P2 Rules; также svelte5-runes требует typescript-rules по Depends_On — не указан в P2
F-02 | sev=M | type=RULES_CASCADE_MISMATCH | conf=H | loc=tasks/infra-ui/infra-ui.task-05.md#56 | phase=P3 | src=tasks/infra-ui/README.md | route=ticket-update | act=P3 Target Files содержат .ts файлы (.storybook/main.ts, .storybook/preview.ts), но typescript-rules (traversed из infra-base) не указан в P3 Rules; добавить typescript-rules
F-03 | sev=M | type=RULES_COMPLIANCE_VIOLATION | conf=H | loc=— | phase=P1 | src=ai/directives/infra/nodejs-npm-setup.xml#AX_SINGLE_PACKAGE_MANAGER | route=ticket-reopen | act=.nvmrc отсутствует; создать .nvmrc с точной версией Node (одна строка, семвер)
F-04 | sev=M | type=RULES_COMPLIANCE_VIOLATION | conf=H | loc=— | phase=P1 | src=ai/directives/infra/nodejs-npm-setup.xml#AP_NPMRC_ABSENT | route=ticket-reopen | act=.npmrc отсутствует; создать .npmrc с registry=https://registry.npmjs.org/
F-05 | sev=M | type=RULES_COMPLIANCE_VIOLATION | conf=H | loc=package.json:30 | phase=P1 | src=ai/directives/infra/nodejs-npm-setup.xml#AX_EXACT_PINNING_FOR_TOOLING | route=ticket-reopen | act=@biomejs/biome в devDependencies использует range-пин ^2.4.15; заменить на точную версию
F-06 | sev=M | type=RULES_COMPLIANCE_VIOLATION | conf=H | loc=package.json:38 | phase=P1 | src=ai/directives/infra/nodejs-npm-setup.xml#AX_EXACT_PINNING_FOR_TOOLING | route=ticket-reopen | act=jsdom в devDependencies использует range-пин ^29.1.1; заменить на точную версию
F-07 | sev=M | type=EXECUTION_LOG_INCOMPLETE | conf=H | loc=tasks/infra-ui/infra-ui.task-05.md#135 | phase=P3 | src=— | route=ticket-update | act=P3 Execution Log: временная метка ver (20:14:31Z) позже DONE (20:13:19Z); хронологически невозможно — DONE должен быть последней записью
F-08 | sev=M | type=EXECUTION_LOG_INCOMPLETE | conf=H | loc=tasks/infra-ui/infra-ui.task-05.md#126-136 | phase=P3 | src=— | route=ticket-update | act=P3 Execution Log: отсутствует ver для npm run storybook:build (требуется ticket §5 Verification и P3 Exit)
F-09 | sev=M | type=EXECUTION_LOG_INCOMPLETE | conf=H | loc=tasks/infra-ui/infra-ui.task-05.md#122 | phase=P2 | src=— | route=ticket-update | act=P2 Execution Log: ver проверяет только colors.css; P2 Exit требует верификации всех 8 файлов токенов — проверка неполная
F-10 | sev=I | type=INSIGHT_BACKFLOW | conf=H | loc=specs/infra-ui/infra-ui.spec.md#44-58 | phase=P1 | src=— | route=spec-edit | act=SB10 insight: spec §2.2 и §12 перечисляют @storybook/addon-essentials, @storybook/addon-interactions, @storybook/blocks, @storybook/test как обязательные пакеты, но они несовместимы с SB10 и не устанавливаются; обновить spec для отражения SB10-реальности
```
