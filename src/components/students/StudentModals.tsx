import React from 'react';
import { type Student } from '../../api/students.api';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface StudentModalsProps {
  isCreateOpen: boolean;
  setIsCreateOpen: (v: boolean) => void;
  isEditOpen: boolean;
  setIsEditOpen: (v: boolean) => void;
  isViewOpen: boolean;
  setIsViewOpen: (v: boolean) => void;
  isDeleteOpen: boolean;
  setIsDeleteOpen: (v: boolean) => void;
  selectedStudent: Student | null;
  openEditModal: (student: Student) => void;
  formData: {
    first_name: string;
    last_name: string;
    email: string;
    age: string;
  };
  setFormData: (data: {
    first_name: string;
    last_name: string;
    email: string;
    age: string;
  }) => void;
  handleCreate: (e: React.FormEvent) => void;
  handleUpdate: (e: React.FormEvent) => void;
  handleDelete: () => void;
  formLoading: boolean;
  formError: string | null;
}

const StudentModals = ({
  isCreateOpen, setIsCreateOpen,
  isEditOpen, setIsEditOpen,
  isViewOpen, setIsViewOpen,
  isDeleteOpen, setIsDeleteOpen,
  selectedStudent, openEditModal,
  formData, setFormData,
  handleCreate, handleUpdate, handleDelete,
  formLoading, formError
}: StudentModalsProps) => {

  return (
    <>
      {/* CREATE STUDENT MODAL */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Add New Student"
      >
        <form onSubmit={handleCreate} className="space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <Input
              label="First Name"
              value={formData.first_name}
              onChange={e => setFormData({...formData, first_name: e.target.value})}
              required
              placeholder="e.g. John"
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />
            <Input
              label="Last Name"
              value={formData.last_name}
              onChange={e => setFormData({...formData, last_name: e.target.value})}
              required
              placeholder="e.g. Doe"
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />
          </div>
          
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            required
            placeholder="john.doe@company.com"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />

          <Input
            label="Age"
            type="number"
            value={formData.age}
            onChange={e => setFormData({...formData, age: e.target.value})}
            required
            min="1"
            max="120"
            placeholder="e.g. 24"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-9a2 2 0 00-2-2H8a2 2 0 00-2 2v9h12z" />
              </svg>
            }
          />
          
          {formError && (
             <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm rounded-lg flex items-center">
               <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               {formError}
             </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={formLoading} className="px-6">
              {formLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : 'Create Student'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* EDIT STUDENT MODAL */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Student"
      >
        <form onSubmit={handleUpdate} className="space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <Input
              label="First Name"
              value={formData.first_name}
              onChange={e => setFormData({...formData, first_name: e.target.value})}
              required
              placeholder="e.g. John"
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />
            <Input
              label="Last Name"
              value={formData.last_name}
              onChange={e => setFormData({...formData, last_name: e.target.value})}
              required
              placeholder="e.g. Doe"
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />
          </div>
          
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            required
            placeholder="john.doe@company.com"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />

          <Input
            label="Age"
            type="number"
            value={formData.age}
            onChange={e => setFormData({...formData, age: e.target.value})}
            required
            min="1"
            max="120"
            placeholder="e.g. 24"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-9a2 2 0 00-2-2H8a2 2 0 00-2 2v9h12z" />
              </svg>
            }
          />

          {formError && (
             <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm rounded-lg flex items-center">
               <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               {formError}
             </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={formLoading} className="px-6">
              {formLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Student"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">{selectedStudent?.first_name} {selectedStudent?.last_name}</span>? 
            This action cannot be undone.
          </p>
          
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="secondary" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} disabled={formLoading}>
              {formLoading ? 'Deleting...' : 'Delete Student'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* VIEW DETAILS MODAL */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Student Details"
      >
        {selectedStudent && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-2xl">
                {selectedStudent.first_name[0]}{selectedStudent.last_name[0]}
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">{selectedStudent.first_name} {selectedStudent.last_name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">ID: {selectedStudent.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-tighter mb-1">Email Address</p>
                <p className="font-medium text-gray-900 dark:text-white break-all">{selectedStudent.email}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-tighter mb-1">Age</p>
                <p className="font-medium text-gray-900 dark:text-white">{selectedStudent.age} Years Old</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-tighter mb-1">Joined Date</p>
                <p className="font-medium text-gray-900 dark:text-white">{new Date(selectedStudent.created_at).toLocaleDateString()}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-tighter mb-1">Last Updated</p>
                <p className="font-medium text-gray-900 dark:text-white">{new Date(selectedStudent.updated_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="secondary" onClick={() => setIsViewOpen(false)}>Close</Button>
              <Button onClick={() => { setIsViewOpen(false); openEditModal(selectedStudent); }}>Edit Profile</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default StudentModals;
