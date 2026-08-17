// Persistence layer (see §7.2 of the docs: "Application state is serialised
// to browser localStorage on change and rehydrated on application load").
//
// UPGRADE PATH: this is deliberately the only file that talks to
// localStorage directly. repositories.js never touches window.localStorage
// itself — it only calls readTable/writeTable below. If we later swap to
// SQL.js (Option B), this file is what gets rewritten to run SQL queries
// against an in-browser SQLite instance; repositories.js and everything
// above it (business logic, components) stays untouched.

import { TABLES } from './constants.js';
import seedData from './seed/seed.js';

const STORAGE_PREFIX = 'mediflow:';
const SEEDED_FLAG_KEY = `${STORAGE_PREFIX}__seeded`;

function storageKeyFor(table) {
  return `${STORAGE_PREFIX}${table}`;
}

/** Reads and parses a table's array from localStorage. Returns [] if unset. */
export function readTable(table) {
  try {
    const raw = window.localStorage.getItem(storageKeyFor(table));
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error(`[storage] Failed to read table "${table}":`, err);
    return [];
  }
}

/** Serialises and writes a table's array to localStorage. */
export function writeTable(table, rows) {
  try {
    window.localStorage.setItem(storageKeyFor(table), JSON.stringify(rows));
    return true;
  } catch (err) {
    console.error(`[storage] Failed to write table "${table}":`, err);
    return false;
  }
}

/**
 * Seeds localStorage from seed.js on first run only. Safe to call on every
 * app load — it no-ops once the seed flag is set, so a user's own data
 * entered during a session is never overwritten on refresh.
 */
export function initStorage() {
  const alreadySeeded = window.localStorage.getItem(SEEDED_FLAG_KEY);
  if (alreadySeeded) return;

  TABLES.forEach((table) => {
    const existing = window.localStorage.getItem(storageKeyFor(table));
    if (existing === null) {
      writeTable(table, seedData[table] ?? []);
    }
  });

  window.localStorage.setItem(SEEDED_FLAG_KEY, 'true');
}

/**
 * Wipes all Mediflow keys and re-seeds from seed.js. Handy in dev, and
 * worth wiring to a "reset demo data" button for the actual demo.
 */
export function resetStorage() {
  TABLES.forEach((table) => window.localStorage.removeItem(storageKeyFor(table)));
  window.localStorage.removeItem(SEEDED_FLAG_KEY);
  initStorage();
}
