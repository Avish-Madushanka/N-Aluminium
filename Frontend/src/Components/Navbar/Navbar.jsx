// src/Components/Navbar/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { User, Menu, X, LogOut, ChevronDown } from 'lucide-react';
import "./Navbar.css";
import logo from "../../assets/logo.png"; // Adjust path as needed

// Assuming apiConfig.js is correctly set up and userInfo structure is consistent
// const Navbar = ({ isLoggedIn, userInfo = null, handleLogout }) => { // Default userInfo to null
const Navbar = ({ isLoggedIn, userInfo, handleLogout }) => { // Use props directly

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuAnimation, setMenuAnimation] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // Keep for potential future use
  const navbarRef = useRef(null);

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on navigation
  useEffect(() => {
    closeMenu();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target) && isOpen) {
        closeMenu();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]); // Re-run when isOpen changes

  const toggleMenu = () => {
    if (isOpen) closeMenu();
    else {
      setIsOpen(true);
      setMenuAnimation(true);
    }
  };

  const closeMenu = () => {
    if (!isOpen) return;
    setMenuAnimation(false);
    const timer = setTimeout(() => setIsOpen(false), 300); // Match CSS animation duration
    return () => clearTimeout(timer);
  };

  const triggerLogout = () => {
    closeMenu();
    if (window.confirm("Are you sure you want to log out?")) {
      handleLogout(); // Parent component handles actual logout logic & redirect
    }
  };

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return '?';
    const words = name.trim().split(' ').filter(Boolean);
    if (words.length === 0) return '?';
    if (words.length > 1) return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    return words[0][0].toUpperCase();
  };

  // --- Determine Profile Info ---
  let profilePath = '/';
  let profileName = 'User';
  let displayRole = ''; // For potential display if needed
  const userRole = userInfo?.role;
  // Use name field primarily for display name, fallback needed if structure varies
  const displayName = userInfo?.name || userInfo?.ownerName; // Assuming 'name' for clients/admins, 'ownerName' for bowners

  if (isLoggedIn && userInfo) {
    profileName = displayName?.split(' ')[0] || 'Profile'; // Use first name or fallback

    // --- PATH LOGIC ---
    if (userRole === 'admin') {
      profilePath = '/Admin'; // Or your specific admin dashboard route
      displayRole = 'Admin';
    }
    // Add check for Business Owner if applicable - adjust 'bowner' role/type as needed
    // else if (userRole === 'bowner' || userInfo.userType === 'bowner') {
    //   profilePath = '/BOwnerHome'; // Or your specific bowner route
    //   displayRole = 'Business Owner';
    // }
    else if (userRole === 'client') { // Check for client role
      profilePath = '/ClientProfile'; // <<< Path to ClientProfile Component
      displayRole = 'Client';
    }
    else {
      console.warn("Navbar: Unknown user role for profile path:", userInfo);
      profilePath = '/'; // Fallback to home for unknown roles
    }
    // --- END PATH LOGIC ---

  }

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`} ref={navbarRef}>
      <div className="nav-container">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="N-Aluminium Logo" className="nav-logo" />
          <span className="logo-text1">ALUX</span>
        </Link>

        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active-nav-item' : ''}`}><span>Home</span><span className="nav-indicator"></span></NavLink>
          <NavLink to="/AboutUs" className={({ isActive }) => `nav-item ${isActive ? 'active-nav-item' : ''}`}><span>About Us</span><span className="nav-indicator"></span></NavLink>
          <NavLink to="/Service" className={({ isActive }) => `nav-item ${isActive ? 'active-nav-item' : ''}`}><span>Services</span><span className="nav-indicator"></span></NavLink>
          <NavLink to="/ContactUs" className={({ isActive }) => `nav-item ${isActive ? 'active-nav-item' : ''}`}><span>Contact Us</span><span className="nav-indicator"></span></NavLink>
          {/* Conditional Admin link */}
          {isLoggedIn && userRole === 'admin' && (
              <NavLink to="/Admin" className={({ isActive }) => `nav-item ${isActive ? 'active-nav-item' : ''}`}><span>Admin Panel</span><span className="nav-indicator"></span></NavLink>
          )}
          {/* Add conditional Business Owner link if needed */}
           {/* {isLoggedIn && userRole === 'bowner' && (
               <NavLink to="/BOwnerHome" className={({ isActive }) => `nav-item ${isActive ? 'active-nav-item' : ''}`}><span>Business Panel</span><span className="nav-indicator"></span></NavLink>
           )} */}
        </div>

        <div className="auth-section">
          {isLoggedIn && userInfo ? (
            <div className="user-menu">
              {/* Use the determined profilePath */}
              <Link to={profilePath} className="profile-link" title={`View ${profileName}'s Profile (${displayRole})`}>
                <div className="profile-indicator">
                   {/* Use the determined displayName */}
                  <span className="profile-initials">{getInitials(displayName)}</span>
                </div>
                <span className="profile-name">{profileName}</span>
                <ChevronDown size={16} className="profile-icon" />
              </Link>
              <div className="profile-dropdown">
                 {/* Use the determined profilePath */}
                <Link to={profilePath} className="dropdown-item" onClick={closeMenu}>
                   <User size={16} /> My Profile
                </Link>
                {/* Example conditional dropdown item */}
                {userRole === 'admin' && <Link to="/Admin/Settings" className="dropdown-item" onClick={closeMenu}><Settings size={16} /> Settings</Link>}
                <button onClick={triggerLogout} className="dropdown-item logout-item">
                  <LogOut size={16} /><span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-buttons-container">
              <Link to="/Login" className="login-btn nav-button-style">Login</Link>
              <Link to="/SignUp" className="signup-btn nav-button-style">Sign Up</Link>
            </div>
          )}
        </div>

        <button className="menu-toggle" onClick={toggleMenu} aria-label={isOpen ? "Close menu" : "Open menu"} aria-expanded={isOpen}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={`mobile-menu ${menuAnimation ? 'menu-open' : 'menu-close'}`}>
          <div className="mobile-menu-items">
            <NavLink to="/" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active-mobile-nav-item' : ''}`}>Home</NavLink>
            <NavLink to="/AboutUs" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active-mobile-nav-item' : ''}`}>About Us</NavLink>
            <NavLink to="/Service" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active-mobile-nav-item' : ''}`}>Services</NavLink>
            <NavLink to="/ContactUs" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active-mobile-nav-item' : ''}`}>Contact Us</NavLink>

            {/* Conditional Mobile Links */}
             {isLoggedIn && userRole === 'admin' && (
                <NavLink to="/Admin" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active-mobile-nav-item' : ''}`}>Admin Panel</NavLink>
            )}
            {/* Add Bowner Link if needed */}
            {/* Use profilePath which is dynamically set */}
            {isLoggedIn && userInfo && userRole !== 'admin' && ( // Show profile link for non-admins
                <NavLink to={profilePath} className={({ isActive }) => `mobile-nav-item ${isActive ? 'active-mobile-nav-item' : ''}`}>My Profile</NavLink>
            )}

            <div className="auth-buttons-mobile">
              {isLoggedIn ? (
                <button onClick={triggerLogout} className="logout-btn mobile-btn">
                  <LogOut size={18} /><span>Logout</span>
                </button>
              ) : (
                <>
                  <Link to="/Login" className="login-btn mobile-btn">Login</Link>
                  <Link to="/SignUp" className="signup-btn mobile-btn">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;