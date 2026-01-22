import { useEffect, type ReactNode } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Students from "./pages/Students";
import SplashScreen from "./components/ui/SplashScreen";
import { useAuth } from "./context/AuthContext";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isCustomLoading } = useAuth();
  const location = useLocation();
  
  if (isCustomLoading) {
    return <SplashScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default function App() {
  const { isCustomLoading } = useAuth();

  // Log Web Vitals
  useEffect(() => {
    // Simple mock Web Vitals logger or integrate real one
    console.log("App mounted - Web Vitals tracking initialized");
  }, []);

  if (isCustomLoading) {
    return <SplashScreen />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/students" 
            element={
              <ProtectedRoute>
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
