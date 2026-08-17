// Repository layer: one small CRUD API per table, all built off the same
// factory so every table behaves the same way. Components and business
// logic should only ever go through `db.<table>`, never through
// storage.js directly — that indirection is what makes the Option A -> B
// upgrade (localStorage -> SQL.js) free later.

import { TABLES } from './constants.js';
import { readTable, writeTable } from './storage.js';
import { createId } from './idGenerator.js';
import { notify } from './changeEmitter.js';

// Primary key field name per table (matches the data dictionary in §10).
const PRIMARY_KEYS = {
  users: 'user_id',
  patients: 'patient_id',
  prescriptions: 'prescription_id',
  prescriptionItems: 'item_id',
  doseLogs: 'log_id',
  appointments: 'appointment_id',
  hospitals: 'hospital_id',
  staff: 'staff_id',
  drugs: 'drug_id',
  rooms: 'room_id',
  roomBookings: 'booking_id',
  admissions: 'admission_id',
  budgets: 'budget_id',
  expenses: 'expense_id',
  notifications: 'notification_id',
};

// ID prefix per table, used when a component creates a new record without
// specifying its own ID.
const ID_PREFIXES = {
  users: 'USR',
  patients: 'PAT',
  prescriptions: 'RX',
  prescriptionItems: 'ITEM',
  doseLogs: 'DOSE',
  appointments: 'APT',
  hospitals: 'HOS',
  staff: 'STF',
  drugs: 'DRG',
  rooms: 'ROOM',
  roomBookings: 'BOOK',
  admissions: 'ADM',
  budgets: 'BUD',
  expenses: 'EXP',
  notifications: 'NOT',
};

/**
 * Builds a repository for one table. Every method reads the full table,
 * operates on it in memory, then writes it back — fine at this data size
 * (tens of rows), and it's the same read-modify-write shape a real SQL
 * UPDATE would have from the caller's point of view.
 */
function createRepository(table) {
  const pk = PRIMARY_KEYS[table];
  const prefix = ID_PREFIXES[table];

  return {
    /** Returns every row in the table. */
    getAll() {
      return readTable(table);
    },

    /** Returns a single row by primary key, or undefined if not found. */
    getById(id) {
      return readTable(table).find((row) => row[pk] === id);
    },

    /** Returns all rows matching a predicate, e.g. query(r => r.status === 'active'). */
    query(predicate) {
      return readTable(table).filter(predicate);
    },

    /** Returns all rows where fieldName === value, e.g. findBy('patient_id', 'PAT-001'). */
    findBy(fieldName, value) {
      return readTable(table).filter((row) => row[fieldName] === value);
    },

    /**
     * Inserts a new row. Generates a PK automatically unless the caller
     * already supplied one. Returns the inserted row (with its final PK).
     */
    create(data) {
      const rows = readTable(table);
      const id = data[pk] ?? createId(prefix, rows.map((r) => r[pk]));
      const newRow = { ...data, [pk]: id };
      rows.push(newRow);
      writeTable(table, rows);
      notify(table);
      return newRow;
    },

    /** Merges `updates` into the row matching `id`. Returns the updated row, or null if not found. */
    update(id, updates) {
      const rows = readTable(table);
      const index = rows.findIndex((row) => row[pk] === id);
      if (index === -1) return null;
      rows[index] = { ...rows[index], ...updates };
      writeTable(table, rows);
      notify(table);
      return rows[index];
    },

    /** Removes the row matching `id`. Returns true if a row was removed. */
    remove(id) {
      const rows = readTable(table);
      const next = rows.filter((row) => row[pk] !== id);
      const removed = next.length !== rows.length;
      if (removed) {
        writeTable(table, next);
        notify(table);
      }
      return removed;
    },
  };
}

// One repository per table, keyed by the same names used everywhere else
// (constants.TABLES, seed.js, PRIMARY_KEYS above).
export const db = TABLES.reduce((acc, table) => {
  acc[table] = createRepository(table);
  return acc;
}, {});
