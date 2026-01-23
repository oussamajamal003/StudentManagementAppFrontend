import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { authApi } from "../api/auth.api";
import { useNotification } from "./NotificationContext";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isCustomLoading: boolean; // Initial auth check loading
  login: (token: string, user: User) => void;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCustomLoading, setIsCustomLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { showSuccess, showInfo } = useNotification();
  const location = useLocation();

  const checkAuth = async (isBackground = false) => {
    if (!isBackground) {
      setIsCustomLoading(true);
      // Artificial delay for splash screen (2 seconds) only on specific pages
      if (location.pathname === '/' || location.pathname === '/students') {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      if (isTokenExpired(token)) {
        // Token expired
        performLogout(false); // Silent logout if expired
      } else {
        setIsAuthenticated(true);
        setUser(JSON.parse(storedUser));
      }
    }

    if (!isBackground) {
      setIsCustomLoading(false);
    }
  };

  useEffect(() => {
    // Initial check
    checkAuth(false);

    // Set up interval to check token expiration every minute
    const interval = setInterval(() => checkAuth(true), 60000);

    // Listen for unauthorized events (401) from axios
    const handleAuthError = () => {
      performLogout(true); // Explicit logout on 401
    };
    window.addEventListener('auth:unauthorized', handleAuthError);

    return () => {
      clearInterval(interval);
      window.removeEventListener('auth:unauthorized', handleAuthError);
    };
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    setIsLoginModalOpen(false);
    showSuccess("Welcome back!", `Signed in as ${userData.username}`);
  };

  const performLogout = async (notify: boolean = true) => {
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
      setUser(null);
      setIsAuthenticated(false);
      if (notify) {
        showInfo("Signed out", "You have been successfully signed out.");
      }
    }
  };

  const logout = async () => {
    await performLogout(true);
  };

  const deleteAccount = async () => {
    try {
      await authApi.deleteAccount();
      await performLogout(false);
    } catch (error) {
      console.error("Delete account error:", error);
      throw error;
    }
  };
const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isCustomLoading, login, logout, deleteAccount, isLoginModalOpen, openLoginModal, closeLoginModal }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
