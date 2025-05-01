// src/Pages/MyItemsPage.jsx (NEW FILE)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // For linking to SaleForm
import { Edit, Trash2, Package } from 'lucide-react'; // Icons
import './CheckBuySell.css'; // We'll create this CSS file

// Define Backend URL (for constructing image paths)
const BACKEND_URL = 'http://localhost:5002';
const LOCAL_STORAGE_KEY = 'mySaleItems'; // Consistent key

// --- MyItemCard Component (Display individual item) ---
const MyItemCard = ({ item, onDelete, onEdit }) => {
  // Construct the full image URL
  const imageUrl = item.image ? `${BACKEND_URL}${item.image}` : "https://via.placeholder.com/150";

  const handleDeleteClick = () => {
    // Ask for confirmation before deleting
    if (window.confirm(`Are you sure you want to delete "${item.name}"? This cannot be undone.`)) {
      onDelete(item._id); // Pass the item's ID (assuming backend response includes _id)
    }
  };

  const handleEditClick = () => {
    onEdit(item._id); // Pass ID to the edit handler
  };

  return (
    <div className="my-item-card">
      <img
        src={imageUrl}
        alt={item.name || "Listed item"}
        className="my-item-image"
        onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/150"; }} // Fallback
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


// --- MyItemsPage Component ---
const CheckBuySell = () => {
  const [myItems, setMyItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Indicate loading from local storage
  const [error, setError] = useState('');

  // Load items from local storage on component mount
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
      setMyItems([]); // Clear potentially bad data
    } finally {
      setIsLoading(false);
    }
  }, []); // Run only once on mount

  // Handle item deletion (updates state and local storage)
  const handleDeleteItem = (itemIdToDelete) => {
    try {
      const updatedItems = myItems.filter(item => item._id !== itemIdToDelete);
      setMyItems(updatedItems); // Update component state
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedItems)); // Update local storage
      alert("Item deleted successfully."); // Simple feedback
    } catch (err) {
       console.error("Error deleting item:", err);
       setError("Failed to delete item from storage.");
    }
  };

  // Handle item editing (placeholder - navigates to form, needs SaleForm update)
  const handleEditItem = (itemIdToEdit) => {
    // In a real app, you'd navigate to the SaleForm with the item ID
    // so the form can fetch and pre-populate the data for editing.
    console.log("Edit item requested:", itemIdToEdit);
    alert("Edit functionality not fully implemented in this example. Would navigate to SaleForm.");
    // navigate(`/SaleForm/edit/${itemIdToEdit}`); // Example navigation
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
                  key={item._id || item.name} // Use _id if available from backend response
                  item={item}
                  onDelete={handleDeleteItem}
                  onEdit={handleEditItem}
                />
              ))}
            </div>
          )}
        </>
      )}
       {/* Section for "Bought" items - Placeholder */}
       {/*
       <div className="my-bought-items-section">
          <h2>Items I've Bought</h2>
          <p>(This feature requires backend integration to track purchase history)</p>
       </div>
       */}
    </div>
  );
};

export default CheckBuySell;