import { useState } from 'react';
import { useMediflowData } from '../../context/DataContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { IconCash, IconPlus, IconSearch } from '../../components/icons.jsx';
import { formatDate } from '../../utils/format.js';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

const CATEGORY_BADGE = {
  drug_procurement: 'badge-indigo', equipment: 'badge-slate', maintenance: 'badge-amber',
  consumables: 'badge-teal', other: 'badge-slate',
};

export default function Expenses() {
  const { budgetService, staffService } = useMediflowData();
  const { staff } = useAuth();
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: 'consumables', description: '', amount: '', budgetId: '', supplier: '', invoiceRef: '' });

  const expenses = budgetService.getExpensesForHospital(staff.hospital_id).sort((a, b) => new Date(b.date_incurred) - new Date(a.date_incurred));
  const budgets = budgetService.getAllBudgets(staff.hospital_id);
  const categories = [...new Set(expenses.map((e) => e.category))];

  const filtered = expenses.filter((e) => {
    if (q && !e.description.toLowerCase().includes(q.toLowerCase())) return false;
    if (category !== 'all' && e.category !== category) return false;
    return true;
  });

  const thisMonthTotal = expenses
    .filter((e) => new Date(e.date_incurred).getMonth() === new Date().getMonth())
    .reduce((sum, e) => sum + e.amount, 0);

  const statuses = budgetService.getAllBudgetStatuses(staff.hospital_id);
  const overBudgetCount = statuses.filter((s) => s.isExceeded).length;

  function submitExpense(e) {
    e.preventDefault();
    if (!form.description || !form.amount) return;
    budgetService.recordExpense({
      hospital_id: staff.hospital_id,
      budget_id: form.budgetId || null,
      drug_id: null,
      staff_id: staff.staff_id,
      category: form.category,
      description: form.description,
      amount: Number(form.amount),
      currency: 'KES',
      date_incurred: todayStr(),
      supplier: form.supplier,
      invoice_reference: form.invoiceRef,
      is_auto_generated: false,
    });
    setForm({ category: 'consumables', description: '', amount: '', budgetId: '', supplier: '', invoiceRef: '' });
    setShowForm(false);
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Expenses</h1>
          <p>Procurement and operational spend, by category and period.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => setShowForm((s) => !s)}><IconPlus /> Record expense</button>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--teal-100)', color: 'var(--teal-700)' }}><IconCash /></div>
          <div><div className="stat-label">Spend this month</div><div className="stat-value">KES {thisMonthTotal.toLocaleString()}</div><div className="stat-caption">{expenses.length} records total</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--amber-100)', color: 'var(--amber-600)' }}><IconCash /></div>
          <div><div className="stat-label">Over-budget lines</div><div className="stat-value">{overBudgetCount}</div><div className="stat-caption">Flagged this fiscal period</div></div>
        </div>
      </div>

      {showForm && (
        <form className="card card-pad" style={{ marginBottom: 20 }} onSubmit={submitExpense}>
          <div className="field-row">
            <div className="field"><label>Description</label><input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></div>
            <div className="field"><label>Amount (KES)</label><input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required /></div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {['drug_procurement', 'equipment', 'maintenance', 'consumables', 'other'].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Budget line (optional)</label>
              <select value={form.budgetId} onChange={(e) => setForm({ ...form, budgetId: e.target.value })}>
                <option value="">Unassigned</option>
                {budgets.map((b) => <option key={b.budget_id} value={b.budget_id}>{b.department} — {b.fiscal_period}</option>)}
              </select>
            </div>
          </div>
          <div className="field-row" style={{ marginBottom: 6 }}>
            <div className="field"><label>Supplier</label><input value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} /></div>
            <div className="field"><label>Invoice reference</label><input value={form.invoiceRef} onChange={(e) => setForm({ ...form, invoiceRef: e.target.value })} /></div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn" onClick={() => setShowForm(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Record expense</button>
          </div>
        </form>
      )}

      <div className="card card-pad">
        <div className="search-bar">
          <div className="search-input-wrap"><IconSearch /><input placeholder="Search expenses…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
          <select className="filter-select" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state"><h3>No expenses match your filters</h3></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Amount</th><th>Recorded by</th></tr></thead>
              <tbody>
                {filtered.map((e) => {
                  const recorder = staffService.getStaffById(e.staff_id);
                  return (
                    <tr key={e.expense_id}>
                      <td className="cell-mono">{formatDate(e.date_incurred)}</td>
                      <td className="cell-primary">{e.description}</td>
                      <td><span className={`badge ${CATEGORY_BADGE[e.category] || 'badge-slate'}`}>{e.category.replace('_', ' ')}</span></td>
                      <td className="cell-mono">KES {e.amount.toLocaleString()}</td>
                      <td>{recorder ? `${recorder.first_name} ${recorder.last_name}` : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
