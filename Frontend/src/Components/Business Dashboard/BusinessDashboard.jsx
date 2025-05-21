import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import BusinessSidebar from './BusinessSidebar';
import './BusinessDashboard.css'; 

const BusinessDashboard = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  if (!userInfo || (userInfo.role !== 'businessOwner' && userInfo.role !== 'admin')) {
    return <Navigate to="/login" replace />; 
  }
  
  return (
    <div className="biz-dash-layout">
      <BusinessSidebar />
      <main className="biz-content-area">
        <Outlet /> 
      </main>
    </div>
  );
};

export default BusinessDashboard;