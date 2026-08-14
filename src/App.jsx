import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PatientLayout from './components/layout/PatientLayout.jsx';
import HospitalLayout from './components/layout/HospitalLayout.jsx';

import Login from './pages/shared/Login.jsx';
import NotFound from './pages/shared/NotFound.jsx';
import Unauthorized from './pages/shared/Unauthorized.jsx';

import HealthHub from './pages/patient/HealthHub.jsx';
import PatientPrescriptions from './pages/patient/Prescriptions.jsx';
import PrescriptionHistory from './pages/patient/PrescriptionHistory.jsx';
import PatientAppointments from './pages/patient/Appointments.jsx';
import Profile from './pages/patient/Profile.jsx';

import Dashboard from './pages/hospital/Dashboard.jsx';
import Inventory from './pages/hospital/Inventory.jsx';
import InventoryEdit from './pages/hospital/InventoryEdit.jsx';
import Rooms from './pages/hospital/Rooms.jsx';
import RoomBooking from './pages/hospital/RoomBooking.jsx';
import Patients from './pages/hospital/Patients.jsx';
import Admissions from './pages/hospital/Admissions.jsx';
import HospitalPrescriptions from './pages/hospital/Prescriptions.jsx';
import Expenses from './pages/hospital/Expenses.jsx';
import Budgets from './pages/hospital/Budgets.jsx';
import HospitalProfile from './pages/hospital/Profile.jsx';

/** Sends '/' to the right place: sign-in, or straight to the signed-in user's portal. */
function RootRedirect() {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={role === 'patient' ? '/patient/health-hub' : '/hospital/dashboard'} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/403" element={<Unauthorized />} />

      <Route
        path="/patient"
        element={
          <ProtectedRoute allow={['patient']}>
            <PatientLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="health-hub" replace />} />
        <Route path="health-hub" element={<HealthHub />} />
        <Route path="prescriptions" element={<PatientPrescriptions />} />
        <Route path="prescriptions/history" element={<PrescriptionHistory />} />
        <Route path="appointments" element={<PatientAppointments />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route
        path="/hospital"
        element={
          <ProtectedRoute allow={['staff', 'admin']}>
            <HospitalLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="inventory/new" element={<InventoryEdit />} />
        <Route path="inventory/:drugId/edit" element={<InventoryEdit />} />
        <Route path="rooms" element={<Rooms />} />
        <Route path="rooms/book" element={<RoomBooking />} />
        <Route path="patients" element={<Patients />} />
        <Route path="patients/:patientId" element={<Patients />} />
        <Route path="admissions" element={<Admissions />} />
        <Route path="prescriptions" element={<HospitalPrescriptions />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="budgets" element={<Budgets />} />
        <Route path="profile" element={<HospitalProfile />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </DataProvider>
  );
}
