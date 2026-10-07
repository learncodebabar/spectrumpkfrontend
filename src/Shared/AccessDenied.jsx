// src/Pages/Shared/AccessDenied.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaHome, FaArrowLeft, FaShieldAlt } from 'react-icons/fa';
import './AccessDenied.css';

const AccessDenied = () => {
    const navigate = useNavigate();

    return (
        <div className="access-denied-page">

            {/* Floating background circles */}
            <div className="access-denied-bg">
                <span className="access-denied-circle c1" />
                <span className="access-denied-circle c2" />
                <span className="access-denied-circle c3" />
            </div>

            <div className="access-denied-card">

                <div className="access-denied-icon-wrapper">
                    <div className="access-denied-icon">
                        <FaLock />
                    </div>
                    <div className="access-denied-shield">
                        <FaShieldAlt />
                    </div>
                </div>

                <h1>Access Denied</h1>

                <p className="access-denied-subtitle">
                    You don't have permission to access this page
                </p>

                <p className="access-denied-message">
                    This page is restricted. Please contact your administrator
                    if you believe you should have access.
                </p>

                <div className="access-denied-actions">
                    <button
                        className="access-denied-btn secondary"
                        onClick={() => navigate(-1)}
                    >
                        <FaArrowLeft />
                        Go Back
                    </button>

                    <button
                        className="access-denied-btn primary"
                        onClick={() => navigate('/admin/dashboard')}
                    >
                        <FaHome />
                        Go to Dashboard
                    </button>
                </div>

                <div className="access-denied-footer">
                    <small>Need help? Contact your administrator.</small>
                </div>

            </div>
        </div>
    );
};

export default AccessDenied;