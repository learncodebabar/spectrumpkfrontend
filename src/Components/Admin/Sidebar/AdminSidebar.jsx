// src/Layout/AdminSidebar.jsx
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from "../../../assets/imgs/logosing/Untitled design (9).png"
import { 
    FaTachometerAlt, FaUserTie, FaBuilding, FaSignOutAlt,
    FaFileAlt, FaChevronDown, FaChevronRight, FaTimes,
    FaUniversity, FaGraduationCap, FaMoneyBillWave,
    FaCertificate, FaClock, FaUsers, FaUserCircle,
    FaAddressBook              // ⭐ NEW — Contact icon
} from 'react-icons/fa';
import './AdminSidebar.css';

const AdminSidebar = ({ isOpen, onClose, isMobile }) => {
    const navigate = useNavigate();
    const [expandedMenus, setExpandedMenus] = useState({});
    const [userRole, setUserRole] = useState('admin');
    const [permissions, setPermissions] = useState([]);

    // ⭐ Load role + permissions from localStorage
    useEffect(() => {
        try {
            const role = localStorage.getItem('adminRole') || 'admin';
            setUserRole(role);

            const data = JSON.parse(localStorage.getItem('adminData') || '{}');
            setPermissions(data.permissions || []);
        } catch (e) {
            console.error('Error parsing admin data:', e);
        }
    }, []);

    // ⭐ Check if user has permission
    const hasAccess = (pageKey) => {
        // Super admin / admin = all access
        if (userRole !== 'sub_admin') return true;
        return permissions.includes(pageKey);
    };

    // ===== MENU ITEMS =====
    const allMenuItems = [
        {
            title: 'Dashboard',
            icon: <FaTachometerAlt />,
            path: '/admin/dashboard',
            exact: true,
            key: 'dashboard'
        },
        {
            title: 'Agents',
            icon: <FaUserTie />,
            path: '/admin/agents',
            key: 'agents',
            submenu: [
                { title: 'All Agents', path: '/admin/agents', exact: true },
                { title: 'Pending Approvals', path: '/admin/agents/pending' },
                { title: 'Approved', path: '/admin/agents/approved' },
                { title: 'Rejected', path: '/admin/agents/rejected' }
            ]
        },
        {
            title: 'Applications',
            icon: <FaFileAlt />,
            path: '/admin/applications',
            key: 'applications',
            submenu: [
                { title: 'All Applications', path: '/admin/applications', exact: true }
            ]
        },
        {
            title: 'Payments',
            icon: <FaMoneyBillWave />,
            path: '/admin/payments',
            key: 'payments',
            submenu: [
                { title: 'All Payments', path: '/admin/payments', exact: true },
                { title: 'Receive Payment', path: '/admin/payments/receive' },
                { title: 'Send Payment', path: '/admin/payments/send' }
            ]
        },
        {
            title: 'Universities',
            icon: <FaUniversity />,
            path: '/admin/universities',
            key: 'universities',
            submenu: [
                { title: 'All Universities', path: '/admin/universities', exact: true },
                { title: 'Add University', path: '/admin/universities/add' }
            ]
        },
        {
            title: 'Programs',
            icon: <FaGraduationCap />,
            path: '/admin/programs',
            key: 'programs',
            submenu: [
                { title: 'All Programs', path: '/admin/programs', exact: true },
                { title: 'Add Program', path: '/admin/programs/add' }
            ]
        },
        {
            title: 'Certificate',
            icon: <FaCertificate />,
            path: '/admin/certificate-settings',
            key: 'certificate-settings',
            submenu: [
                { title: 'Certificate Settings', path: '/admin/certificate-settings', exact: true },
                { title: 'Preview Certificate', path: '/admin/certificate-preview' }
            ]
        },
        {
            title: 'Renewals',
            icon: <FaClock />,
            path: '/admin/renewals',
            exact: true,
            key: 'renewals'
        },
        {
            title: 'Users',
            icon: <FaUsers />,
            path: '/admin/add-user',
            exact: true,
            key: 'users'
        },
        // ⭐ CONTACT SETTINGS — NEW
        {
            title: 'Contact',
            icon: <FaAddressBook />,
            path: '/admin/contact-settings',
            exact: true,
            key: 'contact-settings'
        },
        {
            title: 'Profile',
            icon: <FaUserCircle />,
            path: '/admin/profile',
            exact: true,
            key: 'profile'
        }
    ];

    // ⭐ Filter menus — sirf allowed pages
    const menuItems = allMenuItems.filter(item => hasAccess(item.key));

    const toggleSubmenu = (title) => {
        setExpandedMenus(prev => ({ ...prev, [title]: !prev[title] }));
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            const role = localStorage.getItem('adminRole');

            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminData');
            localStorage.removeItem('adminRole');
            localStorage.removeItem('adminProfileImage');

            if (role === 'sub_admin') {
                navigate('/sub-user/signin');
            } else {
                navigate('/signin');
            }
        }
    };

    return (
        <div className={`admin-sidebar ${isOpen ? 'admin-sidebar-open' : 'admin-sidebar-collapsed'}`}>
            {/* HEADER */}
            <div className="admin-sidebar-header">
                <div className="admin-sidebar-logo">
                    {isOpen && (
                        <img className='sidbar-logo-admin' src={logo} alt="Spectrum PK" />
                    )}
                </div>
                {isMobile && (
                    <button className="admin-sidebar-close-btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                )}
            </div>

            {/* MENU */}
            <nav className="admin-sidebar-menu">
                {menuItems.map((item, index) => (
                    <div key={index} className="admin-sidebar-menu-item-wrapper">
                        {item.submenu ? (
                            <>
                                <button
                                    className={`admin-sidebar-menu-item ${expandedMenus[item.title] ? 'admin-sidebar-expanded' : ''}`}
                                    onClick={() => toggleSubmenu(item.title)}
                                    title={!isOpen ? item.title : ''}
                                >
                                    <span className="admin-sidebar-menu-icon">{item.icon}</span>
                                    {isOpen && (
                                        <>
                                            <span className="admin-sidebar-menu-text">{item.title}</span>
                                            <span className="admin-sidebar-menu-arrow">
                                                {expandedMenus[item.title] ? <FaChevronDown /> : <FaChevronRight />}
                                            </span>
                                        </>
                                    )}
                                </button>

                                {isOpen && expandedMenus[item.title] && (
                                    <div className="admin-sidebar-submenu">
                                        {item.submenu.map((subItem, subIndex) => (
                                            <NavLink
                                                key={subIndex}
                                                to={subItem.path}
                                                className={({ isActive }) =>
                                                    `admin-sidebar-submenu-item ${isActive ? 'admin-sidebar-submenu-active' : ''}`
                                                }
                                                onClick={isMobile ? onClose : undefined}
                                                end={subItem.exact}
                                            >
                                                <span className="admin-sidebar-submenu-dot"></span>
                                                {subItem.title}
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `admin-sidebar-menu-item ${isActive ? 'admin-sidebar-menu-active' : ''}`
                                }
                                title={!isOpen ? item.title : ''}
                                onClick={isMobile ? onClose : undefined}
                                end={item.exact}
                            >
                                <span className="admin-sidebar-menu-icon">{item.icon}</span>
                                {isOpen && <span className="admin-sidebar-menu-text">{item.title}</span>}
                            </NavLink>
                        )}
                    </div>
                ))}
            </nav>

            {/* FOOTER */}
            <div className="admin-sidebar-footer">
                <button
                    className="admin-sidebar-logout-btn"
                    onClick={handleLogout}
                    title={!isOpen ? 'Logout' : ''}
                >
                    <span className="admin-sidebar-logout-icon-wrapper">
                        <FaSignOutAlt className="admin-sidebar-logout-icon" />
                    </span>
                    {isOpen && <span className="admin-sidebar-logout-text">Logout</span>}
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;