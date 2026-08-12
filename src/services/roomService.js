import { db } from '../data/repositories.js';
import { hasBookingConflict } from '../data/businessLogic.js';

export const roomService = {
  getAllRooms(hospitalId = null) {
    return hospitalId ? db.rooms.findBy('hospital_id', hospitalId) : db.rooms.getAll();
  },

  getRoomById(roomId) {
    return db.rooms.getById(roomId);
  },

  getAvailableRooms(hospitalId = null, roomType = null) {
    let rooms = this.getAllRooms(hospitalId);
    if (roomType) rooms = rooms.filter((room) => room.room_type === roomType);
    return rooms.filter((room) => room.status === 'available');
  },

  setRoomStatus(roomId, status) {
    return db.rooms.update(roomId, { status });
  },

  hasBookingConflict,

  /** §6.2.2 Room Scheduling: throws if the requested window overlaps an existing booking for that room (Integrity Rule 3), so a form can reject it before it's saved. */
  createBooking({ roomId, patientId = null, staffId, startDatetime, endDatetime, purpose }) {
    if (hasBookingConflict(roomId, startDatetime, endDatetime)) {
      throw new Error(`Room ${roomId} is already booked for part of that time window`);
    }
    return db.roomBookings.create({
      room_id: roomId,
      patient_id: patientId,
      staff_id: staffId,
      start_datetime: startDatetime,
      end_datetime: endDatetime,
      purpose,
      status: 'confirmed',
    });
  },

  cancelBooking(bookingId) {
    return db.roomBookings.update(bookingId, { status: 'cancelled' });
  },

  getBookingsForRoom(roomId) {
    return db.roomBookings.findBy('room_id', roomId);
  },
};
