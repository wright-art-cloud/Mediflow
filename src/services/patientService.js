import { db } from '../data/repositories.js';
import { hasDependentRecords, getDoseAdherence } from '../data/businessLogic.js';

export const patientService = {
  getAllPatients() {
    return db.patients.getAll();
  },

  getPatientById(patientId) {
    return db.patients.getById(patientId);
  },

  getPatientByUserId(userId) {
    return db.patients.findBy('user_id', userId)[0] ?? null;
  },

  registerPatient(data) {
    return db.patients.create({ registered_at: new Date().toISOString(), ...data });
  },

  updatePatient(patientId, updates) {
    return db.patients.update(patientId, updates);
  },

  /** Integrity Rule 7 (§10.5): patients with dependent records are deactivated, not deleted. */
  deactivatePatient(patientId) {
    return db.patients.update(patientId, { is_active: false });
  },

  /** Hard delete — throws if the patient has any linked prescriptions or admissions. Use deactivatePatient() instead in that case. */
  deletePatient(patientId) {
    if (hasDependentRecords(patientId)) {
      throw new Error(`Cannot delete ${patientId}: linked prescription or admission records exist. Deactivate instead.`);
    }
    return db.patients.remove(patientId);
  },

  /** Everything a patient dashboard needs in one call. */
  getPatientProfile(patientId) {
    const patient = db.patients.getById(patientId);
    if (!patient) return null;

    const prescriptions = db.prescriptions.findBy('patient_id', patientId);
    const upcomingAppointments = db.appointments
      .findBy('patient_id', patientId)
      .filter((appt) => appt.status === 'scheduled')
      .sort((a, b) => new Date(a.scheduled_datetime) - new Date(b.scheduled_datetime));

    return {
      patient,
      activePrescriptions: prescriptions.filter((rx) => rx.status === 'active'),
      prescriptionHistory: prescriptions,
      upcomingAppointments,
      admissionHistory: db.admissions.findBy('patient_id', patientId),
      doseAdherence: getDoseAdherence(patientId),
    };
  },
};
