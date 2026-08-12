import { db } from '../data/repositories.js';
import { getCurrentOccupancy, isAdmissionStateValid } from '../data/businessLogic.js';

export const admissionService = {
  getAllAdmissions(hospitalId = null) {
    return hospitalId ? db.admissions.findBy('hospital_id', hospitalId) : db.admissions.getAll();
  },

  getAdmissionsForPatient(patientId) {
    return db.admissions.findBy('patient_id', patientId);
  },

  getCurrentOccupancy,
  isAdmissionStateValid,

  /** §6.2.3 Patient Intake and Discharge: opens a new admission record. */
  admitPatient({ patientId, hospitalId, roomId = null, admittingStaffId, reason, notes = '' }) {
    return db.admissions.create({
      patient_id: patientId,
      hospital_id: hospitalId,
      room_id: roomId,
      admitting_staff_id: admittingStaffId,
      admission_datetime: new Date().toISOString(),
      discharge_datetime: null,
      reason,
      status: 'admitted',
      notes,
    });
  },

  /** Integrity Rule 4 (§10.5): closing an admission sets discharge_datetime the same moment status leaves 'admitted'. */
  dischargePatient(admissionId) {
    return db.admissions.update(admissionId, {
      discharge_datetime: new Date().toISOString(),
      status: 'discharged',
    });
  },

  transferPatient(admissionId, newRoomId) {
    return db.admissions.update(admissionId, { room_id: newRoomId, status: 'transferred' });
  },
};
