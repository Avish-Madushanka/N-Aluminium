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
  const headerRef = useRef(null);
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
      if (headerRef.current && !headerRef.current.contains(event.target)) {
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
    <header className={`Nav-header-main ${scrolled ? 'Nav-header-scrolled' : ''}`} ref={headerRef}>
      <div className="Nav-header-container">
        <Link className="Nav-brand-logo" to="/">
          <img src={logo} alt="Company Logo" className="Nav-brand-image" />
          <span className="Nav-brand-text">MetaTrade</span>
        </Link>

        <div className="Nav-menu-links">
          <NavLink to="/" className={({ isActive }) => `Nav-menu-item ${isActive ? 'Nav-active-menu-item' : ''}`}>
            Home
          </NavLink>
          
          <div className="Nav-has-dropdown">
            <NavLink to="/AboutUs" className={({ isActive }) => `Nav-menu-item ${isActive ? 'Nav-active-menu-item' : ''}`}>
              About Us
            </NavLink>
          </div>
          
          <NavLink to="/Service" className={({ isActive }) => `Nav-menu-item ${isActive ? 'Nav-active-menu-item' : ''}`}>
            Services
          </NavLink>
          
          <div className="Nav-has-dropdown">
            <NavLink to="/ContactUs" className={({ isActive }) => `Nav-menu-item ${isActive ? 'Nav-active-menu-item' : ''}`}>
              Contact Us
            </NavLink>
          </div>
          
          {isLoggedIn && userRole === 'admin' && (
            <NavLink to="/Admin" className={({ isActive }) => `Nav-menu-item ${isActive ? 'Nav-active-menu-item' : ''}`}>
              Admin Panel
            </NavLink>
          )}
        </div>

        <div className="Nav-auth-section">
          {isLoggedIn && userInfo ? (
            <div 
              className={`Nav-user-menu ${isProfileOpen ? 'active' : ''}`} 
              ref={profileRef}
              onClick={toggleProfile}
            >
              <span className="Nav-profile-name">{profileName}</span>
              <button className="Nav-profile-toggle">
                <span className="Nav-profile-initials">{getInitials(displayName)}</span>
                <ChevronDown size={16} className="Nav-profile-icon" />
              </button>
              
              <div className="Nav-profile-dropdown">
                <Link to={profilePath} className="Nav-profile-btn" onClick={() => setIsProfileOpen(false)}>
                  <User size={16} /> Profile
                </Link>
                <button onClick={triggerLogout} className="Nav-logout-btn">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="Nav-auth-buttons-container">
              <Link to="/Login" className="Nav-login-btn">Login</Link>
              <Link to="/ClientForm" className="Nav-signup-btn">Sign Up</Link>
            </div>
          )}

          <button 
            className="Nav-menu-toggle" 
            onClick={toggleMenu} 
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div className={`Nav-mobile-menu ${isOpen ? 'active' : ''}`}>
        <div className="Nav-mobile-menu-items">
          <NavLink 
            to="/" 
            className={({ isActive }) => `Nav-mobile-menu-item ${isActive ? 'Nav-active-mobile-menu-item' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            Home
          </NavLink>
          
          <div className="Nav-mobile-menu-item" onClick={() => setIsOpen(false)}>
            About Us
          </div>
          
          <NavLink 
            to="/Service" 
            className={({ isActive }) => `Nav-mobile-menu-item ${isActive ? 'Nav-active-mobile-menu-item' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            Services
          </NavLink>
          
          <div className="Nav-mobile-menu-item" onClick={() => setIsOpen(false)}>
            Contact Us
          </div>

          {isLoggedIn && userRole === 'admin' && (
            <NavLink 
              to="/Admin" 
              className={({ isActive }) => `Nav-mobile-menu-item ${isActive ? 'Nav-active-mobile-menu-item' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              Admin Panel
            </NavLink>
          )}
          
          {isLoggedIn && (
            <div className="Nav-auth-buttons-mobile">
              <Link 
                to={profilePath} 
                className="Nav-login-btn Nav-mobile-btn"
                onClick={() => setIsOpen(false)}
              >
                <User size={18} /> My Profile
              </Link>
              <button 
                onClick={triggerLogout} 
                className="Nav-logout-btn Nav-mobile-btn"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          )}
          
          {!isLoggedIn && (
            <div className="Nav-auth-buttons-mobile">
              <Link 
                to="/Login" 
                className="Nav-login-btn Nav-mobile-btn"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/SignUp" 
                className="Nav-signup-btn Nav-mobile-btn"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
