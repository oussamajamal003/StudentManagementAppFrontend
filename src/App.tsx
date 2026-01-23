import { useEffect, useState, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Students from "./pages/Students";
import Unauthorized from "./pages/Unauthorized";
import SplashScreen from "./components/ui/SplashScreen";
import { useAuth } from "./context/AuthContext";
import { RoleGuard } from "./guards/RoleGuard";

export default function App() {
  const { isCustomLoading } = useAuth();
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);
  const isFirstRender = useRef(true);

  // Handle splash screen on navigation
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (location.pathname === '/' || location.pathname === '/students') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsNavigating(true);
      const timer = setTimeout(() => {
        setIsNavigating(false);
      }, 1000); // 1 second splash for navigation

      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  // Log Web Vitals
  useEffect(() => {
    // Simple mock Web Vitals logger or integrate real one
    console.log("App mounted - Web Vitals tracking initialized");
  }, []);

  if (isCustomLoading || isNavigating) {
    return <SplashScreen />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route 
            path="/students" 
            element={
              <RoleGuard allowedRoles={['admin']}>
                <Students />
              </RoleGuard>
            } 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
