import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from 'react-router-dom';
import { User, Menu, X, LogOut, ChevronDown } from 'lucide-react';
import "./Navbar.css";
import logo from "../../assets/logo.png";

const Navbar = ({ isLoggedIn, userInfo, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navbarRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setIsProfileOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsProfileOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleProfile = (e) => {
    e.stopPropagation();
    setIsProfileOpen(!isProfileOpen);
  };

  const triggerLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      handleLogout();
    }
  };

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return '?';
    const words = name.trim().split(' ').filter(Boolean);
    if (words.length === 0) return '?';
    if (words.length > 1) return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    return words[0][0].toUpperCase();
  };

  let profilePath = '/';
  let profileName = 'User';
  const userRole = userInfo?.role;
  const displayName = userInfo?.name || userInfo?.ownerName;

  if (isLoggedIn && userInfo) {
    profileName = displayName?.split(' ')[0] || 'Profile';

    if (userRole === 'admin') {
      profilePath = '/Admin';
    } else if (userRole === 'client') {
      profilePath = '/ClientProfile';
    }
  }

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`} ref={navbarRef}>
      <div className="nav-container">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="Company Logo" className="nav-logo" />
          <span className="logo-text1">MetaTrade</span>
        </Link>

        <div className="nav-links">
          <NavLink to="/MainHomePage" className={({ isActive }) => `nav-item ${isActive ? 'active-nav-item' : ''}`}>
            Home
          </NavLink>
          
          <div className="has-dropdown">
            <NavLink to="/AboutUs" className={({ isActive }) => `nav-item ${isActive ? 'active-nav-item' : ''}`}>
              About Us
            </NavLink>
            <div className="dropdown-menu">
              <Link to="/AboutUs/Company" className="dropdown-item">Our Company</Link>
              <Link to="/AboutUs/Team" className="dropdown-item">Our Team</Link>
              <Link to="/AboutUs/History" className="dropdown-item">Our History</Link>
            </div>
          </div>
          
          <NavLink to="/Service" className={({ isActive }) => `nav-item ${isActive ? 'active-nav-item' : ''}`}>
            Services
          </NavLink>
          
          <div className="has-dropdown">
            <NavLink to="/ContactUs" className={({ isActive }) => `nav-item ${isActive ? 'active-nav-item' : ''}`}>
              Contact
            </NavLink>
            <div className="dropdown-menu">
              <Link to="/ContactUs/Form" className="dropdown-item">Contact Form</Link>
              <Link to="/ContactUs/Locations" className="dropdown-item">Our Locations</Link>
              <Link to="/ContactUs/Support" className="dropdown-item">Support</Link>
            </div>
          </div>
          
          {isLoggedIn && userRole === 'admin' && (
            <NavLink to="/Admin" className={({ isActive }) => `nav-item ${isActive ? 'active-nav-item' : ''}`}>
              Admin Panel
            </NavLink>
          )}
        </div>

        <div className="auth-section">
          {isLoggedIn && userInfo ? (
            <div 
              className={`user-menu ${isProfileOpen ? 'active' : ''}`} 
              ref={profileRef}
              onClick={toggleProfile}
            >
              <span className="profile-name">{profileName}</span>
              <button className="profile-toggle">
                <span className="profile-initials">{getInitials(displayName)}</span>
                <ChevronDown size={16} className="profile-icon" />
              </button>
              
              <div className="profile-dropdown">
                <Link to={profilePath} className="profile-btn" onClick={() => setIsProfileOpen(false)}>
                  <User size={16} /> Profile
                </Link>
                <button onClick={triggerLogout} className="logout-btn">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-buttons-container">
              <Link to="/Login" className="login-btn">Login</Link>
              <Link to="/SignUp" className="signup-btn">Sign Up</Link>
            </div>
          )}

          <button 
            className="menu-toggle" 
            onClick={toggleMenu} 
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${isOpen ? 'active' : ''}`}>
        <div className="mobile-menu-items">
          <NavLink 
            to="/" 
            className={({ isActive }) => `mobile-nav-item ${isActive ? 'active-mobile-nav-item' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            Home
          </NavLink>
          
          <div className="mobile-nav-item" onClick={() => setIsOpen(false)}>
            About Us
            <div className="mobile-dropdown-items">
              <NavLink to="/AboutUs/Company" className="mobile-dropdown-item">Our Company</NavLink>
              <NavLink to="/AboutUs/Team" className="mobile-dropdown-item">Our Team</NavLink>
              <NavLink to="/AboutUs/History" className="mobile-dropdown-item">Our History</NavLink>
            </div>
          </div>
          
          <NavLink 
            to="/Service" 
            className={({ isActive }) => `mobile-nav-item ${isActive ? 'active-mobile-nav-item' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            Services
          </NavLink>
          
          <div className="mobile-nav-item" onClick={() => setIsOpen(false)}>
            Contact
            <div className="mobile-dropdown-items">
              <NavLink to="/ContactUs/Form" className="mobile-dropdown-item">Contact Form</NavLink>
              <NavLink to="/ContactUs/Locations" className="mobile-dropdown-item">Our Locations</NavLink>
              <NavLink to="/ContactUs/Support" className="mobile-dropdown-item">Support</NavLink>
            </div>
          </div>

          {isLoggedIn && userRole === 'admin' && (
            <NavLink 
              to="/Admin" 
              className={({ isActive }) => `mobile-nav-item ${isActive ? 'active-mobile-nav-item' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              Admin Panel
            </NavLink>
          )}
          
          {isLoggedIn && (
            <div className="auth-buttons-mobile">
              <Link 
                to={profilePath} 
                className="login-btn mobile-btn"
                onClick={() => setIsOpen(false)}
              >
                <User size={18} /> My Profile
              </Link>
              <button 
                onClick={triggerLogout} 
                className="logout-btn mobile-btn"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          )}
          
          {!isLoggedIn && (
            <div className="auth-buttons-mobile">
              <Link 
                to="/Login" 
                className="login-btn mobile-btn"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/SignUp" 
                className="signup-btn mobile-btn"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;