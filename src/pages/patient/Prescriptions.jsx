import { Link } from 'react-router-dom';
import { useMediflowData } from '../../context/DataContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { IconClock, IconWarning } from '../../components/icons.jsx';
import { formatDateTime, formatTime } from '../../utils/format.js';

function itemStatus(logs) {
  if (logs.some((l) => l.status === 'missed')) return { label: 'Missed dose', cls: 'badge-rose' };
  const pending = logs.filter((l) => l.status === 'pending');
  if (pending.length && new Date(pending[0].scheduled_time) - Date.now() < 1000 * 60 * 60 * 3) {
    return { label: 'Due soon', cls: 'badge-amber' };
  }
  return { label: 'On track', cls: 'badge-teal' };
}

export default function Prescriptions() {
  const { prescriptionService, inventoryService } = useMediflowData();
  const { patient } = useAuth();

  const active = prescriptionService.getPrescriptionsForPatient(patient.patient_id).filter((rx) => rx.status === 'active');
  const rows = active.flatMap((rx) => {
    const { items } = prescriptionService.getPrescriptionWithItems(rx.prescription_id);
    return items.map((item) => {
      const drug = inventoryService.getDrugById(item.drug_id);
      const logs = prescriptionService.getDoseLogsForItem(item.item_id);
      const nextPending = logs.filter((l) => l.status === 'pending').sort((a, b) => new Date(a.scheduled_time) - new Date(b.scheduled_time))[0];
      const totalDoses = item.frequency_per_day * item.duration_days;
      const takenCount = logs.filter((l) => l.status === 'taken').length;
      return { rx, item, drug, logs, nextPending, status: itemStatus(logs), totalDoses, takenCount };
    });
  });

  const todaysLogs = rows
    .flatMap((r) => r.logs.map((l) => ({ ...l, drugName: r.drug?.name })))
    .filter((l) => new Date(l.scheduled_time).toDateString() === new Date().toDateString())
    .sort((a, b) => new Date(a.scheduled_time) - new Date(b.scheduled_time));

  const nearLimit = rows.filter((r) => r.totalDoses > 0 && r.takenCount / r.totalDoses >= 0.75 && r.takenCount < r.totalDoses);

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Prescriptions</h1>
          <p>Your active courses, dosage schedule, and dose logging.</p>
        </div>
      </div>

      <div className="tabs">
        <span className="tab active">Active</span>
        <Link to="/patient/prescriptions/history" className="tab">History</Link>
      </div>

      <div className="grid-main-side">
        <div className="stack">

          <div className="card">
            {rows.length === 0 ? (
              <div className="empty-state">
                <IconClock />
                <h3>No active prescriptions</h3>
                <p>Anything a doctor prescribes you will show up here.</p>
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>Medication</th><th>Dosage &amp; frequency</th><th>Next dose</th><th>Status</th><th></th></tr>
                  </thead>
                  <tbody>
                    {rows.map(({ item, drug, nextPending, status, rx }) => (
                      <tr key={item.item_id}>
                        <td className="cell-primary">{drug?.name} {item.dosage_amount}{item.dosage_unit === 'tablets' ? '' : item.dosage_unit}</td>
                        <td>{item.dosage_amount} {item.dosage_unit} &middot; {item.frequency_per_day}x daily</td>
                        <td className="cell-mono">{nextPending ? formatDateTime(nextPending.scheduled_time) : '—'}</td>
                        <td><span className={`badge ${status.cls}`}><span className="badge-dot" />{status.label}</span></td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            disabled={!nextPending}
                            onClick={() => nextPending && prescriptionService.markDoseTaken(nextPending.log_id)}
                          >
                            Log dose
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {nearLimit.map(({ item, drug, takenCount, totalDoses }) => (
            <div className="alert-box warn" key={item.item_id}>
              <IconWarning />
              <div>
                <strong>Approaching cumulative dose limit — {drug?.name}</strong>
                You've logged {takenCount} of the {totalDoses} doses in this course. Your prescribing doctor set this limit based on {item.max_daily_dose} {item.dosage_unit} per day.
              </div>
            </div>
          ))}

        </div>

        <div className="stack">
          <div className="card card-pad">
            <div className="card-header">
              <div className="card-title"><IconClock /> Today's schedule</div>
            </div>
            {todaysLogs.length === 0 && <div className="field-hint">No doses scheduled for today.</div>}
            {todaysLogs.map((log) => (
              <div className="list-row" style={{ padding: '12px 14px' }} key={log.log_id}>
                <div>
                  <div className="list-row-title" style={{ fontSize: 13.5 }}>{log.drugName}</div>
                  <div className="list-row-sub">
                    {log.status === 'taken' && log.taken_at ? `Logged at ${formatTime(log.taken_at)}` : `Due ${formatTime(log.scheduled_time)}`}
                  </div>
                </div>
                <span className={`badge ${log.status === 'taken' ? 'badge-teal' : log.status === 'missed' ? 'badge-rose' : 'badge-slate'}`}>
                  {log.status === 'taken' ? 'Taken' : log.status === 'missed' ? 'Missed' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
