import React, { useState, useEffect } from 'react';
import './ItemsManage.css';

const ItemsManage = () => {
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
    unit: 'piece',
    category: '',
    subCategory: '',
    image: '',
    stock: '',
    discount: '0',
    featured: false,
    colors: [],
    sizes: []
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

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

  const sizeOptions = [
    { id: '10mm', name: '10mm' },
    { id: '15mm', name: '15mm' },
    { id: '45mm', name: '45mm' },
    { id: '50mm', name: '50mm' },
    { id: '60mm', name: '60mm' },
    { id: '80mm', name: '80mm' },
    { id: '100mm', name: '100mm' },
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
      const response = await fetch('http://localhost:5003/api/items', {
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
      unit: 'piece',
      category: '',
      subCategory: '',
      image: '',
      stock: '',
      discount: '0',
      featured: false,
      colors: [],
      sizes: []
    });
    setImagePreview(null);
    setImageFile(null);
    setFormErrors({});
    setEditingItem(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
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

  const handleSizeToggle = (sizeId) => {
    setFormData(prev => {
      const newSizes = prev.sizes.includes(sizeId)
        ? prev.sizes.filter(id => id !== sizeId)
        : [...prev.sizes, sizeId];
      return { ...prev, sizes: newSizes };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }));
        return;
      }
      if (!file.type.match('image.*')) {
        setFormErrors(prev => ({ ...prev, image: 'Please upload an image file' }));
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

  const validateForm = () => {
    const errors = {};
    if (!formData.name?.trim()) errors.name = 'Product name is required';
    else if (formData.name.trim().length < 3) errors.name = 'Name must be at least 3 characters';
    if (!formData.price) errors.price = 'Price is required';
    else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) errors.price = 'Price must be a positive number';
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.stock && formData.stock !== '0') errors.stock = 'Stock is required';
    else if (isNaN(formData.stock) || parseInt(formData.stock) < 0) errors.stock = 'Stock must be a valid number';
    if (formData.discount && (isNaN(formData.discount) || formData.discount < 0 || formData.discount > 100)) {
      errors.discount = 'Discount must be between 0 and 100';
    }
    if (!imageFile && !imagePreview && !editingItem) errors.image = 'Product image is required';
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

      if (formData.sizes && formData.sizes.length > 0) {
        formData.sizes.forEach(size => {
          formDataToSend.append('sizes[]', size);
        });
      }
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      let response;
      
      if (editingItem) {
        response = await fetch(`http://localhost:5003/api/items/${editingItem._id}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formDataToSend
        });
      } else {
        response = await fetch('http://localhost:5003/api/items', {
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
      
      const response = await fetch(`http://localhost:5003/api/items/${itemId}`, {
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
      unit: item.unit || 'piece',
      category: item.category || '',
      subCategory: item.subCategory || '',
      image: item.image || '',
      stock: item.stock || '',
      discount: item.discount || '0',
      featured: item.featured || false,
      colors: item.colors || [],
      sizes: item.sizes || []
    });
    if (item.image) {
      setImagePreview(`http://localhost:5003${item.image}`);
    }
    setShowAddForm(true);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/100';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5003${imagePath}`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  return (
    <div className="ItemMng-container">
      <div className="ItemMng-header">
        <h1 className="ItemMng-title">Product Management</h1>
        <button 
          className="ItemMng-addButton"
          onClick={() => {
            resetForm();
            setShowAddForm(true);
          }}
        >
          + Add New Product
        </button>
      </div>

      {success && (
        <div className="ItemMng-success">
          <span>{success}</span>
          <button className="ItemMng-successClose" onClick={() => setSuccess('')}>×</button>
        </div>
      )}

      {error && (
        <div className="ItemMng-error">
          <span>{error}</span>
          <button className="ItemMng-errorClose" onClick={() => setError('')}>×</button>
        </div>
      )}

      {showAddForm && (
        <div className="ItemMng-modalOverlay">
          <div className="ItemMng-modal">
            <div className="ItemMng-modalHeader">
              <h2>{editingItem ? 'Edit Product' : 'Add New Product'}</h2>
              <button 
                className="ItemMng-modalClose"
                onClick={() => {
                  setShowAddForm(false);
                  resetForm();
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="ItemMng-form">
              <div className="ItemMng-formGrid">
                <div className="ItemMng-formLeft">
                  <div className="ItemMng-imageUpload">
                    {imagePreview ? (
                      <div className="ItemMng-imagePreview">
                        <img src={imagePreview} alt="Preview" />
                        <button 
                          type="button"
                          className="ItemMng-removeImage"
                          onClick={() => {
                            setImagePreview(null);
                            setImageFile(null);
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <label className="ItemMng-uploadLabel">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          style={{ display: 'none' }}
                        />
                        <div className="ItemMng-uploadPlaceholder">
                          <span className="ItemMng-uploadIcon">+</span>
                          <span>Click to upload image</span>
                        </div>
                      </label>
                    )}
                  </div>
                  {formErrors.image && <div className="ItemMng-fieldError">{formErrors.image}</div>}
                </div>

                <div className="ItemMng-formRight">
                  <div className="ItemMng-fieldGroup">
                    <label className="ItemMng-label">Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`ItemMng-input ${formErrors.name ? 'ItemMng-inputError' : ''}`}
                    />
                    {formErrors.name && <div className="ItemMng-fieldError">{formErrors.name}</div>}
                  </div>

                  <div className="ItemMng-fieldGroup">
                    <label className="ItemMng-label">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="ItemMng-textarea"
                      rows="3"
                    />
                  </div>

                  <div className="ItemMng-row">
                    <div className="ItemMng-fieldGroup">
                      <label className="ItemMng-label">Price *</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className={`ItemMng-input ${formErrors.price ? 'ItemMng-inputError' : ''}`}
                        step="0.01"
                        min="0"
                      />
                      {formErrors.price && <div className="ItemMng-fieldError">{formErrors.price}</div>}
                    </div>

                    <div className="ItemMng-fieldGroup">
                      <label className="ItemMng-label">Unit</label>
                      <select
                        name="unit"
                        value={formData.unit}
                        onChange={handleInputChange}
                        className="ItemMng-select"
                      >
                        {units.map(unit => (
                          <option key={unit} value={unit}>{unit}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="ItemMng-row">
                    <div className="ItemMng-fieldGroup">
                      <label className="ItemMng-label">Category *</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className={`ItemMng-select ${formErrors.category ? 'ItemMng-inputError' : ''}`}
                      >
                        <option value="">Select Category</option>
                        {mainCategories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                      {formErrors.category && <div className="ItemMng-fieldError">{formErrors.category}</div>}
                    </div>

                    <div className="ItemMng-fieldGroup">
                      <label className="ItemMng-label">Sub Category</label>
                      <select
                        name="subCategory"
                        value={formData.subCategory}
                        onChange={handleInputChange}
                        className="ItemMng-select"
                        disabled={!formData.category}
                      >
                        <option value="">Select Sub Category</option>
                        {formData.category && subCategories[formData.category]?.map(sub => (
                          <option key={sub} value={sub.toLowerCase().replace(/\s+/g, '-')}>{sub}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="ItemMng-row">
                    <div className="ItemMng-fieldGroup">
                      <label className="ItemMng-label">Stock *</label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        className={`ItemMng-input ${formErrors.stock ? 'ItemMng-inputError' : ''}`}
                        min="0"
                      />
                      {formErrors.stock && <div className="ItemMng-fieldError">{formErrors.stock}</div>}
                    </div>

                    <div className="ItemMng-fieldGroup">
                      <label className="ItemMng-label">Discount %</label>
                      <input
                        type="number"
                        name="discount"
                        value={formData.discount}
                        onChange={handleInputChange}
                        className={`ItemMng-input ${formErrors.discount ? 'ItemMng-inputError' : ''}`}
                        min="0"
                        max="100"
                      />
                      {formErrors.discount && <div className="ItemMng-fieldError">{formErrors.discount}</div>}
                    </div>
                  </div>

                  <div className="ItemMng-fieldGroup">
                    <label className="ItemMng-checkbox">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleInputChange}
                      />
                      <span>Mark as Featured Product</span>
                    </label>
                  </div>

                  <div className="ItemMng-fieldGroup">
                    <label className="ItemMng-label">Available Colors</label>
                    <div className="ItemMng-colorGrid">
                      {colorOptions.map(color => (
                        <div
                          key={color.id}
                          className={`ItemMng-colorItem ${formData.colors.includes(color.id) ? 'ItemMng-colorSelected' : ''}`}
                          onClick={() => handleColorToggle(color.id)}
                        >
                          <span className="ItemMng-colorSwatch" style={{ backgroundColor: color.color }} />
                          <span className="ItemMng-colorName">{color.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="ItemMng-fieldGroup">
                    <label className="ItemMng-label">Available Sizes</label>
                    <div className="ItemMng-sizeGrid">
                      {sizeOptions.map(size => (
                        <div
                          key={size.id}
                          className={`ItemMng-sizeItem ${formData.sizes.includes(size.id) ? 'ItemMng-sizeSelected' : ''}`}
                          onClick={() => handleSizeToggle(size.id)}
                        >
                          <span className="ItemMng-sizeName">{size.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="ItemMng-formActions">
                <button
                  type="button"
                  className="ItemMng-cancelButton"
                  onClick={() => {
                    setShowAddForm(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ItemMng-submitButton"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : (editingItem ? 'Update Product' : 'Add Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="ItemMng-modalOverlay">
          <div className="ItemMng-confirmModal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.</p>
            <div className="ItemMng-confirmActions">
              <button
                className="ItemMng-confirmCancel"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="ItemMng-confirmDelete"
                onClick={() => handleDelete(deleteConfirm._id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="ItemMng-loading">Loading products...</div>
      ) : (
        <div className="ItemMng-tableContainer">
          <table className="ItemMng-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Discount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map(item => (
                  <tr key={item._id}>
                    <td>
                      <img 
                        src={getImageUrl(item.image)} 
                        alt={item.name}
                        className="ItemMng-tableImage"
                      />
                    </td>
                    <td className="ItemMng-tableCell">
                      <div className="ItemMng-productName">{item.name}</div>
                      {item.description && (
                        <div className="ItemMng-productDescription">{item.description.substring(0, 50)}...</div>
                      )}
                    </td>
                    <td>
                      <span className="ItemMng-categoryBadge">
                        {mainCategories.find(c => c.id === item.category)?.name || item.category}
                      </span>
                    </td>
                    <td className="ItemMng-priceCell">
                      <div className="ItemMng-currentPrice">Rs. {formatPrice(item.discountedPrice || item.price)}</div>
                      {item.discount > 0 && (
                        <div className="ItemMng-originalPrice">Rs. {formatPrice(item.price)}</div>
                      )}
                      <div className="ItemMng-unit">/{item.unit}</div>
                    </td>
                    <td>
                      <span className={`ItemMng-stockBadge ${item.inStock ? 'ItemMng-inStock' : 'ItemMng-outOfStock'}`}>
                        {item.stock} {item.inStock ? 'in stock' : 'out of stock'}
                      </span>
                    </td>
                    <td>
                      {item.discount > 0 ? (
                        <span className="ItemMng-discountBadge">{item.discount}% OFF</span>
                      ) : (
                        <span className="ItemMng-noDiscount">-</span>
                      )}
                    </td>
                    <td>
                      {item.featured && (
                        <span className="ItemMng-featuredBadge">Featured</span>
                      )}
                    </td>
                    <td>
                      <div className="ItemMng-actionButtons">
                        <button
                          className="ItemMng-editButton"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="ItemMng-deleteButton"
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
                  <td colSpan="8" className="ItemMng-noData">
                    No products found. Click "Add New Product" to create one.
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

export default ItemsManage;