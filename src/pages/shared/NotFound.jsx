import { Link } from 'react-router-dom';
import { IconSearch } from '../../components/icons.jsx';

export default function NotFound() {
  return (
    <div className="status-shell">
      <div className="status-code">ERROR 404</div>
      <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22, color: 'var(--slate-400)' }}>
        <IconSearch width={26} height={26} />
      </div>
      <h1>We couldn't find that page</h1>
      <p>The screen you're looking for doesn't exist, or may have moved.</p>
      <Link to="/" className="btn btn-primary">Back to Mediflow</Link>
    </div>
  );
}
