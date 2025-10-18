import axios from 'axios';

// Use environment variable for production or localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Departments API
export const departmentAPI = {
  getAll: () => api.get('/departments/'),
  getById: (id) => api.get(`/departments/${id}/`),
  create: (data) => api.post('/departments/', data),
  update: (id, data) => api.put(`/departments/${id}/`, data),
  delete: (id) => api.delete(`/departments/${id}/`),
};

// Rooms API
export const roomAPI = {
  getAll: (params) => api.get('/rooms/', { params }),
  getById: (id) => api.get(`/rooms/${id}/`),
  create: (data) => api.post('/rooms/', data),
  update: (id, data) => api.put(`/rooms/${id}/`, data),
  delete: (id) => api.delete(`/rooms/${id}/`),
  getAvailability: (id) => api.get(`/rooms/${id}/availability/`),
  regenerateQR: (id) => api.post(`/rooms/${id}/qr-code/regenerate/`),
};

// Schedules API
export const scheduleAPI = {
  getAll: (params) => api.get('/schedules/', { params }),
  getById: (id) => api.get(`/schedules/${id}/`),
  create: (data) => api.post('/schedules/', data),
  update: (id, data) => api.put(`/schedules/${id}/`, data),
  delete: (id) => api.delete(`/schedules/${id}/`),
  getTodaySchedule: () => api.get('/schedules/today/'),
  updateStatus: (id, status) => api.post(`/schedules/${id}/status/`, { status }),
  getRoomSchedule: (roomId, params) => api.get(`/rooms/${roomId}/schedule/`, { params }),
};

export default api;
