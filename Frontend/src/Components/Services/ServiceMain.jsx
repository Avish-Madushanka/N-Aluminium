import React from 'react';
import './ServiceMain.css';

function ServiceMain() {
   const items = [
    {
      img: "https://images.pexels.com/photos/3735212/pexels-photo-3735212.jpeg",
      link: "/recycling-tips",
    },
    {
      img: "https://images.pexels.com/photos/4682452/pexels-photo-4682452.jpeg",
      link: "/community-cleanup",
    },
    {
      img: "https://images.pexels.com/photos/1300977/pexels-photo-1300977.jpeg",
      link: "/waste-management",
    },
    {
      img: "https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg",
      link: "/volunteer-program",
    },
    {
      img: "https://images.pexels.com/photos/4167541/pexels-photo-4167541.jpeg",
      link: "/sanitation-safety",
    },
    {
      img: "https://images.pexels.com/photos/1302189/pexels-photo-1302189.jpeg",
      link: "/collection-services",
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
          <h2 className="Ser-gallery-title">Rest & Plan Secure for Future</h2>
          <div className="Ser-gallery-grid">
            {items.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className="Ser-gallery-item"
                target="_blank"
                rel="noopener noreferrer">
                <img
                  src={item.img}
                  alt={`Gallery ${index + 1}`}
                  className="Ser-gallery-image"
                />
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ServiceMain;
