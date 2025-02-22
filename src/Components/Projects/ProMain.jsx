import React from 'react';
import './ProMain.css';

const ProjectCard = ({ imageUrl, title, description }) => {
  return (
    <div className="project-card">
      <img src={imageUrl} alt={title} className="project-image" />
      <div className="project-content">
        <h2 className="project-title">{title}</h2>
        <p className="project-description">{description}</p>
        <div className="project-buttons">
          <a href="#" className="button-1">Button 1</a>
          <a href="#" className="button-2">Button 2</a>
        </div>
      </div>
    </div>
  );
};

const ProMain = () => {
  const projectsData = [
    {
      imageUrl: "https://via.placeholder.com/400x250/3498db/fff",
      title: "Aluminum Door",
      description: "You can only see your pickup schedule if you are a current customer. You can only see your pickup schedule if you are a current customer.",
    },
    {
      imageUrl: "https://via.placeholder.com/400x250/e74c3c/fff",
      title: "Aluminum Door",
      description: "You can only see your pickup schedule if you are a current customer. You can only see your pickup schedule if you are a current customer.",
    },
    {
      imageUrl: "https://via.placeholder.com/400x250/2ecc71/fff",
      title: "Aluminum Door",
      description: "You can only see your pickup schedule if you are a current customer. You can only see your pickup schedule if you are a current customer.",
    },
    {
      imageUrl: "https://via.placeholder.com/400x250/f39c12/fff",
      title: "Aluminum Door",
      description: "You can only see your pickup schedule if you are a current customer. You can only see your pickup schedule if you are a current customer.",
    },
  ];

  return (
    <div className="projects-container">
      <h1 className="projects-title">Latest Projects</h1>
      <div className="top-bar">
        <input type="text" placeholder="Search" className="search-bar" />
        <select className="filter-dropdown">
          <option value="">Filter</option>
          <option value="category1">Category 1</option>
          <option value="category2">Category 2</option>
        </select>
        <button className="top-button">Button</button>
      </div>

      <div className="projects-grid">
        {projectsData.map((project, index) => (
          <ProjectCard
            key={index}
            imageUrl={project.imageUrl}
            title={project.title}
            description={project.description}
          />
        ))}
      </div>
    </div>
  );
};

export default ProMain;