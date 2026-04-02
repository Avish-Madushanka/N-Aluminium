import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import logo from '../../assets/logo.png';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-footer-wrapper">
      <div className="mt-footer-container">
        <div className="mt-footer-grid">
          
          <div className="mt-footer-brand-col">
            <div className="mt-footer-logo-box">
              <span className="mt-footer-brand-name">MetaTrade</span>
            </div>
            <p className="mt-footer-tagline">
              Revolutionizing aluminum recycling through smart technology and sustainable trade solutions for a greener future.
            </p>
            <div className="mt-footer-social-row">
              <a href="https://facebook.com" className="mt-social-btn" aria-label="Facebook"><FaFacebookF /></a>
              <a href="https://twitter.com" className="mt-social-btn" aria-label="Twitter"><FaTwitter /></a>
              <a href="https://linkedin.com" className="mt-social-btn" aria-label="LinkedIn"><FaLinkedinIn /></a>
              <a href="https://instagram.com" className="mt-social-btn" aria-label="Instagram"><FaInstagram /></a>
            </div>
          </div>

          <div className="mt-footer-nav-col">
            <h4 className="mt-footer-heading">Quick Links</h4>
            <ul className="mt-footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/AboutUs">About Us</Link></li>
              <li><Link to="/Service">Services</Link></li>
              <li><Link to="/ContactUs">Contact Us</Link></li>
            </ul>
          </div>

          <div className="mt-footer-nav-col">
            <h4 className="mt-footer-heading">Legal Policy</h4>
            <ul className="mt-footer-links">
              <li><Link to="/Terms">Terms & Conditions</Link></li>
              <li><Link to="/Privacy">Privacy Policy</Link></li>
              <li><Link to="/Cookie">Cookie Policy</Link></li>
            </ul>
          </div>

          <div className="mt-footer-contact-col">
            <h4 className="mt-footer-heading">Get In Touch</h4>
            <div className="mt-contact-item">
              <FaEnvelope className="mt-contact-icon" />
              <a href="mailto:donotreply.ALUX@gmail.com" className="mt-contact-link">donotreply.ALUX@gmail.com</a>
            </div>
            <div className="mt-contact-item">
              <FaMapMarkerAlt className="mt-contact-icon" />
              <span className="mt-contact-text">426F Shanthi Garden, Medha MW, Alubomulla, Panadura</span>
            </div>
            <div className="mt-newsletter-mini">
              <p className="mt-newsletter-text">Stay updated with our latest recycling tech.</p>
            </div>
          </div>

        </div>

        <div className="mt-footer-divider"></div>

        <div className="mt-footer-bottom">
          <p className="mt-copyright-text">
            © {currentYear} <span className="mt-highlight">MetaTrade</span>. All rights reserved. Designed for Sustainability.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;