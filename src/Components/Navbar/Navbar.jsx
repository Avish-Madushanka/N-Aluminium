import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg bg-light">
      <div className="container-fluid">
        {/* Logo */}
        <a className="navbar-brand" href="/">MyLogo</a>

        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={toggleMenu}
          aria-controls="navbarNav"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="/">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/AboutUs">About</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/services">Services</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/contact">Contact</a>
            </li>
          </ul>

          <div className="d-flex ms-lg-3">
            <a href="/Login" className="btn btn-primary me-2">Login</a>
            <a href="/SignUp" className="btn btn-outline-secondary">Sign Up</a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
