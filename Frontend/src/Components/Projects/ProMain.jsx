
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import { ClipLoader } from 'react-spinners'; 
import './ProMain.css';
import axiosInstance from '../../api/axiosInstance'; 
import API_ENDPOINTS from '../../apiConfig'; 
import { useAuth } from '../../context/AuthContext'; 

const ImageSlider = ({ images, onClose, backendUrl }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    if (!images || images.length === 0) {
        return (
             <div className="image-slider-container">
                <button className="close-button" onClick={onClose} aria-label="Close slider">×</button>
                <p>No additional images available.</p>
            </div>
        );
    }

    return (
        <div className="image-slider-container">
            <button className="close-button" onClick={onClose} aria-label="Close slider">×</button>
            <div className="image-slider">
                <button className="slider-button prev" onClick={handlePrev} aria-label="Previous image">‹</button>
                <img 
                    src={`${backendUrl}${images[currentIndex]}`} 
                    alt={`Project view ${currentIndex + 1}`} 
                    className="slider-image" 
                />
                <button className="slider-button next" onClick={handleNext} aria-label="Next image">›</button>
            </div>
            <div className="slider-dots">
                {images.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
};

const ProjectCard = ({ project, backendUrl }) => {
    const [showSlider, setShowSlider] = useState(false);

    const handleViewMore = () => {
        setShowSlider(true);
    };

    const handleCloseSlider = () => {
        setShowSlider(false);
    };

    const mainImageUrl = project.images && project.images.length > 0 
        ? `${backendUrl}${project.images[0]}`
        : "https://via.placeholder.com/300x200?text=No+Image";

    return (
        <div className="project-card">
            <img src={mainImageUrl} alt={project.title} className="project-image" />
            <div className="project-content">
                <h2 className="project-title">{project.title}</h2>
                <p className="project-type-badge">{project.projectType?.toUpperCase()}</p>
                <p className="project-description">{project.description.substring(0, 120)}{project.description.length > 120 ? "..." : ""}</p>
                <div className="project-buttons">
                    <button className="button-1" onClick={handleViewMore} disabled={!project.images || project.images.length <= 1}>
                        View More Photos
                    </button>
                    <Link to="/ContactUs" className="button-2">Contact Us</Link>
                </div>
            </div>
            {showSlider && (
                <div className="slider-overlay" onClick={handleCloseSlider}>
                    <div className="slider-content-wrapper" onClick={(e) => e.stopPropagation()}>
                        <ImageSlider images={project.images || []} onClose={handleCloseSlider} backendUrl={backendUrl} />
                    </div>
                </div>
            )}
        </div>
    );
};

const ProMain = () => {
    const [projectsData, setProjectsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const { userInfo, isLoggedIn } = useAuth();

    const backendUrlForImages = `${API_ENDPOINTS.BACKEND_ROOT_URL}/uploads`; 

    useEffect(() => {
        const fetchProjects = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axiosInstance.get(API_ENDPOINTS.PROJECTS.GET_ALL);
                if (response.data.success) {
                    setProjectsData(response.data.data);
                } else {
                    setError(response.data.message || "Failed to fetch projects.");
                }
            } catch (err) {
                console.error("Error fetching projects:", err);
                setError(err.response?.data?.message || err.message || "An error occurred while fetching projects.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const filteredProjects = projectsData
        .filter(project => 
            project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter(project => 
            filterType ? project.projectType === filterType : true
        );
    
    const projectTypes = ["web", "mobile", "design", "other"]; 

    const canAddProjects = isLoggedIn && userInfo && (userInfo.role === 'admin' || userInfo.role === 'businessOwner');

    return (
        <div className="projects-container">
            <h1 className="projects-title">Our Latest Projects</h1>
            <div className="top-bar">
                <input 
                    type="text" 
                    placeholder="Search projects..." 
                    className="search-bar" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select 
                    className="filter-dropdown"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option value="">All Types</option>
                    {projectTypes.map(type => (
                        <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                    ))}
                </select>
                {canAddProjects && (
                    <Link to="/ProAddForm" className="top-button">Add New Project</Link>
                )}
            </div>

            {isLoading && (
                <div className="loading-container">
                    <ClipLoader size={50} color={"#fff"} />
                    <p>Loading Projects...</p>
                </div>
            )}
            {error && (
                <div className="error-container">
                    <p>Error: {error}</p>
                </div>
            )}
            {!isLoading && !error && filteredProjects.length === 0 && (
                <div className="no-projects-container">
                    <p>No projects found matching your criteria.</p>
                </div>
            )}

            {!isLoading && !error && filteredProjects.length > 0 && (
                <div className="projects-grid">
                    {filteredProjects.map((project) => (
                        <ProjectCard
                            key={project._id} 
                            project={project}
                            backendUrl={backendUrlForImages}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProMain;
