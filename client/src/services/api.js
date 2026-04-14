import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to request headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired/invalid auth globally to avoid repeated fetch failures.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-logout'));
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// Job APIs
export const jobAPI = {
  getAllJobs: (filters) => api.get('/jobs', { params: filters }),
  getJobById: (id) => api.get(`/jobs/${id}`),
  createJob: (data) => api.post('/jobs', data),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  getRecruiterJobs: () => api.get('/jobs/recruiter/my-jobs'),
  getSearchSuggestions: (query) => api.get('/jobs/search/suggestions', { params: { query } }),
};

// Application APIs
export const applicationAPI = {
  applyJob: (formData) => api.post('/applications/apply', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getJobApplications: (jobId) => api.get(`/applications/job/${jobId}`),
  getUserApplications: (userId) => api.get(`/applications/user/${userId}`),
  updateApplicationStatus: (applicationId, status) =>
    api.put(`/applications/${applicationId}/status`, { status }),
};

// Saved Job APIs
export const savedJobAPI = {
  saveJob: (jobId) => api.post('/saved-jobs', { jobId }),
  getSavedJobs: (userId) => api.get(`/saved-jobs/${userId}`),
  deleteSavedJob: (jobId) => api.delete(`/saved-jobs/${jobId}`),
};

// User APIs
export const userAPI = {
  getUserProfile: () => api.get('/users/profile'),
  updateUserProfile: (data) => api.put('/users/profile', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getUserById: (userId) => api.get(`/users/${userId}`),
};

// Analytics APIs
export const analyticsAPI = {
  getRecruiterAnalytics: () => api.get('/analytics/recruiter'),
};

// Notification APIs
export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (notificationId) => api.delete(`/notifications/${notificationId}`),
};

export default api;
