import React, { useState } from 'react';
import './WastePickForm.css';

const WastePickForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Submitting form');
  };

  return (
    <div className="waste-form-container">
      <h1 className="form-title">Fill the form for waste items</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <textarea id="address" rows="3"></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="contact">Contact No</label>
          <input type="text" id="contact" />
        </div>
        <div className="form-group">
          <label htmlFor="upload-photo">Upload a photo</label>
          <input
            type="file"
            id="upload-photo"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="district">District</label>
          <select id="district">
            <option value="">Select District</option>
            <option value="district1">District 1</option>
            <option value="district2">District 2</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="province">Province</label>
          <select id="province">
            <option value="">Select Province</option>
            <option value="province1">Province 1</option>
            <option value="province2">Province 2</option>
          </select>
        </div>
        <div className="form-group">
          <label>Scraps</label>
          <div className="radio-group">
            <label>
              <input type="radio" name="scraps" value="scraps1" />
              Scraps
            </label>
            <label>
              <input type="radio" name="scraps" value="scraps2" />
              Scraps
            </label>
            <label>
              <input type="radio" name="scraps" value="scraps3" />
              Scraps
            </label>
            <label>
              <input type="radio" name="scraps" value="scraps4" />
              Scraps
            </label>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="type">Select the type</label>
          <select id="type">
            <option value="">Select Type</option>
            <option value="type1">Type 1</option>
            <option value="type2">Type 2</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="weight">Enter the weight</label>
          <input type="text" id="weight" />
        </div>
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default WastePickForm;