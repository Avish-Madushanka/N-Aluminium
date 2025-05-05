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

  // Track scroll position for navbar appearance change
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target) && isOpen) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const toggleMenu = () => {
    if (isOpen) {
      closeMenu();
    } else {
      setIsOpen(true);
      setMenuAnimation(true);
    }
  };

  const closeMenu = () => {
    setMenuAnimation(false);
    setTimeout(() => {
      setIsOpen(false);
    }, 300); // Matches CSS animation duration
  };

  const triggerLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      handleLogout(); // Call the logout handler passed from App.jsx
      closeMenu();    // Close menu if open
      // Navigation after logout is usually handled by App.jsx via handleLogout
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const words = name.trim().split(' ').filter(Boolean); // Filter out empty strings
    if (words.length > 1) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    } else if (words.length === 1 && words[0].length > 0) {
      return words[0][0].toUpperCase();
    }
    return '?';
  };

  // Determine profile path based on role/type
  const userRole = userInfo?.role;
  const userType = userInfo?.userType;
  let profilePath = '/'; // Default path

  if (userRole === 'admin') {
    profilePath = '/Admin'; // Path for Admin dashboard/profile
  } else if (userType === 'bowner') { // Check for 'bowner' based on backend response
    profilePath = '/BOwnerHome'; // Example path for Business Owner
  } else if (userType === 'client') {
    profilePath = '/ClientProfile'; // Example path for Client
  }
  // If userInfo is null/undefined or role/type doesn't match, profilePath remains '/'

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`} ref={navbarRef}>
      <div className="nav-container">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="N-Aluminium Logo" className="nav-logo" />
          <span className="logo-text1">ALUX</span>
        </Link>

        {/* Desktop Links */}
        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active-nav-item' : ''}`}>
            <span>Home</span>
            <span className="nav-indicator"></span>
          </NavLink>
          <NavLink to="/AboutUs" className={({ isActive }) => `nav-item ${isActive ? 'active-nav-item' : ''}`}>
            <span>About Us</span>
            <span className="nav-indicator"></span>
          </NavLink>
          <NavLink to="/Service" className={({ isActive }) => `nav-item ${isActive ? 'active-nav-item' : ''}`}>
            <span>Services</span>
            <span className="nav-indicator"></span>
          </NavLink>
          <NavLink to="/ContactUs" className={({ isActive }) => `nav-item ${isActive ? 'active-nav-item' : ''}`}>
            <span>Contact Us</span>
            <span className="nav-indicator"></span>
          </NavLink>
        </div>

        {/* Desktop Auth/Profile Section */}
        <div className="auth-buttons">
          {isLoggedIn && userInfo ? ( // Ensure userInfo exists before accessing its properties
            <div className="user-menu">
              <Link to={profilePath} className="profile-link" title={userInfo.name || 'View Profile'}>
                <div className="profile-indicator">
                  <span className="profile-initials">{getInitials(userInfo.name)}</span>
                </div>
                <span className="profile-name">{userInfo.name?.split(' ')[0] || 'User'}</span>
                <ChevronDown size={16} className="profile-icon" />
              </Link>
              <div className="profile-dropdown">
                <Link to={profilePath} className="dropdown-item">
                  My Profile
                </Link>
                <button onClick={triggerLogout} className="dropdown-item logout-item">
                  <LogOut size={16} />
                  <span>Logout</span>
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

        {/* Mobile Menu Toggle */}
        <button
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={`mobile-menu ${menuAnimation ? 'menu-active' : 'menu-inactive'}`}>
          <div className="mobile-menu-items">
            <NavLink to="/" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active-mobile-nav-item' : ''}`}>Home</NavLink>
            <NavLink to="/AboutUs" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active-mobile-nav-item' : ''}`}>About Us</NavLink>
            <NavLink to="/Service" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active-mobile-nav-item' : ''}`}>Services</NavLink>
            <NavLink to="/ContactUs" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active-mobile-nav-item' : ''}`}>Contact Us</NavLink>

            {isLoggedIn && userInfo && (
              <NavLink to={profilePath} className={({ isActive }) => `mobile-nav-item ${isActive ? 'active-mobile-nav-item' : ''}`}>
                <div className="mobile-profile-item">
                  <div className="mobile-profile-indicator">
                    <span className="profile-initials">{getInitials(userInfo.name)}</span>
                  </div>
                  <span>My Profile</span>
                </div>
              </NavLink>
            )}

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