import axios from "axios";

// Use env variable OR fallback to empty string (same origin)
const API_BASE = import.meta.env.VITE_API_URL || "";

// Create axios instance
export const api = axios.create({
  baseURL: `${API_BASE}`,
});

// Attach JWT if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// AUTH
export const loginRequest = (email, password) =>
    api.post("/employees/login", { email, password });

export const signupRequest = (payload) =>
    api.post("/employees/signup", payload);

// EMPLOYEES
export const getEmployees = () => api.get("/employees");
export const getEmployee = (id) => api.get(`/employees/${id}`);
export const createEmployee = (data) => api.post("/employees", data);
export const updateEmployee = (id, data) => api.put(`/employees/${id}`, data);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);
export const getEmployeeTasks = (id) => api.get(`/employees/${id}/tasks`);

// TASKS
export const getTasks = () => api.get("/tasks");
export const getTask = (id) => api.get(`/tasks/${id}`);
export const createTask = (data) => api.post("/tasks", data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
export const getTaskWorkflows = (id) => api.get(`/tasks/${id}/workflows`);
export const changeTaskStatus = (payload) => api.put("/tasks/status", payload);
