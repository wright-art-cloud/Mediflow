import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Wraps a portal's routes. `allow` is the list of roles permitted here —
 * e.g. ['patient'] for the patient portal, ['staff', 'admin'] for hospital
 * screens. Signed-out users go to /login; signed-in users with the wrong
 * role go to /403 rather than silently redirecting into their own portal,
 * so a mis-typed URL is visibly rejected instead of quietly working around it.
 */
export default function ProtectedRoute({ allow, children }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!allow.includes(role)) return <Navigate to="/403" replace />;
  return children;
}
