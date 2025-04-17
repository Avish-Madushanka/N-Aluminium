import React, { useState } from "react";
import axios from "axios";
import "./ClientForm.css";

function ClientForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    password: "",
    address: "",
    district: "",
    province: "",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const clientData = new FormData();
      
      Object.keys(formData).forEach(key => {
        clientData.append(key, formData[key]);
      });
      
      if (profilePhoto) {
        clientData.append("profilePhoto", profilePhoto);
      }

      const response = await axios.post(
        "http://localhost:5002/api/clients/register",
        clientData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess("Registration successful!");
      setFormData({
        name: "",
        email: "",
        contactNumber: "",
        password: "",
        address: "",
        district: "",
        province: "",
      });
      setProfilePhoto(null);
      document.getElementById("profile-photo").value = "";
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred during registration"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="clientreg-form-container">
      <h2 className="form-title">Client Registration</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            required
          />
        </div>

        <div className="form-group">
          <label>Contact Number</label>
          <input
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            placeholder="Enter your contact number"
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            required
            minLength="6"
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your complete address"
            rows="4"
            required
          ></textarea>
        </div>

        <div className="form-group horizontal">
          <div>
            <label>District</label>
            <select
              name="district"
              value={formData.district}
              onChange={handleChange}
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

          <div>
            <label>Province</label>
            <select
              name="province"
              value={formData.province}
              onChange={handleChange}
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

        <div className="form-group">
          <label>Profile Photo</label>
          <input 
            type="file" 
            id="profile-photo" 
            onChange={handleFileChange}
            className="hidden-file-input" 
          />
          <label htmlFor="profile-photo" className="upload-button">
            {profilePhoto ? profilePhoto.name : "Choose File"}
          </label>
        </div>

        <button 
          type="submit" 
          className="submit-button" 
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}

export default ClientForm;