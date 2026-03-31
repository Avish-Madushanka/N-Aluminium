import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SaleForm.css";

const SaleForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    oldPrice: "",
    type: "",
    condition: "Good",
    brand: "",
    address: "",
    phoneNumber: "",
    imagePath: null,
    additionalImages: []
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [additionalPreviews, setAdditionalPreviews] = useState([]);
  const [errors, setErrors] = useState({});

  const token = localStorage.getItem("token");

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.price || formData.price <= 0) newErrors.price = "Valid price is required";
    if (!formData.type) newErrors.type = "Category is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    if (!formData.imagePath) newErrors.imagePath = "Main image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, imagePath: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      if (errors.imagePath) setErrors(prev => ({ ...prev, imagePath: "" }));
    }
  };

  const handleAdditionalImages = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        if (newPreviews.length === files.length) {
          setAdditionalPreviews(prev => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
    setFormData(prev => ({ ...prev, additionalImages: [...prev.additionalImages, ...files] }));
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, imagePath: null }));
    setImagePreview(null);
  };

  const removeAdditionalImage = (index) => {
    setFormData(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index)
    }));
    setAdditionalPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("description", formData.description);
    submitData.append("price", formData.price);
    if (formData.oldPrice) submitData.append("oldPrice", formData.oldPrice);
    submitData.append("type", formData.type);
    submitData.append("condition", formData.condition);
    submitData.append("brand", formData.brand);
    submitData.append("address", formData.address);
    submitData.append("phoneNumber", formData.phoneNumber);
    submitData.append("imagePath", formData.imagePath);
    
    formData.additionalImages.forEach((img) => {
      submitData.append("additionalImages", img);
    });

    try {
      const response = await axios.post("http://localhost:5003/api/buy-and-sell", submitData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      
      if (response.data.success) {
        setSuccessMessage("Item added successfully!");
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/BSHeader");
        }, 1500);
      }
    } catch (err) {
      console.error("Submit error:", err);
      setErrorMessage(err.response?.data?.message || "Failed to add item");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="SF-saleform-page">
      <div className="SF-saleform-header">
        <h1 className="SF-saleform-title">Sell Your Item</h1>
        <button className="SF-saleform-close" onClick={() => navigate("/BSHeader")}>✕</button>
      </div>

      {successMessage && (
        <div className="SF-saleform-success-message">
          <div className="SF-saleform-success-content">
            <span className="SF-saleform-success-icon">✓</span>
            <span className="SF-saleform-success-text">{successMessage}</span>
          </div>
          <button className="SF-saleform-success-close" onClick={() => setSuccessMessage("")}>✕</button>
        </div>
      )}

      {errorMessage && (
        <div className="SF-saleform-error-message">
          <div className="SF-saleform-error-content">
            <span className="SF-saleform-error-icon">!</span>
            <span className="SF-saleform-error-text">{errorMessage}</span>
          </div>
          <button className="SF-saleform-error-close" onClick={() => setErrorMessage("")}>✕</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="SF-saleform-form">
        <div className="SF-saleform-twoColumn">
          <div className="SF-saleform-card">
            <h3 className="SF-saleform-sectionTitle">Product Images</h3>
            <div className="SF-saleform-imageUpload">
              <label className="SF-saleform-uploadLabel">
                {!imagePreview ? (
                  <div className="SF-saleform-uploadPlaceholder">
                    <div className="SF-saleform-uploadIcon">📷</div>
                    <div>Click to upload main image</div>
                    <div className="SF-saleform-uploadHint">JPG, PNG, GIF (Max 5MB)</div>
                  </div>
                ) : (
                  <div className="SF-saleform-imagePreview">
                    <img src={imagePreview} alt="Preview" />
                    <button type="button" className="SF-saleform-removeImage" onClick={removeImage}>✕</button>
                  </div>
                )}
                <input type="file" name="imagePath" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
              </label>
            </div>
            {errors.imagePath && <div className="SF-saleform-error">{errors.imagePath}</div>}

            <div style={{ marginTop: "20px" }}>
              <label className="SF-saleform-label">Additional Images (Optional)</label>
              <input type="file" name="additionalImages" multiple accept="image/*" onChange={handleAdditionalImages} className="SF-saleform-input" />
              {additionalPreviews.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginTop: "10px" }}>
                  {additionalPreviews.map((preview, idx) => (
                    <div key={idx} style={{ position: "relative" }}>
                      <img src={preview} alt={`Additional ${idx}`} style={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: "8px" }} />
                      <button type="button" onClick={() => removeAdditionalImage(idx)} style={{ position: "absolute", top: "5px", right: "5px", background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: "25px", height: "25px", cursor: "pointer" }}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="SF-saleform-fields">
            <div className="SF-saleform-card">
              <h3 className="SF-saleform-sectionTitle">Basic Information</h3>
              
              <div className="SF-saleform-fieldGroup">
                <label className="SF-saleform-label">Product Name <span className="SF-saleform-required">*</span></label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className={`SF-saleform-input ${errors.name ? "error" : ""}`} placeholder="Enter product name" />
                {errors.name && <div className="SF-saleform-error">{errors.name}</div>}
              </div>

              <div className="SF-saleform-fieldGroup">
                <label className="SF-saleform-label">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} className="SF-saleform-textarea" placeholder="Describe your product in detail" rows="4" />
              </div>

              <div className="SF-saleform-row">
                <div className="SF-saleform-fieldGroup">
                  <label className="SF-saleform-label">Price (Rs.) <span className="SF-saleform-required">*</span></label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} className={`SF-saleform-input ${errors.price ? "error" : ""}`} placeholder="0.00" />
                  {errors.price && <div className="SF-saleform-error">{errors.price}</div>}
                </div>

                <div className="SF-saleform-fieldGroup">
                  <label className="SF-saleform-label">Original Price (Rs.)</label>
                  <input type="number" name="oldPrice" value={formData.oldPrice} onChange={handleInputChange} className="SF-saleform-input" placeholder="0.00" />
                </div>
              </div>

              <div className="SF-saleform-row">
                <div className="SF-saleform-fieldGroup">
                  <label className="SF-saleform-label">Category <span className="SF-saleform-required">*</span></label>
                  <select name="type" value={formData.type} onChange={handleInputChange} className={`SF-saleform-select ${errors.type ? "error" : ""}`}>
                    <option value="">Select Category</option>
                    <option value="Doors">Doors</option>
                    <option value="Windows">Windows</option>
                    <option value="Pan-Light">Pan-Light</option>
                    <option value="Glass">Glass</option>
                    <option value="Others">Others</option>
                  </select>
                  {errors.type && <div className="SF-saleform-error">{errors.type}</div>}
                </div>

                <div className="SF-saleform-fieldGroup">
                  <label className="SF-saleform-label">Condition</label>
                  <select name="condition" value={formData.condition} onChange={handleInputChange} className="SF-saleform-select">
                    <option value="New">New</option>
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
              </div>

              <div className="SF-saleform-fieldGroup">
                <label className="SF-saleform-label">Brand</label>
                <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} className="SF-saleform-input" placeholder="Brand name" />
              </div>
            </div>

            <div className="SF-saleform-card">
              <h3 className="SF-saleform-sectionTitle">Contact Information</h3>
              
              <div className="SF-saleform-fieldGroup">
                <label className="SF-saleform-label">Address <span className="SF-saleform-required">*</span></label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} className={`SF-saleform-input ${errors.address ? "error" : ""}`} placeholder="Your location" />
                {errors.address && <div className="SF-saleform-error">{errors.address}</div>}
              </div>

              <div className="SF-saleform-fieldGroup">
                <label className="SF-saleform-label">Phone Number <span className="SF-saleform-required">*</span></label>
                <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className={`SF-saleform-input ${errors.phoneNumber ? "error" : ""}`} placeholder="077XXXXXXX" />
                {errors.phoneNumber && <div className="SF-saleform-error">{errors.phoneNumber}</div>}
              </div>
            </div>
          </div>
        </div>

        <div className="SF-saleform-actions">
          <button type="button" className="SF-saleform-cancel" onClick={() => navigate("/BSHeader")}>Cancel</button>
          <button type="submit" className="SF-saleform-submit" disabled={loading}>
            {loading ? <span className="SF-saleform-loading"></span> : null}
            {loading ? "Adding..." : "Add Item"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SaleForm;