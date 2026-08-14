import { useState } from 'react';
import { useMediflowData } from '../../context/DataContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { IconCalendar, IconMapPin, IconPlus } from '../../components/icons.jsx';
import { formatDateTime, formatDate, fullName, initials } from '../../utils/format.js';

const STATUS_BADGE = {
  scheduled: { label: 'Scheduled', cls: 'badge-teal' },
  completed: { label: 'Completed', cls: 'badge-teal' },
  cancelled: { label: 'Cancelled', cls: 'badge-slate' },
  missed: { label: 'No-show', cls: 'badge-rose' },
};

export default function Appointments() {
  const { appointmentService, staffService, hospitalService } = useMediflowData();
  const { patient } = useAuth();
  const [tab, setTab] = useState('upcoming');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ staffId: '', date: '', time: '', purpose: '' });

  const all = appointmentService.getAppointmentsForPatient(patient.patient_id);
  const now = new Date();
  const upcoming = all.filter((a) => a.status === 'scheduled' && new Date(a.scheduled_datetime) >= now)
    .sort((a, b) => new Date(a.scheduled_datetime) - new Date(b.scheduled_datetime));
  const past = all.filter((a) => a.status !== 'scheduled' || new Date(a.scheduled_datetime) < now)
    .sort((a, b) => new Date(b.scheduled_datetime) - new Date(a.scheduled_datetime));

  const doctors = staffService.getAllStaff().filter((s) => s.role_title === 'doctor');

  function submitRequest(e) {
    e.preventDefault();
    const staff = staffService.getStaffById(form.staffId);
    if (!staff || !form.date || !form.time) return;
    appointmentService.scheduleAppointment({
      patient_id: patient.patient_id,
      hospital_id: staff.hospital_id,
      staff_id: staff.staff_id,
      room_id: null,
      scheduled_datetime: `${form.date}T${form.time}:00`,
      duration_minutes: 30,
      department: staff.department,
      purpose: form.purpose || 'General consultation',
    });
    setForm({ staffId: '', date: '', time: '', purpose: '' });
    setShowForm(false);
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Appointments</h1>
          <p>Upcoming and past visits across all your care providers.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => setShowForm((s) => !s)}>
            <IconPlus /> Request appointment
          </button>
        </div>
      </div>

      {showForm && (
        <form className="card card-pad" style={{ marginBottom: 20 }} onSubmit={submitRequest}>
          <div className="field-row">
            <div className="field">
              <label>Doctor</label>
              <select value={form.staffId} onChange={(e) => setForm({ ...form, staffId: e.target.value })} required>
                <option value="">Select a doctor…</option>
                {doctors.map((d) => (
                  <option key={d.staff_id} value={d.staff_id}>Dr. {fullName(d)} — {d.department}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Purpose</label>
              <input value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} placeholder="e.g. Follow-up review" />
            </div>
          </div>
          <div className="field-row">
            <div className="field"><label>Date</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></div>
            <div className="field"><label>Time</label><input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required /></div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn" onClick={() => setShowForm(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Request appointment</button>
          </div>
        </form>
      )}

      <div className="tabs">
        <button className={`tab ${tab === 'upcoming' ? 'active' : ''}`} onClick={() => setTab('upcoming')}>Upcoming</button>
        <button className={`tab ${tab === 'past' ? 'active' : ''}`} onClick={() => setTab('past')}>Past</button>
      </div>

      {tab === 'upcoming' ? (
        upcoming.length === 0 ? (
          <div className="card empty-state"><IconCalendar /><h3>No upcoming appointments</h3><p>Request one above when you're ready.</p></div>
        ) : (
          <div className="appt-grid">
            {upcoming.map((appt) => {
              const staff = staffService.getStaffById(appt.staff_id);
              const hospital = hospitalService.getHospitalById(appt.hospital_id);
              return (
                <div className="appt-card" key={appt.appointment_id}>
                  <div className="appt-top">
                    <div className="mini-avatar" style={{ width: 38, height: 38, fontSize: 13 }}>{initials(staff)}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--slate-900)' }}>Dr. {fullName(staff)}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--teal-700)', fontWeight: 600 }}>{staff?.department}</div>
                    </div>
                  </div>
                  <div className="appt-meta-row"><IconCalendar />{formatDateTime(appt.scheduled_datetime)}</div>
                  <div className="appt-meta-row" style={{ marginBottom: 16 }}><IconMapPin />{hospital?.name}</div>
                  <button className="btn btn-sm btn-block" onClick={() => appointmentService.cancelAppointment(appt.appointment_id)}>Cancel appointment</button>
                </div>
              );
            })}
          </div>
        )
      ) : (
        <div className="card">
          {past.length === 0 ? (
            <div className="empty-state"><h3>No past appointments</h3></div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Date</th><th>Doctor</th><th>Department</th><th>Reason</th><th>Outcome</th></tr></thead>
                <tbody>
                  {past.map((appt) => {
                    const staff = staffService.getStaffById(appt.staff_id);
                    const status = STATUS_BADGE[appt.status] || { label: appt.status, cls: 'badge-slate' };
                    return (
                      <tr key={appt.appointment_id}>
                        <td className="cell-mono">{formatDate(appt.scheduled_datetime)}</td>
                        <td className="cell-primary">Dr. {fullName(staff)}</td>
                        <td>{appt.department}</td>
                        <td>{appt.purpose}</td>
                        <td><span className={`badge ${status.cls}`}><span className="badge-dot" />{status.label}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </>
  );
}
