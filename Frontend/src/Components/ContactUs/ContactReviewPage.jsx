import React, { useState } from 'react';
import { FaPaperPlane, FaPhone, FaMapMarkerAlt, FaEnvelope, FaUser, FaComment } from 'react-icons/fa';
import './ContactReviewPage.css';

const ContactReviewPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: '', contact: '', message: '' });
      
      setTimeout(() => setSubmitSuccess(false), 4000);
    }, 1500);
  };

  return (
    <div className="contact-form-container">
      <div className="contact-left-panel">
        <div className="contact-header">
          <h2>SHARE YOUR FEEDBACK</h2>
          <p className="intro-text">
            It is very important for us to keep in touch with you, 
            so we are always ready to answer any question that interests you. Shoot!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group floating-label">
            <FaUser className="input-icon" />
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder=" "
            />
            <label htmlFor="name">Your Name</label>
          </div>
          
          <div className="form-group floating-label">
            <FaEnvelope className="input-icon" />
            <input
              type="text"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              placeholder=" "
            />
            <label htmlFor="contact">Contact</label>
          </div>
          
          <div className="form-group floating-label">
            <FaComment className="input-icon" />
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder=" "
              rows="4"
            ></textarea>
            <label htmlFor="message">Share your thoughts</label>
          </div>
          
          <button 
            type="submit" 
            className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="spinner"></span>
            ) : (
              <>
                <FaPaperPlane /> Send Message
              </>
            )}
          </button>
          
          {submitSuccess && (
            <div className="success-message">
              Thank you! Your message has been received.
            </div>
          )}
        </form>
      </div>

      <div className="contact-right-panel">
        <div className="contact-info-section">
          <h3>Us</h3>
          <div className="info-card">
            <div className="info-item">
              <div className="info-icon-wrapper">
                <FaPhone className="info-icon" />
              </div>
              <div className="info-content">
                <h4>CALL US</h4>
                <p>4569-008-9008</p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-icon-wrapper">
                <FaMapMarkerAlt className="info-icon" />
              </div>
              <div className="info-content">
                <h4>VISIT US</h4>
                <p>Jameson Sparke St.25/A Los Angeles US</p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-icon-wrapper">
                <FaEnvelope className="info-icon" />
              </div>
              <div className="info-content">
                <h4>EMAIL US</h4>
                <p>webbeyou@mail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactReviewPage;