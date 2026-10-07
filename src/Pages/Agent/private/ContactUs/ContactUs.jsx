// src/Pages/Agent/private/ContactUs/ContactUs.jsx
import React, { useEffect, useState } from 'react';
import {
    FaEnvelope, FaWhatsapp, FaPhone, FaMapMarkerAlt,
    FaSpinner, FaCopy, FaCheckCircle, FaHeadset,
    FaExternalLinkAlt, FaClock
} from 'react-icons/fa';
import agentApi from '../../../../api/agentApi';
import './ContactUs.css';

const ContactUs = () => {
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState(null);
    const [copied, setCopied] = useState('');

    useEffect(() => {
        fetchContact();
        // eslint-disable-next-line
    }, []);

    const fetchContact = async () => {
        try {
            setLoading(true);
            const res = await agentApi.getPublicContactSettings();
            if (res.success) setSettings(res.settings);
        } catch (err) {
            console.error('❌ Failed to load contact:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (text, type) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(''), 2000);
    };

    const openWhatsApp = () => {
        if (!settings?.whatsappNumber) return;
        const clean = String(settings.whatsappNumber).replace(/[^0-9]/g, '');
        const msg = encodeURIComponent(settings.whatsappMessage || 'Hello! I need assistance from Spectrum PK.');
        window.open(`https://wa.me/${clean}?text=${msg}`, '_blank');
    };

    const openEmail = () => {
        if (!settings?.email) return;
        const subject = encodeURIComponent('Support Request — Spectrum PK');
        const body = encodeURIComponent('Hello Spectrum PK Team,\n\nI need assistance regarding...\n\n');
        window.location.href = `mailto:${settings.email}?subject=${subject}&body=${body}`;
    };

    const openPhone = () => {
        if (!settings?.phoneNumber) return;
        const clean = String(settings.phoneNumber).replace(/[^0-9+]/g, '');
        window.location.href = `tel:${clean}`;
    };

    const openMap = () => {
        if (!settings?.address) return;
        const query = encodeURIComponent(settings.address);
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    };

    // ============================================
    // LOADING
    // ============================================
    if (loading) {
        return (
            <div className="contact-us-page">
                <div className="contact-us-loading">
                    <FaSpinner className="spin" />
                    <p>Loading contact information...</p>
                </div>
            </div>
        );
    }

    // ============================================
    // EMPTY
    // ============================================
    const hasAnyContact = settings?.email || settings?.whatsappNumber || settings?.phoneNumber || settings?.address;

    if (!hasAnyContact) {
        return (
            <div className="contact-us-page">
                <div className="contact-us-empty">
                    <FaHeadset />
                    <h2>No Contact Info Available</h2>
                    <p>Contact information has not been set up by admin yet. Please try again later.</p>
                </div>
            </div>
        );
    }

    // ============================================
    // RENDER
    // ============================================
    return (
        <div className="contact-us-page">

            {/* HEADER */}
            <div className="contact-us-header">
                <div className="contact-us-header-icon">
                    <FaHeadset />
                </div>
                <div>
                    <h1>Contact Us</h1>
                    <p>Get in touch with Spectrum PK support team</p>
                </div>
            </div>

            {/* CONTACT OPTIONS GRID */}
            <div className="contact-us-grid">

                {/* ⭐ WHATSAPP */}
                {settings.whatsappNumber && (
                    <div className="contact-us-card contact-us-whatsapp">
                        <div className="contact-us-card-icon">
                            <FaWhatsapp />
                        </div>
                        <div className="contact-us-card-body">
                            <h3>WhatsApp</h3>
                            <p className="contact-us-value">{settings.whatsappNumber}</p>
                            <p className="contact-us-desc">
                                Chat with us instantly on WhatsApp
                            </p>
                        </div>
                        <div className="contact-us-card-actions">
                            <button
                                className="contact-us-btn primary"
                                onClick={openWhatsApp}
                            >
                                <FaWhatsapp /> Chat Now
                            </button>
                            <button
                                className="contact-us-btn ghost"
                                onClick={() => handleCopy(settings.whatsappNumber, 'whatsapp')}
                                title="Copy number"
                            >
                                {copied === 'whatsapp' ? <FaCheckCircle /> : <FaCopy />}
                            </button>
                        </div>
                    </div>
                )}

                {/* ⭐ EMAIL */}
                {settings.email && (
                    <div className="contact-us-card contact-us-email">
                        <div className="contact-us-card-icon">
                            <FaEnvelope />
                        </div>
                        <div className="contact-us-card-body">
                            <h3>Email</h3>
                            <p className="contact-us-value">{settings.email}</p>
                            <p className="contact-us-desc">
                                Send us an email — we reply within 24 hours
                            </p>
                        </div>
                        <div className="contact-us-card-actions">
                            <button
                                className="contact-us-btn primary"
                                onClick={openEmail}
                            >
                                <FaEnvelope /> Send Email
                            </button>
                            <button
                                className="contact-us-btn ghost"
                                onClick={() => handleCopy(settings.email, 'email')}
                                title="Copy email"
                            >
                                {copied === 'email' ? <FaCheckCircle /> : <FaCopy />}
                            </button>
                        </div>
                    </div>
                )}

                {/* ⭐ PHONE */}
                {settings.phoneNumber && (
                    <div className="contact-us-card contact-us-phone">
                        <div className="contact-us-card-icon">
                            <FaPhone />
                        </div>
                        <div className="contact-us-card-body">
                            <h3>Call Us</h3>
                            <p className="contact-us-value">{settings.phoneNumber}</p>
                            <p className="contact-us-desc">
                                Available Mon-Fri, 9 AM – 6 PM
                            </p>
                        </div>
                        <div className="contact-us-card-actions">
                            <button
                                className="contact-us-btn primary"
                                onClick={openPhone}
                            >
                                <FaPhone /> Call Now
                            </button>
                            <button
                                className="contact-us-btn ghost"
                                onClick={() => handleCopy(settings.phoneNumber, 'phone')}
                                title="Copy number"
                            >
                                {copied === 'phone' ? <FaCheckCircle /> : <FaCopy />}
                            </button>
                        </div>
                    </div>
                )}

                {/* ⭐ ADDRESS */}
                {settings.address && (
                    <div className="contact-us-card contact-us-address">
                        <div className="contact-us-card-icon">
                            <FaMapMarkerAlt />
                        </div>
                        <div className="contact-us-card-body">
                            <h3>Visit Us</h3>
                            <p className="contact-us-value small">{settings.address}</p>
                            <p className="contact-us-desc">
                                Find us on Google Maps
                            </p>
                        </div>
                        <div className="contact-us-card-actions">
                            <button
                                className="contact-us-btn primary"
                                onClick={openMap}
                            >
                                <FaExternalLinkAlt /> Open Map
                            </button>
                        </div>
                    </div>
                )}

            </div>

            {/* SUPPORT HOURS */}
            <div className="contact-us-footer-card">
                <FaClock className="contact-us-footer-icon" />
                <div>
                    <h4>Support Hours</h4>
                    <p>Monday – Friday: 9:00 AM – 6:00 PM (PKT)</p>
                    <p>Saturday: 10:00 AM – 2:00 PM</p>
                </div>
            </div>

        </div>
    );
};

export default ContactUs;