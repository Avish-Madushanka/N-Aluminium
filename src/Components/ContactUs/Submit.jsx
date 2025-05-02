import React from "react";
import "./Submit.css";

const Submit = () => {
  // Sample review data
  const reviews = [
    {
      id: 1,
      name: "Jenifer",
      role: "Web Application Engineer",
      rating: 5,
      comment: "Happy Addon is the best Addon in the WordPress ecosystem.",
      avatar: "/api/placeholder/100/100"
    },
    {
      id: 2,
      name: "Adam Toffle",
      role: "HR Manager",
      rating: 4,
      comment: "Happy reviewer is super excited being part of happy addons family",
      avatar: "/api/placeholder/100/100"
    },
    {
      id: 3,
      name: "Rebeca Mendez",
      role: "Business Developer",
      rating: 4,
      comment: "Happy reviewer is super excited being part of happy addons family",
      avatar: "/api/placeholder/100/100"
    }
  ];

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    
    // Add filled stars
    for (let i = 0; i < rating; i++) {
      stars.push(
        <span key={`filled-${i}`} className="SubRev-star SubRev-star-filled">★</span>
      );
    }
    
    // Add empty stars
    for (let i = rating; i < 5; i++) {
      stars.push(
        <span key={`empty-${i}`} className="SubRev-star SubRev-star-empty">☆</span>
      );
    }
    
    return stars;
  };

  return (
    <div className="SubRev-container">
      <h1 className="SubRev-title">Give Your Feedback Here</h1>
      
      <div className="SubRev-reviews-grid">
        {reviews.map((review) => (
          <div key={review.id} className="SubRev-review-card">
            <div className="SubRev-avatar-container">
              <img 
                src={review.avatar} 
                alt={`${review.name} avatar`} 
                className="SubRev-avatar" 
              />
            </div>
            
            <div className="SubRev-divider"></div>
            
            <div className="SubRev-reviewer-info">
              <h2 className="SubRev-reviewer-name">{review.name}</h2>
              <p className="SubRev-reviewer-role">{review.role}</p>
            </div>
            
            <div className="SubRev-rating">
              {renderStars(review.rating)}
            </div>
            
            <p className="SubRev-comment">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Submit;