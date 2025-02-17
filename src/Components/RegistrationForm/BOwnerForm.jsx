import React, { useState } from 'react';
import './BOwnerForm.css';

function BOwnerForm() {
  const [district, setDistrict] = useState('');
  const [province, setProvince] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);

  const handleDistrictChange = (event) => {
    setDistrict(event.target.value);
  };

  const handleProvinceChange = (event) => {
    setProvince(event.target.value);
  };

  const handleProfilePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePhoto(imageUrl);
    }
  };

  const handleCoverPhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCoverPhoto(imageUrl);
    }
  };

  return (
    <div className="business-form-container">
      <h2 className="form-title">Business Registration Form</h2>

      <div className="form-group">
        <label htmlFor="businessId">Business ID</label>
        <input type="text" id="businessId" placeholder="Business ID" />
      </div>

      <div className="form-group">
        <label htmlFor="businessName">Business Name</label>
        <input type="text" id="businessName" placeholder="Business Name" />
      </div>

      <div className="form-group">
        <label htmlFor="ownerName">Owner Name</label>
        <input type="text" id="ownerName" placeholder="Owner Name" />
      </div>

      <div className="form-group">
        <label htmlFor="profilePhotoUpload">Upload a Profile photo</label>
        <input
          type="file"
          id="profilePhotoUpload"
          accept="image/*"
          onChange={handleProfilePhotoUpload}
          style={{ display: 'none' }}
        />
        <label htmlFor="profilePhotoUpload" className="upload-button">
          Choose Profile Photo
        </label>
        {profilePhoto && (
          <img src={profilePhoto} alt="Profile" className="uploaded-image" />
        )}
      </div>

      <div className="form-group">
        <label htmlFor="coverPhotoUpload">Upload a Cover photo</label>
        <input
          type="file"
          id="coverPhotoUpload"
          accept="image/*"
          onChange={handleCoverPhotoUpload}
          style={{ display: 'none' }}
        />
        <label htmlFor="coverPhotoUpload" className="upload-button">
          Choose Cover Photo
        </label>
        {coverPhoto && (
          <img src={coverPhoto} alt="Cover" className="uploaded-image" />
        )}
      </div>

      <div className="form-group">
        <label htmlFor="address">Address</label>
        <textarea id="address" placeholder="Address" rows="4"></textarea>
      </div>

      <div className="form-group">
        <label htmlFor="contactNumber">Contact Number</label>
        <input type="tel" id="contactNumber" placeholder="Contact Number" />
      </div>

      <div className="form-group horizontal">
        <div>
          <label htmlFor="district">District</label>
          <select id="district" value={district} onChange={handleDistrictChange}>
            <option value="">Select District</option>
            <option value="colombo">Colombo</option>
            <option value="kandy">Kandy</option>
            {/* Add more districts */}
          </select>
        </div>

        <div>
          <label htmlFor="province">Province</label>
          <select id="province" value={province} onChange={handleProvinceChange}>
            <option value="">Select Province</option>
            <option value="western">Western</option>
            <option value="central">Central</option>
            {/* Add more provinces */}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" placeholder="Email" />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" placeholder="Password" />
      </div>

      <button type="submit" className="submit-button">
        Register
      </button>
    </div>
  );
}

export default BOwnerForm;