// src/Pages/MyItemsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Package } from 'lucide-react';
import './CheckBuySell.css';

const BACKEND_URL = 'http://localhost:5003';
const LOCAL_STORAGE_KEY = 'mySaleItems';

const MyItemCard = ({ item, onDelete, onEdit }) => {
  const imageUrl = item.image ? `${BACKEND_URL}${item.image}` : "https://via.placeholder.com/150";

  const handleDeleteClick = () => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"? This cannot be undone.`)) {
      onDelete(item._id);
    }
  };

  const handleEditClick = () => {
    onEdit(item._id);
  };

  return (
    <div className="my-item-card">
      <img
        src={imageUrl}
        alt={item.name || "Listed item"}
        className="my-item-image"
        onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/150"; }}
      />
      <div className="my-item-details">
        <h3>{item.name || 'Unnamed Item'}</h3>
        <p className="my-item-description">{item.description || 'No description.'}</p>
        <p className="my-item-price">Rs: {item.price?.toLocaleString() ?? 'N/A'}</p>
        <p className="my-item-location">{item.address || 'Location not specified'}</p>
        <p className="my-item-type">Type: {item.type || 'N/A'}</p>
      </div>
      <div className="my-item-actions">
        <button onClick={handleEditClick} className="action-btn edit-btn" title="Edit Item">
          <Edit size={16} /> Edit
        </button>
        <button onClick={handleDeleteClick} className="action-btn delete-btn" title="Delete Item">
          <Trash2 size={16} /> Delete
        </button>
      </div>
    </div>
  );
};

const CheckBuySell = () => {
  const [myItems, setMyItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsLoading(true);
    setError('');
    try {
      const storedItemsJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
      const storedItems = storedItemsJSON ? JSON.parse(storedItemsJSON) : [];
      setMyItems(storedItems);
    } catch (err) {
      console.error("Error loading items from local storage:", err);
      setError("Could not load your items. Data might be corrupted.");
      setMyItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDeleteItem = (itemIdToDelete) => {
    try {
      const updatedItems = myItems.filter(item => item._id !== itemIdToDelete);
      setMyItems(updatedItems);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedItems));
      alert("Item deleted successfully.");
    } catch (err) {
      console.error("Error deleting item:", err);
      setError("Failed to delete item from storage.");
    }
  };

  const handleEditItem = (itemIdToEdit) => {
    console.log("Edit item requested:", itemIdToEdit);
    alert("Edit functionality not fully implemented in this example. Would navigate to SaleForm.");
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
                  key={item._id || item.name}
                  item={item}
                  onDelete={handleDeleteItem}
                  onEdit={handleEditItem}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CheckBuySell;
