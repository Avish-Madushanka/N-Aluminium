import React from 'react';
import './ServiceMain.css';

function ServiceMain() {
  return (
    <div className="App12">
      <header className="welcome-section1">
        <div className="welcome-content1">
          <h1>WELCOME</h1>
        </div>
      </header>

      <main>
        <section className="feature-section">
          <div className="feature-text">
            <span className="feature-number">01</span>
            <div className="feature-icon">
              <img src="/path/to/balance-icon.svg" alt="Balance Icon" />
            </div>
            <h2>Balance Body & Mind</h2>
            <p>We align nutrition with mental wellness for a balanced lifestyle.</p>
            <a href="#read-more-1" className="read-more">Read More</a>
          </div>
          <div className="feature-image">
            <img src="/path/to/balance-body-mind.jpg" alt="Woman with healthy food" />
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
            <h2>Fitness Performance</h2>
            <p>Fuel your workouts with food that enhances strength and recovery.</p>
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
            <h2>Fitness Performance</h2>
            <p>Fuel your workouts with food that enhances strength and recovery.</p>
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
