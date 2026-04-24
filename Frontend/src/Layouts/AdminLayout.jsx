import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import AdNavComponent from '../Components/Admin/AdminNav/AdNav';
import './AdminLayout.css';

function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        navigate('/login', { replace: true });
    };

    const getPageTitle = () => {
        const path = location.pathname;
        
        // Pickup & Schedule Services
        if (path.includes('/Admin/Calendar')) return 'Schedule Management';
        if (path.includes('/Admin/Requests')) return 'Pickup Requests';
        
        // Aluminum Training Programme
        if (path.includes('/Admin/AdminAlumni')) return 'Check Trainers Requests';
        if (path.includes('/Admin/VideoManage')) return 'Training Video Management';
        
        // Items Marketplace
        if (path.includes('/ItemsAddForm')) return 'Add Items for Marketplace';
        if (path.includes('/Admin/AccItemReq')) return 'Check Items Orders';
        if (path.includes('/Admin/ItemsManage')) return 'Manage All Items';
        
        // Glass Order System
        if (path.includes('/Admin/AdGlassManage')) return 'Glass Price Management';
        if (path.includes('/Admin/AdminOrderManage')) return 'Check Glass Orders';
        
        // General
        if (path.includes('/Admin/Scrap')) return 'Scrap Calculator';
        if (path.includes('/Admin/AdminLocationManager')) return 'Add Shop Location';
        if (path.includes('/Admin/ProManage')) return 'Manage Upload Projects';
        if (path.includes('/Admin/BuyandSellManage')) return 'Manage Buy & Sell';
        if (path.includes('/Admin/AdQuotation')) return 'Check Project Quotations';
        if (path.includes('/Admin/') && path.endsWith('/Admin/')) return '360 Dashboard';
        
        return 'Dashboard';
    };

    const getUserInfo = () => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            try {
                return JSON.parse(userInfo);
            } catch (e) {
                return null;
            }
        }
        return null;
    };

    const user = getUserInfo();
    const userName = user?.name || user?.email || 'Admin';
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <div className="admin-dashboard-container">
            <AdNavComponent handleLogout={handleLogout} />
            <div className="admin-content-wrapper">
                <main className="admin-main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;