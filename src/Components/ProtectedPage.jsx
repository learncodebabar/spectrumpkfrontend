// src/components/ProtectedPage.jsx
import React from 'react';
import AccessDenied from '../Shared/AccessDenied';
// import AccessDenied from '../Pages/Shared/AccessDenied';

/**
 * Wrap any page with this to protect by permission.
 * Super admin (default) = always allowed.
 *
 * Usage:
 *   <ProtectedPage pageKey="agents">
 *       <ViewApplications />
 *   </ProtectedPage>
 */
const ProtectedPage = ({ pageKey, children }) => {
    // Read role + permissions from localStorage
    const role = localStorage.getItem('adminRole') || 'admin';

    // Super admin / admin = always access
    if (role !== 'sub_admin') {
        return children;
    }

    // Sub-user: check permissions
    let permissions = [];
    try {
        const data = JSON.parse(localStorage.getItem('adminData') || '{}');
        permissions = data.permissions || [];
    } catch {
        permissions = [];
    }

    if (!permissions.includes(pageKey)) {
        return <AccessDenied />;
    }

    return children;
};

export default ProtectedPage;