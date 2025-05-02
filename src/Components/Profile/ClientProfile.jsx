import React, { useState } from "react";
import { FileImage, Mail, Truck, ShoppingCart, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  const [activeButton, setActiveButton] = useState(null);

  const navigate = useNavigate();

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

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);

    switch (buttonName) {
      case "email":
        navigate("/ClientEmail");
        break;
      case "pickup":
        navigate("/PickupReq");
        break;
      case "buy":
        navigate("/CheckBuySell");
        break;
      case "logout":
        navigate("/logout");
        break;
      default:
        break;
    }

    setTimeout(() => setActiveButton(null), 500);
  };

  return (
    <div className="Client-Pro-container">
      <h2 className="Client-Pro-main-title">User Profile</h2>

      <div className="Client-Pro-columns-wrapper">
        <div className="Client-Pro-column Client-Pro-column-left">
          <h3 className="Client-Pro-column-title">Profile Details</h3>
          <form onSubmit={handleSave}>
            <div className="Client-Pro-form-group">
              <label className="Client-Pro-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="Client-Pro-input"
                required
              />
            </div>

            <div className="Client-Pro-form-group">
              <label className="Client-Pro-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="Client-Pro-input"
                required
              />
            </div>

            <div className="Client-Pro-form-group">
              <label className="Client-Pro-label">Contact Number</label>
              <input
                type="tel"
                name="contactNumber"
                value={profile.contactNumber}
                onChange={handleChange}
                className="Client-Pro-input"
                required
              />
            </div>

            <div className="Client-Pro-form-group">
              <label className="Client-Pro-label">Password</label>
              <input
                type="password"
                name="password"
                value={profile.password}
                onChange={handleChange}
                className="Client-Pro-input"
                required
              />
            </div>

            <div className="Client-Pro-form-group">
              <label className="Client-Pro-label">Address</label>
              <textarea
                name="address"
                value={profile.address}
                onChange={handleChange}
                rows="3"
                className="Client-Pro-textarea"
                required
              />
            </div>

            <div className="Client-Pro-form-row">
              <div className="Client-Pro-form-group Client-Pro-form-group-half">
                <label className="Client-Pro-label">District</label>
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

              <div className="Client-Pro-form-group Client-Pro-form-group-half">
                <label className="Client-Pro-label">Province</label>
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

            <div className="Client-Pro-form-group">
              <label className="Client-Pro-label">Profile Photo</label>
              <div className="Client-Pro-photo-preview-wrapper">
                {profilePhoto && (
                  <img
                    src={URL.createObjectURL(profilePhoto)}
                    alt="Preview"
                    className="Client-Pro-photo-preview"
                  />
                )}
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

            <button type="submit" className="Client-Pro-save-btn" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        <div className="Client-Pro-column Client-Pro-column-right">
          <h3 className="Client-Pro-column-title">Actions</h3>

          <button
            className={`Client-Pro-action-btn email ${activeButton === "email" ? "active" : ""}`}
            onClick={() => handleButtonClick("email")}
          >
            <span className="Client-Pro-btn-icon email">
              <Mail size={18} />
            </span>
            Check Emails
          </button>

          <button
            className={`Client-Pro-action-btn pickup ${activeButton === "pickup" ? "active" : ""}`}
            onClick={() => handleButtonClick("pickup")}
          >
            <span className="Client-Pro-btn-icon pickup">
              <Truck size={18} />
            </span>
            My Pickup Request
          </button>

          <button
            className={`Client-Pro-action-btn buy-sell ${activeButton === "buy" ? "active" : ""}`}
            onClick={() => handleButtonClick("buy")}
          >
            <span className="Client-Pro-btn-icon buy-sell">
              <ShoppingCart size={18} />
            </span>
            Check Buy & Sell
          </button>

          <button
            className={`Client-Pro-action-btn logout ${activeButton === "logout" ? "active" : ""}`}
            onClick={() => handleButtonClick("logout")}
          >
            <span className="Client-Pro-btn-icon logout">
              <LogOut size={18} />
            </span>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
