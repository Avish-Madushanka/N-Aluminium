// src/Components/Admin/AdNav/AdNav.jsx
import React from 'react';
import './AdNav.css'; // Make sure this CSS file exists and is correct
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCog, faQuestionCircle, faUserCog, faSignOutAlt, faTachometerAlt, faBox, faUsers, faStar, faCreditCard, faLink, faCalendarAlt, faEnvelope, faBuilding } from '@fortawesome/free-solid-svg-icons'; // Added more icons
// Removed faProductHunt, using faEnvelope instead
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'; // Import NavLink

// Accept handleLogout as a prop
// Define the function using standard function declaration or const
function AdNavComponent({ handleLogout }) { // Renamed internally to avoid conflict with default export name
    const location = useLocation(); // Use hook to get current path
    const navigate = useNavigate(); // Use hook for navigation

    // Function to handle the logout action
    const performLogout = (e) => {
        e.preventDefault(); // Prevent default link behavior
        if (handleLogout) {
            handleLogout(); // Call the function passed from the parent
        } else {
            console.warn("handleLogout prop not provided to AdNav");
            // Fallback or redirect logic if needed
            navigate('/login');
        }
    };


    return (
        // The main container (.dashboard-container) is now handled by the layout component
        <aside className="sidebar">
            <div className="logo">
                {/* Choose one logo representation */}
                <span className="logo-text">Admin Panel</span> {/* Example text logo */}
                {/* Or keep your icon if preferred: */}
                {/* <span className="logo-icon">subcom</span> */}
                {/* Toggle might need state if you implement sidebar collapse */}
                {/* <FontAwesomeIcon icon={faBars} className="menu-toggle" /> */}
            </div>

            <nav className="menu">
                {/* Use NavLink for automatic active class styling */}
                <div className="menu-section">
                    <div className="menu-section-title">GENERAL</div> {/* Added title class */}
                    <ul>
                        <li>
                            <NavLink to="/Dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                                <FontAwesomeIcon icon={faTachometerAlt} className="menu-icon" />
                                Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/AdCalendar" className={({ isActive }) => isActive ? 'active' : ''}>
                                <FontAwesomeIcon icon={faCalendarAlt} className="menu-icon" />
                                Schedule Mgmt {/* Renamed for clarity */}
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/AdCheckReq" className={({ isActive }) => isActive ? 'active' : ''}>
                                <FontAwesomeIcon icon={faBox} className="menu-icon" />
                                Pickup Requests
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/EmailDisplay" className={({ isActive }) => isActive ? 'active' : ''}>
                                <FontAwesomeIcon icon={faEnvelope} className="menu-icon" /> {/* Changed Icon */}
                                Check Emails
                            </NavLink>
                        </li>
                         <li>
                            <NavLink to="/HandleBOwners" className={({ isActive }) => isActive ? 'active' : ''}>
                                <FontAwesomeIcon icon={faBuilding} className="menu-icon" /> {/* Changed Icon */}
                                Business Owners
                            </NavLink>
                        </li>
                        {/* Placeholder Routes - update 'to' prop when routes exist */}
                        <li>
                           <NavLink to="/admin/reviews" className={({ isActive }) => isActive ? 'active' : ''}>
                                <FontAwesomeIcon icon={faStar} className="menu-icon" />
                                Reviews
                                {/* <span className="badge">02</span> */}
                            </NavLink>
                        </li>
                         <li>
                            <NavLink to="/admin/payment" className={({ isActive }) => isActive ? 'active' : ''}>
                                <FontAwesomeIcon icon={faCreditCard} className="menu-icon" />
                                Payments
                            </NavLink>
                        </li>
                         <li>
                            <NavLink to="/admin/integration" className={({ isActive }) => isActive ? 'active' : ''}>
                                <FontAwesomeIcon icon={faLink} className="menu-icon" />
                                Integrations
                            </NavLink>
                        </li>
                    </ul>
                </div>

                <div className="menu-section">
                     <div className="menu-section-title">ACCOUNT</div> {/* Added title class */}
                    <ul>
                        {/* Placeholder Routes */}
                        <li>
                            <NavLink to="/admin/settings" className={({ isActive }) => isActive ? 'active' : ''}>
                                <FontAwesomeIcon icon={faCog} className="menu-icon" />
                                Settings
                            </NavLink>
                        </li>
                        <li>
                           <NavLink to="/admin/help" className={({ isActive }) => isActive ? 'active' : ''}>
                                <FontAwesomeIcon icon={faQuestionCircle} className="menu-icon" />
                                Help
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/manage-users" className={({ isActive }) => isActive ? 'active' : ''}>
                                <FontAwesomeIcon icon={faUsers} className="menu-icon" /> {/* Changed icon */}
                                Manage Users
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </nav>

            <div className="logout">
                {/* Use the performLogout function */}
                <a onClick={performLogout} href="#" style={{ cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="menu-icon" />
                    Logout
                </a>
            </div>
        </aside>
    );
}

// --- Use export default ---
export default AdNavComponent;
// END OF FILE AdNav.jsx