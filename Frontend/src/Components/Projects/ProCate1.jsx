import React from 'react';
import './ProCate1.css'; 

const ProCate1 = () => {
  const categories = ["All", "Aviation", "Building", "Commercial", "Electrical", "Energy", "Residential", "Stadium"];

  const projects = [
    {
      image: "https://i.pinimg.com/564x/30/27/ec/3027ecd92d36874cf5ee4a9b1a85a60d.jpg", 
      title: "Modern Urban Housing Project",
      description: "A sleek residential development featuring sustainable design, smart layouts.",
      location: "102.2 Sylhet, Bangladesh",
      date: "12-2024 / 4-2025"
    },
    {
      image: "https://rodo-group.com/wp-content/uploads/2024/04/Pirnar-alu-front-doors-optimum-8410-scaled.jpg",
      title: "Downtown Office Tower Build",
      description: "A high-rise commercial tower designed for modern businesses, with efficient space planning.",
      location: "102.2 Sylhet, Bangladesh",
      date: "12-2024 / 4-2025"
    },
    {
      image: "https://images.squarespace-cdn.com/content/v1/5f647022efc1f85ee3544116/b008c749-31b4-4635-b09f-af20910fc841/PIC17-scaled.jpg",
      title: "Coastal Bridge Expansion Project",
      description: "An advanced infrastructure project focused on enhancing regional connectivity through durable engineering.",
      location: "102.2 Sylhet, Bangladesh",
      date: "12-2024 / 4-2025"
    },
    {
      image: "https://i.pinimg.com/564x/30/27/ec/3027ecd92d36874cf5ee4a9b1a85a60d.jpg",
      title: "Green Valley Apartment Complex",
      description: "A modern residential development featuring eco-friendly design, premium amenities, and smart home integration.",
      location: "102.2 Sylhet, Bangladesh",
      date: "12-2024 / 4-2025"
    },
    {
      image: "https://rodo-group.com/wp-content/uploads/2024/04/Pirnar-alu-front-doors-optimum-8410-scaled.jpg",
      title: "Skyline Commercial Office Tower",
      description: "A high-rise office space built for productivity and energy efficiency in a bustling business district.",
      location: "102.2 Sylhet, Bangladesh",
      date: "12-2024 / 4-2025"
    },
    {
      image: "https://images.squarespace-cdn.com/content/v1/5f647022efc1f85ee3544116/b008c749-31b4-4635-b09f-af20910fc841/PIC17-scaled.jpg",
      title: "Heritage Urban Retail Plaza",
      description: "An open-concept commercial plaza blending contemporary architecture with pedestrian-friendly layout.",
      location: "102.2 Sylhet, Bangladesh",
      date: "12-2024 / 4-2025"
    }
  ];

  return (
    <div className="Proj2-container">
      <div className="Proj2-header">
        <div className="Proj2-categories">
          {categories.map((category, index) => (
            <button key={index} className={`Proj2-category-button ${category === "All" ? "Proj2-active" : ""}`}>
              {category}
            </button>
          ))}
        </div>
        <div className="Proj2-search-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-search">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>
      <div className="Proj2-projects-grid">
        {projects.map((project, index) => (
          <div key={index} className="Proj2-project-card">
            <img src={project.image} alt={project.title} className="Proj2-project-image" />
            <div className="Proj2-project-details">
              <h3 className="Proj2-project-title">{project.title}</h3>
              <p className="Proj2-project-description">{project.description}</p>
              <div className="Proj2-project-meta">
                <div className="Proj2-meta-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-map-pin">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>{project.location}</span>
                </div>
                <div className="Proj2-meta-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>{project.date}</span>
                </div>
              </div>
              <a href="#" className="Proj2-view-more">View More →</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProCate1;
