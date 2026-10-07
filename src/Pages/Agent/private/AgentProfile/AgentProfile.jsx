// src/Pages/Agent/private/AgentProfile/AgentProfile.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import agentApi from '../../../../api/agentApi';
import { SERVER_URL } from '../../../../api/config';
import {
    FaUser, FaEnvelope, FaPhone, FaCamera, FaTrash,
    FaSave, FaArrowLeft, FaSpinner, FaCheckCircle,
    FaExclamationTriangle, FaLock, FaEye, FaEyeSlash,
    FaBriefcase, FaGraduationCap, FaMapMarkerAlt,
    FaBuilding, FaGlobe, FaCalendarAlt, FaVenusMars,
    FaAward, FaAddressCard
} from 'react-icons/fa';
import './AgentProfile.css';

const AgentProfile = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // ===== STATE =====
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [agentData, setAgentData] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [profileImageFile, setProfileImageFile] = useState(null);

    // Form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        nationality: '',
        jobTitle: '',
        company: '',
        experience: '',
        education: '',
        specialization: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        bio: ''
    });

    // Password section
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
            const token = localStorage.getItem('agentToken');
            if (!token) {
                navigate('/agent/login');
                return;
            }

            const response = await agentApi.getProfile(token);
            if (response.success) {
                const agent = response.agent;
                setAgentData(agent);

                // Populate form data
                setFormData({
                    name: agent.name || '',
                    email: agent.email || '',
                    phone: agent.phone || '',
                    dateOfBirth: agent.dateOfBirth
                        ? new Date(agent.dateOfBirth).toISOString().split('T')[0]
                        : '',
                    gender: agent.gender || '',
                    nationality: agent.nationality || '',
                    jobTitle: agent.jobTitle || '',
                    company: agent.company || '',
                    experience: agent.experience || '',
                    education: agent.education || '',
                    specialization: agent.specialization || '',
                    address: agent.address || '',
                    city: agent.city || '',
                    state: agent.state || '',
                    pincode: agent.pincode || '',
                    country: agent.country || 'India',
                    bio: agent.bio || ''
                });

                // ⭐ Profile image — multiple fallbacks
                const savedImage = localStorage.getItem('agentProfileImage');
                if (savedImage) {
                    setProfileImage(savedImage);
                } else if (agent.profileImageDisplayUrl) {
                    setProfileImage(
                        agent.profileImageDisplayUrl.startsWith('http')
                            ? agent.profileImageDisplayUrl
                            : `${SERVER_URL}${agent.profileImageDisplayUrl.startsWith('/') ? '' : '/'}${agent.profileImageDisplayUrl}`
                    );
                } else if (agent.profileImageUrl) {
                    setProfileImage(agent.profileImageUrl);
                } else if (agent.profileImage) {
                    setProfileImage(
                        agent.profileImage.startsWith('http')
                            ? agent.profileImage
                            : `${SERVER_URL}${agent.profileImage.startsWith('/') ? '' : '/'}${agent.profileImage}`
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
    // HANDLE CHANGE
    // ============================================
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    // ============================================
    // IMAGE UPLOAD
    // ============================================
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('Please select an image file (JPG, PNG)');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError('Image size should be less than 5MB');
            return;
        }

        setError('');

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
            localStorage.removeItem('agentProfileImage');
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    // ============================================
    // SAVE PROFILE
    // ============================================
    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!formData.name.trim()) {
            setError('Name is required');
            return;
        }
        if (formData.name.trim().length < 3) {
            setError('Name must be at least 3 characters');
            return;
        }

        try {
            setSaving(true);
            const token = localStorage.getItem('agentToken');

            // Save profile image locally
            if (profileImage && profileImage.startsWith('data:')) {
                localStorage.setItem('agentProfileImage', profileImage);
            }

            // Build FormData
            const fd = new FormData();

            // Text fields
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== undefined && value !== '') {
                    fd.append(key, value);
                }
            });

            // Image file (if uploaded)
            if (profileImageFile) {
                fd.append('profileImage', profileImageFile);
            }

            const response = await agentApi.updateProfile(
                agentData._id,
                fd,
                token
            );

            if (response.success) {
                // Update localStorage
                const updatedAgent = {
                    ...agentData,
                    name: formData.name.trim(),
                    phone: formData.phone,
                    jobTitle: formData.jobTitle,
                    profileImage: profileImage
                };
                localStorage.setItem('agentData', JSON.stringify(updatedAgent));
                setAgentData(updatedAgent);

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
            const token = localStorage.getItem('agentToken');

            const response = await agentApi.changePassword(
                agentData._id,
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
            <div className="agent-profile-loading">
                <FaSpinner className="spin" />
                <p>Loading profile...</p>
            </div>
        );
    }

    // ============================================
    // RENDER
    // ============================================
    return (
        <div className="agent-profile-page">

            {/* HEADER */}
            <div className="agent-profile-header">
                <button
                    type="button"
                    className="agent-profile-back-btn"
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
                <div className="agent-profile-message error">
                    <FaExclamationTriangle />
                    <span>{error}</span>
                </div>
            )}
            {success && (
                <div className="agent-profile-message success">
                    <FaCheckCircle />
                    <span>{success}</span>
                </div>
            )}

            <div className="agent-profile-grid">

                {/* ============================================
                    LEFT: AVATAR CARD
                    ============================================ */}
                <div className="agent-profile-card avatar-card">
                    <h2>Profile Picture</h2>

                    <div className="avatar-wrapper">
                        <div className="avatar-image">
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" />
                            ) : (
                                <span>{getInitials(agentData?.name)}</span>
                            )}
                        </div>

                        <button
                            type="button"
                            className="avatar-upload-btn"
                            onClick={() => fileInputRef.current?.click()}
                            title="Change photo"
                        >
                            <FaCamera />
                        </button>

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
                        Click camera icon to upload new photo
                    </p>

                    <div className="avatar-info">
                        <p><strong>JPG, PNG</strong> — Max 5MB</p>
                    </div>

                    {agentData && (
                        <div className="agent-profile-summary">
                            <p><strong>{agentData.jobTitle || 'Agent'}</strong></p>
                            <p className="small">{agentData.email}</p>
                            {agentData.approvalStatus && (
                                <span className={`agent-status-badge ${agentData.approvalStatus}`}>
                                    {agentData.approvalStatus}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* ============================================
                    RIGHT: INFO CARDS
                    ============================================ */}
                <div className="agent-profile-main">

                    <div className="agent-profile-card info-card">
                        <form onSubmit={handleSaveProfile}>

                            {/* ========== PERSONAL INFORMATION ========== */}
                            <h2><FaUser /> Personal Information</h2>

                            <div className="agent-profile-row">
                                <div className="agent-profile-field">
                                    <label><FaUser /> Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        disabled={saving}
                                    />
                                </div>

                                <div className="agent-profile-field">
                                    <label><FaEnvelope /> Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        disabled
                                        title="Email cannot be changed"
                                    />
                                </div>
                            </div>

                            <div className="agent-profile-row">
                                <div className="agent-profile-field">
                                    <label><FaPhone /> Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        maxLength="11"
                                        placeholder="11-digit phone"
                                        disabled={saving}
                                    />
                                </div>

                                <div className="agent-profile-field">
                                    <label><FaCalendarAlt /> Date of Birth</label>
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                        disabled={saving}
                                    />
                                </div>
                            </div>

                            <div className="agent-profile-row">
                                <div className="agent-profile-field">
                                    <label><FaVenusMars /> Gender</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        disabled={saving}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="agent-profile-field">
                                    <label><FaGlobe /> Nationality</label>
                                    <input
                                        type="text"
                                        name="nationality"
                                        value={formData.nationality}
                                        onChange={handleChange}
                                        placeholder="Your nationality"
                                        disabled={saving}
                                    />
                                </div>
                            </div>

                            {/* ========== PROFESSIONAL INFORMATION ========== */}
                            <h2 className="section-divider"><FaBriefcase /> Professional Information</h2>

                            <div className="agent-profile-row">
                                <div className="agent-profile-field">
                                    <label><FaBriefcase /> Job Title</label>
                                    <input
                                        type="text"
                                        name="jobTitle"
                                        value={formData.jobTitle}
                                        onChange={handleChange}
                                        placeholder="Your job title"
                                        disabled={saving}
                                    />
                                </div>

                                <div className="agent-profile-field">
                                    <label><FaBuilding /> Company</label>
                                    <input
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        placeholder="Company name"
                                        disabled={saving}
                                    />
                                </div>
                            </div>

                            <div className="agent-profile-row">
                                <div className="agent-profile-field">
                                    <label><FaGraduationCap /> Experience</label>
                                    <select
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        disabled={saving}
                                    >
                                        <option value="">Select Experience</option>
                                        <option value="Fresher">Fresher</option>
                                        <option value="1-2 Years">1-2 Years</option>
                                        <option value="3-5 Years">3-5 Years</option>
                                        <option value="5-10 Years">5-10 Years</option>
                                        <option value="10+ Years">10+ Years</option>
                                    </select>
                                </div>

                                <div className="agent-profile-field">
                                    <label><FaGraduationCap /> Education</label>
                                    <select
                                        name="education"
                                        value={formData.education}
                                        onChange={handleChange}
                                        disabled={saving}
                                    >
                                        <option value="">Select Education</option>
                                        <option value="High School">High School</option>
                                        <option value="Diploma">Diploma</option>
                                        <option value="Bachelor's Degree">Bachelor's Degree</option>
                                        <option value="Master's Degree">Master's Degree</option>
                                        <option value="PhD">PhD</option>
                                        <option value="Professional Certification">Professional Certification</option>
                                    </select>
                                </div>
                            </div>

                            <div className="agent-profile-field">
                                <label><FaAward /> Specialization</label>
                                <input
                                    type="text"
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    placeholder="Your area of expertise"
                                    disabled={saving}
                                />
                            </div>

                            {/* ========== ADDRESS ========== */}
                            <h2 className="section-divider"><FaMapMarkerAlt /> Address</h2>

                            <div className="agent-profile-field">
                                <label><FaAddressCard /> Full Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows="2"
                                    placeholder="Street, area, landmarks..."
                                    disabled={saving}
                                />
                            </div>

                            <div className="agent-profile-row">
                                <div className="agent-profile-field">
                                    <label>City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="City"
                                        disabled={saving}
                                    />
                                </div>

                                <div className="agent-profile-field">
                                    <label>State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        placeholder="State"
                                        disabled={saving}
                                    />
                                </div>
                            </div>

                            <div className="agent-profile-row">
                                <div className="agent-profile-field">
                                    <label>Pincode</label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        maxLength="6"
                                        placeholder="6-digit pincode"
                                        disabled={saving}
                                    />
                                </div>

                                <div className="agent-profile-field">
                                    <label><FaGlobe /> Country</label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        placeholder="Country"
                                        disabled={saving}
                                    />
                                </div>
                            </div>

                            {/* ========== BIO ========== */}
                            <div className="agent-profile-field">
                                <label>Bio / About</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Tell us about yourself..."
                                    disabled={saving}
                                />
                            </div>

                            {/* SAVE BUTTON */}
                            <button
                                type="submit"
                                className="agent-profile-save-btn"
                                disabled={saving}
                            >
                                {saving ? (
                                    <><FaSpinner className="spin" /> Saving...</>
                                ) : (
                                    <><FaSave /> Save Changes</>
                                )}
                            </button>
                        </form>

                        {/* ========== PASSWORD SECTION ========== */}
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

                                    <div className="agent-profile-field">
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

                                    <div className="agent-profile-field">
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

                                    <div className="agent-profile-field">
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
                                        className="agent-profile-save-btn password-save-btn"
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
        </div>
    );
};

export default AgentProfile;