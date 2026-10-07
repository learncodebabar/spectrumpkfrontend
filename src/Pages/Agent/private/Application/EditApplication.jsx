// src/Pages/Agent/private/Application/EditApplication.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './StudentApplication.css';   // ⭐ Same CSS reuse karo
import agentApi from '../../../../api/agentApi';
import {
    FaUser, FaGraduationCap, FaUniversity,
    FaFileUpload, FaCheckCircle, FaExclamationTriangle,
    FaSpinner, FaArrowRight, FaArrowLeft, FaTrash, FaFileAlt,
    FaUserGraduate, FaMoneyBillWave, FaMapMarkerAlt,
    FaSave, FaUpload, FaFolderOpen, FaFileContract, FaReceipt, FaLink
} from 'react-icons/fa';

// ============================================
// ALL FILE FIELDS
// ============================================
const ALL_FILE_FIELDS = [
    'profilePhoto', 'idProof', 'marksheet',
    'incomeCertificate', 'previousCertificate', 'bankPassbook',
    'dependentPassport1', 'sponsorDetails', 'bankStatementLetter',
    'visaCopies', 'pendingDocument', 'visaDocument',
    'studyContinuousLetter', 'dependentPassport2', 'transferStudents',
    'signedCAL', 'paymentInvoice',
    'applicationFeeReceipt', 'englishExamReceipt',
    'internalAdmissionFee', 'bankCheckDraft',
    'insuranceFee', 'tuitionFee',
    'finalSignedCAL', 'finalPaymentInvoice',
    'initialAdmissionPortfolio', 'deferralAdmissionPortfolio'
];

const createEmptyUrlState = () =>
    ALL_FILE_FIELDS.reduce((acc, f) => ({ ...acc, [f]: '' }), {});

const EditApplication = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    // ===== STATE =====
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Dropdown data
    const [universities, setUniversities] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [loadingPrograms, setLoadingPrograms] = useState(false);

    // File modes
    const [fileModes, setFileModes] = useState({});

    // File URLs
    const [fileUrls, setFileUrls] = useState(createEmptyUrlState());

    // File refs
    const fileRefs = {
        idProof: useRef(null),
        marksheet: useRef(null),
        incomeCertificate: useRef(null),
        profilePhoto: useRef(null),
        previousCertificate: useRef(null),
        bankPassbook: useRef(null),
        dependentPassport1: useRef(null),
        sponsorDetails: useRef(null),
        bankStatementLetter: useRef(null),
        visaCopies: useRef(null),
        pendingDocument: useRef(null),
        visaDocument: useRef(null),
        studyContinuousLetter: useRef(null),
        dependentPassport2: useRef(null),
        transferStudents: useRef(null),
        signedCAL: useRef(null),
        paymentInvoice: useRef(null),
        applicationFeeReceipt: useRef(null),
        englishExamReceipt: useRef(null),
        internalAdmissionFee: useRef(null),
        bankCheckDraft: useRef(null),
        insuranceFee: useRef(null),
        tuitionFee: useRef(null),
        finalSignedCAL: useRef(null),
        finalPaymentInvoice: useRef(null),
        initialAdmissionPortfolio: useRef(null),
        deferralAdmissionPortfolio: useRef(null)
    };

    // Form data
    const [formData, setFormData] = useState({
        university: '',
        program: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        nationality: 'Indian',
        category: 'General',
        address: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        fatherName: '',
        motherName: '',
        guardianPhone: '',
        annualIncome: '',
        previousEducation: '',
        previousInstitute: '',
        passingYear: '',
        percentage: '',
        gpa: '',
        whyDeserve: '',
        achievements: '',
        accountHolderName: '',
        accountNumber: '',
        ifscCode: '',
        bankName: '',
        branchName: '',
        // Files
        profilePhoto: null,
        profilePhotoPreview: null,
        idProof: null,
        marksheet: null,
        incomeCertificate: null,
        previousCertificate: null,
        bankPassbook: null,
        dependentPassport1: null,
        sponsorDetails: null,
        bankStatementLetter: null,
        visaCopies: null,
        pendingDocument: null,
        visaDocument: null,
        studyContinuousLetter: null,
        dependentPassport2: null,
        transferStudents: null,
        signedCAL: null,
        paymentInvoice: null,
        applicationFeeReceipt: null,
        englishExamReceipt: null,
        internalAdmissionFee: null,
        bankCheckDraft: null,
        insuranceFee: null,
        tuitionFee: null,
        finalSignedCAL: null,
        finalPaymentInvoice: null,
        initialAdmissionPortfolio: null,
        deferralAdmissionPortfolio: null
    });

    // ⭐ Existing files (from server)
    const [existingFiles, setExistingFiles] = useState({});

    // ============================================
    // HELPERS
    // ============================================
    const getFieldMode = (name) => fileModes[name] || 'upload';

    const isFieldProvided = (name) => {
        const hasFile = !!formData[name];
        const hasUrl = !!(fileUrls[name] && fileUrls[name].trim());
        const hasExisting = !!existingFiles[name];
        return hasFile || hasUrl || hasExisting;
    };

    // ============================================
    // LOAD EXISTING APPLICATION
    // ============================================
    useEffect(() => {
        if (id) {
            loadApplication();
        }
        // eslint-disable-next-line
    }, [id]);

    const loadApplication = async () => {
        try {
            setLoading(true);

            // ⭐ Parallel fetch — application + universities
            const [appRes, uniRes] = await Promise.all([
                agentApi.getApplicationById(id),
                agentApi.getUniversities()
            ]);

            if (uniRes.success) setUniversities(uniRes.data || []);

            if (appRes.success) {
                const app = appRes.data;
                console.log('📥 Loaded application:', app);

                // ⭐ Populate form data
                setFormData(prev => ({
                    ...prev,
                    university: app.university?._id || app.university || '',
                    program: app.program?._id || app.program || '',
                    firstName: app.student?.firstName || '',
                    lastName: app.student?.lastName || '',
                    email: app.student?.email || '',
                    phone: app.student?.phone || '',
                    dateOfBirth: app.student?.dateOfBirth
                        ? new Date(app.student.dateOfBirth).toISOString().split('T')[0]
                        : '',
                    gender: app.student?.gender || '',
                    nationality: app.student?.nationality || 'Indian',
                    category: app.student?.category || 'General',
                    address: app.student?.address || '',
                    city: app.student?.city || '',
                    state: app.student?.state || '',
                    pincode: app.student?.pincode || '',
                    country: app.student?.country || 'India',
                    fatherName: app.student?.fatherName || '',
                    motherName: app.student?.motherName || '',
                    guardianPhone: app.student?.guardianPhone || '',
                    annualIncome: app.student?.annualIncome || '',
                    previousEducation: app.academic?.previousEducation || '',
                    previousInstitute: app.academic?.previousInstitute || '',
                    passingYear: app.academic?.passingYear || '',
                    percentage: app.academic?.percentage || '',
                    gpa: app.academic?.gpa || '',
                    whyDeserve: app.statement?.whyDeserve || '',
                    achievements: app.statement?.achievements || '',
                    accountHolderName: app.bankDetails?.accountHolderName || '',
                    accountNumber: app.bankDetails?.accountNumber || '',
                    ifscCode: app.bankDetails?.ifscCode || '',
                    bankName: app.bankDetails?.bankName || '',
                    branchName: app.bankDetails?.branchName || ''
                }));

                // ⭐ Load existing files + URLs
                const existing = {};
                const urls = createEmptyUrlState();
                const modes = {};

                ALL_FILE_FIELDS.forEach(field => {
                    const doc = app.documents?.[field];
                    const url = app.documents?.urls?.[field];
                    const source = app.documents?.sources?.[field];

                    if (doc) {
                        existing[field] = doc;
                        modes[field] = source === 'url' ? 'url' : 'upload';
                    }
                    if (url) {
                        urls[field] = url;
                        modes[field] = 'url';
                    }
                });

                setExistingFiles(existing);
                setFileUrls(urls);
                setFileModes(modes);

                // ⭐ Load programs for existing university
                if (app.university?._id || app.university) {
                    const uniId = app.university?._id || app.university;
                    setLoadingPrograms(true);
                    try {
                        const progRes = await agentApi.getProgramsByUniversity(uniId);
                        if (progRes.success) setPrograms(progRes.data || []);
                    } catch (err) {
                        console.error('Failed to load programs:', err);
                    } finally {
                        setLoadingPrograms(false);
                    }
                }
            }
        } catch (error) {
            console.error('❌ Load Error:', error);
            setServerError(error.response?.data?.message || 'Failed to load application');
        } finally {
            setLoading(false);
        }
    };

    // ============================================
    // HANDLE UNIVERSITY CHANGE
    // ============================================
    const handleUniversityChange = async (e) => {
        const universityId = e.target.value;
        setFormData(prev => ({ ...prev, university: universityId, program: '' }));
        setPrograms([]);

        if (!universityId) return;

        setLoadingPrograms(true);
        try {
            const response = await agentApi.getProgramsByUniversity(universityId);
            if (response.success) setPrograms(response.data || []);
        } catch (error) {
            console.error('❌ Error fetching programs:', error);
            setServerError('Failed to load programs');
        } finally {
            setLoadingPrograms(false);
        }
    };

    // ============================================
    // HANDLE CHANGE (text/select/file)
    // ============================================
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file') {
            const file = files[0];
            if (!file) return;

            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, [name]: 'Max 5MB allowed' }));
                return;
            }

            const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
            if (!validTypes.includes(file.type)) {
                setErrors(prev => ({ ...prev, [name]: 'Only JPG, PNG, PDF allowed' }));
                return;
            }

            const update = { [name]: file };

            if (name === 'profilePhoto') {
                if (formData.profilePhotoPreview) {
                    URL.revokeObjectURL(formData.profilePhotoPreview);
                }
                update.profilePhotoPreview = URL.createObjectURL(file);
            }

            setFormData(prev => ({ ...prev, ...update }));
            setErrors(prev => ({ ...prev, [name]: '' }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
        setServerError('');
    };

    const handleBlur = (e) => {
        setTouched(prev => ({ ...prev, [e.target.name]: true }));
    };

    // ============================================
    // URL CHANGE
    // ============================================
    const handleUrlChange = (name, value) => {
        setFileUrls(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    // ============================================
    // MODE SWITCH
    // ============================================
    const handleModeSwitch = (name, mode) => {
        setFileModes(prev => ({ ...prev, [name]: mode }));

        if (mode === 'upload') {
            setFileUrls(prev => ({ ...prev, [name]: '' }));
        } else {
            // Switching to URL — clear uploaded file
            removeFile(name, true);
        }
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    // ============================================
    // REMOVE FILE
    // ============================================
    const removeFile = (fieldName, keepPreviewState = false) => {
        if (fieldName === 'profilePhoto' && formData.profilePhotoPreview) {
            URL.revokeObjectURL(formData.profilePhotoPreview);
        }
        setFormData(prev => ({
            ...prev,
            [fieldName]: null,
            ...(fieldName === 'profilePhoto' && !keepPreviewState && { profilePhotoPreview: null })
        }));
        // ⭐ Also clear existing file marker
        setExistingFiles(prev => {
            const copy = { ...prev };
            delete copy[fieldName];
            return copy;
        });
        if (fileRefs[fieldName]?.current) {
            fileRefs[fieldName].current.value = '';
        }
    };

    // ============================================
    // RENDER FILE UPLOAD
    // ============================================
    const renderFileUpload = (label, name) => {
        const mode = getFieldMode(name);
        const hasFile = formData[name];
        const hasUrl = fileUrls[name] && fileUrls[name].trim();
        const hasExisting = existingFiles[name];
        const error = errors[name];
        const isTouched = touched[name];

        const existingUrl = hasExisting
            ? (hasExisting.startsWith('http') ? hasExisting : `https://backend.spectrumpk.com/${hasExisting}`)
            : null;

        return (
            <div className="form-group">
                <label>{label}</label>

                <div className="file-mode-toggle">
                    <button
                        type="button"
                        className={mode === 'upload' ? 'active' : ''}
                        onClick={() => handleModeSwitch(name, 'upload')}
                    >
                        <FaUpload /> Upload
                    </button>
                    <button
                        type="button"
                        className={mode === 'url' ? 'active' : ''}
                        onClick={() => handleModeSwitch(name, 'url')}
                    >
                        <FaLink /> URL
                    </button>
                </div>

                {mode === 'upload' && (
                    hasFile ? (
                        <div className="file-preview-simple">
                            <FaFileAlt />
                            <span>{hasFile.name}</span>
                            <button
                                type="button"
                                className="remove-file-btn"
                                onClick={() => removeFile(name)}
                            >
                                <FaTrash />
                            </button>
                        </div>
                    ) : hasExisting ? (
                        <div className="file-preview-simple existing">
                            <FaFileAlt />
                            <a
                                href={existingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="existing-file-link"
                            >
                                View existing file
                            </a>
                            <span className="existing-badge">Existing</span>
                            <button
                                type="button"
                                className="remove-file-btn"
                                onClick={() => removeFile(name)}
                            >
                                <FaTrash />
                            </button>
                        </div>
                    ) : (
                        <div className="file-drop-zone">
                            <input
                                type="file"
                                name={name}
                                ref={fileRefs[name]}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                accept=".jpg,.jpeg,.png,.pdf"
                            />
                            <FaUpload className="upload-icon" />
                            <p>Upload</p>
                            <small>JPG, PNG, PDF (Max 5MB)</small>
                        </div>
                    )
                )}

                {mode === 'url' && (
                    <div className="url-input-wrap">
                        <FaLink className="url-input-icon" />
                        <input
                            type="url"
                            className="url-input"
                            placeholder="https://drive.google.com/file/..."
                            value={fileUrls[name] || ''}
                            onChange={(e) => handleUrlChange(name, e.target.value)}
                            onBlur={handleBlur}
                        />
                        {hasUrl && (
                            <button
                                type="button"
                                className="remove-file-btn"
                                onClick={() => handleUrlChange(name, '')}
                            >
                                <FaTrash />
                            </button>
                        )}
                    </div>
                )}

                {error && <span className="error-text">{error}</span>}
            </div>
        );
    };

    // ============================================
    // PROFILE PHOTO
    // ============================================
    const renderProfilePhotoUpload = () => {
        const name = 'profilePhoto';
        const mode = getFieldMode(name);
        const error = errors[name];
        const hasUrl = fileUrls[name] && fileUrls[name].trim();
        const hasExisting = existingFiles[name];

        const existingUrl = hasExisting
            ? (hasExisting.startsWith('http') ? hasExisting : `https://backend.spectrumpk.com/${hasExisting}`)
            : null;

        const preview =
            formData.profilePhotoPreview ||
            (mode === 'url' && hasUrl ? hasUrl : null) ||
            existingUrl;

        return (
            <div className="form-group">
                <label>Profile Photo *</label>

                <div className="file-mode-toggle">
                    <button
                        type="button"
                        className={mode === 'upload' ? 'active' : ''}
                        onClick={() => handleModeSwitch(name, 'upload')}
                    >
                        <FaUpload /> Upload
                    </button>
                    <button
                        type="button"
                        className={mode === 'url' ? 'active' : ''}
                        onClick={() => handleModeSwitch(name, 'url')}
                    >
                        <FaLink /> URL
                    </button>
                </div>

                {mode === 'upload' && (
                    !formData.profilePhotoPreview && !hasExisting ? (
                        <div className="file-drop-zone">
                            <input
                                type="file"
                                name={name}
                                ref={fileRefs[name]}
                                onChange={handleChange}
                                accept="image/*"
                            />
                            <FaUpload className="upload-icon" />
                            <p>Upload Photo</p>
                            <small>JPG, PNG (Max 5MB)</small>
                        </div>
                    ) : (
                        <div className="file-preview">
                            <img src={formData.profilePhotoPreview || existingUrl} alt="Preview" />
                            {hasExisting && !formData.profilePhotoPreview && (
                                <span className="existing-badge">Existing</span>
                            )}
                            <button
                                type="button"
                                className="remove-file-btn"
                                onClick={() => removeFile(name)}
                            >
                                <FaTrash />
                            </button>
                        </div>
                    )
                )}

                {mode === 'url' && (
                    <>
                        <div className="url-input-wrap">
                            <FaLink className="url-input-icon" />
                            <input
                                type="url"
                                className="url-input"
                                placeholder="https://example.com/photo.jpg"
                                value={fileUrls[name] || ''}
                                onChange={(e) => handleUrlChange(name, e.target.value)}
                            />
                            {hasUrl && (
                                <button
                                    type="button"
                                    className="remove-file-btn"
                                    onClick={() => handleUrlChange(name, '')}
                                >
                                    <FaTrash />
                                </button>
                            )}
                        </div>
                        {preview && (
                            <div className="file-preview url-preview">
                                <img
                                    src={preview}
                                    alt="URL Preview"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            </div>
                        )}
                    </>
                )}

                {error && <span className="error-text">{error}</span>}
            </div>
        );
    };

    // ============================================
    // VALIDATE
    // ============================================
    const validateForm = () => {
        const newErrors = {};

        if (!formData.university) newErrors.university = 'Please select a university';
        if (!formData.program) newErrors.program = 'Please select a program';
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        else if (!/^[0-9]{10}$/.test(formData.phone)) newErrors.phone = 'Enter valid 10-digit phone';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
        else if (!/^[0-9]{6}$/.test(formData.pincode)) newErrors.pincode = 'Enter valid 6-digit pincode';
        if (!formData.previousEducation.trim()) newErrors.previousEducation = 'Previous education required';
        if (!formData.passingYear) newErrors.passingYear = 'Passing year required';
        if (!formData.percentage) newErrors.percentage = 'Percentage required';
        if (!formData.whyDeserve.trim()) newErrors.whyDeserve = 'This field is required';
        else if (formData.whyDeserve.length < 50) newErrors.whyDeserve = 'Minimum 50 characters required';

        if (!isFieldProvided('idProof')) newErrors.idProof = 'ID proof is required';
        if (!isFieldProvided('marksheet')) newErrors.marksheet = 'Marksheet is required';
        if (!isFieldProvided('profilePhoto')) newErrors.profilePhoto = 'Profile photo is required';

        return newErrors;
    };

    // ============================================
    // SUBMIT (UPDATE)
    // ============================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validateForm();
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            const firstError = document.querySelector('.error-text');
            firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setServerError('Please fix all errors');
            return;
        }

        setSubmitLoading(true);
        setServerError('');

        try {
            const dataToSend = new FormData();

            dataToSend.append('university', formData.university);
            dataToSend.append('program', formData.program);

            dataToSend.append('student', JSON.stringify({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                nationality: formData.nationality,
                category: formData.category,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
                country: formData.country,
                fatherName: formData.fatherName,
                motherName: formData.motherName,
                guardianPhone: formData.guardianPhone,
                annualIncome: formData.annualIncome
            }));

            dataToSend.append('academic', JSON.stringify({
                previousEducation: formData.previousEducation,
                previousInstitute: formData.previousInstitute,
                passingYear: formData.passingYear,
                percentage: formData.percentage,
                gpa: formData.gpa
            }));

            dataToSend.append('statement', JSON.stringify({
                whyDeserve: formData.whyDeserve,
                achievements: formData.achievements
            }));

            dataToSend.append('bankDetails', JSON.stringify({
                accountHolderName: formData.accountHolderName,
                accountNumber: formData.accountNumber,
                ifscCode: formData.ifscCode,
                bankName: formData.bankName,
                branchName: formData.branchName
            }));

            // Files
            ALL_FILE_FIELDS.forEach(field => {
                if (formData[field]) {
                    dataToSend.append(field, formData[field]);
                }
            });

            // URLs
            ALL_FILE_FIELDS.forEach(field => {
                const url = fileUrls[field];
                if (url && url.trim()) {
                    dataToSend.append(`${field}Url`, url.trim());
                }
            });

            console.log('📤 Updating application...');
            const response = await agentApi.updateApplication(id, dataToSend);
            console.log('📥 Response:', response);

            if (response.success) {
                setSuccessMessage('✅ Application updated successfully!');
                setTimeout(() => {
                    navigate('/agent/my-applications');
                }, 2000);
            }
        } catch (error) {
            console.error('❌ Update error:', error);
            setServerError(error.response?.data?.message || 'Failed to update');
        } finally {
            setSubmitLoading(false);
        }
    };

    // ============================================
    // LOADING
    // ============================================
    if (loading) {
        return (
            <div className="StudentApplication">
                <div className="loading-state">
                    <FaSpinner className="spinner" />
                    <p>Loading application...</p>
                </div>
            </div>
        );
    }

    // ============================================
    // RENDER
    // ============================================
    return (
        <div className="StudentApplication">
            <div className="application-container">

                <div className="app-header">
                    <div className="header-icon-wrapper">
                        <FaUserGraduate className="header-icon" />
                    </div>
                    <div>
                        <h1>Edit Application</h1>
                        <p>Update student application details</p>
                    </div>
                </div>

                {successMessage && (
                    <div className="success-message">
                        <FaCheckCircle /> {successMessage}
                    </div>
                )}

                {serverError && (
                    <div className="error-message">
                        <FaExclamationTriangle /> {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="application-form">

                    {/* SECTION 1 */}
                    <div className="form-section">
                        <h3 className="section-title">
                            <FaUniversity className="section-icon" />
                            University & Program Selection
                        </h3>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Select University *</label>
                                <select
                                    name="university"
                                    value={formData.university}
                                    onChange={handleUniversityChange}
                                    onBlur={handleBlur}
                                    className={touched.university && errors.university ? 'error' : ''}
                                >
                                    <option value="">-- Select University --</option>
                                    {universities.map(uni => (
                                        <option key={uni._id} value={uni._id}>
                                            {uni.name} {uni.city ? `(${uni.city})` : ''}
                                        </option>
                                    ))}
                                </select>
                                {touched.university && errors.university && (
                                    <span className="error-text">{errors.university}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Select Program *</label>
                                <select
                                    name="program"
                                    value={formData.program}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={touched.program && errors.program ? 'error' : ''}
                                    disabled={!formData.university || loadingPrograms}
                                >
                                    <option value="">
                                        {loadingPrograms ? 'Loading...' : '-- Select Program --'}
                                    </option>
                                    {programs.map(prog => (
                                        <option key={prog._id} value={prog._id}>
                                            {prog.name}
                                        </option>
                                    ))}
                                </select>
                                {touched.program && errors.program && (
                                    <span className="error-text">{errors.program}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: STUDENT */}
                    <div className="form-section">
                        <h3 className="section-title">
                            <FaUser className="section-icon" />
                            Student Personal Information
                        </h3>

                        <div className="form-row">
                            <div className="form-group">
                                <label>First Name *</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={touched.firstName && errors.firstName ? 'error' : ''}
                                />
                                {touched.firstName && errors.firstName && (
                                    <span className="error-text">{errors.firstName}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Last Name *</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={touched.lastName && errors.lastName ? 'error' : ''}
                                />
                                {touched.lastName && errors.lastName && (
                                    <span className="error-text">{errors.lastName}</span>
                                )}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={touched.email && errors.email ? 'error' : ''}
                                />
                                {touched.email && errors.email && (
                                    <span className="error-text">{errors.email}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Phone *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    maxLength="10"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={touched.phone && errors.phone ? 'error' : ''}
                                />
                                {touched.phone && errors.phone && (
                                    <span className="error-text">{errors.phone}</span>
                                )}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Date of Birth *</label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={touched.dateOfBirth && errors.dateOfBirth ? 'error' : ''}
                                />
                                {touched.dateOfBirth && errors.dateOfBirth && (
                                    <span className="error-text">{errors.dateOfBirth}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Gender *</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={touched.gender && errors.gender ? 'error' : ''}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                {touched.gender && errors.gender && (
                                    <span className="error-text">{errors.gender}</span>
                                )}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                >
                                    <option value="General">General</option>
                                    <option value="OBC">OBC</option>
                                    <option value="SC">SC</option>
                                    <option value="ST">ST</option>
                                    <option value="EWS">EWS</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Nationality</label>
                                <input
                                    type="text"
                                    name="nationality"
                                    value={formData.nationality}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: ADDRESS */}
                    <div className="form-section">
                        <h3 className="section-title">
                            <FaMapMarkerAlt className="section-icon" />
                            Address Details
                        </h3>

                        <div className="form-group">
                            <label>Full Address *</label>
                            <textarea
                                name="address"
                                rows="2"
                                value={formData.address}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={touched.address && errors.address ? 'error' : ''}
                            />
                            {touched.address && errors.address && (
                                <span className="error-text">{errors.address}</span>
                            )}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>City *</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={touched.city && errors.city ? 'error' : ''}
                                />
                                {touched.city && errors.city && (
                                    <span className="error-text">{errors.city}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label>State *</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={touched.state && errors.state ? 'error' : ''}
                                />
                                {touched.state && errors.state && (
                                    <span className="error-text">{errors.state}</span>
                                )}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Pincode *</label>
                                <input
                                    type="text"
                                    name="pincode"
                                    maxLength="6"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={touched.pincode && errors.pincode ? 'error' : ''}
                                />
                                {touched.pincode && errors.pincode && (
                                    <span className="error-text">{errors.pincode}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 4: FAMILY */}
                    <div className="form-section">
                        <h3 className="section-title">
                            <FaUser className="section-icon" />
                            Family Information
                        </h3>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Father's Name</label>
                                <input
                                    type="text"
                                    name="fatherName"
                                    value={formData.fatherName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Mother's Name</label>
                                <input
                                    type="text"
                                    name="motherName"
                                    value={formData.motherName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Guardian Phone</label>
                                <input
                                    type="tel"
                                    name="guardianPhone"
                                    maxLength="10"
                                    value={formData.guardianPhone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Annual Family Income (₹)</label>
                                <input
                                    type="number"
                                    name="annualIncome"
                                    value={formData.annualIncome}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 5: ACADEMIC */}
                    <div className="form-section">
                        <h3 className="section-title">
                            <FaGraduationCap className="section-icon" />
                            Academic Information
                        </h3>

                        <div className="form-group">
                            <label>Previous Education *</label>
                            <input
                                type="text"
                                name="previousEducation"
                                value={formData.previousEducation}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={touched.previousEducation && errors.previousEducation ? 'error' : ''}
                            />
                            {touched.previousEducation && errors.previousEducation && (
                                <span className="error-text">{errors.previousEducation}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Previous Institute</label>
                            <input
                                type="text"
                                name="previousInstitute"
                                value={formData.previousInstitute}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Passing Year *</label>
                                <input
                                    type="number"
                                    name="passingYear"
                                    min="1990"
                                    max={new Date().getFullYear()}
                                    value={formData.passingYear}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={touched.passingYear && errors.passingYear ? 'error' : ''}
                                />
                                {touched.passingYear && errors.passingYear && (
                                    <span className="error-text">{errors.passingYear}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Percentage (%) *</label>
                                <input
                                    type="number"
                                    name="percentage"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    value={formData.percentage}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={touched.percentage && errors.percentage ? 'error' : ''}
                                />
                                {touched.percentage && errors.percentage && (
                                    <span className="error-text">{errors.percentage}</span>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>GPA (if applicable)</label>
                            <input
                                type="number"
                                name="gpa"
                                step="0.01"
                                min="0"
                                max="10"
                                value={formData.gpa}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* SECTION 6: STATEMENT */}
                    <div className="form-section">
                        <h3 className="section-title">
                            <FaFileAlt className="section-icon" />
                            Statement
                        </h3>

                        <div className="form-group">
                            <label>Why does this student deserve this scholarship? *</label>
                            <textarea
                                name="whyDeserve"
                                rows="5"
                                maxLength="2000"
                                value={formData.whyDeserve}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={touched.whyDeserve && errors.whyDeserve ? 'error' : ''}
                            />
                            <span className="char-count">{formData.whyDeserve.length}/2000</span>
                            {touched.whyDeserve && errors.whyDeserve && (
                                <span className="error-text">{errors.whyDeserve}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Achievements (Optional)</label>
                            <textarea
                                name="achievements"
                                rows="3"
                                value={formData.achievements}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* SECTION 7: BANK */}
                    <div className="form-section">
                        <h3 className="section-title">
                            <FaMoneyBillWave className="section-icon" />
                            Bank Details (Optional)
                        </h3>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Account Holder Name</label>
                                <input
                                    type="text"
                                    name="accountHolderName"
                                    value={formData.accountHolderName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Account Number</label>
                                <input
                                    type="text"
                                    name="accountNumber"
                                    value={formData.accountNumber}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>IFSC Code</label>
                                <input
                                    type="text"
                                    name="ifscCode"
                                    value={formData.ifscCode}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Bank Name</label>
                                <input
                                    type="text"
                                    name="bankName"
                                    value={formData.bankName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Branch Name</label>
                            <input
                                type="text"
                                name="branchName"
                                value={formData.branchName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* SECTION 8: BASIC DOCS */}
                    <div className="form-section">
                        <h3 className="section-title">
                            <FaFileUpload className="section-icon" />
                            Basic Documents
                        </h3>

                        <div className="form-row">
                            {renderProfilePhotoUpload()}
                            {renderFileUpload('ID Proof (Aadhar/PAN) *', 'idProof')}
                        </div>

                        <div className="form-row">
                            {renderFileUpload('Marksheet *', 'marksheet')}
                            {renderFileUpload('Income Certificate', 'incomeCertificate')}
                        </div>

                        <div className="form-row">
                            {renderFileUpload('Previous Certificate', 'previousCertificate')}
                            {renderFileUpload('Bank Passbook', 'bankPassbook')}
                        </div>
                    </div>

                    {/* SECTION 9: ADDITIONAL DOCS */}
                    <div className="form-section">
                        <h3 className="section-title">
                            <FaFolderOpen className="section-icon" />
                            Additional Documents
                        </h3>

                        <div className="form-row">
                            {renderFileUpload('Dependent Passport (if any)', 'dependentPassport1')}
                            {renderFileUpload('Visa Document', 'visaDocument')}
                        </div>

                        <div className="form-row">
                            {renderFileUpload('Sponsor Details', 'sponsorDetails')}
                            {renderFileUpload('Study Continuous Letter / Job Certificate', 'studyContinuousLetter')}
                        </div>

                        <div className="form-row">
                            {renderFileUpload('Bank Statement Letter', 'bankStatementLetter')}
                            {renderFileUpload('Dependent Passport 2nd (if any)', 'dependentPassport2')}
                        </div>

                        <div className="form-row">
                            {renderFileUpload('Visa Copies', 'visaCopies')}
                            {renderFileUpload('Transfer Students', 'transferStudents')}
                        </div>

                        <div className="form-row">
                            {renderFileUpload('Pending Document', 'pendingDocument')}
                            <div></div>
                        </div>
                    </div>

                    {/* SECTION 10: CONDITIONAL */}
                    <div className="form-section">
                        <h3 className="section-title">
                            <FaFileContract className="section-icon" />
                            Conditional Letter & Invoice
                        </h3>

                        <div className="form-row">
                            {renderFileUpload('Signed CAL', 'signedCAL')}
                            {renderFileUpload('Payment Invoice', 'paymentInvoice')}
                        </div>
                    </div>

                    {/* SECTION 11: PAYMENT RECEIPTS */}
                    <div className="form-section">
                        <h3 className="section-title">
                            <FaReceipt className="section-icon" />
                            Submit Payment Receipt
                        </h3>

                        <div className="form-row">
                            {renderFileUpload('Application fee payment receipt', 'applicationFeeReceipt')}
                            {renderFileUpload('Bank Check / Bank Draft', 'bankCheckDraft')}
                        </div>

                        <div className="form-row">
                            {renderFileUpload('English / Internal Exam payment fee receipt', 'englishExamReceipt')}
                            {renderFileUpload('Insurance Fee', 'insuranceFee')}
                        </div>

                        <div className="form-row">
                            {renderFileUpload('Internal admission fee / Registration fee', 'internalAdmissionFee')}
                            {renderFileUpload('Tuition Fee', 'tuitionFee')}
                        </div>
                    </div>

                    {/* SECTION 12: FINAL PORTFOLIO */}
                    <div className="form-section">
                        <h3 className="section-title">
                            <FaGraduationCap className="section-icon" />
                            Final Admission Portfolio
                        </h3>

                        <div className="form-row">
                            {renderFileUpload('Signed CAL', 'finalSignedCAL')}
                            {renderFileUpload('Payment Invoice', 'finalPaymentInvoice')}
                        </div>

                        <div className="form-row">
                            {renderFileUpload('Initial Admission Portfolio', 'initialAdmissionPortfolio')}
                            {renderFileUpload('Deferral Admission Portfolio', 'deferralAdmissionPortfolio')}
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="form-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => navigate('/agent/my-applications')}
                            disabled={submitLoading}
                        >
                            <FaArrowLeft /> Cancel
                        </button>

                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={submitLoading}
                        >
                            {submitLoading ? (
                                <>
                                    <FaSpinner className="spinner" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <FaSave />
                                    Update Application
                                    <FaArrowRight />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditApplication;