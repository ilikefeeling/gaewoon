import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// User App
import UserApp from './UserApp';

// Admin App
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/pages/Dashboard';
import UsersPage from './admin/pages/UsersPage';
import { PaymentsPage, ContentPage } from './admin/pages/OtherPages';

import './styles/index.css';

function App() {
    return (
        <Router>
            <Routes>
                {/* User App Route - Default */}
                <Route path="/" element={<UserApp />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="users" element={<UsersPage />} />
                    <Route path="payments" element={<PaymentsPage />} />
                    <Route path="content" element={<ContentPage />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
