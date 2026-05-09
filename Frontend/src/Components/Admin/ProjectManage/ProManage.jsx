import React, { useState, useEffect } from 'react';
import './ProManage.css';

const ProManage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
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
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const projectTypes = [
    { id: 'aluminum-doors', name: 'Aluminum Doors' },
    { id: 'aluminum-windows', name: 'Aluminum Windows' },
    { id: 'aluminum-pantry-cupboards', name: 'Aluminum Pantry Cupboards' },
    { id: 'sivilims', name: 'Sivilims' },
    { id: 'other', name: 'Other' }
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  const notifyProjectsUpdated = () => {
    window.dispatchEvent(new Event('projects-updated'));
  };

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5003/api/projects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setProjects(result.data);
      } else {
        setError(result.message || 'Failed to fetch projects');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to connect to server: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

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
    setExistingImages([]);
    setImagesToDelete([]);
    setFormErrors({});
    setEditingProject(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const newTotalFiles = selectedFiles.length + files.length;
    if (newTotalFiles > 10) {
      setFormErrors({ images: 'You can upload a maximum of 10 images.' });
      return;
    }

    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024;
      if (!isValidType) {
        setFormErrors({ images: `${file.name}: Only JPG, PNG, WEBP images are allowed.` });
        return false;
      }
      if (!isValidSize) {
        setFormErrors({ images: `${file.name}: File size must be less than 10MB.` });
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
        
        if (selectedFiles.length === 0 && existingImages.length === 0 && coverImageIndex === 0) {
          setCoverImageIndex(0);
        }
        
        if (formErrors.images) {
          setFormErrors({});
        }
      })
      .catch(error => {
        console.error("Error generating image previews:", error);
        setFormErrors({ images: 'Error generating image previews.' });
      });

    event.target.value = null;
  };

  const handleRemoveNewImage = (indexToRemove) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    setImagePreviews(prevPreviews => prevPreviews.filter((_, index) => index !== indexToRemove));
    
    if (coverImageIndex === indexToRemove && selectedFiles.length + existingImages.length > 0) {
      setCoverImageIndex(0);
    } else if (coverImageIndex > indexToRemove) {
      setCoverImageIndex(coverImageIndex - 1);
    }
  };

  const handleRemoveExistingImage = (imagePath, index) => {
    setImagesToDelete(prev => [...prev, imagePath]);
    setExistingImages(prev => prev.filter((_, i) => i !== index));
    
    const totalRemaining = existingImages.length - 1 + selectedFiles.length;
    if (coverImageIndex === index && totalRemaining > 0) {
      setCoverImageIndex(0);
    } else if (coverImageIndex > index) {
      setCoverImageIndex(coverImageIndex - 1);
    }
  };

  const setAsCoverImage = (index, isExisting = false) => {
    if (isExisting) {
      setCoverImageIndex(index);
    } else {
      setCoverImageIndex(existingImages.length + index);
    }
    setSuccess('Cover image updated successfully!');
    setTimeout(() => setSuccess(''), 2000);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title?.trim()) {
      errors.title = 'Project title is required';
    } else if (formData.title.trim().length < 3) {
      errors.title = 'Project title must be at least 3 characters';
    }
    if (!formData.description?.trim()) {
      errors.description = 'Project description is required';
    } else if (formData.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }
    if (!formData.projectType) {
      errors.projectType = 'Project type is required';
    }
    if (selectedFiles.length === 0 && existingImages.length === 0) {
      errors.images = 'At least one project image is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('projectType', formData.projectType);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('projectDate', formData.projectDate);
      formDataToSend.append('featured', formData.featured);
      formDataToSend.append('coverImageIndex', coverImageIndex);
      
      if (imagesToDelete.length > 0) {
        imagesToDelete.forEach(imgPath => {
          formDataToSend.append('imagesToDelete', imgPath);
        });
      }
      
      selectedFiles.forEach((file) => {
        formDataToSend.append('projectImages', file);
      });

      let response;
      
      if (editingProject) {
        response = await fetch(`http://localhost:5003/api/projects/${editingProject._id}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formDataToSend
        });
      } else {
        response = await fetch('http://localhost:5003/api/projects', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formDataToSend
        });
      }

      const result = await response.json();
      
      if (result.success) {
        setSuccess(editingProject ? 'Project updated successfully!' : 'Project added successfully!');
        await fetchProjects();
        notifyProjectsUpdated();
        resetForm();
        setShowAddForm(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setError('Failed to connect to server: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (projectId) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5003/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSuccess('Project deleted successfully!');
        await fetchProjects();
        notifyProjectsUpdated();
        setDeleteConfirm(null);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setError('Failed to connect to server: ' + error.message);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      description: project.description || '',
      projectType: project.projectType || '',
      location: project.location || '',
      projectDate: project.projectDate || '',
      featured: project.featured || false
    });
    
    const existingImgArray = project.galleryImages || [];
    setExistingImages(existingImgArray);
    
    const coverIdx = existingImgArray.findIndex(img => img === project.coverImage);
    setCoverImageIndex(coverIdx >= 0 ? coverIdx : 0);
    
    setSelectedFiles([]);
    setImagePreviews([]);
    setImagesToDelete([]);
    setShowAddForm(true);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/100?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) return `http://localhost:5003${imagePath}`;
    return `http://localhost:5003/uploads/projects/${imagePath}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (error) {
      return dateString;
    }
  };

  const getProjectTypeName = (typeId) => {
    const found = projectTypes.find(t => t.name === typeId);
    return found ? found.name : typeId;
  };

  return (
    <div className="ProManage-container">
      <div className="ProManage-header">
        <h1 className="ProManage-title">Project Management</h1>
        <button 
          className="ProManage-addButton"
          onClick={() => {
            resetForm();
            setShowAddForm(true);
          }}
        >
          + Add New Project
        </button>
      </div>

      {success && (
        <div className="ProManage-success">
          <span>{success}</span>
          <button className="ProManage-successClose" onClick={() => setSuccess('')}>×</button>
        </div>
      )}

      {error && (
        <div className="ProManage-error">
          <span>{error}</span>
          <button className="ProManage-errorClose" onClick={() => setError('')}>×</button>
        </div>
      )}

      {showAddForm && (
        <div className="ProManage-modalOverlay">
          <div className="ProManage-modal">
            <div className="ProManage-modalHeader">
              <h2>{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
              <button 
                className="ProManage-modalClose"
                onClick={() => {
                  setShowAddForm(false);
                  resetForm();
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="ProManage-form">
              <div className="ProManage-twoColumn">
                <div className="ProManage-leftColumn">
                  <div className="ProManage-card">
                    <h3 className="ProManage-sectionTitle">Project Images</h3>
                    <div className="ProManage-imageUpload">
                      <div
                        className="ProManage-uploadArea"
                        onClick={() => document.getElementById('projectImageInput').click()}
                      >
                        <input
                          id="projectImageInput"
                          type="file"
                          multiple
                          accept="image/jpeg,image/png,image/jpg,image/webp"
                          onChange={handleFileChange}
                          style={{ display: 'none' }}
                        />
                        <div className="ProManage-uploadPlaceholder">
                          <span className="ProManage-uploadIcon">+</span>
                          <span>Click to upload images</span>
                          <span className="ProManage-uploadHint">JPG, PNG, WEBP up to 10MB each (Max 10 images)</span>
                        </div>
                      </div>
                    </div>
                    {formErrors.images && <div className="ProManage-error">{formErrors.images}</div>}
                    
                    {(existingImages.length > 0 || imagePreviews.length > 0) && (
                      <div className="ProManage-imageGallery">
                        <div className="ProManage-coverSelection">
                          <p className="ProManage-coverLabel">Main Display Image:</p>
                          <div className="ProManage-coverPreview">
                            {(existingImages[coverImageIndex] || imagePreviews[coverImageIndex - existingImages.length]) ? (
                              <img 
                                src={coverImageIndex < existingImages.length 
                                  ? getImageUrl(existingImages[coverImageIndex])
                                  : imagePreviews[coverImageIndex - existingImages.length]
                                } 
                                alt="Cover" 
                              />
                            ) : (
                              <div className="ProManage-coverPlaceholder">No cover selected</div>
                            )}
                            <span className="ProManage-coverBadge">Main Image</span>
                          </div>
                          <p className="ProManage-coverHint">This image will be displayed as the project cover</p>
                        </div>
                        
                        <div className="ProManage-previewsGrid">
                          {existingImages.map((img, index) => (
                            <div key={`existing-${index}`} className={`ProManage-previewItem ${coverImageIndex === index ? 'selected' : ''}`}>
                              <img src={getImageUrl(img)} alt={`Existing ${index + 1}`} />
                              <button
                                type="button"
                                onClick={() => handleRemoveExistingImage(img, index)}
                                className="ProManage-removeImage"
                                title="Remove image"
                              >
                                ×
                              </button>
                              {coverImageIndex !== index && (
                                <button
                                  type="button"
                                  onClick={() => setAsCoverImage(index, true)}
                                  className="ProManage-setCover"
                                  title="Set as main image"
                                >
                                  Set as Main
                                </button>
                              )}
                              {coverImageIndex === index && (
                                <div className="ProManage-coverIndicator">Main</div>
                              )}
                            </div>
                          ))}
                          {imagePreviews.map((previewUrl, index) => {
                            const actualIndex = existingImages.length + index;
                            return (
                              <div key={`new-${index}`} className={`ProManage-previewItem ${coverImageIndex === actualIndex ? 'selected' : ''}`}>
                                <img src={previewUrl} alt={`Preview ${index + 1}`} />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveNewImage(index)}
                                  className="ProManage-removeImage"
                                  title="Remove image"
                                >
                                  ×
                                </button>
                                {coverImageIndex !== actualIndex && (
                                  <button
                                    type="button"
                                    onClick={() => setAsCoverImage(index, false)}
                                    className="ProManage-setCover"
                                    title="Set as main image"
                                  >
                                    Set as Main
                                  </button>
                                )}
                                {coverImageIndex === actualIndex && (
                                  <div className="ProManage-coverIndicator">Main</div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="ProManage-rightColumn">
                  <div className="ProManage-card">
                    <h3 className="ProManage-sectionTitle">Project Information</h3>
                    
                    <div className="ProManage-fields">
                      <div className="ProManage-fieldGroup">
                        <label className="ProManage-label">
                          Project Title <span className="ProManage-required">*</span>
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className={`ProManage-input ${formErrors.title ? 'error' : ''}`}
                          placeholder="e.g., Modern Aluminum Curtain Wall System"
                        />
                        {formErrors.title && <div className="ProManage-error">{formErrors.title}</div>}
                      </div>

                      <div className="ProManage-fieldGroup">
                        <label className="ProManage-label">
                          Project Type <span className="ProManage-required">*</span>
                        </label>
                        <select
                          name="projectType"
                          value={formData.projectType}
                          onChange={handleInputChange}
                          className={`ProManage-select ${formErrors.projectType ? 'error' : ''}`}
                        >
                          <option value="">Select Project Type</option>
                          {projectTypes.map(type => (
                            <option key={type.id} value={type.name}>{type.name}</option>
                          ))}
                        </select>
                        {formErrors.projectType && <div className="ProManage-error">{formErrors.projectType}</div>}
                      </div>

                      <div className="ProManage-row">
                        <div className="ProManage-fieldGroup">
                          <label className="ProManage-label">Project Location</label>
                          <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="ProManage-input"
                            placeholder="e.g., Panadura, Sri Lanka"
                          />
                        </div>

                        <div className="ProManage-fieldGroup">
                          <label className="ProManage-label">Completion Date</label>
                          <input
                            type="month"
                            name="projectDate"
                            value={formData.projectDate}
                            onChange={handleInputChange}
                            className="ProManage-input"
                          />
                        </div>
                      </div>

                      <div className="ProManage-fieldGroup">
                        <label className="ProManage-label">
                          Project Description <span className="ProManage-required">*</span>
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          className={`ProManage-textarea ${formErrors.description ? 'error' : ''}`}
                          placeholder="Describe your aluminum project, including techniques used, unique features, and project highlights..."
                          rows="5"
                        />
                        {formErrors.description && <div className="ProManage-error">{formErrors.description}</div>}
                      </div>

                      <div className="ProManage-fieldGroup">
                        <label className="ProManage-checkbox">
                          <input
                            type="checkbox"
                            name="featured"
                            checked={formData.featured}
                            onChange={handleInputChange}
                          />
                          <span>Mark as Featured Project</span>
                        </label>
                        <p className="ProManage-checkboxHint">Featured projects will be highlighted on the homepage</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ProManage-actions">
                <button
                  type="button"
                  className="ProManage-cancelButton"
                  onClick={() => {
                    setShowAddForm(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ProManage-submitButton"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : (editingProject ? 'Update Project' : 'Add Project')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="ProManage-modalOverlay">
          <div className="ProManage-confirmModal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete "{deleteConfirm.title}"? This action cannot be undone.</p>
            <div className="ProManage-confirmActions">
              <button
                className="ProManage-confirmCancel"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="ProManage-confirmDelete"
                onClick={() => handleDelete(deleteConfirm._id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="ProManage-loading">Loading projects...</div>
      ) : (
        <div className="ProManage-tableContainer">
          <table className="ProManage-table">
            <thead>
              <tr>
                <th>Cover</th>
                <th>Title</th>
                <th>Type</th>
                <th>Location</th>
                <th>Date</th>
                <th>Status</th>
                <th>Images</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.length > 0 ? (
                projects.map(project => (
                  <tr key={project._id}>
                    <td>
                      <img 
                        src={getImageUrl(project.coverImage)} 
                        alt={project.title}
                        className="ProManage-tableImage"
                      />
                    </td>
                    <td className="ProManage-tableCell">
                      <div className="ProManage-projectTitle">{project.title}</div>
                      <div className="ProManage-projectDescription">{project.description?.substring(0, 60)}...</div>
                    </td>
                    <td>
                      <span className="ProManage-typeBadge">
                        {getProjectTypeName(project.projectType)}
                      </span>
                    </td>
                    <td>{project.location || '-'}</td>
                    <td>{formatDate(project.projectDate)}</td>
                    <td>
                      {project.featured && (
                        <span className="ProManage-featuredBadge">Featured</span>
                      )}
                    </td>
                    <td>
                      <div className="ProManage-imageCount">
                        <span className="ProManage-imageCountNumber">{project.galleryImages?.length || 0}</span>
                        <span className="ProManage-imageCountLabel">images</span>
                      </div>
                    </td>
                    <td>
                      <div className="ProManage-actionButtons">
                        <button
                          className="ProManage-editButton"
                          onClick={() => handleEdit(project)}
                        >
                          Edit
                        </button>
                        <button
                          className="ProManage-deleteButton"
                          onClick={() => setDeleteConfirm(project)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="ProManage-noData">
                    No projects found. Click "Add New Project" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProManage;