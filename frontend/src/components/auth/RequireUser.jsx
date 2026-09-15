import { Navigate, useLocation } from 'react-router-dom';
import { isUserAuthenticated } from '../../services/userAuthService.js';

/**
 * Route guard for the visa application flow. Checks for a valid, unexpired user
 * session token — issued by the API layer (mock or real backend), no credential
 * check here. Mirrors components/admin/RequireAdmin.jsx for the applicant side.
 * Preserves the originally requested URL so Login can return the user to it.
 */
export default function RequireUser({ children }) {
  const location = useLocation();
  if (!isUserAuthenticated()) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }
  return children;
}
