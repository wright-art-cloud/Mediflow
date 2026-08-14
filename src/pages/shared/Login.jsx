import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { IconCross } from '../../components/icons.jsx';

// Every seeded user shares this placeholder password (see seed.js / authService.js
// comments — there's no real hashing in this front-end-only demo). Defaulting
// the form to a real seeded account means "Sign in" actually works out of the box.
const DEMO = {
  patient: { email: 'samuel.mutiso@mediflow.dev', password: 'hashed_placeholder_pw' },
  staff: { email: 'j.mwangi@mediflow.dev', password: 'hashed_placeholder_pw' },
};

export default function Login() {
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const [roleTab, setRoleTab] = useState('patient');
  const [email, setEmail] = useState(DEMO.patient.email);
  const [password, setPassword] = useState(DEMO.patient.password);

  function switchTab(tab) {
    setRoleTab(tab);
    setEmail(DEMO[tab].email);
    setPassword(DEMO[tab].password);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const user = login(email, password);
    if (!user) return;
    navigate(user.role === 'patient' ? '/patient/health-hub' : '/hospital/dashboard', { replace: true });
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-mark"><IconCross /></div>
          <div className="logo-text"><strong>Mediflow</strong><span>Clinical OS</span></div>
        </div>

        <h1>Welcome back</h1>
        <p>Sign in to continue to your dashboard.</p>

        <div className="role-toggle">
          <button type="button" className={roleTab === 'patient' ? 'active' : ''} onClick={() => switchTab('patient')}>Patient</button>
          <button type="button" className={roleTab === 'staff' ? 'active' : ''} onClick={() => switchTab('staff')}>Hospital staff</button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="form-error">{error}</div>}

          <div className="field">
            <label htmlFor="email">Email address</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="btn btn-primary btn-block">Sign in</button>
        </form>

        <div className="auth-foot">
          Demo credentials are pre-filled — every seeded account uses the same placeholder password.
        </div>
      </div>
    </div>
  );
}
