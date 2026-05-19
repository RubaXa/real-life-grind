# infra-opencode-figma: Infrastructure Specification

## scope-type
infrastructure

## 1. Vision

Подключить Figma-макеты к агенту OpenCode через локальный MCP-сервер `figma-developer-mcp`. AI-агент получает `get_figma_data` и `download_figma_images` — читает иерархию фреймов, имена компонентов, variables, variant-ы и генерирует Svelte-код по макетам. Scope служит референсом: любой другой проект может повторить настройку, скопировав конфиг и подставив свой Figma-токен.

## 2. Tool Stack

### 2.1 Categories Covered

| Категория | Статус | Обоснование |
|---|---|---|
| `figma-mcp-integration` | active | Локальный MCP-сервер, связывающий Figma-дизайн с агентом OpenCode |

Остальные категории (vcs, package-management, linting, formatting, type-check, test-unit, test-e2e, bundler, git-hooks) покрыты `infra-base` — scope не дублирует.

### 2.2 Tool Choices

| Category | Tool | Rationale |
|---|---|---|
| `figma-mcp-integration` | `figma-developer-mcp` v0.11.0 (Framelink, MIT) | D-001 |

## 3. Developer Workflow Example

```bash
# ─── Подготовка (один раз) ───
# 1. Создать Figma Personal Access Token
#    Figma → Settings → Security → Generate new token → file:read scope
#    Сохранить в окружение: export FIGMA_API_KEY=figd_...

# 2. Добавить MCP-сервер в ~/.config/opencode/opencode.json:
#    "mcp": {
#      "figma": {
#        "type": "local",
#        "command": ["npx", "-y", "figma-developer-mcp", "--stdio"],
#        "enabled": true,
#        "environment": { "FIGMA_API_KEY": "{env:FIGMA_API_KEY}" }
#      }
#    }

# 3. Проверить подключение
opencode mcp list
# Ожидается: ✓ figma  connected

# ─── Повседневная работа ───
# 4. Открыть макет в Figma, скопировать ссылку на фрейм
#    https://www.figma.com/design/<fileKey>/...?node-id=123-456

# 5. Попросить агента реализовать макет
#    "Реализуй этот макет как Svelte 5 компонент [URL]"

# ─── Отладка ───
# 6. Проверить ответ MCP-сервера напрямую
echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"get_figma_data","arguments":{"fileKey":"<key>","nodeId":"123-456"}}}' | \
  FIGMA_API_KEY="$FIGMA_API_KEY" npx -y figma-developer-mcp --stdio

# 7. Проверить валидность токена
curl -s -H "X-Figma-Token: $FIGMA_API_KEY" https://api.figma.com/v1/me | python3 -m json.tool
```

## 4. File Structure

```
~/.config/opencode/
└── opencode.json              ← блок "mcp.figma" (конфиг MCP-сервера)

{project}/                     ← опционально, для будущих версий
└── .opencode/
    └── figma-components.map.json   ← маппинг Figma-имён → Svelte-компоненты (v2)
```

**File Mapping:**

| Файл | Назначение |
|---|---|
| `~/.config/opencode/opencode.json` | Конфигурация локального MCP-сервера `figma-developer-mcp` |
| `{project}/.opencode/figma-components.map.json` | (future) Явный маппинг компонентов Figma↔код |

## 5. Effective Rules (for cascade)

Scope правил не добавляет — наследует все правила из `infra-base`. Для `figma-developer-mcp` правило не создаётся (инструмент не генерирует код — это транспорт дизайн-контекста; дисциплина использования — в prompting conventions в `AGENTS.md`).

| Rule | Category | Source |
|---|---|---|
| `typescript-rules` | coding | infra (D-001 infra-base) |
| `svelte5-runes` | coding | infra (D-001 infra-base) |
| `vitest-rules` | testing | infra (D-001 infra-base) |
| `playwright-e2e` | testing | infra (D-001 infra-base) |
| `nodejs-npm-setup` | infra | infra (D-001 infra-base) |

## 6. Verification Commands

Не применимо. Scope не производит код и не имеет автотестов. Процедура проверки — шаги 3, 6, 7 в Developer Workflow Example. Конкретные команды проверки фиксируются в задачах.

## 7. Decision Log

### D-001 — `figma-developer-mcp` как MCP-сервер для Figma-интеграции
- **Status:** active
- **Recorded:** сессия Discovery, infra-opencode-figma
- **Why:** Протестирован в этой сессии, работает. Два инструмента (`get_figma_data`, `download_figma_images`). MIT license, 42k weekly downloads, 47 версий. Конфиг 5 строк в `opencode.json`. Нативный REST-сервер (вариант B) — в backlog как fallback при проблемах.
- **Risk accepted:**
  - Supply chain (16 transitive deps) — компрометация через npm; мониторинг через `npm audit`
  - MITM при корпоративном SSL-inspection — токен может утечь; документировать риск для корпоративных сред
  - Нет фиксации версии — разработчики могут получить разное поведение; добавить `figma-mcp-version` в конфиг проекта
  - Прекращение поддержки — Figma может deprecate REST API в пользу GraphQL; подписка на Figma API changelog
- **Rejected alternatives:** Figma Remote MCP (требует whitelist клиентов — OpenCode нет), Figma Desktop MCP (требует запущенный Figma-десктоп), нативный MCP-сервер на прямых REST-вызовах (v1 — избыточно, backlog).

### D-002 — Без Verification Commands
- **Status:** active
- **Recorded:** сессия Discovery, infra-opencode-figma
- **Why:** Scope не производит код. Единственная проверка — `opencode mcp list | grep '✓ figma'` — тривиальна. Процедура верификации описана в Dev Workflow Example и будет зафиксирована в задачах.
- **Risk accepted:** None.

## 8. Scope Dependencies

- **Depends on:** `infra-base` (npm, check-command, все dev-инструменты)
- **Provides rules to:** None (не добавляет новых coding/infra-правил)
- **Consumed by:** Все product/library scope, использующие Figma-макеты для кодогенерации (в данном проекте — `web`)

## 9. Bootstrap Requirements

| Requirement | Kind | Owner | Resolution |
|---|---|---|---|
| `figma-developer-mcp@^0.11.0` | package | this-scope-task | Автоматически: OpenCode запускает `npx -y figma-developer-mcp --stdio` при старте |
| `FIGMA_API_KEY` в окружении | env | operator-action | Пользователь создаёт PAT в Figma (Settings → Security → Personal Access Tokens → file:read) и задаёт env-переменную |
| `opencode.json` с блоком `mcp.figma` | file | operator-action | Пользователь добавляет блок в `~/.config/opencode/opencode.json` по инструкции из Dev Workflow Example (шаг 2) |
| `infra-base` scope | external-prereq-scope | external-prereq-scope | Уже существует: `specs/infra-base/infra-base.spec.md` |

## 10. Handoff

- **Setup tasks to scaffold:**
  - TSK-01: Добавить блок `mcp.figma` в `opencode.json` и проверить подключение (`opencode mcp list | grep '✓ figma'`)
  - TSK-02: Smoke-test: запросить `get_figma_data` по известному макету, проверить структуру ответа
  - TSK-03: Документировать prompting conventions в `AGENTS.md` для генерации Svelte-компонентов из Figma
- **Effective rules ready for cascade:** наследуются из `infra-base` — см. раздел 5
- **Bootstrap tickets ready for cascade:** см. раздел 9
- **Open risks:**
  - Prompt injection через имена компонентов и текстовые слои Figma — добавить санитизацию в prompting conventions (TSK-03)
  - Утечка `FIGMA_API_KEY` через dotfiles-синхронизацию — исключить `opencode.json` из mackup/chezmoi/nix
  - Сопоставление Figma-компонентов с Svelte-компонентами через prompting (без Code Connect) — хрупко при смене модели LLM; для v2 рассмотреть `figma-components.map.json`
  - Нет фиксации версии `figma-developer-mcp` — риски при командной работе; для v2 добавить `figma-mcp-version` в конфиг проекта
  - Figma REST API может быть deprecate в пользу GraphQL — подписка на changelog
