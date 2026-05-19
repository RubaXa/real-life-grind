# Task: TSK-09 — Bootstrap figma-developer-mcp

## 1. Meta
- **Task-ID:** TSK-09
- **Status:** [ ] TODO
- **Purpose:** Убедиться, что MCP-пакет `figma-developer-mcp` доступен через `npx` — базовая зависимость scope.
- **Scope:** infra-opencode-figma
- **Module:** N/A
- **Dependencies:** None
- **Spec References:**
  - Bootstrap Requirements: [figma-developer-mcp@^0.11.0](../../specs/infra-opencode-figma/infra-opencode-figma.spec.md#9-bootstrap-requirements)
  - Decision Log: [D-001](../../specs/infra-opencode-figma/infra-opencode-figma.spec.md#d-001--figma-developer-mcp-как-mcp-сервер-для-figma-интеграции)
- **Runtime Backing:** `not-implemented`
- **Verification Levels:** None (bootstrap phase only)
- **Deferred Runtime Scope:** None

## 2. Phases Overview
| ID | Kind | Deps | Status |
|----|------|------|--------|
| P1 | bootstrap | — | [x] |

## 3. Phases

### P1 — bootstrap
- **Objective:** Проверить доступность `figma-developer-mcp@0.11.0` через npx
- **Rules:**
  - (none — no source code, no config files, no test files)
- **Target Files:**
  - (none — package verification only)
- **Inputs:** none
- **Exit:** `npx -y figma-developer-mcp --version` → exit=0, выводит `v0.11.0`

## 4. Acceptance Criteria (BDD)

**Feature:** MCP-пакет доступен для OpenCode

**Scenario:** figma-developer-mcp устанавливается и запускается [`integration`]
- **Given** Node.js и npm доступны в окружении
- **When** вызывается `npx -y figma-developer-mcp --version`
- **Then** вывод содержит `v0.11.0` (или новее в пределах 0.11.x)
- **And** exit code = 0

**Scenario:** MCP-сервер принимает запрос tools/list [`integration`]
- **Given** пакет figma-developer-mcp установлен
- **When** отправляется JSON-RPC `{"method":"tools/list"}`
- **Then** ответ содержит инструменты `get_figma_data` и `download_figma_images`

## 5. Verification
| Command | Required by |
|---|---|
| `npx -y figma-developer-mcp --version` | bootstrap requirement |

- **Task-level Completion additions:** none beyond project baseline

## 6. Test Scenario Coverage
- Scenario «figma-developer-mcp устанавливается и запускается» → `npx figma-developer-mcp --version` :: `exit 0, v0.11.0`
- Scenario «MCP-сервер принимает запрос tools/list» → `echo '{"method":"tools/list"}' | npx figma-developer-mcp --stdio` :: `get_figma_data` in response

## 7. Execution Log
*(Round = one execute-then-audit attempt. Token vocabulary + protocol in [tasks/README.md#execution-log-template](../../README.md#execution-log-template).)*

### Round 1 — 2026-05-19, initial

#### P1
- [x] `2026-05-19T09:42:37Z` recon targets=none divergence=none
- [x] `2026-05-19T09:42:37Z` rules none
- [x] `2026-05-19T09:42:37Z` ver `npx -y figma-developer-mcp --version` → pass exit=0 (output: `0.11.0`)
- [x] `2026-05-19T09:43:00Z` ver `echo '{"method":"tools/list"}' | npx -y figma-developer-mcp --stdio` → pass (get_figma_data, download_figma_images present)
- [x] `2026-05-19T09:42:37Z` DONE
**Handoff →** artifacts: [figma-developer-mcp@0.11.0]; decisions: []; open: []

#### Round close
- [x] `2026-05-19T09:44:00Z` sync infra-opencode-figma+root
- [x] `2026-05-19T09:44:00Z` DONE
