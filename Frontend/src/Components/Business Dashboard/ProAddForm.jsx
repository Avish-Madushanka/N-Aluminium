import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ProAddForm.css'; 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003/api';

function ProAddForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    
    // Limit the number of files if necessary, e.g., to 5
    if (selectedFiles.length + files.length > 5) {
        setError("You can upload a maximum of 5 images.");
        // Clear the file input so the user can try again
        event.target.value = null; 
        return;
    }
    setError(''); // Clear previous error

    setSelectedFiles(prevFiles => [...prevFiles, ...files]);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    
    // Clear the file input value to allow selecting the same file again if removed
    event.target.value = null; 
  };

  const removeImage = (indexToRemove) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    setImagePreviews(prevPreviews => {
      const newPreviews = prevPreviews.filter((_, index) => index !== indexToRemove);
      URL.revokeObjectURL(prevPreviews[indexToRemove]); // Clean up object URL
      return newPreviews;
    });
  };

  useEffect(() => {
    // Cleanup object URLs on component unmount
    return () => {
      imagePreviews.forEach(previewUrl => URL.revokeObjectURL(previewUrl));
    };
  }, [imagePreviews]); // Rerun if imagePreviews change, though primary cleanup is on unmount

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedFiles.length === 0) {
      setError("Please upload at least one image for the project.");
      return;
    }
    if (!title.trim() || !description.trim() || !type) {
        setError("Please fill in all required fields: Title, Description, and Type.");
        return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('type', type);
    selectedFiles.forEach(file => {
      formData.append('projectImages', file); // Use 'projectImages' or whatever your backend expects
    });
    
    // Add user/business owner ID if required by backend
    // const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    // if (userInfo && userInfo.userId) {
    //   formData.append('businessOwnerId', userInfo.userId);
    // }

    try {
      // Replace with your actual API endpoint for adding projects
      // const response = await axios.post(`${API_BASE_URL}/projects`, formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //     // 'Authorization': `Bearer ${localStorage.getItem('token')}` // If auth is needed
      //   }
      // });
      
      console.log('Submitting project with data:', { title, description, type, selectedFiles });
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call

      setLoading(false);
      alert('Project added successfully! (Simulated)'); // Replace with actual success handling
      // navigate('/business-dashboard/view-projects'); // Or wherever you want to redirect
      // Reset form
      setTitle('');
      setDescription('');
      setType('');
      setSelectedFiles([]);
      setImagePreviews([]);

    } catch (err) {
      setLoading(false);
      console.error("Failed to add project:", err.response || err);
      setError(err.response?.data?.message || 'Failed to add project. Please try again.');
    }
  };

  return (
    <div className="pro-add-form-content"> {/* This div's parent in router is .biz-form-container */}
      <h2 className="form-title">Add New Project</h2>
      {error && <p className="pro-error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="pro-form-group">
          <label htmlFor="title">Project Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="pro-form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            disabled={loading}
          ></textarea>
        </div>

        <div className="pro-form-group">
          <label htmlFor="type">Project Type</label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value)} required disabled={loading}>
            <option value="">Select Type</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="renovation">Renovation</option>
            <option value="custom-fabrication">Custom Fabrication</option>
            <option value="others">Others</option>
          </select>
        </div>
        
        <div className="pro-form-group file-upload-area">
          <label htmlFor="upload-photo">Upload Photos (Max 5)</label>
          <label htmlFor="upload-photo" className={`pro-file-input-label ${loading ? 'disabled' : ''}`}>
            {selectedFiles.length > 0 ? `${selectedFiles.length} file(s) chosen` : 'Choose Images...'}
          </label>
          <input
            type="file"
            id="upload-photo"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
            style={{ display: 'none' }} // Hide actual input, use label for styling
          />
           {imagePreviews.length > 0 && (
            <div className="pro-image-previews-container">
              {imagePreviews.map((previewUrl, index) => (
                <div key={index} className="pro-image-preview-item">
                  <img src={previewUrl} alt={`Preview ${index + 1}`} className="pro-preview-image" />
                  <button 
                    type="button" 
                    onClick={() => removeImage(index)} 
                    className="pro-remove-image-btn"
                    disabled={loading}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" className="pro-submit-button" disabled={loading}>
          {loading ? 'Submitting...' : 'Add Project'}
        </button>
      </form>
    </div>
  );
}

export default ProAddForm;