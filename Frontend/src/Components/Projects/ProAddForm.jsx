

import React, { useState, useEffect, useRef } from 'react';
import './ProAddForm.css';
import axiosInstance from '../../api/axiosInstance'; // Adjusted path
import API_ENDPOINTS from '../../apiConfig'; // Adjusted path

const ProAddForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectType, setProjectType] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleFileInputAreaClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const newTotalFiles = selectedFiles.length + files.length;
    if (newTotalFiles > 10) {
      setMessage({ type: 'error', text: 'You can upload a maximum of 10 images.' });
      return;
    }

    setSelectedFiles(prevFiles => [...prevFiles, ...files]);

    const newPreviewsPromises = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve({ file, previewUrl: reader.result });
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newPreviewsPromises)
      .then(newGeneratedPreviewsData => {
        setImagePreviews(prevPreviews => [...prevPreviews, ...newGeneratedPreviewsData.map(d => d.previewUrl)]);
      })
      .catch(error => {
        console.error("Error generating image previews:", error);
        setMessage({ type: 'error', text: 'Error generating image previews.' });
      });

    event.target.value = null;
  };

  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    setImagePreviews(prevPreviews => prevPreviews.filter((_, index) => index !== indexToRemove));
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setProjectType('');
    setSelectedFiles([]);
    setImagePreviews([]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    if (!title.trim() || !description.trim() || !projectType) {
      setMessage({ type: 'error', text: 'Please fill in all text fields.' });
      setIsLoading(false);
      return;
    }

    if (selectedFiles.length === 0) {
      setMessage({ type: 'error', text: 'Please upload at least one image.' });
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('projectType', projectType);
    selectedFiles.forEach(file => {
      formData.append('projectImages', file); // Matches backend multer field name
    });

    // No need to manually get token, axiosInstance interceptor handles it.
    // const token = localStorage.getItem('authToken');
    // if (!token) {
    //     setMessage({ type: 'error', text: 'Authentication token not found. Please log in.' });
    //     setIsLoading(false);
    //     return;
    // }

    try {
      // API_ENDPOINTS.PROJECTS.CREATE should be '/projects' if your backend is at /api/projects
      // Ensure API_ENDPOINTS has this:
      // PROJECTS: { CREATE: '/projects' }
      const response = await axiosInstance.post(API_ENDPOINTS.PROJECTS.CREATE, formData, {
        // Axios automatically sets Content-Type for FormData
        // headers: { 'Content-Type': 'multipart/form-data' } // Not needed
      });

      const result = response.data; // Axios puts response data in `data`

      if (result.success) { // Assuming your backend returns { success: true, ... }
        setMessage({ type: 'success', text: result.message || 'Project added successfully!' });
        resetForm();
      } else {
        // This else block might not be hit if backend errors are > 400,
        // as Axios throws an error for non-2xx responses by default.
        // The catch block will handle those.
        setMessage({ type: 'error', text: result.message || 'Failed to add project. Please try again.' });
      }
    } catch (error) {
      console.error('Submission error:', error);
      if (error.response && error.response.data) {
        // Error from backend (e.g., validation, server error)
        setMessage({ type: 'error', text: error.response.data.message || 'An error occurred while submitting the project.' });
      } else if (error.request) {
        // Network error (no response received)
        setMessage({ type: 'error', text: 'Network error. Please check your connection and try again.' });
      } else {
        // Other errors (e.g., setting up the request)
        setMessage({ type: 'error', text: `An error occurred: ${error.message || 'Unknown error'}` });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-projects-container">
      <h1 className="add-projects-title">Add New Project</h1>

      {message.text && (
        <div className={`message message-${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="project-form">
        <div className="form-group">
          <label htmlFor="title">Project Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., E-commerce Platform Redesign"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Project Description</label>
          <textarea
            id="description"
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Briefly describe your project..."
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="projectType">Project Type</label>
          <select
            id="projectType"
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
            required
          >
            <option value="">Select Type</option>
            <option value="web">Web Development</option>
            <option value="mobile">Mobile App Development</option>
            <option value="design">UI/UX Design</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="upload-photos-trigger">Project Images (Max 10)</label>
          <div
            id="upload-photos-trigger"
            className="file-input-area"
            onClick={handleFileInputAreaClick}
            onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') handleFileInputAreaClick(); }}
            tabIndex={0}
            role="button"
            aria-label="Upload project images"
          >
            <p>Drag & drop files here, or <strong>click to browse</strong>.</p>
            <p style={{ fontSize: '0.8em', marginTop: '5px' }}>Supports JPG, PNG, GIF. Max 10MB per file.</p>
          </div>
          <input
            type="file"
            id="upload-photos"
            ref={fileInputRef}
            multiple
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>

        {imagePreviews.length > 0 && (
          <div className="image-previews-container">
            <h3 className="previews-title">Image Previews ({imagePreviews.length}/10)</h3>
            <div className="previews-grid">
              {imagePreviews.map((previewUrl, index) => (
                <div key={index} className="preview-item">
                  <img src={previewUrl} alt={`Preview ${index + 1}`} className="preview-image" />
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="remove-file-button"
                    title="Remove image"
                    aria-label={`Remove image ${index + 1}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Add Project'}
        </button>
      </form>
    </div>
  );
};

export default ProAddForm;
