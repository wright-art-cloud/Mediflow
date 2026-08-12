import { db } from '../data/repositories.js';

export const staffService = {
  getAllStaff() {
    return db.staff.getAll();
  },

  getStaffById(staffId) {
    return db.staff.getById(staffId);
  },

  getStaffByHospital(hospitalId) {
    return db.staff.findBy('hospital_id', hospitalId);
  },

  getStaffByUserId(userId) {
    return db.staff.findBy('user_id', userId)[0] ?? null;
  },

  hireStaff(data) {
    return db.staff.create(data);
  },

  updateStaff(staffId, updates) {
    return db.staff.update(staffId, updates);
  },
};
