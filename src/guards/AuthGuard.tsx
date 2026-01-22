import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SplashScreen from "../components/ui/SplashScreen";

export const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isCustomLoading } = useAuth();
  const location = useLocation();
  
  if (isCustomLoading) {
    return <SplashScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
