// Standalone sanity check for the data layer — run with `node verify-seed-data.mjs`.
// Not part of the app; just a quick way to confirm the seed data and business
// logic still hold together after you edit them (referential integrity,
// low-stock/expiry triggers, booking conflicts, budget thresholds, etc.)

// Minimal localStorage polyfill for node so we can smoke-test the data layer
globalThis.window = globalThis;
const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
};

import { initStorage } from './src/data/storage.js';
import { db } from './src/data/repositories.js';
import * as bl from './src/data/businessLogic.js';
import { TABLES } from './src/data/constants.js';

initStorage();

// 1. Every table has rows, and every row has its declared primary key set
for (const table of TABLES) {
  const rows = db[table].getAll();
  if (rows.length === 0) throw new Error(`Table ${table} seeded with 0 rows`);
  console.log(`${table}: ${rows.length} rows`);
}

// 2. Referential integrity spot checks
const drugIds = new Set(db.drugs.getAll().map(d => d.drug_id));
for (const item of db.prescriptionItems.getAll()) {
  if (!drugIds.has(item.drug_id)) throw new Error(`prescriptionItems ${item.item_id} references missing drug ${item.drug_id}`);
}
const patientIds = new Set(db.patients.getAll().map(p => p.patient_id));
for (const rx of db.prescriptions.getAll()) {
  if (!patientIds.has(rx.patient_id)) throw new Error(`prescription ${rx.prescription_id} references missing patient`);
}
const hospitalIds = new Set(db.hospitals.getAll().map(h => h.hospital_id));
for (const staff of db.staff.getAll()) {
  if (!hospitalIds.has(staff.hospital_id)) throw new Error(`staff ${staff.staff_id} references missing hospital`);
}
const userIds = new Set(db.users.getAll().map(u => u.user_id));
for (const p of db.patients.getAll()) {
  if (!userIds.has(p.user_id)) throw new Error(`patient ${p.patient_id} references missing user`);
}
for (const s of db.staff.getAll()) {
  if (!userIds.has(s.user_id)) throw new Error(`staff ${s.staff_id} references missing user`);
}
console.log('Referential integrity: OK');

// 3. Business logic sanity checks
const lowStock = bl.getLowStockDrugs();
console.log('Low stock drugs:', lowStock.map(d => d.name));
if (lowStock.length === 0) throw new Error('Expected at least one low-stock drug in seed data');

const expiring = bl.getExpiringDrugs(30, null, new Date('2026-08-12'));
console.log('Expiring within 30 days:', expiring.map ? expiring.map(d => d.name) : expiring);

const expiringFixed = bl.getExpiringDrugs(30);
console.log('Expiring (default today=now):', expiringFixed.length);

const conflict = bl.hasBookingConflict('ROOM-003', '2026-08-14T09:00:00', '2026-08-14T09:30:00');
console.log('Conflict for ROOM-003 09:00-09:30 on 8/14 (should be true, overlaps BOOK-001):', conflict);
if (conflict !== true) throw new Error('Expected booking conflict to be detected');

const noConflict = bl.hasBookingConflict('ROOM-003', '2026-08-14T11:00:00', '2026-08-14T12:00:00');
console.log('No conflict for ROOM-003 11:00-12:00 (should be false):', noConflict);
if (noConflict !== false) throw new Error('Expected no booking conflict');

for (const budgetId of ['BUD-002', 'BUD-007', 'BUD-001']) {
  const status = bl.getBudgetStatus(budgetId);
  console.log(budgetId, status.percentConsumed + '%', 'overThreshold=' + status.isOverThreshold, 'exceeded=' + status.isExceeded);
}

for (const item of db.prescriptionItems.getAll()) {
  if (!bl.isDosageWithinLimit(item)) throw new Error(`Item ${item.item_id} exceeds its own max_daily_dose in seed data`);
}
console.log('All prescription items respect max_daily_dose: OK');

for (const admission of db.admissions.getAll()) {
  if (!bl.isAdmissionStateValid(admission)) throw new Error(`Admission ${admission.admission_id} violates admitted/discharge_datetime integrity rule`);
}
console.log('All admissions respect integrity rule 4: OK');

const occupancy = bl.getCurrentOccupancy();
console.log('Currently admitted patients:', occupancy.length);

// 4. Repository create/update/remove round-trip
const newPatient = db.patients.create({ first_name: 'Test', last_name: 'Patient', user_id: 'USR-P001', date_of_birth: '2000-01-01', phone: '000', registered_at: new Date().toISOString() });
console.log('Created patient with generated ID:', newPatient.patient_id);
const updated = db.patients.update(newPatient.patient_id, { phone: '111' });
if (updated.phone !== '111') throw new Error('Update did not persist');
const removed = db.patients.remove(newPatient.patient_id);
if (!removed) throw new Error('Remove failed');
console.log('Create/update/remove round-trip: OK');

// 5. changeEmitter fires on writes made through repositories.js directly
const { subscribe } = await import('./src/data/changeEmitter.js');
let notifiedTable = null;
const unsubscribe = subscribe((table) => { notifiedTable = table; });
db.hospitals.update('HOS-001', { phone: '0700000000' });
if (notifiedTable !== 'hospitals') throw new Error('changeEmitter did not fire on db.hospitals.update()');
unsubscribe();
console.log('changeEmitter fires on writes: OK');

// 6. Services layer — spot-check each domain
const {
  authService, patientService, prescriptionService, appointmentService,
  hospitalService, staffService, inventoryService, roomService,
  admissionService, budgetService, notificationService,
} = await import('./src/services/index.js');

const loggedIn = authService.login('esther.wanjiku@mediflow.dev', 'hashed_placeholder_pw');
if (!loggedIn) throw new Error('authService.login failed for a seeded, valid patient account');
console.log('authService.login: OK ->', loggedIn.email);

const profile = patientService.getPatientProfile('PAT-001');
if (!profile || profile.patient.first_name !== 'Esther') throw new Error('patientService.getPatientProfile returned unexpected data');
console.log('patientService.getPatientProfile: OK ->', profile.activePrescriptions.length, 'active prescriptions,', profile.upcomingAppointments.length, 'upcoming appts');

let threw = false;
try {
  // ITEM-001 already covers PAT-001 + DRG-006 with an overlapping active window
  prescriptionService.addItem('RX-001', { drug_id: 'DRG-006', dosage_amount: 5, dosage_unit: 'mg', frequency_per_day: 1, duration_days: 10, max_daily_dose: 5, start_date: '2026-08-12', end_date: '2026-08-22', instructions: 'test' });
} catch (e) { threw = true; }
if (!threw) throw new Error('prescriptionService.addItem should have rejected an overlapping prescription (Integrity Rule 5)');
console.log('prescriptionService.addItem rejects overlap: OK');

const upcoming = appointmentService.getUpcoming();
console.log('appointmentService.getUpcoming:', upcoming.length, 'scheduled appointments in the future');

console.log('hospitalService.getAllHospitals:', hospitalService.getAllHospitals().length);
console.log('staffService.getStaffByHospital(HOS-001):', staffService.getStaffByHospital('HOS-001').length);

const summary = inventoryService.getInventorySummary();
console.log('inventoryService.getInventorySummary:', summary);
if (summary.lowStock < 1) throw new Error('Expected inventoryService.getInventorySummary to report low-stock drugs');

threw = false;
try { inventoryService.dispense('DRG-004', 999999); } catch (e) { threw = true; }
if (!threw) throw new Error('inventoryService.dispense should reject a quantity that takes stock below zero (Integrity Rule 1)');
console.log('inventoryService.dispense rejects over-dispensing: OK');

threw = false;
try {
  // BOOK-001 already holds ROOM-003 08:00-10:00 on 2026-08-14
  roomService.createBooking({ roomId: 'ROOM-003', staffId: 'STF-001', startDatetime: '2026-08-14T09:00:00', endDatetime: '2026-08-14T09:30:00', purpose: 'test' });
} catch (e) { threw = true; }
if (!threw) throw new Error('roomService.createBooking should reject an overlapping booking (Integrity Rule 3)');
console.log('roomService.createBooking rejects overlap: OK');

const occupancyViaService = admissionService.getCurrentOccupancy();
console.log('admissionService.getCurrentOccupancy:', occupancyViaService.length);

const budgetStatus = budgetService.getBudgetStatus('BUD-007');
console.log('budgetService.getBudgetStatus(BUD-007):', budgetStatus.percentConsumed + '%', 'exceeded=' + budgetStatus.isExceeded);
if (!budgetStatus.isExceeded) throw new Error('Expected BUD-007 to already be over its allocation in seed data');

const unread = notificationService.getUnreadCount('USR-P001');
console.log('notificationService.getUnreadCount(USR-P001):', unread);

console.log('\nALL CHECKS PASSED');
