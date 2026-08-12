import { db } from '../data/repositories.js';
import { getBudgetSpent, getBudgetStatus, getAllBudgetStatuses } from '../data/businessLogic.js';

export const budgetService = {
  getAllBudgets(hospitalId = null) {
    return hospitalId ? db.budgets.findBy('hospital_id', hospitalId) : db.budgets.getAll();
  },

  getBudgetById(budgetId) {
    return db.budgets.getById(budgetId);
  },

  getBudgetSpent,
  getBudgetStatus,
  getAllBudgetStatuses,

  allocateBudget(data) {
    return db.budgets.create({ status: 'active', ...data });
  },

  closeBudget(budgetId) {
    return db.budgets.update(budgetId, { status: 'closed' });
  },

  /** §6.2.5 Expense Tracking: records an expense, then re-evaluates its linked budget so status flips to 'exceeded' the moment it actually is. */
  recordExpense(data) {
    const expense = db.expenses.create(data);
    if (expense.budget_id) {
      const status = getBudgetStatus(expense.budget_id);
      if (status?.isExceeded) {
        db.budgets.update(expense.budget_id, { status: 'exceeded' });
      }
    }
    return expense;
  },

  getExpensesForBudget(budgetId) {
    return db.expenses.findBy('budget_id', budgetId);
  },

  getExpensesForHospital(hospitalId) {
    return db.expenses.findBy('hospital_id', hospitalId);
  },
};
