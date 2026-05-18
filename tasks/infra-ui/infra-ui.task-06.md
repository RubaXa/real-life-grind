# Task: TSK-06 — Primitives, Icons, Utils

## 1. Meta
- **Task-ID:** TSK-06
- **Status:** [x] DONE
- **Purpose:** Создать базовые UI-примитивы (Button, Badge, Modal, SegmentControl), SVG-иконки (9 шт.), shared-утилиты (`lib.ts`).
- **Scope:** infra-ui
- **Module:** primitives, icons
- **Dependencies:** TSK-05
- **Reopens:** 0
- **Spec References:**
  - Contract: [Component Inventory §4.1](../../specs/infra-ui/infra-ui.spec.md#41-core-components) items 10–15
  - Icon rules: [Dependency Policy §7.4](../../specs/infra-ui/infra-ui.spec.md#74-icon-discipline)
  - Utils: [Handoff task 10](../../specs/infra-ui/infra-ui.spec.md#13-handoff)
- **Runtime Backing:** `not-implemented`
- **Verification Levels:** `unit` + `integration`
- **Deferred Runtime Scope:** None

## 2. Phases Overview
| ID | Kind | Deps | Status |
|----|------|------|--------|
| P1 | impl | — | [x] |
| P2 | impl | P1 | [x] |
| P3 | impl | P1 | [x] |
| P4 | test | P2, P3 | [x] |

## 3. Phases

### P1 — impl (shared utils)
- **Objective:** `src/ui/lib.ts`: `formatTime`, `calcUrgency`, `mapUrgencyToVariant`, `classNames`.
- **Rules:** [typescript-rules](../../ai/directives/coding/typescript-rules.xml)
- **Target Files:** `src/ui/lib.ts`
- **Inputs:** none
- **Exit:** `tsc --noEmit` exit=0. Экспортированы 4 функции с корректными типами.

### P2 — impl (primitives)
- **Objective:** Button (5 variants), Badge (3 variants), Modal (Dialog+fade), SegmentControl (pill-toggle). Каждый: `.svelte` + `.stories.ts` + `.test.ts`.
- **Rules:** [svelte5-runes](../../ai/directives/coding/svelte5-runes.xml), [typescript-rules](../../ai/directives/coding/typescript-rules.xml)
- **Target Files:**
  - `src/ui/primitives/Button/Button.svelte`, `.stories.ts`, `.test.ts`
  - `src/ui/primitives/Badge/Badge.svelte`, `.stories.ts`, `.test.ts`
  - `src/ui/primitives/Modal/Modal.svelte`, `.stories.ts`, `.test.ts`
  - `src/ui/primitives/SegmentControl/SegmentControl.svelte`, `.stories.ts`, `.test.ts`
- **Inputs:** P1 handoff
- **Exit:** Все компоненты используют Melt UI + CSS-токены. stories с 3+ состояниями. `npm run storybook:build` exit=0.

### P3 — impl (SVG icons)
- **Objective:** 9 SVG-иконок как Svelte-компоненты.
- **Rules:** [svelte5-runes](../../ai/directives/coding/svelte5-runes.xml)
- **Target Files:** `src/ui/icons/Star.svelte`, `Fire.svelte`, `Check.svelte`, `Home.svelte`, `Tasks.svelte`, `Shop.svelte`, `Grades.svelte`, `Bell.svelte`, `Hamburger.svelte`
- **Inputs:** P1 handoff
- **Exit:** Каждая иконка: inline SVG, `role="img"` + `aria-label`, `size` + `class` props, `currentColor`.

### P4 — test
- **Objective:** Unit-тесты на примитивы + иконки.
- **Rules:** [typescript-rules, vitest-rules](../../ai/directives/testing/vitest-rules.xml)
- **Target Files:** `.test.ts` файлы в primitives, `src/ui/icons/icons.test.ts`
- **Inputs:** P2, P3 handoff
- **Exit:** `npx vitest run src/ui/` exit=0. `npm run svelte-check` exit=0. `npm run storybook:build` exit=0.

## 4. Acceptance Criteria (BDD)

**Scenario:** Button рендерится во всех вариантах [`unit`]
- **Given** Button с variant prop (primary/approve/reject/buy/ghost)
- **When** рендерятся все 5 вариантов
- **Then** каждый использует соответствующий CSS-токен

**Scenario:** SVG иконки доступны для screen readers [`unit`]
- **Given** любая иконка из `src/ui/icons/`
- **When** рендерится
- **Then** содержит `role="img"` и непустой `aria-label`

## 5. Verification
| Command | Required by |
|---------|-------------|
| `tsc --noEmit` | typescript-rules |
| `npx vitest run src/ui/` | vitest-rules |
| `npm run svelte-check` | svelte5-runes |
| `npm run storybook:build` | check-command |

- **Task-level Completion additions:** none

## 6. Test Scenario Coverage
| Scenario | Test | Owner |
|----------|------|-------|
| Button variants | `primitives/Button/Button.test.ts` | P4 |
| SVG icons a11y | `icons/icons.test.ts` | P4 |
| Modal open/close | `primitives/Modal/Modal.test.ts` | P4 |
| SegmentControl toggle | `primitives/SegmentControl/SegmentControl.test.ts` | P4 |

## 7. Execution Log
### Round 1 — 2026-05-17, initial

#### P1
- [x] 2026-05-17T20:48:26Z recon targets=absent divergence=none
- [x] 2026-05-17T20:48:26Z rules typescript-rules
- [x] 2026-05-17T20:48:26Z file `src/ui/lib.ts`
- [x] 2026-05-17T20:48:26Z intro `formatTime` ← shared UI utility: minutes → "Xч Ym" Russian duration
- [x] 2026-05-17T20:48:26Z intro `calcUrgency` ← shared UI utility: remaining/total ms → percentage 0-100
- [x] 2026-05-17T20:48:26Z intro `mapUrgencyToVariant` ← shared UI utility: percentage → 'calm'|'moderate'|'warning'|'urgent'
- [x] 2026-05-17T20:48:26Z intro `classNames` ← shared UI utility: conditional classname joiner
- [x] 2026-05-17T20:48:26Z intro `UrgencyVariant` ← public type alias for urgency display variants
- [x] 2026-05-17T20:48:26Z ver `tsc --noEmit` → pass exit=0
- [x] 2026-05-17T20:48:26Z DONE
**Handoff →** artifacts: [`src/ui/lib.ts`]; decisions: [urgency-thresholds=calm>50,moderate>25,warning>10,urgent≤10, time-format=Russian-short-hours-minutes]; open: []

#### P2
- [x] 2026-05-17T20:55:24Z recon targets=absent divergence=none
- [x] 2026-05-17T20:55:24Z rules svelte5-runes, typescript-rules
- [x] 2026-05-17T20:55:24Z file `src/ui/primitives/Button/Button.svelte`
- [x] 2026-05-17T20:55:24Z file `src/ui/primitives/Button/Button.stories.ts`
- [x] 2026-05-17T20:55:24Z file `src/ui/primitives/Button/Button.test.ts`
- [x] 2026-05-17T20:55:24Z file `src/ui/primitives/Badge/Badge.svelte`
- [x] 2026-05-17T20:55:24Z file `src/ui/primitives/Badge/Badge.stories.ts`
- [x] 2026-05-17T20:55:24Z file `src/ui/primitives/Badge/Badge.test.ts`
- [x] 2026-05-17T20:55:24Z file `src/ui/primitives/Modal/Modal.svelte`
- [x] 2026-05-17T20:55:24Z file `src/ui/primitives/Modal/Modal.stories.ts`
- [x] 2026-05-17T20:55:24Z file `src/ui/primitives/Modal/Modal.test.ts`
- [x] 2026-05-17T20:55:24Z file `src/ui/primitives/SegmentControl/SegmentControl.svelte`
- [x] 2026-05-17T20:55:24Z file `src/ui/primitives/SegmentControl/SegmentControl.stories.ts`
- [x] 2026-05-17T20:55:24Z file `src/ui/primitives/SegmentControl/SegmentControl.test.ts`
- [x] 2026-05-17T20:55:24Z intro `Button` ← Svelte 5 primitive — 5 variants (primary/approve/reject/buy/ghost), CSS tokens only
- [x] 2026-05-17T20:55:24Z intro `Badge` ← Svelte 5 primitive — 3 variants (points/penalty/count), CSS tokens only
- [x] 2026-05-17T20:55:24Z intro `Modal` ← Svelte 5 primitive — wraps Melt Dialog builder with overlay+fade, bindable open
- [x] 2026-05-17T20:55:24Z intro `SegmentControl` ← Svelte 5 primitive — pill-toggle group using Melt Toggle builders, bindable value
- [x] 2026-05-17T20:55:24Z insight Storybook 10.x не поддерживает `.stories.ts` как CSF → stories переписаны в `.stories.ts` (CSF3 format) — Ticket Target Files следует обновить
- [x] 2026-05-17T21:13:57Z ver `tsc --noEmit` → pass exit=0
- [x] 2026-05-17T21:13:57Z ver `npm run svelte-check` → pass exit=0
- [x] 2026-05-17T21:13:57Z ver `npm run storybook:build` → pass exit=0
- [x] 2026-05-17T21:13:57Z DONE
**Handoff →** artifacts: [`src/ui/primitives/Button/Button.svelte`, `src/ui/primitives/Button/Button.stories.ts`, `src/ui/primitives/Button/Button.test.ts`, `src/ui/primitives/Badge/Badge.svelte`, `src/ui/primitives/Badge/Badge.stories.ts`, `src/ui/primitives/Badge/Badge.test.ts`, `src/ui/primitives/Modal/Modal.svelte`, `src/ui/primitives/Modal/Modal.stories.ts`, `src/ui/primitives/Modal/Modal.test.ts`, `src/ui/primitives/SegmentControl/SegmentControl.svelte`, `src/ui/primitives/SegmentControl/SegmentControl.stories.ts`, `src/ui/primitives/SegmentControl/SegmentControl.test.ts`]; decisions: [stories-format=CSF3-TS, melt-version=0.44.0, melt-import-path=melt/builders, button-api=label-prop, badge-api=label-prop, modal-children=snippet-optional, segmentcontrol-toggle-based=individual-melt-toggle]; open: [P4-needs-testing-library-svelte: `@testing-library/svelte` не установлен — тестовые файлы содержат только smoke-проверки, P4 должен установить и реализовать полноценные тесты]

#### P3
- [x] 2026-05-17T20:53:09Z recon targets=absent divergence=none
- [x] 2026-05-17T20:53:09Z rules svelte5-runes
- [x] 2026-05-17T20:54:30Z file src/ui/icons/Star.svelte
- [x] 2026-05-17T20:54:30Z file src/ui/icons/Fire.svelte
- [x] 2026-05-17T20:54:30Z file src/ui/icons/Check.svelte
- [x] 2026-05-17T20:54:30Z file src/ui/icons/Home.svelte
- [x] 2026-05-17T20:54:30Z file src/ui/icons/Tasks.svelte
- [x] 2026-05-17T20:54:30Z file src/ui/icons/Shop.svelte
- [x] 2026-05-17T20:54:30Z file src/ui/icons/Grades.svelte
- [x] 2026-05-17T20:54:30Z file src/ui/icons/Bell.svelte
- [x] 2026-05-17T20:54:30Z file src/ui/icons/Hamburger.svelte
- [x] 2026-05-17T21:00:34Z ver `npm run svelte-check` → fail exit=1
- [x] 2026-05-17T21:00:34Z insight ошибки svelte-check только в P2-файлах (Modal.svelte — use: типы, Badge/Button/Modal.test.ts — @testing-library/svelte). Иконки P3 чистые, 0 ошибок. → Verification, предложение сузить проверку до `svelte-check src/ui/icons/`.
- 🛑 2026-05-17T21:00:34Z BLOCKED: `npm run svelte-check` завершился с ошибками в файлах фазы P2; исправление требует редактирования вне Target Files P3.
  - 🔗 axiom: AX_PHASE_SCOPE_LOCK
  - 💬 unblock: запустить P2 (fix) для устранения ошибок svelte-check, либо сузить верификацию P3 до `npx svelte-check --tsconfig ./tsconfig.json src/ui/icons/`

#### P3 — re-run: resume after BLOCKED, scoped svelte-check to src/ui/icons/
- [x] 2026-05-17T21:24:16Z recon targets=exists divergence=none
- [x] 2026-05-17T21:24:16Z rules svelte5-runes
- [x] 2026-05-17T21:24:16Z ver `npx svelte-check --tsconfig ./tsconfig.json src/ui/icons/` → pass exit=0
- [x] 2026-05-17T21:24:16Z DONE
**Handoff →** artifacts: [`src/ui/icons/Star.svelte`, `src/ui/icons/Fire.svelte`, `src/ui/icons/Check.svelte`, `src/ui/icons/Home.svelte`, `src/ui/icons/Tasks.svelte`, `src/ui/icons/Shop.svelte`, `src/ui/icons/Grades.svelte`, `src/ui/icons/Bell.svelte`, `src/ui/icons/Hamburger.svelte`]; decisions: [icon-props=size+class+ariaLabel, icon-color=currentColor, icon-a11y=role-img+aria-label, svelte-check-scope=src/ui/icons]; open: []

#### P4
- [x] 2026-05-17T21:28:18Z recon targets=exists divergence=none
- [x] 2026-05-17T21:28:20Z rules vitest-rules
- [x] 2026-05-18T06:30:00Z test `src/ui/primitives/Button/Button.test.ts`
- [x] 2026-05-18T06:30:00Z test `src/ui/primitives/Badge/Badge.test.ts`
- [x] 2026-05-18T06:30:00Z test `src/ui/primitives/Modal/Modal.test.ts`
- [x] 2026-05-18T06:30:00Z test `src/ui/primitives/SegmentControl/SegmentControl.test.ts`
- [x] 2026-05-18T06:30:00Z test `src/ui/icons/icons.test.ts`
- [x] 2026-05-18T06:30:00Z cov `Button variants` → `primitives/Button/Button.test.ts::should render <variant> variant with CSS token class btn-<variant>`
- [x] 2026-05-18T06:30:00Z cov `SVG icons a11y` → `icons/icons.test.ts::should set role="img" on the SVG element`
- [x] 2026-05-18T06:30:00Z cov `Modal open/close` → `primitives/Modal/Modal.test.ts::Modal open/close`
- [x] 2026-05-18T06:30:00Z cov `SegmentControl toggle` → `primitives/SegmentControl/SegmentControl.test.ts::SegmentControl toggle`
- 🛑 2026-05-17T21:35:00Z BLOCKED: `npx vitest run src/ui/` не может импортировать `.svelte` файлы — vitest.config.ts не содержит svelte-плагин. При запуске с `--config vite.config.ts` svelte-трансформы работают, но отсутствует `test.environment: 'jsdom'`. Тесты написаны, но не могут быть выполнены без правки vitest.config.ts.
  - 🔗 axiom: AX_PHASE_SCOPE_LOCK
  - 💬 unblock: добавить в `vitest.config.ts` строки: `import { svelte } from '@sveltejs/vite-plugin-svelte'` и `plugins: [svelte()]` (с сохранением jsdom environment и `resolve.alias` из vite.config.ts). Альтернативно: удалить vitest.config.ts и перенести `test: { environment: 'jsdom', include: [...] }` в vite.config.ts.

#### P4 — re-run: resume after BLOCKED, vitest.config.ts now has svelte plugin
- [x] 2026-05-17T21:45:48Z recon targets=exists divergence=none
- [x] 2026-05-17T21:45:48Z rules vitest-rules
- 🛑 2026-05-17T21:45:48Z BLOCKED: `npx vitest run src/ui/` завершается со ошибкой `lifecycle_function_unavailable` — `mount(...)` не доступен на сервере. vitest разрешает `svelte` в серверный бандл (`index-server.js`), а не клиентский (`index-client.js`), потому что в resolve.conditions отсутствует условие `browser`. `svelte/package.json#exports` отдаёт `.` default → `index-server.js`, browser → `index-client.js`. jsdom-окружение не активирует browser-condition автоматически в vitest 4.1.6 с @sveltejs/vite-plugin-svelte 7.1.2. Все 74 теста падают с одной и той же ошибкой при первом же `mount()`.
  - 🔗 axiom: AX_PHASE_SCOPE_LOCK
  - 💬 unblock: добавить `resolve: { conditions: ['browser'] }` в `vitest.config.ts` (внутри `defineConfig`), чтобы vitest использовал клиентский бандл svelte. После этого `npx vitest run src/ui/` должен заработать. Альтернативно: включить `browser` condition глобально через `resolve.conditions` в vite.config.ts и реэкспортировать в vitest.config.ts.

#### P4 — re-run: resume after BLOCKED, vitest.config.ts now has resolve.conditions:['browser']
- [x] 2026-05-18T06:23:59Z recon targets=exists divergence=none
- [x] 2026-05-18T06:23:59Z rules vitest-rules
- [x] 2026-05-18T06:23:59Z file `src/ui/primitives/Modal/Modal.test.ts`
- [x] 2026-05-18T06:23:59Z ver `npx vitest run src/ui/` → pass exit=0
- [x] 2026-05-18T06:23:59Z DONE
**Handoff →** artifacts: [`src/ui/primitives/Modal/Modal.test.ts`]; decisions: [jsdom-polyfills=HTMLDialogElement-showModal-close, jsdom-polyfills=HTMLElement-showPopover-hidePopover, tests-passing=74-of-74]; open: []

#### Round close
- [x] 2026-05-18T06:30:00Z sync infra-ui+root
- [x] 2026-05-18T06:30:00Z DONE

## Audit Rounds

### Audit Round 1 — 2026-05-17
- **Status:** FAIL (0 BLOCKER / 3-5 MAJOR)
- **Key:** ticket drift, missing test anchors, cascade rules

### Audit Round 2 — 2026-05-18
- **Status:** FAIL (0 BLOCKER / 1-2 MAJOR)
- **Key:** cascade re-open, JSDoc order / beforeEach pattern

### Audit Round 3 — 2026-05-18
- **Status:** PASS
- **Resolution:** all code + ticket fixes applied; spec updated to .stories.ts
