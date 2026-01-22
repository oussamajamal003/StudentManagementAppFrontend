import { type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: ReactNode; 
}

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children 
}: ModalProps) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto overflow-x-hidden p-4 sm:p-6" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-lg transform rounded-2xl bg-white dark:bg-gray-800 p-6 text-left shadow-2xl transition-all border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="rounded-full p-1 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
