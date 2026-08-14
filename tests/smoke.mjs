// Runs under vite-node so JSX/imports work exactly like in the app.
// For each route, spins up a fresh jsdom window (fresh localStorage = fresh
// seed data every time), pre-seeds a logged-in session, mounts the real
// <App/>, and reports any error React throws during render/effects.

import { JSDOM } from 'jsdom';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import App from '../src/App.jsx';

const PATIENT_USER_ID = 'USR-P004'; // Samuel Mutiso
const STAFF_USER_ID = 'USR-S001';   // Dr. James Mwangi

const ROUTES = [
  ['patient', '/patient/health-hub'],
  ['patient', '/patient/prescriptions'],
  ['patient', '/patient/prescriptions/history'],
  ['patient', '/patient/appointments'],
  ['patient', '/patient/profile'],
  ['staff', '/hospital/dashboard'],
  ['staff', '/hospital/inventory'],
  ['staff', '/hospital/inventory/new'],
  ['staff', '/hospital/inventory/DRG-002/edit'],
  ['staff', '/hospital/rooms'],
  ['staff', '/hospital/rooms/book'],
  ['staff', '/hospital/patients'],
  ['staff', '/hospital/patients/PAT-004'],
  ['staff', '/hospital/admissions'],
  ['staff', '/hospital/prescriptions'],
  ['staff', '/hospital/expenses'],
  ['staff', '/hospital/budgets'],
  ['staff', '/hospital/profile'],
  [null, '/login'],
  [null, '/does-not-exist'],
  ['staff', '/patient/health-hub'], // wrong role — should redirect to /403, not show patient data
  ['patient', '/hospital/dashboard'], // wrong role — should redirect to /403
];

// keyed by [role, path] so a wrong-role access attempt is checked against
// "did NOT leak the other portal's data" rather than "shows my data".
const CONTENT_CHECKS = {
  'patient|/patient/health-hub': (text) => text.includes('Samuel'),
  'staff|/patient/health-hub': (text) => !text.includes('Samuel') && text.includes("don't have access"),
  'staff|/hospital/dashboard': (text) => text.includes('Mwangi'),
  'patient|/hospital/dashboard': (text) => !text.includes('Mwangi') && text.includes("don't have access"),
};

async function testRoute(role, path) {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
    url: `http://localhost/${path === '/login' || role === null && path !== '/login' ? '' : ''}`,
    pretendToBeVisual: true,
  });

  global.window = dom.window;
  global.document = dom.window.document;
  Object.defineProperty(global, 'navigator', { value: dom.window.navigator, configurable: true });
  global.localStorage = dom.window.localStorage;
  global.HTMLElement = dom.window.HTMLElement;
  global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
  global.cancelAnimationFrame = (id) => clearTimeout(id);

  if (role) {
    const userId = role === 'patient' ? PATIENT_USER_ID : STAFF_USER_ID;
    dom.window.localStorage.setItem('mediflow:session', userId);
  }
  dom.window.history.pushState({}, '', path);

  const errors = [];
  const origError = console.error;
  console.error = (...args) => {
    errors.push(args.map(String).join(' '));
  };

  try {
    const container = dom.window.document.getElementById('root');
    const root = createRoot(container);

    await act(async () => {
      root.render(React.createElement(App));
      // Flush effects: initStorage's useEffect, then any data-dependent re-render.
      await new Promise((r) => setTimeout(r, 20));
    });

    const bodyText = container.textContent.trim();
    const realErrors = errors.filter((e) =>
      !e.includes('React Router Future Flag Warning') &&
      !e.includes('act(...)') &&
      !e.includes('is deprecated in favor of')
    );

    const contentCheck = CONTENT_CHECKS[`${role}|${path}`];
    const contentOk = contentCheck ? contentCheck(bodyText) : true;
    if (contentCheck && !contentOk) errors.push(`content check failed for ${role}|${path}`);

    return { path, role, ok: realErrors.length === 0 && contentOk, bodyLength: bodyText.length, errors: realErrors, bodyText };
  } catch (err) {
    return { path, role, ok: false, bodyLength: 0, errors: [String(err && err.stack || err)] };
  } finally {
    console.error = origError;
  }
}

const results = [];
for (const [role, path] of ROUTES) {
  results.push(await testRoute(role, path));
}

console.log('\n=== SMOKE TEST RESULTS ===\n');
let anyFail = false;
for (const r of results) {
  const status = r.ok && r.bodyLength > 0 ? 'PASS' : 'FAIL';
  if (status === 'FAIL') anyFail = true;
  console.log(`[${status}] ${String(r.role)}\t${r.path}\t(rendered ${r.bodyLength} chars)`);
  if (r.errors.length) {
    r.errors.forEach((e) => console.log('    ' + e.split('\n')[0]));
  }
}
console.log(anyFail ? '\nSOME ROUTES FAILED\n' : '\nALL ROUTES OK\n');
process.exit(anyFail ? 1 : 0);
