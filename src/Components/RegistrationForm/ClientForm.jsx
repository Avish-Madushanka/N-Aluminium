// src/Components/RegistrationForm/ClientForm.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import "./ClientForm.css"; // Make sure this CSS file exists and is correctly named/updated

function ClientForm() {
  // --- State Management ---
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    password: "",
    address: "",
    district: "",
    province: "",
  });
  const [profilePhotoFile, setProfilePhotoFile] = useState(null); // State for the File object
  const [profilePreview, setProfilePreview] = useState(null); // State for the preview URL
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate(); // Initialize navigate

  // --- Event Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handles file selection and generates preview
  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;

    // Revoke previous preview URL if it exists
    if (profilePreview) {
      URL.revokeObjectURL(profilePreview);
      console.log("Revoked previous profile preview URL:", profilePreview);
    }

    setProfilePhotoFile(file); // Store the File object

    // Create and set new preview URL
    if (file) {
      const newPreviewUrl = URL.createObjectURL(file);
      setProfilePreview(newPreviewUrl);
      console.log("Created new profile preview URL:", newPreviewUrl);
    } else {
      setProfilePreview(null); // Clear preview if no file selected
    }
  };

  // --- Cleanup Effect for Preview URL ---
  useEffect(() => {
    // This function runs when the component unmounts
    return () => {
      if (profilePreview) {
        URL.revokeObjectURL(profilePreview);
        console.log("Cleaned up profile preview URL on unmount");
      }
    };
  }, [profilePreview]); // Dependency array ensures cleanup if preview changes

  // --- Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const clientData = new FormData();

    // Append text data
    Object.keys(formData).forEach((key) => {
      clientData.append(key, formData[key]);
    });

    // Append file data if it exists
    if (profilePhotoFile) {
      clientData.append("profilePhoto", profilePhotoFile); // Ensure backend expects 'profilePhoto'
    }

    try {
      // Removed manual Content-Type header - Axios sets it correctly for FormData
      await axios.post(
        "http://localhost:5003/api/clients/register",
        clientData
      );

      setSuccess("Registration successful! Redirecting to login...");
      setLoading(false); // Stop loading

      // Clear the form fields
      setFormData({
        name: "",
        email: "",
        contactNumber: "",
        password: "",
        address: "",
        district: "",
        province: "",
      });
      setProfilePhotoFile(null);
      setProfilePreview(null); // Clear preview state

      // Reset the file input visually (optional, but good UX)
      const fileInput = document.getElementById("CReg-profile-photo");
      if (fileInput) {
        fileInput.value = ""; // Clear the file input field
      }

      // Redirect after a delay
      setTimeout(() => {
        navigate('/Login'); // Redirect to the common login page
      }, 2000);


    } catch (err) {
      setLoading(false); // Stop loading
      setError(
        err.response?.data?.message || "An error occurred during registration. Please try again."
      );
      console.error("Registration failed:", err);
    }
  };

  // --- JSX Rendering ---
  return (
    <div className="CReg-form-container">
      <div className="CReg-form-wrapper"> {/* Added Wrapper */}
        <h2 className="CReg-form-title">Client Registration</h2>

        {/* Feedback Messages */}
        {error && <div className="CReg-error-message">{error}</div>}
        {success && <div className="CReg-success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="CReg-form-group">
            <label htmlFor="CReg-name">Name*</label>
            <input
              type="text"
              id="CReg-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div className="CReg-form-group">
            <label htmlFor="CReg-email">Email*</label>
            <input
              type="email"
              id="CReg-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
              disabled={loading}
            />
          </div>

          {/* Contact Number */}
          <div className="CReg-form-group">
            <label htmlFor="CReg-contactNumber">Contact Number*</label>
            <input
              type="tel"
              id="CReg-contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="e.g., 07XXXXXXXX"
              required
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="CReg-form-group">
            <label htmlFor="CReg-password">Password*</label>
            <input
              type="password"
              id="CReg-password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password (min 6 chars)"
              required
              minLength="6"
              disabled={loading}
            />
          </div>

          {/* Address */}
          <div className="CReg-form-group">
            <label htmlFor="CReg-address">Address*</label>
            <textarea
              id="CReg-address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your complete address"
              rows="3" // Adjusted rows
              required
              disabled={loading}
            ></textarea>
          </div>

          {/* District & Province */}
          <div className="CReg-form-group CReg-horizontal">
            <div className="CReg-input-group"> {/* Explicit inner group class */}
              <label htmlFor="CReg-district">District*</label>
              <select
                id="CReg-district"
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="" disabled>Select District</option>
                 {/* Add all Sri Lankan districts */}
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

            <div className="CReg-input-group"> {/* Explicit inner group class */}
              <label htmlFor="CReg-province">Province*</label>
              <select
                id="CReg-province"
                name="province"
                value={formData.province}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="" disabled>Select Province</option>
                 {/* Add Sri Lankan provinces */}
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

          {/* Profile Photo Input */}
          <div className="CReg-form-group CReg-file-input-group"> {/* File input class */}
            <label>Profile Photo (Optional)</label>
            <input
              type="file"
              id="CReg-profile-photo" // Prefixed ID
              onChange={handleFileChange}
              accept="image/jpeg, image/png, image/gif" // Specify accepted types
              style={{ display: 'none' }} // Hide default input
              disabled={loading}
            />
            {/* Custom styled button as label */}
            <label htmlFor="CReg-profile-photo" className={`CReg-upload-button ${loading ? 'CReg-disabled' : ''}`}>
              {profilePhotoFile ? `Selected: ${profilePhotoFile.name}` : "Choose Profile Photo"}
            </label>

            {/* Image Preview */}
            {profilePreview && (
              <div className="CReg-image-preview-container">
                <img
                  src={profilePreview}
                  alt="Profile Preview"
                  className="CReg-image-preview"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="CReg-submit-button"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div> {/* End of CReg-form-wrapper */}
    </div> // End of CReg-form-container
  );
}

export default ClientForm;