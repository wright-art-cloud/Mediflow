import { useState } from 'react';
import { useMediflowData } from '../../context/DataContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { IconPlus, IconWarning } from '../../components/icons.jsx';

function todayFiscalPeriod() {
  const d = new Date();
  const q = Math.floor(d.getMonth() / 3) + 1;
  return `${d.getFullYear()}-Q${q}`;
}

export default function Budgets() {
  const { budgetService } = useMediflowData();
  const { staff } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ department: '', category: 'equipment', allocatedAmount: '', alertThreshold: '80' });

  const statuses = budgetService.getAllBudgetStatuses(staff.hospital_id).filter((s) => s.budget.status !== 'closed');
  const exceeded = statuses.filter((s) => s.isExceeded);

  function submitAllocation(e) {
    e.preventDefault();
    if (!form.department || !form.allocatedAmount) return;
    const now = new Date();
    const qStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
    const qEnd = new Date(qStart.getFullYear(), qStart.getMonth() + 3, 0);
    budgetService.allocateBudget({
      hospital_id: staff.hospital_id,
      department: form.department,
      category: form.category,
      fiscal_period: todayFiscalPeriod(),
      period_start: qStart.toISOString().slice(0, 10),
      period_end: qEnd.toISOString().slice(0, 10),
      allocated_amount: Number(form.allocatedAmount),
      currency: 'KES',
      alert_threshold: Number(form.alertThreshold),
    });
    setForm({ department: '', category: 'equipment', allocatedAmount: '', alertThreshold: '80' });
    setShowForm(false);
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Budgets</h1>
          <p>Departmental allocations and consumption status for the current fiscal period.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => setShowForm((s) => !s)}><IconPlus /> New allocation</button>
        </div>
      </div>

      {showForm && (
        <form className="card card-pad" style={{ marginBottom: 20 }} onSubmit={submitAllocation}>
          <div className="field-row">
            <div className="field"><label>Department</label><input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required /></div>
            <div className="field">
              <label>Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {['drug_procurement', 'equipment', 'maintenance', 'consumables', 'other'].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="field-row" style={{ marginBottom: 6 }}>
            <div className="field"><label>Allocated amount (KES)</label><input type="number" value={form.allocatedAmount} onChange={(e) => setForm({ ...form, allocatedAmount: e.target.value })} required /></div>
            <div className="field"><label>Alert threshold (%)</label><input type="number" value={form.alertThreshold} onChange={(e) => setForm({ ...form, alertThreshold: e.target.value })} required /></div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn" onClick={() => setShowForm(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Allocate budget</button>
          </div>
        </form>
      )}

      <div className="budget-grid">
        {statuses.map(({ budget, spent, percentConsumed, isExceeded, isOverThreshold }) => {
          const label = isExceeded ? 'Over budget' : isOverThreshold ? 'Near limit' : 'On track';
          const cls = isExceeded ? 'badge-rose' : isOverThreshold ? 'badge-amber' : 'badge-teal';
          const barCls = isExceeded ? 'danger' : isOverThreshold ? 'warn' : '';
          return (
            <div className="budget-card" key={budget.budget_id}>
              <div className="budget-top">
                <div>
                  <div className="budget-dept">{budget.department}</div>
                  <div className="budget-period">{budget.fiscal_period} &middot; {budget.category.replace('_', ' ')}</div>
                </div>
                <span className={`badge ${cls}`}><span className="badge-dot" />{label}</span>
              </div>
              <div className="budget-amounts">
                <span>Spent <strong>KES {spent.toLocaleString()}</strong></span>
                <span>of <strong>KES {budget.allocated_amount.toLocaleString()}</strong></span>
              </div>
              <div className="progress-track"><div className={`progress-fill ${barCls}`} style={{ width: `${Math.min(percentConsumed, 100)}%` }} /></div>
              <div className="field-hint" style={{ marginTop: 8 }}>{percentConsumed}% consumed &middot; alert threshold at {budget.alert_threshold}%</div>
            </div>
          );
        })}
      </div>

      {exceeded.map(({ budget }) => (
        <div className="alert-box danger" style={{ marginTop: 20 }} key={budget.budget_id}>
          <IconWarning />
          <div>
            <strong>{budget.department} is over its {budget.fiscal_period} allocation</strong>
            Spend is derived live from linked expense records rather than stored directly, so this updates the moment a new expense is recorded against the department. Overspend is flagged, not blocked.
          </div>
        </div>
      ))}
    </>
  );
}
