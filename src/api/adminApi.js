// src/api/adminApi.js
import api from './config.js';

const adminApi = {
    // =============================================
    // AUTHENTICATION APIs
    // =============================================

    signup: async (userData) => {
        try {
            const response = await api.post('/admin/signup', userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    signin: async (credentials) => {
        try {
            console.log("🔐 API - ADMIN SIGN IN");
            const response = await api.post('/admin/signin', credentials);
            console.log("📥 Signin Response:", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Signin API Error:", error.response?.data);
            throw error;
        }
    },

    verifySignUpOTP: async (data) => {
        try {
            const requestData = {
                email: data.email,
                otp: String(data.otp).trim()
            };
            const response = await api.post('/admin/verify-signup', requestData);
            return response.data;
        } catch (error) {
            console.error("❌ API Verify OTP Error:", error.response?.data);
            throw error;
        }
    },

    verifyLoginOTP: async (data) => {
        try {
            const requestData = {
                email: data.email,
                otp: String(data.otp).trim()
            };
            const response = await api.post('/admin/verify-login-otp', requestData);
            return response.data;
        } catch (error) {
            console.error("❌ API Verify Login OTP Error:", error.response?.data);
            throw error;
        }
    },

    resendOTP: async (data) => {
        try {
            const response = await api.post('/admin/resend-otp', data);
            return response.data;
        } catch (error) {
            console.error("❌ Resend OTP Error:", error.response?.data);
            throw error;
        }
    },

    // =============================================
    // FORGOT PASSWORD — OTP-based 3-step flow
    // =============================================

    forgotPassword: async (data) => {
        try {
            console.log("📧 API - FORGOT PASSWORD (Send OTP)");
            const response = await api.post('/admin/forgot-password', data);
            console.log("📥 Response:", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Forgot Password Error:", error.response?.data);
            throw error;
        }
    },

    verifyResetOTP: async (data) => {
        try {
            console.log("🔐 API - VERIFY RESET OTP");
            const requestData = {
                email: data.email,
                otp: String(data.otp).trim()
            };
            const response = await api.post('/admin/verify-reset-otp', requestData);
            console.log("📥 Response:", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Verify Reset OTP Error:", error.response?.data);
            throw error;
        }
    },

    resetPassword: async (data) => {
        try {
            console.log("🔐 API - RESET PASSWORD");
            const response = await api.post('/admin/reset-password', data);
            console.log("📥 Response:", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Reset Password Error:", error.response?.data);
            throw error;
        }
    },

    // =============================================
    // ADMIN PROFILE APIs
    // =============================================

    getProfile: async (token) => {
        try {
            const response = await api.get('/admin/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getAllAdmins: async (token) => {
        try {
            const response = await api.get('/admin/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getAdminById: async (id, token) => {
        try {
            const response = await api.get(`/admin/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateAdmin: async (id, data, token) => {
        try {
            const response = await api.put(`/admin/${id}`, data, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteAdmin: async (id, token) => {
        try {
            const response = await api.delete(`/admin/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    changePassword: async (id, data, token) => {
        try {
            const response = await api.put(`/admin/${id}/change-password`, data, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // =============================================
    // AGENT MANAGEMENT APIs
    // =============================================

    getAllAgents: async (token) => {
        try {
            console.log("🔐 API - GET ALL AGENTS");
            const response = await api.get('/admin/agents', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log("📥 Agents Response:", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Get Agents Error:", error.response?.data);
            throw error;
        }
    },

    getPendingAgents: async (token) => {
        try {
            const response = await api.get('/admin/agents/pending', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error("❌ Get Pending Agents Error:", error.response?.data);
            throw error;
        }
    },

    getAgentById: async (id, token) => {
        try {
            const response = await api.get(`/admin/agents/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    approveAgent: async (id, token) => {
        try {
            console.log("✅ API - APPROVE AGENT:", id);
            const response = await api.put(`/admin/agents/approve/${id}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log("📥 Approve Response:", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Approve Error:", error.response?.data);
            throw error;
        }
    },

    rejectAgent: async (id, data, token) => {
        try {
            console.log("❌ API - REJECT AGENT:", id);
            const response = await api.put(`/admin/agents/reject/${id}`, data, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log("📥 Reject Response:", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Reject Error:", error.response?.data);
            throw error;
        }
    },

    setPendingStatus: async (id, token) => {
        try {
            console.log("⏳ API - SET PENDING STATUS:", id);
            const response = await api.put(`/admin/agents/pending/${id}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error("❌ Set Pending Error:", error.response?.data);
            throw error;
        }
    },

    deleteAgent: async (id, token) => {
        try {
            const response = await api.delete(`/admin/agents/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // =============================================
    // CERTIFICATE SETTINGS APIs
    // =============================================

    getCertificateSettings: async () => {
        try {
            console.log("🎓 API - GET CERTIFICATE SETTINGS");
            const token = localStorage.getItem('adminToken');
            const response = await api.get('/admin/certificate-settings', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log("📥 Certificate Settings:", response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Get Certificate Settings Error:', error.response?.data);
            throw error;
        }
    },

    updateCertificateSettings: async (formData) => {
        try {
            console.log("💾 API - UPDATE CERTIFICATE SETTINGS");
            const token = localStorage.getItem('adminToken');
            const response = await api.put('/admin/certificate-settings', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log("📥 Update Response:", response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Update Certificate Settings Error:', error.response?.data);
            throw error;
        }
    },

    // =============================================
    // RENEWAL REQUESTS APIs
    // =============================================

    getRenewalRequests: async (status = 'pending') => {
        try {
            console.log("🔄 API - GET RENEWAL REQUESTS:", status);
            const token = localStorage.getItem('adminToken');
            const response = await api.get('/admin/agents/renewals', {
                headers: { 'Authorization': `Bearer ${token}` },
                params: { status }
            });
            console.log("📥 Renewal Requests:", response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Get Renewal Requests Error:', error.response?.data);
            throw error;
        }
    },

    approveRenewal: async (id, data = {}) => {
        try {
            console.log("✅ API - APPROVE RENEWAL:", id);
            const token = localStorage.getItem('adminToken');
            const response = await api.put(`/admin/agents/renewals/approve/${id}`, data, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log("📥 Approve Response:", response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Approve Renewal Error:', error.response?.data);
            throw error;
        }
    },

    rejectRenewal: async (id, data) => {
        try {
            console.log("❌ API - REJECT RENEWAL:", id);
            const token = localStorage.getItem('adminToken');
            const response = await api.put(`/admin/agents/renewals/reject/${id}`, data, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log("📥 Reject Response:", response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Reject Renewal Error:', error.response?.data);
            throw error;
        }
    },

    // =============================================
    // UNIVERSITY MANAGEMENT APIs
    // =============================================

    createUniversity: async (formData, token) => {
        try {
            console.log("🔐 API - CREATE UNIVERSITY");
            const response = await api.post('/universities', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error("❌ Create University Error:", error.response?.data);
            throw error;
        }
    },

    getAllUniversities: async (token, filters = {}) => {
        try {
            console.log("🔐 API - GET ALL UNIVERSITIES");
            const response = await api.get('/universities', {
                headers: { 'Authorization': `Bearer ${token}` },
                params: filters
            });
            return response.data;
        } catch (error) {
            console.error("❌ Get Universities Error:", error.response?.data);
            throw error;
        }
    },

    getUniversityById: async (id, token) => {
        try {
            const response = await api.get(`/universities/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateUniversity: async (id, formData, token) => {
        try {
            const response = await api.put(`/universities/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteUniversity: async (id, token) => {
        try {
            const response = await api.delete(`/universities/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    toggleUniversityActive: async (id, token) => {
        try {
            const response = await api.put(`/universities/${id}/toggle-active`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    toggleUniversityVerified: async (id, token) => {
        try {
            const response = await api.put(`/universities/${id}/toggle-verified`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // =============================================
    // PROGRAM MANAGEMENT APIs
    // =============================================

    createProgram: async (formData, token) => {
        try {
            console.log("🔐 API - CREATE PROGRAM");
            const response = await api.post('/programs', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error("❌ Create Program Error:", error.response?.data);
            throw error;
        }
    },

    getAllPrograms: async (token, filters = {}) => {
        try {
            const response = await api.get('/programs', {
                headers: { 'Authorization': `Bearer ${token}` },
                params: filters
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getProgramById: async (id, token) => {
        try {
            const response = await api.get(`/programs/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateProgram: async (id, formData, token) => {
        try {
            const response = await api.put(`/programs/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteProgram: async (id, token) => {
        try {
            const response = await api.delete(`/programs/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    toggleProgramActive: async (id, token) => {
        try {
            const response = await api.put(`/programs/${id}/toggle-active`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    toggleProgramFeatured: async (id, token) => {
        try {
            const response = await api.put(`/programs/${id}/toggle-featured`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getProgramsByUniversity: async (universityId, token) => {
        try {
            const response = await api.get(`/programs/university/${universityId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // =============================================
    // APPLICATION MANAGEMENT APIs
    // =============================================

    applications: {
        getAll: async (filters = {}) => {
            try {
                console.log("🔐 API - GET ALL APPLICATIONS");
                const token = localStorage.getItem('adminToken');
                const response = await api.get('/admin/applications', {
                    headers: { 'Authorization': `Bearer ${token}` },
                    params: filters
                });
                return response.data;
            } catch (error) {
                console.error("❌ Get Applications Error:", error.response?.data);
                throw error;
            }
        },

        getById: async (id) => {
            try {
                const token = localStorage.getItem('adminToken');
                const response = await api.get(`/admin/applications/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                return response.data;
            } catch (error) {
                throw error;
            }
        },

        getStats: async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const response = await api.get('/admin/applications/stats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                return response.data;
            } catch (error) {
                throw error;
            }
        },

        update: async (id, formData) => {
            try {
                const token = localStorage.getItem('adminToken');
                const response = await api.put(`/admin/applications/${id}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                return response.data;
            } catch (error) {
                throw error;
            }
        },

        delete: async (id) => {
            try {
                const token = localStorage.getItem('adminToken');
                const response = await api.delete(`/admin/applications/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                return response.data;
            } catch (error) {
                throw error;
            }
        },

        approve: async (id, remarks = '') => {
            try {
                const token = localStorage.getItem('adminToken');
                const response = await api.patch(`/admin/applications/${id}/approve`,
                    { remarks },
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                return response.data;
            } catch (error) {
                throw error;
            }
        },

        reject: async (id, reason) => {
            try {
                const token = localStorage.getItem('adminToken');
                const response = await api.patch(`/admin/applications/${id}/reject`,
                    { reason, remarks: reason },
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                return response.data;
            } catch (error) {
                throw error;
            }
        },

        review: async (id, remarks) => {
            try {
                const token = localStorage.getItem('adminToken');
                const response = await api.patch(`/admin/applications/${id}/review`,
                    { remarks },
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                return response.data;
            } catch (error) {
                throw error;
            }
        }
    },

    // =============================================
    // PAYMENT MANAGEMENT APIs
    // =============================================

    payments: {
        create: async (data) => {
            const token = localStorage.getItem('adminToken');
            const response = await api.post('/admin/payments', data, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        },
        getAll: async (filters = {}) => {
            const token = localStorage.getItem('adminToken');
            const response = await api.get('/admin/payments', {
                headers: { 'Authorization': `Bearer ${token}` },
                params: filters
            });
            return response.data;
        },
        getById: async (id) => {
            const token = localStorage.getItem('adminToken');
            const response = await api.get(`/admin/payments/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        },
        update: async (id, data) => {
            const token = localStorage.getItem('adminToken');
            const response = await api.put(`/admin/payments/${id}`, data, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        },
        delete: async (id) => {
            const token = localStorage.getItem('adminToken');
            const response = await api.delete(`/admin/payments/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        },
        getStats: async (filters = {}) => {
            const token = localStorage.getItem('adminToken');
            const response = await api.get('/admin/payments/stats', {
                headers: { 'Authorization': `Bearer ${token}` },
                params: filters
            });
            return response.data;
        },
        getDailyReport: async (date) => {
            const token = localStorage.getItem('adminToken');
            const response = await api.get('/admin/payments/daily-report', {
                headers: { 'Authorization': `Bearer ${token}` },
                params: { date }
            });
            return response.data;
        },
        getAgentSummary: async (agentId) => {
            const token = localStorage.getItem('adminToken');
            const response = await api.get(`/admin/payments/agent/${agentId}/summary`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        }
    },

    // =============================================
    // DASHBOARD APIs
    // =============================================

    getDashboardStats: async () => {
        try {
            console.log("📊 API - GET DASHBOARD STATS");
            const token = localStorage.getItem('adminToken');
            const response = await api.get('/admin/dashboard/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('❌ Dashboard Error:', error.response?.data);
            throw error;
        }
    },

    // =============================================
    // ⭐ SUB-USER MANAGEMENT APIs
    // =============================================

    createSubUser: async (data) => {
        const token = localStorage.getItem('adminToken');
        const response = await api.post('/admin/sub-users', data, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    },

    getAllSubUsers: async () => {
        const token = localStorage.getItem('adminToken');
        const response = await api.get('/admin/sub-users', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    },

    getSubUserById: async (id) => {
        const token = localStorage.getItem('adminToken');
        const response = await api.get(`/admin/sub-users/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    },
    // =============================================
// ⭐ CONTACT SETTINGS APIs
// =============================================

getContactSettings: async () => {
    try {
        const token = localStorage.getItem('adminToken');
        const response = await api.get('/admin/contact-settings', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('❌ Get Contact Settings Error:', error.response?.data);
        throw error;
    }
},

updateContactSettings: async (data) => {
    try {
        const token = localStorage.getItem('adminToken');
        const response = await api.put('/admin/contact-settings', data, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('❌ Update Contact Settings Error:', error.response?.data);
        throw error;
    }
},

    updateSubUser: async (id, data) => {
        const token = localStorage.getItem('adminToken');
        const response = await api.put(`/admin/sub-users/${id}`, data, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    },

    deleteSubUser: async (id) => {
        const token = localStorage.getItem('adminToken');
        const response = await api.delete(`/admin/sub-users/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    },

    getAvailablePages: async () => {
        const token = localStorage.getItem('adminToken');
        const response = await api.get('/admin/available-pages', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    },

    // =============================================
    // ⭐ SUB-USER LOGIN (public — no token)
    // =============================================

    subUserLogin: async (credentials) => {
        try {
            console.log("🔐 API - SUB-USER LOGIN");
            const response = await api.post('/admin/sub-users/login', credentials);
            return response.data;
        } catch (error) {
            console.error("❌ Sub-User Login Error:", error.response?.data);
            throw error;
        }
    },

    // =============================================
    // UTILITY FUNCTIONS
    // =============================================

    logout: () => {
        const role = localStorage.getItem('adminRole');

        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        localStorage.removeItem('adminRole');
        localStorage.removeItem('userData');
        localStorage.removeItem('adminProfileImage');

        // ⭐ Redirect based on role
        if (role === 'sub_admin') {
            window.location.href = '/sub-user/signin';
        } else {
            window.location.href = '/signin';
        }
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('adminToken');
    },

    getToken: () => {
        return localStorage.getItem('adminToken');
    },

    getUserRole: () => {
        return localStorage.getItem('adminRole') || 'admin';
    },

    getUserData: () => {
        try {
            const data = localStorage.getItem('adminData');
            return data ? JSON.parse(data) : null;
        } catch {
            return null;
        }
    },

    // ⭐ Check if current user is sub-user
    isSubUser: () => {
        return localStorage.getItem('adminRole') === 'sub_admin';
    },

    // ⭐ Check if current user is super admin
    isSuperAdmin: () => {
        const role = localStorage.getItem('adminRole');
        return !role || role === 'super_admin' || role === 'admin';
    },

    // ⭐ Check specific permission (for page/module access)
    hasPermission: (pageKey) => {
        const role = localStorage.getItem('adminRole');

        // Super admin: sab access
        if (!role || role === 'super_admin' || role === 'admin') return true;

        // Sub admin: check permissions array
        try {
            const data = JSON.parse(localStorage.getItem('adminData') || '{}');
            return (data.permissions || []).includes(pageKey);
        } catch {
            return false;
        }
    },

    setAuthData: (token, role, userData) => {
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminRole', role);
        localStorage.setItem('adminData', JSON.stringify(userData));
    },

    clearAuthData: () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        localStorage.removeItem('adminRole');
        localStorage.removeItem('userData');
        localStorage.removeItem('adminProfileImage');
    }
};

export default adminApi;