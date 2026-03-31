import React, { useState, useEffect } from 'react';
import './BuyandSellManage.css';

const BuyandSellManage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    oldPrice: '',
    type: '',
    condition: 'Good',
    brand: '',
    address: '',
    phoneNumber: '',
    imagePath: null,
    additionalImages: []
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [additionalPreviews, setAdditionalPreviews] = useState([]);
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const categoryOptions = ['Doors', 'Windows', 'Pan-Light', 'Glass', 'Others'];
  const conditionOptions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

  useEffect(() => {
    fetchItems();
  }, []);

  const notifyProductsUpdated = () => {
    window.dispatchEvent(new Event('products-updated'));
  };

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5003/api/buy-and-sell', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setItems(result.data);
      } else {
        setError(result.message || 'Failed to fetch items');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to connect to server: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      oldPrice: '',
      type: '',
      condition: 'Good',
      brand: '',
      address: '',
      phoneNumber: '',
      imagePath: null,
      additionalImages: []
    });
    setImagePreview(null);
    setImageFile(null);
    setAdditionalPreviews([]);
    setAdditionalFiles([]);
    setFormErrors({});
    setEditingItem(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({ ...prev, imagePath: 'Image size should be less than 5MB' }));
        return;
      }
      if (!file.type.match('image.*')) {
        setFormErrors(prev => ({ ...prev, imagePath: 'Please upload an image file' }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageFile(file);
      };
      reader.readAsDataURL(file);
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
    setAdditionalFiles(prev => [...prev, ...files]);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };

  const removeAdditionalImage = (index) => {
    setAdditionalPreviews(prev => prev.filter((_, i) => i !== index));
    setAdditionalFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name?.trim()) errors.name = 'Product name is required';
    else if (formData.name.trim().length < 3) errors.name = 'Name must be at least 3 characters';
    if (!formData.price) errors.price = 'Price is required';
    else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) errors.price = 'Price must be a positive number';
    if (!formData.type) errors.type = 'Category is required';
    if (!formData.address?.trim()) errors.address = 'Address is required';
    if (!formData.phoneNumber?.trim()) errors.phoneNumber = 'Phone number is required';
    if (!imageFile && !imagePreview && !editingItem) errors.imagePath = 'Product image is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('description', formData.description.trim() || '');
      formDataToSend.append('price', formData.price);
      if (formData.oldPrice) formDataToSend.append('oldPrice', formData.oldPrice);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('condition', formData.condition);
      formDataToSend.append('brand', formData.brand.trim() || '');
      formDataToSend.append('address', formData.address.trim());
      formDataToSend.append('phoneNumber', formData.phoneNumber.trim());
      
      if (imageFile) {
        formDataToSend.append('imagePath', imageFile);
      }

      additionalFiles.forEach(file => {
        formDataToSend.append('additionalImages', file);
      });

      let response;
      
      if (editingItem) {
        response = await fetch(`http://localhost:5003/api/buy-and-sell/${editingItem._id}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formDataToSend
        });
      } else {
        response = await fetch('http://localhost:5003/api/buy-and-sell', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formDataToSend
        });
      }

      const result = await response.json();
      
      if (result.success) {
        setSuccess(editingItem ? 'Item updated successfully!' : 'Item added successfully!');
        await fetchItems();
        notifyProductsUpdated();
        resetForm();
        setShowAddForm(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setError('Failed to connect to server: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5003/api/buy-and-sell/${itemId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSuccess('Item deleted successfully!');
        await fetchItems();
        notifyProductsUpdated();
        setDeleteConfirm(null);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setError('Failed to connect to server: ' + error.message);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      description: item.description || '',
      price: item.price || '',
      oldPrice: item.oldPrice || '',
      type: item.type || '',
      condition: item.condition || 'Good',
      brand: item.brand || '',
      address: item.address || '',
      phoneNumber: item.phoneNumber || '',
      imagePath: null,
      additionalImages: []
    });
    if (item.imagePath) {
      setImagePreview(`http://localhost:5003${item.imagePath}`);
    }
    setShowAddForm(true);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/100?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) return `http://localhost:5003${imagePath}`;
    return `http://localhost:5003/uploads/saleitems/${imagePath}`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  return (
    <div className="BSM-container">
      <div className="BSM-header">
        <h1 className="BSM-title">Buy & Sell Management</h1>
        <button 
          className="BSM-addButton"
          onClick={() => {
            resetForm();
            setShowAddForm(true);
          }}
        >
          + Add New Item
        </button>
      </div>

      {success && (
        <div className="BSM-success">
          <span>{success}</span>
          <button className="BSM-successClose" onClick={() => setSuccess('')}>×</button>
        </div>
      )}

      {error && (
        <div className="BSM-error">
          <span>{error}</span>
          <button className="BSM-errorClose" onClick={() => setError('')}>×</button>
        </div>
      )}

      {showAddForm && (
        <div className="BSM-modalOverlay">
          <div className="BSM-modal">
            <div className="BSM-modalHeader">
              <h2>{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
              <button 
                className="BSM-modalClose"
                onClick={() => {
                  setShowAddForm(false);
                  resetForm();
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="BSM-form">
              <div className="BSM-formGrid">
                <div className="BSM-formLeft">
                  <div className="BSM-imageUpload">
                    {imagePreview ? (
                      <div className="BSM-imagePreview">
                        <img src={imagePreview} alt="Preview" />
                        <button 
                          type="button"
                          className="BSM-removeImage"
                          onClick={removeImage}
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <label className="BSM-uploadLabel">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          style={{ display: 'none' }}
                        />
                        <div className="BSM-uploadPlaceholder">
                          <span className="BSM-uploadIcon">+</span>
                          <span>Click to upload main image</span>
                          <span className="BSM-uploadHint">JPG, PNG, GIF (Max 5MB)</span>
                        </div>
                      </label>
                    )}
                  </div>
                  {formErrors.imagePath && <div className="BSM-fieldError">{formErrors.imagePath}</div>}

                  <div className="BSM-additionalImages">
                    <label className="BSM-label">Additional Images</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleAdditionalImages}
                      className="BSM-fileInput"
                    />
                    {additionalPreviews.length > 0 && (
                      <div className="BSM-additionalGrid">
                        {additionalPreviews.map((preview, idx) => (
                          <div key={idx} className="BSM-additionalPreview">
                            <img src={preview} alt={`Additional ${idx}`} />
                            <button
                              type="button"
                              className="BSM-removeAdditional"
                              onClick={() => removeAdditionalImage(idx)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="BSM-formRight">
                  <div className="BSM-fieldGroup">
                    <label className="BSM-label">Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`BSM-input ${formErrors.name ? 'BSM-inputError' : ''}`}
                    />
                    {formErrors.name && <div className="BSM-fieldError">{formErrors.name}</div>}
                  </div>

                  <div className="BSM-fieldGroup">
                    <label className="BSM-label">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="BSM-textarea"
                      rows="3"
                    />
                  </div>

                  <div className="BSM-row">
                    <div className="BSM-fieldGroup">
                      <label className="BSM-label">Price (Rs.) *</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className={`BSM-input ${formErrors.price ? 'BSM-inputError' : ''}`}
                        step="0.01"
                        min="0"
                      />
                      {formErrors.price && <div className="BSM-fieldError">{formErrors.price}</div>}
                    </div>

                    <div className="BSM-fieldGroup">
                      <label className="BSM-label">Original Price (Rs.)</label>
                      <input
                        type="number"
                        name="oldPrice"
                        value={formData.oldPrice}
                        onChange={handleInputChange}
                        className="BSM-input"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="BSM-row">
                    <div className="BSM-fieldGroup">
                      <label className="BSM-label">Category *</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className={`BSM-select ${formErrors.type ? 'BSM-inputError' : ''}`}
                      >
                        <option value="">Select Category</option>
                        {categoryOptions.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      {formErrors.type && <div className="BSM-fieldError">{formErrors.type}</div>}
                    </div>

                    <div className="BSM-fieldGroup">
                      <label className="BSM-label">Condition</label>
                      <select
                        name="condition"
                        value={formData.condition}
                        onChange={handleInputChange}
                        className="BSM-select"
                      >
                        {conditionOptions.map(cond => (
                          <option key={cond} value={cond}>{cond}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="BSM-fieldGroup">
                    <label className="BSM-label">Brand</label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      className="BSM-input"
                    />
                  </div>

                  <div className="BSM-fieldGroup">
                    <label className="BSM-label">Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`BSM-input ${formErrors.address ? 'BSM-inputError' : ''}`}
                    />
                    {formErrors.address && <div className="BSM-fieldError">{formErrors.address}</div>}
                  </div>

                  <div className="BSM-fieldGroup">
                    <label className="BSM-label">Phone Number *</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className={`BSM-input ${formErrors.phoneNumber ? 'BSM-inputError' : ''}`}
                    />
                    {formErrors.phoneNumber && <div className="BSM-fieldError">{formErrors.phoneNumber}</div>}
                  </div>
                </div>
              </div>

              <div className="BSM-formActions">
                <button
                  type="button"
                  className="BSM-cancelButton"
                  onClick={() => {
                    setShowAddForm(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="BSM-submitButton"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : (editingItem ? 'Update Item' : 'Add Item')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="BSM-modalOverlay">
          <div className="BSM-confirmModal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.</p>
            <div className="BSM-confirmActions">
              <button
                className="BSM-confirmCancel"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="BSM-confirmDelete"
                onClick={() => handleDelete(deleteConfirm._id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="BSM-loading">Loading items...</div>
      ) : (
        <div className="BSM-tableContainer">
          <table className="BSM-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Condition</th>
                <th>Price</th>
                <th>Brand</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map(item => (
                  <tr key={item._id}>
                    <td>
                      <img 
                        src={getImageUrl(item.imagePath)} 
                        alt={item.name}
                        className="BSM-tableImage"
                      />
                    </td>
                    <td className="BSM-tableCell">
                      <div className="BSM-productName">{item.name}</div>
                      {item.description && (
                        <div className="BSM-productDescription">{item.description.substring(0, 50)}...</div>
                      )}
                    </td>
                    <td>
                      <span className="BSM-categoryBadge">{item.type}</span>
                    </td>
                    <td>
                      <span className={`BSM-conditionBadge BSM-${item.condition?.toLowerCase().replace(' ', '-')}`}>
                        {item.condition}
                      </span>
                    </td>
                    <td className="BSM-priceCell">
                      <div className="BSM-currentPrice">Rs. {formatPrice(item.price)}</div>
                      {item.oldPrice && item.oldPrice > item.price && (
                        <div className="BSM-oldPrice">Was: Rs. {formatPrice(item.oldPrice)}</div>
                      )}
                    </td>
                    <td>{item.brand || '-'}</td>
                    <td>
                      <div className="BSM-contactInfo">
                        <div className="BSM-phone">{item.phoneNumber}</div>
                        <div className="BSM-address">{item.address.substring(0, 30)}...</div>
                      </div>
                    </td>
                    <td>
                      <div className="BSM-actionButtons">
                        <button
                          className="BSM-editButton"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="BSM-deleteButton"
                          onClick={() => setDeleteConfirm(item)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="BSM-noData">
                    No items found. Click "Add New Item" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BuyandSellManage;