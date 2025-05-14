import React from 'react';
import { NavLink } from 'react-router-dom';
// import { DashboardIcon, EditIcon, AddProjectIcon, AddSaleItemIcon } from './YourIcons'; // Example: Import SVG icons if you have them

const BusinessSidebar = () => {
  return (
    <aside className="biz-sidebar-container">
      <div className="biz-sidebar-header">
        <h1 className="biz-sidebar-title">Business Panel</h1>
      </div>
      <nav>
        <ul className="biz-sidebar-nav">
          {/* Optional Dashboard/Welcome Link 
          <li className="biz-sidebar-nav-item">
            <NavLink 
              to="/business-dashboard" 
              className={({ isActive }) => isActive ? "biz-sidebar-link active" : "biz-sidebar-link"}
              end // Use 'end' for the base path to avoid matching all child routes
            >
              Dashboard
            </NavLink>
          </li>
          */}
          <li className="biz-sidebar-nav-item">
            <NavLink 
              to="/business-dashboard/edit-profile" 
              className={({ isActive }) => isActive ? "biz-sidebar-link active" : "biz-sidebar-link"}
            >
              {/* <EditIcon /> Optional Icon */}
              Edit Business Profile
            </NavLink>
          </li>
          <li className="biz-sidebar-nav-item">
            <NavLink 
              to="/business-dashboard/add-project" 
              className={({ isActive }) => isActive ? "biz-sidebar-link active" : "biz-sidebar-link"}
            >
              {/* <AddProjectIcon /> Optional Icon */}
              Add Projects
            </NavLink>
          </li>
          <li className="biz-sidebar-nav-item">
            <NavLink 
              to="/business-dashboard/add-sale-item" 
              className={({ isActive }) => isActive ? "biz-sidebar-link active" : "biz-sidebar-link"}
            >
              {/* <AddSaleItemIcon /> Optional Icon */}
              Add Sale Items
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default BusinessSidebar;