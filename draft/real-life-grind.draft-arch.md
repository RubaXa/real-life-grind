# Architecture Spec — Real-Life Grind

## 0. Purpose
This document defines the system architecture for a local-first family points product. The architecture is designed to be:
- replaceable at every layer,
- test-driven and evidence-based,
- fast on poor networks,
- offline-safe,
- deployable as a thick client on GitHub Pages,
- controlled by explicit bundle/performance budgets.

The main rule: **no library, framework feature, or implementation detail is allowed to become a structural dependency of the domain**.

---

## 1. Architectural Goals
1. Keep the domain stable even if UI, storage, sync, or calendar libraries change.
2. Make every major capability measurable through tests.
3. Keep the app usable on bad 3G and offline.
4. Keep initial load small and lazy-load everything non-essential.
5. Make replacement of weak libraries safe and incremental.
6. Make local state authoritative until sync succeeds.
7. Prevent unbounded growth of code size and dependency size.

---

## 2. Core Architectural Principles

### 2.1. Replaceability First
Every external dependency must be wrapped behind a small adapter boundary.
Examples:
- UI component libraries behind view adapters,
- storage behind repository interfaces,
- sync behind transport interfaces,
- calendar recurrence behind scheduling interfaces,
- notifications behind event sink interfaces.

The domain layer must not import infrastructure libraries directly.

### 2.2. Testability First
A feature is not accepted unless it has:
- unit tests for domain logic,
- integration tests for persistence/sync boundaries,
- E2E tests for critical flows,
- explicit acceptance criteria.

### 2.3. Local-First First
The local device is the first write target. Any user action must be accepted locally, persisted locally, and only then synced.

### 2.4. Performance Budget First
The system must enforce budgets at build time and in CI. Budgets are not a suggestion — they are a release gate.

### 2.5. Lazy by Default
Only the minimum shell should load initially. Everything else should be deferred by route, feature, or intent.

### 2.6. Thin UI, Fat Domain
UI should be a composition layer over domain and application logic. It should not contain critical business rules.

---

## 3. High-Level System Shape

### 3.1. Runtime Model
The application is a thick client hosted on GitHub Pages. It behaves like a PWA with:
- service worker,
- local cache,
- offline queue,
- optimistic UI,
- sync replay.

### 3.2. Main Layers

1. **Presentation Layer**
   - routes, pages, UI composition, local interactions.

2. **Application Layer**
   - use cases, command orchestration, state transitions, authorization checks, event creation.

3. **Domain Layer**
   - family rules, task rules, approvals, ledger rules, grade rules, purchase rules.

4. **Infrastructure Layer**
   - local persistence, Firebase sync, auth, service worker, caching, logging, telemetry.

5. **Adapter Layer**
   - UI library adapter, storage adapter, sync adapter, calendar adapter, notification adapter.

### 3.3. Implementation Boundaries

| Boundary | Technology |
|----------|-----------|
| Presentation Adapter | Svelte components, route pages, view models |
| Application Services | Command handlers, query builders, orchestration |
| Domain Services | Recurrence rules, approval policies, ledger calculation, visibility checks |
| Infrastructure Adapters | Firebase adapter, local storage adapter, service worker adapter, auth adapter, calendar adapter |

Each adapter must be replaceable without changing the domain logic.

---

## 4. Bounded Contexts
The system should be split into clear bounded contexts. Each context should be independently testable and independently replaceable.

### 4.1. Identity & Family Context
Owns: users, auth identity, family membership, roles, invitations.

### 4.2. Task Context
Owns: task templates, occurrences, visibility rules, ownership rules, completion requests, approvals.

### 4.3. Ledger Context
Owns: transactions, snapshots, balance projections, earned/spent/penalty totals.

### 4.4. School Context
Owns: grades, grade weights, grade-based rewards, grade-based penalties.

### 4.5. Store Context
Owns: reward items, purchase requests, approval flow, item availability.

### 4.6. Inbox & Notifications Context
Owns: pending actions, approvals waiting, system notices, recent events.

---

## 5. Domain Model Rules

### 5.1. Family Isolation
All operational data is scoped to a family. Users may belong to multiple families, but a family's tasks, balances, purchases, and grades are isolated.

### 5.2. Task Recurrence Model
Logical flow:
- **TaskTemplate** defines recurrence intent.
- **ScheduledOccurrence** represents a concrete instance in a window.
- **CompletionEvent** records the fact of completion.
- **ApprovalDecision** accepts or rejects completion.
- **LedgerEntry** records financial effect.
- **BalanceSnapshot** caches the current result.

### 5.3. Completion Is Not a Task Status
Recurring work should not rely on a single mutable "done" flag on the task itself. The task exists as a rule; completion exists as an event.

### 5.4. Approval Is a Separate Decision
Approval is independent from completion. A completion can exist without approval. A ledger entry is created only after approval.

### 5.5. Multipliers
Every completion can carry a multiplier (float). This allows: bonus, reduction, adult-did-it-for-child factor, control work multiplier.

### 5.6. Ledger Is Source of Truth
The current balance is derived from transactions and cached snapshots. The transaction log is canonical. Snapshots are accelerators only.

### 5.7. Burn State
When a task deadline passes:
- Task enters `burned` state.
- Penalty (if configured) is auto-applied as a LedgerEntry — no additional approval needed.
- Task remains visible for a configurable `visible_after_burn` period (default: until end of day).

### 5.8. Grade Validation
- One ordinary grade per subject per day.
- Control work grade is an exception — allowed on the same day.
- Child-submitted grades require parent approval.
- Parent-submitted grades are auto-approved.

---

## 6. Local-First Data Architecture

### 6.1. Local Write Path
All user actions follow the same sequence:
1. validate locally,
2. write to local store,
3. update local projections,
4. enqueue sync operation,
5. refresh UI optimistically,
6. retry sync in background.

### 6.2. Offline Queue
The app must maintain a durable local queue for unsynced operations. The queue must survive reloads, tab closure, and temporary network loss.

### 6.3. Sync Strategy
The sync layer should support:
- idempotent commands,
- conflict detection,
- eventual consistency,
- replay after reconnect.

### 6.4. Conflict Strategy
Conflicts should be explicit and domain-specific. Avoid hidden last-write-wins for business-critical data unless the domain approves it.

### 6.5. Projection Strategy
All UI screens should consume derived projections rather than querying raw events directly. This keeps the UI fast and simplifies offline rendering.

---

## 7. Service Worker Architecture

### 7.1. Mandatory SW Role
The service worker is part of the architecture, not an optional enhancement. It should handle:
- shell caching,
- route fallback,
- static asset cache,
- offline navigation support,
- background sync retry hooks where supported,
- stale-while-revalidate for non-critical assets.

### 7.2. Cache Policy
Use separate cache classes:
- app shell cache,
- immutable asset cache,
- API/data cache,
- runtime offline queue data.

### 7.3. Cache Invalidation
Cache invalidation must be versioned and explicit. Old shell versions should be replaceable without breaking local data.

### 7.4. Offline Behavior
When offline:
- shell should still load,
- existing data should render,
- commands should queue locally,
- user must not lose actions.

---

## 8. Loading Strategy

### 8.1. App Shell
The first payload should contain only what is required to render:
- auth gate,
- minimal navigation,
- current family context,
- primary dashboard skeleton.

### 8.2. Lazy Loading
Load lazily by feature:
- task editor,
- store editor,
- grade editor,
- admin settings,
- analytics,
- calendar-heavy views.

### 8.3. Intent-Based Prefetch
Prefetch only when the user is likely to need a feature. Avoid eager loading all modules on startup.

### 8.4. Route-Based Splitting
Each major route should be split into its own bundle or chunk where practical.

---

## 9. Dependency Policy

### 9.1. Libraries Are Optional, Not Structural
Any library may be used only if:
- it is wrapped behind an adapter,
- it has tests proving value,
- it can be replaced without domain rewrite,
- it respects performance budgets.

### 9.2. Library Replacement Rule
If a library becomes ineffective, heavy, buggy, or unnecessary, it must be removable by changing the adapter and its tests, not the entire application.

### 9.3. No Direct Coupling in Domain
Domain code must not depend on:
- framework internals,
- UI library component types,
- storage implementation details,
- network client specifics.

### 9.4. Dependency Review Gate
Every new dependency must answer:
- what problem it solves,
- what breaks without it,
- how to replace it,
- what tests prove its value,
- what bundle cost it adds.

### 9.5. Non-Structural Library Use Rules
A library may be used for: UI widgets, date handling, charting, forms, validation, drag/drop, calendar rendering. But only if it is behind an adapter, measured, has removal tests, and does not leak into domain logic.

---

## 10. Performance Budgets

### 10.1. Budget Types
The project must define and enforce:
- initial JS bundle budget,
- route chunk budget,
- CSS budget,
- image/asset budget,
- total Lighthouse performance budget,
- service worker cache budget.

### 10.2. Build-Time Enforcement
Budgets must fail CI when exceeded. This should be enforced with:
- bundle analysis,
- size checks,
- route-level chunk checks,
- performance regression tests.

### 10.3. Network Target
The app should remain usable on poor 3G-like conditions. The target is not minimal size at all costs; the target is controlled, predictable load time.

### 10.4. Growth Control
The system must prevent infinite growth of code and dependency weight. Each feature should have a cost and a budget owner.

---

## 11. Testing Strategy

### 11.1. Domain Tests
Must cover: recurrence generation rules, approval rules, multiplier logic, ledger calculations, visibility rules, family isolation.

### 11.2. Integration Tests
Must cover: local store write/read path, offline queue persistence, sync replay, snapshot rebuild, auth/session restoration.

### 11.3. E2E Tests
Must cover critical user journeys:
- create family,
- invite member,
- create task,
- complete task,
- approve completion,
- update balance,
- create purchase request,
- approve purchase,
- enter school grade,
- work offline and reconnect.

### 11.4. Regression Gates
Any regression in core flows, bundle size, offline behavior, or sync reliability should block release.

---

## 12. UI Architecture

### 12.1. Thin UI, Fat Domain
UI should be a composition layer over domain and application logic. It should not contain critical business rules.

### 12.2. Shared Layout
The shell should expose: family switcher, dashboard, inbox, balance, tasks, store, school grades.

### 12.3. Mobile-First but Desktop-Strong
The UX must work on mobile and desktop. Desktop may show richer multi-pane views, while mobile should collapse gracefully.

Breakpoints:
- `mobile`: < 768px — single column, bottom tab bar
- `tablet`: 768–1024px — single column, bottom или side nav
- `desktop`: > 1024px — left sidebar + main + right inbox panel

### 12.4. Optimistic UX
User actions should feel instant. Rollback should happen only when necessary and should be explained.

### 12.5. Animation Tech Stack
CSS-first, progressive enhancement. No WebGPU/Three.js in v1.

| Слой | Технология | Применение |
|------|-----------|------------|
| Card transitions | CSS `transition` + `transform/opacity` | appear, collapse, dim |
| State changes | CSS `@keyframes` | shimmer, pulse, shake |
| Animated gradients | CSS `@property` (Houdini) | burn glow, gold pulse |
| Spring physics | Svelte `spring()` + Web Animations API | slide-to-complete, card expand |
| Particles (optional) | Canvas 2D — lazy loaded | confetti при аппруве (progressive) |

Rule: animate only via `transform`, `opacity`, `filter` — GPU-composited, safe on mobile. Never animate `width`, `height`, `top`, `left`.

---

## 13. Observability and Diagnostics

### 13.1. What to Measure
- sync success rate,
- offline queue depth,
- retry counts,
- bundle size trends,
- route load time,
- critical action latency,
- error rate per context.

### 13.2. Debuggability
The app should expose readable logs for:
- sync failures,
- approval failures,
- ledger inconsistencies,
- queue replay problems.

### 13.3. Evidence-Based Decisions
If a feature or library cannot prove value via tests and metrics, it should be removed or replaced.

---

## 14. Release Criteria
A release is allowed only if:
- offline core flows work,
- critical tests pass,
- size budgets pass,
- sync queue works,
- family isolation is respected,
- ledger is consistent,
- recurring task model works,
- approval flow works,
- bundle growth is within budget.

---

## 15. Open Questions
- Exact data sync algorithm.
- Conflict resolution policy per entity.
- Cache invalidation timing.
- Exact bundle budget numbers.
- Which views load eagerly.
- Whether background sync is available on all target environments.
- Whether some UI libraries should be substituted with native primitives in constrained routes.
- Eager vs lazy occurrence generation.
- Offline merge strategy.
