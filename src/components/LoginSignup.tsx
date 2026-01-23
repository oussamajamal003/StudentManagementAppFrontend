import { useState } from "react";
import { authApi } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { AxiosError } from "axios";

interface LoginSignupProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "login" | "signup";
  
export default function LoginSignup({ isOpen, onClose }: LoginSignupProps) {
  const { login } = useAuth();
  const { showError } = useNotification();
  
  const [activeTab, setActiveTab] = useState<TabType>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup form state
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  const resetForms = () => {
    setLoginEmail("");
    setLoginPassword("");
    setSignupUsername("");
    setSignupEmail("");
    setSignupPassword("");
    setSignupConfirmPassword("");
    setGlobalError(null);
    setFieldErrors({});
  };

  const handleClose = () => {
    resetForms();
    onClose();
  };

  const validateLogin = () => {
    const errors: { [key: string]: string } = {};
    if (!loginEmail) errors.loginEmail = "Email is required";
    if (!loginPassword) errors.loginPassword = "Password is required";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateSignup = () => {
    const errors: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!signupUsername.trim()) {
      errors.signupUsername = "Username is required";
    } else if (signupUsername.trim().length < 3) {
      errors.signupUsername = "Username must be at least 3 characters";
    }

    if (!signupEmail.trim()) {
      errors.signupEmail = "Email is required";
    } else if (!emailRegex.test(signupEmail)) {
      errors.signupEmail = "Please provide a valid email";
    }

    if (!signupPassword) {
      errors.signupPassword = "Password is required";
    } else if (signupPassword.length < 6) {
      errors.signupPassword = "Password must be at least 6 characters";
    }

    if (signupPassword !== signupConfirmPassword) {
      errors.signupConfirmPassword = "Passwords do not match";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null);
    
    if (!validateLogin()) return;

    setIsLoading(true);

    try {
      const data = await authApi.login(loginEmail, loginPassword);
      
      const user = {
        id: data.user.user_id || data.user.id,
        username: data.user.username,
        email: data.user.email,
        role: data.user.role
      };

      // Use auth context login
      login(data.token, user);
      resetForms();
      onClose();
    } catch (err: unknown) {
      let msg = "Login failed";
      if (err instanceof AxiosError && err.response?.data?.error) {
         msg = err.response.data.error;
      } else if (err instanceof Error) {
         msg = err.message;
      }
      setGlobalError(msg);
      showError("Login Failed", msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null);

    if (!validateSignup()) return;

    setIsLoading(true);

    try {
      const data = await authApi.signup({
        username: signupUsername.trim(),
        email: signupEmail.trim(),
        password: signupPassword,
      });

      const user = {
        id: data.user.user_id || data.user.id,
        username: data.user.username,
        email: data.user.email,
        role: data.user.role
      };

      login(data.token, user);
      resetForms();
      onClose();
    } catch (err: unknown) {
      let errorMessage = "Signup failed";
      
      if (err instanceof AxiosError && err.response?.data?.error) {
        const serverError = err.response.data.error;
        
        if (serverError === "User already exists") {
          errorMessage = "An account with this email already exists. Please use a different email or try logging in.";
        } else if (serverError === "Username already exists") {
          errorMessage = "This username is already taken. Please choose a different username.";
        } else if (serverError.includes("Internal server error")) {
          // Check if it's likely a unique username constraint violation
          if (err.response.data.details && err.response.data.details.includes("username")) {
            errorMessage = "This username is already taken. Please choose a different username.";
          } else {
            errorMessage = "Something went wrong on our end. Please try again later.";
          }
        } else {
          errorMessage = serverError;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setGlobalError(errorMessage);
      showError("Signup Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md transform rounded-2xl bg-white dark:bg-gray-800 p-8 text-left shadow-2xl transition-all sm:my-8 animate-in fade-in zoom-in duration-200 border border-gray-100 dark:border-gray-700">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <span className="sr-only">Close</span>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
            <svg className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="mt-4 text-2xl font-bold leading-6 text-gray-900 dark:text-white">
            {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {activeTab === 'login' ? 'Sign in to access your dashboard' : 'Get started with your free account'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-lg bg-gray-100 dark:bg-gray-700 p-1 mb-6">
          <button
            onClick={() => { setActiveTab('login'); setGlobalError(null); setFieldErrors({}); }}
            className={`flex-1 rounded-md py-2.5 text-sm font-medium transition-all ${
              activeTab === 'login'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setActiveTab('signup'); setGlobalError(null); setFieldErrors({}); }}
            className={`flex-1 rounded-md py-2.5 text-sm font-medium transition-all ${
              activeTab === 'signup'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Global Error Message */}
        {globalError && (
          <div className="mb-4 rounded-md bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">{globalError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Forms */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  disabled={isLoading}
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className={`block w-full rounded-lg border ${fieldErrors.loginEmail ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 sm:text-sm transition-all disabled:opacity-60`}
                  placeholder="john.doe@example.com"
                />
                {fieldErrors.loginEmail && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.loginEmail}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  disabled={isLoading}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className={`block w-full rounded-lg border ${fieldErrors.loginPassword ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 sm:text-sm transition-all disabled:opacity-60`}
                  placeholder="Enter your password"
                />
                {fieldErrors.loginPassword && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.loginPassword}</p>}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-lg border border-transparent bg-indigo-600 py-3 px-4 text-sm font-medium text-white shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  disabled={isLoading}
                  value={signupUsername}
                  onChange={(e) => setSignupUsername(e.target.value)}
                  className={`block w-full rounded-lg border ${fieldErrors.signupUsername ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 sm:text-sm transition-all disabled:opacity-60`}
                  placeholder="Choose a username"
                />
                {fieldErrors.signupUsername && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.signupUsername}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  disabled={isLoading}
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className={`block w-full rounded-lg border ${fieldErrors.signupEmail ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 sm:text-sm transition-all disabled:opacity-60`}
                  placeholder="john.doe@example.com"
                />
                {fieldErrors.signupEmail && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.signupEmail}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="signup-password"
                  name="password"
                  type="password"
                  disabled={isLoading}
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className={`block w-full rounded-lg border ${fieldErrors.signupPassword ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 sm:text-sm transition-all disabled:opacity-60`}
                  placeholder="Create a strong password"
                />
                {fieldErrors.signupPassword && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.signupPassword}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  disabled={isLoading}
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  className={`block w-full rounded-lg border ${fieldErrors.signupConfirmPassword ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 sm:text-sm transition-all disabled:opacity-60`}
                  placeholder="Confirm your password"
                />
                {fieldErrors.signupConfirmPassword && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.signupConfirmPassword}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-lg border border-transparent bg-indigo-600 py-3 px-4 text-sm font-medium text-white shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
