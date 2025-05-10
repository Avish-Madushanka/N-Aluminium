// src/Pages/SubmitReviewPage.jsx (or wherever your Submit component is)
import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../api/axiosInstance'; // Assuming you have this
import API_ENDPOINTS from '../../apiConfig';       // Assuming you have this
import { ClipLoader } from 'react-spinners';    // For loading state
import { AlertTriangle } from 'lucide-react';   // For error display
import './Submit.css'; // Ensure your CSS is correctly linked

const Submit = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false); // For initial container animation
  const [animatedCards, setAnimatedCards] = useState([]); // For card animations on scroll

  // Fetch reviews from the backend
  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      // API_ENDPOINTS.REVIEWS.GET_ALL should be something like 'http://localhost:5003/api/reviews'
      // This endpoint should return publicly approved reviews by default
      const response = await axiosInstance.get(API_ENDPOINTS.REVIEWS.GET_ALL);

      if (response.data.success && Array.isArray(response.data.data)) {
        // Transform backend data if needed to match the structure your component expects
        // (e.g., backend might use `reviewText` but your card expects `comment`)
        const fetchedReviews = response.data.data.map(review => ({
          id: review._id, // Use MongoDB _id
          name: review.name,
          role: 'Customer Review', // Or derive if backend provides more info
          rating: review.rating,
          comment: review.reviewText, // Map reviewText to comment
          // avatar: review.avatar || '/images/default-avatar.png', // If backend sends avatar
          // isApproved: review.isApproved // Only approved reviews are fetched by default
        }));
        setReviews(fetchedReviews);
        console.log("Fetched reviews from backend:", fetchedReviews);
      } else {
        throw new Error(response.data.message || "Failed to fetch reviews or data format is incorrect.");
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError(err.response?.data?.message || err.message || "Could not load reviews. Please try again later.");
      // Fallback to localStorage or defaults if API fails? Or just show error.
      // For now, just show error and empty reviews.
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews(); // Fetch on component mount

    // Initial container visibility animation
    const visibilityTimer = setTimeout(() => {
      setVisible(true);
    }, 300);

    return () => clearTimeout(visibilityTimer);
  }, [fetchReviews]); // fetchReviews is stable due to useCallback

  // Scroll animation for cards (can be kept or simplified)
  useEffect(() => {
    if (isLoading || reviews.length === 0) return; // Don't run if loading or no reviews

    const handleScroll = () => {
      const cards = document.querySelectorAll('.SubRev-review-card');
      const newAnimatedIndexes = [];
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        // Animate if card is partially in view from the bottom
        if (rect.top < window.innerHeight - 50 && rect.bottom > 50) {
          newAnimatedIndexes.push(index);
        }
      });
      setAnimatedCards(prevAnimated => {
        // Only update if there's a change to avoid unnecessary re-renders
        if (JSON.stringify(prevAnimated) !== JSON.stringify(newAnimatedIndexes)) {
          return newAnimatedIndexes;
        }
        return prevAnimated;
      });
    };

    // Initial check after reviews are loaded
    const initialScrollCheckTimer = setTimeout(handleScroll, 100); // Short delay after reviews render
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll); // Also on resize

    return () => {
      clearTimeout(initialScrollCheckTimer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isLoading, reviews]); // Rerun if reviews change (e.g., after fetching)

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

  if (isLoading) {
    return (
      <div className="SubRev-loading-container">
        <ClipLoader size={50} color={"#673ab7"} />
        <p>Loading Reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`SubRev-container SubRev-visible`}>
        <h2 className="SubRev-title">Customer Feedback</h2>
        <div className="SubRev-error-message">
          <AlertTriangle size={24} />
          <p>{error}</p>
          <button onClick={fetchReviews} className="SubRev-retry-button">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`SubRev-container ${visible ? 'SubRev-visible' : ''}`}>
      <h2 className="SubRev-title">
        What Our Customers Say
        <div className="SubRev-title-underline"></div>
      </h2>

      {reviews.length === 0 ? (
        <div className="SubRev-no-reviews-message">
          <p>No reviews available at the moment. Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="SubRev-reviews-grid">
          {reviews.map((review, index) => (
            <div
              key={review.id} // Assuming review.id is unique from backend (_id)
              className={`SubRev-review-card ${animatedCards.includes(index) ? 'SubRev-card-animated' : ''}`}
              style={{ animationDelay: `${index * 0.15}s` }} // Slightly faster animation delay
            >
              {/* <div className="SubRev-card-corner"></div> Decorative corner */}
              <div className="SubRev-reviewer-info">
                <h3 className="SubRev-reviewer-name">{review.name}</h3>
                {review.role && <p className="SubRev-reviewer-role">{review.role}</p>}
              </div>
              <div className="SubRev-rating">
                {renderStars(review.rating)}
              </div>
              <p className="SubRev-comment">"{review.comment}"</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Submit;