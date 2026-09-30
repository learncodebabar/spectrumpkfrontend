// src/Pages/Agent/private/AgentCertificate.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
    FaPrint, FaArrowLeft, FaSpinner,
    FaFilePdf, FaFileImage, FaExclamationTriangle,
    FaClock, FaCheckCircle, FaRedo
} from 'react-icons/fa';
import agentApi from '../../../../api/agentApi';
import { getFileUrl } from '../../../../api/config';
import bgimg from '../../../../assets/imgs/image.png';
import './AgentCertificate.css';

const AgentCertificate = () => {
    const navigate = useNavigate();
    const certificateRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [renewing, setRenewing] = useState(false);
    const [certificate, setCertificate] = useState(null);
    const [settings, setSettings] = useState(null);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        fetchAll();
        // eslint-disable-next-line
    }, []);

    const fetchAll = async () => {
        try {
            setLoading(true);
            const [certRes, settingsRes] = await Promise.all([
                agentApi.getCertificate(),
                agentApi.getCertificateSettings()
            ]);
            if (certRes.success) setCertificate(certRes.certificate);
            if (settingsRes.success) setSettings(settingsRes.settings);
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to load certificate';
            setError(msg);
            setStatus(err.response?.data?.status || '');
        } finally {
            setLoading(false);
        }
    };

    // ============================================
    // DOWNLOADS
    // ============================================
    const downloadAsImage = async () => {
        if (!certificateRef.current) return;
        setDownloading(true);
        try {
            const canvas = await html2canvas(certificateRef.current, {
                scale: 2, useCORS: true, backgroundColor: '#fdfcf7'
            });
            const link = document.createElement('a');
            link.download = `Agent-Certificate-${certificate.certificateId}.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();
        } catch (err) {
            console.error('Download Error:', err);
            alert('Failed to download image');
        } finally {
            setDownloading(false);
        }
    };

    const downloadAsPDF = async () => {
        if (!certificateRef.current) return;
        setDownloading(true);
        try {
            const canvas = await html2canvas(certificateRef.current, {
                scale: 2, useCORS: true, backgroundColor: '#fdfcf7'
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const imgRatio = canvas.width / canvas.height;
            let imgW = pageWidth;
            let imgH = pageWidth / imgRatio;
            if (imgH > pageHeight) { imgH = pageHeight; imgW = pageHeight * imgRatio; }
            const xOffset = (pageWidth - imgW) / 2;
            const yOffset = (pageHeight - imgH) / 2;
            pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgW, imgH);
            pdf.save(`Agent-Certificate-${certificate.certificateId}.pdf`);
        } catch (err) {
            console.error('PDF Error:', err);
            alert('Failed to download PDF');
        } finally {
            setDownloading(false);
        }
    };

    const handlePrint = () => window.print();

    // ============================================
    // RENEWAL REQUEST
    // ============================================
    const handleRenewalRequest = async () => {
        if (renewing) return;
        if (!window.confirm('Apply for certificate renewal? Admin will review your request.')) return;
        setRenewing(true);
        try {
            await agentApi.requestRenewal({});
            alert('✅ Renewal request submitted! Admin will review it soon.');
            fetchAll();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to submit renewal request');
        } finally {
            setRenewing(false);
        }
    };

    // ============================================
    // LOADING
    // ============================================
    if (loading) {
        return (
            <div className="agent-cert-page">
                <div className="agent-cert-loading">
                    <FaSpinner className="agent-cert-spinner" />
                    <p>Loading your certificate...</p>
                </div>
            </div>
        );
    }

    // ============================================
    // NOT APPROVED / ERROR
    // ============================================
    if (error || !certificate) {
        const isPending = status === 'pending';
        const isRejected = status === 'rejected';

        return (
            <div className="agent-cert-page">
                <div className="agent-cert-status-card">
                    <div className={`agent-cert-status-icon ${isPending ? 'pending' : isRejected ? 'rejected' : 'error'}`}>
                        {isPending ? <FaClock /> : <FaExclamationTriangle />}
                    </div>
                    <h2>
                        {isPending ? 'Certificate Pending' : isRejected ? 'Account Rejected' : 'Certificate Not Available'}
                    </h2>
                    <p>
                        {isPending
                            ? 'Your account is currently under admin review. Once approved, your certificate will be available here.'
                            : isRejected
                                ? 'Your account was rejected. Certificate cannot be issued.'
                                : error}
                    </p>
                    <button className="agent-cert-back-btn" onClick={() => navigate('/agent/dashboard')}>
                        <FaArrowLeft /> Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // ============================================
    // PREPARE DATA
    // ============================================
    const { agent } = certificate;

    const orgName = settings?.orgName || 'Agent Portal';
    const certificateTitle = settings?.certificateTitle || 'Certificate of Representation';
    const certifyText = settings?.certifyText || 'This is to certify that';
    const description = settings?.description ||
        'is hereby appointed as a Verified Education Agent of the Agent Portal network.';
    const sealText = settings?.sealText || 'OFFICIAL';
    const sealSubText = settings?.sealSubText || 'VERIFIED';
    const sealColor = settings?.sealColor || '#b83a52';
    const signatoryName = settings?.signatoryName || 'Authorized Signatory';
    const signatoryRole = settings?.signatoryRole || 'Agent Portal';

    const logoSrc = settings?.logo
        ? (settings.logo.startsWith('http') ? settings.logo : getFileUrl(settings.logo))
        : null;

    const adminSigSrc = settings?.signatureImage
        ? (settings.signatureImage.startsWith('http')
            ? settings.signatureImage
            : getFileUrl(settings.signatureImage))
        : null;

    const agentSigSrc = agent.signature
        ? (agent.signature.startsWith('http')
            ? agent.signature
            : getFileUrl(agent.signature))
        : null;

    // ============================================
    // ⭐ VALIDITY & RENEWAL LOGIC
    // ============================================
    const validFrom = agent.certificateValidFrom
        ? new Date(agent.certificateValidFrom)
        : new Date(certificate.issuedAt);

    const validTo = agent.certificateValidTo
        ? new Date(agent.certificateValidTo)
        : (() => {
            const d = new Date(certificate.issuedAt);
            d.setFullYear(d.getFullYear() + Number(settings?.validityYears || 1));
            return d;
        })();

    const now = new Date();
    const diffMs = validTo - now;
    const isExpired = diffMs <= 0;
    const daysUntilExpiry = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    // ⭐ Countdown: years + days
    let yearsRemaining = 0;
    let daysRemaining = 0;

    if (!isExpired) {
        const tempDate = new Date(now);
        while (true) {
            const next = new Date(tempDate);
            next.setFullYear(next.getFullYear() + 1);
            if (next <= validTo) {
                yearsRemaining++;
                tempDate.setFullYear(tempDate.getFullYear() + 1);
            } else break;
        }
        daysRemaining = Math.ceil((validTo - tempDate) / (1000 * 60 * 60 * 24));
    }

    const renewalStatus = agent.renewalRequest?.status || 'none';
    const canApplyRenewal = (isExpired || daysUntilExpiry <= 30) && renewalStatus !== 'pending';

    const fmt = (d) => d.toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    // ⭐ Countdown text builder
    const getCountdownText = () => {
        if (isExpired) {
            return `⚠️ Certificate expired on ${fmt(validTo)}`;
        }
        const parts = [];
        if (yearsRemaining > 0) parts.push(`${yearsRemaining} year${yearsRemaining > 1 ? 's' : ''}`);
        if (daysRemaining > 0) parts.push(`${daysRemaining} day${daysRemaining > 1 ? 's' : ''}`);
        if (parts.length === 0) parts.push('0 days');
        return `✅ Certificate valid for ${parts.join(', ')}`;
    };

    const countdownClass = isExpired
        ? 'expired'
        : daysUntilExpiry <= 30
            ? 'warning'
            : 'valid';

    // ============================================
    // RENDER
    // ============================================
    return (
        <div className="agent-cert-page">

            {/* ACTION BAR */}
            <div className="agent-cert-actions no-print">
                <button className="agent-cert-action-btn back" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Back
                </button>
                <div className="agent-cert-action-group">
                    <button
                        className="agent-cert-action-btn print"
                        onClick={handlePrint}
                        disabled={downloading}
                    >
                        <FaPrint /> Print
                    </button>
                    <button
                        className="agent-cert-action-btn img"
                        onClick={downloadAsImage}
                        disabled={downloading}
                    >
                        {downloading ? <FaSpinner className="spin" /> : <FaFileImage />} PNG
                    </button>
                    <button
                        className="agent-cert-action-btn pdf"
                        onClick={downloadAsPDF}
                        disabled={downloading}
                    >
                        {downloading ? <FaSpinner className="spin" /> : <FaFilePdf />} PDF
                    </button>
                </div>
            </div>

            {/* ============================================
                ⭐ CERTIFICATE BODY — only if NOT expired + no pending
                ============================================ */}
            {(!isExpired || renewalStatus === 'pending') && (
                <div className="agent-cert-wrapper">
                    <div
                        className="agent-cert"
                        ref={certificateRef}
                        style={{
                            backgroundImage: `url(${bgimg})`,
                            backgroundSize: '100% 100%',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center'
                        }}
                    >
                        <div className="agent-cert-content">

                            {/* HEADER */}
                            <div className="agent-cert-header">
                                <div className="agent-cert-logo">
                                    {logoSrc ? (
                                        <img src={logoSrc} alt="Logo" className="agent-cert-logo-img" />
                                    ) : (
                                        <div className="agent-cert-logo-placeholder" />
                                    )}
                                </div>
                                <h1 className="agent-cert-org-name">{orgName}</h1>
                            </div>

                            <h2 className="agent-cert-title">{certificateTitle}</h2>
                            <p className="agent-cert-body-text">{certifyText}</p>
                            <h3 className="agent-cert-name">{agent.name.toUpperCase()}</h3>
                            <p className="agent-cert-role">
                                {agent.jobTitle}
                                {agent.company ? ` at ${agent.company}` : ''}
                            </p>
                            <p className="agent-cert-description">{description}</p>
                            <p className="agent-cert-validity">
                                <strong>Validity:</strong> {fmt(validFrom)} – {fmt(validTo)}
                            </p>

                            {/* FOOTER */}
                            <div className="agent-cert-footer">
                                <div className="agent-cert-footer-item">
                                    {adminSigSrc ? (
                                        <img src={adminSigSrc} alt="Authorized" className="agent-cert-signature-img" />
                                    ) : (
                                        <div className="agent-cert-signature-placeholder">{signatoryName}</div>
                                    )}
                                    <div className="agent-cert-footer-line" />
                                    <span className="agent-cert-footer-label">Authorized Signature</span>
                                </div>

                                <div className="agent-cert-seal-wrapper">
                                    <div
                                        className="agent-cert-seal"
                                        style={{
                                            background: `radial-gradient(circle, ${sealColor} 0%, ${darken(sealColor)} 100%)`
                                        }}
                                    >
                                        <div className="agent-cert-seal-inner">
                                            <div className="agent-cert-seal-star">★</div>
                                            <div className="agent-cert-seal-text">{sealText}</div>
                                            <div className="agent-cert-seal-subtext">{sealSubText}</div>
                                            <div className="agent-cert-seal-stars">★ ★ ★</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="agent-cert-footer-item">
                                    {agentSigSrc ? (
                                        <img src={agentSigSrc} alt="Agent" className="agent-cert-signature-img" />
                                    ) : (
                                        <div className="agent-cert-signature-placeholder">{agent.name}</div>
                                    )}
                                    <div className="agent-cert-footer-line" />
                                    <span className="agent-cert-footer-label">Signature</span>
                                </div>
                            </div>

                            <div className="agent-cert-id-strip">
                                <span>Certificate ID: <strong>{certificate.certificateId}</strong></span>
                                <span>Issued: <strong>{fmt(new Date(certificate.issuedAt))}</strong></span>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* ============================================
                ⭐ EXPIRED — Show renewal CTA instead of certificate
                ============================================ */}
            {isExpired && renewalStatus !== 'pending' && (
                <div className="agent-cert-expired-card">
                    <div className="agent-cert-expired-icon">
                        <FaExclamationTriangle />
                    </div>
                    <h2>Certificate Expired</h2>
                    <p>
                        Your certificate expired on <strong>{fmt(validTo)}</strong>.
                        Please apply for renewal to continue as a verified agent.
                    </p>
                    <button
                        className="agent-cert-renew-btn"
                        onClick={handleRenewalRequest}
                        disabled={renewing}
                    >
                        {renewing ? (
                            <><FaSpinner className="spin" /> Requesting...</>
                        ) : (
                            <><FaRedo /> Apply for Renewal</>
                        )}
                    </button>
                </div>
            )}

            {/* ============================================
                ⭐ BELOW CERTIFICATE — Countdown / Renewal CTA bar
                ============================================ */}
            <div className={`agent-cert-countdown-bar ${countdownClass}`}>
                {renewalStatus === 'pending' ? (
                    <>
                        <FaClock className="agent-cert-countdown-icon" />
                        <span>
                            <strong>Renewal Pending</strong> — Admin will review your request soon
                        </span>
                    </>
                ) : isExpired ? (
                    <>
                        <FaExclamationTriangle className="agent-cert-countdown-icon" />
                        <span>
                            <strong>Certificate Expired</strong> on {fmt(validTo)}
                        </span>
                        <button
                            className="agent-cert-countdown-btn"
                            onClick={handleRenewalRequest}
                            disabled={renewing}
                        >
                            {renewing ? (
                                <><FaSpinner className="spin" /> Requesting...</>
                            ) : (
                                <><FaRedo /> Apply for Renewal</>
                            )}
                        </button>
                    </>
                ) : daysUntilExpiry <= 30 ? (
                    <>
                        <FaClock className="agent-cert-countdown-icon" />
                        <span>
                            <strong>Expiring Soon!</strong> {yearsRemaining > 0 ? `${yearsRemaining} year${yearsRemaining > 1 ? 's' : ''}, ` : ''}{daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining
                        </span>
                        <button
                            className="agent-cert-countdown-btn"
                            onClick={handleRenewalRequest}
                            disabled={renewing}
                        >
                            {renewing ? (
                                <><FaSpinner className="spin" /> Requesting...</>
                            ) : (
                                <><FaRedo /> Apply for Renewal</>
                            )}
                        </button>
                    </>
                ) : (
                    <>
                        <FaCheckCircle className="agent-cert-countdown-icon" />
                        <span>
                            <strong>Certificate Valid</strong> — {yearsRemaining > 0 ? `${yearsRemaining} year${yearsRemaining > 1 ? 's' : ''}, ` : ''}{daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining
                        </span>
                        <span className="agent-cert-countdown-expiry">
                            (Expires on {fmt(validTo)})
                        </span>
                    </>
                )}
            </div>

        </div>
    );
};

// Helper: darken hex
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

export default AgentCertificate;