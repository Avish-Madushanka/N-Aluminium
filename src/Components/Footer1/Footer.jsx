import React from 'react';
import './Footer.css';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import logo from '../../assets/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer1">
      <div className="footer1-content">
        <div className="footer1-section footer1-section-logo">
          <img
            src={logo}
            alt="Avo Company Logo"
            className="footer1-logo"
          />
          <div className="footer1-text">ALUX</div>
        </div>

        <div className="footer1-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/careers">Services</a></li>
            <li><a href="/contactus">Contact Us</a></li>
          </ul>
        </div>

        <div className="footer1-section">
          <h4>Legal</h4>
          <ul>
            <li><a href="/terms">Terms and Conditions</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/cookies">Cookie Policy</a></li>
          </ul>
        </div>

        <div className="footer1-section footer1-section-contact">
          <h4>Let's chat!</h4>
          <p>
            <a href="mailto:hi@avo.app" className="footer1-email-link">hi@avo.app</a>
          </p>
          <div className="footer1-social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook">
              <FaFacebookF />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Twitter">
              <FaTwitter />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="Follow us on LinkedIn">
              <FaLinkedinIn />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      <div className="footer1-copyright">
        © {currentYear} Avo.app. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
