import axiosClient from "./axiosClient";

export interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  age: number;
  created_at: string;
  updated_at: string;
}

export interface CreateStudentPayload {
  first_name: string;
  last_name: string;
  email: string;
  age: number;
}

export interface UpdateStudentPayload {
  first_name: string;
  last_name: string;
  email: string;
  age: number;
}

export const studentsApi = {
  getAll: async () => {
    const response = await axiosClient.get<{ students: Student[] }>("/students");
    return response.data.students;
  },

  getById: async (id: number) => {
    const response = await axiosClient.get<Student>(`/students/${id}`);
    return response.data;
  },

  create: async (data: CreateStudentPayload) => {
    const response = await axiosClient.post<{ message: string; student: Student }>("/students", data);
    return response.data;
  },

  update: async (id: number, data: UpdateStudentPayload) => {
    const response = await axiosClient.put<{ student: Student }>(`/students/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await axiosClient.delete(`/students/${id}`);
    return response.data;
  },
};
