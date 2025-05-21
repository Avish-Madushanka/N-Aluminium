import React from 'react';
import { NavLink } from 'react-router-dom';

const BusinessSidebar = () => {
  return (
    <aside className="biz-sidebar-container">
      <div className="biz-sidebar-header">
        <h1 className="biz-sidebar-title">Business Panel</h1>
      </div>
      <nav>
        <ul className="biz-sidebar-nav">
          <li className="biz-sidebar-nav-item">
            <NavLink 
              to="/business-dashboard/edit-profile" 
              className={({ isActive }) => isActive ? "biz-sidebar-link active" : "biz-sidebar-link"}
            >
              Edit Business Profile
            </NavLink>
          </li>
          <li className="biz-sidebar-nav-item">
            <NavLink 
              to="/business-dashboard/add-project" 
              className={({ isActive }) => isActive ? "biz-sidebar-link active" : "biz-sidebar-link"}
            >
              Add Projects
            </NavLink>
          </li>
          <li className="biz-sidebar-nav-item">
            <NavLink 
              to="/business-dashboard/add-sale-item" 
              className={({ isActive }) => isActive ? "biz-sidebar-link active" : "biz-sidebar-link"}
            >
              Add Sale Items
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default BusinessSidebar;