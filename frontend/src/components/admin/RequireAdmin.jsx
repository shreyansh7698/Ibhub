import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../services/authService.js';

/**
 * Route guard for /admin/*. Checks for a valid, unexpired admin session token.
 * The session is issued by the API layer (mock or real backend) — there is no
 * credential check here. Production: also verify the token server-side on every
 * admin API call (httpApi already sends it as a Bearer header).
 */
export default function RequireAdmin({ children }) {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}
