import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "./SaleForm.css"; // Styles specific to this form

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003/api';

function SaleForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    district: "",
    province: "",
    price: "",
    contact: "",
    type: "", // e.g., Doors, Windows, Pan-Light, Others
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImageFile(file || null);

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview("");
    }
  };

  useEffect(() => {
    // Cleanup object URL on component unmount or when imagePreview changes
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setError("Please upload an image for the item.");
      return;
    }
    // Basic validation for other fields
    for (const key in formData) {
        if (formData[key] === "") {
            setError(`Please fill in the '${key}' field.`);
            return;
        }
    }

    setLoading(true);
    setError('');

    const submissionData = new FormData();
    Object.keys(formData).forEach(key => {
      submissionData.append(key, formData[key]);
    });
    submissionData.append('image', imageFile); // Backend expects 'image'

    // Add user/business owner ID if required by backend
    // const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    // if (userInfo && userInfo.userId) {
    //   submissionData.append('businessOwnerId', userInfo.userId);
    // }

    try {
      // Using the endpoint already in the original file
      const response = await axios.post(`${API_BASE_URL}/saleitems`, submissionData, {
         headers: {
           'Content-Type': 'multipart/form-data',
           // 'Authorization': `Bearer ${localStorage.getItem('token')}` // If auth is needed
         }
      });

      setLoading(false);
      alert("Product added successfully!"); // Replace with better notification
      navigate("/BuyandSell"); // Or a relevant page in business dashboard
    } catch (err) {
      setLoading(false);
      console.error("Failed to add sale item:", err.response || err);
      setError(err.response?.data?.message || 'Failed to add item. Please try again.');
    }
  };

  return (
    // This div's parent in router is .biz-form-container
    <div className="sale-form-content"> 
      <h2 className="form-title">Add Item for Sale</h2>
      {error && <p className="sale-error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="sale-form-group-row">
          <div className="sale-form-group">
            <label htmlFor="name">Item Name</label>
            <input
              type="text"
              id="name" // id matches key in formData
              placeholder="e.g., Teak Door Frame"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="sale-form-group">
            <label htmlFor="price">Price (Rs)</label>
            <input
              type="number"
              id="price" // id matches key in formData
              placeholder="e.g., 15000"
              value={formData.price}
              onChange={handleChange}
              required
              disabled={loading}
              min="0"
            />
          </div>
        </div>

        <div className="sale-form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description" // id matches key in formData
            placeholder="Detailed description of the item"
            value={formData.description}
            onChange={handleChange}
            required
            disabled={loading}
            rows="4"
          />
        </div>

        <div className="sale-form-group">
          <label htmlFor="address">Full Address (for pickup reference)</label>
          <input
            type="text"
            id="address" // id matches key in formData
            placeholder="e.g., 123 Main St, Anytown"
            value={formData.address}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="sale-form-group-row">
          <div className="sale-form-group">
            <label htmlFor="district">District</label>
            <select
              id="district" // id matches key in formData
              value={formData.district}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Select District</option>
              <option value="colombo">Colombo</option>
              <option value="gampaha">Gampaha</option>
              <option value="kalutara">Kalutara</option>
              {/* Add all other districts as in original file */}
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
          <div className="sale-form-group">
            <label htmlFor="province">Province</label>
            <select
              id="province" // id matches key in formData
              value={formData.province}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Select Province</option>
              <option value="western">Western</option>
              <option value="central">Central</option>
              <option value="southern">Southern</option>
              {/* Add all other provinces */}
              <option value="northern">Northern</option>
              <option value="eastern">Eastern</option>
              <option value="north-western">North Western</option>
              <option value="north-central">North Central</option>
              <option value="uva">Uva</option>
              <option value="sabaragamuwa">Sabaragamuwa</option>
            </select>
          </div>
        </div>
        
        <div className="sale-form-group-row">
            <div className="sale-form-group">
                <label htmlFor="type">Item Type</label>
                <select
                    id="type" // id matches key in formData
                    value={formData.type}
                    onChange={handleChange}
                    required
                    disabled={loading}
                >
                    <option value="">Select Type</option>
                    <option value="Doors">Doors</option>
                    <option value="Windows">Windows</option>
                    <option value="Pan-Light">Pan Light</option>
                    <option value="Scrap Aluminium">Scrap Aluminium</option>
                    <option value="Fixtures">Fixtures</option>
                    <option value="Others">Others</option>
                </select>
            </div>
            <div className="sale-form-group">
                <label htmlFor="contact">Contact Number</label>
                <input
                    type="tel"
                    id="contact" // id matches key in formData
                    placeholder="e.g., 07XXXXXXXX"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    pattern="[0-9]{10}" // Basic pattern for 10 digit numbers
                />
            </div>
        </div>
        
        <div className="sale-form-group">
          <label htmlFor="imageUpload">Upload Item Image (Single Image)</label>
          <label htmlFor="imageUpload" className={`sale-file-upload-label ${loading ? 'disabled' : ''} ${imageFile ? 'file-chosen' : ''}`}>
            {imageFile ? imageFile.name : 'Choose Image...'}
          </label>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={loading}
            required 
            style={{ display: 'none' }} // Hide default input
          />
        </div>

        {imagePreview && !loading && (
          <div className="sale-image-preview-container">
            <img src={imagePreview} alt="Item Preview" className="sale-image-preview" />
          </div>
        )}

        <button type="submit" className="sale-submit-button" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Item'}
        </button>
      </form>
    </div>
  );
}

export default SaleForm;