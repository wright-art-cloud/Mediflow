import { db } from '../data/repositories.js';
import { isDosageWithinLimit, hasOverlappingPrescription } from '../data/businessLogic.js';

export const prescriptionService = {
  getPrescriptionsForPatient(patientId) {
    return db.prescriptions.findBy('patient_id', patientId);
  },

  getPrescriptionWithItems(prescriptionId) {
    const prescription = db.prescriptions.getById(prescriptionId);
    if (!prescription) return null;
    return { ...prescription, items: db.prescriptionItems.findBy('prescription_id', prescriptionId) };
  },

  /** §6.2.4 Prescription Issuance: creates the prescription header. Add drugs to it with addItem(). */
  issuePrescription({ patientId, staffId, hospitalId, diagnosis, notes = '' }) {
    return db.prescriptions.create({
      patient_id: patientId,
      staff_id: staffId,
      hospital_id: hospitalId,
      date_issued: new Date().toISOString(),
      diagnosis,
      status: 'active',
      notes,
    });
  },

  /**
   * Adds a drug to a prescription. Throws if the item would breach its own
   * max_daily_dose, or Integrity Rule 5 (an overlapping active prescription
   * of the same drug already exists for this patient) — so a form can
   * catch the error and show it inline rather than silently saving bad data.
   * Decrements inventory on issuance, matching §6.2.4.
   */
  addItem(prescriptionId, itemData) {
    const prescription = db.prescriptions.getById(prescriptionId);
    if (!prescription) throw new Error(`No prescription ${prescriptionId}`);

    const candidate = { ...itemData, prescription_id: prescriptionId };
    if (!isDosageWithinLimit(candidate)) {
      throw new Error('dosage_amount x frequency_per_day exceeds max_daily_dose');
    }
    if (hasOverlappingPrescription(prescription.patient_id, candidate.drug_id, candidate.start_date, candidate.end_date)) {
      throw new Error('Patient already has an active, overlapping prescription for this drug');
    }

    const drug = db.drugs.getById(candidate.drug_id);
    if (drug) {
      const dispensedUnits = candidate.dosage_amount * candidate.frequency_per_day * candidate.duration_days;
      db.drugs.update(drug.drug_id, { quantity_in_stock: Math.max(0, drug.quantity_in_stock - dispensedUnits) });
    }

    return db.prescriptionItems.create(candidate);
  },

  completePrescription(prescriptionId) {
    return db.prescriptions.update(prescriptionId, { status: 'completed' });
  },

  cancelPrescription(prescriptionId) {
    return db.prescriptions.update(prescriptionId, { status: 'cancelled' });
  },

  /** Creates a scheduled (pending) dose entry — typically generated ahead of time from an item's frequency. */
  scheduleDose({ itemId, patientId, scheduledTime }) {
    return db.doseLogs.create({
      item_id: itemId,
      patient_id: patientId,
      scheduled_time: scheduledTime,
      taken_at: null,
      status: 'pending',
    });
  },

  markDoseTaken(logId) {
    return db.doseLogs.update(logId, { status: 'taken', taken_at: new Date().toISOString() });
  },

  markDoseMissed(logId) {
    return db.doseLogs.update(logId, { status: 'missed' });
  },

  markDoseSkipped(logId) {
    return db.doseLogs.update(logId, { status: 'skipped' });
  },

  getDoseLogsForItem(itemId) {
    return db.doseLogs.findBy('item_id', itemId);
  },

  getDoseLogsForPatient(patientId) {
    return db.doseLogs.findBy('patient_id', patientId);
  },
};
