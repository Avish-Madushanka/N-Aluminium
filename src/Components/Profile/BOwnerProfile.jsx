import React, { useState } from "react";
import { User, Mail, Phone, Lock, MapPin, Home, FileImage, Building, FileText, CreditCard } from "lucide-react";
import "./BOwnerProfile.css";

export default function BOwnerProfile() {
  const [profile, setProfile] = useState({
    businessId: "B12345",
    businessName: "Acme Corporation",
    ownerName: "Jane Smith",
    email: "jane@acmecorp.com",
    contactNumber: "0712345678",
    password: "********",
    address: "456 Silicon Avenue, Tech Park",
    district: "colombo",
    province: "western",
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfilePhotoChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const handleCoverPhotoChange = (e) => {
    setCoverPhoto(e.target.files[0]);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      alert("Business profile saved successfully!");
      setSaving(false);
    }, 1000);
  };

  return (
    <div className="BOwner-Pro-container">
      <h2 className="BOwner-Pro-main-title">Business Owner Profile</h2>

      <div className="BOwner-Pro-columns-wrapper">
        {/* Left Column - Profile Details */}
        <div className="BOwner-Pro-column BOwner-Pro-column-left">
          <h3 className="BOwner-Pro-column-title">Business Profile Details</h3>

          <div className="BOwner-Pro-form-group">
            <label className="BOwner-Pro-label">Business ID</label>
            <div className="BOwner-Pro-input-wrapper">
              <div className="BOwner-Pro-input-icon">
                <CreditCard size={18} />
              </div>
              <input
                type="text"
                name="businessId"
                value={profile.businessId}
                onChange={handleChange}
                className="BOwner-Pro-input"
                required
              />
            </div>
          </div>

          <div className="BOwner-Pro-form-group">
            <label className="BOwner-Pro-label">Business Name</label>
            <div className="BOwner-Pro-input-wrapper">
              <div className="BOwner-Pro-input-icon">
                <Building size={18} />
              </div>
              <input
                type="text"
                name="businessName"
                value={profile.businessName}
                onChange={handleChange}
                className="BOwner-Pro-input"
                required
              />
            </div>
          </div>

          <div className="BOwner-Pro-form-group">
            <label className="BOwner-Pro-label">Owner's Full Name</label>
            <div className="BOwner-Pro-input-wrapper">
              <div className="BOwner-Pro-input-icon">
                <User size={18} />
              </div>
              <input
                type="text"
                name="ownerName"
                value={profile.ownerName}
                onChange={handleChange}
                className="BOwner-Pro-input"
                required
              />
            </div>
          </div>

          <div className="BOwner-Pro-form-group">
            <label className="BOwner-Pro-label">Email Address</label>
            <div className="BOwner-Pro-input-wrapper">
              <div className="BOwner-Pro-input-icon">
                <Mail size={18} />
              </div>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="BOwner-Pro-input"
                required
              />
            </div>
          </div>

          <div className="BOwner-Pro-form-group">
            <label className="BOwner-Pro-label">Contact Number</label>
            <div className="BOwner-Pro-input-wrapper">
              <div className="BOwner-Pro-input-icon">
                <Phone size={18} />
              </div>
              <input
                type="tel"
                name="contactNumber"
                value={profile.contactNumber}
                onChange={handleChange}
                className="BOwner-Pro-input"
                required
              />
            </div>
          </div>

          <div className="BOwner-Pro-form-group">
            <label className="BOwner-Pro-label">Password</label>
            <div className="BOwner-Pro-input-wrapper">
              <div className="BOwner-Pro-input-icon">
                <Lock size={18} />
              </div>
              <input
                type="password"
                name="password"
                value={profile.password}
                onChange={handleChange}
                className="BOwner-Pro-input"
                required
              />
            </div>
          </div>

          <div className="BOwner-Pro-form-group">
            <label className="BOwner-Pro-label">Business Address</label>
            <div className="BOwner-Pro-input-wrapper">
              <div className="BOwner-Pro-input-icon BOwner-Pro-textarea-icon">
                <MapPin size={18} />
              </div>
              <textarea
                name="address"
                value={profile.address}
                onChange={handleChange}
                rows="3"
                className="BOwner-Pro-textarea"
                required
              ></textarea>
            </div>
          </div>

          <div className="BOwner-Pro-form-row">
            <div className="BOwner-Pro-form-group BOwner-Pro-form-group-half">
              <label className="BOwner-Pro-label">District</label>
              <div className="BOwner-Pro-input-wrapper">
                <div className="BOwner-Pro-input-icon">
                  <Home size={18} />
                </div>
                <select
                  name="district"
                  value={profile.district}
                  onChange={handleChange}
                  className="BOwner-Pro-select"
                  required
                >
                  <option value="">Select District</option>
                  <option value="colombo">Colombo</option>
                  <option value="gampaha">Gampaha</option>
                  <option value="kalutara">Kalutara</option>
                  <option value="kandy">Kandy</option>
                  <option value="matale">Matale</option>
                  <option value="nuwara-eliya">Nuwara Eliya</option>
                  <option value="galle">Galle</option>
                  <option value="matara">Matara</option>
                  <option value="hambantota">Hambantota</option>
                  <option value="jaffna">Jaffna</option>
                  <option value="kilinochchi">Kilinochchi</option>
                  <option value="mannar">Mannar</option>
                  <option value="vavuniya">Vavuniya</option>
                  <option value="mullaitivu">Mullaitivu</option>
                  <option value="batticaloa">Batticaloa</option>
                  <option value="ampara">Ampara</option>
                  <option value="trincomalee">Trincomalee</option>
                  <option value="kurunegala">Kurunegala</option>
                  <option value="puttalam">Puttalam</option>
                  <option value="anuradhapura">Anuradhapura</option>
                  <option value="polonnaruwa">Polonnaruwa</option>
                  <option value="badulla">Badulla</option>
                  <option value="monaragala">Monaragala</option>
                  <option value="ratnapura">Ratnapura</option>
                  <option value="kegalle">Kegalle</option>
                </select>
              </div>
            </div>

            <div className="BOwner-Pro-form-group BOwner-Pro-form-group-half">
              <label className="BOwner-Pro-label">Province</label>
              <div className="BOwner-Pro-input-wrapper">
                <div className="BOwner-Pro-input-icon">
                  <Home size={18} />
                </div>
                <select
                  name="province"
                  value={profile.province}
                  onChange={handleChange}
                  className="BOwner-Pro-select"
                  required
                >
                  <option value="">Select Province</option>
                  <option value="western">Western</option>
                  <option value="central">Central</option>
                  <option value="southern">Southern</option>
                  <option value="northern">Northern</option>
                  <option value="eastern">Eastern</option>
                  <option value="north-western">North Western</option>
                  <option value="north-central">North Central</option>
                  <option value="uva">Uva</option>
                  <option value="sabaragamuwa">Sabaragamuwa</option>
                </select>
              </div>
            </div>
          </div>

          <div className="BOwner-Pro-form-group">
            <label className="BOwner-Pro-label">Profile Photo</label>
            <div className="BOwner-Pro-input-wrapper">
              <input
                type="file"
                id="profile-photo"
                onChange={handleProfilePhotoChange}
                className="BOwner-Pro-file-input-hidden"
              />
              <label htmlFor="profile-photo" className="BOwner-Pro-file-upload-btn">
                <FileImage size={18} />
                <span>{profilePhoto ? profilePhoto.name : "Choose File"}</span>
              </label>
            </div>
          </div>

          <div className="BOwner-Pro-form-group">
            <label className="BOwner-Pro-label">Cover Photo</label>
            <div className="BOwner-Pro-input-wrapper">
              <input
                type="file"
                id="cover-photo"
                onChange={handleCoverPhotoChange}
                className="BOwner-Pro-file-input-hidden"
              />
              <label htmlFor="cover-photo" className="BOwner-Pro-file-upload-btn">
                <FileImage size={18} />
                <span>{coverPhoto ? coverPhoto.name : "Choose File"}</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="BOwner-Pro-save-btn"
            disabled={saving}
            onClick={handleSave}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Right Column - Navigation + Business Summary */}
        <div className="BOwner-Pro-column BOwner-Pro-column-right">
          <h3 className="BOwner-Pro-column-title">Business Navigation</h3>

          <div className="BOwner-Pro-nav-buttons">
            <div className="BOwner-Pro-nav-button">
              <div className="BOwner-Pro-nav-button-icon BOwner-Pro-icon-blue">
                <FileText size={24} />
              </div>
              <div className="BOwner-Pro-nav-button-text">
                <h4 className="BOwner-Pro-nav-button-title">Dashboard</h4>
                <p className="BOwner-Pro-nav-button-desc">View your business summary</p>
              </div>
            </div>

            <div className="BOwner-Pro-nav-button">
              <div className="BOwner-Pro-nav-button-icon BOwner-Pro-icon-blue">
                <Building size={24} />
              </div>
              <div className="BOwner-Pro-nav-button-text">
                <h4 className="BOwner-Pro-nav-button-title">Business Orders</h4>
                <p className="BOwner-Pro-nav-button-desc">Manage your business orders</p>
              </div>
            </div>

            <div className="BOwner-Pro-nav-button BOwner-Pro-nav-button-active">
              <div className="BOwner-Pro-nav-button-icon BOwner-Pro-icon-white">
                <User size={24} />
              </div>
              <div className="BOwner-Pro-nav-button-text">
                <h4 className="BOwner-Pro-nav-button-title">Profile Settings</h4>
                <p className="BOwner-Pro-nav-button-desc">Update your business information</p>
              </div>
            </div>

            <div className="BOwner-Pro-nav-button">
              <div className="BOwner-Pro-nav-button-icon BOwner-Pro-icon-red">
                <Lock size={24} />
              </div>
              <div className="BOwner-Pro-nav-button-text">
                <h4 className="BOwner-Pro-nav-button-title">Log Out</h4>
                <p className="BOwner-Pro-nav-button-desc">Sign out from your account</p>
              </div>
            </div>
          </div>

          {/* Business Profile Summary Section */}
          <div className="BOwner-Pro-profile-summary">
            <div className="BOwner-Pro-profile-summary-header">
              <div className="BOwner-Pro-profile-avatar">
                <img
                  src="/api/placeholder/64/64"
                  alt="Business Profile"
                  className="BOwner-Pro-avatar-img"
                />
              </div>
              <div className="BOwner-Pro-profile-text">
                <h4 className="BOwner-Pro-profile-name">{profile.businessName}</h4>
                <p className="BOwner-Pro-profile-subtitle">Business ID: {profile.businessId}</p>
                <p className="BOwner-Pro-profile-email">{profile.email}</p>
              </div>
            </div>
            <div className="BOwner-Pro-profile-meta">
              <p>Business registered: Jan 2023</p>
              <p>Last login: Today</p>
              <p>Owner: {profile.ownerName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}