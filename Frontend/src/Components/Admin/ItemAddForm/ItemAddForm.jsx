import React, { useState } from 'react';
import './ItemAddForm.css';

const ItemAddForm = ({ onAddItem, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    unit: 'piece',
    category: '',
    subCategory: '',
    image: '',
    stock: '',
    discount: '0',
    featured: false
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  // Category options
  const mainCategories = [
    { id: 'glass', name: 'Glass' },
    { id: 'cradding', name: 'Cradding Boards' },
    { id: 'silicon', name: 'Silicon Gum' },
    { id: 'rubber', name: 'Rubber' },
    { id: 'pvc', name: 'PVC-Marble' },
    { id: 'box-bars', name: 'Box Bars' },
    { id: 'u-channels', name: 'U Channels' },
    { id: 'l-bars', name: 'L-Bars' },
    { id: 'j-channels', name: 'J-Channels' },
    { id: 'cutters', name: 'Cutters' },
    { id: 'grill', name: 'Grill Machines' }
  ];

  // Sub category options based on main category
  const subCategories = {
    glass: ['Glass Cutters', 'Tempered Glass', 'Frosted Glass', 'Glass Panels'],
    cradding: ['PVC Boards', 'Wood Finish', 'Metal Finish', 'Plain Boards'],
    silicon: ['Silicon Sealant', 'Silicon Gun', 'Silicon Tubes', 'Applicators'],
    rubber: ['Rubber Seals', 'Rubber Blades', 'Rubber Strips', 'Gaskets'],
    pvc: ['PVC Sheets', 'Marble Sheets', 'Edge Trims', 'Corner Guards'],
    'box-bars': ['Aluminum Bars', 'Steel Bars', 'Square Bars'],
    'u-channels': ['Aluminum U', 'Steel U', 'Plastic U'],
    'l-bars': ['L-Angles', 'Corner Bars', 'Edge Bars'],
    'j-channels': ['J-Trims', 'Edge Trims', 'Channel Bars'],
    cutters: ['Blades', 'Cutting Tools', 'Scissors'],
    grill: ['Grill Machines', 'Parts', 'Accessories']
  };

  const units = [
    'piece', 'kg', 'meter', 'sq ft', 'tube', 'box', 'set', 'dozen'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        setErrors({
          ...errors,
          image: 'Image size should be less than 5MB'
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({
          ...formData,
          image: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price) newErrors.price = 'Price is required';
    else if (isNaN(formData.price) || formData.price <= 0) newErrors.price = 'Price must be a positive number';
    
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.stock) newErrors.stock = 'Stock is required';
    else if (isNaN(formData.stock) || formData.stock < 0) newErrors.stock = 'Stock must be a valid number';
    
    if (formData.discount && (isNaN(formData.discount) || formData.discount < 0 || formData.discount > 100)) {
      newErrors.discount = 'Discount must be between 0 and 100';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Calculate discounted price if any
    const discountedPrice = formData.discount > 0 
      ? (formData.price * (1 - formData.discount / 100)).toFixed(2)
      : formData.price;
    
    const newItem = {
      ...formData,
      id: Date.now(),
      discountedPrice,
      createdAt: new Date().toISOString()
    };
    
    onAddItem(newItem);
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      price: '',
      unit: 'piece',
      category: '',
      subCategory: '',
      image: '',
      stock: '',
      discount: '0',
      featured: false
    });
    setImagePreview(null);
  };

  return (
    <div className="ItemAddForm-overlay">
      <div className="ItemAddForm-container">
        <div className="ItemAddForm-header">
          <h2 className="ItemAddForm-title">Add New Product</h2>
          <button className="ItemAddForm-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="ItemAddForm-form">
          <div className="ItemAddForm-grid">
            {/* Left Column - Image Upload */}
            <div className="ItemAddForm-imageSection">
              <div className="ItemAddForm-imageUpload">
                {imagePreview ? (
                  <div className="ItemAddForm-imagePreview">
                    <img src={imagePreview} alt="Preview" />
                    <button 
                      type="button" 
                      className="ItemAddForm-removeImage"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData({...formData, image: ''});
                      }}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="ItemAddForm-uploadLabel">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                    <div className="ItemAddForm-uploadPlaceholder">
                      <span className="ItemAddForm-uploadIcon">+</span>
                      <span>Upload Product Image</span>
                      <span className="ItemAddForm-uploadHint">Max size: 5MB</span>
                    </div>
                  </label>
                )}
              </div>
              {errors.image && <div className="ItemAddForm-error">{errors.image}</div>}
            </div>

            {/* Right Column - Form Fields */}
            <div className="ItemAddForm-fields">
              <div className="ItemAddForm-fieldGroup">
                <label className="ItemAddForm-label">
                  Product Name *
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`ItemAddForm-input ${errors.name ? 'error' : ''}`}
                    placeholder="Enter product name"
                  />
                  {errors.name && <div className="ItemAddForm-error">{errors.name}</div>}
                </label>
              </div>

              <div className="ItemAddForm-fieldGroup">
                <label className="ItemAddForm-label">
                  Description *
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className={`ItemAddForm-textarea ${errors.description ? 'error' : ''}`}
                    placeholder="Enter product description"
                    rows="3"
                  />
                  {errors.description && <div className="ItemAddForm-error">{errors.description}</div>}
                </label>
              </div>

              <div className="ItemAddForm-row">
                <div className="ItemAddForm-fieldGroup">
                  <label className="ItemAddForm-label">
                    Price (Rs) *
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className={`ItemAddForm-input ${errors.price ? 'error' : ''}`}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                    {errors.price && <div className="ItemAddForm-error">{errors.price}</div>}
                  </label>
                </div>

                <div className="ItemAddForm-fieldGroup">
                  <label className="ItemAddForm-label">
                    Unit
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      className="ItemAddForm-select"
                    >
                      {units.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <div className="ItemAddForm-row">
                <div className="ItemAddForm-fieldGroup">
                  <label className="ItemAddForm-label">
                    Category *
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`ItemAddForm-select ${errors.category ? 'error' : ''}`}
                    >
                      <option value="">Select Category</option>
                      {mainCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    {errors.category && <div className="ItemAddForm-error">{errors.category}</div>}
                  </label>
                </div>

                <div className="ItemAddForm-fieldGroup">
                  <label className="ItemAddForm-label">
                    Sub Category
                    <select
                      name="subCategory"
                      value={formData.subCategory}
                      onChange={handleChange}
                      className="ItemAddForm-select"
                      disabled={!formData.category}
                    >
                      <option value="">Select Sub Category</option>
                      {formData.category && subCategories[formData.category]?.map(sub => (
                        <option key={sub} value={sub.toLowerCase().replace(/\s+/g, '-')}>{sub}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <div className="ItemAddForm-row">
                <div className="ItemAddForm-fieldGroup">
                  <label className="ItemAddForm-label">
                    Stock Quantity *
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      className={`ItemAddForm-input ${errors.stock ? 'error' : ''}`}
                      placeholder="0"
                      min="0"
                    />
                    {errors.stock && <div className="ItemAddForm-error">{errors.stock}</div>}
                  </label>
                </div>

                <div className="ItemAddForm-fieldGroup">
                  <label className="ItemAddForm-label">
                    Discount (%)
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleChange}
                      className={`ItemAddForm-input ${errors.discount ? 'error' : ''}`}
                      placeholder="0"
                      min="0"
                      max="100"
                    />
                    {errors.discount && <div className="ItemAddForm-error">{errors.discount}</div>}
                  </label>
                </div>
              </div>

              <div className="ItemAddForm-fieldGroup">
                <label className="ItemAddForm-checkbox">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                  />
                  <span>Featured Product</span>
                </label>
              </div>
            </div>
          </div>

          <div className="ItemAddForm-actions">
            <button type="button" className="ItemAddForm-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="ItemAddForm-submit">
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemAddForm;