import { Link } from 'react-router-dom';
import { useMediflowData } from '../../context/DataContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { IconPeople, IconClipboard, IconBed, IconFileText, IconDoor, IconPlus, IconUser, IconLogout } from '../../components/icons.jsx';
import { formatDate, formatTime, fullName, initials } from '../../utils/format.js';

const isToday = (iso) => new Date(iso).toDateString() === new Date().toDateString();

export default function Dashboard() {
  const { db, roomService, admissionService, notificationService, staffService, patientService } = useMediflowData();
  const { staff, user, logout } = useAuth();
  const hospitalId = staff.hospital_id;

  const appointmentsToday = db.appointments.findBy('hospital_id', hospitalId).filter((a) => isToday(a.scheduled_datetime));
  const bookingsToday = db.roomBookings
    .getAll()
    .filter((b) => db.rooms.getById(b.room_id)?.hospital_id === hospitalId && isToday(b.start_datetime));
  const occupancy = admissionService.getCurrentOccupancy(hospitalId);
  const icuOccupancy = occupancy.filter((a) => db.rooms.getById(a.room_id)?.room_type === 'icu');

  const recentPrescriptions = db.prescriptions
    .findBy('hospital_id', hospitalId)
    .sort((a, b) => new Date(b.date_issued) - new Date(a.date_issued))
    .slice(0, 4);

  const theatreRooms = roomService.getAllRooms(hospitalId).filter((r) => r.room_type === 'theatre');
  const icuRooms = roomService.getAllRooms(hospitalId).filter((r) => r.room_type === 'icu');

  const notifications = notificationService.getForUser(user.user_id).filter((n) => !n.is_read).slice(0, 4);

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Welcome back, Dr. {staff.last_name}</h1>
          <p>System overview for {staff.department} &middot; {formatDate(new Date().toISOString())}</p>
        </div>
        <div className="header-actions">
          <button className="btn" onClick={logout}><IconLogout /> Sign out</button>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--teal-100)', color: 'var(--teal-700)' }}><IconPeople /></div>
          <div><div className="stat-label">Appointments today</div><div className="stat-value">{appointmentsToday.length}</div><div className="stat-caption">Across the hospital</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--amber-100)', color: 'var(--amber-600)' }}><IconDoor /></div>
          <div><div className="stat-label">Room bookings today</div><div className="stat-value">{bookingsToday.length}</div><div className="stat-caption">Theatres, wards &amp; consult rooms</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--rose-100)', color: 'var(--rose-600)' }}><IconBed /></div>
          <div><div className="stat-label">ICU occupancy</div><div className="stat-value">{icuOccupancy.length}</div><div className="stat-caption">Currently admitted</div></div>
        </div>
      </div>

      <div className="grid-main-side">
        <div className="stack">

          <div className="card">
            <div className="card-header" style={{ padding: '22px 24px 0' }}>
              <div className="card-title"><IconFileText /> Recent Prescriptions</div>
              <Link to="/hospital/prescriptions" className="card-link">View all</Link>
            </div>
            {recentPrescriptions.length === 0 ? (
              <div className="empty-state"><p>No prescriptions issued yet.</p></div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Patient</th><th>Diagnosis</th><th>Issued</th><th>Status</th></tr></thead>
                  <tbody>
                    {recentPrescriptions.map((rx) => {
                      const patient = db.patients.getById(rx.patient_id);
                      return (
                        <tr key={rx.prescription_id}>
                          <td className="cell-primary">{fullName(patient)}</td>
                          <td>{rx.diagnosis}</td>
                          <td className="cell-mono">{formatDate(rx.date_issued)}</td>
                          <td>
                            <span className={`badge ${rx.status === 'active' ? 'badge-teal' : rx.status === 'cancelled' ? 'badge-rose' : 'badge-slate'}`}>
                              <span className="badge-dot" />{rx.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="card card-pad">
            <div className="card-header">
              <div className="card-title"><IconDoor /> Operating Theatre Status</div>
              <Link to="/hospital/rooms" className="card-link">Full schedule</Link>
            </div>
            {theatreRooms.length === 0 && <div className="field-hint">No theatres registered at this hospital.</div>}
            {theatreRooms.map((room) => {
              const bookingToday = roomService.getBookingsForRoom(room.room_id)
                .filter((b) => b.status !== 'cancelled' && isToday(b.start_datetime))
                .sort((a, b) => new Date(a.start_datetime) - new Date(b.start_datetime))[0];
              return (
                <div className={`list-row ${!bookingToday ? 'highlight' : ''}`} key={room.room_id}>
                  <div>
                    <div className="list-row-title">Theatre {room.room_number}</div>
                    <div className="list-row-sub">{bookingToday ? bookingToday.purpose : 'Available for schedule'}</div>
                  </div>
                  <div className="list-row-meta">
                    <div className="list-row-time">{bookingToday ? `${formatTime(bookingToday.start_datetime)} \u2013 ${formatTime(bookingToday.end_datetime)}` : 'All day open'}</div>
                    <span className={`badge ${bookingToday ? 'badge-rose' : 'badge-teal'}`}>{bookingToday ? 'Booked' : 'Available'}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        <div className="stack">

          <div className="card card-pad">
            <div className="card-header">
              <div className="card-title"><IconBed /> ICU Bed Availability</div>
            </div>
            {icuRooms.length === 0 && <div className="field-hint">No ICU rooms registered at this hospital.</div>}
            {icuRooms.map((room) => {
              const admitted = admissionService.getAllAdmissions(hospitalId).filter((a) => a.room_id === room.room_id && a.status === 'admitted');
              const beds = Array.from({ length: room.capacity }, (_, i) => admitted[i] || null);
              return (
                <div key={room.room_id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                  {beds.map((admission, i) => {
                    const p = admission ? patientService.getPatientById(admission.patient_id) : null;
                    return (
                      <div
                        key={i}
                        style={{
                          padding: '10px 12px', borderRadius: 'var(--radius-md)',
                          background: admission ? 'var(--rose-50)' : 'var(--teal-50)',
                          border: `1px solid ${admission ? 'var(--rose-100)' : 'var(--teal-100)'}`,
                        }}
                      >
                        <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700, color: admission ? 'var(--rose-700)' : 'var(--teal-700)' }}>Bed {i + 1}</div>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--slate-900)', marginTop: 2 }}>{p ? fullName(p) : 'Vacant'}</div>
                        <div style={{ fontSize: 11, color: 'var(--slate-500)' }}>{admission ? admission.reason : 'Clean & ready'}</div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          <div className="card card-pad">
            <div className="card-header"><div className="card-title"><IconClipboard /> Alerts</div></div>
            {notifications.length === 0 && <div className="field-hint">No unread alerts.</div>}
            {notifications.map((n) => (
              <div className="list-row" style={{ padding: '10px 12px' }} key={n.notification_id}>
                <div className="list-row-sub" style={{ fontSize: 12.5, color: 'var(--slate-700)' }}>{n.message}</div>
                <span className={`badge ${n.severity === 'critical' ? 'badge-rose' : n.severity === 'warning' ? 'badge-amber' : 'badge-teal'}`}>{n.severity}</span>
              </div>
            ))}
          </div>

          <div className="card card-pad">
            <div className="card-title" style={{ marginBottom: 14 }}>Quick actions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to="/hospital/rooms/book" className="btn btn-block"><IconPlus /> Book a room</Link>
              <Link to="/hospital/admissions" className="btn btn-block"><IconUser /> Admit a patient</Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
