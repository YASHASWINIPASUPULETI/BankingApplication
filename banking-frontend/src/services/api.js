import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Customer APIs ───────────────────────────────────────────────
export const customerAPI = {
  getAll: () => api.get('/api/customers'),
  getById: (id) => api.get(`/api/customers/${id}`),
  create: (data) => api.post('/api/customers', data),
  update: (id, data) => api.put(`/api/customers/${id}`, data),
  delete: (id) => api.delete(`/api/customers/${id}`),
};

// ─── Account APIs ────────────────────────────────────────────────
export const accountAPI = {
  getAll: () => api.get('/api/accounts'),
  getById: (id) => api.get(`/api/accounts/${id}`),
  create: (data) => api.post('/api/accounts', data),
  update: (id, data) => api.put(`/api/accounts/${id}`, data),
  delete: (id) => api.delete(`/api/accounts/${id}`),
};

// ─── Transaction APIs ─────────────────────────────────────────────
export const transactionAPI = {
  getAll: () => api.get('/api/transactions'),
  getById: (id) => api.get(`/api/transactions/${id}`),
  deposit: (data) => api.post('/api/transactions/deposit', data),
  withdraw: (data) => api.post('/api/transactions/withdraw', data),
  transfer: (data) => api.post('/api/transactions/transfer', data),
};

export default api;
