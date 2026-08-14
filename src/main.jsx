import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DoctorDashboard from "./LandingPage/DoctorDashboard";
import PatientPortal from "./LandingPage/PatientPortal";
import LoginForm from "./Login page/LoginForm";
import App from ".";
import { DataProvider } from "./context/DataContext";
import "./LandingPage/Dashboard.css"; // Ensure this path matches your CSS file location

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DataProvider>
      <App />
    </DataProvider>
  </StrictMode>
)
