// src/Components/Admin/AdNav/AdNav.jsx
import React from 'react';
import './AdNav.css'; // Make sure this CSS file exists and is correct
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faQuestionCircle, faSignOutAlt, faTachometerAlt, faBox, faUsers, faStar, faCreditCard, faLink, faCalendarAlt, faEnvelope, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { NavLink, useNavigate } from 'react-router-dom'; // Use NavLink for active styling

function AdNavComponent({ handleLogout }) {
    const navigate = useNavigate();

    const performLogout = (e) => {
        e.preventDefault();
        if (handleLogout) {
            handleLogout(); // Use the function passed from AdminLayout/App
        } else {
            console.warn("handleLogout prop not provided to AdNav");
            navigate('/login'); // Fallback
        }
    };

    return (
        // Sidebar container
        <aside className="sidebar"> {/* Ensure CSS targets .sidebar */}
            <div className="logo">
                <span className="logo-text">Admin Panel</span> {/* Or your logo */}
            </div>

            <nav className="menu">
                {/* General Section */}
                <div className="menu-section">
                    <div className="menu-section-title">GENERAL</div>
                    <ul>
                        {/* Update 'to' props to match App.jsx routes */}
                        <li>
                            <NavLink to="/Admin/Dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                                <FontAwesomeIcon icon={faTachometerAlt} className="menu-icon" /> Dashboard
                            </NavLink>
                        </li>
                        <li>
                            {/* Assuming AdCalendar component handles "Settings" or "Schedule" */}
                            <NavLink to="/Admin/Calendar" className={({ isActive }) => isActive ? 'active' : ''}>
                                <FontAwesomeIcon icon={faCalendarAlt} className="menu-icon" /> Schedule Mgmt
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/Admin/Requests" className={({ isActive }) => isActive ? 'active' : ''}>
                                <FontAwesomeIcon icon={faBox} className="menu-icon" /> Pickup Requests
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/Admin/Emails" className={({ isActive }) => isActive ? 'active' : ''}>
                                <FontAwesomeIcon icon={faEnvelope} className="menu-icon" /> Check Emails
                            </NavLink>
                        </li>
                         <li>
                            <NavLink to="/Admin/ManageOwners" className={({ isActive }) => isActive ? 'active' : ''}>
                                <FontAwesomeIcon icon={faBuilding} className="menu-icon" /> Business Owners
                            </NavLink>
                        </li>
                        <li>
                           <NavLink to="/Admin/DisReview" className={({ isActive }) => isActive ? 'active' : ''}>
                                <FontAwesomeIcon icon={faStar} className="menu-icon" /> Reviews
                            </NavLink>
                        </li>
                        {/*
                         <li>
                            <NavLink to="/Admin/Payments" className={({ isActive }) => isActive ? 'active' : ''}>
                                <FontAwesomeIcon icon={faCreditCard} className="menu-icon" /> Payments
                            </NavLink>
                        </li>
                         <li>
                            <NavLink to="/Admin/Integrations" className={({ isActive }) => isActive ? 'active' : ''}>
                                <FontAwesomeIcon icon={faLink} className="menu-icon" /> Integrations
                            </NavLink>
                        </li>
                        */}
                    </ul>
                </div>

                {/* Account Section */}
                <div className="menu-section">
                     <div className="menu-section-title">ACCOUNT & SUPPORT</div>
                    <ul>
                        {/* Update paths for future routes */}
                        {/*
                        <li>
                            <NavLink to="/Admin/GeneralSettings" className={({ isActive }) => isActive ? 'active' : ''}>
                                <FontAwesomeIcon icon={faCog} className="menu-icon" /> Settings
                            </NavLink>
                        </li>
                        <li>
                           <NavLink to="/Admin/Help" className={({ isActive }) => isActive ? 'active' : ''}>
                                <FontAwesomeIcon icon={faQuestionCircle} className="menu-icon" /> Help
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/Admin/ManageUsers" className={({ isActive }) => isActive ? 'active' : ''}>
                                <FontAwesomeIcon icon={faUsers} className="menu-icon" /> Manage Users
                            </NavLink>
                        </li>
                        */}
                         <li>
                           {/* Placeholder Link - Update or Remove */}
                           <a href="#" style={{ opacity: 0.6, cursor: 'not-allowed' }}>
                                <FontAwesomeIcon icon={faCog} className="menu-icon" /> Settings (TBD)
                            </a>
                        </li>
                         <li>
                           {/* Placeholder Link - Update or Remove */}
                           <a href="#" style={{ opacity: 0.6, cursor: 'not-allowed' }}>
                                <FontAwesomeIcon icon={faQuestionCircle} className="menu-icon" /> Help (TBD)
                            </a>
                        </li>

                    </ul>
                </div>
            </nav>

            {/* Logout Section */}
            <div className="logout">
                {/* Use button semantics for actions, styled as needed */}
                <button onClick={performLogout} className="logout-button"> {/* Style .logout-button in CSS */}
                    <FontAwesomeIcon icon={faSignOutAlt} className="menu-icon" />
                    Logout
                </button>
            </div>
        </aside>
    );
}

export default AdNavComponent;