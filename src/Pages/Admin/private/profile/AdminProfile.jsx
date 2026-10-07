// src/Pages/Admin/AdminProfile.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../../../api/adminApi';
import { SERVER_URL } from '../../../../api/config'
import {
    FaUser, FaEnvelope, FaCamera, FaTrash,
    FaSave, FaArrowLeft, FaSpinner, FaCheckCircle,
    FaExclamationTriangle, FaLock, FaEye, FaEyeSlash
} from 'react-icons/fa';
import './AdminProfile.css';

const AdminProfile = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [adminData, setAdminData] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [profileImageFile, setProfileImageFile] = useState(null);

    // Form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    // Password change
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPwd, setShowCurrentPwd] = useState(false);
    const [showNewPwd, setShowNewPwd] = useState(false);
    const [showConfirmPwd, setShowConfirmPwd] = useState(false);

    // Messages
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    // ============================================
    // FETCH PROFILE
    // ============================================
    useEffect(() => {
        fetchProfile();
        // eslint-disable-next-line
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            if (!token) {
                navigate('/signin');
                return;
            }

            const response = await adminApi.getProfile(token);
            if (response.success) {
                const admin = response.admin;
                setAdminData(admin);
                setName(admin.name || '');
                setEmail(admin.email || '');

                // Profile image from localStorage or adminData
                const savedImage = localStorage.getItem('adminProfileImage');
                if (savedImage) {
                    setProfileImage(savedImage);
                } else if (admin.profileImage) {
                    setProfileImage(
                        admin.profileImage.startsWith('http')
                            ? admin.profileImage
                            : `${SERVER_URL}${admin.profileImage}`
                    );
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    // ============================================
    // IMAGE UPLOAD
    // ============================================
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file (JPG, PNG)');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError('Image size should be less than 5MB');
            return;
        }

        setError('');

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfileImage(reader.result);
            setProfileImageFile(file);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        if (window.confirm('Remove profile image?')) {
            setProfileImage(null);
            setProfileImageFile(null);
            localStorage.removeItem('adminProfileImage');
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    // ============================================
    // SAVE PROFILE (name + email + image)
    // ============================================
    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!name.trim()) {
            setError('Name is required');
            return;
        }
        if (name.trim().length < 3) {
            setError('Name must be at least 3 characters');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            setError('Email is required');
            return;
        }
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email');
            return;
        }

        try {
            setSaving(true);
            const token = localStorage.getItem('adminToken');

            // ⭐ Save profile image to localStorage (base64)
            if (profileImage && profileImage.startsWith('data:')) {
                localStorage.setItem('adminProfileImage', profileImage);
            }

            // ⭐ Update admin (name + email) in backend
            const response = await adminApi.updateAdmin(
                adminData._id,
                { name: name.trim(), email: email.trim().toLowerCase() },
                token
            );

            if (response.success) {
                // Update localStorage adminData
                const updatedAdmin = {
                    ...adminData,
                    name: name.trim(),
                    email: email.trim().toLowerCase()
                };
                localStorage.setItem('adminData', JSON.stringify(updatedAdmin));
                setAdminData(updatedAdmin);

                setSuccess('✅ Profile updated successfully!');
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    // ============================================
    // CHANGE PASSWORD
    // ============================================
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('All password fields are required');
            return;
        }
        if (newPassword.length < 6) {
            setError('New password must be at least 6 characters');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            setSaving(true);
            const token = localStorage.getItem('adminToken');

            const response = await adminApi.changePassword(
                adminData._id,
                { currentPassword, newPassword, confirmNewPassword: confirmPassword },
                token
            );

            if (response.success) {
                setSuccess('✅ Password changed successfully!');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setShowPasswordSection(false);
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password');
        } finally {
            setSaving(false);
        }
    };

    // ============================================
    // GET INITIALS
    // ============================================
    const getInitials = (name) => {
        if (!name) return 'A';
        return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    };

    // ============================================
    // LOADING
    // ============================================
    if (loading) {
        return (
            <div className="admin-profile-loading">
                <FaSpinner className="spin" />
                <p>Loading profile...</p>
            </div>
        );
    }

    // ============================================
    // RENDER
    // ============================================
    return (
        <div className="admin-profile-page">

            {/* HEADER */}
            <div className="admin-profile-header">
                <button
                    className="admin-profile-back-btn"
                    onClick={() => navigate(-1)}
                >
                    <FaArrowLeft /> Back
                </button>
                <div>
                    <h1>My Profile</h1>
                    <p>Manage your account information</p>
                </div>
            </div>

            {/* MESSAGES */}
            {error && (
                <div className="admin-profile-message error">
                    <FaExclamationTriangle />
                    <span>{error}</span>
                </div>
            )}
            {success && (
                <div className="admin-profile-message success">
                    <FaCheckCircle />
                    <span>{success}</span>
                </div>
            )}

            <div className="admin-profile-grid">

                {/* ============================================
                    LEFT: AVATAR CARD
                    ============================================ */}
                <div className="admin-profile-card avatar-card">
                    <h2>Profile Picture</h2>

                    <div className="avatar-wrapper">
                        <div className="avatar-image">
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" />
                            ) : (
                                <span>{getInitials(adminData?.name)}</span>
                            )}
                        </div>

                        {/* Upload button */}
                        <button
                            type="button"
                            className="avatar-upload-btn"
                            onClick={() => fileInputRef.current?.click()}
                            title="Change photo"
                        >
                            <FaCamera />
                        </button>

                        {/* Remove button */}
                        {profileImage && (
                            <button
                                type="button"
                                className="avatar-remove-btn"
                                onClick={handleRemoveImage}
                                title="Remove photo"
                            >
                                <FaTrash />
                            </button>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                    </div>

                    <p className="avatar-hint">
                        Click the camera icon to upload a new photo
                    </p>

                    <div className="avatar-info">
                        <p><strong>JPG, PNG</strong> — Max 5MB</p>
                    </div>
                </div>

                {/* ============================================
                    RIGHT: INFO CARD
                    ============================================ */}
                <div className="admin-profile-card info-card">
                    <h2>Account Information</h2>

                    <form onSubmit={handleSaveProfile}>
                        <div className="admin-profile-field">
                            <label>
                                <FaUser /> Full Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => { setName(e.target.value); setError(''); }}
                                placeholder="Enter your full name"
                                disabled={saving}
                            />
                        </div>

                        <div className="admin-profile-field">
                            <label>
                                <FaEnvelope /> Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                placeholder="Enter your email"
                                disabled={saving}
                            />
                        </div>

                        <button
                            type="submit"
                            className="admin-profile-save-btn"
                            disabled={saving}
                        >
                            {saving ? (
                                <><FaSpinner className="spin" /> Saving...</>
                            ) : (
                                <><FaSave /> Save Changes</>
                            )}
                        </button>
                    </form>

                    {/* ============================================
                        PASSWORD SECTION
                        ============================================ */}
                    <div className="password-section">
                        <button
                            type="button"
                            className="toggle-password-btn"
                            onClick={() => setShowPasswordSection(!showPasswordSection)}
                        >
                            <FaLock />
                            {showPasswordSection ? 'Hide' : 'Change'} Password
                        </button>

                        {showPasswordSection && (
                            <form onSubmit={handleChangePassword} className="password-form">
                                {/* Current password */}
                                <div className="admin-profile-field">
                                    <label>Current Password</label>
                                    <div className="password-input-wrapper">
                                        <input
                                            type={showCurrentPwd ? 'text' : 'password'}
                                            value={currentPassword}
                                            onChange={(e) => { setCurrentPassword(e.target.value); setError(''); }}
                                            placeholder="Enter current password"
                                            disabled={saving}
                                        />
                                        <button
                                            type="button"
                                            className="eye-btn"
                                            onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                                        >
                                            {showCurrentPwd ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>

                                {/* New password */}
                                <div className="admin-profile-field">
                                    <label>New Password</label>
                                    <div className="password-input-wrapper">
                                        <input
                                            type={showNewPwd ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                                            placeholder="Min 6 characters"
                                            disabled={saving}
                                        />
                                        <button
                                            type="button"
                                            className="eye-btn"
                                            onClick={() => setShowNewPwd(!showNewPwd)}
                                        >
                                            {showNewPwd ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm password */}
                                <div className="admin-profile-field">
                                    <label>Confirm New Password</label>
                                    <div className="password-input-wrapper">
                                        <input
                                            type={showConfirmPwd ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                                            placeholder="Confirm new password"
                                            disabled={saving}
                                        />
                                        <button
                                            type="button"
                                            className="eye-btn"
                                            onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                                        >
                                            {showConfirmPwd ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="admin-profile-save-btn password-save-btn"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <><FaSpinner className="spin" /> Changing...</>
                                    ) : (
                                        <><FaLock /> Change Password</>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;