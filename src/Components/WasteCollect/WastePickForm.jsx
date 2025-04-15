import React, { useState } from 'react';
import './WastePickForm.css'; 

function WastePickForm() {
  const [district, setDistrict] = useState('');
  const [province, setProvince] = useState('');
  const [type, setType] = useState('');
  const [photos, setPhotos] = useState([]);

  const handleDistrictChange = (event) => {
    setDistrict(event.target.value);
  };

  const handleProvinceChange = (event) => {
    setProvince(event.target.value);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files); 
    const photoUrls = files.map((file) => URL.createObjectURL(file));
    setPhotos(photoUrls); 
  };

  return (
    <div className="waste-form-container">
      <h2 className="form-title">Fill the form for waste items</h2>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input type="text" id="name" placeholder="Name" />
      </div>
      <div className="form-group">
        <label htmlFor="contactNo">Contact no</label>
        <input type="tel" id="contactNo" placeholder="Contact no" />
      </div>
      <div className="form-group horizontal">
        <div>
          <label htmlFor="district">District</label>
          <select id="district" value={district} onChange={handleDistrictChange}>
            <option value="">Select District</option>
            <option value="kalutara">Kalutara</option>
            <option value="colombo">Colombo</option>
          </select>
        </div>
        <div>
          <label htmlFor="province">Province</label>
          <select id="province" value={province} onChange={handleProvinceChange}>
            <option value="">Select Province</option>
            <option value="western">Western</option>
            <option value="central">Central</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="address">Address</label>
        <textarea id="address" rows="4" placeholder="Address"></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="message">Message</label>
        <textarea id="message" rows="4" placeholder="Message"></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="type">Type</label>
        <select id="type" value={type} onChange={handleTypeChange}>
          <option value="">Select Type</option>
          <option value="plastic">Plastic</option>
          <option value="metal">Metal</option>
        </select>
      </div>

       <div className="form-group">
        <label htmlFor="photoUpload">Upload a photo</label>
        <input
          type="file"
          id="photoUpload"
          accept="image/*"
          multiple 
          onChange={handlePhotoUpload}
          style={{ display: 'none' }}
        />
        <label htmlFor="photoUpload" className="upload-button">
          Choose Photos
        </label>
        <div className="photo-preview">
          {photos.map((photoUrl, index) => (
            <img key={index} src={photoUrl} alt={`Uploaded ${index + 1}`} className="preview-image" />
          ))}
        </div>
      </div>

      <button type="submit" className="submit-button">Submit</button>
    </div>
  );
}

export default WastePickForm;