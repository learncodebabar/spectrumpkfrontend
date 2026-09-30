// src/Pages/Admin/CertificatePreview.jsx
import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaUser, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import agentApi from '../../../../api/agentApi';
import { getFileUrl } from '../../../../api/config';
import bgimg from '../../../../assets/imgs/image.png';
import './CertificatePreview.css';

const CertificatePreview = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState(null);
    const [error, setError] = useState('');

    const sampleAgent = {
        name: 'John Anderson',
        jobTitle: 'Senior Education Consultant',
        company: 'Global Edu Services',
        email: 'john@example.com',
        city: 'Karachi',
        state: 'Sindh',
        country: 'Pakistan',
        experience: '5-10 Years',
        education: "Master's Degree",
        specialization: 'Study Abroad Guidance',
        signature: ''
    };

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const res = await agentApi.getCertificateSettings();
                if (res.success) setSettings(res.settings);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load settings');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return (
            <div className="cert-preview-loading">
                <FaSpinner className="spin" /> Loading preview...
            </div>
        );
    }

    if (error || !settings) {
        return (
            <div className="cert-preview-loading">
                <p>{error || 'Settings not found'}</p>
            </div>
        );
    }

    const issued = new Date();
    const validTo = new Date();
    validTo.setFullYear(validTo.getFullYear() + Number(settings.validityYears || 1));

    const fmt = (d) => d.toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    const logoSrc = settings.logo
        ? (settings.logo.startsWith('http') ? settings.logo : getFileUrl(settings.logo))
        : null;

    const sigSrc = settings.signatureImage
        ? (settings.signatureImage.startsWith('http')
            ? settings.signatureImage
            : getFileUrl(settings.signatureImage))
        : null;

    return (
        <div className="cert-preview-page">

            <div className="cert-preview-bar no-print">
                <button
                    className="cert-preview-back"
                    onClick={() => navigate(-1)}
                >
                    <FaArrowLeft /> Back to Settings
                </button>
                <span className="cert-preview-badge">
                    <FaUser /> Sample Agent Preview
                </span>
            </div>

            <div className="cert-preview-wrapper">
                <div
                    className="agent-cert"
                    style={{
                        backgroundImage: `url(${bgimg})`,
                        backgroundSize: '100% 100%',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center'
                    }}
                >
                    <div className="agent-cert-content">

                        {/* ===== HEADER ===== */}
                        <div className="agent-cert-header">
                            <div className="agent-cert-logo">
                                {logoSrc ? (
                                    <img
                                        src={logoSrc}
                                        alt="Logo"
                                        className="agent-cert-logo-img"
                                    />
                                ) : (
                                    <div className="agent-cert-logo-placeholder" />
                                )}
                            </div>
                            <h1 className="agent-cert-org-name">{settings.orgName}</h1>
                        </div>

                        {/* ===== TITLE — Old English / Blackletter ===== */}
                        <h2 className="agent-cert-title">
                            {settings.certificateTitle}
                        </h2>

                        {/* ===== PRESENTED TO ===== */}
                        <p className="agent-cert-body-text">
                            {settings.certifyText}
                        </p>

                        {/* ===== NAME — Script/Calligraphy ===== */}
                        <h3 className="agent-cert-name">
                            {sampleAgent.name}
                        </h3>

                        {/* ===== ROLE ===== */}
                        <p className="agent-cert-role">
                            {sampleAgent.jobTitle}
                            {sampleAgent.company ? ` at ${sampleAgent.company}` : ''}
                        </p>

                        {/* ===== DESCRIPTION ===== */}
                        <p className="agent-cert-description">
                            {settings.description}
                        </p>

                        {/* ===== VALIDITY ===== */}
                        <p className="agent-cert-validity">
                            <strong>Validity:</strong> {fmt(issued)} – {fmt(validTo)}
                        </p>

                        {/* ===== FOOTER ===== */}
                        <div className="agent-cert-footer">

                            {/* Signature (Left) */}
                            <div className="agent-cert-footer-item">
                                {sigSrc ? (
                                    <img
                                        src={sigSrc}
                                        alt="Signature"
                                        className="agent-cert-signature-img"
                                    />
                                ) : (
                                    <div className="agent-cert-signature-placeholder">
                                        {settings.signatoryName}
                                    </div>
                                )}
                                <div className="agent-cert-footer-line" />
                                <span className="agent-cert-footer-label">
                                    {settings.signatoryName}
                                </span>
                                <span className="agent-cert-footer-sublabel">
                                    {settings.signatoryRole}
                                </span>
                            </div>

                            {/* Seal (Center) */}
                            <div className="agent-cert-seal-wrapper">
                                <div
                                    className="agent-cert-seal"
                                    style={{
                                        background: `radial-gradient(circle, ${settings.sealColor} 0%, ${darken(settings.sealColor)} 100%)`
                                    }}
                                >
                                    <div className="agent-cert-seal-inner">
                                        <div className="agent-cert-seal-star">★</div>
                                        <div className="agent-cert-seal-text">
                                            {settings.sealText}
                                        </div>
                                        <div className="agent-cert-seal-subtext">
                                            {settings.sealSubText}
                                        </div>
                                        <div className="agent-cert-seal-stars">★ ★ ★</div>
                                    </div>
                                </div>
                            </div>

                            {/* Date (Right) */}
                            <div className="agent-cert-footer-item">
                                <div className="agent-cert-date-value">
                                    {fmt(issued)}
                                </div>
                                <div className="agent-cert-footer-line" />
                                <span className="agent-cert-footer-label">
                                    Date
                                </span>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper: darken hex color
function darken(hex) {
    try {
        const c = hex.replace('#', '');
        const num = parseInt(c, 16);
        const r = Math.max(0, (num >> 16) - 50);
        const g = Math.max(0, ((num >> 8) & 0x00FF) - 50);
        const b = Math.max(0, (num & 0x0000FF) - 50);
        return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
    } catch {
        return '#8b1e34';
    }
}

export default CertificatePreview;