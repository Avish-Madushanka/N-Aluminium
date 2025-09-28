import React from 'react';
import './HomeBar.css'; // single CSS file

const HomeBar = () => {
  return (
    <div className="argus-scrap-markets">

      {/* Overview Section */}
      <section className="overview-section">
        <h2>Overview</h2>
        <p>
          “Our aluminum digital platform is designed to transform the way aluminum is collected,
          reused, and shared. We provide an innovative system where individuals, households, and
          businesses can easily schedule aluminum scrap collections, ensuring that valuable materials
          never go to waste. Through our marketplace, users can buy and sell reusable aluminum items,
          creating new opportunities for sustainable trade and circular economy practices.
        </p>
        <p>
          For businesses and manufacturers, our smart inventory system makes it simple to track,
          manage, and utilize aluminum resources more efficiently. Designers and engineers can take
          advantage of integrated 3D modeling tools to visualize, plan, and innovate with aluminum-based
          projects, while business owners and creators can upload and showcase their aluminum projects
          directly to our community.
        </p>
        <p>
          By combining convenience, technology, and sustainability, our platform builds a connected
          ecosystem where aluminum is not just recycled but given a new purpose — helping reduce
          environmental impact while empowering communities and industries to benefit from a stronger,
          greener aluminum economy.”
        </p>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="features-title">Key Features</h2>
        <div className="features-grid">
          <div className="feature-item">
            <div className="icon-wrapper">
              <img src="/path/to/assessments-icon.svg" alt="Assessments" className="icon" />
            </div>
            <h3>Assessments</h3>
            <p>Over 600 scrap price assessments across ferrous and non-ferrous metals.</p>
          </div>

          <div className="feature-item">
            <div className="icon-wrapper">
              <img src="/path/to/global-service-icon.svg" alt="Global Service" className="icon" />
            </div>
            <h3>Global Service</h3>
            <p>24/7 support with 28 offices across Asia-Pacific, Africa, Europe and the Americas.</p>
          </div>

          <div className="feature-item">
            <div className="icon-wrapper">
              <img src="/path/to/exchange-data-icon.svg" alt="Exchange Data" className="icon" />
            </div>
            <h3>Exchange Data</h3>
            <p>Real-time and delayed exchange data from LME, CME, and SHFE.</p>
          </div>

          <div className="feature-item">
            <div className="icon-wrapper">
              <img src="/path/to/news-icon.svg" alt="News" className="icon" />
            </div>
            <h3>News</h3>
            <p>Receive email and app alerts on breaking scrap news, wherever you are.</p>
          </div>

          <div className="feature-item">
            <div className="icon-wrapper">
              <img src="/path/to/key-developments-icon.svg" alt="Key Developments" className="icon" />
            </div>
            <h3>Key Developments</h3>
            <p>In-depth analysis of key developments that impact your business.</p>
          </div>

          <div className="feature-item">
            <div className="icon-wrapper">
              <img src="/path/to/methodology-icon.svg" alt="Methodology" className="icon" />
            </div>
            <h3>Methodology</h3>
            <p>Independent, transparent and trusted methodology.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeBar;
