# App.jsx integration — what changed

## The bug I found first
Every file in the data layer imports from `'../data/...'` (lowercase `d`),
but the folder in the uploaded project was `Data/` (capital `D`). That works
on Windows and Mac by default (case-insensitive filesystems) but **breaks on
Linux** — including most CI runners, GitHub Actions, Vercel, and Netlify. If
anyone on the team is on Linux, or if you deploy anywhere, the build would
have failed. Fixed by renaming the folder to `data/` to match every existing
import statement, rather than editing 10+ files.

## What was actually wrong
`App.jsx` was still the untouched Vite + React starter template — the
counter button, the "Get started" boilerplate, none of it replaced. That's
why nothing in `src/data`, `src/services`, or `src/context/DataContext.jsx`
was reachable: there was no routing, no login, nothing rendering any of it.

## What's new

**Routing & auth**
- `App.jsx` rewritten: `DataProvider` → `BrowserRouter` → `AuthProvider` → routes
- `src/context/AuthContext.jsx` — session layer on top of the existing
  `authService` (which only checks a row match). This is what remembers
  who's signed in across a refresh, via `localStorage['mediflow:session']`.
- `src/components/ProtectedRoute.jsx` — redirects to `/login` if signed out,
  `/403` if signed in with the wrong role for that portal
- `src/components/layout/` — `Sidebar.jsx` (role-aware, uses real patient/staff
  names), `PatientLayout.jsx`, `HospitalLayout.jsx`

**Every screen, wired to the real services (not placeholder text)**
- `src/pages/shared/` — Login, NotFound, Unauthorized
- `src/pages/patient/` — HealthHub, Prescriptions (working dose-logging),
  PrescriptionHistory, Appointments (working request form), Profile (editable)
- `src/pages/hospital/` — Dashboard, Inventory, InventoryEdit, Rooms,
  RoomBooking (real conflict detection via `hasBookingConflict`), Patients
  (list + detail), Admissions (admit/discharge), Prescriptions (issuance
  with real dosage/overlap validation), Expenses, Budgets

**Supporting files**
- `src/styles/theme.css` — the visual language from the wireframes, applied for real
- `src/components/icons.jsx` — the icon set, as reusable components
- `src/utils/format.js` — date/name formatting helpers used across pages

## Update: sign-out moved to Profile
The sidebar no longer has a small logout icon easy to miss. Instead:
- Clicking your name/avatar in the sidebar now opens your Profile page
- Sign-out lives there as a clear, labeled button
- Hospital staff didn't have a Profile page at all before this — added
  `src/pages/hospital/Profile.jsx` (editable name/phone, read-only role/
  department/hospital, sign-out) plus a `/hospital/profile` route and
  sidebar nav item, so both portals now work the same way

## Update: sign-out also on the hospital Dashboard
Sign-out is now on the hospital Dashboard header too (top right, next to the
welcome message) — the first screen staff land on after logging in — in
addition to the Profile page.

## Demo login
Every seeded user shares the same placeholder password (see the comments in
`authService.js` — there's no real hashing in this front-end demo). The
login form pre-fills real seeded accounts so "Sign in" works immediately:

- **Patient:** samuel.mutiso@mediflow.dev
- **Staff:** j.mwangi@mediflow.dev
- **Password (both):** hashed_placeholder_pw

## Before you merge this in
You'll need to add `react-router-dom` to your real `package.json`:
```
npm install react-router-dom
```
Everything else (`react`, `react-dom`, `vite`) you already had.

## Verifying it actually works
A build passing doesn't catch runtime bugs like a null lookup crashing a
page. `tests/smoke.mjs` headlessly mounts the real app at every single route
as both a patient and a staff user (using jsdom, no browser needed), and
checks: nothing throws, real data actually renders (not blank pages), and
role-based access is genuinely enforced — a staff account hitting a patient
URL gets redirected to `/403` without any patient data leaking into the page.

To run it yourself:
```
npm install -D jsdom @testing-library/react vite-node
npm run test:smoke
```
All 21 checks (17 screens × both roles where relevant, plus login/404/403
and two wrong-role access attempts) pass as of this build.
