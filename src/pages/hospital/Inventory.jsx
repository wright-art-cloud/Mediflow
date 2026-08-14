import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMediflowData } from '../../context/DataContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { IconBox, IconWarning, IconSearch, IconPlus } from '../../components/icons.jsx';

function statusOf(drug) {
  if (drug.quantity_in_stock === 0) return { label: 'Out of stock', cls: 'badge-rose' };
  if (drug.quantity_in_stock <= drug.reorder_threshold) return { label: 'Low stock', cls: 'badge-amber' };
  return { label: 'In stock', cls: 'badge-teal' };
}

export default function Inventory() {
  const { inventoryService } = useMediflowData();
  const { staff } = useAuth();
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');

  const drugs = inventoryService.getAllDrugs(staff.hospital_id);
  const categories = [...new Set(drugs.map((d) => d.category))];

  const filtered = drugs.filter((d) => {
    if (q && !`${d.name} ${d.generic_name}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (category !== 'all' && d.category !== category) return false;
    const s = statusOf(d).label;
    if (status === 'low' && s !== 'Low stock') return false;
    if (status === 'out' && s !== 'Out of stock') return false;
    if (status === 'ok' && s !== 'In stock') return false;
    return true;
  });

  const lowCount = drugs.filter((d) => d.quantity_in_stock > 0 && d.quantity_in_stock <= d.reorder_threshold).length;
  const outCount = drugs.filter((d) => d.quantity_in_stock === 0).length;

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Inventory</h1>
          <p>Drug stock across your hospital.</p>
        </div>
        <div className="header-actions">
          <Link to="/hospital/inventory/new" className="btn btn-primary"><IconPlus /> Add drug</Link>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--teal-100)', color: 'var(--teal-700)' }}><IconBox /></div>
          <div><div className="stat-label">Total SKUs</div><div className="stat-value">{drugs.length}</div><div className="stat-caption">Across {categories.length} categories</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--amber-100)', color: 'var(--amber-600)' }}><IconWarning /></div>
          <div><div className="stat-label">Low stock</div><div className="stat-value">{lowCount}</div><div className="stat-caption">Below reorder threshold</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--rose-100)', color: 'var(--rose-600)' }}><IconWarning /></div>
          <div><div className="stat-label">Out of stock</div><div className="stat-value">{outCount}</div><div className="stat-caption">Reorder immediately</div></div>
        </div>
      </div>

      <div className="card card-pad">
        <div className="search-bar">
          <div className="search-input-wrap">
            <IconSearch />
            <input placeholder="Search by drug name…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <select className="filter-select" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="filter-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All stock statuses</option>
            <option value="ok">In stock</option>
            <option value="low">Low stock</option>
            <option value="out">Out of stock</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state"><h3>No drugs match your filters</h3></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Drug</th><th>Category</th><th>Stock on hand</th><th>Reorder level</th><th>Unit cost</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {filtered.map((d) => {
                  const s = statusOf(d);
                  return (
                    <tr key={d.drug_id}>
                      <td><div className="cell-primary">{d.name} {d.strength}{d.strength_unit}</div><div className="cell-sub">{d.drug_id} &middot; {d.form}</div></td>
                      <td>{d.category}</td>
                      <td className="cell-mono">{d.quantity_in_stock} units</td>
                      <td className="cell-mono">{d.reorder_threshold} units</td>
                      <td className="cell-mono">KES {d.unit_cost}</td>
                      <td><span className={`badge ${s.cls}`}><span className="badge-dot" />{s.label}</span></td>
                      <td><Link to={`/hospital/inventory/${d.drug_id}/edit`} className="btn btn-sm">Edit</Link></td>
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
