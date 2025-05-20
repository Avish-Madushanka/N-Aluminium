import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdNav from '../Components/Admin/AdminNav/AdNav';
import '../Components/Admin/AdminNav/AdNav.css';

function AdminLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        console.log("Admin logging out...");
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        navigate('/login', { replace: true });
    };

    return (
        <div className="dashboard-container">
            <AdNav handleLogout={handleLogout} />
            <div className="content-wrapper">
                <main className="main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;
