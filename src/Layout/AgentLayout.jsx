// src/Layout/AgentLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import AgentSidebar from '../Components/Agent/Sidebar/AgentSidebar';
import AgentNavbar from '../Components/Agent/Navbar/AgentNavbar';
import agentApi from '../api/agentApi';
import { FaBars, FaWhatsapp, FaTimes } from 'react-icons/fa';
import './AgentLayout.css';

// ============================================
// ⭐ WHATSAPP BUTTON (inline, safe z-index)
// ============================================
const WhatsAppButton = () => {
    const [contactNumber, setContactNumber] = useState('');
    const [message, setMessage] = useState('Hello! I need assistance from Spectrum PK.');
    const [email, setEmail] = useState('');
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await agentApi.getPublicContactSettings();
            if (res.success && res.settings) {
                setContactNumber(res.settings.whatsappNumber || '');
                setMessage(res.settings.whatsappMessage || 'Hello! I need assistance from Spectrum PK.');
                setEmail(res.settings.email || '');
            }
        } catch (err) {
            console.error('WhatsAppButton error:', err);
        }
    };

    if (!contactNumber) return null;

    const handleWhatsAppClick = () => {
        let cleanNumber = String(contactNumber).replace(/[^0-9]/g, '');
        if (cleanNumber.startsWith('0')) {
            cleanNumber = '92' + cleanNumber.slice(1);
        }
        const encodedMsg = encodeURIComponent(message);
        window.open(`https://wa.me/${cleanNumber}?text=${encodedMsg}`, '_blank', 'noopener,noreferrer');
        setShowPopup(false);
    };

    const handleEmailClick = () => {
        if (!email) return;
        const subject = encodeURIComponent('Support Request — Spectrum PK');
        window.location.href = `mailto:${email}?subject=${subject}`;
        setShowPopup(false);
    };

    return (
        <>
            {showPopup && (
                <div className="whatsapp-popup">
                    <button
                        className="whatsapp-popup-close"
                        onClick={() => setShowPopup(false)}
                    >
                        <FaTimes />
                    </button>

                    <div className="whatsapp-popup-header">
                        <div className="whatsapp-popup-avatar">
                            <FaWhatsapp />
                        </div>
                        <div>
                            <strong>Spectrum PK Support</strong>
                            <span className="whatsapp-popup-status">● Online</span>
                        </div>
                    </div>

                    <p className="whatsapp-popup-text">
                        Hi there! 👋<br />
                        Need help? Chat with us on WhatsApp.
                    </p>

                    <div className="whatsapp-popup-actions">
                        <button
                            className="whatsapp-popup-btn whatsapp"
                            onClick={handleWhatsAppClick}
                        >
                            <FaWhatsapp /> Start Chat
                        </button>

                        {email && (
                            <button
                                className="whatsapp-popup-btn email"
                                onClick={handleEmailClick}
                            >
                                ✉️ Send Email
                            </button>
                        )}
                    </div>
                </div>
            )}

            <button
                className="whatsapp-float-btn"
                onClick={() => setShowPopup(!showPopup)}
                title="Contact Support"
            >
                <FaWhatsapp />
            </button>
        </>
    );
};

// ============================================
// AGENT LAYOUT
// ============================================
const AgentLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    // Auth check
    useEffect(() => {
        const token = localStorage.getItem('agentToken');
        const agentData = localStorage.getItem('agentData');
        if (!token || !agentData) {
            navigate('/agent/login');
            return;
        }
        try {
            const agent = JSON.parse(agentData);
            if (agent.approvalStatus !== 'approved') {
                navigate('/agent/status');
            }
        } catch {
            navigate('/agent/login');
        }
    }, [navigate]);

    // Responsive
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const mobile = width < 768;
            setIsMobile(mobile);

            if (mobile) {
                setMobileSidebarOpen(false);
            } else if (width < 1024) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Close mobile sidebar on route change
    useEffect(() => {
        if (isMobile) setMobileSidebarOpen(false);
    }, [location.pathname, isMobile]);

    const toggleSidebar = () => {
        if (isMobile) setMobileSidebarOpen(prev => !prev);
        else setSidebarOpen(prev => !prev);
    };

    const closeMobileSidebar = () => setMobileSidebarOpen(false);
    const effectiveOpen = isMobile ? mobileSidebarOpen : sidebarOpen;

    return (
        <div className="agent-layout">
            {isMobile && !mobileSidebarOpen && (
                <button
                    className="agent-sidebar-show-btn"
                    onClick={() => setMobileSidebarOpen(true)}
                    aria-label="Show Sidebar"
                >
                    <FaBars />
                    <span>Menu</span>
                </button>
            )}

            {isMobile && mobileSidebarOpen && (
                <div
                    className="agent-sidebar-overlay"
                    onClick={closeMobileSidebar}
                />
            )}

            <aside
                className={`agent-sidebar-container ${
                    isMobile
                        ? (mobileSidebarOpen ? 'agent-sidebar-mobile-open' : 'agent-sidebar-mobile-closed')
                        : (sidebarOpen ? 'agent-sidebar-open' : 'agent-sidebar-closed')
                }`}
            >
                <AgentSidebar
                    isOpen={effectiveOpen}
                    onClose={closeMobileSidebar}
                    isMobile={isMobile}
                    onToggle={toggleSidebar}
                />
            </aside>

            <div className={`agent-main-container ${
                !isMobile && sidebarOpen ? 'agent-sidebar-open' : 'agent-sidebar-closed'
            }`}>
                <AgentNavbar
                    onToggleSidebar={toggleSidebar}
                    isMobile={isMobile}
                    sidebarOpen={effectiveOpen}
                />

                <main className="agent-content">
                    <div className="agent-content-inner">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* WhatsApp Button — fixed, out of layout flow */}
            <WhatsAppButton />
        </div>
    );
};

export default AgentLayout;