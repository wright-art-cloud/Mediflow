import { db } from '../data/repositories.js';

export const hospitalService = {
  getAllHospitals() {
    return db.hospitals.getAll();
  },

  getHospitalById(hospitalId) {
    return db.hospitals.getById(hospitalId);
  },

  registerHospital(data) {
    return db.hospitals.create(data);
  },

  updateHospital(hospitalId, updates) {
    return db.hospitals.update(hospitalId, updates);
  },
};
