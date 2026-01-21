import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Students from "./pages/Students";
import { authApi } from "./api/auth.api";
import { authErrorEvent } from "./api/axiosClient";

interface User {
  id: number;
  username: string;
  email: string;
}
 
// Helper function to check if JWT token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expirationTime = payload.exp * 1000;
    return Date.now() >= expirationTime;
  } catch {
    return true;
  }
};

// Protected Route Component
const ProtectedRoute = ({ children, isLoggedIn }: { children: JSX.Element, isLoggedIn: boolean }) => {
  const location = useLocation();
  
  if (!isLoggedIn) {
    // Redirect to home, but we could also trigger the login modal if we had access to that state context
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Check authentication status on mount and set up token expiration check
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        if (isTokenExpired(token)) {
          // Token expired, logout
          handleLogout();
        } else {
          setIsLoggedIn(true);
        }
      } else {
        setIsLoggedIn(false);
      }
      setIsAuthChecking(false);
    };

    // Initial check
    checkAuth();

    // Set up interval to check token expiration every minute
    const interval = setInterval(checkAuth, 60000);

    // Listen for unauthorized events (401) from axios
    const handleAuthError = () => {
      handleLogout();
    };
    window.addEventListener('auth:unauthorized', handleAuthError);

    return () => {
      clearInterval(interval);
      window.removeEventListener('auth:unauthorized', handleAuthError);
    };
  }, []);

  const handleLogin = (token: string, userData: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await authApi.logout();
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    }
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar
        isLoggedIn={isLoggedIn}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/students" 
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Students />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}