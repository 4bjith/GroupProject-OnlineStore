import axios from 'axios';

// Replace with your actual API URL
const baseURL = 'http://localhost:3000';

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth-storage')
            ? JSON.parse(localStorage.getItem('auth-storage')).state.token
            : null;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
