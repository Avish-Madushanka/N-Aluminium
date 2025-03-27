import React from 'react';
import './AdNav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCog, faQuestionCircle, faUserCog, faSignOutAlt, faTachometerAlt, faBox, faUsers, faStar, faCreditCard, faLink } from '@fortawesome/free-solid-svg-icons';
import { faProductHunt } from '@fortawesome/free-brands-svg-icons';

function AdNav() {
    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <div className="logo">
                    <span className="logo-icon">subcom</span>
                    <FontAwesomeIcon icon={faBars} className="menu-toggle" />
                </div>

                <nav className="menu">
                    <div className="menu-section">
                        GENREAL
                        <ul>
                            <li>
                                <a href="#" className="active">
                                    <FontAwesomeIcon icon={faTachometerAlt} className="menu-icon" />
                                    Dashboard
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <FontAwesomeIcon icon={faBox} className="menu-icon" />
                                    Product
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <FontAwesomeIcon icon={faProductHunt} className="menu-icon" />
                                    Inventory
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <FontAwesomeIcon icon={faUsers} className="menu-icon" />
                                    Customers
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <FontAwesomeIcon icon={faStar} className="menu-icon" />
                                    Review
                                    <span className="badge">02</span>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <FontAwesomeIcon icon={faCreditCard} className="menu-icon" />
                                    Payment
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <FontAwesomeIcon icon={faLink} className="menu-icon" />
                                    Integration
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="menu-section">
                        ACCOUNT
                        <ul>
                            <li>
                                <a href="#">
                                    <FontAwesomeIcon icon={faCog} className="menu-icon" />
                                    Settings
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <FontAwesomeIcon icon={faQuestionCircle} className="menu-icon" />
                                    Help
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <FontAwesomeIcon icon={faUserCog} className="menu-icon" />
                                    Manage Users
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>

                <div className="logout">
                    <a href="#">
                        <FontAwesomeIcon icon={faSignOutAlt} className="menu-icon" />
                        Logout
                    </a>
                </div>
            </aside>

            {/* Main Content Area (Placeholder) */}
            <main className="main-content">
                <h2>Dashboard</h2>
                {/* Placeholder for the rest of the content */}
            </main>
        </div>
    );
}

export default AdNav;