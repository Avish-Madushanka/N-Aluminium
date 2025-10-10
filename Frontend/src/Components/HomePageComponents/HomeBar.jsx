import React from 'react';
import './HomeBar.css';

const HomeBar = () => {
  return (
    <div className="argus-scrap-markets">

      <section className="overview-section">
        <div className="overview-text">
          <h2>Overview</h2>
          <div className="p1">
            <p>
              Our MetaTrade platform is designed to transform the way aluminum is collected,
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
              directly to our community. By combining convenience, technology, and sustainability, our platform builds a connected
              ecosystem where aluminum is not just recycled but given a new purpose — helping reduce
              environmental impact while empowering communities and industries to benefit from a stronger,
              greener aluminum economy.
            </p>
          </div>
        </div>

        <div className="image-container">
          <div className="image-wrapper top-left">
            <img 
              src="https://www.spitfiredoors.co.uk/wp-content/uploads/2024/05/Bauhaus-internal-double-doors-SH-scaled-1.jpg" 
              alt="Aluminum Door" 
            />
          </div>
          <div className="image-wrapper bottom-right">
            <img 
              src="https://premier-metals.com.au/wp-content/uploads/2015/06/scrap-metal-recycling-perth.png" 
              alt="Scrap Recycling" 
            />
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="features-title">Key Features</h2>
        <div className="features-grid">

          <div className="feature-item">
            <div className="icon-wrapper">
              <img src="https://cdn-icons-png.flaticon.com/128/4212/4212257.png" alt="Scrap Pickup" className="icon" />
            </div>
            <h3>Aluminum Scrap Pickup</h3>
            <p>
              Users can schedule a convenient pickup for their aluminum scraps directly through the platform. 
              Our reliable collection team ensures timely service, helping households and businesses recycle with ease.
            </p>
          </div>

          <div className="feature-item">
            <div className="icon-wrapper">
              <img src="https://cdn-icons-png.flaticon.com/128/9748/9748078.png" alt="Marketplace" className="icon" />
            </div>
            <h3>Buy & Sell Marketplace</h3>
            <p>
              A digital marketplace that allows users to buy and sell reusable items. This promotes a circular economy 
              by giving pre-owned products a second life, reducing waste, and saving costs.
            </p>
          </div>

          <div className="feature-item">
            <div className="icon-wrapper">
              <img src="https://cdn-icons-png.flaticon.com/128/4091/4091120.png" alt="Scrap Value" className="icon" />
            </div>
            <h3>Real-Time Scrap Value</h3>
            <p>
              The system displays updated aluminum scrap prices based on current market trends. 
              Users can instantly estimate how much money they’ll earn from their collected scraps.
            </p>
          </div>

          <div className="feature-item">
            <div className="icon-wrapper">
              <img src="https://cdn-icons-png.flaticon.com/128/1483/1483285.png" alt="Map Integration" className="icon" />
            </div>
            <h3>Interactive Map Integration</h3>
            <p>
              A live map feature shows available pickup zones, service areas, and routes. 
              Users can track collection status and view location-based services visually.
            </p>
          </div>

          <div className="feature-item">
            <div className="icon-wrapper">
              <img src="https://cdn-icons-png.flaticon.com/128/2950/2950678.png" alt="Notifications" className="icon" />
            </div>
            <h3>Notifications & Alerts</h3>
            <p>
              Automated alerts via email or platform notifications keep users informed about pickups, 
              payments, offers, and important updates, ensuring smooth communication.
            </p>
          </div>

          <div className="feature-item">
            <div className="icon-wrapper">
              <img src="https://cdn-icons-png.flaticon.com/128/7994/7994537.png" alt="Eco-Friendly" className="icon" />
            </div>
            <h3>Eco-Friendly Impact</h3>
            <p>
              Every feature supports sustainability by reducing landfill waste, encouraging reuse, and lowering carbon emissions. 
              The platform helps communities actively contribute to a greener future.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
};

export default HomeBar;
