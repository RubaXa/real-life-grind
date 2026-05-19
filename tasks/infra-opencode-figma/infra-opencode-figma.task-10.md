# Task: TSK-10 — Configure MCP server in opencode.json + verify connection

## 1. Meta
- **Task-ID:** TSK-10
- **Status:** [x] DONE
- **Purpose:** Добавить блок `mcp.figma` в `~/.config/opencode/opencode.json` и убедиться, что OpenCode видит MCP-сервер подключённым.
- **Scope:** infra-opencode-figma
- **Module:** N/A
- **Dependencies:** TSK-09, operator-action (FIGMA_API_KEY в окружении)
- **Spec References:**
  - Dev Workflow Example: [шаг 2–3](../../specs/infra-opencode-figma/infra-opencode-figma.spec.md#3-developer-workflow-example)
  - Bootstrap Requirements: [opencode.json](../../specs/infra-opencode-figma/infra-opencode-figma.spec.md#9-bootstrap-requirements)
  - Decision Log: [D-001](../../specs/infra-opencode-figma/infra-opencode-figma.spec.md#d-001--figma-developer-mcp-как-mcp-сервер-для-figma-интеграции)
- **Runtime Backing:** `not-implemented`
- **Verification Levels:** None (config verification only)
- **Deferred Runtime Scope:** None

## 2. Phases Overview
| ID | Kind | Deps | Status |
|----|------|------|--------|
| P1 | config | — | [ ] |
| P2 | config | P1 | [x] |

## 3. Phases

### P1 — config
- **Objective:** Добавить блок `mcp.figma` в `~/.config/opencode/opencode.json`
- **Rules:**
  - (none — config-only, no source code)
- **Target Files:**
  - `~/.config/opencode/opencode.json`
- **Inputs:** none
- **Exit:** `python3 -m json.tool ~/.config/opencode/opencode.json` проходит валидацию; блок `mcp.figma` присутствует

### P2 — config
- **Objective:** Проверить, что OpenCode видит MCP-сервер подключённым
- **Rules:**
  - (none)
- **Target Files:**
  - (none — verification only)
- **Inputs:** P1 handoff
- **Exit:** `opencode mcp list` содержит `✓ figma  connected`

## 4. Acceptance Criteria (BDD)

**Feature:** OpenCode подключает локальный Figma MCP-сервер

**Scenario:** Конфиг добавлен, сервер подключается [`integration`]
- **Given** `FIGMA_API_KEY` задан в окружении
- **And** пакет `figma-developer-mcp` доступен через npx
- **And** в `opencode.json` добавлен блок:
  ```json
  "figma": {
    "type": "local",
    "command": ["npx", "-y", "figma-developer-mcp", "--stdio"],
    "enabled": true,
    "environment": { "FIGMA_API_KEY": "{env:FIGMA_API_KEY}" }
  }
  ```
- **When** OpenCode запущен
- **Then** `opencode mcp list` показывает `✓ figma  connected`

**Scenario:** JSON конфига остаётся валидным после редактирования [`contract`]
- **Given** файл `~/.config/opencode/opencode.json` существует
- **When** добавлен блок `mcp.figma`
- **Then** `python3 -m json.tool` не выдаёт ошибок

## 5. Verification
| Command | Required by |
|---|---|
| `python3 -m json.tool ~/.config/opencode/opencode.json` | JSON validity |
| `opencode mcp list` | connection check |

- **Task-level Completion additions:** none beyond project baseline

## 6. Test Scenario Coverage
- Scenario «Конфиг добавлен, сервер подключается» → `opencode mcp list` :: `✓ figma  connected`
- Scenario «JSON конфига остаётся валидным после редактирования» → `python3 -m json.tool ~/.config/opencode/opencode.json` :: `exit 0`

## 7. Execution Log
*(Round = one execute-then-audit attempt. Token vocabulary + protocol in [tasks/README.md#execution-log-template](../../README.md#execution-log-template).)*

### Round 1 — 2026-05-19, initial

#### P1
- [x] `2026-05-19T10:00:00Z` recon targets=opencode.json divergence=none
- [x] `2026-05-19T10:00:00Z` rules none
- [x] `2026-05-19T10:00:00Z` file `~/.config/opencode/opencode.json`
- [x] `2026-05-19T10:00:00Z` ver `python3 -m json.tool ~/.config/opencode/opencode.json` → pass exit=0
- [x] `2026-05-19T10:00:00Z` DONE
**Handoff →** artifacts: [`~/.config/opencode/opencode.json` with `mcp.figma` block]; decisions: []; open: []

#### P2
- [x] `2026-05-19T10:01:17Z` recon targets=none divergence=none
- [x] `2026-05-19T10:01:17Z` rules none
- [x] `2026-05-19T10:01:17Z` ver `opencode mcp list` → pass exit=0
- [x] `2026-05-19T10:01:17Z` DONE
**Handoff →** artifacts: []; decisions: [mcp-figma-connected=true]; open: []

#### Round close
- [x] `2026-05-19T10:02:00Z` sync infra-opencode-figma+root
- [x] `2026-05-19T10:02:00Z` DONE
