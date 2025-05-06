// src/Components/Navbar/Navbar.jsx (or wherever your Navbar component is)
import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { User, Menu, X, LogOut, ChevronDown } from 'lucide-react';
import "./Navbar.css"; // Ensure CSS path is correct
import logo from "../../assets/logo.png"; // Ensure logo path is correct

const Navbar = ({ isLoggedIn, userInfo, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuAnimation, setMenuAnimation] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const navbarRef = useRef(null);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on navigation changes
  useEffect(() => {
    closeMenu(); // Use the closeMenu function which includes animation handling
  }, [location]); // Dependency is the location object

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target) && isOpen) {
        closeMenu();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    // Cleanup function
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]); // Re-run when isOpen changes

  // Toggle mobile menu state
  const toggleMenu = () => {
    if (isOpen) {
      closeMenu();
    } else {
      setIsOpen(true);
      setMenuAnimation(true); // Start open animation
    }
  };

  // Close mobile menu with animation handling
  const closeMenu = () => {
    if (!isOpen) return; // Don't do anything if already closed
    setMenuAnimation(false); // Start close animation
    // Wait for animation to finish before setting isOpen to false
    const timer = setTimeout(() => {
      setIsOpen(false);
    }, 300); // Should match CSS transition duration
    return () => clearTimeout(timer); // Cleanup timer if component unmounts
  };

  // Handle logout action
  const triggerLogout = () => {
    closeMenu(); // Close menu first
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      handleLogout(); // Call the logout handler passed from App.jsx
      // Navigation is typically handled by the parent component after logout state update
    }
  };

  // Helper to get initials from name
  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return '?';
    const words = name.trim().split(' ').filter(Boolean);
    if (words.length === 0) return '?';
    if (words.length > 1) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return words[0][0].toUpperCase();
  };

  // --- Determine Profile Path Based on User Info ---
  const userRole = userInfo?.role;
  const userType = userInfo?.userType;
  let profilePath = '/'; // Default to home if not logged in or role unknown
  let profileName = 'User';

  if (isLoggedIn && userInfo) {
    profileName = userInfo.name?.split(' ')[0] || // Use first name if available
                  userInfo.ownerName?.split(' ')[0] || // Fallback to ownerName
                  'Profile'; // Generic fallback
    // Determine path based on role/type from backend userInfo
    if (userRole === 'admin') {
      profilePath = '/Admin'; // Admin dashboard
    } else if (userType === 'bowner') {
      profilePath = '/BOwnerHome'; // Business Owner dashboard/home
    } else if (userType === 'client') {
      profilePath = '/ClientProfile'; // ** THIS IS THE PATH TO THE CLIENT PROFILE PAGE **
    } else {
       // Fallback if logged in but role/type is unexpected
       console.warn("Navbar: Unknown user role/type for profile path:", userInfo);
       profilePath = '/'; // Send to home
    }
  }
  // --- End Profile Path Logic ---


  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`} ref={navbarRef}>
      <div className="nav-container">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="N-Aluminium Logo" className="nav-logo" />
          <span className="logo-text1">ALUX</span>
        </Link>

        {/* Desktop Links */}
        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active-nav-item' : ''}`}><span>Home</span><span className="nav-indicator"></span></NavLink>
          <NavLink to="/AboutUs" className={({ isActive }) => `nav-item ${isActive ? 'active-nav-item' : ''}`}><span>About Us</span><span className="nav-indicator"></span></NavLink>
          <NavLink to="/Service" className={({ isActive }) => `nav-item ${isActive ? 'active-nav-item' : ''}`}><span>Services</span><span className="nav-indicator"></span></NavLink>
          <NavLink to="/ContactUs" className={({ isActive }) => `nav-item ${isActive ? 'active-nav-item' : ''}`}><span>Contact Us</span><span className="nav-indicator"></span></NavLink>
          {/* Conditionally render Admin link */}
          {isLoggedIn && userRole === 'admin' && (
              <NavLink to="/Admin" className={({ isActive }) => `nav-item ${isActive ? 'active-nav-item' : ''}`}><span>Admin Panel</span><span className="nav-indicator"></span></NavLink>
          )}
           {/* Conditionally render Buisness Owner link */}
          {isLoggedIn && userType === 'bowner' && userRole !== 'admin' && (
              <NavLink to="/BOwnerHome" className={({ isActive }) => `nav-item ${isActive ? 'active-nav-item' : ''}`}><span>Business Panel</span><span className="nav-indicator"></span></NavLink>
          )}
        </div>

        {/* Desktop Auth/Profile Section */}
        <div className="auth-section"> {/* Changed class for clarity */}
          {isLoggedIn && userInfo ? (
            // --- Logged In State ---
            <div className="user-menu">
              <Link to={profilePath} className="profile-link" title={`View ${profileName}'s Profile`}>
                <div className="profile-indicator">
                  {/* Use appropriate name field based on userType */}
                  <span className="profile-initials">{getInitials(userInfo.name || userInfo.ownerName)}</span>
                </div>
                <span className="profile-name">{profileName}</span> {/* Use determined profileName */}
                <ChevronDown size={16} className="profile-icon" />
              </Link>
              {/* Dropdown Menu */}
              <div className="profile-dropdown">
                <Link to={profilePath} className="dropdown-item" onClick={closeMenu}>
                   <User size={16} /> My Profile
                </Link>
                {/* Add other relevant links like settings, orders etc. if applicable */}
                <button onClick={triggerLogout} className="dropdown-item logout-item">
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            // --- Logged Out State ---
            <div className="auth-buttons-container">
              <Link to="/Login" className="login-btn nav-button-style">Login</Link>
              <Link to="/SignUp" className="signup-btn nav-button-style">Sign Up</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className={`mobile-menu ${menuAnimation ? 'menu-open' : 'menu-close'}`}>
          {/* Added class for better animation control */}
          <div className="mobile-menu-items">
            <NavLink to="/" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active-mobile-nav-item' : ''}`}>Home</NavLink>
            <NavLink to="/AboutUs" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active-mobile-nav-item' : ''}`}>About Us</NavLink>
            <NavLink to="/Service" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active-mobile-nav-item' : ''}`}>Services</NavLink>
            <NavLink to="/ContactUs" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active-mobile-nav-item' : ''}`}>Contact Us</NavLink>

            {/* Conditional Mobile Links */}
             {isLoggedIn && userRole === 'admin' && (
                <NavLink to="/Admin" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active-mobile-nav-item' : ''}`}>Admin Panel</NavLink>
            )}
             {isLoggedIn && userType === 'bowner' && userRole !== 'admin' && (
                 <NavLink to="/BOwnerHome" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active-mobile-nav-item' : ''}`}>Business Panel</NavLink>
            )}

            {/* Mobile Profile Link */}
            {isLoggedIn && userInfo && (
              <NavLink to={profilePath} className={({ isActive }) => `mobile-nav-item ${isActive ? 'active-mobile-nav-item' : ''}`}>
                <div className="mobile-profile-item">
                  <div className="mobile-profile-indicator">
                     <span className="profile-initials">{getInitials(userInfo.name || userInfo.ownerName)}</span>
                  </div>
                  <span>My Profile</span>
                </div>
              </NavLink>
            )}

            {/* Mobile Auth Buttons */}
            <div className="auth-buttons-mobile">
              {isLoggedIn ? (
                <button onClick={triggerLogout} className="logout-btn mobile-btn">
                  <LogOut size={18} />
                  <span>Logout</span>
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