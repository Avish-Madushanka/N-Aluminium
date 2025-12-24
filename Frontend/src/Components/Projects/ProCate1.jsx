import React, { useState } from "react";
import "./ProCate1.css";

const ProCate1 = () => {
  const categories = [
    "All",
    "Windows",
    "Doors",
    "Pantry Cupboards",
    "Sivilims",
    "Others"
  ];

  const projects = [
    {
      category: "Windows",
      title: "Modern Urban Housing Project",
      location: "102.2 Sylhet, Bangladesh",
      date: "12-2024",
      coverImage:
        "https://i.pinimg.com/564x/30/27/ec/3027ecd92d36874cf5ee4a9b1a85a60d.jpg",
      galleryImages: [
        "https://rodo-group.com/wp-content/uploads/2024/04/Pirnar-alu-front-doors-optimum-8410-scaled.jpg",
        "https://images.squarespace-cdn.com/content/v1/5f647022efc1f85ee3544116/b008c749-31b4-4635-b09f-af20910fc841/PIC17-scaled.jpg"
      ]
    },
    {
      category: "Doors",
      title: "Downtown Office Tower Build",
      location: "102.2 Sylhet, Bangladesh",
      date: "12-2024",
      coverImage:
        "https://rodo-group.com/wp-content/uploads/2024/04/Pirnar-alu-front-doors-optimum-8410-scaled.jpg",
      galleryImages: [
        "https://i.pinimg.com/564x/30/27/ec/3027ecd92d36874cf5ee4a9b1a85a60d.jpg"
      ]
    },
    {
      category: "Slidings",
      title: "Green Valley Apartment Complex",
      location: "102.2 Sylhet, Bangladesh",
      date: "12-2024",
      coverImage:
        "https://images.squarespace-cdn.com/content/v1/5f647022efc1f85ee3544116/b008c749-31b4-4635-b09f-af20910fc841/PIC17-scaled.jpg",
      galleryImages: []
    },
    {
      category: "Sivilims",
      title: "test",
      location: "102.2 Sylhet, Bangladesh",
      date: "12-2025",
      coverImage:
        "https://srilankaconstruction.lk/wp-content/uploads/2020/08/13.jpeg",
      galleryImages: []
    },
    {
      category: "Sivilims",
      title: "test",
      location: "102.2 Sylhet, Bangladesh",
      date: "12-2025",
      coverImage:
        "https://srilankaconstruction.lk/wp-content/uploads/2020/08/13.jpeg",
      galleryImages: []
    }
  ];

  const [activeProject, setActiveProject] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter(p => p.category === activeCategory);

  return (
    <div className="Proj2-container">

      <div className="Proj2-header">
        <div className="Proj2-categories">
          {categories.map((cat, index) => (
            <button
              key={index}
              className={`Proj2-category-button ${
                cat === activeCategory ? "Proj2-active" : ""
              }`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="Proj2-projects-grid">
        {filteredProjects.map((project, index) => (
          <div key={index} className="Proj2-project-card">
            <img
              src={project.coverImage}
              alt={project.title}
              className="Proj2-project-image"
            />

            <div className="Proj2-project-details">
              <h3 className="Proj2-project-title">{project.title}</h3>

              <div className="Proj2-project-meta">
                <span>{project.location}</span>
                <span>{project.date}</span>
              </div>

              {project.galleryImages.length > 0 && (
                <button
                  className="Proj2-view-more"
                  onClick={() => setActiveProject(project)}
                >
                  View More →
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {activeProject && (
        <div
          className="Proj2-modal-overlay"
          onClick={() => setActiveProject(null)}
        >
          <div
            className="Proj2-modal"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="Proj2-close"
              onClick={() => setActiveProject(null)}
            >
              ✕
            </button>

            <h2 className="Proj2-modal-title">
              {activeProject.title}
            </h2>

            <div className="Proj2-modal-gallery">
              {activeProject.galleryImages.map((img, i) => (
                <img key={i} src={img} alt={`Gallery ${i}`} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProCate1;
