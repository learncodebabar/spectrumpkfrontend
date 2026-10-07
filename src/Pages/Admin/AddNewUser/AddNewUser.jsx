// src/Pages/Admin/private/AddNewUser/AddNewUser.jsx
import React, { useState, useEffect } from 'react';
import {
    FaUserPlus, FaSave, FaSpinner, FaTimes,
    FaEdit, FaTrash, FaEye, FaEyeSlash, FaCheckCircle, FaExclamationTriangle
} from 'react-icons/fa';
// import adminApi from '../../../../api/adminApi';
import './AddNewUser.css';
import adminApi from '../../../api/adminApi';

const AddNewUser = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [users, setUsers] = useState([]);
    const [availablePages, setAvailablePages] = useState([]);
    const [toast, setToast] = useState({ show: false, msg: '', type: 'success' });

    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);   // null = add new

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        permissions: [],
        isActive: true
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const showToast = (msg, type = 'success') => {
        setToast({ show: true, msg, type });
        setTimeout(() => setToast({ show: false, msg: '', type: 'success' }), 4000);
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersRes, pagesRes] = await Promise.all([
                adminApi.getAllSubUsers(),
                adminApi.getAvailablePages()
            ]);
            if (usersRes.success) setUsers(usersRes.users || []);
            if (pagesRes.success) setAvailablePages(pagesRes.pages || []);
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to load', 'error');
        } finally {
            setLoading(false);
        }
    };

    const openAddModal = () => {
        setEditingUser(null);
        setForm({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            permissions: [],
            isActive: true
        });
        setShowModal(true);
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setForm({
            name: user.name,
            email: user.email,
            password: '',
            confirmPassword: '',
            permissions: user.permissions || [],
            isActive: user.isActive
        });
        setShowModal(true);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const togglePermission = (key) => {
        setForm(prev => ({
            ...prev,
            permissions: prev.permissions.includes(key)
                ? prev.permissions.filter(p => p !== key)
                : [...prev.permissions, key]
        }));
    };

    const toggleAllGroup = (group) => {
        const groupKeys = availablePages
            .filter(p => p.group === group)
            .map(p => p.key);

        const allSelected = groupKeys.every(k => form.permissions.includes(k));

        setForm(prev => ({
            ...prev,
            permissions: allSelected
                ? prev.permissions.filter(p => !groupKeys.includes(p))
                : [...new Set([...prev.permissions, ...groupKeys])]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name || !form.email) {
            return showToast('Name and email are required', 'error');
        }

        if (!editingUser && !form.password) {
            return showToast('Password is required', 'error');
        }

        if (form.password && form.password !== form.confirmPassword) {
            return showToast('Passwords do not match', 'error');
        }

        if (form.permissions.length === 0) {
            return showToast('Please select at least one page', 'error');
        }

        setSaving(true);
        try {
            if (editingUser) {
                // Update
                const payload = {
                    name: form.name,
                    permissions: form.permissions,
                    isActive: form.isActive
                };
                if (form.password) payload.newPassword = form.password;

                const res = await adminApi.updateSubUser(editingUser._id, payload);
                if (res.success) {
                    showToast('✅ User updated successfully!', 'success');
                    setShowModal(false);
                    fetchData();
                }
            } else {
                // Create
                const res = await adminApi.createSubUser({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    confirmPassword: form.confirmPassword,
                    permissions: form.permissions
                });
                if (res.success) {
                    showToast('✅ User created successfully!', 'success');
                    setShowModal(false);
                    fetchData();
                }
            }
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to save', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (user) => {
        if (!window.confirm(`Delete user "${user.name}"?`)) return;
        try {
            const res = await adminApi.deleteSubUser(user._id);
            if (res.success) {
                showToast('User deleted', 'success');
                fetchData();
            }
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to delete', 'error');
        }
    };

    const groupedPages = availablePages.reduce((acc, page) => {
        if (!acc[page.group]) acc[page.group] = [];
        acc[page.group].push(page);
        return acc;
    }, {});

    if (loading) {
        return (
            <div className="adduser-loading">
                <FaSpinner className="spin" /> Loading...
            </div>
        );
    }

    return (
        <div className="adduser-page">

            {toast.show && (
                <div className={`adduser-toast ${toast.type}`}>
                    {toast.type === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
                    {toast.msg}
                </div>
            )}

            {/* HEADER */}
            <div className="adduser-header">
                <div>
                    <h1><FaUserPlus /> Manage Users</h1>
                    <p>Add new users and control their page access</p>
                </div>
                <button className="adduser-add-btn" onClick={openAddModal}>
                    <FaUserPlus /> Add New User
                </button>
            </div>

            {/* USERS LIST */}
            {users.length === 0 ? (
                <div className="adduser-empty">
                    <FaUserPlus />
                    <h3>No users added yet</h3>
                    <p>Click "Add New User" to create your first sub-user</p>
                </div>
            ) : (
                <div className="adduser-grid">
                    {users.map(user => (
                        <div key={user._id} className="adduser-card">
                            <div className="adduser-card-header">
                                <div className="adduser-avatar">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="adduser-info">
                                    <h3>{user.name}</h3>
                                    <p>{user.email}</p>
                                </div>
                                <span className={`adduser-status ${user.isActive ? 'active' : 'inactive'}`}>
                                    {user.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>

                            <div className="adduser-perms">
                                <span className="adduser-perms-label">
                                    {user.permissions?.length || 0} pages access
                                </span>
                                <div className="adduser-perm-tags">
                                    {(user.permissions || []).slice(0, 5).map(p => (
                                        <span key={p} className="adduser-perm-tag">
                                            {availablePages.find(ap => ap.key === p)?.label || p}
                                        </span>
                                    ))}
                                    {(user.permissions || []).length > 5 && (
                                        <span className="adduser-perm-tag more">
                                            +{user.permissions.length - 5} more
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="adduser-card-actions">
                                <button
                                    className="adduser-btn edit"
                                    onClick={() => openEditModal(user)}
                                >
                                    <FaEdit /> Edit
                                </button>
                                <button
                                    className="adduser-btn delete"
                                    onClick={() => handleDelete(user)}
                                >
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL */}
            {showModal && (
                <div className="adduser-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="adduser-modal" onClick={e => e.stopPropagation()}>

                        <div className="adduser-modal-header">
                            <h2>
                                {editingUser ? 'Edit User' : 'Add New User'}
                            </h2>
                            <button
                                className="adduser-modal-close"
                                onClick={() => setShowModal(false)}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="adduser-form">

                            {/* BASIC INFO */}
                            <div className="adduser-section">
                                <h3>User Info</h3>

                                <div className="adduser-form-group">
                                    <label>Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>

                                <div className="adduser-form-group">
                                    <label>Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="user@example.com"
                                        disabled={!!editingUser}
                                        required
                                    />
                                    {editingUser && (
                                        <small className="adduser-hint">Email cannot be changed</small>
                                    )}
                                </div>

                                <div className="adduser-form-row">
                                    <div className="adduser-form-group">
                                        <label>
                                            {editingUser ? 'New Password (optional)' : 'Password *'}
                                        </label>
                                        <div className="adduser-password-wrap">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={form.password}
                                                onChange={handleChange}
                                                placeholder="Min 6 chars"
                                                required={!editingUser}
                                            />
                                            <button
                                                type="button"
                                                className="adduser-pw-toggle"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="adduser-form-group">
                                        <label>Confirm Password</label>
                                        <div className="adduser-password-wrap">
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                name="confirmPassword"
                                                value={form.confirmPassword}
                                                onChange={handleChange}
                                                placeholder="Confirm"
                                                required={!editingUser && !!form.password}
                                            />
                                            <button
                                                type="button"
                                                className="adduser-pw-toggle"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {editingUser && (
                                    <div className="adduser-form-group">
                                        <label className="adduser-checkbox-label">
                                            <input
                                                type="checkbox"
                                                name="isActive"
                                                checked={form.isActive}
                                                onChange={handleChange}
                                            />
                                            <span>Active (user can login)</span>
                                        </label>
                                    </div>
                                )}
                            </div>

                            {/* PERMISSIONS */}
                            <div className="adduser-section">
                                <h3>Page Access ({form.permissions.length} selected)</h3>
                                <p className="adduser-hint">
                                    Select which pages this user can access
                                </p>

                                {Object.entries(groupedPages).map(([group, pages]) => {
                                    const groupKeys = pages.map(p => p.key);
                                    const allSelected = groupKeys.every(k => form.permissions.includes(k));
                                    const someSelected = groupKeys.some(k => form.permissions.includes(k));

                                    return (
                                        <div key={group} className="adduser-perm-group">
                                            <div className="adduser-perm-group-header">
                                                <label className="adduser-perm-group-label">
                                                    <input
                                                        type="checkbox"
                                                        checked={allSelected}
                                                        ref={el => {
                                                            if (el) el.indeterminate = someSelected && !allSelected;
                                                        }}
                                                        onChange={() => toggleAllGroup(group)}
                                                    />
                                                    <strong>{group}</strong>
                                                </label>
                                            </div>
                                            <div className="adduser-perm-list">
                                                {pages.map(page => (
                                                    <label key={page.key} className="adduser-perm-item">
                                                        <input
                                                            type="checkbox"
                                                            checked={form.permissions.includes(page.key)}
                                                            onChange={() => togglePermission(page.key)}
                                                        />
                                                        <span>{page.label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* ACTIONS */}
                            <div className="adduser-modal-actions">
                                <button
                                    type="button"
                                    className="adduser-btn cancel"
                                    onClick={() => setShowModal(false)}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="adduser-btn primary"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <><FaSpinner className="spin" /> Saving...</>
                                    ) : (
                                        <><FaSave /> {editingUser ? 'Update' : 'Create'} User</>
                                    )}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AddNewUser;