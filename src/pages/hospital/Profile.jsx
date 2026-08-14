import { useState } from 'react';
import { useMediflowData } from '../../context/DataContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { IconUser, IconEdit, IconInfo, IconLogout } from '../../components/icons.jsx';

export default function Profile() {
  const { staffService, hospitalService } = useMediflowData();
  const { staff, user, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(() => ({
    first_name: staff.first_name,
    last_name: staff.last_name,
    phone: staff.phone,
  }));

  const hospital = hospitalService.getHospitalById(staff.hospital_id);

  function field(key) {
    return {
      value: form[key] ?? '',
      readOnly: !editing,
      onChange: (e) => setForm({ ...form, [key]: e.target.value }),
    };
  }

  function save() {
    staffService.updateStaff(staff.staff_id, form);
    setEditing(false);
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Profile</h1>
          <p>Your staff account details.</p>
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
            <div className="field-row" style={{ marginBottom: 0 }}>
              <div className="field"><label>Phone number</label><input {...field('phone')} /></div>
              <div className="field"><label>Department</label><input readOnly value={staff.department} /></div>
            </div>
          </div>
        </div>

        <div className="stack">
          <div className="card card-pad">
            <div className="card-title" style={{ marginBottom: 16 }}>Account</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 13 }}>
              <div>
                <div style={{ color: 'var(--slate-400)', fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 3 }}>Staff ID</div>
                <div className="cell-mono" style={{ fontSize: 13.5, color: 'var(--slate-900)' }}>{staff.staff_id}</div>
              </div>
              <div>
                <div style={{ color: 'var(--slate-400)', fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 3 }}>Login email</div>
                <div style={{ color: 'var(--slate-900)', fontWeight: 600 }}>{user.email}</div>
              </div>
              <div>
                <div style={{ color: 'var(--slate-400)', fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 3 }}>Role</div>
                <span className="badge badge-teal"><span className="badge-dot" />{staff.role_title}</span>
              </div>
              <div>
                <div style={{ color: 'var(--slate-400)', fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 3 }}>Hospital</div>
                <div style={{ color: 'var(--slate-900)', fontWeight: 600 }}>{hospital?.name}</div>
              </div>
            </div>
          </div>

          <div className="alert-box info">
            <IconInfo />
            <div>Department and hospital assignment are managed by your administrator, not from this screen.</div>
          </div>

          <button className="btn btn-block" onClick={logout}>
            <IconLogout /> Sign out
          </button>
        </div>
      </div>
    </>
  );
}
