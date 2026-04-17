import axios from "axios";
import logger from "../utils/logger.js";
import authStore from "../AuthStore";

const api = axios.create({
    baseURL: "http://localhost:4000",
})

// Request interceptor for logging
api.interceptors.request.use(
    (config) => {
        logger.api(config.method?.toUpperCase(), config.url, {
            data: config.data,
            params: config.params,
        });
        return config;
    },
    (error) => {
        logger.error('API Request Error', error);
        return Promise.reject(error);
    }
);

// Response interceptor for logging and session handling
api.interceptors.response.use(
    (response) => {
        logger.apiSuccess(response.config.method?.toUpperCase(), response.config.url, {
            status: response.status,
            data: response.data,
        });
        return response;
    },
    (error) => {
        logger.apiError(
            error.config?.method?.toUpperCase() || 'UNKNOWN',
            error.config?.url || 'UNKNOWN',
            error.response?.data || error.message
        );

        // Handle 401 errors - session invalidation
        if (error.response?.status === 401) {
            const errorMessage = error.response?.data?.message || "Session expired";
            
            // Clear token from store
            authStore.getState().removeToken();
            
            // Only redirect if not already on login/register page
            const currentPath = window.location.pathname;
            if (currentPath !== '/login' && currentPath !== '/register') {
                // Store the message to display on login page
                sessionStorage.setItem('sessionMessage', errorMessage);
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;