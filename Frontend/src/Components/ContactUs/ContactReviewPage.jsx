import React, { useState } from 'react';
import { FaPaperPlane, FaPhone, FaMapMarkerAlt, FaEnvelope, FaUser, FaComment } from 'react-icons/fa';
import './ContactReviewPage.css';

const ContactReviewPage = () => {
  const [formData, setFormData] = useState({ name: '', contact: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

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
          <h2>Share Your Feedback</h2>
          <p className="intro-text">
            We value your input! Reach out with any questions or thoughts you have.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group floating-label">
            <FaUser className="input-icon" />
            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder=" " />
            <label>Your Name</label>
          </div>

          <div className="form-group floating-label">
            <FaEnvelope className="input-icon" />
            <input type="text" name="contact" value={formData.contact} onChange={handleChange} required placeholder=" " />
            <label>Contact</label>
          </div>

          <div className="form-group floating-label">
            <FaComment className="input-icon" />
            <textarea name="message" value={formData.message} onChange={handleChange} required placeholder=" " rows="5" />
            <label>Share your thoughts</label>
          </div>

          <button type="submit" className={`submit-btn ${isSubmitting ? 'submitting' : ''}`} disabled={isSubmitting}>
            {isSubmitting ? <span className="spinner"></span> : <><FaPaperPlane /> Send Message</>}
          </button>

          {submitSuccess && <div className="success-message">Thank you! Your message has been received.</div>}
        </form>
      </div>

      <div className="contact-right-panel">
        <h3>Contact Us</h3>
        <div className="info-card">
          <div className="info-item">
            <div className="info-icon-wrapper"><FaPhone /></div>
            <div className="info-content"><h4>Call Us</h4><p>+1 456-900-8908</p></div>
          </div>
          <div className="info-item">
            <div className="info-icon-wrapper"><FaMapMarkerAlt /></div>
            <div className="info-content"><h4>Visit Us</h4><p>25/A Jameson Sparke St., Los Angeles, US</p></div>
          </div>
          <div className="info-item">
            <div className="info-icon-wrapper"><FaEnvelope /></div>
            <div className="info-content"><h4>Email Us</h4><p>webbeyou@mail.com</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactReviewPage;
