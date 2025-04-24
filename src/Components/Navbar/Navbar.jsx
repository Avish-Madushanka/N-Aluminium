// src/Components/Navbar/Navbar.jsx (Relevant parts updated)

import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'; // Import Link & useNavigate
import { User } from 'lucide-react';
import "./Navbar.css";
import logo from "../../assets/logo.png";

const Navbar = ({ isLoggedIn, userInfo, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // Use navigate for programmatic navigation

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const triggerLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      handleLogout();
      setIsOpen(false);
    }
  };

  const getInitials = (name) => {
    // ... (keep existing getInitials logic) ...
     if (!name) return '?';
    const words = name.trim().split(' ');
    if (words.length > 1 && words[0] && words[words.length - 1]) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    } else if (words.length === 1 && name.length > 0 && words[0]) {
      return name[0].toUpperCase();
    }
    return '?';
  };

  // Determine user type AND profile path
  const userRole = userInfo?.role; // Prioritize role if available
  const userType = userInfo?.userType;
  let profilePath = '/'; // Default

  if (userRole === 'admin') {
      profilePath = '/Admin'; // Or '/AdminDashboard'
  } else if (userType === 'bowner-login') {
      profilePath = '/BOwnerHome';
  } else if (userType === 'client') {
      profilePath = '/ClientProfile'; // Link to the new client profile page
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="N-Aluminium Logo" className="nav-logo" />
        </Link>

        {/* Desktop Links */}
        <div className="nav-links">
          {/* ... other NavLinks ... */}
           <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active-nav-item' : ''}`}>Home</NavLink>
           <NavLink to="/AboutUs" className={({ isActive }) => `nav-item ${isActive ? 'active-nav-item' : ''}`}>About Us</NavLink>
           <NavLink to="/Service" className={({ isActive }) => `nav-item ${isActive ? 'active-nav-item' : ''}`}>Services</NavLink>
           <NavLink to="/ContactUs" className={({ isActive }) => `nav-item ${isActive ? 'active-nav-item' : ''}`}>ContactUs</NavLink>
          
          {/* No need for separate dashboard links here if profile serves that purpose */}
        </div>

        {/* Desktop Auth/Profile Section */}
        <div className="auth-buttons">
          {isLoggedIn ? (
            <>
              {/* --- Profile Link --- */}
              <Link to={profilePath} className="profile-link" title={userInfo?.name || 'View Profile'}>
                <div className="profile-indicator">
                  <span className="profile-initials">
                    {getInitials(userInfo?.name)}
                  </span>
                </div>
              </Link>
              {/* Logout Button */}
              <button onClick={triggerLogout} className="logout-btn nav-button-style">Logout</button>
            </>
          ) : (
            <>
              <Link to="/Login" className="login-btn nav-button-style">Login</Link>
              <Link to="/SignUp" className="signup-btn nav-button-style">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* --- Mobile Menu --- */}
      {isOpen && (
        <div className="mobile-menu">
          {/* ... Repeat public NavLinks ... */}
           <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active-nav-item' : ''}`}>Home</NavLink>
           <NavLink to="/AboutUs" className={({ isActive }) => `nav-item ${isActive ? 'active-nav-item' : ''}`}>About Us</NavLink>
           <NavLink to="/Service" className={({ isActive }) => `nav-item ${isActive ? 'active-nav-item' : ''}`}>Services</NavLink>
           <NavLink to="/ContactUs" className={({ isActive }) => `nav-item ${isActive ? 'active-nav-item' : ''}`}>ContactUs</NavLink>
        
          {/* Link to profile page in mobile */}
          {isLoggedIn && (
            <NavLink to={profilePath} className={({ isActive }) => `nav-item ${isActive ? 'active-nav-item' : ''}`}>
              My Profile ({userInfo?.name?.split(' ')[0] || 'User'}) {/* Show first name */}
            </NavLink>
          )}


          {/* Auth Buttons Mobile */}
          <div className="auth-buttons-mobile">
            {isLoggedIn ? (
              <>
                {/* You can remove mobile-profile-info if the profile link is enough */}
                {/* <div className="mobile-profile-info">
                  Signed in as: {userInfo?.name || 'User'}
                </div> */}
                 <button onClick={triggerLogout} className="logout-btn nav-button-style">Logout</button>
              </>
            ) : (
              <>
                <Link to="/Login" className="login-btn nav-button-style">Login</Link>
                <Link to="/SignUp" className="signup-btn nav-button-style">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;