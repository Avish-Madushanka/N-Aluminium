import React, { useState } from 'react';
import './ProAddForm.css';

const ProAddForm = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add your submission logic here
    console.log('Submitting with files:', selectedFiles);
  };

  return (
    <div className="add-projects-container">
      <h1 className="add-projects-title">Add Projects</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="upload-photo">Upload Photos</label>
          <input
            type="file"
            id="upload-photo"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
          {selectedFiles.length > 0 && (
            <div className="selected-files">
              {selectedFiles.map((file, index) => (
                <span key={index}>{file.name}</span>
              ))}
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input type="text" id="title" />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" rows="5"></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="type">Type</label>
          <select id="type">
            <option value="">Select Type</option>
            <option value="web">Web</option>
            <option value="mobile">Mobile</option>
            <option value="design">Design</option>
          </select>
        </div>
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ProAddForm;