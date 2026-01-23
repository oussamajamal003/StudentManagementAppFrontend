import { createContext, useContext, useState, type ReactNode, useCallback } from "react";
import { Toast, type ToastMessage, type ToastType } from "../components/ui/Toast";

interface NotificationContextType {
  toasts: ToastMessage[];
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message, duration: 5000 }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showSuccess = useCallback((title: string, message?: string) => addToast("success", title, message), [addToast]);
  const showError = useCallback((title: string, message?: string) => addToast("error", title, message), [addToast]);
  const showWarning = useCallback((title: string, message?: string) => addToast("warning", title, message), [addToast]);
  const showInfo = useCallback((title: string, message?: string) => addToast("info", title, message), [addToast]);

  return (
    <NotificationContext.Provider
      value={{ toasts, showSuccess, showError, showWarning, showInfo, removeToast }}
    >
      {children}
      
      {/* Toast Container */}
      <div 
        className="fixed top-0 right-0 p-6 z-50 w-full max-w-sm flex flex-col gap-2 pointer-events-none"
        aria-live="assertive"
      >
        <div className="flex flex-col gap-2 pointer-events-auto">
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
          ))}
        </div>
      </div>
    </NotificationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};
