import { useEffect } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

export const Toast = ({ toast, onDismiss }: ToastProps) => {
  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        onDismiss(toast.id);
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast, onDismiss]);

  const bgColors = {
    success: "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800",
    error: "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800",
    warning: "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800",
    info: "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800",
  };

  const iconColors = {
    success: "text-green-500 dark:text-green-400",
    error: "text-red-500 dark:text-red-400",
    warning: "text-yellow-500 dark:text-yellow-400",
    info: "text-blue-500 dark:text-blue-400",
  };

  const icons = {
    success: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <div 
      className={`flex items-start p-4 mb-3 border rounded-xl shadow-lg transform transition-all duration-300 animate-in slide-in-from-right-8 fade-in ${bgColors[toast.type]}`}
      role="alert"
    >
      <div className={`flex-shrink-0 ${iconColors[toast.type]}`}>
        {icons[toast.type]}
      </div>
      <div className="ml-3 w-0 flex-1 pt-0.5">
        <h3 className={`text-sm font-medium ${iconColors[toast.type]}`}>{toast.title}</h3>
        {toast.message && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{toast.message}</p>
        )}
      </div>
      <div className="ml-4 flex-shrink-0 flex">
        <button
          className="bg-transparent rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
          onClick={() => onDismiss(toast.id)}
        >
          <span className="sr-only">Close</span>
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};
