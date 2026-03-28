import React, { useState } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaLongArrowAltRight } from 'react-icons/fa';
import './ContactReviewPage.css';

const ContactReviewPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    expertise: '',
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
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', phone: '', location: '', expertise: '', message: '' });
      setTimeout(() => setSubmitSuccess(false), 4000);
    }, 1500);
  };

  return (
    <div className="Con-root">
      <section className="Con-hero">
        <div className="Con-hero-overlay"></div>
        <div className="Con-hero-content">
          <h1>CONTACT US</h1>
        </div>
      </section>

      <div className="Con-intro-section">
        <div className="Con-intro-header">
          <span className="Con-intro-tag">GET IN TOUCH</span>
          <h2 className="Con-intro-title">
            Let’s Discuss Your <br /> Aluminum Solutions
          </h2>
          <p className="Con-intro-sub">
            Whether you need custom fabrication, scrap collection, or market insights, 
            our team is here to help you optimize your resources.
          </p>
        </div>
      </div>

      <div className="Con-main-wrapper">
        <div className="Con-container">
          
          <div className="Con-info-side">
            <h2 className="Con-main-heading">
              <span>Connect</span> with Our Team of Experts
            </h2>
            <p className="Con-sub-heading">
              Contact our team of excellence-driven experts today to bring your project to life.
            </p>

            <div className="Con-contact-quick-links">
              <div className="Con-link-item">
                <FaPhoneAlt className="Con-large-icon" /> <span>+94 72 104 6048</span>
              </div>
              <div className="Con-link-item">
                <FaEnvelope className="Con-large-icon" /> <span>donotreply.ALUX@gmail.com</span>
              </div>
              <div className="Con-link-item">
                <FaMapMarkerAlt className="Con-large-icon" /> <span>426F Shanthi Garden, Medha MW,<br />Alubomulla, Panadura</span>
              </div>
            </div>

            <div className="Con-talent-card">
              <div className="Con-talent-content">
                <h3>Want to Join Our Training Programme?</h3>
                <a href="/AluTReg" className="Con-job-link">
                  JOIN HERE <div className="Con-circle-arrow">›</div>
                </a>
              </div>
              <div className="Con-talent-image">
                <img src="https://aluminiumacademy.com/wp-content/uploads/2024/03/Technical-Training.jpg" />
              </div>
            </div>
          </div>

          <div className="Con-form-side">
            <form onSubmit={handleSubmit} className="Con-real-form">
              <div className="Con-form-row">
                <div className="Con-input-box">
                  <label>Full Name <span>*</span></label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required />
                </div>
                <div className="Con-input-box">
                  <label>Email Address <span>*</span></label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required />
                </div>
              </div>

              <div className="Con-form-row">
                <div className="Con-input-box">
                  <label>Phone Number</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" />
                </div>
                <div className="Con-input-box">
                  <label>Location</label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" />
                </div>
              </div>

              <div className="Con-input-box full-width">
                <label>What Expertise You're Interested In <span>*</span></label>
                <select name="expertise" value={formData.expertise} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="fabrication">Aluminum Fabrication</option>
                  <option value="scrap">Scrap Collection</option>
                  <option value="marketplace">Material Marketplace</option>
                </select>
              </div>

              <div className="Con-input-box full-width">
                <label>Tell Us About Your Project <span>*</span></label>
                <textarea name="message" value={formData.message6} onChange={handleChange} placeholder="Leave your message here" required rows="4"></textarea>
              </div>

              <button type="submit" className="Con-submit-btn-real" disabled={isSubmitting}>
                {isSubmitting ? "SENDING..." : <>SUBMIT <FaLongArrowAltRight /></>}
              </button>

              {submitSuccess && <div className="Con-success-box">Message sent successfully!</div>}
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactReviewPage;