import { Link } from 'react-router-dom';
import { useMediflowData } from '../../context/DataContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { IconCalendar, IconMapPin, IconWarning, IconPhone } from '../../components/icons.jsx';
import { formatDateTime, formatRelativeDay, fullName, initials } from '../../utils/format.js';

const SEVERITY_BADGE = { info: 'badge-teal', warning: 'badge-amber', critical: 'badge-rose' };

export default function HealthHub() {
  const { patientService, staffService, hospitalService, notificationService, db } = useMediflowData();
  const { patient, user } = useAuth();

  const profile = patientService.getPatientProfile(patient.patient_id);
  const notifications = notificationService.getForUser(user.user_id).slice(0, 3);

  const upcomingBooking = db.roomBookings
    .findBy('patient_id', patient.patient_id)
    .filter((b) => b.status === 'confirmed' && new Date(b.start_datetime) >= new Date())
    .sort((a, b) => new Date(a.start_datetime) - new Date(b.start_datetime))[0];

  const homeHospitalId = profile.prescriptionHistory[0]?.hospital_id;
  const homeHospital = homeHospitalId ? hospitalService.getHospitalById(homeHospitalId) : null;

  return (
    <>
      <div className="hero-banner">
        <div>
          <h1>Hello, {patient.first_name} {patient.last_name}</h1>
          <p>
            {profile.doseAdherence.pending > 0
              ? `You have ${profile.doseAdherence.pending} dose${profile.doseAdherence.pending === 1 ? '' : 's'} coming up today.`
              : 'All caught up on your scheduled doses for today.'}
          </p>
        </div>
        <span className="hero-pill">{profile.activePrescriptions.length > 0 ? 'Care Plan Active' : 'No Active Prescriptions'}</span>
      </div>

      <div className="grid-main-side">
        <div className="stack">

          <div>
            <div className="card-title" style={{ marginBottom: 14 }}>
              <IconCalendar /> Scheduled Medical Visits
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))', gap: 16 }}>
              {profile.upcomingAppointments.length === 0 && (
                <div className="card card-pad empty-state" style={{ gridColumn: '1/-1' }}>
                  <IconCalendar />
                  <h3>No upcoming visits</h3>
                  <p>Book an appointment from the Appointments tab when you're ready.</p>
                </div>
              )}
              {profile.upcomingAppointments.slice(0, 2).map((appt) => {
                const staff = staffService.getStaffById(appt.staff_id);
                return (
                  <div className="card card-pad" key={appt.appointment_id}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}>
                      <div className="user-avatar" style={{ width: 38, height: 38, fontSize: 13 }}>{initials(staff)}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--slate-900)' }}>Dr. {fullName(staff)}</div>
                        <div style={{ fontSize: 12.5, color: 'var(--teal-700)', fontWeight: 600 }}>{staff?.department}</div>
                      </div>
                    </div>
                    <div className="field-hint" style={{ marginBottom: 4 }}>{formatDateTime(appt.scheduled_datetime)}</div>
                    <div className="field-hint">{appt.purpose}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card card-pad">
            <div className="card-header">
              <div className="card-title">Recent Care Activity</div>
            </div>
            {notifications.length === 0 && <div className="field-hint">Nothing new to show yet.</div>}
            {notifications.map((n) => (
              <div className="list-row" key={n.notification_id}>
                <div>
                  <div className="list-row-title">{n.message}</div>
                </div>
                <div className="list-row-meta">
                  <div className="list-row-time">{formatRelativeDay(n.created_at)}</div>
                  <span className={`badge ${SEVERITY_BADGE[n.severity] || 'badge-slate'}`}>{n.severity}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

        <div className="stack">
          {upcomingBooking && (
            <div className="card card-pad">
              <div className="card-title" style={{ marginBottom: 12 }}><IconWarning /> Upcoming Procedure</div>
              <div className="alert-box warn" style={{ marginBottom: 12 }}>
                <div>
                  <strong>{upcomingBooking.purpose}</strong>
                  {formatDateTime(upcomingBooking.start_datetime)}
                </div>
              </div>
              <span className="badge badge-teal">Confirmed</span>
            </div>
          )}

          <div className="card card-pad">
            <div className="card-title" style={{ marginBottom: 14 }}><IconPhone /> Need Assistance?</div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '.04em' }}>Home hospital</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--slate-900)', marginBottom: 14 }}>{homeHospital?.name ?? 'Not on file yet'}</div>
            {homeHospital && (
              <>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '.04em' }}>Phone</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--teal-700)', marginBottom: 14 }}>{homeHospital.phone}</div>
                <div className="field-hint" style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                  <IconMapPin style={{ width: 14, height: 14, flexShrink: 0, marginTop: 2 }} />
                  {homeHospital.address}
                </div>
              </>
            )}
          </div>

          <Link to="/patient/prescriptions" className="btn btn-block">View my prescriptions</Link>
        </div>
      </div>
    </>
  );
}
