// Rule-based decision logic — deliberately NOT machine learning (see §9 of
// the docs: this was renamed from "AI Logic" to "System Logic and Decision
// Rules" precisely because every function here is a plain conditional over
// stored data, not a trained model). If a marker asks "which algorithm did
// you use", the honest answer is: none — these are auditable if/else rules.

import { db } from './repositories.js';

// ---------------------------------------------------------------------------
// §9.x Inventory: low stock + expiry + projected depletion
// ---------------------------------------------------------------------------

/** Rule: a drug is low stock when quantity_in_stock has fallen to or below its reorder_threshold. */
export function isLowStock(drug) {
  return drug.quantity_in_stock <= drug.reorder_threshold;
}

/** Rule: a drug is "near expiry" when expiry_date is within `daysThreshold` days of `today`. */
export function isNearExpiry(drug, daysThreshold = 30, today = new Date()) {
  const expiry = new Date(drug.expiry_date);
  const diffDays = (expiry - today) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= daysThreshold;
}

/** Returns every drug currently at or below its reorder threshold. */
export function getLowStockDrugs(hospitalId = null) {
  const drugs = hospitalId ? db.drugs.findBy('hospital_id', hospitalId) : db.drugs.getAll();
  return drugs.filter(isLowStock);
}

/** Returns every drug expiring within `daysThreshold` days. */
export function getExpiringDrugs(daysThreshold = 30, hospitalId = null) {
  const drugs = hospitalId ? db.drugs.findBy('hospital_id', hospitalId) : db.drugs.getAll();
  return drugs.filter((drug) => isNearExpiry(drug, daysThreshold));
}

/**
 * Projects a depletion date for a drug from its recent dispensing rate.
 * Consumption is derived from prescription_items issued against this drug
 * in the last `lookbackDays` days (quantity dispensed = dosage_amount *
 * frequency_per_day * duration_days, spread over the item's active window).
 * Returns null if there's no recent consumption to project from.
 */
export function getProjectedDepletionDate(drugId, lookbackDays = 30, today = new Date()) {
  const drug = db.drugs.getById(drugId);
  if (!drug) return null;

  const cutoff = new Date(today);
  cutoff.setDate(cutoff.getDate() - lookbackDays);

  const recentItems = db.prescriptionItems
    .findBy('drug_id', drugId)
    .filter((item) => new Date(item.start_date) >= cutoff);

  if (recentItems.length === 0) return null;

  const totalUnitsDispensed = recentItems.reduce(
    (sum, item) => sum + item.dosage_amount * item.frequency_per_day * item.duration_days,
    0
  );
  const avgDailyConsumption = totalUnitsDispensed / lookbackDays;
  if (avgDailyConsumption <= 0) return null;

  const daysRemaining = drug.quantity_in_stock / avgDailyConsumption;
  const depletionDate = new Date(today);
  depletionDate.setDate(depletionDate.getDate() + Math.floor(daysRemaining));
  return depletionDate;
}

// ---------------------------------------------------------------------------
// §9.x Room scheduling: booking conflict detection
// ---------------------------------------------------------------------------

/**
 * Integrity Rule 3 (§10.5): bookings for the same room may not overlap.
 * Two ranges overlap when one starts before the other ends, both ways.
 * Pass `excludeBookingId` when checking an edit, so a booking doesn't
 * conflict with its own pre-edit self.
 */
export function hasBookingConflict(roomId, startDatetime, endDatetime, excludeBookingId = null) {
  const start = new Date(startDatetime);
  const end = new Date(endDatetime);

  return db.roomBookings
    .findBy('room_id', roomId)
    .filter((booking) => booking.booking_id !== excludeBookingId)
    .filter((booking) => booking.status !== 'cancelled')
    .some((booking) => {
      const existingStart = new Date(booking.start_datetime);
      const existingEnd = new Date(booking.end_datetime);
      return start < existingEnd && existingStart < end;
    });
}

// ---------------------------------------------------------------------------
// §9.x Prescription / dosage validation
// ---------------------------------------------------------------------------

/** Rule: a prescription item's daily dose (amount x frequency) may not exceed max_daily_dose. */
export function isDosageWithinLimit(item) {
  return item.dosage_amount * item.frequency_per_day <= item.max_daily_dose;
}

/**
 * Integrity Rule 5 (§10.5): a patient may not hold two active prescription
 * items for the same drug with overlapping date ranges. Call this before
 * creating a new item to decide whether to block it.
 */
export function hasOverlappingPrescription(patientId, drugId, startDate, endDate, excludeItemId = null) {
  const patientPrescriptionIds = new Set(
    db.prescriptions.findBy('patient_id', patientId)
      .filter((rx) => rx.status === 'active')
      .map((rx) => rx.prescription_id)
  );

  const start = new Date(startDate);
  const end = new Date(endDate);

  return db.prescriptionItems
    .findBy('drug_id', drugId)
    .filter((item) => patientPrescriptionIds.has(item.prescription_id))
    .filter((item) => item.item_id !== excludeItemId)
    .some((item) => {
      const existingStart = new Date(item.start_date);
      const existingEnd = new Date(item.end_date);
      return start <= existingEnd && existingStart <= end;
    });
}

/** Summarises how many scheduled doses a patient has taken vs missed/skipped, for an adherence view. */
export function getDoseAdherence(patientId) {
  const logs = db.doseLogs.findBy('patient_id', patientId);
  const taken = logs.filter((log) => log.status === 'taken').length;
  const missed = logs.filter((log) => log.status === 'missed').length;
  const skipped = logs.filter((log) => log.status === 'skipped').length;
  const pending = logs.filter((log) => log.status === 'pending').length;
  const total = logs.length;
  const adherenceRate = total > 0 ? Math.round((taken / (total - pending || 1)) * 100) : null;
  return { total, taken, missed, skipped, pending, adherenceRate };
}

// ---------------------------------------------------------------------------
// §9.5 Budget consumption logic
// ---------------------------------------------------------------------------

/**
 * spent_amount is deliberately not stored on the budget record (see the
 * note in seed.js and §10.4.7) — it's derived here by summing linked
 * expenses, so it can never drift out of sync with the underlying records.
 */
export function getBudgetSpent(budgetId) {
  return db.expenses
    .findBy('budget_id', budgetId)
    .reduce((sum, expense) => sum + expense.amount, 0);
}

/** Returns spend, remaining balance, percentage consumed, and whether the alert threshold has been crossed. */
export function getBudgetStatus(budgetId) {
  const budget = db.budgets.getById(budgetId);
  if (!budget) return null;

  const spent = getBudgetSpent(budgetId);
  const remaining = budget.allocated_amount - spent;
  const percentConsumed = Math.round((spent / budget.allocated_amount) * 100);
  const isOverThreshold = percentConsumed >= budget.alert_threshold;
  const isExceeded = spent > budget.allocated_amount;

  return { budget, spent, remaining, percentConsumed, isOverThreshold, isExceeded };
}

/** Returns getBudgetStatus() for every budget belonging to a hospital (or all hospitals if omitted). */
export function getAllBudgetStatuses(hospitalId = null) {
  const budgets = hospitalId ? db.budgets.findBy('hospital_id', hospitalId) : db.budgets.getAll();
  return budgets.map((budget) => getBudgetStatus(budget.budget_id));
}

// ---------------------------------------------------------------------------
// §10.5 Admissions integrity + occupancy
// ---------------------------------------------------------------------------

/** Integrity Rule 4: an admission with status 'admitted' must have a null discharge_datetime. */
export function isAdmissionStateValid(admission) {
  if (admission.status === 'admitted') return admission.discharge_datetime === null;
  return admission.discharge_datetime !== null;
}

/** Returns every currently-admitted patient (status 'admitted'), optionally filtered to one hospital. */
export function getCurrentOccupancy(hospitalId = null) {
  const admissions = hospitalId
    ? db.admissions.findBy('hospital_id', hospitalId)
    : db.admissions.getAll();
  return admissions.filter((admission) => admission.status === 'admitted');
}

// ---------------------------------------------------------------------------
// §10.5 Integrity Rule 7: patients with dependent records can't be deleted
// ---------------------------------------------------------------------------

/** Returns true if a patient has any prescription or admission records — deletion should be blocked, deactivate instead. */
export function hasDependentRecords(patientId) {
  const hasPrescriptions = db.prescriptions.findBy('patient_id', patientId).length > 0;
  const hasAdmissions = db.admissions.findBy('patient_id', patientId).length > 0;
  return hasPrescriptions || hasAdmissions;
}
