# Stoker — Design System

**Companion to:** `PRD.md`, `ARCHITECTURE.md`
**Applies to:** Stoker Console (web), Stoker Field (mobile, simulated in the browser), the Simulator
**Implementation:** Tailwind CSS v4 tokens as CSS variables, components in `packages/ui`

---

## 1. Direction: the boiler house

Stoker's world is boiler plate steel, pressure gauges, sacks of rice husk and wood chips, fuel trucks with hand-painted plates, and the ruled pages of a cash register book. The interface borrows from that world instead of from generic SaaS.

- **Steel and water for structure.** Cool, slightly green-grey surfaces and a deep slate ink, like painted boiler housing. Calm enough to stare at all day.
- **Husk ochre for fuel.** The colour of biomass marks anything to do with fuel and deliveries, and nothing else.
- **Gauge red only for real pressure.** Red is reserved for things that need someone to act: a disputed delivery, a float overdrawn, a reading out of range.
- **The gauge is the signature.** Money in a float and fuel at a site are shown as a pressure gauge: a 240° dial with a needle and marked zones. It's the one bold, memorable element; everything around it stays quiet and disciplined.
- **Ledger discipline.** Numbers are right-aligned, tabular and never decorated. Financial screens read like a well-kept register.

### Design principles

1. **Show the money trail.** Every number is clickable down to the receipt or photo that produced it.
2. **State before detail.** Every record shows its lifecycle state first (pill + where it is in the sequence), then the details.
3. **Proof is content.** Photos and videos from site are shown large, with their time and location attached, never as tiny attachments.
4. **Two audiences, one language.** The console is dense and keyboard-friendly; the field app is big, thumb-first and readable in sunlight. They share colours, words and states so a supervisor and a finance clerk mean the same thing by "Pending".
5. **Quiet by default, loud when it matters.** No decorative gradients, no animated entrances. Colour and motion are spent on alerts and on the data flowing in.

## 2. Colour

### 2.1 Core palette

| Name | Hex | Role |
|---|---|---|
| **Plate** | `#EEF1EF` | App background (Day). Cool steel-grey with a hint of green |
| **Boiler** | `#1F2B2E` | Primary ink, sidebar background, headings |
| **Feedwater** | `#1D5C78` | Primary actions, links, focus, selected states |
| **Husk** | `#B7832A` | Fuel, deliveries, fuel stock. Never used for buttons or general accents |
| **Gauge red** | `#B3341F` | Danger, disputes, overdrawn, out of range |
| **Condensate** | `#2E7A55` | Success, verified, approved, inside geofence |

### 2.2 Full token set — Day theme

| Token | Value | Use |
|---|---|---|
| `--bg` | `#EEF1EF` | Page background |
| `--surface` | `#FFFFFF` | Panels, tables, cards |
| `--surface-sunk` | `#E4E9E6` | Inset areas, table header, input wells |
| `--surface-raised` | `#FFFFFF` + `--shadow-overlay` | Menus, dialogs, popovers only |
| `--line` | `#D3DAD6` | Default borders, dividers |
| `--line-strong` | `#AEB9B4` | Input borders, emphasised dividers |
| `--ink` | `#1F2B2E` | Primary text |
| `--ink-2` | `#4A5A5E` | Secondary text |
| `--ink-3` | `#6E7D80` | Tertiary text, placeholders (meets 4.5:1 on `--surface`) |
| `--ink-inverse` | `#F4F7F5` | Text on dark (sidebar, solid buttons) |
| `--primary` | `#1D5C78` | Primary buttons, links |
| `--primary-hover` | `#174B62` | |
| `--primary-soft` | `#DCEAF0` | Selected rows, active nav item background |
| `--focus` | `#2B7BA0` | 2px focus ring, offset 2px |
| `--fuel` | `#B7832A` | Fuel accents, delivery icons, fuel charts |
| `--fuel-soft` | `#F4E8CF` | Fuel pill backgrounds, fuel row highlights |
| `--ok` | `#2E7A55` | |
| `--ok-soft` | `#DCEFE4` | |
| `--warn` | `#A96A0A` | Waiting, needs info, low float |
| `--warn-soft` | `#FBEBCD` | |
| `--danger` | `#B3341F` | |
| `--danger-soft` | `#F8DDD6` | |
| `--info` | `#3F5F8A` | Neutral information, in transit |
| `--info-soft` | `#E1E8F3` | |

### 2.3 Night shift theme

Supervisors and operators work night shifts, and the control room often runs at night. The dark theme is named **Night shift** in the UI and uses deep slate-teal, not black.

| Token | Value |
|---|---|
| `--bg` | `#132024` |
| `--surface` | `#1A2A2F` |
| `--surface-sunk` | `#101B1E` |
| `--line` | `#2B3E44` |
| `--line-strong` | `#3F565D` |
| `--ink` | `#E6EDEA` |
| `--ink-2` | `#B3C2C0` |
| `--ink-3` | `#879896` |
| `--primary` | `#5FA9C9` |
| `--primary-soft` | `#1E3D4A` |
| `--fuel` | `#D9A54C` |
| `--fuel-soft` | `#3A2F1A` |
| `--ok` | `#5DBA8A` / soft `#1C3A2C` |
| `--warn` | `#E0A23C` / soft `#3B2E14` |
| `--danger` | `#E9765F` / soft `#43211A` |
| `--info` | `#8FAAD3` / soft `#24324A` |

### 2.4 Colour rules

- **Husk means fuel.** If a screen uses ochre, it is talking about biofuel. This makes fuel instantly findable on dashboards and timelines.
- **Red means act now.** Don't use red for decoration, negative numbers in normal ledgers, or "delete" buttons that are routine. Destructive confirmations use a red button only inside the confirmation dialog.
- **Negative money is shown with a minus sign and `--ink`, not red.** A credit in a ledger is normal, not an error.
- **Soft backgrounds pair with their strong colour for text** (e.g. pill text `--ok` on `--ok-soft`). All pairs meet 4.5:1.
- **Charts:** series order is Feedwater `#1D5C78`, Husk `#B7832A`, Condensate `#2E7A55`, Slate violet `#6A5C8E`, Teal `#2A8C8C`, Clay grey `#8A7F72`. Fuel series always take Husk regardless of order.

## 3. Typography

Two families with clearly different jobs.

| Family | Role | Why |
|---|---|---|
| **Barlow Semi Condensed** (500, 600, 700) | Page titles, section headings, gauge readouts, KPI numbers, table numerals | Barlow takes its cues from highway signs and industrial lettering; the semi-condensed width fits many numbers in dense tables and dials |
| **Atkinson Hyperlegible Next** (400, 500, 700) | Body text, form labels, table text, all field-app text | Designed for maximum legibility; distinct letterforms (Il1, 0O) matter for serial numbers, plate numbers and amounts read in sunlight |

Fallback stacks:

```css
--font-display: "Barlow Semi Condensed", "Arial Narrow", "Roboto Condensed", system-ui, sans-serif;
--font-body: "Atkinson Hyperlegible Next", "Atkinson Hyperlegible", system-ui, -apple-system, "Segoe UI", sans-serif;
```

Numbers always use `font-variant-numeric: tabular-nums lining-nums;` (verify both fonts expose `tnum`; fall back to Barlow for numeric columns if needed).

### 3.1 Console type scale (base 15px)

| Token | Size / line height | Family, weight | Use |
|---|---|---|---|
| `display` | 32 / 36 | Display 600 | Dashboard greeting line, empty-state titles |
| `h1` | 26 / 32 | Display 600 | Page title |
| `h2` | 20 / 26 | Display 600 | Panel titles |
| `h3` | 16 / 22 | Body 700 | Sub-sections, dialog titles |
| `body` | 15 / 22 | Body 400 | Default |
| `body-strong` | 15 / 22 | Body 700 | Emphasis, amounts in prose |
| `small` | 13 / 18 | Body 400 | Secondary text, table meta |
| `micro` | 12 / 16 | Body 500 | Pills, timestamps, axis labels |
| `figure-xl` | 40 / 44 | Display 600 tabular | Gauge readout |
| `figure-l` | 28 / 32 | Display 600 tabular | KPI figures |
| `figure` | 15 / 22 | Display 500 tabular | Money and quantity columns |

### 3.2 Field type scale (base 17px)

| Token | Size / line height | Use |
|---|---|---|
| `f-title` | 24 / 30, Display 600 | Screen titles |
| `f-figure` | 34 / 38, Display 600 | Float balance, received quantity |
| `f-body` | 17 / 24, Body 400 | Default |
| `f-label` | 15 / 20, Body 700 | Field labels, list titles |
| `f-meta` | 14 / 20, Body 400 | Timestamps, secondary |

### 3.3 Typographic rules

- Sentence case everywhere: titles, buttons, labels, nav, table headers. No all-caps labels.
- No eyebrow labels above headings. If a heading needs context, the breadcrumb provides it.
- Prose and descriptions max 72 characters per line.
- Money: currency code shown once in the column header or panel title (e.g. "Amount" followed by the organisation's currency code), not repeated in every cell. In prose and on the field app, show the configured symbol.
- Quantities always carry their unit: `9,600 kg`, `9.6 t`, `412.5 h`.
- Serial and plate numbers render in Body 700 with `letter-spacing: 0.02em` for legibility, not in a monospace face.
- Dates: `5 Oct 2026`; with time `5 Oct, 14:32`; relative only within 24 h ("12 min ago") with the absolute time on hover.

## 4. Space, layout and shape

### 4.1 Spacing

4px base. Tokens: `0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64`.

- Console: panel padding 20, gaps between panels 16, table row height 44 (compact 36).
- Field: screen padding 20, list rows min 64, gaps 12–16, touch targets min 48×48.

### 4.2 Radius hierarchy

Radius signals what kind of thing an element is. Not one radius for everything.

| Token | Value | Applies to |
|---|---|---|
| `--r-panel` | 12px | Top-level panels on a page, dialogs, the phone frame screen |
| `--r-card` | 8px | Media tiles, nested cards inside panels, menus |
| `--r-control` | 6px | Buttons, inputs, selects, segmented controls |
| `--r-pill` | 999px | Status pills, filter chips, avatars |
| `0` | — | Table rows and cells (tables sit flush inside their panel) |

### 4.3 Elevation

Structure comes from surface colour and 1px lines, not shadows.

- Panels: `--surface` with `1px solid var(--line)`. No shadow.
- Overlays only (menus, popovers, dialogs, toasts): `--shadow-overlay: 0 12px 32px -8px rgb(19 32 36 / 0.28), 0 2px 6px rgb(19 32 36 / 0.12);`
- Dragging: same as overlay plus 1° tilt removed — just lift.

### 4.4 Console app shell

```
┌──────────────┬───────────────────────────────────────────────────────────────┐
│  STOKER      │  Sites / Riverside Mill / Fuel             [Search ⌘K] (🔔3) (●)│
│              ├───────────────────────────────────────────────────────────────┤
│  Dashboard   │                                                               │
│  Sites       │  Riverside Mill                         [Plan delivery]        │
│  Boilers     │  Active since 12 Mar 2026  ·  2 boilers  ·  7 people          │
│  Expenses    │  ─────────────────────────────────────────────────────────    │
│  Cash        │  Overview  Boilers  Workforce  Shifts  Expenses  Cash  Fuel … │
│  Deliveries  │                                                               │
│  Inventory   │  ┌─ panel ─────────────────────┐ ┌─ panel ────────────────┐  │
│  Ledgers     │  │                             │ │                        │  │
│  People      │  └─────────────────────────────┘ └────────────────────────┘  │
│  Reports     │                                                               │
│  ──────────  │                                                               │
│  Simulator   │                                                               │
│  Settings    │                                                               │
│  [Night ◐]   │                                                               │
└──────────────┴───────────────────────────────────────────────────────────────┘
```

*(The middle-dot line in the sketch is a reminder of content, not a style: render facts as separate inline items with 16px gaps.)*

- **Sidebar:** 240px, `--ink` (Boiler) background, `--ink-inverse` text. Wordmark in Display 700. Active item: 3px Feedwater bar on the left edge + `rgb(255 255 255 / 0.08)` fill. Collapses to a 64px icon rail below 1280px, to a drawer below 768px.
- **Top bar:** 56px, `--surface`, breadcrumb on the left, global search (⌘K command palette) and notifications on the right. No page title duplication in the bar.
- **Content:** left-aligned, fluid up to 1600px, 12-column grid with 16px gutters. Data pages use full width; settings and forms cap at 760px.
- **Page header:** title (h1), one line of key facts in `--ink-2`, primary action on the right (one per page), secondary actions in a "More" menu.
- **Tabs:** underline style, 2px Feedwater underline on active, counts in `--ink-3` after the label ("Expenses 24").

### 4.5 Breakpoints

| Name | Min width | Console behaviour |
|---|---|---|
| `sm` | 0 | Drawer nav, stacked panels, tables become row cards |
| `md` | 768 | Drawer nav, two-column panels |
| `lg` | 1024 | Icon rail |
| `xl` | 1280 | Full sidebar |
| `2xl` | 1600 | Max content width, side detail panes stay open |

## 5. Signature component: the gauge

The gauge shows a level against a range with zones. It appears on float cards (cash available), site fuel position (days of fuel remaining) and boiler readings (pressure within rating).

```
            ╭───────────────╮
        ╭───╯  ▁▂▃▅▆▇█       ╰───╮
      ╱  low      ok    │  high    ╲
     │                  │           │
     │            ●─────╯           │
      ╲                            ╱
        34,250                        ← figure-xl, Display 600
        available of 50,000          ← small, --ink-2
        Pending 6,400                ← small, --warn
```

**Anatomy**

- 240° arc, stroke 10px on console (14px on field), `--surface-sunk` track.
- Zones painted on the track: for cash, `--danger` below minimum, `--warn` below 25%, `--primary` above. For fuel days, `--danger` < 2 days, `--warn` < 5 days, `--fuel` above. For pressure, `--ok` within operating band, `--danger` above rating.
- Needle: 2px `--ink` line with a 6px hub. Tick marks every 10% in `--line-strong`; labelled ticks at min and max only.
- **Pending ghost:** for cash, a hatched segment shows pending (unapproved) spend between the needle and where it will land if approved. This makes "available" honest at a glance.
- Readout below the dial, left-aligned with the dial's left edge, not centred inside it.

**Behaviour**

- When the value changes from a live event, the needle sweeps to the new value over 600ms with `--ease-settle`, and the old position leaves a faint tick for 4s so you can see the jump. This is the console's one ambient motion.
- `prefers-reduced-motion`: needle jumps; the faint tick still appears.
- Accessible as `role="meter"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` and `aria-valuetext="34,250 available of 50,000, 6,400 pending"`.

**Sizes:** `lg` 220px (float detail, site overview), `md` 140px (float list cards), `sm` 64px inline (table cells, no readout, tooltip on hover).

Use the gauge only for these three measures. KPIs that aren't levels against a range use the plain KPI tile.

## 6. Components

### 6.1 Buttons

| Variant | Look | Use |
|---|---|---|
| Primary | `--primary` fill, `--ink-inverse` text | The one main action on a page or dialog |
| Secondary | `--surface` fill, `--line-strong` border, `--ink` text | Other actions |
| Quiet | No border, `--primary` text | Inline actions in tables and panels |
| Danger | `--danger` fill | Only inside a destructive confirmation |
| Field large | 56px tall, full width, `--primary` fill, f-label text | Primary action at the bottom of field screens |

Height 36 (console default), 32 (compact), 56 (field). Radius `--r-control`. Label is a verb phrase that names the outcome: "Approve expense", "Record arrival", "Issue float". The resulting toast uses the same verb: "Expense approved". No trailing arrows on labels. Loading state keeps the label and shows a spinner on the left; width doesn't change.

### 6.2 Inputs

- 40px tall, `--surface` fill, `1px --line-strong` border, `--r-control`. Focus: border `--primary` + 2px `--focus` ring.
- Label above the field (Body 700, 13px), help text below in `--ink-3`, error text below in `--danger` with an icon, replacing help text.
- **Money input:** right-aligned figure, currency code as a fixed prefix inside the field, thousands separators applied on blur, stored as minor units.
- **Quantity input:** unit selector as a suffix (`kg ▾`).
- **Site, boiler, employee pickers:** combobox with avatar/photo, code and current state, e.g. "B-0142 · 2 t/h · Installed at Riverside Mill" rendered as three spans.

### 6.3 Status pills

Pill = soft background + strong text + 6px dot. One mapping across the whole product:

| Meaning | Colour | Examples |
|---|---|---|
| Draft / planned | neutral (`--surface-sunk`, `--ink-2`) | Draft, Planned, In warehouse |
| Waiting on someone | warn | Submitted, Needs info, Loading, Settlement requested |
| Moving | info | In transit, Dispatched, Returning |
| Fuel-specific in progress | fuel | Arrived (awaiting verification) |
| Good / done | ok | Approved, Verified, Installed, Active, Settled, Checked in |
| Problem | danger | Rejected, Disputed, Overdrawn, Missed check-in |
| Ended | neutral outlined | Closed, Retired, Cancelled |

Pills never carry icons other than the dot, and their text is the state name exactly as defined in the PRD.

### 6.4 Lifecycle stepper

Shown at the top of every record with a lifecycle (site, boiler, expense, float, delivery).

```
Planned ─── Loading ─── Dispatched ─── ● Arrived ─── Verified ─── Closed
 5 Oct 07:10  07:40       08:15          11:02
```

Completed steps in `--ink`, current step bold with a filled dot in the state colour, future steps in `--ink-3`. Side states (Disputed, Cancelled) appear as a branch under the step where they happened. This genuinely is a sequence, so the stepper is the one place where step order is shown visually.

### 6.5 Data tables

- Sit flush inside a panel; header row on `--surface-sunk`, Body 700 13px `--ink-2`, sentence case.
- Rows 44px, 1px `--line` dividers, hover `--surface-sunk`, selected `--primary-soft` with a 3px Feedwater left edge.
- Text columns left-aligned; money and quantity columns right-aligned with `figure` type; status column holds a pill; the last column holds quiet row actions revealed on hover and always visible on touch.
- Toolbar above: search, filter chips (site, date range, category, status), saved views, column picker, export.
- Footer: row count, totals for money columns (Display 600), pagination.
- Below `md`, rows collapse into stacked row cards showing the 3–4 most important fields.

### 6.6 Ledger statement

Ledgers read like a bank statement, not a generic table.

```
Riverside Mill · Site float (custodian: Imran Saeed)          1 Oct – 31 Oct 2026

Date        Ref        Description                         Debit      Credit     Balance
──────────────────────────────────────────────────────────────────────────────────────
                       Opening balance                                            12,400
1 Oct       FLT-0311   Float top-up from bank             50,000                  62,400
2 Oct       EXP-2208   Chemicals · B-0142 · Al-Noor Store              3,400      59,000
3 Oct       EXP-2214   Daily labour (2 helpers)                        4,000      55,000
…
──────────────────────────────────────────────────────────────────────────────────────
                       Totals                              50,000      7,400
                       Closing balance                                            55,000
```

- Debit, credit and balance in `figure` type, right-aligned; totals and balances in Display 600.
- The Ref is a link to the source document. Hovering a row previews the receipt or proof thumbnail.
- Opening and closing rows on `--surface-sunk`.
- Period selector and "Export CSV / Excel / PDF" in the panel header.

### 6.7 Proof media tile

Used for delivery proof, receipts, attendance selfies.

```
┌───────────────────────────────┐
│                               │
│        [photo / video]        │  4:3, object-cover, --r-card
│                         0:18 ▶│
├───────────────────────────────┤
│ Vehicle front with plate      │  Body 700 13px
│ 5 Oct, 11:02   ◉ 42 m from site│  small; geofence chip in ok or danger
└───────────────────────────────┘
```

- Geofence chip: `--ok` "42 m from site" when inside; `--danger` "1.8 km from site" when outside; `--warn` "Location unavailable".
- Flags (time skew, hash mismatch, outside geofence) show as a warn/danger strip across the bottom of the image, in words: "Captured 3 h before sync".
- Click opens the **proof viewer**: full-screen dark overlay, media centred, a right pane with capture time, device time, coordinates on a small map with the site geofence circle, uploader, and hash. Arrow keys move between items.

### 6.8 Expense card (review queue)

```
┌──────────────────────────────────────────────────────────────────────┐
│ [receipt thumb]  Chemicals                       3,400   ● Submitted │
│                  Riverside Mill · B-0142                             │
│                  Bilal Ahmed, from site float · 5 Oct, 09:41         │
│                  ⚠ Similar expense 2 days ago        [Reject] [Approve]│
└──────────────────────────────────────────────────────────────────────┘
```

The review page is a split view: queue on the left (cards), detail on the right (receipt large, all fields, float impact gauge `sm`, history, approve/reject with comment). Keyboard: `J/K` to move, `A` approve, `R` reject, `I` request info.

### 6.9 KPI tile

For measures that aren't levels against a range (spent this month, deliveries today, people on shift).

- Title (small, `--ink-2`), figure (`figure-l`), comparison line ("+12% vs September" in `--ink-2`; no red/green unless it crosses an alert rule), and a 32px-tall sparkline in the module's colour.
- No gradient, no icon badge. The whole tile links to the filtered list.

### 6.10 Activity feed

A vertical list of events with a 24px icon in a circle tinted by module (fuel icons use Husk), the sentence, and a relative time. Sentences are written from the user's view: "Bilal Ahmed logged 3,400 for chemicals at Riverside Mill". New items slide in from the top only when the user is scrolled to the top; otherwise a "3 new" pill appears.

### 6.11 Other components

- **Map:** MapLibre with a muted custom style (land `--surface-sunk`, water `#CFDDE3`, roads `--line`). Sites as 14px pins coloured by status; selected pin grows to 20px with a label. Geofences as dashed `--primary` circles. Delivery capture points as small numbered dots matching the proof tiles.
- **Roster grid:** rows = people, columns = days; shift blocks coloured by shift template (Day `--info-soft`, Night `--primary-soft` with a moon glyph); uncovered boiler slots render as dashed `--danger` outlines with "Needs 1 operator".
- **Toasts:** bottom-left, `--ink` background, `--ink-inverse` text, 5s, with an Undo when the action is reversible.
- **Dialogs:** max 560px, title + one-sentence consequence + actions right-aligned (primary on the right).
- **Empty states:** a single line saying what goes here and a primary action. "No deliveries planned for this site yet." [Plan delivery]. No illustrations.
- **Skeletons:** `--surface-sunk` blocks matching the final layout; no shimmer animation.
- **Command palette (⌘K):** jump to any site, boiler (by serial), employee, delivery code, or run actions ("Issue float", "Plan delivery").

## 7. Key screens

### 7.1 Dashboard

```
┌───────────────────────────────────────────────────────────────────────────────┐
│ Good morning, Ayesha                                         5 Oct 2026, 09:12  │
├───────────────────────────────┬────────────────────────────┬──────────────────┤
│ Cash in the field             │ Fuel today                 │ Needs you (6)     │
│  [gauge lg: 412k of 600k]     │  Planned 4  In transit 3   │ ● Disputed DLV-1042│
│  Issued this month  600,000   │  Arrived 2  Disputed 1     │ ● 3 expenses > 10k │
│  Spent              187,600   │  ──────────────────────    │ ● Float low: Hillside│
│  Pending             28,400   │  [mini map with trucks]    │ ● 2 missed check-ins│
│  Returned                 0   │                            │                    │
├───────────────────────────────┴────────────────────────────┴──────────────────┤
│ Spent by category, last 30 days         │ Sites                                 │
│ [horizontal bars, fuel bar in Husk]     │ [table: site, boilers, people on      │
│                                         │  shift, float gauge sm, fuel days]    │
├─────────────────────────────────────────┴─────────────────────────────────────┤
│ Live activity                                                                   │
└───────────────────────────────────────────────────────────────────────────────┘
```

"Needs you" is the most important panel for daily work and sits top right where the eye lands after the greeting.

### 7.2 Site detail — Overview tab

Two columns: left (8 cols) holds boilers on site (cards with state pill, running hours, last reading, pressure gauge `sm`), people on shift now, and recent expenses; right (4 cols) holds the site float gauge `lg`, fuel position gauge `lg`, upcoming deliveries and the site map with geofence.

### 7.3 Delivery detail

```
┌───────────────────────────────────────────────────────────────────────────────┐
│ DLV-1042  Rice husk to Riverside Mill                  ● Disputed  [Resolve]   │
│ Planned ─ Loading ─ Dispatched ─ Arrived ─ ⑂ Disputed                         │
├──────────────────────────────────────────────┬────────────────────────────────┤
│ Proof of arrival                             │ Quantities                      │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐  │ Dispatched        10,000 kg     │
│ │ plate  │ │ load   │ │ video  │ │ slip   │  │ Received           9,600 kg     │
│ └────────┘ └────────┘ └────────┘ └────────┘  │ Difference          −400 kg     │
│                                              │ Tolerance 2%  ·  exceeded       │
│ Where it was captured                        │────────────────────────────────│
│ [map: site geofence + 4 numbered dots]       │ Vehicle  TRK-4471 · 10 t truck  │
│                                              │ Driver   Asif Khan  [call]      │
│                                              │ Source   North warehouse        │
│                                              │────────────────────────────────│
│                                              │ Comments and decision           │
└──────────────────────────────────────────────┴────────────────────────────────┘
```

### 7.4 Cash — "where it went" explorer

A drill-down that keeps context: a horizontal breadcrumb of the current slice ("October › Riverside Mill › Chemicals"), a gauge `md` of the float in view, a treemap-free stacked bar of categories (fuel in Husk), and the expense table below. Clicking a bar segment narrows the slice; the breadcrumb lets you climb back.

### 7.5 People — employee profile

Header with photo, name, code, designation, current site and assignment dates. Tabs: Details, Documents (with expiry pills), Assignments (timeline), Attendance (calendar heatmap: present `--ok-soft`, absent `--danger-soft`, leave `--info-soft`), Leave, Ledger (employee ledger statement), Payroll.

## 8. Stoker Field

### 8.1 Frame and navigation

- Designed at 390×844, works from 360 wide. Respects safe areas.
- Bottom tab bar, 4 items, icons + labels: **Today**, **Log**, **Deliveries**, **Me**. Active item in `--primary`, others `--ink-2`.
- A persistent **sync strip** at the very top shows state in words: "All synced", "2 waiting to sync", "Offline · 5 saved on this phone". Tapping it opens the Sync screen.
- Default theme follows the shift: Night shift theme after the user checks in to a night shift (can be overridden).

### 8.2 Today

```
┌──────────────────────────────┐
│ All synced                  ⟳│
│ Riverside Mill               │
│ Day shift  08:00 – 20:00     │
│ [ Check in ]  (56px, full)   │
│                              │
│ Site cash                    │
│  [gauge md]  34,250          │
│              available       │
│                              │
│ Arriving today               │
│ ┌──────────────────────────┐ │
│ │ ● Dispatched  DLV-1042    │ │
│ │ Rice husk · 10 t          │ │
│ │ TRK-4471 · ETA 11:00      │ │
│ └──────────────────────────┘ │
│                              │
│ Boilers                      │
│ B-0142  Last reading 2 h ago │
│ B-0157  Reading due now  ⚠   │
├──────────────────────────────┤
│ Today  Log  Deliveries  Me   │
└──────────────────────────────┘
```

### 8.3 Log (expense, reading, cash handover)

Log opens a choice of three large tiles: "Expense", "Boiler reading", "Give cash to someone". The expense flow is one screen with progressive sections:

1. **Amount** first, huge (`f-figure`), numeric keypad.
2. **What for:** recent categories as chips, "More" opens the full tree.
3. **Which boiler** (only if a running category): chips of boilers on this site.
4. **Paid from:** segmented control "Site cash" / "My own money".
5. **Receipt:** camera button; thumbnail with retake.
6. **Note** (optional).
7. [Save expense] — saves instantly on the phone; toast "Expense saved. It will sync when online." if offline.

### 8.4 Record arrival (guided capture)

A checklist the camera walks through, one step per screen, with a live viewfinder and an outline guide:

```
Step 1 of 4                    ✕
Truck front with plate
┌──────────────────────────────┐
│                              │
│   ┌──────────────────────┐   │  ← dashed guide box
│   │      plate here      │   │
│   └──────────────────────┘   │
│                              │
└──────────────────────────────┘
◉ Location ok · 42 m from site
          ( ◯ )  shutter 72px
```

Steps: truck front with plate → the load → unloading video (optional, hold to record, 60 s max) → weighbridge slip (optional). Then the quantity screen: received kg (big keypad), condition chips (Dry, Wet, Mixed with dirt), note. Summary screen with all thumbnails, then [Confirm arrival]. If location is outside the geofence the strip turns `--warn`: "You're 1.8 km from the site. You can still continue; head office will see this."

### 8.5 Check-in

Selfie with an oval guide, location chip, shift name and time, [Check in]. After check-in the Today header shows "On shift since 07:58" and the button becomes [Check out].

### 8.6 Field rules

- Every primary action is the full-width button at the bottom of the screen, reachable by thumb.
- Never more than one form section visible above the keyboard.
- Icons always paired with words.
- Contrast: all text ≥ 7:1 on field screens (outdoor use).
- Haptic feedback (where supported) on capture and save.

## 9. Simulator

The simulator demonstrates data moving through the system. It's the second place Stoker spends its boldness, using the same steam-system idea as the gauge: data flows through a pipe.

### 9.1 Layout

```
┌───────────────────────────────────────────────────────────────────────────────┐
│ Simulator   Scenario [Short fuel delivery ▾]  [Play] [Step] [Reset sandbox]  1× │
├──────────────┬──────────────┬───────────────────────────┬─────────────────────┤
│  ┌────────┐  │  ┌────────┐  │  Data flow                 │  Console            │
│  │        │  │  │        │  │                            │                     │
│  │ Phone  │  │  │ Phone  │  │  ◯ Phone A                 │  [live delivery     │
│  │   A    │  │  │   B    │  │  ┃                         │   page, updating]   │
│  │        │  │  │        │  │  ◯ Sync queue   2 waiting  │                     │
│  └────────┘  │  └────────┘  │  ┃                         │                     │
│ Supervisor   │ Driver       │  ◯ API          38 ms      │                     │
│ [Online ◑]   │ [Online ◑]   │  ┃                         │                     │
│ [GPS: site▾] │ [GPS: road▾] │  ◯ Database     12 ms      │                     │
│ [Camera ▾]   │ [Camera ▾]   │  ┃                         │                     │
│              │              │  ◯ Ledger       posted     │                     │
│              │              │  ┃                         │                     │
│              │              │  ◯ Console      +1.4 s     │                     │
│              │              │  ──────────────────────    │                     │
│              │              │  Event log (newest first)  │                     │
└──────────────┴──────────────┴───────────────────────────┴─────────────────────┘
```

- **Phone frames:** 320×692 scaled screens inside a simple device body: `--ink` bezel, `--r-panel` + 24px outer radius, no fake brand details. Each has its controls below: network toggle, GPS preset, camera sample picker, clock skew.
- **Data flow pipe:** a vertical pipe (6px, `--line-strong`) connecting stations. Each station is a 14px ring with its name, last latency and a count.
- **Event log:** each event as a row: time, event name in plain words ("Arrival recorded"), actor, and the hops it has passed, expandable to show payload JSON in a sunk panel.

### 9.2 Motion: the flow

- Each event is a 10px packet that travels down the pipe from the device station, pausing at each station for the real measured duration (min 150ms, scaled by the speed control), with the station ring filling as it passes.
- Packet colour by module: expenses `--primary`, fuel `--fuel`, cash `--ok`, HR `--info`, errors `--danger`.
- When a phone is offline, packets stack visibly at the Sync queue station with a count; going online releases them in order. This is the moment that explains offline sync without words.
- When a packet reaches the Console station, the matching element in the console pane gets a 1.2s `--primary-soft` highlight fade.
- Presenter mode: 1.25× type, slower packets (0.5× default), and a caption line that narrates each step in one sentence ("The supervisor's phone was offline, so the arrival waited on the phone and synced at 11:06").
- Reduced motion: packets don't travel; stations tick through their states in sequence with the same highlights.

## 10. Iconography and imagery

- **Lucide** icons, 1.5px stroke, 20px in console, 24px in field, `currentColor`.
- Module icons: Sites `factory`, Boilers `heater`, Expenses `receipt`, Cash `wallet`, Deliveries `truck`, Inventory `boxes`, Ledgers `book-open`, People `users`, Reports `chart-column`, Simulator `smartphone`.
- No stock photography or illustrations in the product. The only images are real photos from site: boilers, receipts, trucks, people. The design leaves room for them.

## 11. Motion tokens

| Token | Value | Use |
|---|---|---|
| `--dur-quick` | 120ms | Hover, press feedback |
| `--dur-base` | 200ms | Menus, popovers, tab underline |
| `--dur-panel` | 280ms | Drawers, side panes, dialogs |
| `--dur-settle` | 600ms | Gauge needle |
| `--ease-out` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | Entering elements |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Leaving elements |
| `--ease-settle` | `cubic-bezier(0.34, 1.3, 0.64, 1)` | Gauge needle (slight overshoot, like a real needle) |

Motion only answers a user action (open, expand, confirm) or shows live data arriving (gauge, simulator, new activity). No entrance animations on page load. All motion respects `prefers-reduced-motion`.

## 12. Writing

- Name things the way people on site say them: "Site cash" in the field app (the ledger calls it "Site float"; the console shows "Site float (site cash)" once in the float page header to connect the two).
- Buttons say what happens: "Record arrival", "Approve expense", "Issue float", "Check in". The same verb carries into toasts and the activity feed.
- Errors say what happened and how to fix it, without apology: "Receipt required for expenses over 2,000. Add a photo of the receipt." / "This site has 34,250 available. Lower the amount or ask head office for a top-up."
- Empty states invite action: "No expenses logged this week." [Log expense]
- Numbers in sentences use the org's currency symbol and thousands separators: "Spent 187,600 of 600,000 issued."
- Avoid internal words in the UI: "command", "event", "sync queue" appear only in the simulator, where explaining the system is the point.

## 13. Accessibility

- WCAG 2.2 AA across the console; 7:1 contrast target in the field app.
- Visible focus on every interactive element (2px `--focus`, offset 2px); never removed.
- Full keyboard support: tables (arrow keys, Enter to open), review queue shortcuts, command palette, proof viewer.
- Status is never colour alone: pills always carry text; gauges have text readouts; map pins have labels on focus.
- Forms: labels bound to inputs, errors announced with `aria-live="polite"`, error summary at the top of long forms.
- Media: video proof has a text summary of its metadata; selfies have alt text "Attendance photo, <name>, <time>".
- RTL: layouts use logical properties (`ps-4`, `me-2`, `start-0`); gauges and steppers mirror; numbers stay LTR.

## 14. Implementation

### 14.1 Tailwind v4 theme

```css
/* packages/ui/styles/tokens.css */
@import "tailwindcss";

@theme {
  --font-display: "Barlow Semi Condensed", "Arial Narrow", "Roboto Condensed", system-ui, sans-serif;
  --font-body: "Atkinson Hyperlegible Next", "Atkinson Hyperlegible", system-ui, -apple-system, "Segoe UI", sans-serif;

  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-surface-sunk: var(--surface-sunk);
  --color-line: var(--line);
  --color-line-strong: var(--line-strong);
  --color-ink: var(--ink);
  --color-ink-2: var(--ink-2);
  --color-ink-3: var(--ink-3);
  --color-ink-inverse: var(--ink-inverse);
  --color-primary: var(--primary);
  --color-primary-hover: var(--primary-hover);
  --color-primary-soft: var(--primary-soft);
  --color-fuel: var(--fuel);
  --color-fuel-soft: var(--fuel-soft);
  --color-ok: var(--ok);
  --color-ok-soft: var(--ok-soft);
  --color-warn: var(--warn);
  --color-warn-soft: var(--warn-soft);
  --color-danger: var(--danger);
  --color-danger-soft: var(--danger-soft);
  --color-info: var(--info);
  --color-info-soft: var(--info-soft);

  --radius-panel: 12px;
  --radius-card: 8px;
  --radius-control: 6px;

  --shadow-overlay: 0 12px 32px -8px rgb(19 32 36 / 0.28), 0 2px 6px rgb(19 32 36 / 0.12);

  --ease-out: cubic-bezier(0.2, 0.8, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-settle: cubic-bezier(0.34, 1.3, 0.64, 1);
}

:root {
  --bg: #EEF1EF; --surface: #FFFFFF; --surface-sunk: #E4E9E6;
  --line: #D3DAD6; --line-strong: #AEB9B4;
  --ink: #1F2B2E; --ink-2: #4A5A5E; --ink-3: #6E7D80; --ink-inverse: #F4F7F5;
  --primary: #1D5C78; --primary-hover: #174B62; --primary-soft: #DCEAF0; --focus: #2B7BA0;
  --fuel: #B7832A; --fuel-soft: #F4E8CF;
  --ok: #2E7A55; --ok-soft: #DCEFE4;
  --warn: #A96A0A; --warn-soft: #FBEBCD;
  --danger: #B3341F; --danger-soft: #F8DDD6;
  --info: #3F5F8A; --info-soft: #E1E8F3;
  color-scheme: light;
}

:root[data-theme="night"] {
  --bg: #132024; --surface: #1A2A2F; --surface-sunk: #101B1E;
  --line: #2B3E44; --line-strong: #3F565D;
  --ink: #E6EDEA; --ink-2: #B3C2C0; --ink-3: #879896; --ink-inverse: #132024;
  --primary: #5FA9C9; --primary-hover: #7BBAD5; --primary-soft: #1E3D4A; --focus: #7BBAD5;
  --fuel: #D9A54C; --fuel-soft: #3A2F1A;
  --ok: #5DBA8A; --ok-soft: #1C3A2C;
  --warn: #E0A23C; --warn-soft: #3B2E14;
  --danger: #E9765F; --danger-soft: #43211A;
  --info: #8FAAD3; --info-soft: #24324A;
  color-scheme: dark;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="day"]) { /* same values as [data-theme="night"] */ }
}

body {
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 15px;
  line-height: 22px;
}

.figure { font-family: var(--font-display); font-variant-numeric: tabular-nums lining-nums; }
```

### 14.2 Component inventory (`packages/ui`)

`AppShell`, `Sidebar`, `TopBar`, `Breadcrumb`, `PageHeader`, `Tabs`, `Panel`, `Button`, `IconButton`, `Input`, `MoneyInput`, `QuantityInput`, `Select`, `Combobox`, `EntityPicker` (site/boiler/employee/vehicle), `DateRangePicker`, `SegmentedControl`, `Checkbox`, `Switch`, `StatusPill`, `LifecycleStepper`, `Gauge`, `KpiTile`, `Sparkline`, `DataTable`, `LedgerStatement`, `FilterChips`, `ProofTile`, `ProofViewer`, `ExpenseCard`, `ActivityFeed`, `SiteMap`, `RosterGrid`, `AttendanceHeatmap`, `Dialog`, `Drawer`, `Popover`, `Menu`, `Toast`, `EmptyState`, `Skeleton`, `CommandPalette`, field-only: `SyncStrip`, `TabBar`, `BigButton`, `Keypad`, `CaptureStep`, `CategoryChips`; simulator-only: `PhoneFrame`, `DeviceControls`, `FlowPipe`, `FlowStation`, `EventLog`, `ScenarioBar`.

Each component documents its states (default, hover, focus, active, disabled, loading, error, empty) in Storybook, in both themes and in RTL.

### 14.3 Design QA checklist

- [ ] One primary action per page; its label is a verb phrase naming the outcome.
- [ ] Husk appears only on fuel-related elements; red only on things that need action.
- [ ] All money/quantity columns right-aligned, tabular, with units.
- [ ] Every number on a dashboard links to the records behind it.
- [ ] Every record shows its state pill and lifecycle stepper.
- [ ] Proof media shows time and location; flags are written in words.
- [ ] Works at 360px (field) and 1024px (console) without horizontal page scroll.
- [ ] Keyboard-only pass and screen-reader pass done; reduced motion checked.
- [ ] Day and Night shift themes both checked; RTL checked.
