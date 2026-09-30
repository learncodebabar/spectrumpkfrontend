// src/api/agentApi.js
import api from './config.js';

const agentApi = {
    // =============================================
    // AUTHENTICATION APIs
    // =============================================

    signup: async (formData) => {
        try {
            console.log("🔐 API - AGENT SIGN UP");
            const response = await api.post('/agent/signup', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            console.error("❌ Signup Error:", error.response?.data);
            throw error;
        }
    },

    verifyOTP: async (data) => {
        try {
            console.log("🔐 API - VERIFY OTP");
            const response = await api.post('/agent/verify-otp', data);
            return response.data;
        } catch (error) {
            console.error("❌ Verify OTP Error:", error.response?.data);
            throw error;
        }
    },

    resendOTP: async (data) => {
        try {
            const response = await api.post('/agent/resend-otp', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    login: async (credentials) => {
        try {
            console.log("🔐 API - AGENT LOGIN");
            const response = await api.post('/agent/login', credentials);
            return response.data;
        } catch (error) {
            console.error("❌ Login Error:", error.response?.data);
            throw error;
        }
    },

    // =============================================
    // PROFILE APIs
    // =============================================

    getProfile: async (token) => {
        try {
            const response = await api.get('/agent/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateProfile: async (id, data, token) => {
        try {
            const response = await api.put(`/agent/${id}`, data, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // =============================================
    // ⭐ CERTIFICATE APIs
    // =============================================

    getCertificate: async () => {
        try {
            console.log("🎓 API - GET CERTIFICATE");
            const token = localStorage.getItem('agentToken');
            const response = await api.get('/agent/certificate', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('❌ Certificate Error:', error.response?.data);
            throw error;
        }
    },

    getCertificateSettings: async () => {
        try {
            const response = await api.get('/certificate-settings/public');
            return response.data;
        } catch (error) {
            console.error('❌ Get Public Cert Settings:', error.response?.data);
            throw error;
        }
    },

    // ⭐ REQUEST RENEWAL
    requestRenewal: async (data = {}) => {
        try {
            console.log("🔄 API - REQUEST CERTIFICATE RENEWAL");
            const token = localStorage.getItem('agentToken');
            const response = await api.post('/agent/certificate/request-renewal', data, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('❌ Request Renewal Error:', error.response?.data);
            throw error;
        }
    },

    // =============================================
    // DROPDOWN APIs
    // =============================================

    getUniversities: async () => {
        try {
            console.log("🎓 API - GET UNIVERSITIES");
            const token = localStorage.getItem('agentToken');
            const response = await api.get('/agent/dropdowns/universities', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error("❌ Get Universities Error:", error.response?.data);
            throw error;
        }
    },

    getProgramsByUniversity: async (universityId) => {
        try {
            console.log("📚 API - GET PROGRAMS:", universityId);
            const token = localStorage.getItem('agentToken');
            const response = await api.get(`/agent/dropdowns/programs/${universityId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error("❌ Get Programs Error:", error.response?.data);
            throw error;
        }
    },

    // =============================================
    // APPLICATION APIs
    // =============================================

    createApplication: async (formData) => {
        try {
            console.log("📝 API - CREATE APPLICATION");
            const token = localStorage.getItem('agentToken');
            const response = await api.post('/agent/applications', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("❌ Create Application Error:", error.response?.data);
            throw error;
        }
    },

    getMyApplications: async () => {
        try {
            console.log("📋 API - GET MY APPLICATIONS");
            const token = localStorage.getItem('agentToken');
            const response = await api.get('/agent/applications', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error("❌ Get Applications Error:", error.response?.data);
            throw error;
        }
    },

    getApplicationById: async (id) => {
        try {
            const token = localStorage.getItem('agentToken');
            const response = await api.get(`/agent/applications/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateApplication: async (id, formData) => {
        try {
            const token = localStorage.getItem('agentToken');
            const response = await api.put(`/agent/applications/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteApplication: async (id) => {
        try {
            const token = localStorage.getItem('agentToken');
            const response = await api.delete(`/agent/applications/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getApplicationStats: async () => {
        try {
            const token = localStorage.getItem('agentToken');
            const response = await api.get('/agent/applications/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // =============================================
    // PAYMENTS
    // =============================================

    payments: {
        getAll: async (filters = {}) => {
            const token = localStorage.getItem('agentToken');
            const response = await api.get('/agent/payments', {
                headers: { 'Authorization': `Bearer ${token}` },
                params: filters
            });
            return response.data;
        },
        getStats: async () => {
            const token = localStorage.getItem('agentToken');
            const response = await api.get('/agent/payments/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        },
        getById: async (id) => {
            const token = localStorage.getItem('agentToken');
            const response = await api.get(`/agent/payments/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        },
        getMonthlySummary: async () => {
            const token = localStorage.getItem('agentToken');
            const response = await api.get('/agent/payments/monthly-summary', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        }
    },

    // =============================================
    // DASHBOARD
    // =============================================

    getDashboardStats: async () => {
        try {
            console.log("📊 API - AGENT DASHBOARD STATS");
            const token = localStorage.getItem('agentToken');
            const response = await api.get('/agent/dashboard/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('❌ Dashboard Error:', error.response?.data);
            throw error;
        }
    },

    // =============================================
    // UTILITY FUNCTIONS
    // =============================================

    logout: () => {
        localStorage.removeItem('agentToken');
        localStorage.removeItem('agentData');
        window.location.href = '/agent/login';
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('agentToken');
    },

    getToken: () => {
        return localStorage.getItem('agentToken');
    },

    getAgentData: () => {
        try {
            const data = localStorage.getItem('agentData');
            return data ? JSON.parse(data) : null;
        } catch {
            return null;
        }
    }
};

export default agentApi;