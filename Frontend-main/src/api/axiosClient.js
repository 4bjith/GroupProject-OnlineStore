import axios from "axios";
import logger from "../utils/logger.js";

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

// Response interceptor for logging
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
        return Promise.reject(error);
    }
);

export default api;