import React, { useState, useEffect } from 'react';
import './Submit.css';

const Submit = () => {
  const [reviews, setReviews] = useState([]);
  const [visible, setVisible] = useState(false);
  const [animatedCards, setAnimatedCards] = useState([]);

  useEffect(() => {
    // Get reviews from localStorage
    const storedReviews = JSON.parse(localStorage.getItem('reviews')) || [];
    
    // Add some default reviews if none exist
    const defaultReviews = [
      {
        id: 1,
        name: "Sarah Johnson",
        role: "Regular Customer",
        rating: 5,
        comment: "Absolutely incredible service! The team went above and beyond to meet my needs. I've been a customer for years and they never disappoint.",
        avatar: "/images/avatar1.jpg"
      },
      {
        id: 2,
        name: "Michael Chen",
        role: "New Client",
        rating: 4,
        comment: "Very impressed with the quality and attention to detail. Will definitely be returning for more services in the future.",
        avatar: "/images/avatar2.jpg"
      },
      {
        id: 3,
        name: "Emily Rodriguez",
        role: "Business Partner",
        rating: 5,
        comment: "Working with this team has been a pleasure. Their professionalism and expertise have helped our business grow tremendously.",
        avatar: "/images/avatar3.jpg"
      }
    ];
    
    const allReviews = storedReviews.length > 0 ? storedReviews : defaultReviews;
    setReviews(allReviews);
    
    // Trigger initial visibility
    setTimeout(() => {
      setVisible(true);
    }, 300);
    
    // Handle scroll animation for cards
    const handleScroll = () => {
      const cards = document.querySelectorAll('.SubRev-review-card');
      const animatedIndexes = [];
      
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100;
        
        if (isVisible) {
          animatedIndexes.push(index);
        }
      });
      
      setAnimatedCards(animatedIndexes);
    };
    
    // Initial check
    setTimeout(handleScroll, 500);
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`SubRev-star ${i <= rating ? 'SubRev-star-filled' : 'SubRev-star-empty'}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className={`SubRev-container ${visible ? 'SubRev-visible' : ''}`}>
      <h2 className="SubRev-title">
        What Our Customers Say
        <div className="SubRev-title-underline"></div>
      </h2>
      
      <div className="SubRev-reviews-grid">
        {reviews.map((review, index) => (
          <div 
            key={review.id} 
            className={`SubRev-review-card ${animatedCards.includes(index) ? 'SubRev-card-animated' : ''}`}
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="SubRev-divider"></div>
            
            <div className="SubRev-reviewer-info">
              <h3 className="SubRev-reviewer-name">{review.name}</h3>
              <p className="SubRev-reviewer-role">{review.role}</p>
            </div>
            
            <div className="SubRev-rating">
              {renderStars(review.rating)}
            </div>
            
            <p className="SubRev-comment">"{review.comment}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Submit;