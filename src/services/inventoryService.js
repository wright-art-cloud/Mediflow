import { db } from '../data/repositories.js';
import {
  isLowStock,
  isNearExpiry,
  getLowStockDrugs,
  getExpiringDrugs,
  getProjectedDepletionDate,
} from '../data/businessLogic.js';

export const inventoryService = {
  getAllDrugs(hospitalId = null) {
    return hospitalId ? db.drugs.findBy('hospital_id', hospitalId) : db.drugs.getAll();
  },

  getDrugById(drugId) {
    return db.drugs.getById(drugId);
  },

  getLowStockDrugs,
  getExpiringDrugs,
  getProjectedDepletionDate,

  addDrug(data) {
    return db.drugs.create(data);
  },

  /** Records a delivery: increments stock and updates last_restocked. */
  restock(drugId, quantity) {
    const drug = db.drugs.getById(drugId);
    if (!drug) throw new Error(`No drug ${drugId}`);
    return db.drugs.update(drugId, {
      quantity_in_stock: drug.quantity_in_stock + quantity,
      last_restocked: new Date().toISOString(),
    });
  },

  /** Integrity Rule 1 (§10.5): quantity_in_stock may not fall below zero — dispensing that would breach this is rejected. */
  dispense(drugId, quantity) {
    const drug = db.drugs.getById(drugId);
    if (!drug) throw new Error(`No drug ${drugId}`);
    if (drug.quantity_in_stock - quantity < 0) {
      throw new Error(`Dispensing ${quantity} of ${drug.name} would take stock below zero`);
    }
    return db.drugs.update(drugId, { quantity_in_stock: drug.quantity_in_stock - quantity });
  },

  /** Quick counts for a dashboard tile: how many drugs, how many low, how many near expiry. */
  getInventorySummary(hospitalId = null) {
    const drugs = this.getAllDrugs(hospitalId);
    return {
      total: drugs.length,
      lowStock: drugs.filter(isLowStock).length,
      nearExpiry: drugs.filter((drug) => isNearExpiry(drug)).length,
    };
  },
};
