import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Package, X } from 'lucide-react';
import './CheckBuySell.css';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosInstance';
import API_ENDPOINTS from '../../apiConfig';

// Update Modal Component
const UpdateItemModal = ({ item, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: item.name || '',
    description: item.description || '',
    address: item.address || '',
    district: item.district || '',
    province: item.province || '',
    price: item.price || '',
    contact: item.contact || '',
    type: item.type || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.put(
        API_ENDPOINTS.SALE_ITEMS.UPDATE_ONE(item._id),
        formData
      );
      
      setLoading(false);
      if (response.data && response.data.success) {
        onUpdate(response.data.data);
        onClose();
      } else {
        setError('Failed to update item. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      console.error("Error updating item:", err);
      setError(err.response?.data?.message || 'An error occurred while updating the item.');
    }
  };

  return (
    <div className="update-modal-overlay" onClick={onClose}>
      <div className="update-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="update-modal-header">
          <h2>Update Item</h2>
          <button className="close-modal-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        {error && <div className="update-modal-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="update-form">
          <div className="form-group">
            <label htmlFor="name">Item Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="price">Price (Rs)</label>
            <input
              type="number"
              id="price"
              value={formData.price}
              onChange={handleChange}
              required
              disabled={loading}
              min="0"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              value={formData.address}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="district">District</label>
              <select id="district" value={formData.district} onChange={handleChange} required disabled={loading}>
                <option value="">Select District</option>
                <option value="colombo">Colombo</option>
                <option value="gampaha">Gampaha</option>
                <option value="kalutara">Kalutara</option>
                <option value="kandy">Kandy</option>
                <option value="matale">Matale</option>
                <option value="nuwara-eliya">Nuwara Eliya</option>
                <option value="galle">Galle</option>
                <option value="matara">Matara</option>
                <option value="hambantota">Hambantota</option>
                <option value="jaffna">Jaffna</option>
                <option value="kilinochchi">Kilinochchi</option>
                <option value="mannar">Mannar</option>
                <option value="vavuniya">Vavuniya</option>
                <option value="mullaitivu">Mullaitivu</option>
                <option value="batticaloa">Batticaloa</option>
                <option value="ampara">Ampara</option>
                <option value="trincomalee">Trincomalee</option>
                <option value="kurunegala">Kurunegala</option>
                <option value="puttalam">Puttalam</option>
                <option value="anuradhapura">Anuradhapura</option>
                <option value="polonnaruwa">Polonnaruwa</option>
                <option value="badulla">Badulla</option>
                <option value="monaragala">Monaragala</option>
                <option value="ratnapura">Ratnapura</option>
                <option value="kegalle">Kegalle</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="province">Province</label>
              <select id="province" value={formData.province} onChange={handleChange} required disabled={loading}>
                <option value="">Select Province</option>
                <option value="western">Western</option>
                <option value="central">Central</option>
                <option value="southern">Southern</option>
                <option value="northern">Northern</option>
                <option value="eastern">Eastern</option>
                <option value="north-western">North Western</option>
                <option value="north-central">North Central</option>
                <option value="uva">Uva</option>
                <option value="sabaragamuwa">Sabaragamuwa</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="type">Item Type</label>
            <select id="type" value={formData.type} onChange={handleChange} required disabled={loading}>
              <option value="">Select Type</option>
              <option value="Doors">Doors</option>
              <option value="Windows">Windows</option>
              <option value="Pan-Light">Pan Light</option>
              <option value="Others">Others</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="contact">Contact Number</label>
            <input
              type="tel"
              id="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              disabled={loading}
              pattern="[0-9]{10}"
              title="Please enter a 10-digit contact number"
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Updating...' : 'Update Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// MyItemCard Component
const MyItemCard = ({ item, onDelete, onEdit }) => {
  // Construct the full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/150";
    
    // If it's already a full URL, return it
    if (imagePath.startsWith('http')) return imagePath;
    
    // Otherwise, construct the URL using the backend root
    const backendRoot = API_ENDPOINTS.BACKEND_ROOT_URL;
    return `${backendRoot}${imagePath}`;
  };

  const handleDeleteClick = () => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"? This cannot be undone.`)) {
      onDelete(item._id);
    }
  };

  return (
    <div className="my-item-card">
      <img
        src={getImageUrl(item.imagePath)}
        alt={item.name || "Listed item"}
        className="my-item-image"
        onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/150"; }}
      </div>
      <div className="my-item-actions">
        <button onClick={() => onEdit(item)} className="action-btn edit-btn" title="Edit Item">
          <Edit size={16} /> Edit
        </button>
        <button onClick={handleDeleteClick} className="action-btn delete-btn" title="Delete Item">
          <Trash2 size={16} /> Delete
        </button>
      </div>
    </div>
  );
};

// Main CheckBuySell Component
const CheckBuySell = () => {
  const { userInfo } = useAuth();
  const [myItems, setMyItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  // Fetch user's sale items from the backend
  useEffect(() => {
    const fetchUserSaleItems = async () => {
      // This check is now more robust thanks to the outer if-else in useEffect
      // if (!userInfo || !userInfo.id) {
      //   setError("User information not available. Please log in again.");
      //   setIsLoading(false);
      //   return;
      // }

      try {
        setIsLoading(true);
        setError('');
        console.log('[CheckBuySell] Current User Info for fetching items:', JSON.stringify(userInfo, null, 2));
        
        // Fetch all sale items
        const response = await axiosInstance.get(API_ENDPOINTS.SALE_ITEMS.GET_ALL);
        console.log('[CheckBuySell] API Response for GET_ALL Sale Items:', JSON.stringify(response.data, null, 2));
        
        if (response.data && response.data.data) {
          const allItems = response.data.data;
          // Filter items by the current user's ID
          const userItems = allItems.filter(
            item => {
              // After populate, item.userId is an object like { _id: '...', name: '...', email: '...' }
              // or null if the user was deleted or populate failed for some reason.
              // userInfo.id is expected to be a string.
              const isMatch = item.userId && typeof item.userId === 'object' && item.userId._id === userInfo.id;
              // console.log(`[FilterDebug] ItemID: ${item._id}, item.userId: ${JSON.stringify(item.userId)}, userInfo.id: ${userInfo.id}, Match: ${isMatch}`);
              return isMatch;
            }
          );
          
          console.log(`[CheckBuySell] Fetched ${userItems.length} items for user ${userInfo.id}`);
          setMyItems(userItems);
        } else {
          console.warn("[CheckBuySell] Unexpected response format:", response.data);
          setMyItems([]);
        }
      } catch (err) {
        console.error("[CheckBuySell] Error fetching user's sale items:", err);
        setError("Failed to load your items. Please try again later.");
        setMyItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (userInfo && userInfo.id) {
      fetchUserSaleItems();
    } else if (!userInfo) {
      setError("User not logged in. Cannot fetch items.");
      setIsLoading(false);
    } else if (!userInfo.id) { // This case handles if userInfo exists but id is missing for some reason
      setError("User ID missing from user information. Please re-login.");
      setIsLoading(false);
    }

  }, [userInfo]);

  // Handle item deletion
  const handleDeleteItem = async (itemId) => {
    try {
      setIsLoading(true);
      
      // Delete the item from the backend
      await axiosInstance.delete(API_ENDPOINTS.SALE_ITEMS.DELETE_ONE(itemId));
      
      // Update the local state
      const updatedItems = myItems.filter(item => item._id !== itemId);
      setMyItems(updatedItems);
      
      setIsLoading(false);
      alert("Item deleted successfully.");
    } catch (err) {
      console.error("[CheckBuySell] Error deleting item:", err);
      setError("Failed to delete item. Please try again.");
      setIsLoading(false);
    }
  };

  // Handle item editing
  const handleEditItem = (item) => {
    setEditingItem(item);
  };

  // Handle item update
  const handleUpdateItem = (updatedItem) => {
    const updatedItems = myItems.map(item => 
      item._id === updatedItem._id ? updatedItem : item
    );
    setMyItems(updatedItems);
  };

  return (
    <div className="my-items-container">
      <h1>My Listed Items</h1>
      <p className='page-description'>Here are the items you have listed for sale.</p>

      {isLoading && <p className="loading-message">Loading your items...</p>}
      {error && <p className="error-message">{error}</p>}

      {!isLoading && !error && (
        <>
          {myItems.length === 0 ? (
            <div className="no-items-message">
              <Package size={40} />
              <p>You haven't listed any items for sale yet.</p>
              <Link to="/SaleForm" className="list-item-link">List Your First Item</Link>
            </div>
          ) : (
            <div className="my-items-grid">
              {myItems.map((item) => (
                <MyItemCard
                  key={item._id}
                  item={item}
                  onDelete={handleDeleteItem}
                  onEdit={handleEditItem}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Update Modal */}
      {editingItem && (
        <UpdateItemModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onUpdate={handleUpdateItem}
        />
      )}
    </div>
  );
};

export default CheckBuySell;
