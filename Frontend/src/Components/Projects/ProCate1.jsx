import React, { useState, useEffect } from "react";
import "./ProCate1.css";
import axiosInstance from '../../api/axiosInstance';
import API_ENDPOINTS from '../../apiConfig';

const ProCate1 = () => {
  const categories = [
    "All",
    "Windows",
    "Doors",
    "Pantry Cupboards",
    "Sivilims",
    "Others"
  ];

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProjects();
  }, [activeCategory]);

  const fetchProjects = async () => {
    setLoading(true);
    setError("");
    
    try {
      let url;
      if (activeCategory === "All") {
        url = `${API_ENDPOINTS.API_ROOT}${API_ENDPOINTS.PROJECTS.GET_ALL}`;
      } else {
        url = `${API_ENDPOINTS.API_ROOT}${API_ENDPOINTS.PROJECTS.GET_BY_CATEGORY}/${activeCategory}`;
      }
      
      const response = await axiosInstance.get(url);
      
      if (response.data.success) {
        setProjects(response.data.data || []);
      } else {
        setError("Failed to load projects");
        setProjects([]);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError(err.response?.data?.message || "Failed to load projects. Please try again.");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryFromProjectType = (projectType) => {
    const categoryMap = {
      'Aluminum Doors': 'Doors',
      'Aluminum Windows': 'Windows',
      'Full House Aluminum': 'Windows',
      'Curtain Walls': 'Others',
      'Facade Systems': 'Others',
      'Skylights': 'Others',
      'Structural Glazing': 'Sivilims',
      'Other': 'Others'
    };
    return categoryMap[projectType] || 'Others';
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date not specified";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Date not specified";
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    } catch (error) {
      return "Date not specified";
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    const baseUrl = API_ENDPOINTS.BACKEND_ROOT_URL;
    return `${baseUrl}${imagePath}`;
  };

  if (loading) {
    return (
      <div className="Proj2-container">
        <div className="Proj2-loading">
          <div className="Proj2-spinner"></div>
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="Proj2-container">
        <div className="Proj2-error">
          <p>{error}</p>
          <button onClick={fetchProjects} className="Proj2-retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

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

      {projects.length === 0 ? (
        <div className="Proj2-no-projects">
          <p>No projects found in this category.</p>
        </div>
      ) : (
        <div className="Proj2-projects-grid">
          {projects.map((project) => {
            const coverImageUrl = getImageUrl(project.coverImage);
            const galleryImages = project.galleryImages || [];
            
            return (
              <div key={project._id || project.id} className="Proj2-project-card">
                <div className="Proj2-image-wrapper">
                  {coverImageUrl ? (
                    <img
                      src={coverImageUrl}
                      alt={project.title || "Project"}
                      className="Proj2-project-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="Proj2-placeholder-image">No Image</div>
                  )}
                  <span className="Proj2-category-badge">
                    {getCategoryFromProjectType(project.projectType)}
                  </span>
                  {project.featured && (
                    <span className="Proj2-featured-badge">Featured</span>
                  )}
                </div>

                <div className="Proj2-project-details">
                  <h3 className="Proj2-project-title">{project.title || "Untitled Project"}</h3>
                  <p className="Proj2-project-description">
                    {(project.description || "").length > 120 
                      ? (project.description || "").substring(0, 120) + '...' 
                      : project.description || "No description available"}
                  </p>
                  
                  <div className="Proj2-project-meta">
                    <div className="Proj2-meta-item">
                      <svg className="Proj2-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                        <circle cx="12" cy="9" r="2.5" />
                      </svg>
                      <span>{project.location || "Location not specified"}</span>
                    </div>
                    <div className="Proj2-meta-item">
                      <svg className="Proj2-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span>{formatDate(project.projectDate)}</span>
                    </div>
                  </div>

                  <button
                    className="Proj2-view-more"
                    onClick={() => setSelectedProject(project)}
                  >
                    View Project Details →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedProject && (
        <div
          className="Proj2-modal-overlay"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="Proj2-modal"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="Proj2-close"
              onClick={() => setSelectedProject(null)}
            >
              ✕
            </button>

            <div className="Proj2-modal-content">
              <div className="Proj2-modal-header">
                <h2 className="Proj2-modal-title">{selectedProject.title || "Untitled Project"}</h2>
                <span className="Proj2-modal-category">
                  {getCategoryFromProjectType(selectedProject.projectType)}
                </span>
              </div>

              <div className="Proj2-modal-info">
                <div className="Proj2-modal-location">
                  <svg className="Proj2-modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                  <span>{selectedProject.location || "Location not specified"}</span>
                </div>
                <div className="Proj2-modal-date">
                  <svg className="Proj2-modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>{formatDate(selectedProject.projectDate)}</span>
                </div>
              </div>

              <p className="Proj2-modal-description">
                {selectedProject.description || "No description available"}
              </p>

              <div className="Proj2-modal-gallery-section">
                <h3 className="Proj2-gallery-title">Project Gallery</h3>
                <div className="Proj2-modal-gallery">
                  {(selectedProject.galleryImages || []).map((img, i) => {
                    const imageUrl = getImageUrl(img);
                    return (
                      <div key={i} className="Proj2-gallery-item">
                        {imageUrl ? (
                          <img 
                            src={imageUrl} 
                            alt={`${selectedProject.title || "Project"} - ${i + 1}`}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
                            }}
                          />
                        ) : (
                          <div className="Proj2-placeholder-image">Image Not Available</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProCate1;