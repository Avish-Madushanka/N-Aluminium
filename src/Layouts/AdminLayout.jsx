// src/Layouts/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdNav from '../Components/Admin/AdminNav/AdNav'; // Adjust path if needed
import './AdminLayout.css'; // Create this CSS file for layout styling

// Accept handleLogout to pass down to AdNav
const AdminLayout = ({ handleLogout }) => {
    return (
        <div className="admin-layout-container"> {/* Main container */}
            <div className="sidebar-container">
                <AdNav handleLogout={handleLogout} /> {/* The Sidebar */}
            </div>
            <div className="content-wrapper">
                <main className="admin-main-content"> {/* Scrollable area for page content */}
                    <Outlet /> {/* Nested route components will render here */}
                </main>
                <footer className="admin-footer">
                    {/* Footer content goes here */}
                    <p>&copy; 2025 Your Company Name. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default AdminLayout;