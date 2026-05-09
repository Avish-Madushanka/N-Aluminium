import React from 'react';
import './AdNav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCalendarAlt, 
    faCalculator, 
    faStore, 
    faClipboardList, 
    faGraduationCap, 
    faVideo, 
    faBox, 
    faProjectDiagram, 
    faExchangeAlt, 
    faClock,
    faTruck,
    faChalkboardUser,
    faFileVideo,
    faPlusCircle,
    faShoppingCart,
    faCubes,
    faWineGlassAlt,
    faMoneyBillWave,
    faFileAlt,
    faGlobe,
    faStar,
    faStarHalfAlt,
    faCommentDots,
    faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import { NavLink, useNavigate } from 'react-router-dom';

function AdNavComponent({ handleLogout }) {
    const navigate = useNavigate();

    const performLogout = (e) => {
        e.preventDefault();
        if (handleLogout) {
            handleLogout();
        } else {
            navigate('/login');
        }
    };

    return (
        <aside className="admin-sidebar">
            <div className="admin-logo">
                <span className="admin-logo-text">Admin Panel</span>
            </div>

            <nav className="admin-menu">
                <div className="nav-category">
                    <div className="nav-category-title">GENERAL</div>
                    <ul>
                        <li className="nav-group">
                            <div className="nav-group-title">
                                <FontAwesomeIcon icon={faClock} className="admin-menu-icon" />
                                Pickup & Schedule Services
                            </div>
                            <ul className="nav-submenu">
                                <li>
                                    <NavLink to="/Admin/Calendar" className={({ isActive }) => isActive ? 'active' : ''}>
                                        <FontAwesomeIcon icon={faCalendarAlt} className="admin-menu-icon submenu-icon" /> Schedule Mgmt
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/Admin/Requests" className={({ isActive }) => isActive ? 'active' : ''}>
                                        <FontAwesomeIcon icon={faTruck} className="admin-menu-icon submenu-icon" /> Pickup Requests
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/Admin/Scrap" className={({ isActive }) => isActive ? 'active' : ''}>
                                        <FontAwesomeIcon icon={faCalculator} className="admin-menu-icon submenu-icon" /> Scrap Calculator
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/Admin/AdminLocationManager" className={({ isActive }) => isActive ? 'active' : ''}>
                                        <FontAwesomeIcon icon={faStore} className="admin-menu-icon submenu-icon" /> Add Shop Location
                                    </NavLink>
                                </li>
                            </ul>
                        </li>

                        <li className="nav-group">
                            <div className="nav-group-title">
                                <FontAwesomeIcon icon={faGraduationCap} className="admin-menu-icon" />
                                Aluminum Training Programme
                            </div>
                            <ul className="nav-submenu">
                                <li>
                                    <NavLink to="/Admin/AdminAlumni" className={({ isActive }) => isActive ? 'active' : ''}>
                                        <FontAwesomeIcon icon={faChalkboardUser} className="admin-menu-icon submenu-icon" /> Check Trainers Req
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/Admin/VideoManage" className={({ isActive }) => isActive ? 'active' : ''}>
                                        <FontAwesomeIcon icon={faFileVideo} className="admin-menu-icon submenu-icon" /> Training Video Manage
                                    </NavLink>
                                </li>
                            </ul>
                        </li>

                        <li className="nav-group">
                            <div className="nav-group-title">
                                <FontAwesomeIcon icon={faBox} className="admin-menu-icon" />
                                Items MarketPlace
                            </div>
                            <ul className="nav-submenu">
                                <li>
                                    <NavLink to="/Admin/ItemsAddForm" className={({ isActive }) => isActive ? 'active' : ''}>
                                        <FontAwesomeIcon icon={faPlusCircle} className="admin-menu-icon submenu-icon" /> Add Items for Marketplace
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/Admin/AccItemReq" className={({ isActive }) => isActive ? 'active' : ''}>
                                        <FontAwesomeIcon icon={faShoppingCart} className="admin-menu-icon submenu-icon" /> Check Items Orders
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/Admin/ItemsManage" className={({ isActive }) => isActive ? 'active' : ''}>
                                        <FontAwesomeIcon icon={faCubes} className="admin-menu-icon submenu-icon" /> Manage All Items
                                    </NavLink>
                                </li>
                            </ul>
                        </li>

                        <li className="nav-group">
                            <div className="nav-group-title">
                                <FontAwesomeIcon icon={faWineGlassAlt} className="admin-menu-icon" />
                                Glass Order System
                            </div>
                            <ul className="nav-submenu">
                                <li>
                                    <NavLink to="/Admin/AdGlassManage" className={({ isActive }) => isActive ? 'active' : ''}>
                                        <FontAwesomeIcon icon={faMoneyBillWave} className="admin-menu-icon submenu-icon" /> Glass Price Manage
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/Admin/AdminOrderManage" className={({ isActive }) => isActive ? 'active' : ''}>
                                        <FontAwesomeIcon icon={faClipboardList} className="admin-menu-icon submenu-icon" /> Check Glass Orders
                                    </NavLink>
                                </li>
                            </ul>
                        </li>

                        <li className="nav-group">
                            <div className="nav-group-title">
                                <FontAwesomeIcon icon={faWineGlassAlt} className="admin-menu-icon" />
                                Project Upload 
                            </div>
                            <ul className="nav-submenu">
                                <li>
                                    <NavLink to="/Admin/ProManage" className={({ isActive }) => isActive ? 'active' : ''}>
                                        <FontAwesomeIcon icon={faProjectDiagram} className="admin-menu-icon submenu-icon" /> Manage Upload Projects
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/ProAddForm" className={({ isActive }) => isActive ? 'active' : ''}>
                                        <FontAwesomeIcon icon={faClipboardList} className="admin-menu-icon submenu-icon" /> Add Projects
                                    </NavLink>
                                </li>
                            </ul>
                        </li>

                        <li>
                            <NavLink to="/Admin/BuyandSellManage" className={({ isActive }) => isActive ? 'active' : ''}>
                                <FontAwesomeIcon icon={faExchangeAlt} className="admin-menu-icon" /> Manage Buy & Sell
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/Admin/AdQuotation" className={({ isActive }) => isActive ? 'active' : ''}>
                                <FontAwesomeIcon icon={faFileAlt} className="admin-menu-icon" /> Check Project Quotations
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/Admin/Ad3Ditems" className={({ isActive }) => isActive ? 'active' : ''}>
                                <FontAwesomeIcon icon={faGlobe} className="admin-menu-icon" /> 360 Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/Admin/DisReview" className={({ isActive }) => isActive ? 'active' : ''}>
                                <FontAwesomeIcon icon={faEnvelope} className="admin-menu-icon" /> Manage All Reviews
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </nav>
        </aside>
    );
}

export default AdNavComponent;