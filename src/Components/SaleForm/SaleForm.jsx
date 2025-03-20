import React, { useState } from 'react';
import './SaleForm.css';

function SaleForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    district: '',
    province: '',
    price: '',
    contact: '',
    image: null,
    type: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, image: imageUrl });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Retrieve existing products and add new one
    const existingProducts = JSON.parse(localStorage.getItem('products')) || [];
    localStorage.setItem('products', JSON.stringify([...existingProducts, formData]));

    alert("Product added successfully!");
    window.location.href = "/BuyandSell"; // Redirect to Buy & Sell page
  };

  return (
    <div className="item-form-container">
      <h2 className="form-title">Add Sale Item</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Item Name</label>
          <input type="text" id="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" value={formData.description} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input type="number" id="price" value={formData.price} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="contact">Contact Number</label>
          <input type="tel" id="contact" value={formData.contact} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="imageUpload">Upload Image</label>
          <input type="file" id="imageUpload" accept="image/*" onChange={handleImageUpload} />
        </div>

        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
}

export default SaleForm;
