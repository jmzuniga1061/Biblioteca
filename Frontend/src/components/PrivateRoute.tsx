import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactElement } from "react";

interface PrivateRouteProps {
  children: ReactElement;
  allowedRoles?: Array<string>;
}

export default function PrivateRoute({ children, allowedRoles }: PrivateRouteProps) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const has = auth.user?.role ? allowedRoles.includes(auth.user.role) : false;
    if (!has) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}
