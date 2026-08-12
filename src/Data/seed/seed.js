// Realistic seed data for Mediflow, structured to match the field-level
// data dictionary in Section 10 of the project documentation exactly —
// same table names, same field names, same enum values.
//
// Rows are deliberately chosen (not random) so the app demonstrates its own
// decision rules the moment it loads:
//   - Amoxicillin, Coartem, Salbutamol and Ceftriaxone sit below their
//     reorder_threshold -> low-stock alerts fire immediately.
//   - Azithromycin and Insulin sit close to expiry_date -> expiry warnings fire.
//   - A few dose_logs are `missed` / `skipped` -> dose-adherence logic has
//     something to show.
//   - The Surgery budget (BUD-002) sits at 90% of its allocation and the
//     ICU equipment budget (BUD-007) is over -> budget threshold/exceeded
//     logic has real data to evaluate.
//
// "Today" for the purposes of these dates is 2026-08-12.

// ---------------------------------------------------------------------------
// PATIENT DOMAIN (§10.3)
// ---------------------------------------------------------------------------

export const users = [
  // --- patient accounts ---
  { user_id: 'USR-P001', email: 'esther.wanjiku@mediflow.dev', password: 'hashed_placeholder_pw', role: 'patient', is_active: true, created_at: '2025-11-02T09:00:00' },
  { user_id: 'USR-P002', email: 'michael.kariuki@mediflow.dev', password: 'hashed_placeholder_pw', role: 'patient', is_active: true, created_at: '2025-11-10T09:00:00' },
  { user_id: 'USR-P003', email: 'lucy.nyambura@mediflow.dev', password: 'hashed_placeholder_pw', role: 'patient', is_active: true, created_at: '2025-12-01T09:00:00' },
  { user_id: 'USR-P004', email: 'samuel.mutiso@mediflow.dev', password: 'hashed_placeholder_pw', role: 'patient', is_active: true, created_at: '2026-01-15T09:00:00' },
  { user_id: 'USR-P005', email: 'ann.chepkoech@mediflow.dev', password: 'hashed_placeholder_pw', role: 'patient', is_active: true, created_at: '2026-02-02T09:00:00' },
  { user_id: 'USR-P006', email: 'david.wekesa@mediflow.dev', password: 'hashed_placeholder_pw', role: 'patient', is_active: true, created_at: '2026-02-20T09:00:00' },
  { user_id: 'USR-P007', email: 'faith.adhiambo@mediflow.dev', password: 'hashed_placeholder_pw', role: 'patient', is_active: true, created_at: '2026-03-05T09:00:00' },
  { user_id: 'USR-P008', email: 'guardian.njoroge@mediflow.dev', password: 'hashed_placeholder_pw', role: 'patient', is_active: true, created_at: '2026-03-18T09:00:00' },
  { user_id: 'USR-P009', email: 'mary.akinyi@mediflow.dev', password: 'hashed_placeholder_pw', role: 'patient', is_active: true, created_at: '2026-04-01T09:00:00' },
  { user_id: 'USR-P010', email: 'kevin.barasa@mediflow.dev', password: 'hashed_placeholder_pw', role: 'patient', is_active: true, created_at: '2026-04-22T09:00:00' },
  { user_id: 'USR-P011', email: 'sarah.muthoni@mediflow.dev', password: 'hashed_placeholder_pw', role: 'patient', is_active: true, created_at: '2026-05-10T09:00:00' },
  { user_id: 'USR-P012', email: 'brian.kiplangat@mediflow.dev', password: 'hashed_placeholder_pw', role: 'patient', is_active: true, created_at: '2026-05-29T09:00:00' },
  // --- staff accounts ---
  { user_id: 'USR-S001', email: 'j.mwangi@mediflow.dev', password: 'hashed_placeholder_pw', role: 'staff', is_active: true, created_at: '2025-01-10T09:00:00' },
  { user_id: 'USR-S002', email: 'g.wanjiru@mediflow.dev', password: 'hashed_placeholder_pw', role: 'staff', is_active: true, created_at: '2025-01-10T09:00:00' },
  { user_id: 'USR-S003', email: 'p.kamau@mediflow.dev', password: 'hashed_placeholder_pw', role: 'staff', is_active: true, created_at: '2025-02-14T09:00:00' },
  { user_id: 'USR-S004', email: 'a.njeri@mediflow.dev', password: 'hashed_placeholder_pw', role: 'staff', is_active: true, created_at: '2025-02-14T09:00:00' },
  { user_id: 'USR-S005', email: 's.achieng@mediflow.dev', password: 'hashed_placeholder_pw', role: 'staff', is_active: true, created_at: '2025-03-01T09:00:00' },
  { user_id: 'USR-S006', email: 'd.otieno@mediflow.dev', password: 'hashed_placeholder_pw', role: 'staff', is_active: true, created_at: '2025-03-01T09:00:00' },
  { user_id: 'USR-S007', email: 'm.wambui@mediflow.dev', password: 'hashed_placeholder_pw', role: 'staff', is_active: true, created_at: '2025-03-15T09:00:00' },
  { user_id: 'USR-S008', email: 'j.kiptoo@mediflow.dev', password: 'hashed_placeholder_pw', role: 'staff', is_active: true, created_at: '2025-04-01T09:00:00' },
  { user_id: 'USR-S009', email: 'f.chebet@mediflow.dev', password: 'hashed_placeholder_pw', role: 'staff', is_active: true, created_at: '2025-04-01T09:00:00' },
  { user_id: 'USR-S010', email: 'b.omondi@mediflow.dev', password: 'hashed_placeholder_pw', role: 'staff', is_active: true, created_at: '2025-04-15T09:00:00' },
  // --- admin account ---
  { user_id: 'USR-ADM01', email: 'admin@mediflow.dev', password: 'hashed_placeholder_pw', role: 'admin', is_active: true, created_at: '2025-01-01T09:00:00' },
];

export const patients = [
  { patient_id: 'PAT-001', user_id: 'USR-P001', first_name: 'Esther', last_name: 'Wanjiku', date_of_birth: '1990-05-14', gender: 'female', phone: '0712345001', address: 'Kenol, Murang\'a', blood_group: 'O+', allergies: ['penicillin'], emergency_contact_name: 'Peter Wanjiku', emergency_contact_phone: '0712345101', registered_at: '2025-11-02T09:00:00' },
  { patient_id: 'PAT-002', user_id: 'USR-P002', first_name: 'Michael', last_name: 'Kariuki', date_of_birth: '1985-11-02', gender: 'male', phone: '0712345002', address: 'Sagana, Kirinyaga', blood_group: 'A+', allergies: [], emergency_contact_name: 'Jane Kariuki', emergency_contact_phone: '0712345102', registered_at: '2025-11-10T09:00:00' },
  { patient_id: 'PAT-003', user_id: 'USR-P003', first_name: 'Lucy', last_name: 'Nyambura', date_of_birth: '2001-02-20', gender: 'female', phone: '0712345003', address: 'Murang\'a Town', blood_group: 'B+', allergies: [], emergency_contact_name: 'Grace Nyambura', emergency_contact_phone: '0712345103', registered_at: '2025-12-01T09:00:00' },
  { patient_id: 'PAT-004', user_id: 'USR-P004', first_name: 'Samuel', last_name: 'Mutiso', date_of_birth: '1975-07-09', gender: 'male', phone: '0712345004', address: 'Kandara, Murang\'a', blood_group: 'AB+', allergies: ['sulfa drugs'], emergency_contact_name: 'Ruth Mutiso', emergency_contact_phone: '0712345104', registered_at: '2026-01-15T09:00:00' },
  { patient_id: 'PAT-005', user_id: 'USR-P005', first_name: 'Ann', last_name: 'Chepkoech', date_of_birth: '1993-09-30', gender: 'female', phone: '0712345005', address: 'Thika Town', blood_group: 'O-', allergies: ['dust', 'pollen'], emergency_contact_name: 'Kiplagat Chepkoech', emergency_contact_phone: '0712345105', registered_at: '2026-02-02T09:00:00' },
  { patient_id: 'PAT-006', user_id: 'USR-P006', first_name: 'David', last_name: 'Wekesa', date_of_birth: '1968-12-15', gender: 'male', phone: '0712345006', address: 'Thika Town', blood_group: 'A-', allergies: [], emergency_contact_name: 'Nancy Wekesa', emergency_contact_phone: '0712345106', registered_at: '2026-02-20T09:00:00' },
  { patient_id: 'PAT-007', user_id: 'USR-P007', first_name: 'Faith', last_name: 'Adhiambo', date_of_birth: '1998-03-25', gender: 'female', phone: '0712345007', address: 'Makongeni, Thika', blood_group: 'B-', allergies: [], emergency_contact_name: 'Otieno Adhiambo', emergency_contact_phone: '0712345107', registered_at: '2026-03-05T09:00:00' },
  { patient_id: 'PAT-008', user_id: 'USR-P008', first_name: 'Joseph', last_name: 'Njoroge', date_of_birth: '2010-06-18', gender: 'male', phone: '0712345008', address: 'Kigumo, Murang\'a', blood_group: 'O+', allergies: [], emergency_contact_name: 'Alice Njoroge (mother)', emergency_contact_phone: '0712345108', registered_at: '2026-03-18T09:00:00' },
  { patient_id: 'PAT-009', user_id: 'USR-P009', first_name: 'Mary', last_name: 'Akinyi', date_of_birth: '1955-01-11', gender: 'female', phone: '0712345009', address: 'South B, Nairobi', blood_group: 'AB-', allergies: ['aspirin'], emergency_contact_name: 'James Akinyi', emergency_contact_phone: '0712345109', registered_at: '2026-04-01T09:00:00' },
  { patient_id: 'PAT-010', user_id: 'USR-P010', first_name: 'Kevin', last_name: 'Barasa', date_of_birth: '1988-08-08', gender: 'male', phone: '0712345010', address: 'Kasarani, Nairobi', blood_group: 'A+', allergies: [], emergency_contact_name: 'Diana Barasa', emergency_contact_phone: '0712345110', registered_at: '2026-04-22T09:00:00' },
  { patient_id: 'PAT-011', user_id: 'USR-P011', first_name: 'Sarah', last_name: 'Muthoni', date_of_birth: '1979-04-04', gender: 'female', phone: '0712345011', address: 'Embakasi, Nairobi', blood_group: 'O+', allergies: ['penicillin'], emergency_contact_name: 'John Muthoni', emergency_contact_phone: '0712345111', registered_at: '2026-05-10T09:00:00' },
  { patient_id: 'PAT-012', user_id: 'USR-P012', first_name: 'Brian', last_name: 'Kiplangat', date_of_birth: '1992-10-22', gender: 'male', phone: '0712345012', address: 'Kangema, Murang\'a', blood_group: 'B+', allergies: [], emergency_contact_name: 'Beatrice Kiplangat', emergency_contact_phone: '0712345112', registered_at: '2026-05-29T09:00:00' },
];

export const prescriptions = [
  { prescription_id: 'RX-001', patient_id: 'PAT-001', staff_id: 'STF-001', hospital_id: 'HOS-001', date_issued: '2026-07-20T09:15:00', diagnosis: 'Hypertension', status: 'active', notes: 'Monitor BP weekly' },
  { prescription_id: 'RX-002', patient_id: 'PAT-002', staff_id: 'STF-001', hospital_id: 'HOS-001', date_issued: '2026-06-15T10:00:00', diagnosis: 'Bacterial throat infection', status: 'completed', notes: 'Full course completed without complications' },
  { prescription_id: 'RX-003', patient_id: 'PAT-003', staff_id: 'STF-003', hospital_id: 'HOS-001', date_issued: '2026-08-01T08:30:00', diagnosis: 'Malaria (P. falciparum)', status: 'active', notes: 'Confirmed via rapid test' },
  { prescription_id: 'RX-004', patient_id: 'PAT-004', staff_id: 'STF-001', hospital_id: 'HOS-001', date_issued: '2026-07-05T09:00:00', diagnosis: 'Type 2 Diabetes', status: 'active', notes: 'Reviewed alongside diet plan' },
  { prescription_id: 'RX-005', patient_id: 'PAT-005', staff_id: 'STF-005', hospital_id: 'HOS-002', date_issued: '2026-07-28T11:00:00', diagnosis: 'Asthma', status: 'active', notes: 'Advised to avoid known triggers' },
  { prescription_id: 'RX-006', patient_id: 'PAT-006', staff_id: 'STF-005', hospital_id: 'HOS-002', date_issued: '2026-05-10T09:00:00', diagnosis: 'Hypertension', status: 'completed', notes: 'Course completed, BP stable at review' },
  { prescription_id: 'RX-007', patient_id: 'PAT-007', staff_id: 'STF-005', hospital_id: 'HOS-002', date_issued: '2026-08-05T13:00:00', diagnosis: 'Gastritis', status: 'active', notes: '' },
  { prescription_id: 'RX-008', patient_id: 'PAT-008', staff_id: 'STF-003', hospital_id: 'HOS-001', date_issued: '2026-08-08T14:00:00', diagnosis: 'Malaria (paediatric)', status: 'active', notes: 'Weight-adjusted dosage' },
  { prescription_id: 'RX-009', patient_id: 'PAT-009', staff_id: 'STF-008', hospital_id: 'HOS-003', date_issued: '2026-07-15T09:30:00', diagnosis: 'Cardiac arrhythmia', status: 'active', notes: 'ECG on file' },
  { prescription_id: 'RX-010', patient_id: 'PAT-010', staff_id: 'STF-008', hospital_id: 'HOS-003', date_issued: '2026-06-01T09:00:00', diagnosis: 'Post-surgical infection', status: 'cancelled', notes: 'Patient discontinued after adverse reaction' },
  { prescription_id: 'RX-011', patient_id: 'PAT-011', staff_id: 'STF-008', hospital_id: 'HOS-003', date_issued: '2026-08-02T10:00:00', diagnosis: 'Type 2 Diabetes', status: 'active', notes: 'First diagnosis' },
  { prescription_id: 'RX-012', patient_id: 'PAT-012', staff_id: 'STF-003', hospital_id: 'HOS-001', date_issued: '2026-04-20T10:00:00', diagnosis: 'Generalised anxiety', status: 'completed', notes: 'Referred for counselling alongside course' },
];

export const prescriptionItems = [
  { item_id: 'ITEM-001', prescription_id: 'RX-001', drug_id: 'DRG-006', dosage_amount: 5, dosage_unit: 'mg', frequency_per_day: 1, duration_days: 30, max_daily_dose: 5, start_date: '2026-07-20', end_date: '2026-08-19', instructions: 'Take in the morning' },
  { item_id: 'ITEM-002', prescription_id: 'RX-001', drug_id: 'DRG-013', dosage_amount: 25, dosage_unit: 'mg', frequency_per_day: 1, duration_days: 30, max_daily_dose: 25, start_date: '2026-07-20', end_date: '2026-08-19', instructions: 'Take with breakfast' },
  { item_id: 'ITEM-003', prescription_id: 'RX-002', drug_id: 'DRG-014', dosage_amount: 250, dosage_unit: 'mg', frequency_per_day: 1, duration_days: 5, max_daily_dose: 250, start_date: '2026-06-15', end_date: '2026-06-20', instructions: 'Complete the full course' },
  { item_id: 'ITEM-004', prescription_id: 'RX-003', drug_id: 'DRG-004', dosage_amount: 1, dosage_unit: 'tablets', frequency_per_day: 2, duration_days: 3, max_daily_dose: 2, start_date: '2026-08-01', end_date: '2026-08-04', instructions: 'Take after food' },
  { item_id: 'ITEM-005', prescription_id: 'RX-004', drug_id: 'DRG-005', dosage_amount: 500, dosage_unit: 'mg', frequency_per_day: 2, duration_days: 90, max_daily_dose: 1000, start_date: '2026-07-05', end_date: '2026-10-03', instructions: 'Take with meals' },
  { item_id: 'ITEM-006', prescription_id: 'RX-004', drug_id: 'DRG-001', dosage_amount: 500, dosage_unit: 'mg', frequency_per_day: 3, duration_days: 5, max_daily_dose: 1500, start_date: '2026-07-05', end_date: '2026-07-10', instructions: 'As needed for pain' },
  { item_id: 'ITEM-007', prescription_id: 'RX-005', drug_id: 'DRG-008', dosage_amount: 2, dosage_unit: 'tablets', frequency_per_day: 4, duration_days: 30, max_daily_dose: 8, start_date: '2026-07-28', end_date: '2026-08-27', instructions: 'Use during breathlessness (2 puffs)' },
  { item_id: 'ITEM-008', prescription_id: 'RX-006', drug_id: 'DRG-006', dosage_amount: 5, dosage_unit: 'mg', frequency_per_day: 1, duration_days: 60, max_daily_dose: 5, start_date: '2026-05-10', end_date: '2026-07-09', instructions: 'Take in the morning' },
  { item_id: 'ITEM-009', prescription_id: 'RX-007', drug_id: 'DRG-007', dosage_amount: 20, dosage_unit: 'mg', frequency_per_day: 1, duration_days: 14, max_daily_dose: 20, start_date: '2026-08-05', end_date: '2026-08-19', instructions: 'Take before breakfast' },
  { item_id: 'ITEM-010', prescription_id: 'RX-008', drug_id: 'DRG-004', dosage_amount: 0.5, dosage_unit: 'tablets', frequency_per_day: 2, duration_days: 3, max_daily_dose: 1, start_date: '2026-08-08', end_date: '2026-08-11', instructions: 'Crush and mix with food' },
  { item_id: 'ITEM-011', prescription_id: 'RX-009', drug_id: 'DRG-011', dosage_amount: 5, dosage_unit: 'mg', frequency_per_day: 1, duration_days: 10, max_daily_dose: 5, start_date: '2026-07-15', end_date: '2026-07-25', instructions: 'Take at night' },
  { item_id: 'ITEM-012', prescription_id: 'RX-009', drug_id: 'DRG-013', dosage_amount: 25, dosage_unit: 'mg', frequency_per_day: 1, duration_days: 30, max_daily_dose: 25, start_date: '2026-07-15', end_date: '2026-08-14', instructions: 'Take with breakfast' },
  { item_id: 'ITEM-013', prescription_id: 'RX-010', drug_id: 'DRG-012', dosage_amount: 1, dosage_unit: 'g', frequency_per_day: 1, duration_days: 7, max_daily_dose: 1, start_date: '2026-06-01', end_date: '2026-06-08', instructions: 'Administered by nurse' },
  { item_id: 'ITEM-014', prescription_id: 'RX-011', drug_id: 'DRG-005', dosage_amount: 500, dosage_unit: 'mg', frequency_per_day: 2, duration_days: 90, max_daily_dose: 1000, start_date: '2026-08-02', end_date: '2026-10-31', instructions: 'Take with meals' },
  { item_id: 'ITEM-015', prescription_id: 'RX-012', drug_id: 'DRG-011', dosage_amount: 5, dosage_unit: 'mg', frequency_per_day: 1, duration_days: 21, max_daily_dose: 5, start_date: '2026-04-20', end_date: '2026-05-11', instructions: 'Take at night' },
];

export const doseLogs = [
  { log_id: 'DOSE-001', item_id: 'ITEM-001', patient_id: 'PAT-001', scheduled_time: '2026-08-12T07:00:00', taken_at: '2026-08-12T07:05:00', status: 'taken' },
  { log_id: 'DOSE-002', item_id: 'ITEM-001', patient_id: 'PAT-001', scheduled_time: '2026-08-11T07:00:00', taken_at: '2026-08-11T07:15:00', status: 'taken' },
  { log_id: 'DOSE-003', item_id: 'ITEM-002', patient_id: 'PAT-001', scheduled_time: '2026-08-12T08:00:00', taken_at: null, status: 'pending' },
  { log_id: 'DOSE-004', item_id: 'ITEM-002', patient_id: 'PAT-001', scheduled_time: '2026-08-11T08:00:00', taken_at: null, status: 'missed' },
  { log_id: 'DOSE-005', item_id: 'ITEM-004', patient_id: 'PAT-003', scheduled_time: '2026-08-12T08:00:00', taken_at: '2026-08-12T08:05:00', status: 'taken' },
  { log_id: 'DOSE-006', item_id: 'ITEM-004', patient_id: 'PAT-003', scheduled_time: '2026-08-12T20:00:00', taken_at: null, status: 'pending' },
  { log_id: 'DOSE-007', item_id: 'ITEM-005', patient_id: 'PAT-004', scheduled_time: '2026-08-12T07:00:00', taken_at: '2026-08-12T07:00:00', status: 'taken' },
  { log_id: 'DOSE-008', item_id: 'ITEM-005', patient_id: 'PAT-004', scheduled_time: '2026-08-12T19:00:00', taken_at: null, status: 'pending' },
  { log_id: 'DOSE-009', item_id: 'ITEM-005', patient_id: 'PAT-004', scheduled_time: '2026-08-11T19:00:00', taken_at: null, status: 'missed' },
  { log_id: 'DOSE-010', item_id: 'ITEM-007', patient_id: 'PAT-005', scheduled_time: '2026-08-12T06:00:00', taken_at: '2026-08-12T06:10:00', status: 'taken' },
  { log_id: 'DOSE-011', item_id: 'ITEM-007', patient_id: 'PAT-005', scheduled_time: '2026-08-12T12:00:00', taken_at: null, status: 'pending' },
  { log_id: 'DOSE-012', item_id: 'ITEM-007', patient_id: 'PAT-005', scheduled_time: '2026-08-11T18:00:00', taken_at: '2026-08-11T18:05:00', status: 'taken' },
  { log_id: 'DOSE-013', item_id: 'ITEM-009', patient_id: 'PAT-007', scheduled_time: '2026-08-12T07:30:00', taken_at: '2026-08-12T07:35:00', status: 'taken' },
  { log_id: 'DOSE-014', item_id: 'ITEM-009', patient_id: 'PAT-007', scheduled_time: '2026-08-11T07:30:00', taken_at: '2026-08-11T07:40:00', status: 'taken' },
  { log_id: 'DOSE-015', item_id: 'ITEM-010', patient_id: 'PAT-008', scheduled_time: '2026-08-12T08:00:00', taken_at: null, status: 'pending' },
  { log_id: 'DOSE-016', item_id: 'ITEM-010', patient_id: 'PAT-008', scheduled_time: '2026-08-11T20:00:00', taken_at: '2026-08-11T20:10:00', status: 'taken' },
  { log_id: 'DOSE-017', item_id: 'ITEM-011', patient_id: 'PAT-009', scheduled_time: '2026-08-11T21:00:00', taken_at: null, status: 'skipped' },
  { log_id: 'DOSE-018', item_id: 'ITEM-012', patient_id: 'PAT-009', scheduled_time: '2026-08-12T08:00:00', taken_at: '2026-08-12T08:00:00', status: 'taken' },
  { log_id: 'DOSE-019', item_id: 'ITEM-014', patient_id: 'PAT-011', scheduled_time: '2026-08-12T07:00:00', taken_at: '2026-08-12T07:00:00', status: 'taken' },
  { log_id: 'DOSE-020', item_id: 'ITEM-014', patient_id: 'PAT-011', scheduled_time: '2026-08-12T19:00:00', taken_at: null, status: 'pending' },
];

export const appointments = [
  { appointment_id: 'APT-001', patient_id: 'PAT-001', hospital_id: 'HOS-001', staff_id: 'STF-001', room_id: 'ROOM-001', scheduled_datetime: '2026-08-15T09:00:00', duration_minutes: 30, department: 'General Medicine', purpose: 'Blood pressure review', status: 'scheduled' },
  { appointment_id: 'APT-002', patient_id: 'PAT-002', hospital_id: 'HOS-001', staff_id: 'STF-001', room_id: 'ROOM-001', scheduled_datetime: '2026-08-20T10:00:00', duration_minutes: 20, department: 'General Medicine', purpose: 'Post-treatment follow-up', status: 'scheduled' },
  { appointment_id: 'APT-003', patient_id: 'PAT-003', hospital_id: 'HOS-001', staff_id: 'STF-003', room_id: 'ROOM-002', scheduled_datetime: '2026-08-14T11:00:00', duration_minutes: 30, department: 'Paediatrics', purpose: 'Malaria follow-up', status: 'scheduled' },
  { appointment_id: 'APT-004', patient_id: 'PAT-004', hospital_id: 'HOS-001', staff_id: 'STF-001', room_id: 'ROOM-001', scheduled_datetime: '2026-08-18T09:30:00', duration_minutes: 30, department: 'General Medicine', purpose: 'Diabetes review', status: 'scheduled' },
  { appointment_id: 'APT-005', patient_id: 'PAT-005', hospital_id: 'HOS-002', staff_id: 'STF-005', room_id: 'ROOM-005', scheduled_datetime: '2026-08-16T14:00:00', duration_minutes: 20, department: 'Internal Medicine', purpose: 'Asthma check', status: 'scheduled' },
  { appointment_id: 'APT-006', patient_id: 'PAT-006', hospital_id: 'HOS-002', staff_id: 'STF-005', room_id: 'ROOM-005', scheduled_datetime: '2026-07-20T10:00:00', duration_minutes: 20, department: 'Internal Medicine', purpose: 'Blood pressure check', status: 'completed' },
  { appointment_id: 'APT-007', patient_id: 'PAT-007', hospital_id: 'HOS-002', staff_id: 'STF-005', room_id: 'ROOM-005', scheduled_datetime: '2026-08-19T13:00:00', duration_minutes: 20, department: 'Internal Medicine', purpose: 'Gastritis follow-up', status: 'scheduled' },
  { appointment_id: 'APT-008', patient_id: 'PAT-008', hospital_id: 'HOS-001', staff_id: 'STF-003', room_id: 'ROOM-002', scheduled_datetime: '2026-08-13T15:00:00', duration_minutes: 20, department: 'Paediatrics', purpose: 'Malaria review', status: 'scheduled' },
  { appointment_id: 'APT-009', patient_id: 'PAT-009', hospital_id: 'HOS-003', staff_id: 'STF-008', room_id: 'ROOM-010', scheduled_datetime: '2026-08-17T09:00:00', duration_minutes: 40, department: 'Cardiology', purpose: 'Arrhythmia monitoring', status: 'scheduled' },
  { appointment_id: 'APT-010', patient_id: 'PAT-010', hospital_id: 'HOS-003', staff_id: 'STF-008', room_id: 'ROOM-010', scheduled_datetime: '2026-06-10T09:00:00', duration_minutes: 30, department: 'Cardiology', purpose: 'Infection review', status: 'missed' },
  { appointment_id: 'APT-011', patient_id: 'PAT-011', hospital_id: 'HOS-003', staff_id: 'STF-008', room_id: 'ROOM-010', scheduled_datetime: '2026-08-21T10:00:00', duration_minutes: 30, department: 'Cardiology', purpose: 'Diabetes review', status: 'scheduled' },
  { appointment_id: 'APT-012', patient_id: 'PAT-012', hospital_id: 'HOS-001', staff_id: 'STF-003', room_id: 'ROOM-002', scheduled_datetime: '2026-05-05T10:00:00', duration_minutes: 20, department: 'Psychiatry', purpose: 'Anxiety follow-up', status: 'completed' },
];

// ---------------------------------------------------------------------------
// HOSPITAL DOMAIN (§10.4)
// ---------------------------------------------------------------------------

export const hospitals = [
  { hospital_id: 'HOS-001', name: 'Murang\'a Level 5 Hospital', address: 'Murang\'a Town, Murang\'a County', phone: '0700111001', email: 'info@muranga5.mediflow.dev', type: 'hospital' },
  { hospital_id: 'HOS-002', name: 'Thika Level 5 Hospital', address: 'Kwame Nkrumah Road, Thika', phone: '0700111002', email: 'info@thika5.mediflow.dev', type: 'hospital' },
  { hospital_id: 'HOS-003', name: 'Kenyatta National Hospital', address: 'Hospital Road, Upper Hill, Nairobi', phone: '0700111003', email: 'info@knh.mediflow.dev', type: 'hospital' },
];

export const staff = [
  { staff_id: 'STF-001', user_id: 'USR-S001', hospital_id: 'HOS-001', first_name: 'James', last_name: 'Mwangi', role_title: 'doctor', department: 'General Medicine', phone: '0711000001' },
  { staff_id: 'STF-002', user_id: 'USR-S002', hospital_id: 'HOS-001', first_name: 'Grace', last_name: 'Wanjiru', role_title: 'nurse', department: 'General Medicine', phone: '0711000002' },
  { staff_id: 'STF-003', user_id: 'USR-S003', hospital_id: 'HOS-001', first_name: 'Peter', last_name: 'Kamau', role_title: 'doctor', department: 'Paediatrics', phone: '0711000003' },
  { staff_id: 'STF-004', user_id: 'USR-S004', hospital_id: 'HOS-001', first_name: 'Alice', last_name: 'Njeri', role_title: 'pharmacist', department: 'Pharmacy', phone: '0711000004' },
  { staff_id: 'STF-005', user_id: 'USR-S005', hospital_id: 'HOS-002', first_name: 'Susan', last_name: 'Achieng', role_title: 'doctor', department: 'Internal Medicine', phone: '0711000005' },
  { staff_id: 'STF-006', user_id: 'USR-S006', hospital_id: 'HOS-002', first_name: 'Daniel', last_name: 'Otieno', role_title: 'nurse', department: 'Surgery', phone: '0711000006' },
  { staff_id: 'STF-007', user_id: 'USR-S007', hospital_id: 'HOS-002', first_name: 'Mercy', last_name: 'Wambui', role_title: 'administrator', department: 'Administration', phone: '0711000007' },
  { staff_id: 'STF-008', user_id: 'USR-S008', hospital_id: 'HOS-003', first_name: 'John', last_name: 'Kiptoo', role_title: 'doctor', department: 'Cardiology', phone: '0711000008' },
  { staff_id: 'STF-009', user_id: 'USR-S009', hospital_id: 'HOS-003', first_name: 'Faith', last_name: 'Chebet', role_title: 'nurse', department: 'ICU', phone: '0711000009' },
  { staff_id: 'STF-010', user_id: 'USR-S010', hospital_id: 'HOS-003', first_name: 'Brian', last_name: 'Omondi', role_title: 'pharmacist', department: 'Pharmacy', phone: '0711000010' },
];

// quantity_in_stock < reorder_threshold on DRG-002, DRG-004, DRG-008, DRG-012
// -> these four should trigger a low-stock alert as soon as the app loads.
// expiry_date within ~30 days of "today" (2026-08-12) on DRG-002, DRG-010,
// DRG-014 -> these should trigger an expiry warning.
export const drugs = [
  { drug_id: 'DRG-001', hospital_id: 'HOS-001', name: 'Paracetamol', generic_name: 'Paracetamol', category: 'analgesic', form: 'tablet', strength: 500, strength_unit: 'mg', quantity_in_stock: 500, reorder_threshold: 100, unit_cost: 2, batch_number: 'B-2026-101', expiry_date: '2027-06-01', supplier: 'MedSupply Kenya', last_restocked: '2026-07-01T10:00:00' },
  { drug_id: 'DRG-002', hospital_id: 'HOS-001', name: 'Amoxicillin', generic_name: 'Amoxicillin', category: 'antibiotic', form: 'capsule', strength: 250, strength_unit: 'mg', quantity_in_stock: 45, reorder_threshold: 50, unit_cost: 6, batch_number: 'B-2026-102', expiry_date: '2026-09-15', supplier: 'MedSupply Kenya', last_restocked: '2026-07-10T10:00:00' },
  { drug_id: 'DRG-003', hospital_id: 'HOS-001', name: 'Ibuprofen', generic_name: 'Ibuprofen', category: 'analgesic', form: 'tablet', strength: 400, strength_unit: 'mg', quantity_in_stock: 300, reorder_threshold: 60, unit_cost: 3, batch_number: 'B-2026-103', expiry_date: '2027-01-01', supplier: 'PharmaDirect', last_restocked: '2026-06-20T10:00:00' },
  { drug_id: 'DRG-004', hospital_id: 'HOS-001', name: 'Coartem', generic_name: 'Artemether/Lumefantrine', category: 'antimalarial', form: 'tablet', strength: 20, strength_unit: 'mg', quantity_in_stock: 20, reorder_threshold: 40, unit_cost: 12, batch_number: 'B-2026-104', expiry_date: '2026-12-01', supplier: 'Kemsa', last_restocked: '2026-07-18T10:00:00' },
  { drug_id: 'DRG-005', hospital_id: 'HOS-001', name: 'Metformin', generic_name: 'Metformin HCl', category: 'antidiabetic', form: 'tablet', strength: 500, strength_unit: 'mg', quantity_in_stock: 150, reorder_threshold: 50, unit_cost: 4, batch_number: 'B-2026-105', expiry_date: '2027-03-01', supplier: 'PharmaDirect', last_restocked: '2026-06-15T10:00:00' },
  { drug_id: 'DRG-006', hospital_id: 'HOS-002', name: 'Amlodipine', generic_name: 'Amlodipine Besylate', category: 'antihypertensive', form: 'tablet', strength: 5, strength_unit: 'mg', quantity_in_stock: 200, reorder_threshold: 50, unit_cost: 3, batch_number: 'B-2026-106', expiry_date: '2027-05-01', supplier: 'PharmaDirect', last_restocked: '2026-07-12T10:00:00' },
  { drug_id: 'DRG-007', hospital_id: 'HOS-002', name: 'Omeprazole', generic_name: 'Omeprazole', category: 'antacid', form: 'capsule', strength: 20, strength_unit: 'mg', quantity_in_stock: 180, reorder_threshold: 40, unit_cost: 5, batch_number: 'B-2026-107', expiry_date: '2027-02-01', supplier: 'MedSupply Kenya', last_restocked: '2026-06-25T10:00:00' },
  { drug_id: 'DRG-008', hospital_id: 'HOS-002', name: 'Salbutamol Inhaler', generic_name: 'Salbutamol', category: 'bronchodilator', form: 'inhaler', strength: 100, strength_unit: 'mg', quantity_in_stock: 25, reorder_threshold: 30, unit_cost: 350, batch_number: 'B-2026-108', expiry_date: '2026-10-01', supplier: 'PharmaDirect', last_restocked: '2026-07-22T10:00:00' },
  { drug_id: 'DRG-009', hospital_id: 'HOS-002', name: 'ORS Sachets', generic_name: 'Oral Rehydration Salts', category: 'rehydration', form: 'sachet', strength: 1, strength_unit: 'ml', quantity_in_stock: 400, reorder_threshold: 100, unit_cost: 15, batch_number: 'B-2026-109', expiry_date: '2027-08-01', supplier: 'Kemsa', last_restocked: '2026-06-01T10:00:00' },
  { drug_id: 'DRG-010', hospital_id: 'HOS-003', name: 'Actrapid Insulin', generic_name: 'Insulin (soluble)', category: 'antidiabetic', form: 'injection', strength: 100, strength_unit: 'IU', quantity_in_stock: 60, reorder_threshold: 20, unit_cost: 450, batch_number: 'B-2026-110', expiry_date: '2026-09-01', supplier: 'Kemsa', last_restocked: '2026-07-15T10:00:00' },
  { drug_id: 'DRG-011', hospital_id: 'HOS-003', name: 'Diazepam', generic_name: 'Diazepam', category: 'sedative', form: 'tablet', strength: 5, strength_unit: 'mg', quantity_in_stock: 80, reorder_threshold: 20, unit_cost: 8, batch_number: 'B-2026-111', expiry_date: '2027-04-01', supplier: 'MedSupply Kenya', last_restocked: '2026-05-20T10:00:00' },
  { drug_id: 'DRG-012', hospital_id: 'HOS-003', name: 'Ceftriaxone', generic_name: 'Ceftriaxone Sodium', category: 'antibiotic', form: 'injection', strength: 1, strength_unit: 'g', quantity_in_stock: 15, reorder_threshold: 25, unit_cost: 180, batch_number: 'B-2026-112', expiry_date: '2026-11-01', supplier: 'MedSupply Kenya', last_restocked: '2026-07-28T10:00:00' },
  { drug_id: 'DRG-013', hospital_id: 'HOS-003', name: 'Hydrochlorothiazide', generic_name: 'Hydrochlorothiazide', category: 'antihypertensive', form: 'tablet', strength: 25, strength_unit: 'mg', quantity_in_stock: 120, reorder_threshold: 30, unit_cost: 3, batch_number: 'B-2026-113', expiry_date: '2027-06-01', supplier: 'PharmaDirect', last_restocked: '2026-06-10T10:00:00' },
  { drug_id: 'DRG-014', hospital_id: 'HOS-001', name: 'Azithromycin', generic_name: 'Azithromycin', category: 'antibiotic', form: 'tablet', strength: 250, strength_unit: 'mg', quantity_in_stock: 90, reorder_threshold: 30, unit_cost: 9, batch_number: 'B-2026-114', expiry_date: '2026-08-25', supplier: 'MedSupply Kenya', last_restocked: '2026-07-25T10:00:00' },
  { drug_id: 'DRG-015', hospital_id: 'HOS-002', name: 'Vitamin C', generic_name: 'Ascorbic Acid', category: 'supplement', form: 'tablet', strength: 500, strength_unit: 'mg', quantity_in_stock: 250, reorder_threshold: 50, unit_cost: 2, batch_number: 'B-2026-115', expiry_date: '2027-07-01', supplier: 'PharmaDirect', last_restocked: '2026-06-05T10:00:00' },
];

export const rooms = [
  { room_id: 'ROOM-001', hospital_id: 'HOS-001', room_number: '101', room_type: 'consultation', capacity: 1, status: 'available', floor: 'Ground', equipment: [] },
  { room_id: 'ROOM-002', hospital_id: 'HOS-001', room_number: '102', room_type: 'consultation', capacity: 1, status: 'available', floor: 'Ground', equipment: [] },
  { room_id: 'ROOM-003', hospital_id: 'HOS-001', room_number: 'T1', room_type: 'theatre', capacity: 6, status: 'available', floor: '1st Floor', equipment: ['Anaesthesia machine', 'Surgical lights'] },
  { room_id: 'ROOM-004', hospital_id: 'HOS-001', room_number: 'W1', room_type: 'ward', capacity: 20, status: 'available', floor: '2nd Floor', equipment: [] },
  { room_id: 'ROOM-005', hospital_id: 'HOS-002', room_number: '201', room_type: 'consultation', capacity: 1, status: 'occupied', floor: 'Ground', equipment: [] },
  { room_id: 'ROOM-006', hospital_id: 'HOS-002', room_number: 'X1', room_type: 'xray', capacity: 2, status: 'available', floor: '1st Floor', equipment: ['X-ray machine'] },
  { room_id: 'ROOM-007', hospital_id: 'HOS-002', room_number: 'W2', room_type: 'ward', capacity: 15, status: 'available', floor: '2nd Floor', equipment: [] },
  { room_id: 'ROOM-008', hospital_id: 'HOS-003', room_number: 'ICU1', room_type: 'icu', capacity: 8, status: 'occupied', floor: '3rd Floor', equipment: ['Ventilators', 'Cardiac monitors'] },
  { room_id: 'ROOM-009', hospital_id: 'HOS-003', room_number: 'MRI1', room_type: 'mri', capacity: 2, status: 'maintenance', floor: '1st Floor', equipment: ['MRI scanner'] },
  { room_id: 'ROOM-010', hospital_id: 'HOS-003', room_number: '301', room_type: 'consultation', capacity: 1, status: 'available', floor: '3rd Floor', equipment: [] },
];

// No two bookings for the same room overlap in time — Integrity Rule 3 (§10.5).
export const roomBookings = [
  { booking_id: 'BOOK-001', room_id: 'ROOM-003', patient_id: null, staff_id: 'STF-001', start_datetime: '2026-08-14T08:00:00', end_datetime: '2026-08-14T10:00:00', purpose: 'Theatre prep and cleaning', status: 'confirmed' },
  { booking_id: 'BOOK-002', room_id: 'ROOM-003', patient_id: 'PAT-004', staff_id: 'STF-001', start_datetime: '2026-08-15T08:00:00', end_datetime: '2026-08-15T09:30:00', purpose: 'Minor procedure', status: 'confirmed' },
  { booking_id: 'BOOK-003', room_id: 'ROOM-006', patient_id: 'PAT-005', staff_id: 'STF-005', start_datetime: '2026-08-13T10:00:00', end_datetime: '2026-08-13T10:30:00', purpose: 'Chest X-ray', status: 'confirmed' },
  { booking_id: 'BOOK-004', room_id: 'ROOM-006', patient_id: 'PAT-006', staff_id: 'STF-005', start_datetime: '2026-08-13T11:00:00', end_datetime: '2026-08-13T11:30:00', purpose: 'Follow-up X-ray', status: 'confirmed' },
  { booking_id: 'BOOK-005', room_id: 'ROOM-009', patient_id: 'PAT-009', staff_id: 'STF-008', start_datetime: '2026-08-18T09:00:00', end_datetime: '2026-08-18T10:00:00', purpose: 'Cardiac MRI', status: 'confirmed' },
  { booking_id: 'BOOK-006', room_id: 'ROOM-001', patient_id: 'PAT-001', staff_id: 'STF-001', start_datetime: '2026-08-15T09:00:00', end_datetime: '2026-08-15T09:30:00', purpose: 'Consultation', status: 'confirmed' },
  { booking_id: 'BOOK-007', room_id: 'ROOM-002', patient_id: 'PAT-003', staff_id: 'STF-003', start_datetime: '2026-08-14T11:00:00', end_datetime: '2026-08-14T11:30:00', purpose: 'Consultation', status: 'confirmed' },
  { booking_id: 'BOOK-008', room_id: 'ROOM-005', patient_id: 'PAT-005', staff_id: 'STF-005', start_datetime: '2026-08-16T14:00:00', end_datetime: '2026-08-16T14:20:00', purpose: 'Consultation', status: 'confirmed' },
  { booking_id: 'BOOK-009', room_id: 'ROOM-008', patient_id: 'PAT-009', staff_id: 'STF-009', start_datetime: '2026-08-10T00:00:00', end_datetime: '2026-08-20T00:00:00', purpose: 'ICU monitoring', status: 'in_progress' },
  { booking_id: 'BOOK-010', room_id: 'ROOM-004', patient_id: 'PAT-008', staff_id: 'STF-002', start_datetime: '2026-08-08T00:00:00', end_datetime: '2026-08-14T00:00:00', purpose: 'Ward stay', status: 'in_progress' },
  { booking_id: 'BOOK-011', room_id: 'ROOM-007', patient_id: 'PAT-006', staff_id: 'STF-006', start_datetime: '2026-07-01T00:00:00', end_datetime: '2026-07-05T00:00:00', purpose: 'Ward stay post-op', status: 'completed' },
  { booking_id: 'BOOK-012', room_id: 'ROOM-010', patient_id: 'PAT-011', staff_id: 'STF-008', start_datetime: '2026-08-21T10:00:00', end_datetime: '2026-08-21T10:30:00', purpose: 'Consultation', status: 'confirmed' },
];

// status: 'admitted' rows have discharge_datetime: null — Integrity Rule 4 (§10.5).
export const admissions = [
  { admission_id: 'ADM-001', patient_id: 'PAT-008', hospital_id: 'HOS-001', room_id: 'ROOM-004', admitting_staff_id: 'STF-002', admission_datetime: '2026-08-08T09:00:00', discharge_datetime: null, reason: 'Malaria treatment - paediatric monitoring', status: 'admitted', notes: 'Responding well to Coartem' },
  { admission_id: 'ADM-002', patient_id: 'PAT-009', hospital_id: 'HOS-003', room_id: 'ROOM-008', admitting_staff_id: 'STF-009', admission_datetime: '2026-08-10T14:00:00', discharge_datetime: null, reason: 'Cardiac arrhythmia monitoring', status: 'admitted', notes: 'On continuous ECG' },
  { admission_id: 'ADM-003', patient_id: 'PAT-006', hospital_id: 'HOS-002', room_id: 'ROOM-007', admitting_staff_id: 'STF-006', admission_datetime: '2026-07-01T08:00:00', discharge_datetime: '2026-07-05T10:00:00', reason: 'Post-operative recovery', status: 'discharged', notes: 'Discharged with follow-up scheduled' },
  { admission_id: 'ADM-004', patient_id: 'PAT-002', hospital_id: 'HOS-001', room_id: 'ROOM-004', admitting_staff_id: 'STF-001', admission_datetime: '2026-06-10T10:00:00', discharge_datetime: '2026-06-14T09:00:00', reason: 'Severe bacterial infection', status: 'discharged', notes: '' },
  { admission_id: 'ADM-005', patient_id: 'PAT-004', hospital_id: 'HOS-001', room_id: 'ROOM-004', admitting_staff_id: 'STF-001', admission_datetime: '2026-07-01T11:00:00', discharge_datetime: '2026-07-03T09:00:00', reason: 'Diabetic ketoacidosis observation', status: 'discharged', notes: '' },
  { admission_id: 'ADM-006', patient_id: 'PAT-010', hospital_id: 'HOS-003', room_id: null, admitting_staff_id: 'STF-008', admission_datetime: '2026-05-28T09:00:00', discharge_datetime: '2026-05-30T10:00:00', reason: 'Infection observation', status: 'discharged', notes: 'Outpatient bed used, no ward room needed' },
  { admission_id: 'ADM-007', patient_id: 'PAT-012', hospital_id: 'HOS-001', room_id: 'ROOM-004', admitting_staff_id: 'STF-003', admission_datetime: '2026-04-15T09:00:00', discharge_datetime: '2026-04-18T10:00:00', reason: 'Severe anxiety episode observation', status: 'discharged', notes: '' },
  { admission_id: 'ADM-008', patient_id: 'PAT-001', hospital_id: 'HOS-001', room_id: null, admitting_staff_id: 'STF-001', admission_datetime: '2026-07-25T10:00:00', discharge_datetime: '2026-07-26T09:00:00', reason: 'Hypertensive crisis observation', status: 'discharged', notes: '' },
];

// spent_amount / remaining_balance are NOT stored here — see the note in
// businessLogic.js. BUD-002 sits at 90% of its allocation (deliberately
// low allocated_amount) and BUD-007 is over its allocation, so both the
// "approaching threshold" and "exceeded" code paths have real data.
export const budgets = [
  { budget_id: 'BUD-001', hospital_id: 'HOS-001', department: 'Pharmacy', category: 'drug_procurement', fiscal_period: '2026-Q3', period_start: '2026-07-01', period_end: '2026-09-30', allocated_amount: 500000, currency: 'KES', alert_threshold: 80, status: 'active' },
  { budget_id: 'BUD-002', hospital_id: 'HOS-001', department: 'Surgery', category: 'equipment', fiscal_period: '2026-Q3', period_start: '2026-07-01', period_end: '2026-09-30', allocated_amount: 50000, currency: 'KES', alert_threshold: 80, status: 'active' },
  { budget_id: 'BUD-003', hospital_id: 'HOS-001', department: 'Administration', category: 'maintenance', fiscal_period: '2026-Q3', period_start: '2026-07-01', period_end: '2026-09-30', allocated_amount: 150000, currency: 'KES', alert_threshold: 80, status: 'active' },
  { budget_id: 'BUD-004', hospital_id: 'HOS-002', department: 'Pharmacy', category: 'drug_procurement', fiscal_period: '2026-Q3', period_start: '2026-07-01', period_end: '2026-09-30', allocated_amount: 350000, currency: 'KES', alert_threshold: 75, status: 'active' },
  { budget_id: 'BUD-005', hospital_id: 'HOS-002', department: 'Radiology', category: 'equipment', fiscal_period: '2026-Q3', period_start: '2026-07-01', period_end: '2026-09-30', allocated_amount: 200000, currency: 'KES', alert_threshold: 80, status: 'active' },
  { budget_id: 'BUD-006', hospital_id: 'HOS-003', department: 'Pharmacy', category: 'drug_procurement', fiscal_period: '2026-Q3', period_start: '2026-07-01', period_end: '2026-09-30', allocated_amount: 450000, currency: 'KES', alert_threshold: 80, status: 'active' },
  { budget_id: 'BUD-007', hospital_id: 'HOS-003', department: 'ICU', category: 'equipment', fiscal_period: '2026-Q3', period_start: '2026-07-01', period_end: '2026-09-30', allocated_amount: 400000, currency: 'KES', alert_threshold: 85, status: 'exceeded' },
  { budget_id: 'BUD-008', hospital_id: 'HOS-001', department: 'Maintenance', category: 'maintenance', fiscal_period: '2026-Q2', period_start: '2026-04-01', period_end: '2026-06-30', allocated_amount: 100000, currency: 'KES', alert_threshold: 80, status: 'closed' },
];

export const expenses = [
  { expense_id: 'EXP-001', hospital_id: 'HOS-001', budget_id: 'BUD-001', drug_id: 'DRG-002', staff_id: 'STF-004', category: 'drug_procurement', description: 'Amoxicillin 250mg restock - 200 units', amount: 18000, currency: 'KES', date_incurred: '2026-07-10', supplier: 'MedSupply Kenya', invoice_reference: 'INV-1001', is_auto_generated: true },
  { expense_id: 'EXP-002', hospital_id: 'HOS-001', budget_id: 'BUD-001', drug_id: 'DRG-004', staff_id: 'STF-004', category: 'drug_procurement', description: 'Coartem restock - 100 units', amount: 25000, currency: 'KES', date_incurred: '2026-07-18', supplier: 'Kemsa', invoice_reference: 'INV-1002', is_auto_generated: true },
  { expense_id: 'EXP-003', hospital_id: 'HOS-001', budget_id: 'BUD-001', drug_id: 'DRG-014', staff_id: 'STF-004', category: 'drug_procurement', description: 'Azithromycin restock - 150 units', amount: 22000, currency: 'KES', date_incurred: '2026-07-25', supplier: 'MedSupply Kenya', invoice_reference: 'INV-1003', is_auto_generated: true },
  { expense_id: 'EXP-004', hospital_id: 'HOS-001', budget_id: 'BUD-002', drug_id: null, staff_id: 'STF-001', category: 'equipment', description: 'Surgical lights maintenance', amount: 45000, currency: 'KES', date_incurred: '2026-08-01', supplier: 'MedEquip Ltd', invoice_reference: 'INV-1004', is_auto_generated: false },
  { expense_id: 'EXP-005', hospital_id: 'HOS-001', budget_id: 'BUD-003', drug_id: null, staff_id: 'STF-002', category: 'maintenance', description: 'Ward air conditioning repair', amount: 12000, currency: 'KES', date_incurred: '2026-08-05', supplier: 'CoolFix Services', invoice_reference: 'INV-1005', is_auto_generated: false },
  { expense_id: 'EXP-006', hospital_id: 'HOS-002', budget_id: 'BUD-004', drug_id: 'DRG-006', staff_id: 'STF-007', category: 'drug_procurement', description: 'Amlodipine restock - 300 units', amount: 15000, currency: 'KES', date_incurred: '2026-07-12', supplier: 'PharmaDirect', invoice_reference: 'INV-1006', is_auto_generated: true },
  { expense_id: 'EXP-007', hospital_id: 'HOS-002', budget_id: 'BUD-004', drug_id: 'DRG-008', staff_id: 'STF-007', category: 'drug_procurement', description: 'Salbutamol inhaler restock - 50 units', amount: 30000, currency: 'KES', date_incurred: '2026-07-22', supplier: 'PharmaDirect', invoice_reference: 'INV-1007', is_auto_generated: true },
  { expense_id: 'EXP-008', hospital_id: 'HOS-002', budget_id: 'BUD-005', drug_id: null, staff_id: 'STF-007', category: 'equipment', description: 'X-ray machine calibration', amount: 60000, currency: 'KES', date_incurred: '2026-08-02', supplier: 'RadioTech Kenya', invoice_reference: 'INV-1008', is_auto_generated: false },
  { expense_id: 'EXP-009', hospital_id: 'HOS-003', budget_id: 'BUD-006', drug_id: 'DRG-010', staff_id: 'STF-010', category: 'drug_procurement', description: 'Actrapid Insulin restock - 80 vials', amount: 40000, currency: 'KES', date_incurred: '2026-07-15', supplier: 'Kemsa', invoice_reference: 'INV-1009', is_auto_generated: true },
  { expense_id: 'EXP-010', hospital_id: 'HOS-003', budget_id: 'BUD-006', drug_id: 'DRG-012', staff_id: 'STF-010', category: 'drug_procurement', description: 'Ceftriaxone restock - 60 units', amount: 28000, currency: 'KES', date_incurred: '2026-07-28', supplier: 'MedSupply Kenya', invoice_reference: 'INV-1010', is_auto_generated: true },
  { expense_id: 'EXP-011', hospital_id: 'HOS-003', budget_id: 'BUD-007', drug_id: null, staff_id: 'STF-009', category: 'equipment', description: 'ICU ventilator servicing', amount: 180000, currency: 'KES', date_incurred: '2026-07-10', supplier: 'MedEquip Ltd', invoice_reference: 'INV-1011', is_auto_generated: false },
  { expense_id: 'EXP-012', hospital_id: 'HOS-003', budget_id: 'BUD-007', drug_id: null, staff_id: 'STF-009', category: 'equipment', description: 'ICU monitor replacement units', amount: 200000, currency: 'KES', date_incurred: '2026-08-01', supplier: 'MedEquip Ltd', invoice_reference: 'INV-1012', is_auto_generated: false },
  { expense_id: 'EXP-013', hospital_id: 'HOS-003', budget_id: 'BUD-007', drug_id: null, staff_id: 'STF-009', category: 'equipment', description: 'Emergency ventilator replacement part', amount: 60000, currency: 'KES', date_incurred: '2026-08-10', supplier: 'MedEquip Ltd', invoice_reference: 'INV-1013', is_auto_generated: false },
  { expense_id: 'EXP-014', hospital_id: 'HOS-001', budget_id: null, drug_id: null, staff_id: 'STF-004', category: 'consumables', description: 'Gloves and syringes bulk order', amount: 8000, currency: 'KES', date_incurred: '2026-08-06', supplier: 'MedSupply Kenya', invoice_reference: 'INV-1014', is_auto_generated: false },
  { expense_id: 'EXP-015', hospital_id: 'HOS-002', budget_id: 'BUD-008', drug_id: null, staff_id: 'STF-007', category: 'maintenance', description: 'Generator servicing Q2', amount: 22000, currency: 'KES', date_incurred: '2026-05-15', supplier: 'PowerFix', invoice_reference: 'INV-1015', is_auto_generated: false },
];

export const notifications = [
  { notification_id: 'NOT-001', user_id: 'USR-S004', type: 'low_stock', message: 'Amoxicillin 250mg stock is below reorder threshold (45/50)', related_id: 'DRG-002', severity: 'warning', is_read: false, created_at: '2026-08-11T09:00:00' },
  { notification_id: 'NOT-002', user_id: 'USR-S004', type: 'low_stock', message: 'Coartem stock is below reorder threshold (20/40)', related_id: 'DRG-004', severity: 'critical', is_read: false, created_at: '2026-08-12T07:00:00' },
  { notification_id: 'NOT-003', user_id: 'USR-S004', type: 'expiry', message: 'Azithromycin 250mg expires in 13 days', related_id: 'DRG-014', severity: 'warning', is_read: false, created_at: '2026-08-12T06:00:00' },
  { notification_id: 'NOT-004', user_id: 'USR-P001', type: 'dose_due', message: 'Time to take your Hydrochlorothiazide 25mg dose', related_id: 'ITEM-002', severity: 'info', is_read: false, created_at: '2026-08-12T08:00:00' },
  { notification_id: 'NOT-005', user_id: 'USR-P004', type: 'dose_missed', message: 'You missed your Metformin dose scheduled for 2026-08-11 19:00', related_id: 'ITEM-005', severity: 'warning', is_read: true, created_at: '2026-08-11T19:30:00' },
  { notification_id: 'NOT-006', user_id: 'USR-P001', type: 'appointment', message: 'Upcoming appointment on 2026-08-15 09:00 with Dr. James Mwangi', related_id: 'APT-001', severity: 'info', is_read: false, created_at: '2026-08-12T07:00:00' },
  { notification_id: 'NOT-007', user_id: 'USR-ADM01', type: 'budget_threshold', message: 'Surgery budget at Murang\'a Level 5 Hospital has reached 90% of its allocation', related_id: 'BUD-002', severity: 'warning', is_read: false, created_at: '2026-08-01T12:00:00' },
  { notification_id: 'NOT-008', user_id: 'USR-ADM01', type: 'budget_exceeded', message: 'ICU equipment budget at Kenyatta National Hospital has exceeded its allocation', related_id: 'BUD-007', severity: 'critical', is_read: false, created_at: '2026-08-10T15:00:00' },
  { notification_id: 'NOT-009', user_id: 'USR-S010', type: 'low_stock', message: 'Ceftriaxone 1g stock is below reorder threshold (15/25)', related_id: 'DRG-012', severity: 'critical', is_read: false, created_at: '2026-08-12T07:30:00' },
  { notification_id: 'NOT-010', user_id: 'USR-P008', type: 'appointment', message: 'Upcoming appointment on 2026-08-13 15:00 with Dr. Peter Kamau', related_id: 'APT-008', severity: 'info', is_read: false, created_at: '2026-08-12T07:00:00' },
];

// Bundled export so consumers can do either
//   import { patients, drugs } from './data/seed/seed.js'
// or
//   import seed from './data/seed/seed.js'; seed.patients
export default {
  users, patients, prescriptions, prescriptionItems, doseLogs, appointments,
  hospitals, staff, drugs, rooms, roomBookings, admissions, budgets, expenses,
  notifications,
};
