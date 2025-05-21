// frontend/src/Components/SaleForm/SaleForm.jsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance"; // Ensure this path is correct
import API_ENDPOINTS from "../../apiConfig"; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';
import "./SaleForm.css"; // Ensure this path is correct

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
    if (file) {
        console.log("[SaleForm handleImageUpload] Image selected:", file.name, "Type:", file.type, "Size:", file.size);
        setImageFile(file); // Set the File object
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview); // Clean up previous preview
        }
        setImagePreview(URL.createObjectURL(file)); // Create new preview
    } else {
        console.log("[SaleForm handleImageUpload] No file selected or selection cancelled.");
        setImageFile(null);
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview("");
    }
  };

  useEffect(() => {
    // Cleanup for image preview URL when component unmounts or preview changes
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
      console.warn("[SaleForm Submit] Form submission attempted without an image file selected in state.");
      return;
    }

    // --- Debugging Logs for imageFile state ---
    console.log("[SaleForm Submit] Current imageFile state before appending to FormData:", imageFile);
    if (imageFile instanceof File) {
        console.log("[SaleForm Submit] imageFile is a valid File object. Name:", imageFile.name, "Type:", imageFile.type, "Size:", imageFile.size);
    } else {
        console.error("[SaleForm Submit] CRITICAL: imageFile is NOT a File object. Its current value is:", imageFile, ". This will likely cause upload failure.");
        setError("There was an error with the selected image file. Please try re-selecting the image.");
        return; // Stop submission if imageFile is not a File
    }
    // --- End Debugging Logs ---

    setLoading(true);
    setError('');

    const submissionData = new FormData();
    // Append all text fields from formData state
    Object.keys(formData).forEach(key => {
      submissionData.append(key, formData[key]);
    });
    // Append the file itself. The third argument (filename) is optional but good practice.
    submissionData.append('image', imageFile, imageFile.name); // Field name 'image' must match backend multer config

    // Log FormData contents to help with debugging
    console.log("[SaleForm Submit] FormData prepared. Sending to backend.");
    for (var pair of submissionData.entries()) {
       console.log('[SaleForm FormData Entry]', pair[0]+ ': ' + (pair[1] instanceof File ? `File: ${pair[1].name}, Size: ${pair[1].size}` : pair[1]));
    }

    try {
      // Explicitly ensure we're not setting Content-Type for FormData
      const response = await axiosInstance.post(API_ENDPOINTS.SALE_ITEMS.CREATE, submissionData, {
        headers: {
          // Let axios set the correct multipart/form-data Content-Type with boundary
          'Content-Type': undefined
        }
      });

      setLoading(false);
      console.log("[SaleForm Submit] Product added successfully:", response.data);
      alert("Product added successfully!");
      navigate("/BuyandSell"); // Or to a page showing the user's listed items
    } catch (err) {
      setLoading(false);
      console.error("[SaleForm Submit] Failed to add sale item. Error object:", err);
      if (err.response) {
        console.error("[SaleForm Submit] Server responded with error:", err.response.data);
        setError(err.response?.data?.message || `Server Error: ${err.response.status}. Please try again.`);
      } else if (err.request) {
        console.error("[SaleForm Submit] No response received from server:", err.request);
        setError('Could not connect to the server. Please check your network connection.');
      } else {
        console.error("[SaleForm Submit] Error setting up the request:", err.message);
        setError('An unexpected error occurred while preparing your request.');
      }
    }
  };

  return (
    <div className="sale-form-container">
      <h2 className="form-title">Add Sale Item</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* Name and Price Row */}
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
            min="0"
          />
        </div>

        {/* Description */}
        <textarea
          id="description"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          disabled={loading}
        />

        {/* Address */}
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

        {/* District, Province, Type Row */}
        <div className="form-group-row">
          <select id="district" name="district" value={formData.district} onChange={handleChange} required disabled={loading}>
            <option value="">Select District</option>
            {/* Add other district options here */}
            <option value="colombo">Colombo</option><option value="gampaha">Gampaha</option><option value="kalutara">Kalutara</option><option value="kandy">Kandy</option><option value="matale">Matale</option><option value="nuwara-eliya">Nuwara Eliya</option><option value="galle">Galle</option><option value="matara">Matara</option><option value="hambantota">Hambantota</option><option value="jaffna">Jaffna</option><option value="kilinochchi">Kilinochchi</option><option value="mannar">Mannar</option><option value="vavuniya">Vavuniya</option><option value="mullaitivu">Mullaitivu</option><option value="batticaloa">Batticaloa</option><option value="ampara">Ampara</option><option value="trincomalee">Trincomalee</option><option value="kurunegala">Kurunegala</option><option value="puttalam">Puttalam</option><option value="anuradhapura">Anuradhapura</option><option value="polonnaruwa">Polonnaruwa</option><option value="badulla">Badulla</option><option value="monaragala">Monaragala</option><option value="ratnapura">Ratnapura</option><option value="kegalle">Kegalle</option>
          </select>

          <select id="province" name="province" value={formData.province} onChange={handleChange} required disabled={loading}>
            <option value="">Select Province</option>
            {/* Add other province options here */}
            <option value="western">Western</option><option value="central">Central</option><option value="southern">Southern</option><option value="northern">Northern</option><option value="eastern">Eastern</option><option value="north-western">North Western</option><option value="north-central">North Central</option><option value="uva">Uva</option><option value="sabaragamuwa">Sabaragamuwa</option>
          </select>

          <select id="type" name="type" value={formData.type} onChange={handleChange} required disabled={loading}>
            <option value="">Select Type</option>
            <option value="Doors">Doors</option>
            <option value="Windows">Windows</option>
            <option value="Pan-Light">Pan Light</option>
            <option value="Others">Others</option>
          </select>
        </div>

        {/* Contact Number */}
        <input
          type="tel"
          id="contact"
          name="contact"
          placeholder="Contact Number (e.g., 07XXXXXXXX)"
          value={formData.contact}
          onChange={handleChange}
          required
          disabled={loading}
          pattern="[0-9]{10}"
          title="Please enter a 10-digit contact number"
        />

        {/* Image Upload */}
        <label className={`file-upload ${loading ? 'disabled' : ''}`}>
          {imageFile ? imageFile.name : 'Upload Image (Max 5MB)'}
          <input
            type="file"
            id="imageUpload"
            name="image" // Good practice to have name attribute
            accept="image/png, image/jpeg, image/gif, image/webp" // Be more specific with accepted types
            onChange={handleImageUpload}
            style={{ display: 'none' }} // Keep it hidden, label acts as button
            disabled={loading}
            required // Image is required for form submission
          />
        </label>

        {/* Image Preview */}
        {imagePreview && !loading && (
          <img src={imagePreview} alt="Preview" className="image-preview" />
        )}

        {/* Submit Button */}
        <button type="submit" className="submit-button" disabled={loading || !imageFile}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default SaleForm;