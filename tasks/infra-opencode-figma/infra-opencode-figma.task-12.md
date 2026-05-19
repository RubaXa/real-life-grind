# Task: TSK-12 — Document prompting conventions for Figma→Svelte codegen

## 1. Meta
- **Task-ID:** TSK-12
- **Status:** [x] DONE
- **Purpose:** Зафиксировать в `AGENTS.md` правила и примеры промптов для генерации Svelte-компонентов из Figma-макетов, включая санитизацию имён и текстовых данных (mitigation prompt injection).
- **Scope:** infra-opencode-figma
- **Module:** N/A
- **Dependencies:** TSK-11
- **Spec References:**
  - Handoff: [TSK-03](../../specs/infra-opencode-figma/infra-opencode-figma.spec.md#10-handoff)
  - Open Risks: [prompt injection через имена компонентов и текстовые слои](../../specs/infra-opencode-figma/infra-opencode-figma.spec.md#10-handoff)
  - Dev Workflow Example: [шаг 5](../../specs/infra-opencode-figma/infra-opencode-figma.spec.md#3-developer-workflow-example)
- **Runtime Backing:** `not-implemented`
- **Verification Levels:** None (documentation only)
- **Deferred Runtime Scope:** None

## 2. Phases Overview
| ID | Kind | Deps | Status |
|----|------|------|--------|
| P1 | doc | — | [x] |

## 3. Phases

### P1 — doc
- **Objective:** Записать prompting conventions в `AGENTS.md` в корне проекта
- **Rules:**
  - (none — documentation only)
- **Target Files:**
  - `AGENTS.md`
- **Inputs:** none
- **Exit:** `AGENTS.md` содержит секцию «Figma MCP Integration» с правилами санитизации, примерами промптов для Svelte-кодогенерации и маппингом Figma→Svelte компонентов

## 4. Acceptance Criteria (BDD)

**Feature:** Агент знает, как генерировать Svelte-код из Figma

**Scenario:** AGENTS.md содержит prompting conventions [`contract`]
- **Given** MCP-сервер Figma подключен
- **When** агент читает `AGENTS.md`
- **Then** файл содержит секцию «Figma MCP Integration» со следующими правилами:
  - **Санитизация:** имена компонентов и текст из Figma фильтруются (limited charset, max 64 символов) перед подстановкой в prompt
  - **Генерация:** результат — Svelte 5 компоненты с runes ($state, $derived, $effect, $props), Melt UI для интерактивных элементов
  - **Токены:** цвета и отступы используют CSS custom properties из `src/ui/tokens/`
  - **Маппинг:** явная таблица соответствия Figma-имён → Svelte-компонентов infra-ui (Button, Icon, Counter, ...)
- **And** приведён пример промпта: «Реализуй этот макет как Svelte 5 компонент [Figma URL], используй компоненты из src/ui/primitives/, CSS-токены из src/ui/tokens/»

**Scenario:** Санитизация предотвращает prompt injection [`contract`]
- **Given** имя компонента в Figma содержит спецсимволы или длину > 64
- **When** имя подставляется в prompt агенту
- **Then** спецсимволы удалены, длина обрезана до 64 символов
- **And** текстовые слои из Figma проходят такую же санитизацию

## 5. Verification
| Command | Required by |
|---|---|
| `grep -c 'Figma MCP Integration' AGENTS.md` | acceptance criteria |

- **Task-level Completion additions:** none beyond project baseline

## 6. Test Scenario Coverage
- Scenario «AGENTS.md содержит prompting conventions» → `AGENTS.md` :: `Figma MCP Integration section exists`
- Scenario «Санитизация предотвращает prompt injection» → `AGENTS.md` :: `sanitization rules documented in section`

## 7. Execution Log
*(Round = one execute-then-audit attempt. Token vocabulary + protocol in [tasks/README.md#execution-log-template](../../README.md#execution-log-template).)*

### Round 1 — 2026-05-19, initial

#### P1
- [x] `2026-05-19T10:24:51Z` recon targets=exists divergence=none
- [x] `2026-05-19T10:24:51Z` rules none
- [x] `2026-05-19T10:26:00Z` file `AGENTS.md`
- [x] `2026-05-19T10:27:46Z` ver `grep -c 'Figma MCP Integration' AGENTS.md` → pass exit=0
- [x] `2026-05-19T10:27:46Z` DONE
**Handoff →** artifacts: [AGENTS.md]; decisions: [sanitization-max-length=64, sanitization-charset=[a-zA-Z0-9_\\-а-яА-Я], figma-to-svelte-map=documented]; open: [COUNTER_UNMAPPED: Counter не имеет аналога в infra-ui — нужен новый компонент или адаптация Badge, ICON_PARTIAL: Figma Icon требует сопоставления с 9 конкретными иконками, FULL_FIGMA_LIST: полный список 179 Figma-компонентов не извлечён]

#### Round close
- [x] `2026-05-19T10:28:00Z` sync infra-opencode-figma+root
- [x] `2026-05-19T10:28:00Z` DONE
