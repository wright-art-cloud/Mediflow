import { db } from '../data/repositories.js';

export const appointmentService = {
  getAllAppointments() {
    return db.appointments.getAll();
  },

  getAppointmentsForPatient(patientId) {
    return db.appointments.findBy('patient_id', patientId);
  },

  getAppointmentsForStaff(staffId) {
    return db.appointments.findBy('staff_id', staffId);
  },

  /** Scheduled appointments from now onward, soonest first. */
  getUpcoming(hospitalId = null) {
    const now = new Date();
    const appointments = hospitalId ? db.appointments.findBy('hospital_id', hospitalId) : db.appointments.getAll();
    return appointments
      .filter((appt) => appt.status === 'scheduled' && new Date(appt.scheduled_datetime) >= now)
      .sort((a, b) => new Date(a.scheduled_datetime) - new Date(b.scheduled_datetime));
  },

  scheduleAppointment(data) {
    return db.appointments.create({ status: 'scheduled', ...data });
  },

  cancelAppointment(appointmentId) {
    return db.appointments.update(appointmentId, { status: 'cancelled' });
  },

  completeAppointment(appointmentId) {
    return db.appointments.update(appointmentId, { status: 'completed' });
  },

  markMissed(appointmentId) {
    return db.appointments.update(appointmentId, { status: 'missed' });
  },
};
