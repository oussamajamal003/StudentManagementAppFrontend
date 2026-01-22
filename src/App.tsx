import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
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
