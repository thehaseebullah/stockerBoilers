# Stoker — Product Requirements Document

**Product:** Stoker, an operations platform for a boiler-rental and biofuel-supply business
**Surfaces:** Stoker Console (web application for the head office) and Stoker Field (mobile app, delivered first as a web-based simulation)
**Status:** Draft v1.0
**Owner:** Product
**Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS, PostgreSQL

> Stoker is a working name. A stoker is the person who feeds a boiler's fire, which is what this product does for the business: it keeps fuel, money, people and machines flowing to every site.

---

## 1. Summary

The company places boilers at client sites, staffs those sites with operators, and keeps the boilers running by sending biofuel by truck. Today the information about all of this lives in phone calls, WhatsApp photos, paper registers and spreadsheets. Head office can't easily answer basic questions: how much cash is sitting with each site, what it was spent on, whether the fuel truck actually arrived with the full load, who is on shift right now, and where every boiler is.

Stoker gives head office one console to set up sites, assign boilers and staff to them, issue cash, track every expense, verify every fuel delivery with photo and video proof, run HR (employees, shifts, attendance, leave, payroll inputs), manage warehouse inventory, and see all of it reflected in proper ledgers. Workers on site use Stoker Field on their phones to log expenses, record fuel arrivals, check in to shifts and report boiler readings.

For the first release, Stoker Field is a high-fidelity web simulation that runs inside the console in a phone frame. Its purpose is to demonstrate and test the complete data movement — a worker logs something on the phone, and you watch it land in the console, the ledger and the dashboards — before a native app is built.

## 2. Problem statement

| Today | Consequence |
|---|---|
| Cash is handed to site supervisors with no running balance | Nobody knows how much cash is outstanding per site or per person |
| Expenses are reported by message or at month end | Late, unverifiable, hard to categorise, easy to inflate |
| Fuel deliveries are confirmed by phone call | Short deliveries and false arrivals can't be detected |
| Boiler locations are tracked in a spreadsheet | Assets get "lost" between sites, warehouse and repair |
| Staff assignment and shifts are managed verbally | Attendance disputes, overtime surprises, uncovered shifts |
| Accounts are reconstructed after the fact | Ledgers don't match reality; site profitability is unknown |

## 3. Goals and non-goals

### Goals

1. Every site, boiler, worker, vehicle and warehouse exists as a record with a clear current state and history.
2. Every unit of cash issued to the field is traceable to an expense, a return, or an outstanding balance.
3. Every fuel delivery has timestamped, geotagged photo or video proof and a quantity reconciliation.
4. Every financial event posts to a double-entry ledger automatically, so ledgers are always current.
5. HR covers the full employee lifecycle needed to run sites: records, documents, assignments, shifts, attendance, leave and payroll inputs.
6. Head office can monitor all of this live from dashboards, filtered by site, region, date and category.
7. A web-based simulation of the field app proves the end-to-end flows and data movement before native development.

### Non-goals for v1

- A native iOS/Android app (the simulation defines its behaviour; native comes in a later phase).
- Full statutory payroll processing and tax filing (Stoker produces payroll inputs and payslip drafts; filing stays with accounts).
- Client-facing portal and invoicing automation (data model supports it; UI is phase 3).
- IoT telemetry from boilers (manual readings in v1; the data model leaves room for sensors).
- Multi-company tenancy (a single company, but every table carries `org_id` for future use).

## 4. Users and roles

| Role | Where they work | What they need |
|---|---|---|
| **Owner / Admin** | Console | Everything; configuration; final approvals; profitability |
| **Operations Manager** | Console | Create sites, assign boilers and staff, plan fuel deliveries, watch alerts |
| **Finance / Accounts** | Console | Issue cash floats, approve expenses, ledgers, reconciliation, reports |
| **HR Manager** | Console | Employees, documents, shifts, attendance, leave, payroll inputs |
| **Warehouse Manager** | Console (tablet-friendly) | Stock in/out, boiler dispatch and returns, fuel stock, transfers |
| **Site Supervisor** | Field | Holds the site cash float, logs and approves site expenses, confirms deliveries, manages the shift roster on site |
| **Site Operator / Worker** | Field | Checks in/out, logs own expenses, records boiler readings, records fuel arrival |
| **Driver** | Field (limited) | Sees assigned delivery, marks departed and arrived, uploads loading proof |
| **Auditor (read-only)** | Console | Read access to ledgers, proofs, audit log |

Roles are assigned per user; field roles are additionally **scoped to the sites** a person is assigned to. A supervisor sees only their sites.

## 5. Glossary

| Term | Meaning |
|---|---|
| **Site** | A client location where one or more boilers are installed and operated |
| **Boiler** | A rentable asset with a serial number, capacity, fuel type and lifecycle state |
| **Assignment** | A time-bounded link between a boiler or a person and a site |
| **Cash float** | Money issued to a site or a person to spend on behalf of the company; it has a running balance |
| **Expense** | Money spent, logged with amount, category, receipt and context (site, boiler, person) |
| **Running expense** | An expense tied to keeping a specific boiler running (chemicals, spare parts, water, electricity, minor repairs) |
| **Personal expense** | An expense incurred by a worker for work (travel, meals on duty, phone credit); reimbursable or settled against their float |
| **Fuel delivery** | A dispatch of biofuel (e.g. rice husk, wood chips, pellets, bio-briquettes) from a warehouse or supplier to a site by a vehicle |
| **Proof of arrival (POA)** | Photos and/or video captured on site when a delivery arrives, with time and location |
| **Ledger** | A list of postings for one account (site, employee, vendor, warehouse, cash, expense category) |
| **Warehouse** | A location that holds boilers, spare parts, consumables and fuel stock |

## 6. Core lifecycles

These state machines are the backbone of the product. Every transition is recorded with who, when and why.

### 6.1 Site

`Draft → Active → On hold → Active → Closing → Closed`

- A site becomes **Active** when it has at least one boiler assigned and a supervisor.
- **Closing** starts boiler returns, final cash settlement and staff reassignment. A site cannot be **Closed** while it has an outstanding cash balance, an installed boiler or an assigned worker.

### 6.2 Boiler

`In warehouse → Reserved → In transit → Installed → Under maintenance → Installed … → Returning → In warehouse`, plus `Retired`.

- A boiler is at exactly one location at any time (a warehouse, a site, or a vehicle in transit).
- Running hours and readings attach to the boiler, not the site, so history follows the asset.

### 6.3 Expense

`Draft (offline) → Submitted → Approved / Rejected / Needs info → Posted → (Reimbursed)`

- Expenses under a configurable threshold paid from a float can be **auto-approved** and posted immediately; the rest wait for supervisor and/or finance approval.
- Rejected expenses paid from a float become a **recoverable** balance against the person.

### 6.4 Cash float

`Requested → Issued → Active (spending) → Top-up issued … → Settlement requested → Settled`

- Balance = issued + top-ups − approved expenses − cash returned.
- Pending (submitted, unapproved) expenses are shown separately as **pending**, so the "available" figure is honest.

### 6.5 Fuel delivery

`Planned → Loading → Dispatched → Arrived (proof captured) → Verified → Closed`, with `Disputed` and `Cancelled` side states.

- **Arrived** requires at least one photo of the vehicle with its number plate visible and one photo of the load; video is optional but encouraged.
- **Verified** requires the received quantity; a difference beyond tolerance (default 2%) raises a discrepancy and moves the delivery to **Disputed**.

## 7. Functional requirements

Requirement IDs are used in tickets and tests. Priority: **P0** must ship in v1, **P1** should ship in v1, **P2** later.

### 7.1 Sites

| ID | Requirement | Priority |
|---|---|---|
| SITE-01 | Create and edit a site: name, client, address, map pin (lat/long), contact person, contract start/end, billing terms, notes | P0 |
| SITE-02 | Site detail page with tabs: Overview, Boilers, Workforce, Shifts, Expenses, Cash, Fuel, Documents, Ledger, Activity | P0 |
| SITE-03 | Assign boilers to a site from available warehouse stock; record install date and installer | P0 |
| SITE-04 | Assign employees to a site with a role on that site (supervisor, operator, helper, guard) and a start/end date | P0 |
| SITE-05 | Site status lifecycle with guard rules from §6.1 | P0 |
| SITE-06 | Site map view showing all active sites with status and alerts | P1 |
| SITE-07 | Site budget per month by category with burn-down against actual expenses | P1 |
| SITE-08 | Site profitability: rental revenue vs. expenses, fuel cost, payroll cost allocated by assignment days | P2 |

**User story.** As an operations manager, I create a new site, pick two boilers from the North warehouse, assign a supervisor and three operators, and the site turns Active. The supervisor immediately sees the site in Stoker Field.

*Acceptance:* the boilers move to Reserved, then In transit when dispatched, then Installed when the supervisor confirms installation in the field app; each move appears on the boiler's history and the site's activity feed.

### 7.2 Boilers and assets

| ID | Requirement | Priority |
|---|---|---|
| BLR-01 | Boiler registry: serial number, make, model, capacity (kg/h steam or kW), pressure rating, fuel types supported, purchase date, purchase cost, photos, documents (certificates, manuals) | P0 |
| BLR-02 | Current location and lifecycle state (§6.2) with full movement history | P0 |
| BLR-03 | Running log: operators record readings per shift (pressure, temperature, running hours, fuel consumed, water level, remarks) | P0 |
| BLR-04 | Running expenses linked to a boiler (see §7.3) roll up on the boiler page | P0 |
| BLR-05 | Maintenance: schedule by running hours or calendar, log maintenance events, parts used (deducts inventory), cost | P1 |
| BLR-06 | Certificate and inspection expiry reminders | P1 |
| BLR-07 | Cost per running hour and fuel efficiency per boiler | P2 |

### 7.3 Expenses

| ID | Requirement | Priority |
|---|---|---|
| EXP-01 | Log an expense (field or console): amount, date, category, sub-category, payment source (site float / own pocket / company card / vendor credit), site, optional boiler, vendor, description, one or more receipt photos | P0 |
| EXP-02 | Two expense kinds: **running** (must reference a boiler) and **personal / site** (references a person and site) | P0 |
| EXP-03 | Configurable category tree (e.g. Fuel top-up, Chemicals, Spare parts, Repairs, Water, Electricity, Transport, Meals on duty, Lodging, Phone credit, Labour (daily wage), Miscellaneous) with per-category receipt requirement and approval threshold | P0 |
| EXP-04 | Approval workflow: auto-approve under threshold; supervisor approval; finance approval above second threshold; comments and "needs info" loop | P0 |
| EXP-05 | Offline capture in the field: expenses queue on device and sync later with original capture time preserved | P0 |
| EXP-06 | Duplicate detection: same amount, vendor and date within a window, or same receipt image hash, is flagged | P1 |
| EXP-07 | Receipt OCR suggestion for amount and date (suggestion only, never auto-filled silently) | P2 |
| EXP-08 | Reimbursement batch for own-pocket expenses, exported to payroll or paid out | P1 |

**User story.** As a site operator, I buy boiler chemicals for 3,400, snap the receipt, choose Running → Chemicals, select Boiler B-0142, and submit. It's paid from the site float.

*Acceptance:* the supervisor gets a notification; if under the auto-approve threshold the expense posts immediately; the site float's available balance drops by 3,400; the expense appears in the console's expense stream within 2 seconds of sync; the ledger shows a debit to Chemicals expense and a credit to the site float account.

### 7.4 Cash and money monitoring

This answers "how much cash went out, how much was spent, and where."

| ID | Requirement | Priority |
|---|---|---|
| CASH-01 | Issue a cash float to a site (held by its supervisor) or directly to an employee; record mode (cash, bank transfer, mobile wallet), reference and proof | P0 |
| CASH-02 | Top-ups, returns and transfers between floats (e.g. supervisor hands cash to an operator) with both sides confirming in the field app | P0 |
| CASH-03 | Float card showing Issued, Spent (approved), Pending, Returned, Available, and days since last settlement | P0 |
| CASH-04 | Money dashboard: totals for a period — issued, spent, pending, returned, outstanding — with breakdowns by site, person, category, boiler and vendor | P0 |
| CASH-05 | "Where it went" explorer: drill from total → site → category → individual expense → receipt | P0 |
| CASH-06 | Settlement: close a float period, reconcile physical cash count against the system balance, record the variance with a reason | P0 |
| CASH-07 | Alerts: float below minimum, float idle with high balance, spending spike vs. 4-week average, expense without receipt above limit | P1 |
| CASH-08 | Top-up requests from the field with justification; finance approves and issues | P1 |

### 7.5 Fuel deliveries and proof of arrival

| ID | Requirement | Priority |
|---|---|---|
| FUEL-01 | Plan a delivery: source (warehouse or supplier), destination site, fuel type, planned quantity (tonnes/kg), vehicle, driver, planned date | P0 |
| FUEL-02 | Vehicle registry: plate number, type, capacity, owner (own fleet / hired), driver contacts | P0 |
| FUEL-03 | Loading proof at source: weighbridge slip photo, loaded vehicle photo, gross/tare weights | P1 |
| FUEL-04 | Dispatch: marks departure time; site supervisor is notified with ETA | P0 |
| FUEL-05 | **Proof of arrival** in the field app: guided capture of (1) vehicle front with plate, (2) the load, (3) optional unloading video up to 60 s, (4) optional weighbridge slip; each item stamped with capture time, device time, GPS location and distance from the site pin | P0 |
| FUEL-06 | Received quantity entry and condition (moisture, contamination notes); discrepancy auto-flagged against dispatched quantity | P0 |
| FUEL-07 | Console delivery page: timeline of states, map of capture locations against site geofence, media gallery with full-screen viewer and video playback, quantity reconciliation | P0 |
| FUEL-08 | Verification and dispute workflow with comments; disputed deliveries hold supplier payment | P1 |
| FUEL-09 | Fuel stock per site: deliveries in, daily consumption from boiler logs out, estimated days remaining, reorder alert | P1 |
| FUEL-10 | Proof integrity: media is captured in-app only (no gallery upload for POA), hashed on capture, and flagged if GPS is missing or outside the geofence | P1 |

**User story.** As a supervisor, a truck arrives. I open the delivery card, tap "Record arrival", take a photo of the truck front, a photo of the load, a 20-second video of unloading, and enter 9.6 tonnes received against 10 dispatched.

*Acceptance:* the console shows the delivery as Arrived with four media items, each with a location dot inside the site geofence; the 4% shortfall exceeds tolerance, so it's marked Disputed and operations is alerted; fuel stock at the site increases by 9.6 t, and the warehouse or supplier ledger reflects 10 t dispatched with 0.4 t in dispute.

### 7.6 Inventory and warehouses

| ID | Requirement | Priority |
|---|---|---|
| INV-01 | Warehouses: name, address, manager, capacity notes | P0 |
| INV-02 | Item catalogue: boilers (serialised), spare parts, consumables, chemicals, tools, PPE, fuel (bulk, by weight); units of measure; reorder levels | P0 |
| INV-03 | Stock by location (warehouse, site, vehicle) with quantities; serialised items tracked individually | P0 |
| INV-04 | Movements: goods received (from vendor/PO), issue to site, return from site, transfer between warehouses, adjustment (with reason), write-off | P0 |
| INV-05 | Every movement is a document with lines; stock levels are derived from movements, never edited directly | P0 |
| INV-06 | Stock valuation (weighted average cost) feeding the inventory ledger | P1 |
| INV-07 | Purchase orders to vendors with receiving against PO | P1 |
| INV-08 | Cycle counts with variance posting | P2 |

### 7.7 Ledgers and accounting

| ID | Requirement | Priority |
|---|---|---|
| LED-01 | Chart of accounts with a sensible default: cash/bank, site floats, employee advances, inventory, fuel stock, receivables, payables, expense categories, rental revenue, payroll | P0 |
| LED-02 | Double-entry journal: every financial event (float issue, expense approval, reimbursement, delivery receipt, inventory movement with value, payroll run) posts balanced journal lines automatically | P0 |
| LED-03 | Ledger views: **site ledger**, **employee ledger** (advances, expenses, reimbursements, salary), **vendor ledger**, **warehouse/inventory ledger**, **account ledger**, **general ledger**; each with opening balance, postings, running balance, closing balance | P0 |
| LED-04 | Every posting links back to its source document (expense, delivery, movement, float) | P0 |
| LED-05 | Manual journal entries for finance with mandatory narration and attachment | P1 |
| LED-06 | Period close: lock a month so postings can't be back-dated into it | P1 |
| LED-07 | Trial balance, P&L by site, cash book | P1 |
| LED-08 | Export to CSV/Excel and to common accounting software formats | P1 |

### 7.8 HR management

| ID | Requirement | Priority |
|---|---|---|
| HR-01 | Employee record: name, photo, employee code, national ID number, date of birth, phone, emergency contact, address, designation, department, employment type (permanent, contract, daily wage), join date, salary structure, bank / wallet details | P0 |
| HR-02 | Documents: ID copy, contract, certificates (e.g. boiler operator licence) with expiry dates and reminders | P0 |
| HR-03 | Site assignments history and current site (from §7.1) | P0 |
| HR-04 | Shift templates (e.g. Day 08:00–20:00, Night 20:00–08:00, 3×8h rotations) and a roster calendar per site | P0 |
| HR-05 | Attendance: check-in/check-out from the field app with selfie and GPS; supervisor can mark attendance for workers without phones | P0 |
| HR-06 | Coverage: each boiler requires N operators per shift; the roster highlights uncovered shifts | P1 |
| HR-07 | Leave: types, balances, requests from field, approval by supervisor/HR, effect on roster | P1 |
| HR-08 | Overtime calculation from attendance against shift | P1 |
| HR-09 | Payroll inputs per month: days present, overtime, leave, advances to recover, reimbursements to pay; payslip draft | P1 |
| HR-10 | Onboarding and offboarding checklists (issue PPE, issue phone, settle float, recover assets) | P2 |

### 7.9 Dashboards and reports

| ID | Requirement | Priority |
|---|---|---|
| DASH-01 | Home dashboard: active sites, boilers by state, cash outstanding, spent this month vs last, deliveries today (planned / in transit / arrived / disputed), people on shift now, alerts | P0 |
| DASH-02 | Live activity feed across the company, filterable | P0 |
| DASH-03 | Reports: expenses by category/site/person; cash float aging; fuel delivered vs consumed; boiler utilisation; attendance summary; inventory valuation | P1 |
| DASH-04 | Every chart drills down to the underlying records | P0 |
| DASH-05 | Scheduled email of a daily operations digest | P2 |

### 7.10 Notifications and alerts

In-app notifications in v1 (P0); email and push in phase 2. Alert rules are configurable with thresholds. Examples: expense awaiting approval, delivery dispatched/arrived/disputed, float low, certificate expiring, uncovered shift, worker missed check-in, boiler reading out of range.

### 7.11 Audit and administration

| ID | Requirement | Priority |
|---|---|---|
| ADM-01 | Users, roles, site scoping, invitations | P0 |
| ADM-02 | Immutable audit log of every create/update/state change with actor, timestamp, before/after values | P0 |
| ADM-03 | Settings: currency, units, approval thresholds, delivery tolerance, categories, shift templates, fiscal year | P0 |
| ADM-04 | Soft delete only for business records; financial postings are never deleted, only reversed | P0 |

## 8. Stoker Field (mobile app)

### 8.1 Field capabilities in v1 simulation

| Capability | Supervisor | Operator | Driver |
|---|---|---|---|
| See my sites, today's shift, my float | ✓ | ✓ | — |
| Check in / check out (selfie + GPS) | ✓ | ✓ | — |
| Log expense with receipt | ✓ | ✓ | — |
| Approve site expenses under limit | ✓ | — | — |
| Record boiler reading | ✓ | ✓ | — |
| Confirm boiler installation / return | ✓ | — | — |
| See incoming deliveries | ✓ | ✓ | own only |
| Record proof of arrival | ✓ | ✓ (if allowed) | — |
| Mark departed / arrived, loading proof | — | — | ✓ |
| Transfer cash to another worker | ✓ | ✓ | — |
| Request float top-up | ✓ | — | — |
| Apply for leave | ✓ | ✓ | ✓ |

### 8.2 Field principles

- Works with one thumb, in sunlight, with gloves: large targets (min 48 px), high contrast, few words.
- Offline first: every action is saved locally and queued; a clear sync indicator shows what's pending.
- Media is captured in the app, compressed on device, and uploaded in the background.
- Language: English first, with translation files and right-to-left layout support built in from day one so local languages can be added without code changes.

## 9. Simulation mode

The simulation is a first-class feature of v1, not a mock-up. It runs inside Stoker Console at `/simulator`.

| ID | Requirement | Priority |
|---|---|---|
| SIM-01 | One or more phone frames render Stoker Field as a real, working web app; each frame is logged in as a seeded field user (e.g. a supervisor, an operator, a driver) | P0 |
| SIM-02 | Actions in a phone frame call the same APIs a native app will call and write real records to the database | P0 |
| SIM-03 | A **data flow panel** beside the phones shows each event travelling: device → sync queue → API → database → ledger → dashboard, with timestamps | P0 |
| SIM-04 | A live console pane (or a second browser tab) updates in real time as the events land | P0 |
| SIM-05 | Device controls: toggle offline/online, simulate GPS position (inside/outside geofence), pick sample camera images/videos, set device clock skew | P0 |
| SIM-06 | Scenario player: scripted stories that drive the phones automatically, e.g. "A normal day at Riverside Mill", "Short fuel delivery", "Expense without receipt", "Worker goes offline for 3 hours", "Cash handover between workers" | P1 |
| SIM-07 | Reset sandbox: restore seed data in one click; simulation data is isolated in a `sandbox` schema or flagged org so it never mixes with live data | P0 |
| SIM-08 | Presenter mode: larger type, slower animations, step-by-step pause between events for demos | P1 |

## 10. Non-functional requirements

| Area | Requirement |
|---|---|
| Performance | Console pages interactive in < 2 s on a typical office connection; list views paginate server-side and stay responsive at 100k rows |
| Realtime | Field event visible on the console within 2 s of reaching the server |
| Offline | Field app usable for 72 h offline with up to 500 queued actions and 200 MB media |
| Availability | 99.5% monthly for the console and API |
| Data integrity | Ledger journal lines always balance (enforced in the database); money stored as integer minor units |
| Security | Role- and site-scoped access, enforced on the server; signed, expiring media URLs; TLS everywhere; passwords hashed with Argon2; 2FA for finance and admin |
| Privacy | Employee personal data visible only to HR and admin; selfies used only for attendance |
| Auditability | Every change attributable to a user and time; proofs tamper-evident via content hashes |
| Accessibility | WCAG 2.2 AA for the console; field app tested for outdoor legibility |
| Localisation | Currency, units, date formats and language configurable; RTL support |
| Browser support | Last two versions of Chrome, Edge, Safari, Firefox; Android Chrome for field |

## 11. Permissions matrix (summary)

| Capability | Admin | Ops | Finance | HR | Warehouse | Supervisor* | Operator* | Auditor |
|---|---|---|---|---|---|---|---|---|
| Sites: create/edit | ✓ | ✓ | — | — | — | — | — | view |
| Assign boilers | ✓ | ✓ | — | — | ✓ | confirm | — | view |
| Assign workforce | ✓ | ✓ | — | ✓ | — | view | — | view |
| Issue cash floats | ✓ | — | ✓ | — | — | request | — | view |
| Approve expenses | ✓ | ✓ (ops categories) | ✓ | — | — | under limit | — | view |
| Plan deliveries | ✓ | ✓ | — | — | ✓ | view | — | view |
| Record proof of arrival | — | — | — | — | — | ✓ | ✓ | view |
| Verify / dispute delivery | ✓ | ✓ | ✓ | — | — | — | — | view |
| Inventory movements | ✓ | — | — | — | ✓ | request | — | view |
| Ledgers | ✓ | site view | ✓ | — | stock view | own site | own | ✓ |
| HR records | ✓ | limited | payroll view | ✓ | — | own team (limited) | self | — |
| Settings & users | ✓ | — | — | — | — | — | — | — |

\* Scoped to assigned sites.

## 12. Release plan

| Phase | Scope | Outcome |
|---|---|---|
| **Phase 0 — Foundations** (2 weeks) | Repo, design system, auth, RBAC, audit log, seed data, app shell | Clickable shell with real login |
| **Phase 1 — Operate** (6 weeks) | Sites, boilers, workforce assignment, expenses, cash floats, fuel deliveries with POA, warehouses and basic inventory, ledgers (auto-posting + views), dashboard, simulator with data flow panel | Complete core loop demonstrable end-to-end |
| **Phase 2 — People and control** (4 weeks) | Shifts, roster, attendance, leave, payroll inputs, maintenance, alerts engine, reports, scenario player, second language | Full HR and monitoring |
| **Phase 3 — Native and clients** | React Native/Expo field app using the same API, push notifications, client portal, invoicing, purchase orders, IoT readings | Production field rollout |

## 13. Success metrics

- 100% of cash issued in a month is accounted for (spent, returned or outstanding) with zero unexplained variance at settlement.
- Median time from expense to console visibility under 1 hour (vs. end of month today).
- 100% of fuel deliveries have proof of arrival; discrepancy detection on every delivery.
- Month-end close for site accounts reduced from days to under one day.
- Uncovered boiler shifts detected before they start in 95% of cases.

## 14. Assumptions and open questions

1. **Currency and units:** one base currency per organisation; fuel measured in kg/tonnes. Confirm whether any fuel is bought by volume.
2. **Approval thresholds:** proposed defaults — auto-approve below 2,000, supervisor up to 10,000, finance above. To confirm.
3. **Client billing:** is boiler rental billed monthly flat, per running hour, or per tonne of steam? Affects phase 3 invoicing and site profitability.
4. **Fuel sourcing:** are deliveries mostly from own warehouses or direct from suppliers to site? Both are supported; affects which ledger receives the cost.
5. **Daily-wage labour:** paid in cash from site floats or through payroll? Proposed: logged as a Labour expense from the float, with the worker recorded.
6. **Phones:** do all operators have smartphones, or only supervisors? The supervisor-marks-attendance path assumes some don't.
7. **Data residency and hosting:** cloud region and backup policy to be confirmed.
