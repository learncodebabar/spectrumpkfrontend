// src/Pages/Admin/auth/SubUserSignIn.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    FaEnvelope, FaLock, FaEye, FaEyeSlash,
    FaSignInAlt, FaExclamationTriangle, FaUserShield
} from 'react-icons/fa';
// import adminApi from '.';
import './SubUserSignIn.css';
import adminApi from '../../api/adminApi';

const SubUserSignIn = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.email || !form.password) {
            return setError('Please fill all fields');
        }

        setLoading(true);
        setError('');

        try {
            const res = await adminApi.subUserLogin({
                email: form.email.trim(),
                password: form.password
            });

            if (res.success) {
                // ⭐ Same keys as admin (adminToken) — role-based separation
                localStorage.setItem('adminToken', res.token);
                localStorage.setItem('adminRole', 'sub_admin');
                localStorage.setItem('adminData', JSON.stringify({
                    id: res.user.id,
                    name: res.user.name,
                    email: res.user.email,
                    role: 'sub_admin',
                    permissions: res.user.permissions || []
                }));

                console.log('✅ Sub-user logged in:', res.user);
                console.log('📄 Permissions:', res.user.permissions);

                // Redirect to dashboard
                navigate('/admin/dashboard');
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Login failed. Please try again.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="subuser-signin-page">

            {/* Floating circles background */}
            <div className="subuser-signin-bg">
                <span className="subuser-signin-circle circle-1" />
                <span className="subuser-signin-circle circle-2" />
                <span className="subuser-signin-circle circle-3" />
            </div>

            <div className="subuser-signin-card">

                {/* Header */}
                <div className="subuser-signin-header">
                    <div className="subuser-signin-logo">
                        <FaUserShield />
                    </div>
                    <h1>Sub-User Login</h1>
                    <p>Sign in with your assigned credentials</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="subuser-signin-error">
                        <FaExclamationTriangle />
                        <span>{error}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="subuser-signin-form">

                    <div className="subuser-signin-group">
                        <label>Email Address</label>
                        <div className="subuser-signin-input-wrap">
                            <FaEnvelope className="subuser-signin-input-icon" />
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="your.email@example.com"
                                autoComplete="email"
                                disabled={loading}
                                required
                            />
                        </div>
                    </div>

                    <div className="subuser-signin-group">
                        <label>Password</label>
                        <div className="subuser-signin-input-wrap">
                            <FaLock className="subuser-signin-input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                disabled={loading}
                                required
                            />
                            <button
                                type="button"
                                className="subuser-signin-pw-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={loading}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="subuser-signin-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="subuser-signin-spinner" />
                                Signing in...
                            </>
                        ) : (
                            <>
                                <FaSignInAlt />
                                Sign In
                            </>
                        )}
                    </button>

                </form>

                {/* Footer */}
                <div className="subuser-signin-footer">
                    <p>
                        Are you a super admin?{' '}
                        <Link to="/signin">Login here</Link>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default SubUserSignIn;