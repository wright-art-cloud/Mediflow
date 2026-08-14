import React, { useState } from "react";
import "./Dashboard.css";
import {
  Calendar,
  Hospital,
  LayoutDashboard,
  FileText,
  MessageSquare,
  CreditCard,
  ArrowLeftRight,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import PreRegisterForm from "../PreRegisterForm/preRegisterForm";

export default function PatientPortal({name}) {
  const [activeTab, setActiveTab] = useState("Health Hub");
  const [showPreRegisterForm, setShowPreRegisterForm] = useState(false);

  let futureDate = new Date;
  futureDate.setDate(futureDate.getDate() + 4);

  futureDate = futureDate.toLocaleDateString();

  return (
    <div className="dashboard-layout">
      {/* Sidebar Frame */}
      <aside className="sidebar">
        <div className="brand-header">
          <h2>MEDIFLOW</h2>
          <span>Clinical OS</span>
        </div>

        <ul className="nav-list">
          {/* Health Hub */}
          <li
            className={`nav-item ${activeTab === "Health Hub" ? "active" : ""}`}
            onClick={() => setActiveTab("Health Hub")}
          >
            <LayoutDashboard size={18} />
            <span>Health Hub</span>
          </li>

          {/* Appointments */}
          <li
            className={`nav-item ${activeTab === "Appointments" ? "active" : ""}`}
            onClick={() => setActiveTab("Appointments")}
          >
            <Calendar size={18} />
            <span>Appointments</span>
          </li>

          {/* My Records */}
          <li
            className={`nav-item ${activeTab === "My Records" ? "active" : ""}`}
            onClick={() => setActiveTab("My Records")}
          >
            <FileText size={18} />
            <span>My Records</span>
          </li>

          {/* Messages */}
          <li
            className={`nav-item ${activeTab === "Messages" ? "active" : ""}`}
            onClick={() => setActiveTab("Messages")}
          >
            <MessageSquare size={18} />
            <span>Messages</span>
          </li>

          {/* Billing & Insurance */}
          <li
            className={`nav-item ${activeTab === "Billing & Insurance" ? "active" : ""}`}
            onClick={() => setActiveTab("Billing & Insurance")}
          >
            <CreditCard size={18} />
            <span>Billing & Insurance</span>
          </li>

          <hr style={{ margin: "0.75rem 0", borderColor: "#e2e8f0" }} />

          {/* Switch to Doctor View Route */}
          <NavLink
            to="/doctor"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            style={{ textDecoration: "none" }}
          >
            <ArrowLeftRight size={18} />
            <span>Switch to Doctor View</span>
          </NavLink>
        </ul>

        <div className="user-profile-bottom">
          <div className="avatar-circle">{name[0]}</div>
          <div>
            <p style={{ fontSize: "0.85rem", fontWeight: 600 }}>
              {name}
            </p>
            <p style={{ fontSize: "0.75rem", color: "#64748b" }}>
              MRN: #284-092-04
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Frame */}
      <main className="main-content">
        {/* Teal Header Banner */}
        <div className="welcome-banner teal">
          <div>
            <h1>Hello, {name}</h1>
            <p>
              Your recovery is on track. Remember to log your morning vitals
              before 10:00 AM today.
            </p>
          </div>
          <span
            className="badge"
            style={{ background: "rgba(255,255,255,0.2)", color: "white" }}
          >
            Care Plan Active
          </span>
        </div>

        <div className="dashboard-split">
          {/* Main Left Section */}
          <div>
            <div className="card">
              <div className="card-header">
                <span className="card-title">Scheduled Medical Visits</span>
              </div>
              <div className="doctor-card-grid">
                <div className="doctor-card">
                  <div
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      alignItems: "center",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <div className="avatar-circle">SJ</div>
                    <div>
                      <strong>Dr. Sarah Jenkins</strong>
                      <p style={{ fontSize: "0.75rem", color: "#64748b" }}>
                        Cardiology & Vascular
                      </p>
                    </div>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    <Calendar size={18} />
                    <span>Calendar</span>
                  </p>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "#64748b",
                      marginBottom: "1rem",
                    }}
                  >
                    <Hospital size={18} />
                    <span>ROOM 94 block C</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowPreRegisterForm(true)}
                    style={{
                      width: "100%",
                      padding: "0.4rem",
                      background: "#f1f5f9",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Pre-Register Form
                  </button>
                </div>

                <div className="doctor-card">
                  <div
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      alignItems: "center",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <div className="avatar-circle">AV</div>
                    <div>
                      <strong>Dr. Aris Vance</strong>
                      <p style={{ fontSize: "0.75rem", color: "#64748b" }}>
                        General Endocrinology
                      </p>
                    </div>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    <Calendar size={18} />
                    <span>Calendar</span>
                  </p>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "#64748b",
                      marginBottom: "1rem",
                    }}
                  >
                    <Hospital size={18} />
                    <span>ROOM 103 block A</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowPreRegisterForm(true)}
                    style={{
                      width: "100%",
                      padding: "0.4rem",
                      background: "#f1f5f9",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Pre-Register Form
                  </button>
                </div>
              </div>
            </div>

            {showPreRegisterForm && (
              <PreRegisterForm
                onClose={() => setShowPreRegisterForm(false)}
                onSuccess={() => setShowPreRegisterForm(false)}
              />
            )}

            <div className="card">
              <span className="card-title">Recent Care Activity</span>
              <ul
                style={{
                  listStyle: "none",
                  marginTop: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <li
                  style={{
                    paddingBottom: "0.75rem",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  <strong>Lab Results Released</strong>
                  <p style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    Comprehensive Metabolic Panel - All values within normal
                    baseline ranges.
                  </p>
                </li>
                <li
                  style={{
                    paddingBottom: "0.75rem",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  <strong>Prescription Refilled</strong>
                  <p style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    Lisinopril 10mg - Available for pickup at Aegis Pharmacy.
                  </p>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Sidebar Section */}
          <div>
            <div
              className="card"
              style={{ background: "#fffbe1", borderColor: "#fef08a" }}
            >
              <span
                className="card-title"
                style={{ color: "#854d0e", fontSize: "0.85rem" }}
              >
                Upcoming Procedure
              </span>
              <h3 style={{ marginTop: "0.5rem", fontSize: "1.1rem" }}>
                Diagnostic Cardiac Catheterization
              </h3>
              <p
                style={{
                  fontSize: "0.8rem",
                  margin: "0.5rem 0 1rem 0",
                  color: "#854d0e",
                }}
              >
                Surgeon: Dr. Sarah Jenkins
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <strong>{futureDate}</strong>
                <span className="badge badge-confirmed">Confirmed</span>
              </div>
            </div>

            <div className="card">
              <span className="card-title">Need Assistance?</span>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#64748b",
                  marginTop: "0.5rem",
                }}
              >
                On-Call Nurse Hotline
              </p>
              <p
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  color: "#0d9488",
                  margin: "0.25rem 0",
                }}
              >
                +1 (800) 555-0199
              </p>
              <p style={{ fontSize: "0.8rem", color: "#64748b" }}>
                Emergency Room Location:
                <br />
                North Pavilion, Entrance 2
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
