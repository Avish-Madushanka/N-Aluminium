import React, { useState } from "react";
import "./Navbar.css"; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <a className="navbar-brand" href="/">
          <img src="/logo.png" alt="MyLogo" className="nav-logo" />
        </a>

        <div className="nav-links">
          <a href="/" className="nav-item">Home</a>
          <a href="/AboutUs" className="nav-item">About</a>
          <a href="/services" className="nav-item">Services</a>
          <a href="/contact" className="nav-item">Contact</a>
        </div>

        <div className="auth-buttons">
          <a href="/Login" className="login-btn">Login</a>
          <a href="/SignUp" className="signup-btn">Sign Up</a>
        </div>

        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>
      </div>

      {isOpen && (
        <div className="mobile-menu">
          <a href="/" className="nav-item">Home</a>
          <a href="/AboutUs" className="nav-item">About</a>
          <a href="/services" className="nav-item">Services</a>
          <a href="/contact" className="nav-item">Contact</a>
          <div className="auth-buttons-mobile">
            <a href="/Login" className="login-btn">Login</a>
            <a href="/SignUp" className="signup-btn">Sign Up</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
