import React from 'react';
import './MainHomePage.css';

const MainHomePage = () => {
  return (
    <div className="streaming-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Catman 2: The Villain Returns</h1>
          <p>The story continues, more mysteries, more darkness.</p>
        </div>
      </div>
      
      <div className="releases-section">
        <div className="posters-row">
          <div className="poster-item">
            <div className="poster-box twin-poster">
              <span>The Twins</span>
            </div>
            <button className="watch-button">Watch Now</button>
          </div>
          <div className="poster-item">
            <div className="poster-box dogdays-poster">
              <span>DOG DAYS</span>
            </div>
            <button className="watch-button">Watch Now</button>
          </div>
          <div className="poster-item">
            <div className="poster-box grandfather-poster">
              <span>How I Met Your Grand Father</span>
            </div>
            <button className="watch-button">Watch Now</button>
          </div>
          <div className="poster-item">
            <div className="poster-box orange-poster">
              <span>Black Is The New Orange</span>
            </div>
            <button className="watch-button">Watch Now</button>
          </div>
          <div className="poster-item">
            <div className="poster-box zoo-poster">
              <span>Zoo Park</span>
            </div>
            <button className="watch-button">Watch Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainHomePage;