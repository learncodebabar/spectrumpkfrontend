// src/Layout/AdminNavbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    FaBars, 
    FaBell, 
    FaUser, 
    FaSignOutAlt,
    FaChevronDown,
    FaUserPlus,
    FaClipboardList,
    FaUserTie,
    FaCamera,
    FaTimes
} from 'react-icons/fa';
import './AdminNavbar.css';

const AdminNavbar = ({ onToggleSidebar, isMobile, sidebarOpen }) => {
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const fileInputRef = useRef(null);
    
    // ===== STATE =====
    const [adminData, setAdminData] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // ===== NOTIFICATIONS =====
    const [notifications] = useState([
        {
            id: 1,
            title: 'New Agent Registration',
            message: 'John Doe has registered as an agent',
            time: '5 min ago',
            unread: true,
            type: 'agent'
        },
        {
            id: 2,
            title: 'Pending Approval',
            message: '3 agents waiting for approval',
            time: '1 hour ago',
            unread: true,
            type: 'approval'
        },
        {
            id: 3,
            title: 'New User Registered',
            message: 'Sarah Smith joined the platform',
            time: '2 hours ago',
            unread: false,
            type: 'user'
        }
    ]);

    // ===== SHOW TOAST =====
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    // ===== GET ADMIN DATA + PROFILE IMAGE =====
    useEffect(() => {
        try {
            const data = localStorage.getItem('adminData');
            if (data) {
                setAdminData(JSON.parse(data));
            }
            
            const savedImage = localStorage.getItem('adminProfileImage');
            if (savedImage) {
                setProfileImage(savedImage);
            }
        } catch (error) {
            console.error('Error parsing admin data:', error);
        }
    }, []);

    // ===== CLOSE DROPDOWN ON OUTSIDE CLICK =====
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // ===== HANDLE LOGOUT =====
    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminData');
            localStorage.removeItem('adminProfileImage');
            localStorage.removeItem('adminRole');
            navigate('/signin');
        }
    };

    // ============================================
    // PROFILE IMAGE UPLOAD
    // ============================================
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showToast('Please select an image file (JPG, PNG)', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showToast('Image size should be less than 5MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Image = reader.result;
            
            try {
                localStorage.setItem('adminProfileImage', base64Image);
                setProfileImage(base64Image);
                showToast('✅ Profile image updated!', 'success');
            } catch (error) {
                if (error.name === 'QuotaExceededError') {
                    showToast('Image too large for storage. Try smaller image.', 'error');
                } else {
                    showToast('Failed to save image', 'error');
                }
            }
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        if (window.confirm('Remove profile image?')) {
            localStorage.removeItem('adminProfileImage');
            setProfileImage(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            showToast('Profile image removed', 'success');
        }
    };

    // ===== GET UNREAD COUNT =====
    const unreadCount = notifications.filter(n => n.unread).length;

    // ===== GET INITIALS =====
    const getInitials = (name) => {
        if (!name) return 'A';
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const avatarSrc = profileImage || adminData?.profileImage || null;

    // ============================================
    // RENDER
    // ============================================
    return (
        <>
            {/* TOAST */}
            {toast.show && (
                <div className={`admin-navbar-toast admin-navbar-toast-${toast.type}`}>
                    <span>{toast.message}</span>
                </div>
            )}

            <header className="admin-navbar">
                <div className="navbar-inner">
                    {/* ===== LEFT SECTION ===== */}
                    <div className="navbar-left">
                        {/* Toggle Sidebar Button */}
                        <button 
                            className="navbar-toggle-btn"
                            onClick={onToggleSidebar}
                            aria-label="Toggle Sidebar"
                        >
                            <FaBars />
                        </button>

                        {/* ===== ACTION BUTTONS ===== */}
                        <div className="navbar-actions">
                            {/* ⭐ All Agents → /admin/agents */}
                            <Link to="/admin/agents" className="action-btn primary">
                                <FaUserTie />
                                <span>All Agents</span>
                            </Link>

                            {/* View Applications → /admin/applications */}
                            <Link to="/admin/applications" className="action-btn secondary">
                                <FaClipboardList />
                                <span>View Applications</span>
                            </Link>

                            {/* ⭐ Add New User → /admin/add-user */}
                            <Link to="/admin/add-user" className="action-btn tertiary">
                                <FaUserPlus />
                                <span>Add New User</span>
                            </Link>
                        </div>
                    </div>

                    {/* ===== RIGHT SECTION ===== */}
                    <div className="navbar-right" ref={dropdownRef}>
                        {/* Notifications */}
                        <div className="navbar-dropdown-wrapper">
                            <button 
                                className="navbar-icon-btn notification-btn"
                                onClick={() => {
                                    setShowNotifications(!showNotifications);
                                    setShowProfileDropdown(false);
                                }}
                                title="Notifications"
                            >
                                <FaBell />
                                {unreadCount > 0 && (
                                    <span className="notification-badge">{unreadCount}</span>
                                )}
                            </button>

                            {showNotifications && (
                                <div className="navbar-dropdown notifications-dropdown">
                                    <div className="dropdown-header">
                                        <h3>Notifications</h3>
                                        {unreadCount > 0 && (
                                            <button className="mark-read-btn">
                                                Mark all as read
                                            </button>
                                        )}
                                    </div>

                                    <div className="notifications-list">
                                        {notifications.length > 0 ? (
                                            notifications.map((notif) => (
                                                <div 
                                                    key={notif.id} 
                                                    className={`notification-item ${notif.unread ? 'unread' : ''}`}
                                                >
                                                    <div className={`notification-dot ${notif.type}`}></div>
                                                    <div className="notification-content">
                                                        <h4>{notif.title}</h4>
                                                        <p>{notif.message}</p>
                                                        <span className="notification-time">{notif.time}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="empty-notifications">
                                                <p>No notifications</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="dropdown-footer">
                                        <Link to="/admin/notifications">View all notifications</Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile Dropdown */}
                        <div className="navbar-dropdown-wrapper">
                            <button 
                                className="profile-btn"
                                onClick={() => {
                                    setShowProfileDropdown(!showProfileDropdown);
                                    setShowNotifications(false);
                                }}
                            >
                                <div className="profile-avatar">
                                    {avatarSrc ? (
                                        <img src={avatarSrc} alt="Profile" />
                                    ) : (
                                        <span>{getInitials(adminData?.name)}</span>
                                    )}
                                </div>
                                <div className="profile-info">
                                    <span className="profile-name">
                                        {adminData?.name || 'Admin'}
                                    </span>
                                    <span className="profile-role">
                                        {adminData?.role === 'sub_admin' ? 'Sub Admin' : 'Administrator'}
                                    </span>
                                </div>
                                <FaChevronDown className={`profile-arrow ${showProfileDropdown ? 'rotate' : ''}`} />
                            </button>

                            {showProfileDropdown && (
                                <div className="navbar-dropdown profile-dropdown">
                                    {/* Header with avatar + upload */}
                                    <div className="profile-header">
                                        <div className="profile-avatar-large-wrapper">
                                            <div className="profile-avatar-large">
                                                {avatarSrc ? (
                                                    <img src={avatarSrc} alt="Profile" />
                                                ) : (
                                                    <span>{getInitials(adminData?.name)}</span>
                                                )}
                                            </div>

                                            <button
                                                className="avatar-upload-btn"
                                                onClick={() => fileInputRef.current?.click()}
                                                title="Change profile image"
                                            >
                                                <FaCamera />
                                            </button>

                                            {avatarSrc && (
                                                <button
                                                    className="avatar-remove-btn"
                                                    onClick={handleRemoveImage}
                                                    title="Remove image"
                                                >
                                                    <FaTimes />
                                                </button>
                                            )}

                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                style={{ display: 'none' }}
                                            />
                                        </div>

                                        <div className="profile-details">
                                            <h4>{adminData?.name || 'Admin'}</h4>
                                            <p>{adminData?.email || 'admin@example.com'}</p>
                                        </div>
                                    </div>

                                    {/* ⭐ ONLY My Profile — Settings REMOVED */}
                                    <div className="profile-menu">
                                        <Link to="/admin/profile" className="profile-menu-item">
                                            <FaUser />
                                            <span>My Profile</span>
                                        </Link>
                                    </div>

                                    <div className="profile-footer">
                                        <button 
                                            className="logout-menu-btn"
                                            onClick={handleLogout}
                                        >
                                            <FaSignOutAlt />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default AdminNavbar;