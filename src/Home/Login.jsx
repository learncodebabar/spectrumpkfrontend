// src/Pages/Login/Login.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import {
    FaUserShield, FaUserTie, FaUserCog,
    FaSignInAlt, FaUserPlus, FaArrowRight,
    FaGraduationCap, FaMoneyBillWave, FaUsers,
    FaCheckCircle, FaFileAlt, FaClock, FaShieldAlt,
    FaEnvelope, FaLock, FaEye, FaEyeSlash,
    FaExclamationTriangle, FaSpinner
} from 'react-icons/fa';

// import logo from "../../../../../assets/imgs/logosing/2.png";
import logo from "../../src/assets/imgs/logosing/2.png"
import authApi from '../api/authApi';
// import authApi from '../../api/authApi';

const Login = () => {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);

    // ⭐ Login Form State
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setVisible(true);
    }, []);

    // ⭐ Auto-redirect if already logged in
    useEffect(() => {
        const adminToken = localStorage.getItem('adminToken');
        const agentToken = localStorage.getItem('agentToken');
        const adminRole = localStorage.getItem('adminRole');

        if (adminToken) {
            navigate('/admin/dashboard');
        } else if (agentToken) {
            navigate('/agent/dashboard');
        }
    }, [navigate]);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        if (error) setError('');
    };

    // ⭐ Unified Login Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.email.trim() || !form.password) {
            return setError('Please enter email and password');
        }

        setLoading(true);
        setError('');

        try {
            const res = await authApi.unifiedLogin({
                email: form.email.trim(),
                password: form.password
            });

            if (res.success) {
                console.log(`✅ Logged in as ${res.role}`);

                // Save tokens based on role
                if (res.role === 'admin') {
                    localStorage.setItem('adminToken', res.token);
                    localStorage.setItem('adminRole', 'admin');
                    localStorage.setItem('adminData', JSON.stringify(res.user));
                } else if (res.role === 'sub-user') {
                    localStorage.setItem('adminToken', res.token);
                    localStorage.setItem('adminRole', 'sub_admin');
                    localStorage.setItem('adminData', JSON.stringify(res.user));
                } else if (res.role === 'agent') {
                    localStorage.setItem('agentToken', res.token);
                    localStorage.setItem('agentData', JSON.stringify(res.user));
                }

                // Redirect
                navigate(res.redirect || '/admin/dashboard');
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Login failed. Please try again.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="LoginPage">
            {/* Background shapes */}
            <div className="LoginPage-bg-shape LoginPage-shape-1"></div>
            <div className="LoginPage-bg-shape LoginPage-shape-2"></div>
            <div className="LoginPage-bg-shape LoginPage-shape-3"></div>

            <div className={`LoginPage-container ${visible ? 'LoginPage-visible' : ''}`}>

                {/* HEADER */}
                <div className="LoginPage-header">
                    <img className='main-logo-web' src={logo} alt="" />
                    <h1 className="LoginPage-title">
                        Welcome to <span className="LoginPage-title-highlight">SpecTrum PK Portal</span>
                    </h1>
                    <p className="LoginPage-subtitle">
                        Manage scholarships, applications, and payments — all in one place
                    </p>
                </div>

                {/* MAIN GRID */}
                <div className="LoginPage-main-grid">

                    {/* ⭐ LEFT: LOGIN FORM */}
                    <div className="LoginPage-login-section">
                        <div className="LoginPage-login-card">

                            <div className="LoginPage-login-header">
                                <div className="LoginPage-login-icon">
                                    <FaShieldAlt />
                                </div>
                                <h2>Sign In</h2>
                                <p>Access your account</p>
                            </div>

                            {error && (
                                <div className="LoginPage-login-error">
                                    <FaExclamationTriangle />
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="LoginPage-login-form">

                                <div className="LoginPage-login-field">
                                    <label>Email Address</label>
                                    <div className="LoginPage-login-input-wrap">
                                        <FaEnvelope className="LoginPage-login-input-icon" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="your.email@example.com"
                                            autoComplete="email"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className="LoginPage-login-field">
                                    <label>Password</label>
                                    <div className="LoginPage-login-input-wrap">
                                        <FaLock className="LoginPage-login-input-icon" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={form.password}
                                            onChange={handleChange}
                                            placeholder="Enter your password"
                                            autoComplete="current-password"
                                            disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            className="LoginPage-login-pw-toggle"
                                            onClick={() => setShowPassword(!showPassword)}
                                            disabled={loading}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>

                                {/* <div className="LoginPage-login-forgot">
                                    <Link
                                        to="/forgot-password"
                                        className="LoginPage-login-forgot-link"
                                    >
                                        Forgot Password?
                                    </Link>
                                </div> */}

                                <button
                                    type="submit"
                                    className="LoginPage-login-submit"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <><FaSpinner className="spin" /> Signing in...</>
                                    ) : (
                                        <>Sign In <FaArrowRight /></>
                                    )}
                                </button>

                            </form>

                            <div className="LoginPage-login-footer">
                                <small>🔐 Auto-detects your account type</small>
                            </div>

                        </div>
                    </div>

                    {/* ⭐ RIGHT: 3 INFO CARDS */}
                    <div className="LoginPage-info-column">

                        {/* ADMIN */}
                        <div className="LoginPage-card LoginPage-card-admin compact">
                            <div className="LoginPage-card-header">
                                <div className="LoginPage-card-icon-wrapper LoginPage-admin-icon-bg">
                                    <FaUserShield className="LoginPage-card-icon" />
                                </div>
                                <div>
                                    <h2 className="LoginPage-card-title">Admin</h2>
                                    <p className="LoginPage-card-desc">
                                        Manage agents, universities, programs
                                    </p>
                                </div>
                            </div>

                            <div className="LoginPage-card-buttons">
                                <button
                                    className="LoginPage-btn LoginPage-btn-admin-signup"
                                    onClick={() => navigate('/signup')}
                                >
                                    <FaUserPlus />
                                    Sign Up as Admin
                                </button>
                            </div>
                        </div>

                        {/* AGENT */}
                        <div className="LoginPage-card LoginPage-card-agent compact">
                            <div className="LoginPage-card-header">
                                <div className="LoginPage-card-icon-wrapper LoginPage-agent-icon-bg">
                                    <FaUserTie className="LoginPage-card-icon" />
                                </div>
                                <div>
                                    <h2 className="LoginPage-card-title">Agent</h2>
                                    <p className="LoginPage-card-desc">
                                        Submit applications, earn commissions
                                    </p>
                                </div>
                            </div>

                            <div className="LoginPage-card-buttons">
                                <button
                                    className="LoginPage-btn LoginPage-btn-agent-signup"
                                    onClick={() => navigate('/agent/signup')}
                                >
                                    <FaUserPlus />
                                    Sign Up as Agent
                                </button>
                            </div>
                        </div>

                        {/* SUB-USER */}
                        <div className="LoginPage-card LoginPage-card-subuser compact">
                            <div className="LoginPage-card-header">
                                <div className="LoginPage-card-icon-wrapper LoginPage-subuser-icon-bg">
                                    <FaUserCog className="LoginPage-card-icon" />
                                </div>
                                <div>
                                    <h2 className="LoginPage-card-title">Sub-User</h2>
                                    <p className="LoginPage-card-desc">
                                        Access assigned pages and modules
                                    </p>
                                </div>
                            </div>

                            <div className="LoginPage-card-buttons">
                                <button
                                    className="LoginPage-btn LoginPage-btn-subuser-info"
                                    onClick={() => alert('Sub-users are created by admin. Please contact your administrator.')}
                                >
                                    <FaUserPlus />
                                    Contact Admin
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                {/* FOOTER */}
                <div className="LoginPage-footer">
                    <p>© {new Date().getFullYear()} SpecTrum PK Portal. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;