import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "./SaleForm.css";

function SaleForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    district: "",
    province: "",
    price: "",
    contact: "",
    type: "",
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

    setLoading(true);
    setError('');

    const submissionData = new FormData();
    Object.keys(formData).forEach(key => {
      submissionData.append(key, formData[key]);
    });
    submissionData.append('image', imageFile);

    try {
      const response = await axios.post('http://localhost:5003/api/saleitems', submissionData);

      setLoading(false);
      alert("Product added successfully!");
      navigate("/BuyandSell");
    } catch (err) {
      setLoading(false);
      console.error("Failed to add sale item:", err.response || err);
      setError(err.response?.data?.message || 'Failed to add item. Please try again.');
    }
  };

  return (
    <div className="sale-form-container">
      <h2 className="form-title">Add Sale Item</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group-row">
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Item Name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            type="number"
            id="price"
            name="price"
            placeholder="Price (Rs)"
            value={formData.price}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <textarea
          id="description"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <input
          type="text"
          id="address"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <div className="form-group-row">
          <select
            id="district"
            name="district"
            value={formData.district}
            onChange={handleChange}
            required
            disabled={loading}
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

          <select
            id="province"
            name="province"
            value={formData.province}
            onChange={handleChange}
            required
            disabled={loading}
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

          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">Select Type</option>
            <option value="Doors">Doors</option>
            <option value="Windows">Windows</option>
            <option value="Pan-Light">Pan Light</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <input
          type="tel"
          id="contact"
          name="contact"
          placeholder="Contact Number"
          value={formData.contact}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <label className={`file-upload ${loading ? 'disabled' : ''}`}>
          {imageFile ? imageFile.name : 'Upload Image'}
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
            disabled={loading}
            required
          />
        </label>

        {/* ✅ Only show image preview if not loading */}
        {imagePreview && !loading && (
          <img src={imagePreview} alt="Preview" className="image-preview" />
        )}

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default SaleForm;
