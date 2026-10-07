// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// ===== AUTH PAGES =====
import SendPayment from './Pages/Admin/private/Payments/SendPayment';
import AdminSignUp from './Pages/Admin/auth/AdminSignUp';
import AdminSignIn from './Pages/Admin/auth/AdminSignIn';
import AgentSignUp from './Pages/Agent/auth/AgentSignUp';
import AgentSignIn from './Pages/Agent/auth/AgentSignIn';
import AgentStatus from './Pages/Agent/status/AgentStatus';

// ===== ADMIN UNIVERSITIES =====
import Universities from './Pages/Admin/private/Universities/Universities';
import AddUniversity from './Pages/Admin/private/Universities/AddUniversity';
import UniversityDetail from './Pages/Admin/private/Universities/UniversityDetail';

// ===== ADMIN PROGRAMS =====
import Programs from './Pages/Admin/private/Programs/Programs';
import AddProgram from './Pages/Admin/private/Programs/AddProgram';
import ProgramDetail from './Pages/Admin/private/Programs/ProgramDetail';

// ===== ADMIN APPLICATIONS =====
import ViewApplications from './Pages/Admin/private/Applications/ViewApplications';
import AdminApplications from './Pages/Admin/private/Applications/AdminApplications';
import AdminViewApplication from './Pages/Admin/private/Applications/AdminViewApplication';
import AdminEditApplication from './Pages/Admin/private/Applications/AdminEditApplication';
import Payments from './Pages/Admin/private/Payments/Payments';
// ===== AGENT PAGES =====
import AgentDashboard from './Pages/Agent/private/AgentDashboard';
import StudentApplication from './Pages/Agent/private/Application/StudentApplication';
import MyApplications from './Pages/Agent/private/Application/MyApplications';
import ViewApplication from './Pages/Agent/private/Application/ViewApplication';
import EditApplication from './Pages/Agent/private/Application/EditApplication';

// ===== ADMIN PAGES =====
import AdminDashboard from './Pages/Admin/private/AdminDashboard';

// ===== LAYOUTS =====
import AdminLayout from './Layout/AdminLayout';
import AgentLayout from './Layout/AgentLayout';

// ===== 404 =====
import NotFound from './Pages/NotFound/NotFound';

// ===== OTHER PAGES =====
import './App.css';
import ReceivePayment from './Pages/Admin/private/Payments/ReceivePayment';
import AgentPayments from './Pages/Agent/Payments/AgentPayments';
import Home from './Home/Login';
import AgentCertificate from './Pages/Agent/private/AgentCertificate/AgentCertificate';
import CertificatePreview from './Pages/Admin/private/CertificateSettings/CertificatePreview';
import CertificateSettings from './Pages/Admin/private/CertificateSettings/CertificateSettings';
import RenewalRequests from './Pages/Admin/private/CertificateSettings/RenewalRequests';
import ForgotPassword from './Pages/Admin/private/ForgotPassword/ForgotPassword';
import AgentForgotPassword from './Pages/Agent/AgentForgotPassword/AgentForgotPassword';
import AdminProfile from './Pages/Admin/private/profile/AdminProfile';
import AddNewUser from './Pages/Admin/AddNewUser/AddNewUser';
import SubUserSignIn from './Users/auth/SubUserSignIn';
import AgentProfile from './Pages/Agent/private/AgentProfile/AgentProfile';

// ===== PROTECTION =====
import ProtectedPage from './Components/ProtectedPage';
import AccessDenied from './Shared/AccessDenied';
import ContactSettings from './Pages/Admin/private/ContactSettings/ContactSettings';
import ContactUs from './Pages/Agent/private/ContactUs/ContactUs';
// import AccessDenied from './Pages/Shared/AccessDenied';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* ===== DEFAULT ===== */}
                    <Route path="/" element={<Home />} />
                    <Route path="/sub-user/signin" element={<SubUserSignIn />} />

                    {/* ===== ADMIN AUTH ROUTES ===== */}
                    <Route path="/signup" element={<AdminSignUp />} />
                    <Route path="/signin" element={<AdminSignIn />} />
                    <Route path="/admin/forgot-passwords" element={<ForgotPassword />} />
                    <Route path="/agent/forgot-password" element={<AgentForgotPassword />} />

                    {/* ===== AGENT AUTH ROUTES ===== */}
                    <Route path="/agent/signup" element={<AgentSignUp />} />
                    <Route path="/agent/login" element={<AgentSignIn />} />
                    <Route path="/agent/status" element={<AgentStatus />} />

                    {/* ============================================ */}
                    {/* ADMIN LAYOUT ROUTES (WITH PROTECTION) */}
                    {/* ============================================ */}
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<Navigate to="/admin/dashboard" replace />} />

                        {/* Dashboard */}
                        <Route
                            path="dashboard"
                            element={<ProtectedPage pageKey="dashboard"><AdminDashboard /></ProtectedPage>}
                        />

                        {/* Profile — sabke liye accessible */}
                        <Route path="profile" element={<AdminProfile />} />

                        {/* ===== AGENTS MANAGEMENT ===== */}
                        <Route
                            path="agents"
                            element={<ProtectedPage pageKey="agents"><ViewApplications /></ProtectedPage>}
                        />
                        <Route
                            path="agents/pending"
                            element={<ProtectedPage pageKey="agents"><ViewApplications /></ProtectedPage>}
                        />
                        <Route
                            path="agents/approved"
                            element={<ProtectedPage pageKey="agents"><ViewApplications /></ProtectedPage>}
                        />
                        <Route
                            path="agents/rejected"
                            element={<ProtectedPage pageKey="agents"><ViewApplications /></ProtectedPage>}
                        />

                        {/* ===== USERS MANAGEMENT ===== */}
                        <Route
                            path="add-user"
                            element={<ProtectedPage pageKey="users"><AddNewUser /></ProtectedPage>}
                        />

                        {/* ===== PAYMENTS ===== */}
                        <Route
                            path="payments/receive"
                            element={<ProtectedPage pageKey="payments"><ReceivePayment /></ProtectedPage>}
                        />
                        <Route
                            path="payments/send"
                            element={<ProtectedPage pageKey="payments"><SendPayment /></ProtectedPage>}
                        />
                        <Route
                            path="payments"
                            element={<ProtectedPage pageKey="payments"><Payments /></ProtectedPage>}
                        />

                        {/* ===== UNIVERSITIES ===== */}
                        <Route
                            path="universities"
                            element={<ProtectedPage pageKey="universities"><Universities /></ProtectedPage>}
                        />
                        <Route
                            path="universities/add"
                            element={<ProtectedPage pageKey="universities"><AddUniversity /></ProtectedPage>}
                        />
                        <Route
                            path="universities/edit/:id"
                            element={<ProtectedPage pageKey="universities"><AddUniversity /></ProtectedPage>}
                        />
                        <Route
                            path="universities/:id"
                            element={<ProtectedPage pageKey="universities"><UniversityDetail /></ProtectedPage>}
                        />

                        {/* ===== CERTIFICATE ===== */}
                        <Route
                            path="certificate-settings"
                            element={<ProtectedPage pageKey="certificate-settings"><CertificateSettings /></ProtectedPage>}
                        />
                        <Route
                            path="certificate-preview"
                            element={<ProtectedPage pageKey="certificate-settings"><CertificatePreview /></ProtectedPage>}
                        />  
                        <Route
    path="contact-settings"
    element={<ProtectedPage pageKey="contact-settings"><ContactSettings /></ProtectedPage>}
/>

                        {/* ===== RENEWALS ===== */}
                        <Route
                            path="renewals"
                            element={<ProtectedPage pageKey="renewals"><RenewalRequests /></ProtectedPage>}
                        />

                        {/* ===== PROGRAMS ===== */}
                        <Route
                            path="programs"
                            element={<ProtectedPage pageKey="programs"><Programs /></ProtectedPage>}
                        />
                        <Route
                            path="programs/add"
                            element={<ProtectedPage pageKey="programs"><AddProgram /></ProtectedPage>}
                        />
                        <Route
                            path="programs/edit/:id"
                            element={<ProtectedPage pageKey="programs"><AddProgram /></ProtectedPage>}
                        />
                        <Route
                            path="programs/:id"
                            element={<ProtectedPage pageKey="programs"><ProgramDetail /></ProtectedPage>}
                        />

                        {/* ===== APPLICATIONS MANAGEMENT ===== */}
                        <Route
                            path="applications"
                            element={<ProtectedPage pageKey="applications"><AdminApplications /></ProtectedPage>}
                        />
                        <Route
                            path="applications/edit/:id"
                            element={<ProtectedPage pageKey="applications"><AdminEditApplication /></ProtectedPage>}
                        />
                        <Route
                            path="applications/:id"
                            element={<ProtectedPage pageKey="applications"><AdminViewApplication /></ProtectedPage>}
                        />

                        {/* ===== FALLBACK for /admin/* ===== */}
                        <Route path="*" element={<AccessDenied />} />
                    </Route>

                    {/* ============================================ */}
                    {/* AGENT LAYOUT ROUTES */}
                    {/* ============================================ */}
                    <Route path="/agent" element={<AgentLayout />}>
                        <Route index element={<Navigate to="/agent/dashboard" replace />} />
                        <Route path="dashboard" element={<AgentDashboard />} />

                        {/* Applications */}
                        <Route path="student-application" element={<StudentApplication />} />
                        <Route path="my-applications" element={<MyApplications />} />
                        <Route path="view-application/:id" element={<ViewApplication />} />
                        <Route path="edit-application/:id" element={<EditApplication />} />

                        {/* Payments */}
                        <Route path="payments" element={<AgentPayments />} />

                        {/* Certificate */}
                        <Route path="certificate" element={<AgentCertificate />} />
<Route path="contact-us" element={<ContactUs />} />
                        {/* Profile */}
                        <Route path="profile" element={<AgentProfile />} />
                    </Route>

                    {/* ===== 404 ===== */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;