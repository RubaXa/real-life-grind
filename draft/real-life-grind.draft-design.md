# Design Spec — Real-Life Grind

## 0. Overview

Family Points is a family coordination app with a gamification layer. The visual language is **dark premium game UI** — think Balatro, not a children's app. The interface should feel satisfying and intentional for both the 8-year-old completing tasks and the parent approving them on a MacBook.

Two audiences, one interface. Role (child vs. adult) changes what actions are available, not the visual structure. A child sees their own tasks and balance; a parent sees all children's progress and a queue of items awaiting approval.

Mobile-first (iOS + Android), fully functional on desktop (macOS, Windows). On mobile: bottom tab bar + sticky inbox strip. On desktop: left sidebar + right inbox panel, always visible.

---

## 1. Design Tokens

### 1.1. Colors

```
--c-bg-base:      #0F0F1A   /* страница */
--c-bg-surface:   #1A1A2E   /* карточки */
--c-bg-elevated:  #252545   /* модалки, hover-состояния */
--c-bg-overlay:   #0F0F1A99 /* backdrop */

--c-gold:         #F5C842   /* баллы, ⭐, currency */
--c-gold-glow:    #F5C84240
--c-gold-dim:     #F5C84280

--c-teal:         #4ECDC4   /* primary actions */
--c-teal-glow:    #4ECDC430

--c-red:          #FF6B6B   /* penalty, burn, urgent */
--c-red-glow:     #FF6B6B30

--c-green:        #6BCB77   /* done, success, approved */
--c-green-glow:   #6BCB7730

--c-purple:       #9B8EC4   /* school grades */
--c-muted:        #2E2E52   /* borders, dividers */

--c-text-1:       #F0F0FA   /* primary */
--c-text-2:       #9090B8   /* secondary */
--c-text-3:       #55557A   /* disabled, placeholder */
```

**Palette rules:**
- Gold (#F5C842) is reserved exclusively for points and balance. Never use for generic UI chrome.
- Teal (#4ECDC4) is the primary action color (approve, buy, complete).
- Red (#FF6B6B) is urgency and loss — use sparingly.
- Green (#6BCB77) is success and completion.
- Purple (#9B8EC4) is for school grades exclusively.
- Never use full black (#000000). The layered navy system creates depth.

### 1.2. Typography

| Token | Font | Size | Weight | Use |
|-------|------|------|--------|-----|
| `points` | Inter | 40px | 800 | Balance display only |
| `display` | Inter | 28px | 700 | Section heroes, greetings |
| `heading` | Inter | 20px | 600 | Section titles |
| `body` | Inter | 16px | 400 | Descriptions, content |
| `label` | Inter | 14px | 500 | Badges, buttons, metadata |
| `caption` | Inter | 12px | 400 | Timestamps, helper text |
| `timer-calm` | Inter Mono | 12px | 400 | Calm timer state |
| `timer-urgent` | Inter Mono | 14px | 600 | Urgent timer state |

Inter is primary for all UI text. Inter Mono for timers only — prevents layout shift as digits change.

### 1.3. Spacing

```
--space-1: 4px;   --space-2: 8px;   --space-3: 12px;
--space-4: 16px;  --space-5: 20px;  --space-6: 24px;
--space-8: 32px;  --space-10: 40px;
```

Card gap: 8px between cards in a list. Section gap: 24px. Inner card padding: 16px.

### 1.4. Border Radius

```
--radius-sm:   8px    /* chips, tags, avatar crops */
--radius-md:   16px   /* standard cards, dialogs, panels */
--radius-lg:   24px   /* bottom sheets, large modals */
--radius-pill: 999px  /* buttons, badges, segment controls, slide track */
```

Do not mix radius sizes within a single card. All cards use `md`.

### 1.5. Motion

```
--motion-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
--motion-quick:  cubic-bezier(0.4, 0, 0.2, 1);
--motion-ease:   cubic-bezier(0.25, 0.1, 0.25, 1);

--duration-instant: 80ms;
--duration-fast:    150ms;
--duration-base:    280ms;
--duration-slow:    450ms;
```

### 1.6. Elevation & Depth

| Level | Token | Use case |
|-------|-------|----------|
| Base | `--c-bg-base` | Page background |
| Surface | `--c-bg-surface` | Cards, tab bar, sidebar |
| Elevated | `--c-bg-elevated` | Modals, hover states, inbox strip |

Borders: `--c-muted` (#2E2E52) at 1px. Avoid black drop shadows; use glow effects with colored light.

**Glow rules:**
- Gold glow: `0 0 16px #F5C84233` — balance, earning points
- Teal glow: `0 0 12px #4ECDC430` — active/hover primary buttons
- Red glow: `0 0 12px #FF6B6B30` — urgent timers, burned borders
- Awaiting approval: `0 0 0 1px #F5C842, 0 0 8px #F5C84240` — gold border glow

### 1.7. Animation Hooks

```css
--anim-card-complete:  shimmer 0.4s var(--motion-quick);
--anim-points-land:    tick-up 0.6s var(--motion-spring);
--anim-gold-glow:      gold-pulse 0.3s var(--motion-ease);
--anim-burn-idle:      burn-pulse 2s ease infinite;
--anim-timer-urgent:   urgent-shake 0.5s var(--motion-spring) infinite;
--anim-card-appear:    slide-up 0.28s var(--motion-spring);
--anim-approve:        pop-confetti 0.5s var(--motion-spring);
```

### 1.8. Component Style Tokens
Explicit named token definitions from the YAML design system:

```css
/* Cards */
.card { background: var(--c-bg-surface); border-radius: var(--radius-md); padding: var(--space-4); }
.card-elevated { background: var(--c-bg-elevated); border-radius: var(--radius-md); padding: var(--space-4); }

/* Buttons */
.button-primary { background: var(--c-teal); color: var(--c-bg-base); border-radius: var(--radius-pill); padding: var(--space-4) var(--space-6); font: var(--label); }
.button-approve { background: var(--c-green); color: var(--c-bg-base); border-radius: var(--radius-pill); }
.button-reject { background: transparent; color: var(--c-red); border-radius: var(--radius-pill); }
.button-buy { background: var(--c-teal); color: var(--c-bg-base); border-radius: var(--radius-pill); }

/* Badges */
.badge-points { background: transparent; color: var(--c-gold); font: var(--label); }
.badge-penalty { background: transparent; color: var(--c-red); font: var(--label); }

/* Balance */
.balance-display { color: var(--c-gold); font: var(--points); }

/* Inbox strip */
.inbox-strip { background: var(--c-bg-elevated); color: var(--c-text-1); border-radius: 0; }

/* Tab bar */
.tab-bar { background: var(--c-bg-surface); height: 64px; }
.tab-active { color: var(--c-teal); }
.tab-inactive { color: var(--c-text-2); }

/* Slide-to-complete */
.slide-to-complete { background: var(--c-bg-elevated); border-radius: var(--radius-pill); height: 52px; }

/* Segment control */
.segment-control { background: var(--c-bg-elevated); color: var(--c-text-2); border-radius: var(--radius-pill); }
.segment-active { background: var(--c-bg-surface); color: var(--c-text-1); border-radius: var(--radius-pill); }
```

---

## 2. Layout System

### 2.1. Device Context
- Ребёнок → iOS телефон
- Мама → iOS телефон
- Папа → macOS компьютер
- Дедушка → Windows компьютер
- Бабушка → Android телефон

### 2.2. Mobile (< 768px)
Single column, bottom tab bar, sticky inbox strip above tab bar.

```
┌─────────────────────────┐
│ ☰  Lebedev Family  🔔 3 │  header
├─────────────────────────┤
│      [page content]     │
├─────────────────────────┤
│ ⚡ Уборка ждёт аппрув [→]│  inbox strip (always visible)
├─────────────────────────┤
│  🏠     📋     🛒     📚 │  tab bar with labels
│ Home  Tasks  Shop Grades│
└─────────────────────────┘
```

### 2.3. Desktop (> 1024px)
Left sidebar (200px fixed, icon + label), main content (flex-fill), right inbox panel (280px fixed). App logo/icon at top of sidebar. User avatar + name at bottom.

```
┌──────────┬───────────────────────────┬───────────────┐
│ 🏠 Home  │  Lebedev Family      [+]  │  Inbox    (3) │
│ 📋 Tasks │                           │───────────────│
│ 🛒 Shop  │    [page content]         │ 🟡 Вася       │
│ 📚 Grades│                           │   Уборка ждёт │
│          │                           │   [✓]  [✗]   │
│ ──────── │                           │───────────────│
│ 👤 Вася  │                           │ 🟡 Маша       │
└──────────┴───────────────────────────┴───────────────┘
```

### 2.4. Information Hierarchy (5 layers)
1. **Header** — family name + notifications (always present)
2. **Page content** — primary screen content
3. **Inbox strip** — sticky above tab bar on mobile
4. **Tab bar** — 4 primary destinations: Home, Tasks, Store, Grades
5. **Right panel** (desktop only) — persistent inbox + approval queue

---

## 3. Components

### 3.1. Task Card
The atomic unit of the interface. Appears on Home, Tasks, and Inbox.

**Collapsed:** status indicator (left edge accent line), task name, deadline, timer, points badge.

**Left accent line colors by state:**
- Teal: pending / active
- Green: done
- Gold + pulse: awaiting approval
- Red: urgent (< 10% time remaining)
- Red dim: burned

**Expanded (accordion):** tap → adds description text + action zone. Only one card expanded at a time.

### 3.2. Slide-to-Complete
Pill-shaped track, height: 52px, draggable thumb on left with teal glow. Requires intentional drag to prevent accidental completion.
- On successful slide: shimmer sweep across card → transitions to done or awaiting-approval.
- On release before threshold: spring snap-back.
- Adult view: `[✓ Принять]` `[✗ Отклонить]` inline buttons instead of slider.

### 3.3. Balance Display
Gold number with `points` typography (40px/800). Always visible in header.
- Points earned: number animates upward (tick-up) with brief gold glow pulse.
- Tapping balance → push-screen with transaction history.
- v1: just number + ⭐ icon, no progress bar.

### 3.4. Inbox Strip (mobile)
Always visible above tab bar, never hidden:
- Has pending items: first pending action + count badge.
- Empty: "Всё в порядке ✓" in secondary color.
- Tapping → full Inbox screen.

### 3.5. Inbox Screen
Two sections on one screen:
1. **"Требуют действия"** — pinned top, inline approve/reject buttons
2. **"Недавние события"** — chronological event log, read-only
Filter toggle (for adults with multiple children): `[Все события] [Только мои]`.

### 3.6. Store Items
List (not grid). Each item: SVG icon + name + description + price in gold + quantity (∞ for unlimited).
Expanded: `[Купить · N ⭐]` button (intentional, not a slider). After purchase request: `pending` state with gold border.

### 3.7. Tab Bar
Four tabs: Home / Задачи / Магазин / Оценки. Icons with text labels always. Active tab: teal, inactive: muted. Height: 64px.
A11y: aria-label, aria-current="page", visible custom focus ring, keyboard nav (Tab / Shift+Tab / Enter / Space), tooltip on hover (desktop collapsed). All navigation text passes WCAG AA contrast.

### 3.8. Urgency Timer
Always rendered for tasks with deadline. Visual intensity scales with % time remaining:

| % Time | State | Visual |
|--------|-------|--------|
| 100–50% | `calm` | Caption size, disabled color |
| 50–25% | `moderate` | Label size, secondary color |
| 25–10% | `warning` | Label size, amber/warning |
| 10–0% | `urgent` | timer-urgent style, red glow, shake animation |

Each task can have its own `effect_set`. v1: one default set.

---

## 4. Form Components

### 4.1. Create Task Form
Basic fields always visible: Название, Описание, Кому, Повтор, Время, Награда.

Additional fields as chips below (tap = inline expand):
- `+ Штраф` → penalty field + burn field (linked)
- `+ Приоритет` → priority select
- `+ Видимость` → adult visibility
- `+ Аппрув` → approval required + who can approve

Chip after activation: filled style. Field appears via slide-down animation.

**Mobile:** push-navigation (new screen). **Desktop:** inline right panel (split-view).

### 4.2. Grade Entry Form
- Дата, Предмет (dropdown from family subjects), Оценка (pill-selector 2–5), Тип (Обычная / Контрольная).
- Grade "1" not shown to avoid confusion with penalties.
- Child submitting: info "Оценка будет видна после одобрения".
- Parent submitting: info "Баллы начислятся сразу" (green).
- Duplicate protection: same day, same subject, ordinary grade → warning + block.

---

## 5. Screen Specifications

### 5.1. Home — Child (mobile)
- Header: hamburger, family name, bell with badge.
- Balance: `⭐ 1 240 баллов` in points typography, gold glow.
- Section "СЕГОДНЯ" — always first, not hidden by filter.
- Task cards (8px gap): done (green, dim), pending (teal, calm timer), urgent (red glow, shake), burned (red dim, fire icon).
- Segment control: [Завтра] [Неделя] [Месяц].
- Section "ЗАВТРА" with pending cards.
- Sticky inbox strip + tab bar.

### 5.2. Home — Adult (mobile)
- Header: hamburger, family name, bell with badge.
- Section "СЕГОДНЯ" — children cards (2-column grid): avatar, name, `⭐ N` balance, `M / N ✓` progress.
- Section "ЖДУТ ТЕБЯ" with count badge — approval cards (gold border, inline [✓ Принять] [✗]).
- Segment control + "ЗАВТРА" section.
- Sticky inbox strip: "⚡ N действий требуют подтверждения →"

### 5.3. Tasks — Child (timeline)
- Segment control: [День] [Неделя] [Месяц].
- Date groups (teal for today, secondary for future, muted for past).
- Task cards per date group (compact, no expand arrow).
- Sticky strip + tab bar.

### 5.4. Tasks — Adult (template management)
- Filter chips: [Все ●] [Активные] [Архив].
- Task template list: name, assignee, recurrence, reward, "…" menu.
- Expanded: [✎ Редактировать] [📦 Архивировать] [🗑 Удалить].
- `[+]` button in header to create task.

### 5.5. Store — Child
- Header with balance inline.
- Item list: SVG icon, name, description, price, quantity (∞).
- Expanded: description + `[Купить · N ⭐]` button.
- After buy: `pending` state, gold border, "Ждёт одобрения".

### 5.6. Grades
- Purple accent on entries.
- Chronological list, newest first.
- States: approved (green dot, full color), pending (gold dot, dim), penalty (red accent).
- `[+]` button in header → push form.

### 5.7. Balance History (push screen)
- Access: tap `⭐ N` on any screen.
- Summary: current balance (large, gold glow) + earned/spent/penalty breakdown.
- Transaction history: chronological, color-coded (green earn, red spend, gold grade, red dim penalty).

### 5.8. Inbox — Full Screen
- "ТРЕБУЮТ ДЕЙСТВИЯ" — approval cards with inline [✓] [✗].
- "НЕДАВНИЕ СОБЫТИЯ" — read-only event log, color-coded dots.
- Tab bar visible (no active tab — inbox is not a tab).

### 5.9. Onboarding Flow
```
[Google Auth] → новый? → ONBOARDING (создать / join invite) → HOME
```
- Auth screen: "Family Points" + tagline + "Войти через Google".
- Create or Join screen: "Создать семью" / "Присоединиться" + invite code input.
- Create Family form: название семьи + role chip selector [Мама] [Папа] [Бабушка] [Дедушка] [Другое].
- Invite link → pre-filled join screen with role from invite.

---

## 6. Screen Flow

```
         [Google Auth]
               │
               ▼
    ┌──────────────────────┐
    │  новый?  → ONBOARDING│
    │           создать /  │
    │           join invite│
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────┐
    │         HOME         │◄──── always return here
    │  Today + pending     │
    └──┬──────┬────────────┘
       │      │ tap ⭐
       │      ▼
       │  ┌──────────┐
       │  │ BALANCE  │ (push)
       │  │ история  │
       │  └──────────┘
       │
  tab bar ──────────────────────────────┐
       │                                │
   ┌───▼───┐  ┌───────┐  ┌──────────┐  │
   │ TASKS │  │ STORE │  │ GRADES   │  │
   │child: │  │ list  │  │ лента    │  │
   │таймлн │  │ купить│  │ + форма  │  │
   │adult: │  │→inbox │  │ (push)   │  │
   │шаблоны│  └───────┘  └──────────┘  │
   │+форма │                            │
   │(push) │                            │
   └───────┘                            │
                                        │
   strip/badge ──► INBOX ───────────────┘
                   │ требуют действия
                   │ + лента событий

   ☰ ──► семьи / настройки / выход
         управление предметами
         управление товарами (adult)
         invite members
```

---

## 7. Design Decision Log

| ID | Topic | Status |
|----|-------|--------|
| D-01 | Адаптивный дизайн (mobile-first, desktop-enhanced) | Принято |
| D-02 | Единый интерфейс, роль меняет доступ | Принято |
| D-03 | Геймификация через CSS-токены (смена темы = смена файла) | Принято |
| D-04 | Inbox: sticky strip mobile + колонка desktop | Принято |
| D-05 | Тема: dark premium (Balatro-like), SVG animations | Принято |
| D-06 | Баланс: только число + иконка, без прогресс-бара (v1) | Принято |
| D-07 | Today всегда закреплён, фильтр ниже | Принято |
| D-08 | Burn state: настраивается на задаче (burn_at + visible_after_burn) | Принято |
| D-09 | Таймер: всегда виден, urgency-шкала (4 уровня) | Принято |
| D-10 | Tab bar: адаптивный + a11y (aria-label, focus ring, keyboard nav) | Принято |
| D-11 | Task card: expand inline (accordion, не push) | Принято |
| D-12 | Содержимое карточки: collapsed (название+таймер+награда), expanded (+описание) | Принято |
| D-13 | Slide-to-complete жест (не кнопка). Adult: inline кнопки [✓] [✗] | Принято |
| D-14 | Rejected task: ребёнок видит только в Inbox, без re-submit (v1) | Принято |
| D-15 | Экран Tasks: роль-зависимый (child=таймлайн, adult=шаблоны) | Принято |
| D-16 | Animation tech stack: CSS-first, no WebGPU/Three.js | Принято |
| D-17 | Форма задачи: mobile push, desktop inline right panel | Принято |
| D-18 | Progressive disclosure в форме: базовые поля + chips | Принято |
| D-19 | Магазин: список карточек (не grid), 4 базовых товара (∞) | Принято |
| D-20 | Экран Оценок: защита дубликатов, разные потоки для child/parent | Принято |
| D-21 | Переключение семей: через ☰ меню (редкая операция) | Принято |
| D-22 | Inbox screen: 2 зоны (действия + события), фильтр [Все/Мои] | Принято |
| D-23 | Экран Баланса: push при тапе на ⭐, не отдельная вкладка | Принято |
| D-24 | Онбординг flow: Google Auth → Create/Join → Home | Принято |
| D-25 | Предметы: предустановленный список, редактируется семьёй | Принято |

---

## 8. Wireframes

### 8.1. Today — Child — Mobile
```
┌─────────────────────────┐
│ ☰  Lebedev Family  🔔 3 │
├─────────────────────────┤
│  Привет, Вася           │
│  ⭐ 1 240  баллов        │  gold glow, tick-up при получении
│                         │
│  СЕГОДНЯ ─────────────  │  always here
│  ┌─────────────────────┐│
│  │ ✓  Зубы              ││  done: dim + checkmark
│  └─────────────────────┘│
│  ┌─────────────────────┐│
│  │ ○  Уборка      +30  ││
│  │    ⏱ 2ч 14м  [calm] ││  timer calm
│  └─────────────────────┘│
│  ┌─────────────────────┐│
│  │ ○  Математика   +20  ││
│  │    ⏱ 0ч 28м 🔴 shake││  urgent: red + shake
│  └─────────────────────┘│
│  ┌─────────────────────┐│
│  │ 🔥 Английский        ││  burned: red border
│  │    сгорела · −10 pts ││  penalty auto-applied
│  └─────────────────────┘│
│                         │
│  [Завтра] [Неделя] [Мес]│  segment control
│                         │
│  ЗАВТРА ──────────────  │
│  ┌─────────────────────┐│
│  │ ○  Английский   +20  ││
│  └─────────────────────┘│
├─────────────────────────┤
│ ⚡ Уборка ждёт аппрув [→]│
├─────────────────────────┤
│  🏠     📋     🛒     📚 │
└─────────────────────────┘
```

### 8.2. Today — Adult — Mobile
```
┌─────────────────────────┐
│ ☰  Lebedev Family  🔔 3 │
├─────────────────────────┤
│  Привет, Папа           │
│                         │
│  СЕГОДНЯ ─────────────  │
│  ┌──────────┬──────────┐│
│  │ 👦 Вася  │ 👧 Маша  ││
│  │ ⭐ 1 240  │ ⭐  890  ││
│  │ 2 / 4 ✓  │ 4 / 4 ✓  ││
│  └──────────┴──────────┘│
│                         │
│  Ждут тебя  (2)         │
│  ┌─────────────────────┐│
│  │ 🟡 Вася · Уборка     ││
│  │ [✓ Принять] [✗ Откл]││
│  ├─────────────────────┤│
│  │ 🟡 Маша · Магазин   ││
│  │    PlayStation +1h  ││
│  │ [✓ Принять] [✗ Откл]││
│  └─────────────────────┘│
│                         │
│  [Завтра] [Неделя] [Мес]│
│  ЗАВТРА ──────────────  │
│  ┌─────────────────────┐│
│  │ ○  Английский · Вася ││
│  └─────────────────────┘│
├─────────────────────────┤
│ ⚡ 3 действия требуют... │
├─────────────────────────┤
│  🏠     📋     🛒     📚 │
└─────────────────────────┘
```

### 8.3. Task Card States
```
COLLAPSED (pending):
┌─────────────────────────────┐
│ ○  Уборка в комнате    +30  │
│    до 18:00  ⏱ 2ч 14м       │
└─────────────────────────────┘

EXPANDED (child):
┌─────────────────────────────┐
│ ○  Уборка в комнате    +30  │
│    до 18:00  ⏱ 2ч 14м       │
│ ─────────────────────────── │
│  Убери вещи со стола,       │
│  сложи одежду в шкаф...     │
│                             │
│ ╔═══════════════════════╗   │
│ ║ ●━━━━━━━━━━━━━  Готово║   │
│ ╚═══════════════════════╝   │
└─────────────────────────────┘

DONE:
┌─────────────────────────────┐  dim
│ ✓  Уборка в комнате    +30  │
│    выполнено · 15:42        │
└─────────────────────────────┘

AWAITING APPROVAL:
┌─────────────────────────────┐  gold border + pulse
│ ⏳ Уборка в комнате    +30  │
│    Ждёт подтверждения папы  │
└─────────────────────────────┘

BURNED:
┌─────────────────────────────┐  dim + red border
│ 🔥 Уборка в комнате   −10   │
│    сгорела · 15:00          │
└─────────────────────────────┘

ADULT EXPANDED (awaiting):
┌─────────────────────────────┐  gold border
│ ⏳ Вася · Уборка       +30  │
│    выполнено в 15:42        │
│ ─────────────────────────── │
│  Убери вещи со стола...     │
│                             │
│  [✓ Принять]  [✗ Отклонить] │
└─────────────────────────────┘
```

### 8.4. Store — Child — Mobile
```
┌─────────────────────────┐
│ ☰  Lebedev Family  🔔   │
├─────────────────────────┤
│  Магазин          ⭐1240 │
│                         │
│  ┌─────────────────────┐│
│  │ 📱  +15 мин телефон  ││
│  │     ∞  ·  50 ⭐      ││
│  └─────────────────────┘│
│  ┌─────────────────────┐│
│  │ 📱  +1ч телефон      ││
│  │     ∞  ·  150 ⭐     ││  ← expanded:
│  │  ─────────────────  ││
│  │  Один час на телефон ││
│  │                      ││
│  │  [Купить · 150 ⭐]   ││
│  └─────────────────────┘│
│  ┌─────────────────────┐│
│  │ 💻  +1ч компьютер    ││
│  │     ∞  ·  150 ⭐     ││
│  └─────────────────────┘│
│  ┌─────────────────────┐│
│  │ 🎮  +1ч приставка    ││
│  │     ∞  ·  200 ⭐     ││
│  └─────────────────────┘│
├─────────────────────────┤
│ ⚡ ...                   │
├─────────────────────────┤
│  🏠     📋     🛒     📚 │
└─────────────────────────┘
```

### 8.5. Grades — Mobile
```
┌───────────────────────────┐
│  Математика      5  ⭐+50  │  approved, green dot
│  16 мая · обычная         │
├───────────────────────────┤
│  Английский      3  ⭐+20  │
│  15 мая · обычная         │
├───────────────────────────┤
│  История         4  ⭐+35  │  pending, gold dot
│  15 мая · внёс Вася · ⏳  │
└───────────────────────────┘
```

### 8.6. Inbox — Mobile
```
┌─────────────────────────┐
│ ←  Inbox            (3) │
├─────────────────────────┤
│  Требуют действия       │
│  ┌─────────────────────┐│
│  │ 🟡 Вася · Уборка     ││
│  │  [✓ Принять] [✗]    ││
│  └─────────────────────┘│
│  ┌─────────────────────┐│
│  │ 🟡 Маша · +1ч тел.  ││
│  │  [✓ Принять] [✗]    ││
│  └─────────────────────┘│
│                         │
│  Недавние события       │
│  ┌─────────────────────┐│
│  │ ✓ Вася заработал+30 ││
│  └─────────────────────┘│
│  ┌─────────────────────┐│
│  │ ✗ Уборка отклонена  ││
│  └─────────────────────┘│
├─────────────────────────┤
│  🏠     📋     🛒     📚 │
└─────────────────────────┘
```

### 8.7. Balance History — Mobile
```
← Баланс Васи

  ⭐ 1 240   текущий баланс     ← крупно, gold glow
  ──────────────────────────
  Заработано   2 400
  Потрачено      800
  Штрафы         360

  История  ──────────────────

  ┌──────────────────────────┐
  │ +30  Уборка              │  green
  │      сегодня · 15:42     │
  ├──────────────────────────┤
  │ −150 PlayStation +1ч     │  red
  │      вчера · 19:10       │
  ├──────────────────────────┤
  │ +50  История 5           │  gold (grade)
  │      вчера · 16:00       │
  ├──────────────────────────┤
  │ −10  Зубы · штраф        │  red dim
  │      вчера · сгорела     │
  └──────────────────────────┘
```

### 8.8. Create Task Form — Mobile
```
←  Новая задача

  Название
  ┌─────────────────────┐
  │                     │
  └─────────────────────┘
  Описание
  ┌─────────────────────┐
  │                     │
  └─────────────────────┘
  Кому         [Вася  ▼]
  Повтор   [Ежедн.   ▼]
  Время      [18:00  ▼]
  Награда        [+30 ▼]

  ┌──────┐ ┌──────────┐
  │+Штраф│ │+Приоритет│    ← chips
  └──────┘ └──────────┘
  ┌────────────┐
  │+Видимость  │
  └────────────┘

  [     Создать задачу  ]
```

### 8.9. Grade Entry Form — Mobile
```
← Внести оценку

Дата          [16 мая ▼]
Предмет       [Математика ▼]

Оценка        [ 2 ][ 3 ][ 4 ][ 5 ]   ← pill-selector

Тип           [○ Обычная  ○ Контрольная]

              [Внести]
```

### 8.10. Rejected Task — Inbox Item
```
┌─────────────────────────────┐
│ ✗  Уборка отклонена         │
│    Папа · "Не до конца"     │
│    15 мая · 16:04           │
└─────────────────────────────┘
```

### 8.11. Tasks — Child Timeline (mobile)
```
┌─────────────────────────┐
│ ☰  Lebedev Family  🔔   │
├─────────────────────────┤
│  Задачи                 │
│  [День] [Неделя] [Месяц]│
│                         │
│  Пн 16 · сегодня        │  ← teal bold
│  ┌─────────────────────┐│
│  │ ✓  Зубы        +10  ││
│  │ ⏳ Уборка      +30  ││
│  │ ○  Математика  +20  ││
│  └─────────────────────┘│
│  Вт 17                  │  ← secondary color
│  ┌─────────────────────┐│
│  │ ○  Английский  +20  ││
│  │ ○  Зубы        +10  ││
│  └─────────────────────┘│
│  Ср 18                  │  ← muted
│  ┌─────────────────────┐│
│  │ ○  Математика  +20  ││
│  └─────────────────────┘│
├─────────────────────────┤
│  🏠     📋     🛒     📚 │
└─────────────────────────┘
```

### 8.12. Tasks — Adult Template Management (mobile)
```
┌─────────────────────────┐
│ ☰  Lebedev Family   [+] │  ← + создать задачу
├─────────────────────────┤
│  Задачи                 │
│  [Все▼] [Активные] [Арх]│
│                         │
│  ┌─────────────────────┐│
│  │ Уборка в комнате    ││
│  │ Вася · ежедневно    ││
│  │ +30 pts · до 18:00  ││  ← "…" menu icon
│  └─────────────────────┘│
│  ┌─────────────────────┐│
│  │ Математика          ││
│  │ Вася · пн–пт · +20  ││
│  └─────────────────────┘│
│  ┌─────────────────────┐│
│  │ Зубы                ││
│  │ Все дети · ежедн.   ││
│  │ +10 pts             ││
│  └─────────────────────┘│
│                         │
│  ── EXPANDED:           │
│  ┌─────────────────────┐│
│  │ Уборка в комнате    ││
│  │ [✎ Ред.] [📦 Арх.]  ││
│  │ [🗑 Удалить]        ││  ← red
│  └─────────────────────┘│
├─────────────────────────┤
│  🏠     📋     🛒     📚 │
└─────────────────────────┘
```

### 8.13. Onboarding Screens (mobile)

**Auth screen:**
```
┌─────────────────────────┐
│                         │
│    ⭐ Family Points      │  ← display typography
│  Семейная система       │  ← tagline, secondary
│  задач и баллов          │
│                         │
│   [G  Войти через Google]│  ← pill button
│                         │
│  Вход защищён Google    │  ← secondary text
│  аккаунтом              │
└─────────────────────────┘
```

**Create or Join:**
```
┌─────────────────────────┐
│                         │
│  Добро пожаловать!      │  ← display
│                         │
│  [  Создать семью    ]  │  ← primary pill
│                         │
│  ——— или ———            │
│                         │
│  [Присоединиться]       │  ← ghost pill
│                         │
│  ┌─────────────────────┐│
│  │ код или ссылка      ││  ← invite input
│  └─────────────────────┘│
└─────────────────────────┘
```

**Create Family form:**
```
┌─────────────────────────┐
│ ←  Новая семья          │
├─────────────────────────┤
│  Название семьи         │
│  ┌─────────────────────┐│
│  │ Семья Лебедевых     ││
│  └─────────────────────┘│
│                         │
│  Твоя роль в семье      │
│  [Мама] [Папа] [Бабушка]│  ← chip selector
│  [Дедушка] [Другое]     │
│                         │
│  [   Создать семью   ]  │
└─────────────────────────┘
```

---

## 9. Animation Specifications

### 9.1. Slide-to-Complete (Svelte spring)
```ts
const pos = spring(0, { stiffness: 0.3, damping: 0.7 });
// on release: if x > 80% → complete(); else snap back
```

### 9.2. Burn Effect (CSS @property)
```css
@property --glow-r {
  syntax: '<number>'; inherits: false; initial-value: 0;
}
.card--burned {
  background: linear-gradient(
    135deg,
    hsl(0 70% calc(15% + var(--glow-r) * 5%)),
    hsl(20 80% calc(10% + var(--glow-r) * 3%))
  );
  box-shadow: 0 0 calc(var(--glow-r) * 12px) #FF6B6B44;
  animation: burn-breathe 2s ease-in-out infinite;
}
@keyframes burn-breathe {
  0%, 100% { --glow-r: 0; }
  50%       { --glow-r: 1; }
}
```

### 9.3. Urgent Shake (CSS @keyframes)
```css
@keyframes urgent-shake {
  0%, 100% { transform: translateX(0); }
  20%      { transform: translateX(-3px) rotate(-0.5deg); }
  60%      { transform: translateX(3px)  rotate(0.5deg); }
}
```

### 9.4. Animation Rules
- GPU path only: `transform`, `opacity`, `filter`.
- Never animate `width`, `height`, `top`, `left` — use transform equivalents.
- Gold glow reserved for points/balance.
- Red glow reserved for urgency/burn.
- Use gold only for points and balance — it must feel like real currency.

---

## 10. Do's and Don'ts

**Do:**
- Use gold exclusively for points and balance.
- Animate on the GPU path only: transform, opacity, filter.
- Show the inbox strip even when empty.
- Use pill radius for all interactive controls.
- Label tab bar icons — children need text labels.
- Show burned tasks until end of day (or configured grace period).
- SVG icons with animation (not raster).

**Don't:**
- Use pixel art, heavy textures, or illustrated backgrounds in default theme.
- Animate width, height, top, or left.
- Hide the inbox strip when empty.
- Use red/gold glow for decorative purposes.
- Put more than 4 items in the tab bar.
- Show progress bars toward a goal next to balance (v1).
- Use Three.js, WebGPU, or heavy canvas for card-level effects.

---

## 11. Theming

All visual identity is defined by CSS tokens. Theme change = swap token file, components unchanged.

Roadmap:
- `default` — dark premium (v1, priority)
- `minecraft` — pixel art, blocky (v2)
- `geodash` — neon dark (v2)
- `pastel` — light neutral (v2)

---

## 12. Open Design Questions
- Desktop inbox panel — fixed width or resizable?
- Grade "1" — show in form or not?
- Family settings — separate screen or part of ☰ menu inline?
- Burn animation on first open — inline or full-screen overlay?
- Family switching — bottom sheet or separate screen?
