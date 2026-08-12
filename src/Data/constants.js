// Enum values mirroring the field-level data dictionary in the project
// documentation (Section 10 — Database Design). Keeping these as named
// constants instead of raw strings means a typo anywhere (a form, a filter,
// a business-logic check) throws instead of silently failing.

export const USER_ROLES = Object.freeze({
  PATIENT: 'patient',
  STAFF: 'staff',
  ADMIN: 'admin',
});

export const PRESCRIPTION_STATUS = Object.freeze({
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
});

export const DOSE_STATUS = Object.freeze({
  PENDING: 'pending',
  TAKEN: 'taken',
  MISSED: 'missed',
  SKIPPED: 'skipped',
});

export const APPOINTMENT_STATUS = Object.freeze({
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  MISSED: 'missed',
});

export const ROOM_TYPES = Object.freeze({
  THEATRE: 'theatre',
  XRAY: 'xray',
  MRI: 'mri',
  CONSULTATION: 'consultation',
  WARD: 'ward',
  ICU: 'icu',
});

export const ROOM_STATUS = Object.freeze({
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  MAINTENANCE: 'maintenance',
});

export const BOOKING_STATUS = Object.freeze({
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
});

export const ADMISSION_STATUS = Object.freeze({
  ADMITTED: 'admitted',
  DISCHARGED: 'discharged',
  TRANSFERRED: 'transferred',
});

export const BUDGET_STATUS = Object.freeze({
  ACTIVE: 'active',
  CLOSED: 'closed',
  EXCEEDED: 'exceeded',
});

export const EXPENSE_CATEGORY = Object.freeze({
  DRUG_PROCUREMENT: 'drug_procurement',
  EQUIPMENT: 'equipment',
  MAINTENANCE: 'maintenance',
  CONSUMABLES: 'consumables',
  OTHER: 'other',
});

export const NOTIFICATION_TYPE = Object.freeze({
  DOSE_DUE: 'dose_due',
  DOSE_MISSED: 'dose_missed',
  LOW_STOCK: 'low_stock',
  EXPIRY: 'expiry',
  APPOINTMENT: 'appointment',
  BOOKING_CONFLICT: 'booking_conflict',
  BUDGET_THRESHOLD: 'budget_threshold',
  BUDGET_EXCEEDED: 'budget_exceeded',
});

export const NOTIFICATION_SEVERITY = Object.freeze({
  INFO: 'info',
  WARNING: 'warning',
  CRITICAL: 'critical',
});

// The 15 tables in the schema (§10.3 Patient Domain + §10.4 Hospital Domain).
// This list drives storage key generation and the repository factory, so it
// is the single place to add a table if the schema grows further.
export const TABLES = Object.freeze([
  'users',
  'patients',
  'prescriptions',
  'prescriptionItems',
  'doseLogs',
  'appointments',
  'hospitals',
  'staff',
  'drugs',
  'rooms',
  'roomBookings',
  'admissions',
  'budgets',
  'expenses',
  'notifications',
]);
