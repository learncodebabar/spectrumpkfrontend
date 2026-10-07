// src/api/authApi.js
import api from './config.js';

const authApi = {
    unifiedLogin: async (credentials) => {
        try {
            console.log("🔐 API - UNIFIED LOGIN");
            const response = await api.post('/unified-login', credentials);
            console.log("📥 Response:", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Unified Login Error:", error.response?.data);
            throw error;
        }
    }
};

export default authApi;