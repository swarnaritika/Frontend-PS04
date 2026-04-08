import axios from "axios";

const isDev = import.meta.env.DEV;
const api = axios.create({
  baseURL: isDev ? "http://localhost:8084/api/v1" : "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
};

export const driveApi = {
  getAll: () => api.get("/drives"),
  getById: (id) => api.get(`/drives/${id}`),
  create: (data) => api.post("/drives", data),
  update: (id, data) => api.put(`/drives/${id}/status`, data),
  delete: (id) => api.delete(`/drives/${id}`),
};

export const donationApi = {
  getAll: () => api.get("/donations"),
  getById: (id) => api.get(`/donations/${id}`),
  create: (data) => api.post("/donations", data),
  update: (id, data) => api.put(`/donations/${id}`, data),
  delete: (id) => api.delete(`/donations/${id}`),
};

export const requestApi = {
  getAll: () => api.get("/requests"),
  getById: (id) => api.get(`/requests/${id}`),
  create: (data) => api.post("/requests", data),
  update: (id, data) => api.put(`/requests/${id}`, data),
  delete: (id) => api.delete(`/requests/${id}`),
};

export const deliveryApi = {
  getAll: () => api.get("/deliveries"),
  create: (data) => api.post("/deliveries", data),
  update: (id, data) => api.put(`/deliveries/${id}/status`, data),
};

export const statsApi = {
  getOverview: () => api.get("/stats"),
};

export const chatApi = {
  sendMessage: (messages) => api.post("/chat", { messages }),
};

export default api;