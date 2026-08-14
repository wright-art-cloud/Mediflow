import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { IconShield } from '../../components/icons.jsx';

export default function Unauthorized() {
  const { role } = useAuth();
  const home = role === 'patient' ? '/patient/health-hub' : role ? '/hospital/dashboard' : '/login';

  return (
    <div className="status-shell">
      <div className="status-code" style={{ color: 'var(--rose-700)', background: 'var(--rose-50)', borderColor: 'var(--rose-100)' }}>ERROR 403</div>
      <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--rose-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22, color: 'var(--rose-600)' }}>
        <IconShield width={26} height={26} />
      </div>
      <h1>You don't have access to this screen</h1>
      <p>This area is restricted to a different account role. If you believe this is a mistake, contact your administrator.</p>
      <Link to={home} className="btn btn-primary">Back to my dashboard</Link>
    </div>
  );
}
