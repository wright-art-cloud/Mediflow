// Single import point: `import { patientService, inventoryService } from '../services/index.js'`
// One service per domain, covering all 15 tables between them:
//   authService        -> users
//   patientService     -> patients (+ composite profile across prescriptions/appointments/admissions)
//   prescriptionService -> prescriptions, prescriptionItems, doseLogs
//   appointmentService -> appointments
//   hospitalService    -> hospitals
//   staffService       -> staff
//   inventoryService   -> drugs
//   roomService        -> rooms, roomBookings
//   admissionService   -> admissions
//   budgetService      -> budgets, expenses
//   notificationService -> notifications

export { authService } from './authService.js';
export { patientService } from './patientService.js';
export { prescriptionService } from './prescriptionService.js';
export { appointmentService } from './appointmentService.js';
export { hospitalService } from './hospitalService.js';
export { staffService } from './staffService.js';
export { inventoryService } from './inventoryService.js';
export { roomService } from './roomService.js';
export { admissionService } from './admissionService.js';
export { budgetService } from './budgetService.js';
export { notificationService } from './notificationService.js';
