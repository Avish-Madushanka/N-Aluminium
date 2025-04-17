import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import "./Navbar.css";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check Login Status on mount and route change
  useEffect(() => {
    const clientToken = localStorage.getItem('clientToken');
    const bOwnerToken = localStorage.getItem('bOwnerToken');

    if (clientToken) {
      setIsLoggedIn(true);
      setUserType('client');
    } else if (bOwnerToken) {
      setIsLoggedIn(true);
      setUserType('bowner');
    } else {
      setIsLoggedIn(false);
      setUserType(null);
    }
    setIsOpen(false); // Close mobile menu on navigation
  }, [location]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Handle Logout with Confirmation
  const handleLogout = () => {
    // --- Add Confirmation Step ---
    const confirmLogout = window.confirm("Are you sure you want to log out?"); // Browser confirm dialog

    // Proceed only if the user clicks "OK" (confirmLogout is true)
    if (confirmLogout) {
      console.log("User confirmed logout."); // Optional log

      // --- Perform Logout Actions ---
      // Remove tokens and user info
      if (userType === 'client') {
        localStorage.removeItem('clientToken');
        localStorage.removeItem('clientInfo');
      } else if (userType === 'bowner') {
        localStorage.removeItem('bOwnerToken');
        localStorage.removeItem('bOwnerInfo');
      } else {
        // Fallback cleanup
        localStorage.removeItem('clientToken');
        localStorage.removeItem('clientInfo');
        localStorage.removeItem('bOwnerToken');
        localStorage.removeItem('bOwnerInfo');
      }

      // Update component state
      setIsLoggedIn(false);
      setUserType(null);
      setIsOpen(false); // Close mobile menu

      // Redirect to home page
      navigate('/');
    } else {
      // User clicked "Cancel" - do nothing
      console.log("User cancelled logout."); // Optional log
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <a className="navbar-brand" href="/">
          <img src={logo} alt="N-Aluminium Logo" className="nav-logo" />
        </a>

        {/* Desktop Links */}
        <div className="nav-links">
          <a href="/" className="nav-item">Home</a>
          <a href="/AboutUs" className="nav-item">About Us</a>
          <a href="/Service" className="nav-item">Services</a>
          <a href="/contact" className="nav-item">Contact Us</a>
          {/* Conditional Dashboard Links */}
          {isLoggedIn && userType === 'client' && (
            <a href="/client-dashboard" className="nav-item">Dashboard</a>
          )}
           {isLoggedIn && userType === 'bowner' && (
            <a href="/bowner-home" className="nav-item">Dashboard</a>
          )}
        </div>

        {/* Desktop Auth/Logout Buttons */}
        <div className="auth-buttons">
          {isLoggedIn ? (
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          ) : (
            <>
              <a href="/Login" className="login-btn">Login</a>
              <a href="/SignUp" className="signup-btn">Sign Up</a>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mobile-menu">
          <a href="/" className="nav-item">Home</a>
          <a href="/AboutUs" className="nav-item">About Us</a>
          <a href="/Service" className="nav-item">Services</a>
          <a href="/contact" className="nav-item">Contact Us</a>
           {/* Conditional Dashboard Links - Mobile */}
           {isLoggedIn && userType === 'client' && (
            <a href="/client-dashboard" className="nav-item">Dashboard</a>
          )}
           {isLoggedIn && userType === 'bowner' && (
            <a href="/bowner-home" className="nav-item">Dashboard</a>
          )}
          <div className="auth-buttons-mobile">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            ) : (
              <>
                <a href="/Login" className="login-btn">Login</a>
                <a href="/SignUp" className="signup-btn">Sign Up</a>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;