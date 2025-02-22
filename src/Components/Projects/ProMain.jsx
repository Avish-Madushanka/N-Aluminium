import React, { useState } from 'react';
import './ProMain.css';

const ImageSlider = ({ images, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <div className="image-slider-container">
            <button className="close-button" onClick={onClose}>×</button>
            <div className="image-slider">
                <button className="slider-button prev" onClick={handlePrev}></button>
                <img src={images[currentIndex]} alt={`Image ${currentIndex + 1}`} className="slider-image" />
                <button className="slider-button next" onClick={handleNext}></button>
            </div>
        </div>
    );
};

const ProjectCard = ({ imageUrl, title, description, moreImages }) => {
    const [showSlider, setShowSlider] = useState(false);

    const handleViewMore = () => {
        setShowSlider(true);
    };

    const handleCloseSlider = () => {
        setShowSlider(false);
    };

    return (
        <div className="project-card">
            <img src={imageUrl} alt={title} className="project-image" />
            <div className="project-content">
                <h2 className="project-title">{title}</h2>
                <p className="project-description">{description}</p>
                <div className="project-buttons">
                    <button className="button-1" onClick={handleViewMore}>View More Photos</button>
                    <a href="#" className="button-2">Contact US</a>
                </div>
            </div>
            {showSlider && (
                <div className="slider-overlay">
                    <ImageSlider images={moreImages} onClose={handleCloseSlider} />
                </div>
            )}
        </div>
    );
};

const ProMain = () => {
    const projectsData = [
        {
            imageUrl: "https://www.akamai.com/site/im-demo/perceptual-standard.jpg?imbypass=true",
            title: "Aluminum Door",
            description: "You can only see your pickup schedule if you are a current customer. You can only see your pickup schedule if you are a current customer.",
            moreImages: [
                "https://via.placeholder.com/400x300/3498db/fff",
                "https://via.placeholder.com/400x300/e74c3c/fff",
                "https://via.placeholder.com/400x300/2ecc71/fff",
                "https://via.placeholder.com/400x300/f39c12/fff",
                "https://via.placeholder.com/400x300/9b59b6/fff",
                "https://via.placeholder.com/400x300/1abc9c/fff"
            ]
        },
        {
            imageUrl: "https://www.akamai.com/site/im-demo/perceptual-standard.jpg?imbypass=true",
            title: "Aluminum Door",
            description: "You can only see your pickup schedule if you are a current customer. You can only see your pickup schedule if you are a current customer.",
            moreImages: [
                "https://via.placeholder.com/400x300/3498db/fff",
                "https://via.placeholder.com/400x300/e74c3c/fff",
                "https://via.placeholder.com/400x300/2ecc71/fff",
                "https://via.placeholder.com/400x300/f39c12/fff",
                "https://via.placeholder.com/400x300/9b59b6/fff",
                "https://via.placeholder.com/400x300/1abc9c/fff"
            ]
        },
        {
            imageUrl: "https://www.akamai.com/site/im-demo/perceptual-standard.jpg?imbypass=true",
            title: "Aluminum Door",
            description: "You can only see your pickup schedule if you are a current customer. You can only see your pickup schedule if you are a current customer.",
            moreImages: [
                "https://via.placeholder.com/400x300/3498db/fff",
                "https://via.placeholder.com/400x300/e74c3c/fff",
                "https://via.placeholder.com/400x300/2ecc71/fff",
                "https://via.placeholder.com/400x300/f39c12/fff",
                "https://via.placeholder.com/400x300/9b59b6/fff",
                "https://via.placeholder.com/400x300/1abc9c/fff"
            ]
        },
        {
            imageUrl: "https://www.akamai.com/site/im-demo/perceptual-standard.jpg?imbypass=true",
            title: "Aluminum Door",
            description: "You can only see your pickup schedule if you are a current customer. You can only see your pickup schedule if you are a current customer.",
            moreImages: [
                "https://via.placeholder.com/400x300/3498db/fff",
                "https://via.placeholder.com/400x300/e74c3c/fff",
                "https://via.placeholder.com/400x300/2ecc71/fff",
                "https://via.placeholder.com/400x300/f39c12/fff",
                "https://via.placeholder.com/400x300/9b59b6/fff",
                "https://via.placeholder.com/400x300/1abc9c/fff"
            ]
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
                <a href="/ProAddForm" className="top-button">Add Projects</a>
            </div>

            <div className="projects-grid">
                {projectsData.map((project, index) => (
                    <ProjectCard
                        key={index}
                        imageUrl={project.imageUrl}
                        title={project.title}
                        description={project.description}
                        moreImages={project.moreImages}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProMain;