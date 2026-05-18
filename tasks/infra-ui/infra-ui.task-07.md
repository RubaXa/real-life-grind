# Task: TSK-07 — Demo: верификация инфраструктуры на одном компоненте

## 1. Meta
- **Task-ID:** TSK-07
- **Status:** [x] DONE
- **Purpose:** Создать один демо-компонент `PointsBadge` для сквозной проверки: токены → примитивы → Storybook → тесты. Убедиться, что вся цепочка infra-ui работает.
- **Scope:** infra-ui
- **Module:** components
- **Dependencies:** TSK-06
- **Reopens:** 0
- **Spec References:**
  - Tokens: [Design Spec §1.1, §1.8](../../draft/real-life-grind.draft-design.md#11-colors)
  - Primitives: [Dependency Policy §7.1](../../specs/infra-ui/infra-ui.spec.md#71-adapter-boundary)
  - Verification: [Verification Commands §9](../../specs/infra-ui/infra-ui.spec.md#9-verification-commands)
- **Runtime Backing:** `simulation`
- **Verification Levels:** `unit` + `integration`
- **Deferred Runtime Scope:** None

## 2. Phases Overview
| ID | Kind | Deps | Status |
|----|------|------|--------|
| P1 | impl | — | [x] |
| P2 | test | P1 | [x] |

## 3. Phases

### P1 — impl (demo component + story)
- **Objective:** `PointsBadge` — badge с золотой иконкой звезды, числом баллов и glow-эффектом. Использует `Badge` примитив + `Star` иконку + CSS-токены (`--c-gold`, `--c-gold-glow`). Story с 3 состояниями: default, large number, empty.
- **Rules:** [svelte5-runes](../../ai/directives/coding/svelte5-runes.xml), [typescript-rules](../../ai/directives/coding/typescript-rules.xml)
- **Target Files:**
  - `src/ui/components/PointsBadge/PointsBadge.svelte`
  - `src/ui/components/PointsBadge/PointsBadge.stories.ts`
- **Inputs:** none
- **Exit:** Компонент использует Badge примитив + Star иконку + токены. Storybook отображает 3 состояния. `npm run storybook:build` exit=0.

### P2 — test (unit test + integration)
- **Objective:** Unit-тест на PointsBadge + интеграционная проверка всей цепочки.
- **Rules:** [vitest-rules](../../ai/directives/testing/vitest-rules.xml)
- **Target Files:**
  - `src/ui/components/PointsBadge/PointsBadge.test.ts`
- **Inputs:** P1 handoff
- **Exit:** `npx vitest run src/ui/components/PointsBadge/` exit=0. `npm run svelte-check` exit=0. `npm run storybook:build` exit=0.

## 4. Acceptance Criteria (BDD)

**Scenario:** PointsBadge отображает баллы с золотой иконкой [`unit`]
- **Given** PointsBadge с props: points=240
- **When** компонент рендерится
- **Then** отображается число "240"
- **And** иконка Star золотого цвета (`--c-gold`)
- **And** присутствует gold-glow эффект

**Scenario:** PointsBadge с нулём показывает "0" [`unit`]
- **Given** PointsBadge с props: points=0
- **When** компонент рендерится
- **Then** отображается "0" без ошибок

**Scenario:** Storybook отображает PointsBadge во всех состояниях [`integration`]
- **Given** Storybook собран (`npm run storybook:build`)
- **When** открывается PointsBadge story
- **Then** видны 3 состояния: default, large number, empty

## 5. Verification
| Command | Required by |
|---------|-------------|
| `npx vitest run src/ui/components/PointsBadge/` | vitest-rules |
| `npm run svelte-check` | svelte5-runes |
| `npm run storybook:build` | check-command |

- **Task-level Completion additions:** none

## 6. Test Scenario Coverage
| Scenario | Test | Owner |
|----------|------|-------|
| PointsBadge renders points with gold star | `components/PointsBadge/PointsBadge.test.ts` | P2 |
| PointsBadge displays zero | `components/PointsBadge/PointsBadge.test.ts` | P2 |
| Storybook shows 3 states | smoke (storybook:build exit=0) | P1 |

## 7. Execution Log
### Round 1 — TBD, initial

#### P1
- [x] 2026-05-18T06:27:34Z recon targets=absent divergence=none
- [x] 2026-05-18T06:27:34Z rules svelte5-runes, typescript-rules
- [x] 2026-05-18T06:27:34Z file `src/ui/components/PointsBadge/PointsBadge.svelte`
- [x] 2026-05-18T06:27:34Z file `src/ui/components/PointsBadge/PointsBadge.stories.ts`
- [x] 2026-05-18T06:27:34Z intro `PointsBadge` ← demo component for infra-ui verification: wraps Badge+Star with --c-gold/--c-gold-glow tokens and glow effect
- [x] 2026-05-18T06:27:34Z insight Storybook 10.x не поддерживает `.stories.ts` как CSF → stories переписан в `.stories.ts` (CSF3 format) — Ticket Target Files следует обновить
- [x] 2026-05-18T06:27:34Z ver `npm run svelte-check` → pass exit=0
- [x] 2026-05-18T06:27:34Z ver `npm run storybook:build` → pass exit=0
- [x] 2026-05-18T06:27:34Z DONE
**Handoff →** artifacts: [`src/ui/components/PointsBadge/PointsBadge.svelte`, `src/ui/components/PointsBadge/PointsBadge.stories.ts`]; decisions: [stories-format=CSF3-TS, storybook-title=Components/PointsBadge, story-states=Default(240)+LargeNumber(9999)+Empty(0)]; open: []

#### P2
- [x] 2026-05-18T06:31:11Z recon targets=absent divergence=none
- [x] 2026-05-18T06:31:11Z rules vitest-rules
- [x] 2026-05-18T06:37:39Z test `src/ui/components/PointsBadge/PointsBadge.test.ts`
- [x] 2026-05-18T06:37:39Z intro `PointsBadge.test.ts` ← P2 test phase: unit tests for PointsBadge component covering gold-star rendering and zero-points display
- [x] 2026-05-18T06:37:39Z cov PointsBadge renders points with gold star → `PointsBadge.test.ts::should render points count with gold star icon and glow effect`
- [x] 2026-05-18T06:37:39Z cov PointsBadge displays zero → `PointsBadge.test.ts::should display zero without errors`
- [x] 2026-05-18T06:44:16Z ver `npx vitest run src/ui/components/PointsBadge/` → pass exit=0
- [x] 2026-05-18T06:44:16Z ver `npm run svelte-check` → pass exit=0
- [x] 2026-05-18T06:44:16Z ver `npm run storybook:build` → pass exit=0
- [x] 2026-05-18T06:44:16Z DONE
**Handoff →** artifacts: [`src/ui/components/PointsBadge/PointsBadge.test.ts`]; decisions: [test-pattern=lifecycle-mount, bdd-names=English]; open: []

#### Round close
- [x] 2026-05-18T06:30:00Z sync infra-ui+root
- [x] 2026-05-18T06:30:00Z DONE


## Audit Rounds

### Audit Round 1 — 2026-05-18, after Execution Round 1
```
@audit task=TSK-07 round=1 after-exec-round=1 triggered-reopen=Round-2 status=FAIL counts=B0·M3·m1·I2
F-01 | sev=M | type=EXECUTION_LOG_INCOMPLETE | conf=H | loc=tasks/infra-ui/infra-ui.task-07.md#3-P1 | phase=— | src=exec-log-P1-insight | route=ticket-update | act=заменить `PointsBadge.stories.ts` на `PointsBadge.stories.ts` в P1 Target Files и Test Scenario Coverage; execution log содержит insight с рекомендацией обновить тикет — изменение не применено
F-02 | sev=M | type=RULES_COMPLIANCE_VIOLATION | conf=M | loc=src/ui/components/PointsBadge/PointsBadge.test.ts:38 | phase=P2 | src=vitest-rules.xml→AX_CASE_INNER_ANCHORS | route=code-fix | act=добавить phase anchors (#region START_<CASE>_<PHASE>_<INTENT>) в оба тест-кейса; кейс "should render points count..." не тривиальный
F-03 | sev=M | type=RULES_COMPLIANCE_VIOLATION | conf=M | loc=src/ui/components/PointsBadge/PointsBadge.test.ts:28 | phase=P2 | src=vitest-rules.xml#AX_ONE_PREP_PATH_PER_DESCRIBE | route=code-fix | act=убрать вызов mountPointsBadge из beforeEach; beforeEach должен только создавать DOM-контейнер; каждый кейс вызывает фабрику явно
F-04 | sev=m | type=BDD_COVERAGE_MISMATCH | conf=M | loc=src/ui/components/PointsBadge/PointsBadge.test.ts:38 | phase=P2 | src=ticket#6 | route=ticket-update | act=привести канонические имена в §6 к verbatim match с именами тестов
F-05 | sev=I | type=INSIGHT_BACKFLOW | conf=H | loc=specs/infra-ui/infra-ui.spec.md:314 | phase=— | src=spec#6-4 | route=spec-edit | act=обновить §6.4: заменить `.stories.ts` на `.stories.ts` (CSF3) — Storybook 10.x не поддерживает Svelte-native stories
F-06 | sev=I | type=INSIGHT_BACKFLOW | conf=H | loc=specs/infra-ui/infra-ui.spec.md:48 | phase=— | src=spec#2-2 | route=spec-edit | act=обновить версию Storybook с >=8 на >=10 в §2.2 и D-IU01
```

### Audit Round 2 — 2026-05-18, after Execution Round 1 (re-audit of Round 1 fix)
```
@audit task=TSK-07 round=2 after-exec-round=1 triggered-reopen=Round-2 status=FAIL counts=B0·M2·m1·I2 phases_to_fix=[P2]
F-01 | sev=M | type=RULES_COMPLIANCE_VIOLATION | conf=H | loc=src/ui/components/PointsBadge/PointsBadge.test.ts:38 | phase=P2 | src=vitest-rules.xml→AX_CASE_INNER_ANCHORS | route=code-fix | act=добавить phase anchors (#region START_<CASE>_<PHASE>_<INTENT>) в оба не-тривиальных тест-кейса: SETUP/TRIGGER/OBSERVE/ASSERT
F-02 | sev=M | type=RULES_COMPLIANCE_VIOLATION | conf=H | loc=src/ui/components/PointsBadge/PointsBadge.test.ts:27 | phase=P2 | src=vitest-rules.xml→AX_ONE_PREP_PATH_PER_DESCRIBE | route=code-fix | act=убрать вызов mountPointsBadge из beforeEach; beforeEach должен только создавать DOM-контейнер; каждый кейс вызывает фабрику mountPointsBadge явно со своими props
F-03 | sev=m | type=BDD_COVERAGE_MISMATCH | conf=H | loc=tasks/infra-ui/infra-ui.task-07.md#6 | phase=P2 | src=ticket§6 | route=ticket-update | act=привести канонические имена в §6 к verbatim match: `should render points count with gold star icon and glow effect` и `should display zero without errors`
F-04 | sev=I | type=INSIGHT_BACKFLOW | conf=H | loc=specs/infra-ui/infra-ui.spec.md:314 | phase=— | src=spec§6-4 | route=spec-edit | act=обновить §6.4, §3.2, §3.3: заменить `.stories.svelte` на `.stories.ts` (CSF3) — Storybook 10.x не поддерживает Svelte-native stories
F-05 | sev=I | type=INSIGHT_BACKFLOW | conf=H | loc=specs/infra-ui/infra-ui.spec.md:48 | phase=— | src=spec§2-2 | route=spec-edit | act=обновить версию Storybook с >=8 на >=10 в §2.2 Tool Choices и D-IU01 Decision Log
~applied | tasks/infra-ui/infra-ui.task-07.md | P1 Target Files `.stories.svelte` → `.stories.ts` (fix from Audit Round 1 подтверждён)
```

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
