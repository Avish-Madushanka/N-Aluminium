// ContactPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import './ContactUSHeader.css'; // Import the CSS file

// You can replace these with actual icon imports from your preferred library
const IconMail = () => <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const IconPhone = () => <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
const IconMapPin = () => <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const IconClock = () => <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const IconSend = () => <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>;
const IconCheck = () => <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const IconStar = () => <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;

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
  const mapRef = useRef(null);

  useEffect(() => {
    // Initialize map animation
    const ctx = mapRef.current?.getContext('2d');
    if (ctx) {
      let particlesArray = [];
      const numberOfParticles = 100;
      
      // Create particles
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push({
          x: Math.random() * mapRef.current.width,
          y: Math.random() * mapRef.current.height,
          size: Math.random() * 3 + 1,
          speedX: Math.random() * 1 - 0.5,
          speedY: Math.random() * 1 - 0.5
        });
      }
      
      // Animation function
      function animate() {
        ctx.clearRect(0, 0, mapRef.current.width, mapRef.current.height);
        ctx.fillStyle = 'rgba(173, 216, 230, 0.7)';
        ctx.fillRect(0, 0, mapRef.current.width, mapRef.current.height);
        
        // Draw map features
        ctx.fillStyle = 'rgba(144, 238, 144, 0.6)';
        ctx.beginPath();
        ctx.arc(100, 100, 40, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(200, 150, 30, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw particles
        ctx.fillStyle = 'rgba(65, 105, 225, 0.7)';
        for (let i = 0; i < particlesArray.length; i++) {
          let p = particlesArray[i];
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          
          // Update position
          p.x += p.speedX;
          p.y += p.speedY;
          
          // Wrap around edges
          if (p.x < 0) p.x = mapRef.current.width;
          if (p.x > mapRef.current.width) p.x = 0;
          if (p.y < 0) p.y = mapRef.current.height;
          if (p.y > mapRef.current.height) p.y = 0;
        }
        
        // Draw location marker
        ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
        ctx.beginPath();
        ctx.arc(150, 100, 8, 0, Math.PI * 2);
        ctx.fill();
        
        requestAnimationFrame(animate);
      }
      
      animate();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (newRating) => {
    setFormData(prev => ({ ...prev, rating: newRating }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAnimate(true);
    setTimeout(() => {
      setSubmitted(true);
      setAnimate(false);
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
          <IconStar />
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="contact-page">
      <header className="header">
        <h1 className="title">Leave a Review</h1>
        <p className="subtitle">We value your feedback!</p>
      </header>

      <main className="main-content">
        <div className="contact-container">
          {/* Review Form */}
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
                
                {/* Rating Stars */}
                <div className="form-group rating-group">
                  <label className="rating-label">Your Rating</label>
                  <div className="star-rating">
                    {renderStars()}
                  </div>
                </div>
                
                {/* Review Text */}
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
                  <IconSend />
                </button>
              </form>
            ) : (
              <div className="success-message">
                <div className="success-icon">
                  <IconCheck />
                </div>
                <h2>Thank You!</h2>
                <p>Your review has been submitted successfully. We appreciate your feedback!</p>
                <button 
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({name: '', email: '', subject: '', rating: 5, reviewText: ''});
                  }}
                  className="reset-button"
                >
                  Write Another Review
                </button>
              </div>
            )}
          </div>

          <div className="contact-info">
            <div className="map-container">
            </div>
            <div className="info-cards">
              <div className="info-card">
                <div className="card-icon email-icon">
                  <IconMail />
                </div>
                <h3>Email Us</h3>
                <p>hello@creativecompany.com</p>
                <p>support@creativecompany.com</p>
              </div>
              
              <div className="info-card">
                <div className="card-icon phone-icon">
                  <IconPhone />
                </div>
                <h3>Call Us</h3>
                <p>(555) 123-4567</p>
                <p>(555) 765-4321</p>
              </div>
              
              <div className="info-card">
                <div className="card-icon location-icon">
                  <IconMapPin />
                </div>
                <h3>Visit Us</h3>
                <p>123 Creative Avenue</p>
                <p>Designville, DV 12345</p>
              </div>
              
              <div className="info-card">
                <div className="card-icon hours-icon">
                  <IconClock />
                </div>
                <h3>Working Hours</h3>
                <p>Monday - Friday: 9am - 5pm</p>
                <p>Weekend: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactUSHeader;