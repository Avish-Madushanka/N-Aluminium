// src/Components/Admin/AdNav/AdNav.jsx
import React from 'react';
import './AdNav.css'; // Make sure this CSS file exists and is correct
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCog, faQuestionCircle, faUserCog, faSignOutAlt, faTachometerAlt, faBox, faUsers, faStar, faCreditCard, faLink } from '@fortawesome/free-solid-svg-icons';
import { faProductHunt } from '@fortawesome/free-brands-svg-icons';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Import Link and useNavigate

// Accept handleLogout as a prop
function AdNav({ handleLogout }) {
    const location = useLocation(); // Use hook to get current path
    const navigate = useNavigate(); // Use hook for navigation

    // Function to handle internal navigation using React Router
    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        // Removed dashboard-container and main-content from here,
        // as the layout component will handle that structure.
        // This component is now just the sidebar.
        <aside className="sidebar">
            <div className="logo">
                {/* Choose one logo representation */}
                <span className="logo-text">Admin Panel</span> {/* Example text logo */}
                {/* Or keep your icon if preferred: */}
                {/* <span className="logo-icon">subcom</span> */}
                {/* <FontAwesomeIcon icon={faBars} className="menu-toggle" /> */} {/* Toggle might need state */}
            </div>

            <nav className="menu">
                <div className="menu-section">
                    GENERAL
                    <ul>
                        {/* Use Link component for navigation */}
                        <li>
                            {/* Assuming '/Admin' is the dashboard route */}
                            <Link to="/Dashboard" className={location.pathname === '/Dashboard' ? 'active' : ''}>
                                <FontAwesomeIcon icon={faTachometerAlt} className="menu-icon" />
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link to="/AdCalendar" className={location.pathname === '/AdCalendar' ? 'active' : ''}>
                                <FontAwesomeIcon icon={faBox} className="menu-icon" />
                                Pick Up Calendar
                            </Link>
                        </li>
                        <li>
                            <Link to="/AdCheckReq" className={location.pathname === '/AdCheckReq' ? 'active' : ''}>
                                <FontAwesomeIcon icon={faBox} className="menu-icon" />
                                Check Pick Up Request
                            </Link>
                        </li>
                        {/* Add Links for other routes similarly */}
                         <li>
                            <Link to="/EmailDisplay" className={location.pathname === '/EmailDisplay' ? 'active' : ''}>
                                <FontAwesomeIcon icon={faProductHunt} className="menu-icon" />
                                Check Emails {/* Placeholder Route */}
                            </Link>
                        </li>
                        
                        <li>
                            <Link to="/HandleBOwners" className={location.pathname === '/HandleBOwners' ? 'active' : ''}>
                                <FontAwesomeIcon icon={faUsers} className="menu-icon" />
                                Handle Business Owners {/* Placeholder Route */}
                            </Link>
                        </li>
                        <li>
                           <Link to="/admin/reviews" className={location.pathname === '/admin/reviews' ? 'active' : ''}>
                                <FontAwesomeIcon icon={faStar} className="menu-icon" />
                                Review
                                <span className="badge">02</span> {/* Placeholder Route */}
                            </Link>
                        </li>
                         <li>
                            <Link to="/admin/payment" className={location.pathname === '/admin/payment' ? 'active' : ''}>
                                <FontAwesomeIcon icon={faCreditCard} className="menu-icon" />
                                Payment {/* Placeholder Route */}
                            </Link>
                        </li>
                         <li>
                            <Link to="/admin/integration" className={location.pathname === '/admin/integration' ? 'active' : ''}>
                                <FontAwesomeIcon icon={faLink} className="menu-icon" />
                                Integration {/* Placeholder Route */}
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="menu-section">
                    ACCOUNT
                    <ul>
                        <li>
                            <Link to="/admin/settings" className={location.pathname === '/admin/settings' ? 'active' : ''}>
                                <FontAwesomeIcon icon={faCog} className="menu-icon" />
                                Settings {/* Placeholder Route */}
                            </Link>
                        </li>
                        <li>
                           <Link to="/admin/help" className={location.pathname === '/admin/help' ? 'active' : ''}>
                                <FontAwesomeIcon icon={faQuestionCircle} className="menu-icon" />
                                Help {/* Placeholder Route */}
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/manage-users" className={location.pathname === '/admin/manage-users' ? 'active' : ''}>
                                <FontAwesomeIcon icon={faUserCog} className="menu-icon" />
                                Manage Users {/* Placeholder Route */}
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>

            <div className="logout">
                {/* Use the handleLogout function passed via props */}
                <a onClick={handleLogout} style={{ cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="menu-icon" />
                    Logout
                </a>
            </div>
        </aside>
    );
}

export default AdNav;