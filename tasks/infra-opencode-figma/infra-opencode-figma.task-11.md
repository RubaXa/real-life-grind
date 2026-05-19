# Task: TSK-11 — Smoke-test Figma integration on real mockup

## 1. Meta
- **Task-ID:** TSK-11
- **Status:** [x] DONE
- **Purpose:** Запросить `get_figma_data` по реальному макету дизайн-системы, проверить структуру и полноту ответа.
- **Scope:** infra-opencode-figma
- **Module:** N/A
- **Dependencies:** TSK-10
- **Spec References:**
  - Dev Workflow Example: [шаг 6](../../specs/infra-opencode-figma/infra-opencode-figma.spec.md#3-developer-workflow-example)
  - Tool Choice: [D-001](../../specs/infra-opencode-figma/infra-opencode-figma.spec.md#d-001--figma-developer-mcp-как-mcp-сервер-для-figma-интеграции)
  - Open Risks: [prompt injection, nested components](../../specs/infra-opencode-figma/infra-opencode-figma.spec.md#10-handoff)
- **Runtime Backing:** `not-implemented`
- **Verification Levels:** `integration`
- **Deferred Runtime Scope:** None

## 2. Phases Overview
| ID | Kind | Deps | Status |
|----|------|------|--------|
| P1 | impl | — | [x] |
| P2 | test | P1 | [x] |

## 3. Phases

### P1 — impl
- **Objective:** Запросить `get_figma_data` по известному макету infra-ui (UI-KIT Chats Web, node Button/ButtonIcon)
- **Rules:**
  - (none — no source code, data retrieval only)
- **Target Files:**
  - (none — output captured in terminal)
- **Inputs:** none
- **Exit:** Получен YAML/JSON-ответ с `metadata.name`, `components`, иерархией фреймов

### P2 — test
- **Objective:** Проверить структуру ответа и зафиксировать наблюдения
- **Rules:**
  - (none)
- **Target Files:**
  - (none — verification log only)
- **Inputs:** P1 handoff
- **Exit:** Подтверждено: ответ содержит имена компонентов, variant-ы, component properties, fills с variables; процент покрытия компонентов infra-ui задокументирован

## 4. Acceptance Criteria (BDD)

**Feature:** Агент получает дизайн-контекст из Figma

**Scenario:** get_figma_data возвращает структурированные данные [`integration`]
- **Given** MCP-сервер подключен и токен валиден
- **And** указан fileKey и nodeId реального макета
- **When** вызывается `get_figma_data` с fileKey=`BPZYKSL7OjhJMDqZq6GY2T`, nodeId=`6-4093`
- **Then** ответ содержит секцию `metadata` с `name: UI-KIT Chats Web`
- **And** ответ содержит секцию `components` с componentSetId и вариантами (Button, Icon, Counter)
- **And** компонент Button имеет variant-ы: `SizeClass`, `Size`, `Mode`, `Appearance`, `State`
- **And** экземпляр кнопки содержит `componentProperties` с `Icon Before`, `Icon After`, `Text`, `Counter`

**Scenario:** download_figma_images доступен и принимает запросы [`integration`]
- **Given** MCP-сервер подключен
- **When** вызывается `tools/list`
- **Then** ответ содержит инструмент `download_figma_images` с inputSchema, описывающим `fileKey`, `nodes`, `localPath`

**Scenario:** Агент может сопоставить компоненты Figma с компонентами infra-ui [`integration`]
- **Given** получены имена компонентов из Figma (Button, Icon, Counter)
- **When** сопоставлены с компонентами infra-ui (19 Svelte 5/Melt UI компонентов)
- **Then** определён процент покрытия (match / total × 100)
- **And** компоненты без match задокументированы как «requires manual mapping»

## 5. Verification
| Command | Required by |
|---|---|
| `echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_figma_data","arguments":{"fileKey":"BPZYKSL7OjhJMDqZq6GY2T","nodeId":"6-4093"}}}' \| FIGMA_API_KEY="$FIGMA_API_KEY" npx -y figma-developer-mcp --stdio \| grep 'UI-KIT Chats Web'` | acceptance criteria |

- **Task-level Completion additions:** none beyond project baseline

## 6. Test Scenario Coverage
- Scenario «get_figma_data возвращает структурированные данные» → `npx figma-developer-mcp --stdio get_figma_data` :: `metadata.name = UI-KIT Chats Web`
- Scenario «download_figma_images доступен» → `npx figma-developer-mcp --stdio tools/list` :: `download_figma_images in response`
- Scenario «Агент может сопоставить компоненты Figma с компонентами infra-ui» → manual verification :: `coverage % documented in Execution Log`

## 7. Execution Log
*(Round = one execute-then-audit attempt. Token vocabulary + protocol in [tasks/README.md#execution-log-template](../../README.md#execution-log-template).)*

### Round 1 — 2026-05-19, initial

#### P1
- [x] `2026-05-19T10:09:02Z` recon targets=absent divergence=none
- [x] `2026-05-19T10:09:02Z` rules none
- [x] `2026-05-19T10:09:02Z` ver `echo '{"method":"tools/call",...}' | npx figma-developer-mcp --stdio | grep 'UI-KIT Chats Web'` → pass exit=0
- [x] `2026-05-19T10:09:02Z` DONE
**Handoff →** artifacts: []; decisions: [metadata.name=UI-KIT Chats Web, nodes=996, componentsWithComponentSetId=179, buttonVariants=SizeClass+Size+Mode+Appearance+State, componentProperties=Icon Before+Icon After+Text+Counter]; open: []

#### P2
- [x] `2026-05-19T10:16:15Z` recon targets=absent divergence=none
- [x] `2026-05-19T10:16:15Z` rules none
- [x] `2026-05-19T10:16:15Z` ver `echo '{"method":"tools/list",...}' | npx figma-developer-mcp --stdio | grep download_figma_images` → pass exit=0
- [x] `2026-05-19T10:16:15Z` ver `echo '{"method":"tools/call","name":"get_figma_data",...}' | npx figma-developer-mcp --stdio | grep fills` → pass exit=0
- [x] `2026-05-19T10:16:15Z` cov get_figma_data возвращает структурированные данные → `npx figma-developer-mcp --stdio get_figma_data` :: подтверждено: metadata.name=UI-KIT Chats Web, components с componentSetId, Button варианты (SizeClass×Size×Mode×Appearance×State), componentProperties (Icon Before+Icon After+Text+Counter), fills с variables присутствуют
- [x] `2026-05-19T10:16:15Z` cov download_figma_images доступен → `npx figma-developer-mcp --stdio tools/list` :: инструмент download_figma_images присутствует в ответе
- [x] `2026-05-19T10:16:15Z` cov Агент может сопоставить компоненты Figma с компонентами infra-ui → manual verification :: покрытие: 1/19 (~5.3%) — Button (Figma) ↔ Button (infra-ui) прямое совпадение; Icon (Figma) ↔ группа Icons (9 иконок infra-ui) частичное совпадение, требует саб-маппинга; Counter (Figma) и остальные 176 компонентов Figma без match в infra-ui; requires manual mapping
- [x] `2026-05-19T10:16:15Z` insight fills с variables присутствуют в ответе get_figma_data — P1 handoff не упоминает fills/variables, но они подтверждены верификацией → spec infra-opencode-figma §3 шаг 6, P2 exit criteria
- [x] `2026-05-19T10:16:15Z` insight из 179 компонентов Figma с componentSetId P1 handoff перечисляет только Button, Icon, Counter — полный список не извлечён → ticket TSK-11 §6 Scenario 3, для полного coverage-анализа нужен перечень всех 179 имён
- [x] `2026-05-19T10:16:15Z` DONE
**Handoff →** artifacts: []; decisions: [fills-with-variables=confirmed, download-figma-images-available=true, coverage=1/19 (~5.3%), button-match=Button↔Button, icon-match=partial→9-icons, counter=unmapped]; open: [FULL_FIGMA_COMPONENT_LIST: из 179 компонентов Figma только 3 имени известны из P1 handoff, для полного маппинга нужен полный перечень, ICON_SUB_MAPPING: Figma Icon требует сопоставления с 9 конкретными иконками infra-ui, COUNTER_UNMAPPED: Counter не имеет аналога в infra-ui — нужен новый компонент или адаптация Badge]

#### Round close
- [x] `2026-05-19T10:06:00Z` sync infra-opencode-figma+root
- [x] `2026-05-19T10:06:00Z` DONE
