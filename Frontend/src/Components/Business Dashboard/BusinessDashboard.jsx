import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import BusinessSidebar from './BusinessSidebar';
import './BusinessDashboard.css'; // Main CSS for the dashboard layout

const BusinessDashboard = () => {
  // Basic check for user authentication/role, redirect if not logged in or wrong role
  // This should be more robust in a real app, e.g., using a context or Redux store
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  if (!userInfo || (userInfo.role !== 'businessOwner' && userInfo.role !== 'admin')) {
    // Redirect to login or an unauthorized page
    // alert('Access Denied. You must be a business owner or admin to view this page.');
    return <Navigate to="/login" replace />; // Adjust redirect path as needed
  }
  
  return (
    <div className="biz-dash-layout">
      <BusinessSidebar />
      <main className="biz-content-area">
        {/* Child routes will be rendered here */}
        <Outlet /> 
      </main>
    </div>
  );
};

export default BusinessDashboard;