// src/Pages/Admin/CertificateSettings.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
    FaSave, FaUpload, FaLink, FaTimes, FaSpinner,
    FaImage, FaEye, FaCheckCircle, FaExclamationTriangle,
    FaCertificate, FaSignature, FaPalette
} from 'react-icons/fa';
import adminApi from '../../../../api/adminApi';
import { getFileUrl } from '../../../../api/config';
import './CertificateSettings.css';

const CertificateSettings = () => {
    const logoInputRef = useRef(null);
    const signatureInputRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState({ show: false, msg: '', type: 'success' });

    const [form, setForm] = useState({
        orgName: '',
        orgTagline: '',
        certificateTitle: '',
        certifyText: '',
        description: '',
        validityYears: 1,
        sealText: '',
        sealSubText: '',
        sealColor: '#b83a52',
        signatoryName: '',
        signatoryRole: '',
        footerNote: '',
        borderTheme: 'navy-gold'
    });

    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [logoMode, setLogoMode] = useState('upload');
    const [logoUrl, setLogoUrl] = useState('');

    const [signatureFile, setSignatureFile] = useState(null);
    const [signaturePreview, setSignaturePreview] = useState('');

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
            const res = await adminApi.getCertificateSettings();
            if (res.success) {
                const s = res.settings;
                setForm({
                    orgName: s.orgName || '',
                    orgTagline: s.orgTagline || '',
                    certificateTitle: s.certificateTitle || '',
                    certifyText: s.certifyText || '',
                    description: s.description || '',
                    validityYears: s.validityYears || 1,
                    sealText: s.sealText || '',
                    sealSubText: s.sealSubText || '',
                    sealColor: s.sealColor || '#b83a52',
                    signatoryName: s.signatoryName || '',
                    signatoryRole: s.signatoryRole || '',
                    footerNote: s.footerNote || '',
                    borderTheme: s.borderTheme || 'navy-gold'
                });

                if (s.logo) {
                    setLogoPreview(getFileUrl(s.logo));
                    setLogoMode(s.logoSource === 'url' ? 'url' : 'upload');
                    setLogoUrl(s.logoSource === 'url' ? s.logo : '');
                }

                if (s.signatureImage) {
                    setSignaturePreview(getFileUrl(s.signatureImage));
                }
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

    // ===== LOGO =====
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 3 * 1024 * 1024) return showToast('Logo max 3MB', 'error');
        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
        setLogoUrl('');
    };

    const removeLogo = () => {
        setLogoFile(null);
        setLogoPreview('');
        setLogoUrl('');
        if (logoInputRef.current) logoInputRef.current.value = '';
    };

    const handleLogoModeSwitch = (mode) => {
        setLogoMode(mode);
        if (mode === 'upload') setLogoUrl('');
        else removeLogo();
    };

    // ===== SIGNATURE =====
    const handleSignatureChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) return showToast('Signature max 2MB', 'error');
        setSignatureFile(file);
        setSignaturePreview(URL.createObjectURL(file));
    };

    const removeSignature = () => {
        setSignatureFile(null);
        setSignaturePreview('');
        if (signatureInputRef.current) signatureInputRef.current.value = '';
    };

    // ===== SAVE =====
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => fd.append(k, v));

            if (logoFile) fd.append('logo', logoFile);
            if (logoMode === 'url' && logoUrl) fd.append('logoUrl', logoUrl);
            if (logoMode === 'upload' && !logoFile && !logoPreview) fd.append('logoUrl', '');

            if (signatureFile) fd.append('signatureImage', signatureFile);

            const res = await adminApi.updateCertificateSettings(fd);
            if (res.success) {
                showToast('✅ Certificate settings saved!', 'success');
            }
        } catch (err) {
            showToast(err.response?.data?.message || 'Save failed', 'error');
        } finally {
            setSaving(false);
        }
    };

    // ===== LOADING =====
    if (loading) {
        return (
            <div className="cert-settings-loading">
                <FaSpinner className="spin" /> Loading settings...
            </div>
        );
    }

    return (
        <div className="cert-settings-page">

            {toast.show && (
                <div className={`cert-settings-toast ${toast.type}`}>
                    {toast.type === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
                    <span>{toast.msg}</span>
                </div>
            )}

            <div className="cert-settings-header">
                <div>
                    <h1><FaCertificate /> Certificate Settings</h1>
                    <p>Customize the certificate shown to all approved agents</p>
                </div>
                <button
                    type="button"
                    className="cert-settings-preview-btn"
                    onClick={() => window.open('/admin/certificate-preview', '_blank')}
                >
                    <FaEye /> Open Preview
                </button>
            </div>

            <form onSubmit={handleSubmit} className="cert-settings-form">

                {/* ==================== ORGANIZATION ==================== */}
                <div className="cert-settings-section">
                    <h2>Organization Info</h2>

                    <div className="cert-settings-row">
                        <div className="cert-settings-group">
                            <label>Organization Name *</label>
                            <input
                                type="text"
                                name="orgName"
                                value={form.orgName}
                                onChange={handleChange}
                                placeholder="Agent Portal"
                                required
                            />
                        </div>
                        <div className="cert-settings-group">
                            <label>Tagline</label>
                            <input
                                type="text"
                                name="orgTagline"
                                value={form.orgTagline}
                                onChange={handleChange}
                                placeholder="Verified Partner Network"
                            />
                        </div>
                    </div>

                    {/* LOGO */}
                    <div className="cert-settings-group">
                        <label>Logo</label>
                        <div className="cert-settings-file-mode-toggle">
                            <button
                                type="button"
                                className={logoMode === 'upload' ? 'active' : ''}
                                onClick={() => handleLogoModeSwitch('upload')}
                            >
                                <FaUpload /> Upload
                            </button>
                            <button
                                type="button"
                                className={logoMode === 'url' ? 'active' : ''}
                                onClick={() => handleLogoModeSwitch('url')}
                            >
                                <FaLink /> URL
                            </button>
                        </div>

                        {logoMode === 'upload' ? (
                            <div className="cert-settings-upload-box">
                                {!logoPreview ? (
                                    <label className="cert-settings-upload-drop">
                                        <input
                                            type="file"
                                            ref={logoInputRef}
                                            accept="image/png,image/jpeg,image/svg+xml"
                                            onChange={handleLogoChange}
                                        />
                                        <FaImage className="cert-settings-upload-icon" />
                                        <p>Click to upload logo</p>
                                        <small>PNG, JPG, SVG — max 3MB</small>
                                    </label>
                                ) : (
                                    <div className="cert-settings-preview-box">
                                        <img src={logoPreview} alt="Logo" />
                                        <button
                                            type="button"
                                            className="cert-settings-remove"
                                            onClick={removeLogo}
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <input
                                type="url"
                                className="cert-settings-url-input"
                                placeholder="https://example.com/logo.png"
                                value={logoUrl}
                                onChange={(e) => {
                                    setLogoUrl(e.target.value);
                                    setLogoPreview(e.target.value);
                                }}
                            />
                        )}
                    </div>
                </div>

                {/* ==================== CONTENT ==================== */}
                <div className="cert-settings-section">
                    <h2>Certificate Content</h2>

                    <div className="cert-settings-group">
                        <label>Certificate Title *</label>
                        <input
                            type="text"
                            name="certificateTitle"
                            value={form.certificateTitle}
                            onChange={handleChange}
                            placeholder="Certificate of Representation"
                            required
                        />
                    </div>

                    <div className="cert-settings-group">
                        <label>Intro Text</label>
                        <input
                            type="text"
                            name="certifyText"
                            value={form.certifyText}
                            onChange={handleChange}
                            placeholder="This is to certify that"
                        />
                    </div>

                    <div className="cert-settings-group">
                        <label>Description Paragraph</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows="4"
                            placeholder="is hereby appointed as..."
                        />
                        <small className="cert-settings-hint">
                            Agent's name will appear above this paragraph automatically.
                        </small>
                    </div>
                </div>

                {/* ==================== VALIDITY ==================== */}
                <div className="cert-settings-section">
                    <h2>Validity</h2>
                    <div className="cert-settings-group">
                        <label>Validity Period (Years)</label>
                        <input
                            type="number"
                            name="validityYears"
                            value={form.validityYears}
                            onChange={handleChange}
                            min="1"
                            max="10"
                        />
                    </div>
                </div>

                {/* ==================== SEAL ==================== */}
                <div className="cert-settings-section">
                    <h2>Seal</h2>
                    <div className="cert-settings-row">
                        <div className="cert-settings-group">
                            <label>Seal Main Text</label>
                            <input
                                type="text"
                                name="sealText"
                                value={form.sealText}
                                onChange={handleChange}
                                placeholder="OFFICIAL"
                                maxLength="12"
                            />
                        </div>
                        <div className="cert-settings-group">
                            <label>Seal Sub Text</label>
                            <input
                                type="text"
                                name="sealSubText"
                                value={form.sealSubText}
                                onChange={handleChange}
                                placeholder="VERIFIED"
                                maxLength="12"
                            />
                        </div>
                    </div>
                    <div className="cert-settings-group">
                        <label>Seal Color</label>
                        <div className="cert-settings-color-row">
                            <input
                                type="color"
                                name="sealColor"
                                value={form.sealColor}
                                onChange={handleChange}
                                className="cert-settings-color-input"
                            />
                            <input
                                type="text"
                                name="sealColor"
                                value={form.sealColor}
                                onChange={handleChange}
                                className="cert-settings-color-text"
                            />
                        </div>
                    </div>
                </div>

                {/* ==================== SIGNATURE ==================== */}
                <div className="cert-settings-section">
                    <h2><FaSignature /> Signature</h2>

                    <div className="cert-settings-row">
                        <div className="cert-settings-group">
                            <label>Signatory Name</label>
                            <input
                                type="text"
                                name="signatoryName"
                                value={form.signatoryName}
                                onChange={handleChange}
                                placeholder="Authorized Signatory"
                            />
                        </div>
                        <div className="cert-settings-group">
                            <label>Signatory Role</label>
                            <input
                                type="text"
                                name="signatoryRole"
                                value={form.signatoryRole}
                                onChange={handleChange}
                                placeholder="Agent Portal"
                            />
                        </div>
                    </div>

                    <div className="cert-settings-group">
                        <label>Signature Image (Optional)</label>
                        {!signaturePreview ? (
                            <label className="cert-settings-upload-drop">
                                <input
                                    type="file"
                                    ref={signatureInputRef}
                                    accept="image/png,image/jpeg"
                                    onChange={handleSignatureChange}
                                />
                                <FaSignature className="cert-settings-upload-icon" />
                                <p>Click to upload signature</p>
                                <small>PNG, JPG — max 2MB</small>
                            </label>
                        ) : (
                            <div className="cert-settings-preview-box small">
                                <img src={signaturePreview} alt="Signature" />
                                <button
                                    type="button"
                                    className="cert-settings-remove"
                                    onClick={removeSignature}
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ==================== BORDER THEME ==================== */}
                <div className="cert-settings-section">
                    <h2><FaPalette /> Border Theme</h2>
                    <div className="cert-settings-theme-grid">
                        {[
                            { id: 'navy-gold', label: 'Navy + Gold', cls: 'theme-navy-gold' },
                            { id: 'blue-scallop', label: 'Blue Scallop', cls: 'theme-blue-scallop' },
                            { id: 'classic-green', label: 'Classic Green', cls: 'theme-classic-green' },
                            { id: 'modern-purple', label: 'Modern Purple', cls: 'theme-modern-purple' }
                        ].map(theme => (
                            <label
                                key={theme.id}
                                className={`cert-settings-theme-option ${form.borderTheme === theme.id ? 'active' : ''}`}
                            >
                                <input
                                    type="radio"
                                    name="borderTheme"
                                    value={theme.id}
                                    checked={form.borderTheme === theme.id}
                                    onChange={handleChange}
                                />
                                <div className={`cert-settings-theme-preview ${theme.cls}`} />
                                <span>{theme.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* ==================== SAVE ==================== */}
                <div className="cert-settings-actions">
                    <button
                        type="submit"
                        className="cert-settings-save-btn"
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
        </div>
    );
};

export default CertificateSettings;