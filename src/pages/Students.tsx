import { useState, useEffect, useMemo, useCallback } from "react";
import { studentsApi } from "../api/students.api";
import type { Student } from "../api/students.api";
import Button from "../components/ui/Button";
import StudentTable from "../components/students/StudentTable";
import StudentModals from "../components/students/StudentModals";
import { useNotification } from "../context/NotificationContext";
import { AxiosError } from "axios";

export default function Students() {
  const { showSuccess, showError } = useNotification();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    age: ""
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch Data
  const fetchStudents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Artificial delay for smoother UX (Skeleton showcase)
      await new Promise(resolve => setTimeout(resolve, 800));
      const data = await studentsApi.getAll();
      setStudents(data);
    } catch (err: unknown) {
       let msg = "Failed to fetch students";
       if (err instanceof Error) msg = err.message;
       setError(msg);
       console.error(err);
       showError("Fetch Failed", "Could not load students.");
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Filtering & Pagination Logic
  const filteredStudents = useMemo(() => {
    if (!searchQuery) return students;
    const lowerQuery = searchQuery.toLowerCase();
    return students.filter(student => 
      student.first_name.toLowerCase().includes(lowerQuery) ||
      student.last_name.toLowerCase().includes(lowerQuery) ||
      student.email.toLowerCase().includes(lowerQuery) ||
      student.id.toString().includes(lowerQuery)
    );
  }, [students, searchQuery]);

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredStudents, currentPage]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  // Handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to page 1 on search
  };

  const resetForm = () => {
    setFormData({ first_name: "", last_name: "", email: "", age: "" });
    setFormError(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreateOpen(true);
  };

  const openEditModal = (student: Student) => {
    setSelectedStudent(student);
    setFormData({
      first_name: student.first_name,
      last_name: student.last_name,
      email: student.email,
      age: student.age.toString()
    });
    setFormError(null);
    setIsEditOpen(true);
  };

  const openViewModal = (student: Student) => {
    setSelectedStudent(student);
    setIsViewOpen(true);
  };

  const openDeleteModal = (student: Student) => {
    setSelectedStudent(student);
    setIsDeleteOpen(true);
  };

  // CRUD Actions
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    
    try {
      // Artificial delay for form submission
      await new Promise(resolve => setTimeout(resolve, 800));
      await studentsApi.create({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        age: parseInt(formData.age)
      });
      await fetchStudents();
      setIsCreateOpen(false);
      resetForm();
      showSuccess("Student Added", "The new student has been successfully created.");
    } catch (err: unknown) {
      let errorMessage = "Failed to create student";
      if (err instanceof AxiosError && err.response?.data?.error) {
         errorMessage = err.response.data.error;
      } else if (err instanceof Error) {
         errorMessage = err.message;
      }
      setFormError(errorMessage);
      showError("Creation Failed", errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    setFormLoading(true);
    setFormError(null);

    try {
      // Artificial delay for form submission
      await new Promise(resolve => setTimeout(resolve, 800));
      await studentsApi.update(selectedStudent.id, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        age: parseInt(formData.age)
      });
      await fetchStudents();
      setIsEditOpen(false);
      resetForm();
      showSuccess("Student Updated", "Student details have been updated.");
    } catch (err: unknown) {
      let errorMessage = "Failed to update student";
      if (err instanceof AxiosError && err.response?.data?.error) {
         errorMessage = err.response.data.error;
      } else if (err instanceof Error) {
         errorMessage = err.message;
      }
      setFormError(errorMessage);
      showError("Update Failed", errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedStudent) return;
    setFormLoading(true); // Re-using state for delete loading

    try {
      // Artificial delay
      await new Promise(resolve => setTimeout(resolve, 800));
      await studentsApi.delete(selectedStudent.id);
      
      // Update local state immediately for better UX
      setStudents(prev => prev.filter(s => s.id !== selectedStudent.id));
      
      // Adjust pagination if necessary (e.g., if deleted last item on last page)
      const newTotal = filteredStudents.length - 1;
      const newTotalPages = Math.ceil(newTotal / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
      
      setIsDeleteOpen(false);
      showSuccess("Student Deleted", "The student record has been permanently removed.");
    } catch (err: unknown) {
      // If fails, refetch to ensure sync
      console.error(err);
      showError("Delete Failed", "Could not delete student.");
      await fetchStudents();
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Student Directory</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your organization's student records</p>
          </div>
          <Button onClick={openCreateModal} className="shadow-lg shadow-indigo-500/20">
            <svg className="w-5 h-5 mr-2 -ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Student
          </Button>
        </div>

        {/* Filters & Search */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6 transition-colors duration-300">
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Table Section */}
        <StudentTable
          students={paginatedStudents}
          isLoading={isLoading}
          error={error}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredStudents.length}
          totalPages={totalPages}
          searchQuery={searchQuery}
          onPageChange={setCurrentPage}
          onView={openViewModal}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          onOpenCreate={openCreateModal}
          fetchStudents={fetchStudents}
        />
      </div>
    
      {/* --- MODALS --- */}
      <StudentModals
        isCreateOpen={isCreateOpen} setIsCreateOpen={setIsCreateOpen}
        isEditOpen={isEditOpen} setIsEditOpen={setIsEditOpen}
        isViewOpen={isViewOpen} setIsViewOpen={setIsViewOpen}
        isDeleteOpen={isDeleteOpen} setIsDeleteOpen={setIsDeleteOpen}
        selectedStudent={selectedStudent} openEditModal={openEditModal}
        formData={formData} setFormData={setFormData}
        handleCreate={handleCreate} handleUpdate={handleUpdate} handleDelete={handleDelete}
        formLoading={formLoading} formError={formError}
      />
    </div>
  );
}
