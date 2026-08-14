import { useState } from 'react';
import { useMediflowData } from '../../context/DataContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { IconBed, IconUser, IconPlus, IconClipboard } from '../../components/icons.jsx';
import { formatDate, fullName } from '../../utils/format.js';

const isToday = (iso) => new Date(iso).toDateString() === new Date().toDateString();

export default function Admissions() {
  const { admissionService, roomService, patientService, staffService } = useMediflowData();
  const { staff } = useAuth();
  const [tab, setTab] = useState('current');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ patientId: '', roomId: '', reason: '', notes: '' });

  const all = admissionService.getAllAdmissions(staff.hospital_id);
  const current = all.filter((a) => a.status === 'admitted');
  const history = all.filter((a) => a.status !== 'admitted').sort((a, b) => new Date(b.admission_datetime) - new Date(a.admission_datetime));
  const admittedToday = all.filter((a) => isToday(a.admission_datetime));

  const bedRooms = roomService.getAllRooms(staff.hospital_id).filter((r) => ['ward', 'icu'].includes(r.room_type));
  const totalBeds = bedRooms.reduce((sum, r) => sum + r.capacity, 0);
  const availableRooms = roomService.getAllRooms(staff.hospital_id).filter((r) => r.status !== 'maintenance');
  const patients = patientService.getAllPatients();

  function submitAdmission(e) {
    e.preventDefault();
    if (!form.patientId || !form.reason) return;
    admissionService.admitPatient({
      patientId: form.patientId,
      hospitalId: staff.hospital_id,
      roomId: form.roomId || null,
      admittingStaffId: staff.staff_id,
      reason: form.reason,
      notes: form.notes,
    });
    setForm({ patientId: '', roomId: '', reason: '', notes: '' });
    setShowForm(false);
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Admissions</h1>
          <p>Current occupancy and admission history.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => setShowForm((s) => !s)}><IconPlus /> Admit patient</button>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--teal-100)', color: 'var(--teal-700)' }}><IconBed /></div>
          <div><div className="stat-label">Total beds</div><div className="stat-value">{totalBeds}</div><div className="stat-caption">Across wards + ICU</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--rose-100)', color: 'var(--rose-600)' }}><IconUser /></div>
          <div><div className="stat-label">Currently admitted</div><div className="stat-value">{current.length}</div><div className="stat-caption">{totalBeds > 0 ? Math.round((current.length / totalBeds) * 100) : 0}% occupancy</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--amber-100)', color: 'var(--amber-600)' }}><IconClipboard /></div>
          <div><div className="stat-label">Admitted today</div><div className="stat-value">{admittedToday.length}</div><div className="stat-caption">New this calendar day</div></div>
        </div>
      </div>

      {showForm && (
        <form className="card card-pad" style={{ marginBottom: 20 }} onSubmit={submitAdmission}>
          <div className="field-row">
            <div className="field">
              <label>Patient</label>
              <select value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })} required>
                <option value="">Select a patient…</option>
                {patients.map((p) => <option key={p.patient_id} value={p.patient_id}>{fullName(p)} — {p.patient_id}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Room</label>
              <select value={form.roomId} onChange={(e) => setForm({ ...form, roomId: e.target.value })}>
                <option value="">No room assigned yet</option>
                {availableRooms.map((r) => <option key={r.room_id} value={r.room_id}>{r.room_type} — Room {r.room_number}</option>)}
              </select>
            </div>
          </div>
          <div className="field"><label>Reason for admission</label><input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} required /></div>
          <div className="field" style={{ marginBottom: 6 }}><label>Notes</label><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={{ minHeight: 60 }} /></div>
          <div className="form-actions">
            <button type="button" className="btn" onClick={() => setShowForm(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Admit patient</button>
          </div>
        </form>
      )}

      <div className="tabs">
        <button className={`tab ${tab === 'current' ? 'active' : ''}`} onClick={() => setTab('current')}>Current occupancy</button>
        <button className={`tab ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>Admission history</button>
      </div>

      <div className="card">
        {tab === 'current' ? (
          current.length === 0 ? (
            <div className="empty-state"><h3>No patients currently admitted</h3></div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Patient</th><th>Room</th><th>Admitted</th><th>Attending</th><th>Reason</th><th></th></tr></thead>
                <tbody>
                  {current.map((a) => {
                    const patient = patientService.getPatientById(a.patient_id);
                    const room = a.room_id ? roomService.getRoomById(a.room_id) : null;
                    const attending = staffService.getStaffById(a.admitting_staff_id);
                    return (
                      <tr key={a.admission_id}>
                        <td><div className="person-cell"><div className="mini-avatar">{fullName(patient).split(' ').map((n) => n[0]).join('')}</div><div className="cell-primary">{fullName(patient)}</div></div></td>
                        <td>{room ? `${room.room_type}, Room ${room.room_number}` : 'Unassigned'}</td>
                        <td className="cell-mono">{formatDate(a.admission_datetime)}</td>
                        <td>Dr. {fullName(attending)}</td>
                        <td>{a.reason}</td>
                        <td><button className="btn btn-sm" onClick={() => admissionService.dischargePatient(a.admission_id)}>Discharge</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        ) : (
          history.length === 0 ? (
            <div className="empty-state"><h3>No past admissions</h3></div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Patient</th><th>Admitted</th><th>Discharged</th><th>Reason</th><th>Status</th></tr></thead>
                <tbody>
                  {history.map((a) => {
                    const patient = patientService.getPatientById(a.patient_id);
                    return (
                      <tr key={a.admission_id}>
                        <td className="cell-primary">{fullName(patient)}</td>
                        <td className="cell-mono">{formatDate(a.admission_datetime)}</td>
                        <td className="cell-mono">{a.discharge_datetime ? formatDate(a.discharge_datetime) : '—'}</td>
                        <td>{a.reason}</td>
                        <td><span className="badge badge-slate">{a.status}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </>
  );
}
