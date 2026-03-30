import React, { useState, useRef } from 'react';
import './ProAddForm.css';
import axiosInstance from '../../api/axiosInstance';
import API_ENDPOINTS from '../../apiConfig';

const ProAddForm = ({ onAddProject, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectType: '',
    location: '',
    projectDate: '',
    featured: false
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [coverImageIndex, setCoverImageIndex] = useState(0);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [apiError, setApiError] = useState('');
  const fileInputRef = useRef(null);

  const projectTypes = [
    { id: 'aluminum-doors', name: 'Aluminum Doors' },
    { id: 'aluminum-windows', name: 'Aluminum Windows' },
    { id: 'aluminum-pantry-cupboards', name: 'Aluminum Pantry Cupboards' },
    { id: 'sivilims', name: 'Sivilims' },
    { id: 'other', name: 'Other' }
  ];

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      projectType: '',
      location: '',
      projectDate: '',
      featured: false
    });
    setSelectedFiles([]);
    setImagePreviews([]);
    setCoverImageIndex(0);
    setErrors({});
    setTouched({});
    setApiError('');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleFileInputAreaClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const newTotalFiles = selectedFiles.length + files.length;
    if (newTotalFiles > 10) {
      setApiError('You can upload a maximum of 10 images.');
      return;
    }

    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024;
      if (!isValidType) {
        setApiError(`${file.name}: Only JPG, PNG, WEBP images are allowed.`);
        return false;
      }
      if (!isValidSize) {
        setApiError(`${file.name}: File size must be less than 10MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setSelectedFiles(prevFiles => [...prevFiles, ...validFiles]);

    const newPreviewsPromises = validFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve({ file, previewUrl: reader.result });
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newPreviewsPromises)
      .then(newGeneratedPreviewsData => {
        const newPreviews = newGeneratedPreviewsData.map(d => d.previewUrl);
        setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
        
        if (selectedFiles.length === 0 && coverImageIndex === 0) {
          setCoverImageIndex(0);
        }
        
        if (errors.images) {
          setErrors(prev => ({ ...prev, images: null }));
        }
        setApiError('');
      })
      .catch(error => {
        console.error("Error generating image previews:", error);
        setApiError('Error generating image previews.');
      });

    event.target.value = null;
  };

  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    setImagePreviews(prevPreviews => prevPreviews.filter((_, index) => index !== indexToRemove));
    
    if (coverImageIndex === indexToRemove) {
      setCoverImageIndex(0);
    } else if (coverImageIndex > indexToRemove) {
      setCoverImageIndex(coverImageIndex - 1);
    }
  };

  const setAsCoverImage = (index) => {
    setCoverImageIndex(index);
    setSuccessMessage('Cover image updated successfully!');
    setTimeout(() => {
      setSuccessMessage('');
    }, 2000);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title?.trim()) {
      newErrors.title = 'Project title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Project title must be at least 3 characters';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'Project title must be less than 100 characters';
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = 'Project description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (formData.description.trim().length > 2000) {
      newErrors.description = 'Description must be less than 2000 characters';
    }
    
    if (!formData.projectType) {
      newErrors.projectType = 'Project type is required';
    } else {
      const validTypes = ['Aluminum Doors', 'Aluminum Windows', 'Aluminum Pantry Cupboards', 'Sivilims', 'Other'];
      if (!validTypes.includes(formData.projectType)) {
        newErrors.projectType = 'Please select a valid project type';
      }
    }
    
    if (formData.location && formData.location.trim().length > 200) {
      newErrors.location = 'Location must be less than 200 characters';
    }
    
    if (selectedFiles.length === 0) {
      newErrors.images = 'At least one project image is required';
    } else if (selectedFiles.length > 10) {
      newErrors.images = 'Maximum 10 images allowed';
    }
    
    selectedFiles.forEach((file, index) => {
      if (file.size > 10 * 1024 * 1024) {
        newErrors[`image_${index}`] = `Image ${index + 1} exceeds 10MB limit`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setApiError('');
    
    if (!validateForm()) {
      const allTouched = {};
      Object.keys(formData).forEach(key => {
        allTouched[key] = true;
      });
      setTouched(allTouched);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('title', formData.title.trim());
      uploadFormData.append('description', formData.description.trim());
      uploadFormData.append('projectType', formData.projectType);
      uploadFormData.append('location', formData.location.trim());
      uploadFormData.append('projectDate', formData.projectDate);
      uploadFormData.append('featured', formData.featured);
      uploadFormData.append('coverImageIndex', coverImageIndex);
      
      selectedFiles.forEach((file) => {
        uploadFormData.append('projectImages', file);
      });
      
      const response = await axiosInstance.post(API_ENDPOINTS.PROJECTS.CREATE, uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const result = response.data;
      
      if (result.success) {
        setSuccessMessage(`✅ "${formData.title}" has been added successfully!`);
        setShowSuccess(true);
        
        if (onAddProject) {
          onAddProject(result.data);
        }
        
        resetForm();
        
        setTimeout(() => {
          setShowSuccess(false);
          setSuccessMessage('');
        }, 3000);
      } else {
        setApiError(result.message || 'Failed to add project');
      }
      
    } catch (error) {
      console.error('Submission error:', error);
      if (error.response && error.response.data) {
        setApiError(error.response.data.message || 'An error occurred while submitting the project.');
      } else if (error.request) {
        setApiError('Network error. Please check your connection and try again.');
      } else {
        setApiError(`An error occurred: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAnother = () => {
    resetForm();
    setShowSuccess(false);
  };

  return (
    <div className="PROADD-page">
      <div className="PROADD-header">
        <h2 className="PROADD-title">Add New Aluminum Project</h2>
        <button type="button" className="PROADD-close" onClick={onClose}>×</button>
      </div>

      {showSuccess && (
        <div className="PROADD-success-message">
          <div className="PROADD-success-content">
            <span className="PROADD-success-icon">✓</span>
            <span className="PROADD-success-text">{successMessage}</span>
          </div>
          <button type="button" className="PROADD-success-close" onClick={() => setShowSuccess(false)}>×</button>
        </div>
      )}

      {apiError && (
        <div className="PROADD-error-message">
          <div className="PROADD-error-content">
            <span className="PROADD-error-icon">!</span>
            <span>{apiError}</span>
          </div>
          <button type="button" className="PROADD-error-close" onClick={() => setApiError('')}>×</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="PROADD-form">
        <div className="PROADD-twoColumn">
          <div className="PROADD-leftColumn">
            <div className="PROADD-card">
              <h3 className="PROADD-sectionTitle">Project Images</h3>
              <div className="PROADD-imageUpload">
                <div
                  className="PROADD-uploadArea"
                  onClick={handleFileInputAreaClick}
                  onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') handleFileInputAreaClick(); }}
                  tabIndex={0}
                  role="button"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <div className="PROADD-uploadPlaceholder">
                    <span className="PROADD-uploadIcon">+</span>
                    <span>Click to upload images</span>
                    <span className="PROADD-uploadHint">JPG, PNG, WEBP up to 10MB each (Max 10 images)</span>
                  </div>
                </div>
              </div>
              {errors.images && <div className="PROADD-error">{errors.images}</div>}
              
              {imagePreviews.length > 0 && (
                <div className="PROADD-imageGallery">
                  <div className="PROADD-coverSelection">
                    <p className="PROADD-coverLabel">Main Display Image:</p>
                    <div className="PROADD-coverPreview">
                      {imagePreviews[coverImageIndex] && (
                        <img src={imagePreviews[coverImageIndex]} alt="Cover" />
                      )}
                      <span className="PROADD-coverBadge">Main Image</span>
                    </div>
                    <p className="PROADD-coverHint">This image will be displayed as the project cover</p>
                  </div>
                  
                  <div className="PROADD-previewsGrid">
                    {imagePreviews.map((previewUrl, index) => (
                      <div key={index} className={`PROADD-previewItem ${coverImageIndex === index ? 'selected' : ''}`}>
                        <img src={previewUrl} alt={`Preview ${index + 1}`} />
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="PROADD-removeImage"
                          title="Remove image"
                        >
                          ×
                        </button>
                        {coverImageIndex !== index && (
                          <button
                            type="button"
                            onClick={() => setAsCoverImage(index)}
                            className="PROADD-setCover"
                            title="Set as main image"
                          >
                            Set as Main
                          </button>
                        )}
                        {coverImageIndex === index && (
                          <div className="PROADD-coverIndicator">Main</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="PROADD-rightColumn">
            <div className="PROADD-card">
              <h3 className="PROADD-sectionTitle">Project Information</h3>
              
              <div className="PROADD-fields">
                <div className="PROADD-fieldGroup">
                  <label className="PROADD-label">
                    Project Title <span className="PROADD-required">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`PROADD-input ${errors.title && touched.title ? 'error' : ''}`}
                    placeholder="e.g., Modern Aluminum Curtain Wall System"
                  />
                  {errors.title && touched.title && <div className="PROADD-error">{errors.title}</div>}
                </div>

                <div className="PROADD-fieldGroup">
                  <label className="PROADD-label">
                    Project Type <span className="PROADD-required">*</span>
                  </label>
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`PROADD-select ${errors.projectType && touched.projectType ? 'error' : ''}`}
                  >
                    <option value="">Select Project Type</option>
                    {projectTypes.map(type => (
                      <option key={type.id} value={type.name}>{type.name}</option>
                    ))}
                  </select>
                  {errors.projectType && touched.projectType && <div className="PROADD-error">{errors.projectType}</div>}
                </div>

                <div className="PROADD-row">
                  <div className="PROADD-fieldGroup">
                    <label className="PROADD-label">Project Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="PROADD-input"
                      placeholder="e.g., Dhaka, Bangladesh"
                    />
                    {errors.location && touched.location && <div className="PROADD-error">{errors.location}</div>}
                  </div>

                  <div className="PROADD-fieldGroup">
                    <label className="PROADD-label">Completion Date</label>
                    <input
                      type="month"
                      name="projectDate"
                      value={formData.projectDate}
                      onChange={handleChange}
                      className="PROADD-input"
                    />
                  </div>
                </div>

                <div className="PROADD-fieldGroup">
                  <label className="PROADD-label">
                    Project Description <span className="PROADD-required">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`PROADD-textarea ${errors.description && touched.description ? 'error' : ''}`}
                    placeholder="Describe your aluminum project, including techniques used, unique features, and project highlights..."
                    rows="5"
                  />
                  {errors.description && touched.description && <div className="PROADD-error">{errors.description}</div>}
                </div>

                <div className="PROADD-fieldGroup">
                  <label className="PROADD-checkbox">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                    />
                    <span>Mark as Featured Project</span>
                  </label>
                  <p className="PROADD-checkboxHint">Featured projects will be highlighted on the homepage</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="PROADD-actions">
          <button type="button" className="PROADD-cancel" onClick={onClose}>
            Cancel
          </button>
          <button 
            type="button" 
            className="PROADD-addAnother" 
            onClick={handleAddAnother}
            disabled={isSubmitting}
          >
            Add Another
          </button>
          <button 
            type="submit" 
            className="PROADD-submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Publishing...' : 'Publish Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProAddForm;