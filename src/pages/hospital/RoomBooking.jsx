import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMediflowData } from '../../context/DataContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { IconWarning } from '../../components/icons.jsx';
import { fullName } from '../../utils/format.js';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function RoomBooking() {
  const { roomService, patientService } = useMediflowData();
  const { staff } = useAuth();
  const navigate = useNavigate();

  const rooms = roomService.getAllRooms(staff.hospital_id);
  const patients = patientService.getAllPatients();

  const [form, setForm] = useState({
    roomId: rooms[0]?.room_id || '',
    purpose: '',
    patientId: '',
    date: todayStr(),
    startTime: '09:00',
    endTime: '10:00',
  });
  const [submitError, setSubmitError] = useState(null);

  const startISO = `${form.date}T${form.startTime}:00`;
  const endISO = `${form.date}T${form.endTime}:00`;
  const hasConflict = form.roomId && form.startTime < form.endTime
    ? roomService.hasBookingConflict(form.roomId, startISO, endISO)
    : false;

  function set(key, value) {
    setSubmitError(null);
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    try {
      roomService.createBooking({
        roomId: form.roomId,
        patientId: form.patientId || null,
        staffId: staff.staff_id,
        startDatetime: startISO,
        endDatetime: endISO,
        purpose: form.purpose || 'Booking',
      });
      navigate('/hospital/rooms');
    } catch (err) {
      setSubmitError(err.message);
    }
  }

  return (
    <div style={{ maxWidth: 820 }}>
      <div className="breadcrumb"><Link to="/hospital/rooms">Rooms</Link> / Book a room</div>
      <div className="page-header">
        <div>
          <h1>Book a room</h1>
          <p>Reserve a theatre, ward, or consultation room for a specific date and time.</p>
        </div>
      </div>

      <form className="card card-pad" onSubmit={handleSubmit}>
        {submitError && <div className="form-error">{submitError}</div>}

        <div className="field-row">
          <div className="field">
            <label>Room</label>
            <select value={form.roomId} onChange={(e) => set('roomId', e.target.value)} required>
              {rooms.map((r) => <option key={r.room_id} value={r.room_id}>{r.room_type} — Room {r.room_number}</option>)}
            </select>
          </div>
          <div className="field"><label>Purpose</label><input value={form.purpose} onChange={(e) => set('purpose', e.target.value)} placeholder="e.g. Consultation" required /></div>
        </div>

        <div className="field-row-3">
          <div className="field"><label>Date</label><input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} required /></div>
          <div className="field"><label>Start time</label><input type="time" value={form.startTime} onChange={(e) => set('startTime', e.target.value)} required /></div>
          <div className="field"><label>End time</label><input type="time" value={form.endTime} onChange={(e) => set('endTime', e.target.value)} required /></div>
        </div>

        <div className="field" style={{ marginBottom: 6 }}>
          <label>Patient (optional)</label>
          <select value={form.patientId} onChange={(e) => set('patientId', e.target.value)}>
            <option value="">No patient linked</option>
            {patients.map((p) => <option key={p.patient_id} value={p.patient_id}>{fullName(p)} — {p.patient_id}</option>)}
          </select>
        </div>

        {hasConflict && (
          <div className="alert-box danger" style={{ marginBottom: 6 }}>
            <IconWarning />
            <div>
              <strong>Booking conflict detected</strong>
              This room already has a confirmed booking that overlaps this time window. Choose a different time or room.
            </div>
          </div>
        )}

        <div className="form-actions">
          <Link to="/hospital/rooms" className="btn">Cancel</Link>
          <button type="submit" className="btn btn-primary" disabled={hasConflict}>Confirm booking</button>
        </div>
      </form>
    </div>
  );
}
