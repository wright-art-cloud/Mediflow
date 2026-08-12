# Mediflow Data Layer

This is Option A from our earlier decision: localStorage now, structured so
SQL.js can slot in later without touching component code. Seed data is
"Realistic" — 8 to 20 rows per table, hand-linked so the demo shows actual
behaviour (low-stock alerts, an expiring drug, a budget over its allocation,
missed doses) instead of empty screens.

Built in two layers on top of storage: a generic `db.<table>` repository
for raw CRUD, and a domain **service** per feature area (`patientService`,
`inventoryService`, `roomService`, etc.) that teammates building UI should
reach for first — it reads better in a component and already enforces the
integrity rules from §10.5.

## Where this goes in the repo

Copy `src/data/`, `src/services/`, and `src/context/` into the existing
`src/` folder on the `data-layer` branch. Nothing here depends on any
component, so it's safe to merge on its own.

```
src/
  data/
    constants.js       enums (roles, statuses, etc.) + the list of 15 tables
    idGenerator.js       generates new IDs for records created at runtime
    changeEmitter.js     tiny pub-sub — repositories.js notifies on every write
    storage.js            localStorage read/write + first-run seeding
    repositories.js       CRUD API per table (db.patients, db.drugs, ...)
    businessLogic.js      the rules from §9 and §10.5 of the docs
    seed/
      seed.js              the actual seed rows for all 15 tables
  services/
    authService.js         users — mock login
    patientService.js      patients + composite profile view
    prescriptionService.js prescriptions, prescriptionItems, doseLogs
    appointmentService.js  appointments
    hospitalService.js     hospitals
    staffService.js        staff
    inventoryService.js    drugs — low stock, expiry, dispense/restock
    roomService.js         rooms, roomBookings — conflict-checked booking
    admissionService.js    admissions — admit/discharge/transfer
    budgetService.js       budgets, expenses
    notificationService.js notifications
    index.js                re-exports every service from one path
  context/
    DataContext.jsx        <DataProvider> + useMediflowData() hook
verify-seed-data.mjs        node script — run after editing seed data or services
```

## How to wire it in

Wrap the app once, near the root (e.g. in `App.jsx` or `main.jsx`):

```jsx
import { DataProvider } from './context/DataContext.jsx';

function App() {
  return (
    <DataProvider>
      {/* routes, dashboards, everything else */}
    </DataProvider>
  );
}
```

Then in any component, prefer the service for the domain you're working in:

```jsx
import { useMediflowData } from '../context/DataContext.jsx';

function InventoryTable() {
  const { inventoryService } = useMediflowData();

  const drugs = inventoryService.getAllDrugs();
  const lowStock = inventoryService.getLowStockDrugs();

  // inventoryService.restock(drugId, 50)
  // inventoryService.dispense(drugId, 10)   // throws if it would go below zero

  return /* ... */;
}
```

Raw `db.<table>` (`getAll`, `getById`, `query`, `findBy`, `create`,
`update`, `remove`) is still available on `useMediflowData()` for anything
a service doesn't cover yet, or for one-off queries that don't need a rule
attached to them.

`useMediflowData()` gives you:
- one service per domain — see the table below
- `db.<table>` — the raw per-table CRUD API, for all 15 tables
- every function from `businessLogic.js` unpacked at the top level too (`getLowStockDrugs()`, `hasBookingConflict()`, `getBudgetStatus()`, ...) — the services call these internally, but they're available directly if you need them outside a service method
- `resetDemoData()` — wipes localStorage and re-seeds

Table and field names match the data dictionary in §10 of the documentation
exactly, so cross-referencing the docs while building a component should be
direct — no renaming to remember.

## Services (`src/services/`)

Each service wraps the table(s) for one feature area and enforces the
relevant integrity rule at the point of writing, so a form can catch a
thrown error and show it inline instead of silently saving bad data:

| Service | Tables | Enforces |
|---|---|---|
| `authService` | users | mock login (no real hashing — see §15 Scope and Limitations) |
| `patientService` | patients | Integrity Rule 7 — blocks delete where dependent records exist |
| `prescriptionService` | prescriptions, prescriptionItems, doseLogs | dosage ≤ max_daily_dose; Integrity Rule 5 (no overlapping active prescriptions of the same drug) |
| `appointmentService` | appointments | — |
| `hospitalService` | hospitals | — |
| `staffService` | staff | — |
| `inventoryService` | drugs | Integrity Rule 1 — stock can't go below zero |
| `roomService` | rooms, roomBookings | Integrity Rule 3 — no overlapping bookings |
| `admissionService` | admissions | Integrity Rule 4 — discharge_datetime null iff status is 'admitted' |
| `budgetService` | budgets, expenses | spend derived from expenses, never stored (§9.5) |
| `notificationService` | notifications | — |

Services are plain JS objects, not React-specific — they import `db`
directly from `repositories.js`, so they work outside components too
(that's how `verify-seed-data.mjs` exercises them without any React
involved).

## How re-rendering works (`changeEmitter.js`)

`repositories.js` calls `notify(table)` after every `create`/`update`/
`remove` — whether that call came from a service or straight off `db`.
`DataContext.jsx` subscribes to that once and bumps a `version` counter,
which forces components using `useMediflowData()` to re-render. Neither
services nor components need to know this is happening; write through
`db` or a service as normal and the UI catches up.

## Verifying the data still holds together

```
node verify-seed-data.mjs
```

Runs referential integrity checks (every FK points to a real row),
confirms the seeded low-stock/expiry/budget scenarios still fire, confirms
every service rejects the write it's supposed to reject (overlapping
booking, over-dispensing, overlapping prescription), and does a
create/update/remove round-trip. Worth re-running after editing `seed.js`
or any service.

## The Option A -> Option B upgrade path (if there's time later)

Only `storage.js` talks to `localStorage` directly. `repositories.js` only
calls `readTable()` / `writeTable()` from that file — it never touches
`window.localStorage` itself, and neither do the services. So moving to
SQL.js later means rewriting `storage.js` to run SQL against an in-browser
SQLite database instead; `repositories.js`, `services/`,
`businessLogic.js`, `DataContext.jsx`, and every component stay exactly as
they are.

## Seed data scenarios (so you know what to expect on first load)

- **Low stock**: Amoxicillin, Coartem, Salbutamol Inhaler, Ceftriaxone are
  all below their reorder threshold.
- **Near expiry**: Azithromycin (13 days out) and Actrapid Insulin.
- **Budget alerts**: Surgery budget (BUD-002) sits at 90% of allocation;
  ICU equipment budget (BUD-007) is over its allocation.
- **Missed/skipped doses**: a few `dose_logs` rows are `missed` or
  `skipped` so adherence views have something to show.
- **Currently admitted patients**: 2 (`ADM-001`, `ADM-002`), for the
  current-occupancy view.

All dates assume "today" is 2026-08-12 — if the demo happens later, the
near-expiry and dose-log scenarios will drift and may need bumping.
