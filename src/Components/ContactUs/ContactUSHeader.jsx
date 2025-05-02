// ContactUSHeader.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ContactUSHeader.css';

const ContactUSHeader = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    rating: 5,
    reviewText: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (newRating) => {
    setFormData((prev) => ({ ...prev, rating: newRating }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAnimate(true);

    // Save review to localStorage
    const existingReviews = JSON.parse(localStorage.getItem('reviews')) || [];
    const newReview = {
      id: Date.now(),
      name: formData.name,
      role: 'Guest Reviewer',
      rating: formData.rating,
      comment: formData.reviewText,
    };
    localStorage.setItem('reviews', JSON.stringify([newReview, ...existingReviews]));

    setTimeout(() => {
      setSubmitted(true);
      setAnimate(false);
      navigate('/submit');  // Redirect to Submit page
    }, 1000);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= formData.rating ? 'active-star' : 'inactive-star'}`}
          onClick={() => handleRatingChange(i)}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="contact-page">
      <header className="header">
        <h1 className="title">Contact Us</h1>
        <p className="subtitle">We'd love to hear from you!</p>
      </header>

      <main className="main-content">
        <div className="contact-container two-column-layout">
          {/* Left Column - Review Form */}
          <div className="contact-form-container">
            {!submitted ? (
              <form className="contact-form" onSubmit={handleSubmit}>
                <h2>Share your experience</h2>
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Review Title"
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group rating-group">
                  <label className="rating-label">Your Rating</label>
                  <div className="star-rating">
                    {renderStars()}
                  </div>
                </div>
                <div className="form-group">
                  <textarea
                    name="reviewText"
                    value={formData.reviewText}
                    onChange={handleChange}
                    placeholder="Write your review here..."
                    required
                    rows="5"
                    className="form-textarea"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className={`submit-button ${animate ? 'animate-pulse' : ''}`}
                >
                  <span>Submit Review</span>
                </button>
              </form>
            ) : (
              <div className="success-message">
                <h2>Thank You!</h2>
                <p>Your review has been submitted successfully. We appreciate your feedback!</p>
              </div>
            )}
          </div>

          {/* Right Column - Contact Details */}
          <div className="contact-details-container">
            <div className="contact-info-card">
              <h2>Contact Information</h2>
              
              <div className="contact-info-item">
                <div className="contact-icon">📱</div>
                <div className="contact-text">
                  <h3>Phone</h3>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="contact-info-item">
                <div className="contact-icon">✉️</div>
                <div className="contact-text">
                  <h3>Email</h3>
                  <p>support@yourcompany.com</p>
                </div>
              </div>
              
              <div className="contact-info-item">
                <div className="contact-icon">🏢</div>
                <div className="contact-text">
                  <h3>Address</h3>
                  <p>123 Business Street</p>
                  <p>Suite 456</p>
                  <p>New York, NY 10001</p>
                </div>
              </div>
              
              <div className="contact-info-item">
                <div className="contact-icon">🕒</div>
                <div className="contact-text">
                  <h3>Business Hours</h3>
                  <p>Monday - Friday: 9am - 5pm</p>
                  <p>Saturday: 10am - 2pm</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactUSHeader;