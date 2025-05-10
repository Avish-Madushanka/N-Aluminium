import React, { useState, useEffect } from 'react';
import './DisReview.css';

const DisReview = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate loading time
    setLoading(true);
    
    setTimeout(() => {
      // Get reviews from localStorage
      const storedReviews = JSON.parse(localStorage.getItem('reviews')) || [];
      
      // If no stored reviews, use default reviews
      const defaultReviews = [
        {
          id: 1,
          name: "Sarah Johnson",
          role: "Regular Customer",
          rating: 5,
          comment: "Absolutely incredible service! The team went above and beyond to meet my needs. I've been a customer for years and they never disappoint.",
          avatar: "/images/avatar1.jpg",
          date: new Date(2023, 11, 15).toISOString()
        },
        {
          id: 2,
          name: "Michael Chen",
          role: "New Client",
          rating: 4,
          comment: "Very impressed with the quality and attention to detail. Will definitely be returning for more services in the future.",
          avatar: "/images/avatar2.jpg",
          date: new Date(2024, 0, 22).toISOString()
        },
        {
          id: 3,
          name: "Emily Rodriguez",
          role: "Business Partner",
          rating: 5,
          comment: "Working with this team has been a pleasure. Their professionalism and expertise have helped our business grow tremendously.",
          avatar: "/images/avatar3.jpg",
          date: new Date(2024, 1, 10).toISOString()
        }
      ];
      
      const allReviews = storedReviews.length > 0 ? storedReviews : defaultReviews;
      setReviews(allReviews);
      setLoading(false);
    }, 800);
  }, []);

  // Sort reviews based on selected sort option
  const getSortedReviews = () => {
    const filteredReviews = reviews.filter(review => {
      // Apply rating filter
      if (filterRating !== 'all' && review.rating !== parseInt(filterRating)) {
        return false;
      }
      
      // Apply search filter
      if (searchTerm && !review.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !review.comment.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    });
    
    return [...filteredReviews].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date) - new Date(a.date);
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });
  };

  // Toggle selection for a review
  const toggleReviewSelection = (id) => {
    if (selectedReviews.includes(id)) {
      setSelectedReviews(selectedReviews.filter(reviewId => reviewId !== id));
    } else {
      setSelectedReviews([...selectedReviews, id]);
    }
  };

  // Toggle select all reviews
  const toggleSelectAll = () => {
    if (selectedReviews.length === getSortedReviews().length) {
      setSelectedReviews([]);
    } else {
      setSelectedReviews(getSortedReviews().map(review => review.id));
    }
  };

  // Delete selected reviews
  const handleDeleteSelected = () => {
    const updatedReviews = reviews.filter(review => !selectedReviews.includes(review.id));
    setReviews(updatedReviews);
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));
    setSelectedReviews([]);
    setConfirmDelete(false);
  };

  // Delete a single review
  const handleDeleteReview = (id) => {
    const updatedReviews = reviews.filter(review => review.id !== id);
    setReviews(updatedReviews);
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));
    setSelectedReviews(selectedReviews.filter(reviewId => reviewId !== id));
  };

  // Render stars for rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`ARev-star ${i <= rating ? 'ARev-star-filled' : 'ARev-star-empty'}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="ARev-reviews-container">
      <div className="ARev-header">
        <h1>Review Management</h1>
        <p>Manage and moderate customer reviews</p>
      </div>

      <div className="ARev-controls">
        <div className="ARev-search">
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="ARev-filters">
          <div className="ARev-filter-group">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>

          <div className="ARev-filter-group">
            <label>Rating:</label>
            <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)}>
              <option value="all">All Stars</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>

        <div className="ARev-actions">
          <button 
            className={`ARev-select-all ${selectedReviews.length > 0 ? 'ARev-selected' : ''}`}
            onClick={toggleSelectAll}
          >
            {selectedReviews.length === getSortedReviews().length && getSortedReviews().length > 0 
              ? 'Deselect All' 
              : 'Select All'}
          </button>
          
          {selectedReviews.length > 0 && (
            <button 
              className="ARev-delete-selected"
              onClick={() => setConfirmDelete(true)}
            >
              Delete Selected ({selectedReviews.length})
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="ARev-loading">
          <div className="ARev-spinner"></div>
          <p>Loading reviews...</p>
        </div>
      ) : getSortedReviews().length > 0 ? (
        <div className="ARev-reviews-list">
          {getSortedReviews().map(review => (
            <div 
              key={review.id} 
              className={`ARev-review-card ${selectedReviews.includes(review.id) ? 'ARev-selected' : ''}`}
            >
              <div className="ARev-review-header">
                <div className="ARev-checkbox-container">
                  <input
                    type="checkbox"
                    checked={selectedReviews.includes(review.id)}
                    onChange={() => toggleReviewSelection(review.id)}
                    id={`check-${review.id}`}
                  />
                  <label htmlFor={`check-${review.id}`} className="ARev-checkbox-label"></label>
                </div>
                
                <div className="ARev-reviewer-info">
                  <h3>{review.name}</h3>
                  <p>{review.role}</p>
                </div>
                
                <div className="ARev-review-meta">
                  <div className="ARev-rating">{renderStars(review.rating)}</div>
                  <div className="ARev-date">{formatDate(review.date)}</div>
                </div>
              </div>
              
              <div className="ARev-review-content">
                <p>"{review.comment}"</p>
              </div>
              
              <div className="ARev-review-actions">
                <button 
                  className="ARev-delete-btn"
                  onClick={() => handleDeleteReview(review.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="ARev-no-reviews">
          <p>No reviews found matching your criteria.</p>
        </div>
      )}

      {confirmDelete && (
        <div className="ARev-modal-overlay">
          <div className="ARev-delete-modal">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete {selectedReviews.length} selected review{selectedReviews.length > 1 ? 's' : ''}?</p>
            <p className="ARev-warning">This action cannot be undone.</p>
            
            <div className="ARev-modal-actions">
              <button 
                className="ARev-cancel-btn"
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </button>
              <button 
                className="ARev-confirm-btn"
                onClick={handleDeleteSelected}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="ARev-footer">
        <p>Showing {getSortedReviews().length} of {reviews.length} total reviews</p>
      </div>
    </div>
  );
};

export default DisReview;