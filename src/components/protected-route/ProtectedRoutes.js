import { Navigate } from "react-router-dom";
import { useIsAuthenticated, useHasHydrated } from "../config/store/authStore";

/**
 * ProtectedRoute Component
 * Prevents flicker by waiting for hydration before checking auth
 */
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();
  const hasHydrated = useHasHydrated();

  // ✅ Wait for hydration to complete
  if (!hasHydrated) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // ✅ Now check authentication
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default ProtectedRoute;