// src/Pages/Admin/ForgotPassword.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logomain from "../../../../assets/imgs/logosing/logomain.png"
import adminApi from '../../../../api/adminApi';
import { 
    FaEnvelope, FaLock, FaEye, FaEyeSlash, 
    FaArrowLeft, FaArrowRight, FaCheckCircle, 
    FaExclamationTriangle, FaClock, FaKey,
    FaShieldAlt, FaRedo
} from 'react-icons/fa';
import './ForgotPassword.css';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const otpInputs = useRef([]);

    // ===== STATE =====
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [timer, setTimer] = useState(600); // 10 minutes
    const [resendDisabled, setResendDisabled] = useState(true);

    // ===== TOAST =====
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

    const showToast = (message, type = 'info') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type }), 5000);
    };

    // ===== TIMER =====
    useEffect(() => {
        if (step === 2 && timer > 0) {
            const interval = setInterval(() => setTimer(p => p - 1), 1000);
            return () => clearInterval(interval);
        }
        if (timer === 0) setResendDisabled(false);
    }, [step, timer]);

    // ===== AUTO-FOCUS OTP =====
    useEffect(() => {
        if (step === 2 && otpInputs.current[0]) {
            setTimeout(() => otpInputs.current[0]?.focus(), 300);
        }
    }, [step]);

    // ============================================
    // STEP 1: SEND OTP
    // ============================================
    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            setError('Please enter your email address');
            return;
        }
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        try {
            setLoading(true);
            const response = await adminApi.forgotPassword({ email: email.trim().toLowerCase() });

            if (response.success) {
                setSuccess('OTP sent successfully! Check your email.');
                showToast('✅ OTP sent to your email!', 'success');
                setStep(2);
                setTimer(600);
                setResendDisabled(true);
                setOtp(['', '', '', '', '', '']);
            } else {
                setError(response.message || 'Failed to send OTP');
                showToast(response.message || 'Failed to send OTP', 'error');
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'No admin found with this email';
            setError(msg);
            showToast(`❌ ${msg}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    // ============================================
    // STEP 2: VERIFY OTP
    // ============================================
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const otpValue = otp.join('');
        if (otpValue.length !== 6) {
            setError('Please enter all 6 digits');
            showToast('Please enter all 6 digits', 'error');
            return;
        }

        try {
            setLoading(true);
            const response = await adminApi.verifyResetOTP({
                email: email.trim().toLowerCase(),
                otp: otpValue.trim()
            });

            if (response.success) {
                setSuccess('OTP verified successfully!');
                showToast('✅ OTP verified!', 'success');
                setStep(3);
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setError(response.message || 'Invalid OTP');
                showToast(response.message || 'Invalid OTP', 'error');
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Invalid or expired OTP';
            setError(msg);
            showToast(`❌ ${msg}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    // ============================================
    // OTP INPUT HANDLERS
    // ============================================
    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        setError('');

        if (value && index < 5) {
            otpInputs.current[index + 1]?.focus();
        }

        // Auto-submit when all filled
        if (newOtp.every(d => d !== '') && index === 5) {
            setTimeout(() => {
                const v = newOtp.join('');
                if (v.length === 6) {
                    document.getElementById('verify-otp-btn')?.click();
                }
            }, 300);
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpInputs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text/plain').slice(0, 6);
        if (!/^\d+$/.test(pasted)) return;
        const newOtp = [...otp];
        for (let i = 0; i < pasted.length; i++) newOtp[i] = pasted[i];
        setOtp(newOtp);
    };

    // ============================================
    // RESEND OTP
    // ============================================
    const handleResendOTP = async () => {
        if (loading || resendDisabled) return;
        setError('');
        try {
            setLoading(true);
            const response = await adminApi.forgotPassword({ email: email.trim().toLowerCase() });
            if (response.success) {
                setTimer(600);
                setResendDisabled(true);
                setOtp(['', '', '', '', '', '']);
                showToast('✅ New OTP sent!', 'success');
            }
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to resend OTP', 'error');
        } finally {
            setLoading(false);
        }
    };

    // ============================================
    // STEP 3: RESET PASSWORD
    // ============================================
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!newPassword) {
            setError('Please enter new password');
            return;
        }
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            setLoading(true);
            const response = await adminApi.resetPassword({
                email: email.trim().toLowerCase(),
                otp: otp.join('').trim(),
                newPassword,
                confirmNewPassword: confirmPassword
            });

            if (response.success) {
                showToast('✅ Password reset successfully!', 'success');
                setSuccess('Password reset successfully! Redirecting to login...');
                
                setTimeout(() => {
                    navigate('/signin');
                }, 2000);
            } else {
                setError(response.message || 'Failed to reset password');
                showToast(response.message || 'Failed to reset password', 'error');
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to reset password';
            setError(msg);
            showToast(`❌ ${msg}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    // ============================================
    // FORMAT TIMER
    // ============================================
    const formatTimer = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // ============================================
    // RENDER
    // ============================================
    return (
        <div className="fp-page">
            {/* Background */}
            <div className="fp-bg-gradient" />
            <div className="fp-bg-circles">
                <span className="fp-circle c1" />
                <span className="fp-circle c2" />
                <span className="fp-circle c3" />
                <span className="fp-circle c4" />
            </div>

            {/* Toast */}
            {toast.show && (
                <div className={`fp-toast fp-toast-${toast.type}`}>
                    <span>{toast.message}</span>
                </div>
            )}

            <div className="fp-card">
                {/* Header */}
                <div className="fp-header">
                   <img className='main-logo-pages ' src={logomain} alt="" />
                    <h1>Forgot Password?</h1>
                    <p>
                        {step === 1 && "Enter your email and we'll send you an OTP to reset your password."}
                        {step === 2 && `Enter the 6-digit code sent to ${email}`}
                        {step === 3 && 'Create a new password for your account.'}
                    </p>
                </div>

                {/* STEP INDICATOR */}
                <div className="fp-steps">
                    <div className={`fp-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                        <div className="fp-step-num">
                            {step > 1 ? <FaCheckCircle /> : '1'}
                        </div>
                        <span>Email</span>
                    </div>
                    <div className={`fp-step-line ${step > 1 ? 'active' : ''}`} />
                    <div className={`fp-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                        <div className="fp-step-num">
                            {step > 2 ? <FaCheckCircle /> : '2'}
                        </div>
                        <span>OTP</span>
                    </div>
                    <div className={`fp-step-line ${step > 2 ? 'active' : ''}`} />
                    <div className={`fp-step ${step >= 3 ? 'active' : ''}`}>
                        <div className="fp-step-num">3</div>
                        <span>Password</span>
                    </div>
                </div>

                {/* Messages */}
                {error && (
                    <div className="fp-message fp-message-error">
                        <FaExclamationTriangle />
                        <span>{error}</span>
                    </div>
                )}
                {success && (
                    <div className="fp-message fp-message-success">
                        <FaCheckCircle />
                        <span>{success}</span>
                    </div>
                )}

                {/* ========== STEP 1: EMAIL ========== */}
                {step === 1 && (
                    <form className="fp-form" onSubmit={handleSendOTP}>
                        <div className="fp-input-group">
                            <label>Email Address</label>
                            <div className="fp-input-wrap">
                                <FaEnvelope className="fp-input-icon" />
                                <input
                                    type="email"
                                    placeholder="admin@example.com"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                    disabled={loading}
                                    autoFocus
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="fp-btn fp-btn-primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <><span className="fp-spinner" /> Sending OTP...</>
                            ) : (
                                <>Send OTP <FaArrowRight /></>
                            )}
                        </button>
                    </form>
                )}

                {/* ========== STEP 2: OTP ========== */}
                {step === 2 && (
                    <form className="fp-form" onSubmit={handleVerifyOTP}>
                        <div className="fp-otp-wrap">
                            <label>Enter 6-Digit OTP</label>
                            <div className="fp-otp-inputs">
                                {otp.map((digit, i) => (
                                    <input
                                        key={i}
                                        ref={(el) => (otpInputs.current[i] = el)}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(i, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                        onPaste={handleOtpPaste}
                                        className="fp-otp-digit"
                                        disabled={loading}
                                    />
                                ))}
                            </div>
                            <div className="fp-timer">
                                <FaClock />
                                <span>{formatTimer(timer)} remaining</span>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            id="verify-otp-btn"
                            className="fp-btn fp-btn-primary"
                            disabled={loading || otp.join('').length !== 6}
                        >
                            {loading ? (
                                <><span className="fp-spinner" /> Verifying...</>
                            ) : (
                                <>Verify OTP <FaArrowRight /></>
                            )}
                        </button>

                        <div className="fp-resend">
                            <span>Didn't receive the code?</span>
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={loading || resendDisabled}
                                className="fp-resend-btn"
                            >
                                <FaRedo /> {resendDisabled ? `Resend in ${formatTimer(timer)}` : 'Resend OTP'}
                            </button>
                        </div>

                        <button
                            type="button"
                            className="fp-back-btn"
                            onClick={() => { setStep(1); setOtp(['', '', '', '', '', '']); setError(''); }}
                        >
                            <FaArrowLeft /> Change Email
                        </button>
                    </form>
                )}

                {/* ========== STEP 3: NEW PASSWORD ========== */}
                {step === 3 && (
                    <form className="fp-form" onSubmit={handleResetPassword}>
                        <div className="fp-input-group">
                            <label>New Password</label>
                            <div className="fp-input-wrap">
                                <FaLock className="fp-input-icon" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Min 6 characters"
                                    value={newPassword}
                                    onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                                    disabled={loading}
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    className="fp-eye-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <div className="fp-input-group">
                            <label>Confirm Password</label>
                            <div className="fp-input-wrap">
                                <FaKey className="fp-input-icon" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="fp-eye-btn"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        {/* Password Strength */}
                        {newPassword && (
                            <div className="fp-pwd-strength">
                                <div className={`fp-pwd-bar ${newPassword.length >= 6 ? 'ok' : ''}`} />
                                <span className={newPassword.length >= 6 ? 'ok' : ''}>
                                    {newPassword.length >= 6 ? '✓ Password is strong' : 'Password must be 6+ characters'}
                                </span>
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className="fp-btn fp-btn-primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <><span className="fp-spinner" /> Resetting...</>
                            ) : (
                                <>Reset Password <FaCheckCircle /></>
                            )}
                        </button>

                        <button
                            type="button"
                            className="fp-back-btn"
                            onClick={() => { setStep(2); setError(''); }}
                        >
                            <FaArrowLeft /> Back
                        </button>
                    </form>
                )}

                {/* Footer */}
                <div className="fp-footer">
                    <p>
                        Remember your password?{' '}
                        <Link to="/signin">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;