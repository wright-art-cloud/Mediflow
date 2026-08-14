import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMediflowData } from '../../context/DataContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { IconDoor, IconPlus } from '../../components/icons.jsx';
import { formatTime } from '../../utils/format.js';

const TYPE_LABEL = {
  theatre: 'Operating theatres', icu: 'ICU rooms', ward: 'Wards',
  consultation: 'Consultation rooms', xray: 'X-ray rooms', mri: 'MRI rooms',
};

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function Rooms() {
  const { roomService } = useMediflowData();
  const { staff } = useAuth();
  const [date, setDate] = useState(todayStr());
  const [type, setType] = useState('all');

  const rooms = roomService.getAllRooms(staff.hospital_id);
  const types = [...new Set(rooms.map((r) => r.room_type))];
  const filteredRooms = type === 'all' ? rooms : rooms.filter((r) => r.room_type === type);

  const grouped = types
    .filter((t) => type === 'all' || t === type)
    .map((t) => ({ type: t, rooms: filteredRooms.filter((r) => r.room_type === t) }))
    .filter((g) => g.rooms.length > 0);

  function bookingForDate(room) {
    if (room.status === 'maintenance') return 'maintenance';
    const bookings = roomService.getBookingsForRoom(room.room_id).filter((b) => b.status !== 'cancelled');
    return bookings.find((b) => {
      const start = b.start_datetime.slice(0, 10);
      const end = b.end_datetime.slice(0, 10);
      return date >= start && date <= end;
    }) || null;
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Rooms</h1>
          <p>Availability by date and room type.</p>
        </div>
        <div className="header-actions">
          <Link to="/hospital/rooms/book" className="btn btn-primary"><IconPlus /> Book a room</Link>
        </div>
      </div>

      <div className="card card-pad" style={{ marginBottom: 20 }}>
        <div className="search-bar" style={{ marginBottom: 0 }}>
          <div className="field" style={{ flex: 1, minWidth: 170, marginBottom: 0 }}>
            <label>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="field" style={{ flex: 1, minWidth: 170, marginBottom: 0 }}>
            <label>Room type</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="all">All types</option>
              {types.map((t) => <option key={t} value={t}>{TYPE_LABEL[t] || t}</option>)}
            </select>
          </div>
        </div>
      </div>

      {grouped.map((group) => (
        <div className="card card-pad" style={{ marginBottom: 16 }} key={group.type}>
          <div className="card-header">
            <div className="card-title"><IconDoor /> {TYPE_LABEL[group.type] || group.type}</div>
          </div>
          {group.rooms.map((room) => {
            const booking = bookingForDate(room);
            const isMaint = booking === 'maintenance';
            const isBooked = booking && booking !== 'maintenance';
            return (
              <div className={`list-row ${!booking ? 'highlight' : ''}`} key={room.room_id}>
                <div>
                  <div className="list-row-title">Room {room.room_number}</div>
                  <div className="list-row-sub">
                    {isMaint ? 'Under maintenance' : isBooked ? booking.purpose : `Capacity ${room.capacity} · Clean & ready`}
                  </div>
                </div>
                <div className="list-row-meta">
                  <div className="list-row-time">
                    {isBooked ? `${formatTime(booking.start_datetime)} \u2013 ${formatTime(booking.end_datetime)}` : isMaint ? '—' : 'All day open'}
                  </div>
                  <span className={`badge ${isMaint ? 'badge-slate' : isBooked ? 'badge-rose' : 'badge-teal'}`}>
                    {isMaint ? 'Maintenance' : isBooked ? 'Booked' : 'Available'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
}
