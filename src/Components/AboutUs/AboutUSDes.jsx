import React from 'react';
import '../AboutUs/AboutUsDes.css'; 

function AboutUsDes() {
  return (
    <div>
      {/*  Browser Tabs/Address Bar (Placeholder) */}
      <div className="browser-bar-placeholder">
        [Browser Tabs and Address Bar Placeholder]
      </div>

      {/* Website Header */}
      <header>
        <div>
          {/* Replace with your actual logo */}
          <img src={logo} alt="Global Waste Cleaning Network" className="logo" />
          <nav>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">About +</a></li>
              <li><a href="#">Members +</a></li>
              <li><a href="#">ENRC +</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Contact +</a></li>
              <li><a href="#" className="global-link">Global</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <div>
          <section>
            <h2>Our Environment, Our Future</h2>
            <h3>Help Us Reduce Environmental Pollution</h3>
            <p>GWCN plays a vital role in the growing worldwide movement to reduce
              the impact of Environmental pollution on society via advocacy and the
              implementation of evidence-based programs to reduce pollution in
              Oceans, Coastlines, Lands and the Atmosphere.</p>
            <p>The purpose of the Global Waste Cleaning Network is to support
              environmental activities, showcase and connect the network
              members, contribute to environmental debates, foster environmental
              research, and spread environment related information.</p>
          </section>
        </div>

        <div>
          {/* Image Area */}
          <img src={landfillImage} alt="Landfill" />
          <img src={beachCleanupImage} alt="Beach Cleanup" />
        </div>
      </main>

      {/* Translate Button */}
      <div className="translate-button">
        <button>
          Translate »
        </button>
      </div>
    </div>
  );
}

export default AboutUsDes;