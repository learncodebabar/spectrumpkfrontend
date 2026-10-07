// src/Pages/Admin/private/ContactSettings/ContactSettings.jsx
import React, { useState, useEffect } from 'react';
import {
    FaEnvelope, FaWhatsapp, FaPhone, FaMapMarkerAlt,
    FaSave, FaSpinner, FaCheckCircle, FaExclamationTriangle,
    FaPaperPlane, FaAddressBook
} from 'react-icons/fa';
import adminApi from '../../../../api/adminApi';
import './ContactSettings.css';

const ContactSettings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState({ show: false, msg: '', type: 'success' });

    const [form, setForm] = useState({
        email: '',
        whatsappNumber: '',
        whatsappMessage: '',
        phoneNumber: '',
        address: ''
    });

    const showToast = (msg, type = 'success') => {
        setToast({ show: true, msg, type });
        setTimeout(() => setToast({ show: false, msg: '', type: 'success' }), 4000);
    };

    useEffect(() => {
        fetchSettings();
        // eslint-disable-next-line
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const res = await adminApi.getContactSettings();
            if (res.success) {
                const s = res.settings;
                setForm({
                    email: s.email || '',
                    whatsappNumber: s.whatsappNumber || '',
                    whatsappMessage: s.whatsappMessage || 'Hello! I need assistance from Spectrum PK.',
                    phoneNumber: s.phoneNumber || '',
                    address: s.address || ''
                });
            }
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to load settings', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // ⭐ Format whatsapp number preview
    const getWhatsAppPreviewURL = () => {
        const clean = String(form.whatsappNumber || '').replace(/[^0-9]/g, '');
        if (!clean) return '';
        const msg = encodeURIComponent(form.whatsappMessage || 'Hello!');
        return `https://wa.me/${clean}?text=${msg}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate email
        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            return showToast('Please enter a valid email', 'error');
        }

        // Validate whatsapp number format
        if (form.whatsappNumber && !/^[0-9]{10,15}$/.test(form.whatsappNumber.replace(/[^0-9]/g, ''))) {
            return showToast('WhatsApp number must be 10-15 digits (with country code)', 'error');
        }

        setSaving(true);
        try {
            const res = await adminApi.updateContactSettings(form);
            if (res.success) {
                showToast('✅ Contact settings saved!', 'success');
            }
        } catch (err) {
            showToast(err.response?.data?.message || 'Save failed', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="contact-settings-loading">
                <FaSpinner className="spin" />
                <p>Loading contact settings...</p>
            </div>
        );
    }

    const previewURL = getWhatsAppPreviewURL();

    return (
        <div className="contact-settings-page">

            {toast.show && (
                <div className={`contact-settings-toast ${toast.type}`}>
                    {toast.type === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
                    <span>{toast.msg}</span>
                </div>
            )}

            {/* HEADER */}
            <div className="contact-settings-header">
                <div>
                    <h1><FaAddressBook /> Contact Settings</h1>
                    <p>Set your support email and WhatsApp number</p>
                </div>
            </div>

            <div className="contact-settings-layout">

                {/* LEFT: FORM */}
                <form onSubmit={handleSubmit} className="contact-settings-form">

                    {/* EMAIL */}
                    <div className="contact-settings-section">
                        <h2><FaEnvelope /> Support Email</h2>
                        <p className="contact-settings-hint">
                            Ye email agents aur sub-users ko dikhayi jayegi.
                        </p>
                        <div className="contact-settings-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="support@spectrumpk.com"
                            />
                        </div>
                    </div>

                    {/* WHATSAPP */}
                    <div className="contact-settings-section">
                        <h2><FaWhatsapp /> WhatsApp</h2>
                        <p className="contact-settings-hint">
                            Ye number floating WhatsApp button pe use hoga — Agent aur Sub-User dono ke dashboards pe.
                        </p>

                        <div className="contact-settings-group">
                            <label>WhatsApp Number (with country code)</label>
                            <input
                                type="text"
                                name="whatsappNumber"
                                value={form.whatsappNumber}
                                onChange={handleChange}
                                placeholder="923001234567"
                            />
                            <small className="contact-settings-helper">
                                Format: <strong>CountryCode + Number</strong> (no +, no spaces). Example: <code>923001234567</code>
                            </small>
                        </div>

                        <div className="contact-settings-group">
                            <label>Pre-filled Message</label>
                            <textarea
                                name="whatsappMessage"
                                value={form.whatsappMessage}
                                onChange={handleChange}
                                rows="2"
                                placeholder="Hello! I need assistance from Spectrum PK."
                            />
                            <small className="contact-settings-helper">
                                Ye message WhatsApp chat mein auto-fill hoga jab koi button click karega.
                            </small>
                        </div>
                    </div>

                    {/* OPTIONAL */}
                    <div className="contact-settings-section">
                        <h2><FaPhone /> Optional Contact Info</h2>

                        <div className="contact-settings-group">
                            <label>Phone Number (optional)</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={form.phoneNumber}
                                onChange={handleChange}
                                placeholder="+92 300 1234567"
                            />
                        </div>

                        <div className="contact-settings-group">
                            <label><FaMapMarkerAlt /> Address (optional)</label>
                            <textarea
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                rows="2"
                                placeholder="Office address..."
                            />
                        </div>
                    </div>

                    {/* SAVE */}
                    <div className="contact-settings-actions">
                        <button
                            type="submit"
                            className="contact-settings-save-btn"
                            disabled={saving}
                        >
                            {saving ? (
                                <><FaSpinner className="spin" /> Saving...</>
                            ) : (
                                <><FaSave /> Save Settings</>
                            )}
                        </button>
                    </div>

                </form>

                {/* RIGHT: PREVIEW */}
                <div className="contact-settings-preview-pane">

                    <div className="contact-settings-preview-header">
                        <FaPaperPlane /> Live Preview
                    </div>

                    {/* WhatsApp Button Preview */}
                    {form.whatsappNumber ? (
                        <div className="contact-preview-card">
                            <h3>WhatsApp Button</h3>
                            <p>Ye button agents/sub-users ke dashboard pe floating dikhega:</p>

                            <div className="whatsapp-preview-float">
                                <div className="whatsapp-preview-btn">
                                    <FaWhatsapp />
                                </div>
                            </div>

                            <div className="whatsapp-preview-info">
                                <div className="whatsapp-preview-row">
                                    <strong>Number:</strong>
                                    <span>{form.whatsappNumber}</span>
                                </div>
                                <div className="whatsapp-preview-row">
                                    <strong>Message:</strong>
                                    <span>"{form.whatsappMessage || 'No message'}"</span>
                                </div>
                                {previewURL && (
                                    <a
                                        href={previewURL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="whatsapp-preview-test"
                                    >
                                        <FaWhatsapp /> Test on WhatsApp
                                    </a>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="contact-preview-empty">
                            <FaWhatsapp />
                            <p>Enter WhatsApp number to see preview</p>
                        </div>
                    )}

                    {/* Email Preview */}
                    {form.email && (
                        <div className="contact-preview-card">
                            <h3><FaEnvelope /> Support Email</h3>
                            <div className="email-preview-box">
                                {form.email}
                            </div>
                            <a
                                href={`mailto:${form.email}`}
                                className="email-preview-test"
                            >
                                <FaEnvelope /> Send test email
                            </a>
                        </div>
                    )}

                </div>

            </div>
        </div>
    );
};

export default ContactSettings;