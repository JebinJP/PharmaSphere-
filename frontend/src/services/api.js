import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const getInventory = () => api.get('/inventory');
export const addMedicine = (data) => api.post('/inventory', data);
export const updateMedicine = (id, data) => api.put(`/inventory/${id}`, data);
export const deleteMedicine = (id) => api.delete(`/inventory/${id}`);
export const importInventory = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/inventory/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

// Sales & Forecast
export const uploadPrescription = (formData) => api.post('/prescriptions/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const getPrescriptions = () => api.get('/prescriptions');
export const getForecast = (id) => api.get(`/sales/forecast/${id}`);
export const chatWithBot = (message) => api.post('/chat', { message });
export const getDashboardStats = () => api.get('/dashboard/stats');
export const recordSale = (data) => api.post('/sales', data);

export default api;
