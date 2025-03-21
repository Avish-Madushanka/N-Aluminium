import React, { useState } from "react";
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
    image: "",
    type: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Convert image to Base64 and store it
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result }); // Store Base64 string
      };
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const existingProducts = JSON.parse(localStorage.getItem("products")) || [];
    localStorage.setItem("products", JSON.stringify([...existingProducts, formData]));

    alert("Product added successfully!");
    window.location.href = "/BuyandSell";
  };

  return (
    <div className="sale-form-container">
      <h2 className="form-title">Add Sale Item</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group-row">
          <input
            type="text"
            id="name"
            placeholder="Item Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            id="price"
            placeholder="Price (Rs)"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <textarea
          id="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          id="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />

        <div className="form-group-row">
          <select id="district" value={formData.district} onChange={handleChange}>
            <option value="">District</option>
            <option value="Colombo">Colombo</option>
            <option value="Kandy">Kandy</option>
          </select>

          <select id="province" value={formData.province} onChange={handleChange}>
            <option value="">Province</option>
            <option value="Western">Western</option>
            <option value="Central">Central</option>
          </select>

          <select id="type" value={formData.type} onChange={handleChange}>
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
          placeholder="Contact Number"
          value={formData.contact}
          onChange={handleChange}
          required
        />

        <label className="file-upload">
          Upload Image
          <input type="file" id="imageUpload" accept="image/*" onChange={handleImageUpload} />
        </label>

        {formData.image && <img src={formData.image} alt="Preview" className="image-preview" />}

        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
}

export default SaleForm;
