import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, ShoppingCart } from 'lucide-react';
import "./Navbar.css";
import logo from "../../assets/logo.png";

const Navbar = ({ isLoggedIn, userInfo, handleLogout, cartItemCount = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && 
          !event.target.closest('.Nav-menu-toggle')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLoginClick = () => {
    const currentPath = location.pathname;
    sessionStorage.setItem('redirectAfterLogin', currentPath);
    navigate('/Login');
  };

  const triggerLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      sessionStorage.removeItem('redirectAfterLogin');
      sessionStorage.removeItem('attemptedPath');
      sessionStorage.removeItem('requiredRole');
      handleLogout();
    }
  };

  const userRole = userInfo?.role;
  const displayName = userInfo?.name || userInfo?.ownerName || 'User';

  const getProfilePath = () => {
    if (!isLoggedIn) return '/';
    if (userRole === 'admin') return '/Admin';
    if (userRole === 'client') return '/ClientProfile';
    return '/Profile';
  };

  const phoneIconUrl = "https://cdn-icons-png.flaticon.com/128/9840/9840072.png";
  const locationIconUrl = "https://cdn-icons-png.flaticon.com/128/9131/9131546.png";

  return (
    <header className={`Nav-header-main ${scrolled ? 'Nav-header-scrolled' : ''}`} ref={headerRef}>
      <div className="Nav-header-container">
        <Link className="Nav-brand-logo" to="/">
          <img src={logo} alt="ALUX" className="Nav-brand-image" />
          <span className="Nav-brand-text">ALUX</span>
        </Link>

        <div className="Nav-menu-links">
          <NavLink to="/" className={({ isActive }) => `Nav-menu-item ${isActive ? 'Nav-active-menu-item' : ''}`}>
            Home
          </NavLink>
          
          <NavLink to="/AboutUs" className={({ isActive }) => `Nav-menu-item ${isActive ? 'Nav-active-menu-item' : ''}`}>
            About Us
          </NavLink>
          
          <NavLink to="/Service" className={({ isActive }) => `Nav-menu-item ${isActive ? 'Nav-active-menu-item' : ''}`}>
            Services
          </NavLink>
          
          <NavLink to="/ContactUs" className={({ isActive }) => `Nav-menu-item ${isActive ? 'Nav-active-menu-item' : ''}`}>
            Contact Us
          </NavLink>
          
          {isLoggedIn && userRole === 'admin' && (
            <NavLink to="/Admin" className={({ isActive }) => `Nav-menu-item ${isActive ? 'Nav-active-menu-item' : ''}`}>
              Admin Panel
            </NavLink>
          )}
        </div>

        <div className="Nav-contact-info">
          <div className="Nav-contact-item">
            <img src={locationIconUrl} alt="Location" className="Nav-contact-icon-img" />
            <span>PANADURA</span>
          </div>
        </div>

        <div className="Nav-auth-section">
          {isLoggedIn && userInfo ? (
            <div className="Nav-user-actions">
              <Link to="/ItemsCartManage" className="Nav-cart-icon">
                <ShoppingCart size={22} />
                {cartItemCount > 0 && (
                  <span className="Nav-cart-badge">{cartItemCount}</span>
                )}
              </Link>
              
              <button onClick={triggerLogout} className="Nav-logout-btn">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="Nav-auth-buttons">
              <button onClick={handleLoginClick} className="Nav-login-btn">Login</button>
              <Link to="/ClientForm" className="Nav-signup-btn">Sign Up</Link>
            </div>
          )}

          <button 
            className="Nav-menu-toggle" 
            onClick={toggleMenu} 
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div className={`Nav-mobile-menu ${isOpen ? 'active' : ''}`} ref={mobileMenuRef}>
        <div className="Nav-mobile-menu-items">
          {isLoggedIn && userInfo && (
            <div className="Nav-mobile-user-info">
              <div className="Nav-mobile-user-details">
                <div className="Nav-mobile-user-name">{displayName}</div>
                <div className="Nav-mobile-user-role">{userRole === 'admin' ? 'Administrator' : 'Client'}</div>
              </div>
            </div>
          )}
          
          <div className="Nav-mobile-contact">
            
            <div className="Nav-mobile-contact-item">
              <img src={locationIconUrl} alt="Location" className="Nav-mobile-contact-icon-img" />
              <span>Panadura</span>
            </div>
          </div>
          
          <NavLink 
            to="/" 
            className={({ isActive }) => `Nav-mobile-menu-item ${isActive ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            Home
          </NavLink>
          
          <NavLink 
            to="/AboutUs" 
            className={({ isActive }) => `Nav-mobile-menu-item ${isActive ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            About Us
          </NavLink>
          
          <NavLink 
            to="/Service" 
            className={({ isActive }) => `Nav-mobile-menu-item ${isActive ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            Services
          </NavLink>
          
          <NavLink 
            to="/ContactUs" 
            className={({ isActive }) => `Nav-mobile-menu-item ${isActive ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            Contact Us
          </NavLink>

          {isLoggedIn && userRole === 'admin' && (
            <NavLink 
              to="/Admin" 
              className={({ isActive }) => `Nav-mobile-menu-item ${isActive ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              Admin Panel
            </NavLink>
          )}
          
          {isLoggedIn && (
            <NavLink 
              to={getProfilePath()} 
              className="Nav-mobile-menu-item"
              onClick={() => setIsOpen(false)}
            >
              My Profile
            </NavLink>
          )}
          
          {isLoggedIn && (
            <button onClick={() => {
              setIsOpen(false);
              triggerLogout();
            }} className="Nav-mobile-logout-btn">
              <LogOut size={18} />
              Logout
            </button>
          )}
          
          {!isLoggedIn && (
            <div className="Nav-mobile-auth-buttons">
              <button 
                onClick={() => {
                  setIsOpen(false);
                  handleLoginClick();
                }} 
                className="Nav-mobile-login-btn"
              >
                Login
              </button>
              <Link 
                to="/ClientForm" 
                className="Nav-mobile-signup-btn"
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