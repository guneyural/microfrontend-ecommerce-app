import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

interface ProtectedRouteProps {
  children: React.ReactNode;
  authOnly?: boolean;
  guestOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  authOnly,
  guestOnly,
}) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (authOnly && !isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (guestOnly && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
