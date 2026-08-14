import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMediflowData } from '../../context/DataContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { IconInfo } from '../../components/icons.jsx';

const BLANK = {
  name: '', generic_name: '', category: 'analgesic', form: 'tablet',
  strength: '', strength_unit: 'mg', quantity_in_stock: '', reorder_threshold: '',
  unit_cost: '', batch_number: '', expiry_date: '', supplier: '',
};

export default function InventoryEdit() {
  const { drugId } = useParams();
  const navigate = useNavigate();
  const { db, inventoryService } = useMediflowData();
  const { staff } = useAuth();
  const isEditing = Boolean(drugId);
  const existing = isEditing ? db.drugs.getById(drugId) : null;

  const [form, setForm] = useState(() => existing
    ? { ...existing }
    : { ...BLANK });

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      ...form,
      strength: Number(form.strength),
      quantity_in_stock: Number(form.quantity_in_stock),
      reorder_threshold: Number(form.reorder_threshold),
      unit_cost: Number(form.unit_cost),
    };
    if (isEditing) {
      db.drugs.update(drugId, payload);
    } else {
      inventoryService.addDrug({ ...payload, hospital_id: staff.hospital_id, last_restocked: new Date().toISOString() });
    }
    navigate('/hospital/inventory');
  }

  function handleDelete() {
    db.drugs.remove(drugId);
    navigate('/hospital/inventory');
  }

  if (isEditing && !existing) {
    return (
      <div className="empty-state">
        <h3>Drug not found</h3>
        <p><Link to="/hospital/inventory">Back to inventory</Link></p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 820 }}>
      <div className="breadcrumb"><Link to="/hospital/inventory">Inventory</Link> / {isEditing ? 'Edit drug' : 'Add drug'}</div>
      <div className="page-header">
        <div>
          <h1>{isEditing ? 'Edit drug' : 'Add drug'}</h1>
          <p>{isEditing ? `Update the record for ${existing.name}.` : 'Add a new drug record to the inventory.'}</p>
        </div>
      </div>

      <form className="card card-pad" onSubmit={handleSubmit}>
        <div className="field-row">
          <div className="field"><label>Drug name</label><input value={form.name} onChange={(e) => set('name', e.target.value)} required /></div>
          <div className="field">
            <label>Category</label>
            <select value={form.category} onChange={(e) => set('category', e.target.value)}>
              {['analgesic', 'antibiotic', 'antimalarial', 'antidiabetic', 'antihypertensive', 'antacid', 'bronchodilator', 'rehydration', 'sedative', 'supplement'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="field-row-3">
          <div className="field"><label>Generic name</label><input value={form.generic_name} onChange={(e) => set('generic_name', e.target.value)} /></div>
          <div className="field">
            <label>Form</label>
            <select value={form.form} onChange={(e) => set('form', e.target.value)}>
              {['tablet', 'capsule', 'injection', 'inhaler', 'sachet'].map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className="field-row" style={{ gap: 8 }}>
            <div className="field"><label>Strength</label><input type="number" value={form.strength} onChange={(e) => set('strength', e.target.value)} required /></div>
            <div className="field"><label>Unit</label><input value={form.strength_unit} onChange={(e) => set('strength_unit', e.target.value)} placeholder="mg" required /></div>
          </div>
        </div>

        <div className="field-row-3">
          <div className="field"><label>Stock on hand</label><input type="number" value={form.quantity_in_stock} onChange={(e) => set('quantity_in_stock', e.target.value)} required /></div>
          <div className="field"><label>Reorder threshold</label><input type="number" value={form.reorder_threshold} onChange={(e) => set('reorder_threshold', e.target.value)} required /></div>
          <div className="field"><label>Unit cost (KES)</label><input type="number" value={form.unit_cost} onChange={(e) => set('unit_cost', e.target.value)} required /></div>
        </div>

        <div className="field-row">
          <div className="field"><label>Supplier</label><input value={form.supplier} onChange={(e) => set('supplier', e.target.value)} /></div>
          <div className="field"><label>Expiry date</label><input type="date" value={form.expiry_date?.slice(0, 10) || ''} onChange={(e) => set('expiry_date', e.target.value)} required /></div>
        </div>

        <div className="field" style={{ marginBottom: 6 }}>
          <label>Batch number</label>
          <input value={form.batch_number} onChange={(e) => set('batch_number', e.target.value)} />
        </div>

        <div className="alert-box info" style={{ marginBottom: 6 }}>
          <IconInfo />
          <div>Stock at or below the <strong>reorder threshold</strong> triggers a low-stock alert on the dashboard automatically.</div>
        </div>

        <div className="form-actions">
          {isEditing && <button type="button" className="btn btn-danger" style={{ marginRight: 'auto' }} onClick={handleDelete}>Delete drug</button>}
          <Link to="/hospital/inventory" className="btn">Cancel</Link>
          <button type="submit" className="btn btn-primary">{isEditing ? 'Save changes' : 'Add drug'}</button>
        </div>
      </form>
    </div>
  );
}
