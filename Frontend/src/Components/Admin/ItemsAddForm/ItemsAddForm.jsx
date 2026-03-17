import React, { useState } from 'react';
import './ItemsAddForm.css';

const ItemsAddForm = ({ onAddItem, onClose }) => {
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
    featured: false,
    colors: []
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [apiError, setApiError] = useState('');

  const colorOptions = [
    { id: 'white', name: 'White', color: '#ffffff' },
    { id: 'black', name: 'Black', color: '#000000' },
    { id: 'grey', name: 'Grey', color: '#646464' },
    { id: 'wood', name: 'Wood', color: '#332008' },
    { id: 'maroon', name: 'Maroon', color: '#500f0f' },
    { id: 'blue', name: 'Blue', color: '#141263' },
    { id: 'red', name: 'Red', color: '#c20000' },
    { id: 'green', name: 'Green', color: '#052401' },
    { id: 'cream', name: 'Cream', color: '#fceaba' },
  ];

  const mainCategories = [
    { id: 'glass', name: 'Glass' },
    { id: 'cradding', name: 'Cradding Boards' },
    { id: 'silicon', name: 'Silicon Gum' },
    { id: 'rubber', name: 'Rubber' },
    { id: 'pvc', name: 'PVC-Marble' },
    { id: 'box-bars', name: 'Box Bars' },
    { id: 'u-channels', name: 'U Channels' },
    { id: 'l-bars', name: 'L-Bars' },
    { id: 't-channels', name: 'T-channel' },
    { id: 'j-channels', name: 'J-Channel Bars' },
    { id: 'sivilim', name: 'Sivilim Boards' },
    { id: 'cutters', name: 'Aluminum Cutters' },
    { id: 'grill', name: 'Grill Machines' },
    { id: 'rivet-guns', name: 'Rivet Guns' },
    { id: 'rubber-blade', name: 'Rubber Blade' },
    { id: 'glass-cutters', name: 'Glass Cutters' },
    { id: 'rivet-box', name: 'Rivet Boxs' }
  ];

  const subCategories = {
    glass: ['Glass Cutters', 'Tempered Glass', 'Frosted Glass', 'Glass Panels'],
    cradding: ['PVC Boards', 'Wood Finish', 'Metal Finish', 'Plain Boards'],
    silicon: ['Silicon Sealant', 'Silicon Gun', 'Silicon Tubes', 'Applicators'],
    rubber: ['Rubber Seals', 'Rubber Blades', 'Rubber Strips', 'Gaskets'],
    pvc: ['PVC Sheets', 'Marble Sheets', 'Edge Trims', 'Corner Guards'],
    'box-bars': ['Aluminum Bars', 'Steel Bars', 'Square Bars'],
    'u-channels': ['Aluminum U', 'Steel U', 'Plastic U'],
    'l-bars': ['L-Angles', 'Corner Bars', 'Edge Bars'],
    't-channels': ['Aluminum T', 'Steel T', 'Plastic T'],
    'j-channels': ['J-Trims', 'Edge Trims', 'Channel Bars'],
    'sivilim': ['Standard Boards', 'Premium Boards', 'Waterproof'],
    cutters: ['Blades', 'Cutting Tools', 'Scissors'],
    grill: ['Grill Machines', 'Parts', 'Accessories'],
    'rivet-guns': ['Manual', 'Automatic', 'Heavy Duty'],
    'rubber-blade': ['Standard Blade', 'Heavy Duty', 'Flexible'],
    'glass-cutters': ['Professional', 'Standard', 'Premium'],
    'rivet-box': ['Small', 'Medium', 'Large']
  };

  const units = ['piece', 'kg', 'meter', 'sq ft', 'tube', 'box', 'set', 'dozen'];

  const resetForm = () => {
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
      featured: false,
      colors: []
    });
    setImagePreview(null);
    setImageFile(null);
    setErrors({});
    setTouched({});
    setApiError('');
    setIsSubmitting(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleColorToggle = (colorId) => {
    setFormData(prev => {
      const newColors = prev.colors.includes(colorId)
        ? prev.colors.filter(id => id !== colorId)
        : [...prev.colors, colorId];
      return { ...prev, colors: newColors };
    });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Image size should be less than 5MB'
        }));
        return;
      }
      
      if (!file.type.match('image.*')) {
        setErrors(prev => ({
          ...prev,
          image: 'Please upload an image file'
        }));
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageFile(file);
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
        if (errors.image) {
          setErrors(prev => ({
            ...prev,
            image: null
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Product name must be at least 3 characters';
    }
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.stock && formData.stock !== '0') {
      newErrors.stock = 'Stock is required';
    } else if (isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Stock must be a valid number';
    }
    
    if (formData.discount && (isNaN(formData.discount) || formData.discount < 0 || formData.discount > 100)) {
      newErrors.discount = 'Discount must be between 0 and 100';
    }
    
    if (!imageFile && !imagePreview) {
      newErrors.image = 'Product image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setApiError('');
    
    if (!validateForm()) {
      const allTouched = {};
      Object.keys(formData).forEach(key => {
        allTouched[key] = true;
      });
      setTouched(allTouched);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('description', formData.description.trim() || '');
      formDataToSend.append('price', formData.price);
      formDataToSend.append('unit', formData.unit);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('subCategory', formData.subCategory || formData.category);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('discount', formData.discount || '0');
      formDataToSend.append('featured', formData.featured);
      
      if (formData.colors && formData.colors.length > 0) {
        formData.colors.forEach(color => {
          formDataToSend.append('colors[]', color);
        });
      }
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }
      
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5003/api/items', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSuccessMessage(`✅ "${formData.name}" has been added successfully!`);
        setShowSuccess(true);
        
        if (onAddItem) {
          onAddItem(result.data);
        }
        
        resetForm();
        
        setTimeout(() => {
          setShowSuccess(false);
          setSuccessMessage('');
        }, 3000);
      } else {
        setApiError(result.message || 'Failed to add product');
      }
      
    } catch (error) {
      console.error('Add product error:', error);
      setApiError(error.message || 'Failed to add product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAnother = () => {
    resetForm();
    setShowSuccess(false);
  };

  return (
    <div className="ITADD-page">
      <div className="ITADD-header">
        <h2 className="ITADD-title">Add New Product</h2>
        <button type="button" className="ITADD-close" onClick={onClose}>×</button>
      </div>

      {showSuccess && (
        <div className="ITADD-success-message">
          <div className="ITADD-success-content">
            <span className="ITADD-success-icon">✓</span>
            <span className="ITADD-success-text">{successMessage}</span>
          </div>
          <button type="button" className="ITADD-success-close" onClick={() => setShowSuccess(false)}>×</button>
        </div>
      )}

      {apiError && (
        <div className="ITADD-error-message">
          <div className="ITADD-error-content">
            <span className="ITADD-error-icon">!</span>
            <span>{apiError}</span>
          </div>
          <button type="button" className="ITADD-error-close" onClick={() => setApiError('')}>×</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="ITADD-form">
        <div className="ITADD-twoColumn">
          <div className="ITADD-leftColumn">
            <div className="ITADD-card">
              <h3 className="ITADD-sectionTitle">Product Image</h3>
              <div className="ITADD-imageUpload">
                {imagePreview ? (
                  <div className="ITADD-imagePreview">
                    <img src={imagePreview} alt="Preview" />
                    <button 
                      type="button" 
                      className="ITADD-removeImage"
                      onClick={() => {
                        setImagePreview(null);
                        setImageFile(null);
                        setFormData(prev => ({...prev, image: ''}));
                      }}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="ITADD-uploadLabel">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                    <div className="ITADD-uploadPlaceholder">
                      <span className="ITADD-uploadIcon">+</span>
                      <span>Click to upload image</span>
                      <span className="ITADD-uploadHint">PNG, JPG, GIF up to 5MB</span>
                    </div>
                  </label>
                )}
              </div>
              {errors.image && <div className="ITADD-error">{errors.image}</div>}
            </div>
          </div>

          <div className="ITADD-rightColumn">
            <div className="ITADD-card">
              <h3 className="ITADD-sectionTitle">Product Information</h3>
              
              <div className="ITADD-fields">
                <div className="ITADD-fieldGroup">
                  <label className="ITADD-label">
                    Product Name <span className="ITADD-required">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`ITADD-input ${errors.name && touched.name ? 'error' : ''}`}
                    placeholder="Enter product name"
                  />
                  {errors.name && touched.name && <div className="ITADD-error">{errors.name}</div>}
                </div>

                <div className="ITADD-fieldGroup">
                  <label className="ITADD-label">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="ITADD-textarea"
                    placeholder="Enter product description"
                    rows="4"
                  />
                </div>

                <div className="ITADD-row">
                  <div className="ITADD-fieldGroup">
                    <label className="ITADD-label">
                      Price (Rs) <span className="ITADD-required">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`ITADD-input ${errors.price && touched.price ? 'error' : ''}`}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                    {errors.price && touched.price && <div className="ITADD-error">{errors.price}</div>}
                  </div>

                  <div className="ITADD-fieldGroup">
                    <label className="ITADD-label">Unit</label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      className="ITADD-select"
                    >
                      {units.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="ITADD-row">
                  <div className="ITADD-fieldGroup">
                    <label className="ITADD-label">
                      Category <span className="ITADD-required">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`ITADD-select ${errors.category && touched.category ? 'error' : ''}`}
                    >
                      <option value="">Select Category</option>
                      {mainCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    {errors.category && touched.category && <div className="ITADD-error">{errors.category}</div>}
                  </div>

                  <div className="ITADD-fieldGroup">
                    <label className="ITADD-label">Sub Category</label>
                    <select
                      name="subCategory"
                      value={formData.subCategory}
                      onChange={handleChange}
                      className="ITADD-select"
                      disabled={!formData.category}
                    >
                      <option value="">Select Sub Category</option>
                      {formData.category && subCategories[formData.category]?.map(sub => (
                        <option key={sub} value={sub.toLowerCase().replace(/\s+/g, '-')}>{sub}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="ITADD-row">
                  <div className="ITADD-fieldGroup">
                    <label className="ITADD-label">
                      Stock Quantity <span className="ITADD-required">*</span>
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`ITADD-input ${errors.stock && touched.stock ? 'error' : ''}`}
                      placeholder="0"
                      min="0"
                    />
                    {errors.stock && touched.stock && <div className="ITADD-error">{errors.stock}</div>}
                  </div>

                  <div className="ITADD-fieldGroup">
                    <label className="ITADD-label">Discount (%)</label>
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`ITADD-input ${errors.discount && touched.discount ? 'error' : ''}`}
                      placeholder="0"
                      min="0"
                      max="100"
                    />
                    {errors.discount && touched.discount && <div className="ITADD-error">{errors.discount}</div>}
                  </div>
                </div>

                <div className="ITADD-fieldGroup">
                  <label className="ITADD-label">Available Colors</label>
                  <p className="ITADD-colorHint">Select colors available for this product</p>
                  <div className="ITADD-colorGrid">
                    {colorOptions.map(color => (
                      <div
                        key={color.id}
                        className={`ITADD-colorItem ${formData.colors?.includes(color.id) ? 'selected' : ''}`}
                        onClick={() => handleColorToggle(color.id)}
                      >
                        <span 
                          className="ITADD-colorSwatch" 
                          style={{ backgroundColor: color.color }}
                        />
                        <span className="ITADD-colorName">{color.name}</span>
                        {formData.colors?.includes(color.id) && (
                          <span className="ITADD-colorCheck">✓</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="ITADD-fieldGroup">
                  <label className="ITADD-checkbox">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                    />
                    <span>Mark as Featured Product</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="ITADD-actions">
          <button type="button" className="ITADD-cancel" onClick={onClose}>
            Cancel
          </button>
          <button 
            type="button" 
            className="ITADD-addAnother" 
            onClick={handleAddAnother}
            disabled={isSubmitting}
          >
            Add Another
          </button>
          <button 
            type="submit" 
            className="ITADD-submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItemsAddForm;