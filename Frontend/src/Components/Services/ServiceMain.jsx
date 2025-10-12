import React from 'react';
import './ServiceMain.css';

function ServiceMain() {
   const items = [
    {
    img: "https://www.rcmscrapmetal.com/images/blog/1718919338blog-24-06-20.jpg",
    link: "/eco-friendly",
    title: "Eco-Friendly Waste Disposal",
  },
  {
    img: "https://images.pexels.com/photos/4682452/pexels-photo-4682452.jpeg",
    link: "/community-cleanup",
    title: "Community Cleanup Drives",
  },
  {
    img: "https://images.pexels.com/photos/3735212/pexels-photo-3735212.jpeg",
    link: "/eco-friendly",
    title: "Eco-Friendly Waste Disposal",
  },
  {
    img: "https://images.pexels.com/photos/4682452/pexels-photo-4682452.jpeg",
    link: "/community-cleanup",
    title: "Community Cleanup Drives",
  },
  {
    img: "https://images.pexels.com/photos/3735212/pexels-photo-3735212.jpeg",
    link: "/eco-friendly",
    title: "Eco-Friendly Waste Disposal",
  },
  {
    img: "https://images.pexels.com/photos/4682452/pexels-photo-4682452.jpeg",
    link: "/community-cleanup",
    title: "Community Cleanup Drives",
  },

  ];

  return (
    <div className="Ser-App12">
      <div className="Ser-container">
        <div className="Ser-hero-section">
          <div className="Ser-overlay"></div>
          <div className="Ser-hero-content">
            <h1 className="Ser-hero-title">Our Services </h1>
          </div>
          <div className="Ser-wave-divider"></div>
        </div>
      </div>

      <main>
      <div className="Ser-gallery-container">
          <h2 className="Ser-gallery-title">What Makes Us Stand Out From the Rest & Plan Secure for Future</h2>
            <div className="Ser-gallery-grid">
              {items.map((item, index) => (
           <div key={index} className="Ser-gallery-item">
               <img
                  src={item.img}
                  alt={`Gallery ${index + 1}`}
                  className="Ser-gallery-image"
              />
          <div className="Ser-gallery-overlay">
            <h3 className="Ser-gallery-overlay-title">{item.title}</h3>
            <div className="Ser-gallery-icons">
              <a href={item.img} target="_blank" rel="noopener noreferrer" className="Ser-icon">
                <i className="fas fa-search-plus"></i>
              </a>
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="Ser-icon">
                <i className="fas fa-link"></i>
              </a>
            </div>
            </div>
          </div>
          ))}
          </div>
      </div>
      </main>
    </div>
  );
}

export default ServiceMain;
