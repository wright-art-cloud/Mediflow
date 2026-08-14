import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DataProvider } from "./context/DataContext";
import DoctorDashboard from "./LandingPage/DoctorDashboard";
import PatientPortal from "./LandingPage/PatientPortal";
import LoginForm from "./Login page/LoginForm";
import { useState } from "react";

function App() {
  const [role, setRole] = useState("");

  const roleChecker = (i) => {
    setRole(i);
  };

  const [name, setName] = useState("");

  let targetPage = <LoginForm roleChecker={roleChecker} nameToParent={setName}/>;
  if (role === "Doctor") {
    targetPage = <Navigate to="/doctor"/>;
  } else if (role === "Patient") {
    targetPage = <Navigate to="/patient"/>;
  }

  let currentDate = (new Date).toLocaleDateString();

  return (
    <>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            {/* Redirect root URL "/" to "/doctor" by default */}
            {/* <Route path="/" element={<Navigate to="/doctor" replace />} /> */}
            <Route path="/" element={targetPage} />

            {}
            {/* Main Routes */}
            <Route path="/doctor" element={<DoctorDashboard name={name} currentDate={currentDate}/>} />
            <Route path="/patient" element={<PatientPortal name={name} currentDate={currentDate}/>} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </>
  );
}

export default App;
