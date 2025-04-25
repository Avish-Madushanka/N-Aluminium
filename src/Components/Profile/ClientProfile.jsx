import React, { useState } from "react";
import { User, Mail, Phone, Lock, MapPin, Home, FileImage } from "lucide-react";
import "./ClientProfile.css";

export default function ClientProfile() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    contactNumber: "0123456789",
    password: "********",
    address: "123 Aluminum Street, Metal City",
    district: "colombo",
    province: "western",
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      alert("Profile saved successfully!");
      setSaving(false);
    }, 1000);
  };

  return (
    <div className="Client-Pro-container">
      <h2 className="Client-Pro-main-title">User Profile</h2>

      <div className="Client-Pro-columns-wrapper">
        {/* Left Column - Profile Details */}
        <div className="Client-Pro-column Client-Pro-column-left">
          <h3 className="Client-Pro-column-title">Profile Details</h3>

          <div className="Client-Pro-form-group">
            <label className="Client-Pro-label">Full Name</label>
            <div className="Client-Pro-input-wrapper">
              <div className="Client-Pro-input-icon">
                <User size={18} />
              </div>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="Client-Pro-input"
                required
              />
            </div>
          </div>

          <div className="Client-Pro-form-group">
            <label className="Client-Pro-label">Email Address</label>
            <div className="Client-Pro-input-wrapper">
              <div className="Client-Pro-input-icon">
                <Mail size={18} />
              </div>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="Client-Pro-input"
                required
              />
            </div>
          </div>

          <div className="Client-Pro-form-group">
            <label className="Client-Pro-label">Contact Number</label>
            <div className="Client-Pro-input-wrapper">
              <div className="Client-Pro-input-icon">
                <Phone size={18} />
              </div>
              <input
                type="tel"
                name="contactNumber"
                value={profile.contactNumber}
                onChange={handleChange}
                className="Client-Pro-input"
                required
              />
            </div>
          </div>

          <div className="Client-Pro-form-group">
            <label className="Client-Pro-label">Password</label>
            <div className="Client-Pro-input-wrapper">
              <div className="Client-Pro-input-icon">
                <Lock size={18} />
              </div>
              <input
                type="password"
                name="password"
                value={profile.password}
                onChange={handleChange}
                className="Client-Pro-input"
                required
              />
            </div>
          </div>

          <div className="Client-Pro-form-group">
            <label className="Client-Pro-label">Address</label>
            <div className="Client-Pro-input-wrapper">
              <div className="Client-Pro-input-icon Client-Pro-textarea-icon">
                <MapPin size={18} />
              </div>
              <textarea
                name="address"
                value={profile.address}
                onChange={handleChange}
                rows="3"
                className="Client-Pro-textarea"
                required
              ></textarea>
            </div>
          </div>

          <div className="Client-Pro-form-row">
            <div className="Client-Pro-form-group Client-Pro-form-group-half">
              <label className="Client-Pro-label">District</label>
              <div className="Client-Pro-input-wrapper">
                <div className="Client-Pro-input-icon">
                  <Home size={18} />
                </div>
                <select
                  name="district"
                  value={profile.district}
                  onChange={handleChange}
                  className="Client-Pro-select"
                  required
                >
                  <option value="">Select District</option>
                  <option value="colombo">Colombo</option>
                  <option value="kandy">Kandy</option>
                  <option value="galle">Galle</option>
                  <option value="matara">Matara</option>
                  <option value="jaffna">Jaffna</option>
                </select>
              </div>
            </div>

            <div className="Client-Pro-form-group Client-Pro-form-group-half">
              <label className="Client-Pro-label">Province</label>
              <div className="Client-Pro-input-wrapper">
                <div className="Client-Pro-input-icon">
                  <Home size={18} />
                </div>
                <select
                  name="province"
                  value={profile.province}
                  onChange={handleChange}
                  className="Client-Pro-select"
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

          <div className="Client-Pro-form-group">
            <label className="Client-Pro-label">Profile Photo</label>
            <div className="Client-Pro-input-wrapper">
              <input
                type="file"
                id="profile-photo"
                onChange={handleFileChange}
                className="Client-Pro-file-input-hidden"
              />
              <label htmlFor="profile-photo" className="Client-Pro-file-upload-btn">
                <FileImage size={18} />
                <span>{profilePhoto ? profilePhoto.name : "Choose File"}</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="Client-Pro-save-btn"
            disabled={saving}
            onClick={handleSave}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Right Column - Navigation + Summary */}
        <div className="Client-Pro-column Client-Pro-column-right">
          <h3 className="Client-Pro-column-title">Navigation</h3>

          <div className="Client-Pro-nav-buttons">
            <div className="Client-Pro-nav-button">
              <div className="Client-Pro-nav-button-icon Client-Pro-icon-blue">
                <User size={24} />
              </div>
              <div className="Client-Pro-nav-button-text">
                <h4 className="Client-Pro-nav-button-title">Dashboard</h4>
                <p className="Client-Pro-nav-button-desc">View your account summary</p>
              </div>
            </div>

            <div className="Client-Pro-nav-button">
              <div className="Client-Pro-nav-button-icon Client-Pro-icon-blue">
                <User size={24} />
              </div>
              <div className="Client-Pro-nav-button-text">
                <h4 className="Client-Pro-nav-button-title">My Orders</h4>
                <p className="Client-Pro-nav-button-desc">Track your order history</p>
              </div>
            </div>

            <div className="Client-Pro-nav-button Client-Pro-nav-button-active">
              <div className="Client-Pro-nav-button-icon Client-Pro-icon-white">
                <User size={24} />
              </div>
              <div className="Client-Pro-nav-button-text">
                <h4 className="Client-Pro-nav-button-title">Profile Settings</h4>
                <p className="Client-Pro-nav-button-desc">Update your personal information</p>
              </div>
            </div>

            <div className="Client-Pro-nav-button">
              <div className="Client-Pro-nav-button-icon Client-Pro-icon-red">
                <User size={24} />
              </div>
              <div className="Client-Pro-nav-button-text">
                <h4 className="Client-Pro-nav-button-title">Log Out</h4>
                <p className="Client-Pro-nav-button-desc">Sign out from your account</p>
              </div>
            </div>
          </div>

          {/* ✅ Fixed Profile Summary Section */}
          <div className="Client-Pro-profile-summary">
            <div className="Client-Pro-profile-summary-header">
              <div className="Client-Pro-profile-avatar">
                <img
                  src="/api/placeholder/64/64"
                  alt="Profile"
                  className="Client-Pro-avatar-img"
                />
              </div>
              <div className="Client-Pro-profile-text">
                <h4 className="Client-Pro-profile-name">{profile.name}</h4>
                <p className="Client-Pro-profile-email">{profile.email}</p>
              </div>
            </div>
            <div className="Client-Pro-profile-meta">
              <p>Member since: Jan 2023</p>
              <p>Last login: Today</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
