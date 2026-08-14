import { Link } from 'react-router-dom';
import { useMediflowData } from '../../context/DataContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { formatDate, fullName } from '../../utils/format.js';

const STATUS_BADGE = {
  completed: { label: 'Completed', cls: 'badge-teal' },
  cancelled: { label: 'Cancelled', cls: 'badge-slate' },
};

export default function PrescriptionHistory() {
  const { prescriptionService, staffService, inventoryService } = useMediflowData();
  const { patient } = useAuth();

  const past = prescriptionService.getPrescriptionsForPatient(patient.patient_id).filter((rx) => rx.status !== 'active');

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Prescriptions</h1>
          <p>Your active courses, dosage schedule, and dose logging.</p>
        </div>
      </div>

      <div className="tabs">
        <Link to="/patient/prescriptions" className="tab">Active</Link>
        <span className="tab active">History</span>
      </div>

      <div className="card">
        {past.length === 0 ? (
          <div className="empty-state">
            <h3>Nothing here yet</h3>
            <p>Completed and cancelled prescriptions will show up here.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Diagnosis</th><th>Medication(s)</th><th>Prescribed by</th><th>Issued</th><th>Outcome</th></tr></thead>
              <tbody>
                {past.map((rx) => {
                  const { items } = prescriptionService.getPrescriptionWithItems(rx.prescription_id);
                  const staff = staffService.getStaffById(rx.staff_id);
                  const status = STATUS_BADGE[rx.status] || { label: rx.status, cls: 'badge-slate' };
                  return (
                    <tr key={rx.prescription_id}>
                      <td className="cell-primary">{rx.diagnosis}</td>
                      <td>{items.map((it) => inventoryService.getDrugById(it.drug_id)?.name).filter(Boolean).join(', ') || '—'}</td>
                      <td>Dr. {fullName(staff)}</td>
                      <td className="cell-mono">{formatDate(rx.date_issued)}</td>
                      <td><span className={`badge ${status.cls}`}><span className="badge-dot" />{status.label}</span></td>
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
