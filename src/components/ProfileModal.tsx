import { useState } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import ConfirmationModal from './ui/ConfirmationModal';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, deleteAccount } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      if (deleteAccount) {
        await deleteAccount();
        showSuccess("Account deleted", "Your account has been successfully deleted.");
        // Logout or redirect is handled by deleteAccount/AuthContext usually, but close modal to be safe
        onClose();
      } else {
         console.error("deleteAccount function not available");
      }
    } catch (error) {
      showError("Delete failed", "Could not delete account. Please try again.");
      console.error(error);
      setIsDeleting(false);
      setIsDeleteConfirmOpen(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="My Profile">
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center p-4">
             <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-lg ring-4 ring-indigo-50 dark:ring-indigo-900/30">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{user.username}</h3>
             <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{user.email}</p>
             <div className="mt-3">
               <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 uppercase tracking-wide">
                 Admin
               </span>
             </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-200 mb-3 uppercase tracking-wider text-xs">Danger Zone</h4>
            <div className="rounded-xl bg-red-50 dark:bg-red-900/10 p-4 border border-red-100 dark:border-red-900/30 flex items-center justify-between transition-colors hover:bg-red-100/50 dark:hover:bg-red-900/20">
              <div>
                <p className="text-sm font-medium text-red-900 dark:text-red-200">Delete Account</p>
                <p className="text-xs text-red-700/70 dark:text-red-300/70 mt-1">
                  Permanently delete your account and all data.
                </p>
              </div>
              <Button 
                variant="danger" 
                onClick={() => setIsDeleteConfirmOpen(true)}
                className="shrink-0 ml-4 px-3 py-1.5 text-xs"
              >
                Delete
              </Button>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="secondary" onClick={onClose} className="w-full sm:w-auto">
              Close
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Account?"
        message="Are you sure you want to permanently delete your account? This action cannot be undone."
        confirmText={isDeleting ? "Deleting..." : "Yes, Delete Account"}
        isDestructive={true}
      />
    </>
  );
}
