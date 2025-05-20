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
                            <NavLink to="/Admin/Scrap" className={({ isActive }) => isActive ? 'active' : ''}>
                                <FontAwesomeIcon icon={faBox} className="menu-icon" /> Scrap Calculator
                            </NavLink>
                        </li>
                         <li>
                            <NavLink to="/Admin/ManageOwners" className={({ isActive }) => isActive ? 'active' : ''}>
                                <FontAwesomeIcon icon={faBuilding} className="menu-icon" /> Business Owners
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/Admin/AdminLocationManager" className={({ isActive }) => isActive ? 'active' : ''}>
                                <FontAwesomeIcon icon={faCreditCard} className="menu-icon" /> Add Shop Location
                            </NavLink>
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