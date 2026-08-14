import { useState } from 'react';
import { useMediflowData } from '../../context/DataContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { IconUser, IconEdit, IconInfo, IconLogout } from '../../components/icons.jsx';
import { formatDate } from '../../utils/format.js';

export default function Profile() {
  const { patientService, hospitalService } = useMediflowData();
  const { patient, user, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(() => ({
    first_name: patient.first_name,
    last_name: patient.last_name,
    date_of_birth: patient.date_of_birth,
    gender: patient.gender,
    blood_group: patient.blood_group,
    phone: patient.phone,
    address: patient.address,
    allergies: (patient.allergies || []).join(', '),
    emergency_contact_name: patient.emergency_contact_name,
    emergency_contact_phone: patient.emergency_contact_phone,
  }));

  function field(key) {
    return {
      value: form[key] ?? '',
      readOnly: !editing,
      onChange: (e) => setForm({ ...form, [key]: e.target.value }),
    };
  }

  function save() {
    patientService.updatePatient(patient.patient_id, {
      ...form,
      allergies: form.allergies.split(',').map((a) => a.trim()).filter(Boolean),
    });
    setEditing(false);
  }

  const activePrescriptions = patientService.getPatientProfile(patient.patient_id).activePrescriptions;
  const lastHospitalId = patientService.getPatientProfile(patient.patient_id).prescriptionHistory[0]?.hospital_id;
  const homeHospital = lastHospitalId ? hospitalService.getHospitalById(lastHospitalId) : null;

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Profile</h1>
          <p>Your personal details and emergency contact on file.</p>
        </div>
        <div className="header-actions">
          {editing ? (
            <>
              <button className="btn" onClick={() => setEditing(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={save}>Save changes</button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={() => setEditing(true)}><IconEdit /> Edit details</button>
          )}
        </div>
      </div>

      <div className="grid-main-side">
        <div className="stack">

          <div className="card card-pad">
            <div className="card-title" style={{ marginBottom: 16 }}><IconUser /> Personal information</div>
            <div className="field-row">
              <div className="field"><label>First name</label><input {...field('first_name')} /></div>
              <div className="field"><label>Last name</label><input {...field('last_name')} /></div>
            </div>
            <div className="field-row">
              <div className="field"><label>Date of birth</label><input type="date" {...field('date_of_birth')} /></div>
              <div className="field">
                <label>Gender</label>
                {editing ? (
                  <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                    <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                  </select>
                ) : <input readOnly value={form.gender} />}
              </div>
            </div>
            <div className="field-row">
              <div className="field"><label>Phone number</label><input {...field('phone')} /></div>
              <div className="field"><label>Blood group</label><input {...field('blood_group')} /></div>
            </div>
            <div className="field"><label>Home address</label><input {...field('address')} /></div>
            <div className="field" style={{ marginBottom: 0 }}><label>Known allergies</label><input {...field('allergies')} placeholder="Comma-separated, e.g. penicillin, dust" /></div>
          </div>

          <div className="card card-pad">
            <div className="card-title" style={{ marginBottom: 16 }}>Emergency contact</div>
            <div className="field-row">
              <div className="field"><label>Contact name</label><input {...field('emergency_contact_name')} /></div>
              <div className="field"><label>Phone number</label><input {...field('emergency_contact_phone')} /></div>
            </div>
          </div>

        </div>

        <div className="stack">
          <div className="card card-pad">
            <div className="card-title" style={{ marginBottom: 16 }}>Account</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 13 }}>
              <div>
                <div style={{ color: 'var(--slate-400)', fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 3 }}>Medical record number</div>
                <div className="cell-mono" style={{ fontSize: 13.5, color: 'var(--slate-900)' }}>{patient.patient_id}</div>
              </div>
              <div>
                <div style={{ color: 'var(--slate-400)', fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 3 }}>Login email</div>
                <div style={{ color: 'var(--slate-900)', fontWeight: 600 }}>{user.email}</div>
              </div>
              <div>
                <div style={{ color: 'var(--slate-400)', fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 3 }}>Home hospital</div>
                <div style={{ color: 'var(--slate-900)', fontWeight: 600 }}>{homeHospital?.name ?? 'Not on file yet'}</div>
              </div>
              <div>
                <div style={{ color: 'var(--slate-400)', fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 3 }}>Care plan status</div>
                <span className="badge badge-teal"><span className="badge-dot" />{activePrescriptions.length > 0 ? 'Active' : 'None active'}</span>
              </div>
              <div>
                <div style={{ color: 'var(--slate-400)', fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 3 }}>Patient since</div>
                <div style={{ color: 'var(--slate-900)', fontWeight: 600 }}>{formatDate(patient.registered_at)}</div>
              </div>
            </div>
          </div>

          <div className="alert-box info">
            <IconInfo />
            <div>Changes to your emergency contact details are shared with your home hospital immediately.</div>
          </div>

          <button className="btn btn-block" onClick={logout}>
            <IconLogout /> Sign out
          </button>
        </div>
      </div>
    </>
  );
}
