import React, { useState, useEffect } from 'react';
import './ItemsCartManage.css';

const ItemsCartManage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [editQuantity, setEditQuantity] = useState(1);
  const [editColor, setEditColor] = useState('');
  const [editSize, setEditSize] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [quotations, setQuotations] = useState([]);
  const [showQuotationsList, setShowQuotationsList] = useState(false);
  const [apiAvailable, setApiAvailable] = useState(true);

  useEffect(() => {
    fetchCartItems();
    checkQuotationApi();
  }, []);

  const checkQuotationApi = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await fetch('http://localhost:5003/api/test-quotations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setApiAvailable(true);
        fetchUserQuotations();
      } else {
        console.warn('Quotation API not available');
        setApiAvailable(false);
      }
    } catch (error) {
      console.warn('Quotation API check failed:', error);
      setApiAvailable(false);
    }
  };

  const fetchCartItems = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please login to view your cart');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5003/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setCartItems(result.data || []);
      } else {
        setError(result.message || 'Failed to fetch cart items');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to connect to server: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserQuotations = async () => {
    if (!apiAvailable) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await fetch('http://localhost:5003/api/quotations/my-requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          setApiAvailable(false);
        }
        return;
      }
      
      const result = await response.json();
      
      if (result.success) {
        setQuotations(result.data);
      }
    } catch (error) {
      console.error('Fetch quotations error:', error);
    }
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(item => item._id));
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5003/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: newQuantity })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setCartItems(prev => 
          prev.map(item => 
            item._id === itemId 
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
        setSuccess('Cart updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.message || 'Failed to update cart');
      }
    } catch (error) {
      console.error('Update error:', error);
      setError('Failed to connect to server: ' + error.message);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5003/api/cart/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        setCartItems(prev => prev.filter(item => item._id !== itemId));
        setSelectedItems(prev => prev.filter(id => id !== itemId));
        setSuccess('Item removed from cart!');
        setDeleteConfirm(null);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.message || 'Failed to remove item');
      }
    } catch (error) {
      console.error('Remove error:', error);
      setError('Failed to connect to server: ' + error.message);
    }
  };

  const handleRemoveSelected = async () => {
    if (selectedItems.length === 0) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5003/api/cart/remove-multiple', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ itemIds: selectedItems })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setCartItems(prev => prev.filter(item => !selectedItems.includes(item._id)));
        setSelectedItems([]);
        setSuccess('Selected items removed from cart!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.message || 'Failed to remove items');
      }
    } catch (error) {
      console.error('Remove selected error:', error);
      setError('Failed to connect to server: ' + error.message);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setEditQuantity(item.quantity);
    setEditColor(item.selectedColor || '');
    setEditSize(item.selectedSize || '');
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5003/api/cart/${editingItem._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quantity: editQuantity,
          selectedColor: editColor,
          selectedSize: editSize
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setCartItems(prev => 
          prev.map(item => 
            item._id === editingItem._id 
              ? { 
                  ...item, 
                  quantity: editQuantity,
                  selectedColor: editColor,
                  selectedSize: editSize
                }
              : item
          )
        );
        setEditingItem(null);
        setSuccess('Item updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.message || 'Failed to update item');
      }
    } catch (error) {
      console.error('Edit error:', error);
      setError('Failed to connect to server: ' + error.message);
    }
  };

  const handleRequestQuotation = async () => {
    if (!apiAvailable) {
      setError('Quotation service is currently unavailable. Please try again later.');
      return;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please login to request a quotation');
        setLoading(false);
        return;
      }

      const quotationItems = cartItems.map(item => {
        const itemId = item.productId || item._id;
        if (!itemId) {
          throw new Error('Item is missing ID');
        }

        return {
          itemId: itemId,
          name: item.name || 'Unknown Item',
          price: parseFloat(item.price) || 0,
          discountedPrice: parseFloat(item.discountedPrice) || parseFloat(item.price) || 0,
          discount: parseFloat(item.discount) || 0,
          quantity: parseInt(item.quantity) || 1,
          unit: item.unit || 'piece',
          image: item.image || '',
          selectedColor: item.selectedColor || '',
          selectedSize: item.selectedSize || ''
        };
      });

      const subtotal = calculateSubtotal();
      
      const requestBody = {
        items: quotationItems,
        totalAmount: parseFloat(subtotal) || 0
      };

      console.log('Sending quotation request:', JSON.stringify(requestBody, null, 2));

      const response = await fetch('http://localhost:5003/api/quotations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const responseText = await response.text();
      console.log('Response status:', response.status);
      console.log('Response text:', responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        throw new Error(`Server returned invalid response. Status: ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(result.message || `Server error: ${response.status}`);
      }

      if (result.success) {
        setShowQuotationModal(true);
        await fetchUserQuotations();
      } else {
        setError(result.message || 'Failed to request quotation');
      }
    } catch (error) {
      console.error('Quotation error:', error);
      setError('Failed to request quotation: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseQuotationModal = () => {
    setShowQuotationModal(false);
  };

  const handleViewMyQuotations = () => {
    setShowQuotationsList(true);
    setShowQuotationModal(false);
    fetchUserQuotations();
  };

  const handleCloseQuotationsList = () => {
    setShowQuotationsList(false);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.discountedPrice || item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const calculateSelectedSubtotal = () => {
    return cartItems
      .filter(item => selectedItems.includes(item._id))
      .reduce((total, item) => {
        const price = item.discountedPrice || item.price;
        return total + (price * item.quantity);
      }, 0);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/100';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) return `http://localhost:5003${imagePath}`;
    return `http://localhost:5003/uploads/items/${imagePath}`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'pending': return 'ICManage-status-pending';
      case 'approved': return 'ICManage-status-approved';
      case 'rejected': return 'ICManage-status-rejected';
      case 'completed': return 'ICManage-status-completed';
      default: return '';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'Your quotation is being reviewed by admin';
      case 'approved': return 'Your quotation has been approved! Prepare for checkout';
      case 'rejected': return 'Your quotation has been rejected. Please contact admin';
      case 'completed': return 'Quotation completed successfully';
      default: return '';
    }
  };

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

  const getColorName = (colorId) => {
    const color = colorOptions.find(c => c.id === colorId);
    return color ? color.name : colorId;
  };

  const getPendingQuotationsCount = () => {
    return quotations.filter(q => q.status === 'pending').length;
  };

  const getApprovedQuotationsCount = () => {
    return quotations.filter(q => q.status === 'approved').length;
  };

  return (
    <div className="ICManage-container">
      <div className="ICManage-header">
        <h1 className="ICManage-title">Shopping Cart</h1>
        <div className="ICManage-headerActions">
          {apiAvailable && quotations.length > 0 && (
            <button 
              className="ICManage-viewQuotationsBtn"
              onClick={() => setShowQuotationsList(true)}
            >
              My Quotations ({getPendingQuotationsCount()} pending)
            </button>
          )}
          {selectedItems.length > 0 && (
            <button 
              className="ICManage-removeSelected"
              onClick={handleRemoveSelected}
            >
              Remove Selected ({selectedItems.length})
            </button>
          )}
        </div>
      </div>

      {success && (
        <div className="ICManage-success">
          <span>{success}</span>
          <button className="ICManage-successClose" onClick={() => setSuccess('')}>×</button>
        </div>
      )}

      {error && (
        <div className="ICManage-error">
          <span>{error}</span>
          <button className="ICManage-errorClose" onClick={() => setError('')}>×</button>
        </div>
      )}

      {apiAvailable && getApprovedQuotationsCount() > 0 && (
        <div className="ICManage-quotationAlert">
          <div className="ICManage-quotationAlertIcon">✓</div>
          <div className="ICManage-quotationAlertContent">
            <h3>Quotation Approved!</h3>
            <p>You have {getApprovedQuotationsCount()} approved quotation(s). Click "My Quotations" to view and proceed.</p>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="ICManage-modalOverlay">
          <div className="ICManage-confirmModal">
            <h3>Confirm Remove</h3>
            <p>Are you sure you want to remove "{deleteConfirm.name}" from your cart?</p>
            <div className="ICManage-confirmActions">
              <button
                className="ICManage-confirmCancel"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="ICManage-confirmDelete"
                onClick={() => handleRemoveItem(deleteConfirm._id)}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {editingItem && (
        <div className="ICManage-modalOverlay">
          <div className="ICManage-editModal">
            <div className="ICManage-editHeader">
              <h2>Edit Cart Item</h2>
              <button 
                className="ICManage-editClose"
                onClick={() => setEditingItem(null)}
              >
                ×
              </button>
            </div>
            <div className="ICManage-editContent">
              <div className="ICManage-editImage">
                <img 
                  src={getImageUrl(editingItem.image)} 
                  alt={editingItem.name} 
                />
              </div>
              <div className="ICManage-editDetails">
                <h3>{editingItem.name}</h3>
                <div className="ICManage-editPrice">
                  Rs. {formatPrice(editingItem.discountedPrice || editingItem.price)}
                </div>

                {editingItem.colors && editingItem.colors.length > 0 && (
                  <div className="ICManage-editField">
                    <label>Color:</label>
                    <div className="ICManage-editColors">
                      {colorOptions
                        .filter(color => editingItem.colors.includes(color.id))
                        .map(color => (
                          <button
                            key={color.id}
                            className={`ICManage-editColorBtn ${editColor === color.id ? 'selected' : ''}`}
                            onClick={() => setEditColor(color.id)}
                          >
                            <span 
                              className="ICManage-editColorDot" 
                              style={{ backgroundColor: color.color }}
                            />
                            {color.name}
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                {editingItem.sizes && editingItem.sizes.length > 0 && (
                  <div className="ICManage-editField">
                    <label>Size:</label>
                    <div className="ICManage-editSizes">
                      {sizeOptions
                        .filter(size => editingItem.sizes.includes(size.id))
                        .map(size => (
                          <button
                            key={size.id}
                            className={`ICManage-editSizeBtn ${editSize === size.id ? 'selected' : ''}`}
                            onClick={() => setEditSize(size.id)}
                          >
                            {size.name}
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                <div className="ICManage-editField">
                  <label>Quantity:</label>
                  <div className="ICManage-editQuantity">
                    <button 
                      onClick={() => setEditQuantity(Math.max(1, editQuantity - 1))}
                      className="ICManage-editQtyBtn"
                    >
                      -
                    </button>
                    <span className="ICManage-editQtyValue">{editQuantity}</span>
                    <button 
                      onClick={() => setEditQuantity(editQuantity + 1)}
                      className="ICManage-editQtyBtn"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="ICManage-editTotal">
                  Total: Rs. {formatPrice((editingItem.discountedPrice || editingItem.price) * editQuantity)}
                </div>
              </div>
            </div>
            <div className="ICManage-editActions">
              <button 
                className="ICManage-editCancel"
                onClick={() => setEditingItem(null)}
              >
                Cancel
              </button>
              <button 
                className="ICManage-editSave"
                onClick={handleSaveEdit}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {showQuotationModal && (
        <div className="ICManage-modalOverlay" onClick={handleCloseQuotationModal}>
          <div className="ICManage-quotationModal" onClick={(e) => e.stopPropagation()}>
            <div className="ICManage-quotationModalHeader">
              <div className="ICManage-quotationModalIcon">✓</div>
              <h2>Quotation Request Sent!</h2>
              <button className="ICManage-quotationModalClose" onClick={handleCloseQuotationModal}>×</button>
            </div>
            <div className="ICManage-quotationModalBody">
              <p>Your quotation request has been successfully submitted to the admin.</p>
              <p className="ICManage-quotationModalNote">You will be notified once the admin reviews your request.</p>
              <div className="ICManage-quotationModalActions">
                <button 
                  className="ICManage-quotationModalViewBtn"
                  onClick={handleViewMyQuotations}
                >
                  View My Quotations
                </button>
                <button 
                  className="ICManage-quotationModalCloseBtn"
                  onClick={handleCloseQuotationModal}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showQuotationsList && (
        <div className="ICManage-modalOverlay" onClick={handleCloseQuotationsList}>
          <div className="ICManage-quotationsListModal" onClick={(e) => e.stopPropagation()}>
            <div className="ICManage-quotationsListHeader">
              <h2>My Quotations</h2>
              <button className="ICManage-quotationsListClose" onClick={handleCloseQuotationsList}>×</button>
            </div>
            <div className="ICManage-quotationsListBody">
              {quotations.length === 0 ? (
                <div className="ICManage-noQuotations">
                  <p>No quotations found</p>
                </div>
              ) : (
                quotations.map(quotation => (
                  <div key={quotation._id} className="ICManage-quotationCard">
                    <div className="ICManage-quotationCardHeader">
                      <span className="ICManage-quotationId">{quotation.quotationId}</span>
                      <span className={`ICManage-quotationStatus ${getStatusBadgeClass(quotation.status)}`}>
                        {quotation.status}
                      </span>
                    </div>
                    <div className="ICManage-quotationCardBody">
                      <div className="ICManage-quotationInfo">
                        <span>Items: {quotation.items.length}</span>
                        <span>Total: Rs. {formatPrice(quotation.totalAmount)}</span>
                        <span>Date: {formatDate(quotation.requestedAt)}</span>
                      </div>
                      <p className="ICManage-quotationMessage">
                        {getStatusText(quotation.status)}
                      </p>
                      {quotation.adminNotes && (
                        <div className="ICManage-quotationAdminNotes">
                          <strong>Admin Notes:</strong>
                          <p>{quotation.adminNotes}</p>
                        </div>
                      )}
                      {quotation.status === 'approved' && (
                        <button className="ICManage-quotationProceedBtn">
                          Proceed to Checkout
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="ICManage-loading">Loading cart...</div>
      ) : cartItems.length === 0 ? (
        <div className="ICManage-emptyCart">
          <div className="ICManage-emptyIcon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any items to your cart yet.</p>
          <button 
            className="ICManage-shopButton"
            onClick={() => window.location.href = '/ItemMarket'}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="ICManage-cartHeader">
            <div className="ICManage-selectAll">
              <input
                type="checkbox"
                checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                onChange={handleSelectAll}
                id="selectAll"
              />
              <label htmlFor="selectAll">Select All ({cartItems.length} items)</label>
            </div>
          </div>

          <div className="ICManage-cartContent">
            <div className="ICManage-cartItems">
              {cartItems.map(item => (
                <div key={item._id} className="ICManage-cartItem">
                  <div className="ICManage-itemCheckbox">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item._id)}
                      onChange={() => handleSelectItem(item._id)}
                    />
                  </div>
                  
                  <div className="ICManage-itemImage">
                    <img src={getImageUrl(item.image)} alt={item.name} />
                  </div>
                  
                  <div className="ICManage-itemDetails">
                    <h3 className="ICManage-itemName">{item.name}</h3>
                    
                    {item.description && (
                      <p className="ICManage-itemDescription">{item.description.substring(0, 60)}...</p>
                    )}
                    
                    <div className="ICManage-itemOptions">
                      {item.selectedColor && (
                        <span className="ICManage-itemOption">
                          Color: {getColorName(item.selectedColor)}
                        </span>
                      )}
                      {item.selectedSize && (
                        <span className="ICManage-itemOption">
                          Size: {item.selectedSize}
                        </span>
                      )}
                    </div>
                    
                    <div className="ICManage-itemPrice">
                      {item.discount > 0 ? (
                        <>
                          <span className="ICManage-discountedPrice">
                            Rs. {formatPrice(item.discountedPrice)}
                          </span>
                          <span className="ICManage-originalPrice">
                            Rs. {formatPrice(item.price)}
                          </span>
                          <span className="ICManage-discountBadge">
                            {item.discount}% OFF
                          </span>
                        </>
                      ) : (
                        <span className="ICManage-regularPrice">
                          Rs. {formatPrice(item.price)}
                        </span>
                      )}
                      <span className="ICManage-unit">/{item.unit}</span>
                    </div>
                  </div>
                  
                  <div className="ICManage-itemActions">
                    <div className="ICManage-quantityControls">
                      <button 
                        className="ICManage-quantityBtn"
                        onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="ICManage-quantityValue">{item.quantity}</span>
                      <button 
                        className="ICManage-quantityBtn"
                        onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="ICManage-itemTotal">
                      Rs. {formatPrice((item.discountedPrice || item.price) * item.quantity)}
                    </div>
                    
                    <div className="ICManage-actionButtons">
                      <button 
                        className="ICManage-editBtn"
                        onClick={() => handleEditItem(item)}
                      >
                        Edit
                      </button>
                      <button 
                        className="ICManage-removeBtn"
                        onClick={() => setDeleteConfirm(item)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="ICManage-cartSummary">
              <h3 className="ICManage-summaryTitle">Order Summary</h3>
              
              <div className="ICManage-summaryRow">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>Rs. {formatPrice(calculateSubtotal())}</span>
              </div>
              
              {selectedItems.length > 0 && (
                <div className="ICManage-summaryRow ICManage-selectedRow">
                  <span>Selected items ({selectedItems.length})</span>
                  <span>Rs. {formatPrice(calculateSelectedSubtotal())}</span>
                </div>
              )}
              
              <div className="ICManage-summaryRow ICManage-totalRow">
                <span>Total</span>
                <span>Rs. {formatPrice(calculateSubtotal())}</span>
              </div>
              
              <button 
                className="ICManage-quotationBtn"
                onClick={handleRequestQuotation}
                disabled={cartItems.length === 0 || !apiAvailable}
                style={{ opacity: !apiAvailable ? 0.5 : 1 }}
              >
                {!apiAvailable ? 'Quotation Service Unavailable' : 'Request Quotation'}
              </button>
              
              <button 
                className="ICManage-continueShopping"
                onClick={() => window.location.href = '/ItemMarket'}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ItemsCartManage;