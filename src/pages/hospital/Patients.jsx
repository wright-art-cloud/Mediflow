import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMediflowData } from '../../context/DataContext.jsx';
import { IconSearch, IconPill, IconClipboard } from '../../components/icons.jsx';
import { formatDate, fullName, initials } from '../../utils/format.js';

export default function Patients() {
  const { patientService, staffService, inventoryService, admissionService } = useMediflowData();
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  const patients = patientService.getAllPatients();
  const filtered = patients.filter((p) => `${fullName(p)} ${p.patient_id}`.toLowerCase().includes(q.toLowerCase()));

  const selectedId = patientId || filtered[0]?.patient_id;
  const profile = selectedId ? patientService.getPatientProfile(selectedId) : null;
  const currentAdmission = selectedId ? admissionService.getAllAdmissions().find((a) => a.patient_id === selectedId && a.status === 'admitted') : null;
  const assignedStaff = profile?.prescriptionHistory[0]?.staff_id ? staffService.getStaffById(profile.prescriptionHistory[0].staff_id) : null;

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Patients</h1>
          <p>Patient records and care history.</p>
        </div>
      </div>

      <div className="patients-shell">
        <div className="patient-list card card-pad">
          <div className="search-input-wrap" style={{ marginBottom: 14 }}>
            <IconSearch />
            <input placeholder="Search patients…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          {filtered.map((p) => (
            <button
              key={p.patient_id}
              className={`patient-row ${p.patient_id === selectedId ? 'selected' : ''}`}
              onClick={() => navigate(`/hospital/patients/${p.patient_id}`)}
            >
              <div className="mini-avatar">{initials(p)}</div>
              <div>
                <div className="name">{fullName(p)}</div>
                <div className="sub">{p.patient_id} &middot; {p.gender}, {new Date().getFullYear() - new Date(p.date_of_birth).getFullYear()}y</div>
              </div>
            </button>
          ))}
        </div>

        {profile && (
          <div className="detail-pane stack">
            <div className="card card-pad">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div className="user-avatar" style={{ width: 48, height: 48, fontSize: 16 }}>{initials(profile.patient)}</div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--slate-900)' }}>{fullName(profile.patient)}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--slate-500)' }}>{profile.patient.patient_id} &middot; {profile.patient.gender} &middot; {profile.patient.blood_group}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span className={`badge ${currentAdmission ? 'badge-rose' : 'badge-teal'}`}><span className="badge-dot" />{currentAdmission ? 'Admitted' : 'Outpatient'}</span>
                  {!currentAdmission && <Link to="/hospital/admissions" className="btn btn-sm">Admit patient</Link>}
                </div>
              </div>

              <div className="field-row">
                <div><div className="stat-label" style={{ marginBottom: 4 }}>Phone</div><div style={{ fontSize: 13.5, color: 'var(--slate-900)', fontWeight: 600 }}>{profile.patient.phone}</div></div>
                <div><div className="stat-label" style={{ marginBottom: 4 }}>Assigned doctor</div><div style={{ fontSize: 13.5, color: 'var(--slate-900)', fontWeight: 600 }}>{assignedStaff ? `Dr. ${fullName(assignedStaff)}` : '—'}</div></div>
              </div>
              <div className="field-row" style={{ marginBottom: 0 }}>
                <div><div className="stat-label" style={{ marginBottom: 4 }}>Known allergies</div><div style={{ fontSize: 13.5, color: 'var(--slate-900)', fontWeight: 600 }}>{(profile.patient.allergies || []).join(', ') || 'None recorded'}</div></div>
                <div><div className="stat-label" style={{ marginBottom: 4 }}>Emergency contact</div><div style={{ fontSize: 13.5, color: 'var(--slate-900)', fontWeight: 600 }}>{profile.patient.emergency_contact_name} &middot; {profile.patient.emergency_contact_phone}</div></div>
              </div>
            </div>

            <div className="card card-pad">
              <div className="card-header">
                <div className="card-title"><IconPill /> Active prescriptions</div>
                <Link to="/hospital/prescriptions" className="card-link">Issue new</Link>
              </div>
              {profile.activePrescriptions.length === 0 ? (
                <div className="field-hint">No active prescriptions.</div>
              ) : (
                <table>
                  <thead><tr><th>Diagnosis</th><th>Issued</th><th>Status</th></tr></thead>
                  <tbody>
                    {profile.activePrescriptions.map((rx) => (
                      <tr key={rx.prescription_id}>
                        <td className="cell-primary">{rx.diagnosis}</td>
                        <td className="cell-mono">{formatDate(rx.date_issued)}</td>
                        <td><span className="badge badge-teal"><span className="badge-dot" />Active</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="card card-pad">
              <div className="card-header"><div className="card-title"><IconClipboard /> Admission history</div></div>
              {profile.admissionHistory.length === 0 ? (
                <div className="field-hint">No admission records.</div>
              ) : (
                <table>
                  <thead><tr><th>Admitted</th><th>Discharged</th><th>Reason</th><th>Status</th></tr></thead>
                  <tbody>
                    {profile.admissionHistory.map((a) => (
                      <tr key={a.admission_id}>
                        <td className="cell-mono">{formatDate(a.admission_datetime)}</td>
                        <td className="cell-mono">{a.discharge_datetime ? formatDate(a.discharge_datetime) : '—'}</td>
                        <td>{a.reason}</td>
                        <td><span className={`badge ${a.status === 'admitted' ? 'badge-rose' : 'badge-slate'}`}>{a.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
