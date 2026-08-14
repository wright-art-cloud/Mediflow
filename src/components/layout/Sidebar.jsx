import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  IconCross, IconHome, IconGrid, IconPill, IconCalendar, IconUser,
  IconBox, IconDoor, IconPeople, IconClipboard, IconFileText, IconReceipt,
  IconPieChart,
} from '../icons.jsx';

const PATIENT_NAV = [
  { to: '/patient/health-hub', label: 'Health Hub', icon: IconHome },
  { to: '/patient/prescriptions', label: 'Prescriptions', icon: IconPill },
  { to: '/patient/appointments', label: 'Appointments', icon: IconCalendar },
  { to: '/patient/profile', label: 'Profile', icon: IconUser },
];

const HOSPITAL_NAV = [
  { to: '/hospital/dashboard', label: 'Dashboard', icon: IconGrid },
  { to: '/hospital/inventory', label: 'Inventory', icon: IconBox },
  { to: '/hospital/rooms', label: 'Rooms', icon: IconDoor },
  { to: '/hospital/patients', label: 'Patients', icon: IconPeople },
  { to: '/hospital/admissions', label: 'Admissions', icon: IconClipboard },
  { to: '/hospital/prescriptions', label: 'Prescriptions', icon: IconFileText },
  { to: '/hospital/expenses', label: 'Expenses', icon: IconReceipt },
  { to: '/hospital/budgets', label: 'Budgets', icon: IconPieChart },
  { to: '/hospital/profile', label: 'Profile', icon: IconUser },
];

function initialsOf(a, b) {
  return `${(a || '?')[0]}${(b || '?')[0]}`.toUpperCase();
}

export default function Sidebar({ portal }) {
  const { user, patient, staff } = useAuth();
  const items = portal === 'patient' ? PATIENT_NAV : HOSPITAL_NAV;
  const profilePath = portal === 'patient' ? '/patient/profile' : '/hospital/profile';

  const name = patient
    ? `${patient.first_name} ${patient.last_name}`
    : staff
      ? `Dr. ${staff.first_name} ${staff.last_name}`
      : user?.email;

  const sub = patient
    ? `MRN ${patient.patient_id}`
    : staff
      ? staff.department
      : '';

  const initials = patient
    ? initialsOf(patient.first_name, patient.last_name)
    : staff
      ? initialsOf(staff.first_name, staff.last_name)
      : '?';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark"><IconCross /></div>
        <div className="logo-text"><strong>Mediflow</strong><span>Clinical OS</span></div>
      </div>

      <nav className="nav-list">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Clicking the account block opens Profile, where sign-out lives now. */}
      <NavLink to={profilePath} className="sidebar-user" style={{ textDecoration: 'none' }}>
        <div className="user-avatar">{initials}</div>
        <div className="user-meta">
          <strong>{name}</strong>
          <span>{sub}</span>
        </div>
      </NavLink>
    </aside>
  );
}
