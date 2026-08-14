import { useState } from 'react';
import { useMediflowData } from '../../context/DataContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { IconPlus } from '../../components/icons.jsx';
import { formatDate, fullName } from '../../utils/format.js';

const BLANK_ITEM = { drugId: '', dosageAmount: '', dosageUnit: 'mg', frequencyPerDay: '', durationDays: '', maxDailyDose: '', startDate: '', endDate: '', instructions: '' };

export default function Prescriptions() {
  const { db, prescriptionService, patientService, inventoryService } = useMediflowData();
  const { staff } = useAuth();
  const [header, setHeader] = useState({ patientId: '', diagnosis: '', notes: '' });
  const [item, setItem] = useState(BLANK_ITEM);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const issued = db.prescriptions.findBy('hospital_id', staff.hospital_id).sort((a, b) => new Date(b.date_issued) - new Date(a.date_issued));
  const patients = patientService.getAllPatients();
  const drugs = inventoryService.getAllDrugs(staff.hospital_id);

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!header.patientId || !header.diagnosis || !item.drugId) {
      setError('Patient, diagnosis, and a drug are all required.');
      return;
    }

    const rx = prescriptionService.issuePrescription({
      patientId: header.patientId,
      staffId: staff.staff_id,
      hospitalId: staff.hospital_id,
      diagnosis: header.diagnosis,
      notes: header.notes,
    });

    try {
      prescriptionService.addItem(rx.prescription_id, {
        drug_id: item.drugId,
        dosage_amount: Number(item.dosageAmount),
        dosage_unit: item.dosageUnit,
        frequency_per_day: Number(item.frequencyPerDay),
        duration_days: Number(item.durationDays),
        max_daily_dose: Number(item.maxDailyDose),
        start_date: item.startDate,
        end_date: item.endDate,
        instructions: item.instructions,
      });
      setSuccess(`Prescription ${rx.prescription_id} issued.`);
      setHeader({ patientId: '', diagnosis: '', notes: '' });
      setItem(BLANK_ITEM);
    } catch (err) {
      // Roll back the header so a failed item doesn't leave an empty active prescription behind.
      prescriptionService.cancelPrescription(rx.prescription_id);
      setError(err.message);
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Prescriptions</h1>
          <p>Issue new prescriptions and review what's been issued.</p>
        </div>
      </div>

      <div className="grid-main-side">
        <div className="stack">
          <div className="card">
            {issued.length === 0 ? (
              <div className="empty-state"><h3>No prescriptions issued yet</h3></div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Patient</th><th>Diagnosis</th><th>Issued</th><th>Status</th></tr></thead>
                  <tbody>
                    {issued.map((rx) => {
                      const patient = patientService.getPatientById(rx.patient_id);
                      return (
                        <tr key={rx.prescription_id}>
                          <td className="cell-primary">{fullName(patient)}</td>
                          <td>{rx.diagnosis}</td>
                          <td className="cell-mono">{formatDate(rx.date_issued)}</td>
                          <td><span className={`badge ${rx.status === 'active' ? 'badge-teal' : rx.status === 'cancelled' ? 'badge-rose' : 'badge-slate'}`}><span className="badge-dot" />{rx.status}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="stack">
          <form className="card card-pad" onSubmit={handleSubmit}>
            <div className="card-title" style={{ marginBottom: 16 }}><IconPlus /> Issue new prescription</div>

            {error && <div className="form-error">{error}</div>}
            {success && <div className="alert-box info" style={{ marginBottom: 16 }}>{success}</div>}

            <div className="field">
              <label>Patient</label>
              <select value={header.patientId} onChange={(e) => setHeader({ ...header, patientId: e.target.value })} required>
                <option value="">Select a patient…</option>
                {patients.map((p) => <option key={p.patient_id} value={p.patient_id}>{fullName(p)} — {p.patient_id}</option>)}
              </select>
            </div>
            <div className="field"><label>Diagnosis</label><input value={header.diagnosis} onChange={(e) => setHeader({ ...header, diagnosis: e.target.value })} required /></div>

            <div className="field">
              <label>Medication</label>
              <select value={item.drugId} onChange={(e) => setItem({ ...item, drugId: e.target.value })} required>
                <option value="">Select a drug…</option>
                {drugs.map((d) => <option key={d.drug_id} value={d.drug_id}>{d.name} {d.strength}{d.strength_unit}</option>)}
              </select>
            </div>
            <div className="field-row">
              <div className="field"><label>Dosage amount</label><input type="number" step="0.5" value={item.dosageAmount} onChange={(e) => setItem({ ...item, dosageAmount: e.target.value })} required /></div>
              <div className="field"><label>Unit</label><input value={item.dosageUnit} onChange={(e) => setItem({ ...item, dosageUnit: e.target.value })} placeholder="mg / tablets / g" required /></div>
            </div>
            <div className="field-row">
              <div className="field"><label>Frequency per day</label><input type="number" value={item.frequencyPerDay} onChange={(e) => setItem({ ...item, frequencyPerDay: e.target.value })} required /></div>
              <div className="field"><label>Max daily dose</label><input type="number" value={item.maxDailyDose} onChange={(e) => setItem({ ...item, maxDailyDose: e.target.value })} required /></div>
            </div>
            <div className="field-row">
              <div className="field"><label>Start date</label><input type="date" value={item.startDate} onChange={(e) => setItem({ ...item, startDate: e.target.value })} required /></div>
              <div className="field"><label>End date</label><input type="date" value={item.endDate} onChange={(e) => setItem({ ...item, endDate: e.target.value })} required /></div>
            </div>
            <div className="field"><label>Duration (days)</label><input type="number" value={item.durationDays} onChange={(e) => setItem({ ...item, durationDays: e.target.value })} required /></div>
            <div className="field" style={{ marginBottom: 6 }}>
              <label>Instructions</label>
              <textarea value={item.instructions} onChange={(e) => setItem({ ...item, instructions: e.target.value })} style={{ minHeight: 60 }} placeholder="Instructions for the patient…" />
            </div>

            <div className="form-actions" style={{ justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary">Issue prescription</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
