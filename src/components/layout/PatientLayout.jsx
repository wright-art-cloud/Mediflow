import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';

export default function PatientLayout() {
  return (
    <div className="app-shell">
      <Sidebar portal="patient" />
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
