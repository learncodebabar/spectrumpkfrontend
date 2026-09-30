// src/Pages/Admin/RenewalRequests.jsx
import React, { useEffect, useState } from 'react';
import {
    FaSpinner, FaCheck, FaTimes, FaClock,
    FaUser, FaEnvelope, FaCalendarAlt
} from 'react-icons/fa';
import adminApi from '../../../../api/adminApi';
import './RenewalRequests.css';

const RenewalRequests = () => {
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState([]);
    const [filter, setFilter] = useState('pending');
    const [toast, setToast] = useState({ show: false, msg: '', type: 'success' });
    const [processingId, setProcessingId] = useState(null);
    const [rejectModal, setRejectModal] = useState({ open: false, agent: null, reason: '' });

    const showToast = (msg, type = 'success') => {
        setToast({ show: true, msg, type });
        setTimeout(() => setToast({ show: false, msg: '', type: 'success' }), 4000);
    };

    useEffect(() => {
        fetchRequests();
        // eslint-disable-next-line
    }, [filter]);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await adminApi.getRenewalRequests(filter);
            if (res.success) setRequests(res.requests || []);
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to load requests', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (agent) => {
        if (!window.confirm(`Approve renewal for ${agent.name}?`)) return;
        setProcessingId(agent._id);
        try {
            const res = await adminApi.approveRenewal(agent._id, { validityYears: 1 });
            if (res.success) {
                showToast('✅ Renewal approved!', 'success');
                fetchRequests();
            }
        } catch (err) {
            showToast(err.response?.data?.message || 'Approval failed', 'error');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = (agent) => {
        setRejectModal({ open: true, agent, reason: '' });
    };

    const confirmReject = async () => {
        if (!rejectModal.reason.trim()) {
            return showToast('Please enter a rejection reason', 'error');
        }
        setProcessingId(rejectModal.agent._id);
        try {
            const res = await adminApi.rejectRenewal(rejectModal.agent._id, {
                reason: rejectModal.reason
            });
            if (res.success) {
                showToast('Renewal rejected', 'success');
                setRejectModal({ open: false, agent: null, reason: '' });
                fetchRequests();
            }
        } catch (err) {
            showToast(err.response?.data?.message || 'Rejection failed', 'error');
        } finally {
            setProcessingId(null);
        }
    };

    const fmt = (d) => d ? new Date(d).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
    }) : '—';

    return (
        <div className="renewal-page">

            {toast.show && (
                <div className={`renewal-toast ${toast.type}`}>
                    {toast.msg}
                </div>
            )}

            <div className="renewal-header">
                <div>
                    <h1><FaClock /> Certificate Renewal Requests</h1>
                    <p>Review and approve agent renewal applications</p>
                </div>

                <div className="renewal-filter">
                    {['pending', 'approved', 'rejected'].map(s => (
                        <button
                            key={s}
                            className={filter === s ? 'active' : ''}
                            onClick={() => setFilter(s)}
                        >
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="renewal-loading">
                    <FaSpinner className="spin" /> Loading requests...
                </div>
            ) : requests.length === 0 ? (
                <div className="renewal-empty">
                    <FaClock />
                    <h3>No {filter} requests</h3>
                    <p>All caught up!</p>
                </div>
            ) : (
                <div className="renewal-grid">
                    {requests.map(agent => (
                        <div key={agent._id} className="renewal-card">

                            <div className="renewal-card-header">
                                <div className="renewal-avatar">
                                    {agent.profileImageUrl || agent.profileImage ? (
                                        <img src={agent.profileImageUrl || agent.profileImage} alt={agent.name} />
                                    ) : (
                                        <FaUser />
                                    )}
                                </div>
                                <div>
                                    <h3>{agent.name}</h3>
                                    <p>{agent.jobTitle}{agent.company ? ` at ${agent.company}` : ''}</p>
                                </div>
                            </div>

                            <div className="renewal-details">
                                <div><FaEnvelope /> {agent.email}</div>
                                <div><FaCalendarAlt /> Old expiry: {fmt(agent.certificateValidTo)}</div>
                                <div className="renewal-req-date">
                                    Requested: {fmt(agent.renewalRequest?.requestedAt)}
                                </div>
                                {agent.renewalRequest?.notes && (
                                    <div className="renewal-note">
                                        Note: "{agent.renewalRequest.notes}"
                                    </div>
                                )}
                                {agent.renewalRequest?.rejectionReason && (
                                    <div className="renewal-reject-reason">
                                        Reason: {agent.renewalRequest.rejectionReason}
                                    </div>
                                )}
                            </div>

                            {filter === 'pending' && (
                                <div className="renewal-actions">
                                    <button
                                        className="renewal-btn approve"
                                        onClick={() => handleApprove(agent)}
                                        disabled={processingId === agent._id}
                                    >
                                        {processingId === agent._id ? (
                                            <FaSpinner className="spin" />
                                        ) : (
                                            <><FaCheck /> Approve</>
                                        )}
                                    </button>
                                    <button
                                        className="renewal-btn reject"
                                        onClick={() => handleReject(agent)}
                                        disabled={processingId === agent._id}
                                    >
                                        <FaTimes /> Reject
                                    </button>
                                </div>
                            )}

                        </div>
                    ))}
                </div>
            )}

            {/* Reject Modal */}
            {rejectModal.open && (
                <div className="renewal-modal-overlay" onClick={() => setRejectModal({ open: false, agent: null, reason: '' })}>
                    <div className="renewal-modal" onClick={e => e.stopPropagation()}>
                        <h3>Reject Renewal</h3>
                        <p>Rejecting <strong>{rejectModal.agent?.name}</strong>'s renewal request</p>
                        <textarea
                            placeholder="Reason for rejection (required)"
                            value={rejectModal.reason}
                            onChange={(e) => setRejectModal(prev => ({ ...prev, reason: e.target.value }))}
                            rows="4"
                        />
                        <div className="renewal-modal-actions">
                            <button
                                className="renewal-btn cancel"
                                onClick={() => setRejectModal({ open: false, agent: null, reason: '' })}
                            >
                                Cancel
                            </button>
                            <button
                                className="renewal-btn reject"
                                onClick={confirmReject}
                                disabled={processingId}
                            >
                                {processingId ? <FaSpinner className="spin" /> : 'Confirm Reject'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default RenewalRequests;