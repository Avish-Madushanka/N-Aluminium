import React from 'react';
import './ServiceMain.css';

function ServiceMain() {
  return (
    <div className="App12">
      <header className="welcome-section1">
        <div className="welcome-content1">
          <h1>Our Services</h1>
        </div>
      </header>

      <main>
        <section className="feature-section">
          <div className="feature-text">
            <span className="feature-number">01</span>
            <div className="feature-icon">
              <img src="/path/to/balance-icon.svg" alt="Balance Icon" />
            </div>
            <h2>Aluminum Scraps Pickup</h2>
            <p>Effortless scrap pickup—recycle aluminum waste with ease! Fast, reliable, and eco-friendly collection services to keep your space clean while supporting sustainability.</p>
            <a href="#read-more-1" className="read-more">Read More</a>
          </div>
          <div className="feature-image">
            <img src="/assets/1.png" alt="Woman with healthy food" />
          </div>
        </section>

        <section className="feature-section reverse">
          <div className="feature-text">
            <span className="feature-number">02</span>
            <div className="feature-icon">
              <img src="/path/to/nutrition-icon.svg" alt="Nutrition Icon" />
            </div>
            <h2>Personalized Nutrition</h2>
            <p>Your health goals guide a fully customized nutrition plan.</p>
            <a href="#read-more-2" className="read-more">Read More</a>
          </div>
          <div className="feature-image">
            <img src="/path/to/personalized-nutrition.jpg" alt="Couple cooking" />
          </div>
        </section>

        <section className="feature-section">
          <div className="feature-text">
            <span className="feature-number">03</span>
            <div className="feature-icon">
              <img src="/path/to/fitness-icon.svg" alt="Fitness Icon" />
            </div>
            <h2>Reuse Items Buy & Sell</h2>
            <p>Buy and sell reusable items effortlessly! Give pre-owned goods a second life while saving money and reducing waste. Sustainable trading for a greener future!</p>
            <a href="#read-more-3" className="read-more">Read More</a>
          </div>
          <div className="feature-image">
            <img src="/path/to/fitness-performance.jpg" alt="People preparing food" />
          </div>
        </section>

        <section className="feature-section reverse">
          <div className="feature-text">
            <span className="feature-number">04</span>
            <div className="feature-icon">
              <img src="/path/to/nutrition-icon.svg" alt="Nutrition Icon" />
            </div>
            <h2>Personalized Nutrition</h2>
            <p>Your health goals guide a fully customized nutrition plan.</p>
            <a href="#read-more-2" className="read-more">Read More</a>
          </div>
          <div className="feature-image">
            <img src="/path/to/personalized-nutrition.jpg" alt="Couple cooking" />
          </div>
        </section>

        <section className="feature-section">
          <div className="feature-text">
            <span className="feature-number">05</span>
            <div className="feature-icon">
              <img src="/path/to/fitness-icon.svg" alt="Fitness Icon" />
            </div>
            <h2>Latest Projects</h2>
            <p>From custom aluminum solutions to eco-friendly scrap pickups, each project reflects our commitment to quality, efficiency, and a greener future.</p>
            <a href="#read-more-3" className="read-more">Read More</a>
          </div>
          <div className="feature-image">
            <img src="/path/to/fitness-performance.jpg" alt="People preparing food" />
          </div>
        </section>
      </main>
    </div>
  );
}

export default ServiceMain;
