import React, { useState } from 'react';
import './SaleForm.css'; 

function SaleForm() {
  const [district, setDistrict] = useState('');
  const [province, setProvince] = useState('');
  const [type, setType] = useState('');
  const [image, setImage] = useState(null);

  const handleDistrictChange = (event) => {
    setDistrict(event.target.value);
  };

  const handleProvinceChange = (event) => {
    setProvince(event.target.value);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  return (
    <div className="item-form-container">
      <h2 className="form-title">Add Item</h2>

      <div className="form-group">
        <label htmlFor="itemName">Item Name</label>
        <input type="text" id="itemName" placeholder="Item Name" />
      </div>

      <div className="form-group">
        <label htmlFor="itemDescription">Description about item</label>
        <textarea id="itemDescription" placeholder="Description about item" rows="4"></textarea>
      </div>

      <div className="form-group">
        <label htmlFor="itemAddress">Address</label>
        <textarea id="itemAddress" placeholder="Address" rows="4"></textarea>
      </div>

      <div className="form-group horizontal">
        <div>
          <label htmlFor="district">District</label>
          <select id="district" value={district} onChange={handleDistrictChange}>
            <option value="">Select District</option>
            <option value="colombo">Colombo</option>
            <option value="kandy">Kandy</option>
            {/* Add more districts */}
          </select>
        </div>

        <div>
          <label htmlFor="province">Province</label>
          <select id="province" value={province} onChange={handleProvinceChange}>
            <option value="">Select Province</option>
            <option value="western">Western</option>
            <option value="central">Central</option>
            {/* Add more provinces */}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="itemPrice">Price</label>
        <input type="number" id="itemPrice" placeholder="Price" />
      </div>

      <div className="form-group">
        <label htmlFor="contactNumber">Contact Number</label>
        <input type="tel" id="contactNumber" placeholder="Contact Number" />
      </div>

      <div className="form-group">
        <label htmlFor="imageUpload">Upload a photo in your device</label>
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
        <label htmlFor="imageUpload" className="upload-button">
          Choose File
        </label>
        {image && (
          <img src={image} alt="Uploaded Item" className="uploaded-image" />
        )}
      </div>

      <div className="form-group">
        <label htmlFor="itemType">Type</label>
        <select id="itemType" value={type} onChange={handleTypeChange}>
          <option value="">Select Type</option>
          <option value="electronics">Electronics</option>
          <option value="furniture">Furniture</option>
          {/* Add more types */}
        </select>
      </div>

      <button type="submit" className="submit-button">Submit</button>
    </div>
  );
}

export default SaleForm;