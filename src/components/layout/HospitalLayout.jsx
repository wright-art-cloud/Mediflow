import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';

export default function HospitalLayout() {
  return (
    <div className="app-shell">
      <Sidebar portal="hospital" />
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
