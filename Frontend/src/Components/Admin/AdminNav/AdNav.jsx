import React from 'react';
import './AdNav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faQuestionCircle, faSignOutAlt, faTachometerAlt, faBox, faUsers, faStar, faCreditCard, faLink, faCalendarAlt, faEnvelope, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { NavLink, useNavigate } from 'react-router-dom'; 

function AdNavComponent({ handleLogout }) {
    const navigate = useNavigate();

    const performLogout = (e) => {
        e.preventDefault();
        if (handleLogout) {
            handleLogout(); 
        } else {
            console.warn("handleLogout prop not provided to AdNav");
            navigate('/login');
        }
    };

    return (
        <aside className="sidebar"> 
            <div className="logo">
                <span className="logo-text">Admin Panel</span> 
            </div>

            <nav className="menu">
                <div className="menu-section">
                    <div className="menu-section-title">GENERAL</div>
                    <ul>
                        <li>
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
                            <NavLink to="/Admin/AdminLocationManager" className={({ isActive }) => isActive ? 'active' : ''}>
                                <FontAwesomeIcon icon={faCreditCard} className="menu-icon" /> Add Shop Location
                            </NavLink>
                        </li> 
                        <li>
                            <NavLink to="/ItemsAddForm" className={({ isActive }) => isActive ? 'active' : ''}>
                                <FontAwesomeIcon icon={faCreditCard} className="menu-icon" /> Add Items for Marketplace
                            </NavLink>
                        </li> 
                        <li>
                            <NavLink to="/Admin/AdQuotation" className={({ isActive }) => isActive ? 'active' : ''}>
                                <FontAwesomeIcon icon={faCreditCard} className="menu-icon" /> Check Project Quotations
                            </NavLink>
                        </li> 
                    </ul>
                </div>
             </nav>
        </aside>
    );
}

export default AdNavComponent;