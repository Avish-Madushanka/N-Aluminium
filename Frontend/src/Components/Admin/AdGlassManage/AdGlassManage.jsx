import React, { useState, useEffect } from "react";
import "./AdGlassManage.css";

const STORAGE_KEY = "glassProductData";

const defaultGlassProduct = {
  id: 1,
  name: "Start Your Glass Order",
  glassTypes: {
    "Clear Float Glass": {
      Standard: { "4": 130, "6": 210, "8": 290, "10": 350, "12": 500 },
      Premium: { "4": 170, "6": 300, "8": 400, "10": 500, "12": 750 },
    },
    "Tempered Glass": {
      Standard: { "5": 375, "6": 450, "8": 540, "12": 630 },
      Premium: { "5": 400, "6": 550, "8": 700, "12": 800 },
    },
    "Laminated Glass": {
      Standard: { "10": 500, "15": 900, "20": 1400 },
      Premium: { "10": 700, "15": 1400, "20": 2000 },
    },
    "Tinted Glass": {
      Standard: { "4": 370, "6": 450, "8": 600 },
      Premium: { "4": 450, "6": 600, "8": 800 },
    },
  },
};

const AdGlassManage = () => {
  const [glassData, setGlassData] = useState(defaultGlassProduct);
  const [selectedGlassType, setSelectedGlassType] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [editPrice, setEditPrice] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addFormData, setAddFormData] = useState({
    glassType: "",
    quality: "",
    thickness: "",
    price: "",
  });

  const cleanThicknessKeys = (data) => {
    const newData = { ...data };
    Object.keys(newData.glassTypes).forEach(glassType => {
      Object.keys(newData.glassTypes[glassType]).forEach(quality => {
        const cleaned = {};
        Object.keys(newData.glassTypes[glassType][quality]).forEach(key => {
          let cleanKey = key.replace(/mm/g, "").replace(/m/g, "");
          cleanKey = cleanKey.trim();
          cleaned[cleanKey] = newData.glassTypes[glassType][quality][key];
        });
        const sorted = Object.keys(cleaned)
          .sort((a, b) => parseFloat(a) - parseFloat(b))
          .reduce((obj, key) => {
            obj[key] = cleaned[key];
            return obj;
          }, {});
        newData.glassTypes[glassType][quality] = sorted;
      });
    });
    return newData;
  };

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      let parsedData = JSON.parse(savedData);
      parsedData = cleanThicknessKeys(parsedData);
      setGlassData(parsedData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedData));
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultGlassProduct));
    }
  }, []);

  const sortThickness = (data) => {
    const newData = { ...data };
    Object.keys(newData.glassTypes).forEach(glassType => {
      Object.keys(newData.glassTypes[glassType]).forEach(quality => {
        const sorted = Object.keys(newData.glassTypes[glassType][quality])
          .sort((a, b) => parseFloat(a) - parseFloat(b))
          .reduce((obj, key) => {
            obj[key] = newData.glassTypes[glassType][quality][key];
            return obj;
          }, {});
        newData.glassTypes[glassType][quality] = sorted;
      });
    });
    return newData;
  };

  const saveToLocalStorage = (data) => {
    const cleanedData = cleanThicknessKeys(data);
    const sortedData = sortThickness(cleanedData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sortedData));
    setGlassData(sortedData);
    window.dispatchEvent(new Event("glassDataUpdated"));
  };

  const handleEditItem = () => {
    if (!editPrice) {
      alert("Please enter price");
      return;
    }

    const newData = { ...glassData };
    newData.glassTypes[editingItem.glassType][editingItem.quality][editingItem.thickness] = parseFloat(editPrice);
    
    saveToLocalStorage(newData);
    setShowEditModal(false);
    setEditingItem(null);
    setEditPrice("");
    alert("Price updated successfully");
  };

  const handleDeleteItem = () => {
    const newData = { ...glassData };
    delete newData.glassTypes[itemToDelete.glassType][itemToDelete.quality][itemToDelete.thickness];
    
    if (Object.keys(newData.glassTypes[itemToDelete.glassType][itemToDelete.quality]).length === 0) {
      delete newData.glassTypes[itemToDelete.glassType][itemToDelete.quality];
    }
    if (Object.keys(newData.glassTypes[itemToDelete.glassType]).length === 0) {
      delete newData.glassTypes[itemToDelete.glassType];
    }
    
    saveToLocalStorage(newData);
    setShowDeleteConfirm(false);
    setItemToDelete(null);
    alert("Item deleted successfully");
  };

  const handleAddItem = () => {
    if (!addFormData.glassType || !addFormData.quality || !addFormData.thickness || !addFormData.price) {
      alert("Please fill all fields");
      return;
    }

    const newData = { ...glassData };
    if (!newData.glassTypes[addFormData.glassType]) {
      newData.glassTypes[addFormData.glassType] = {};
    }
    if (!newData.glassTypes[addFormData.glassType][addFormData.quality]) {
      newData.glassTypes[addFormData.glassType][addFormData.quality] = {};
    }
    
    newData.glassTypes[addFormData.glassType][addFormData.quality][addFormData.thickness] = parseFloat(addFormData.price);
    
    saveToLocalStorage(newData);
    setShowAddModal(false);
    setAddFormData({ glassType: "", quality: "", thickness: "", price: "" });
    alert("Item added successfully");
  };

  const openEditModal = (glassType, quality, thickness, price) => {
    setEditingItem({ glassType, quality, thickness, price });
    setEditPrice(price);
    setShowEditModal(true);
  };

  const openDeleteConfirm = (glassType, quality, thickness) => {
    setItemToDelete({ glassType, quality, thickness });
    setShowDeleteConfirm(true);
  };

  const filteredGlassData = selectedGlassType 
    ? { [selectedGlassType]: glassData.glassTypes[selectedGlassType] }
    : glassData.glassTypes;

  return (
    <div className="AdGM-container">
      <div className="AdGM-header">
        <h1 className="AdGM-title">Glass Data Management</h1>
        <div className="AdGM-headerControls">
          <select 
            className="AdGM-filterSelect"
            value={selectedGlassType}
            onChange={(e) => setSelectedGlassType(e.target.value)}
          >
            <option value="">All Glass Types</option>
            {Object.keys(glassData.glassTypes).map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <button className="AdGM-addPriceBtn" onClick={() => setShowAddModal(true)}>
            + Add Price
          </button>
        </div>
      </div>

      <div className="AdGM-tableWrapper">
        <table className="AdGM-priceTable">
          <thead>
            <tr className="AdGM-tableMainHeader">
              <th rowSpan="2">Glass Type</th>
              <th colSpan="2">Quality</th>
              <th rowSpan="2">Actions</th>
            </tr>
            <tr className="AdGM-tableSubHeader">
              <th>Standard</th>
              <th>Premium</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              const rows = [];
              const glassTypes = Object.keys(filteredGlassData);
              
              glassTypes.forEach((glassType) => {
                const qualities = filteredGlassData[glassType];
                const standardSizes = qualities.Standard ? Object.keys(qualities.Standard) : [];
                const premiumSizes = qualities.Premium ? Object.keys(qualities.Premium) : [];
                const maxRows = Math.max(standardSizes.length, premiumSizes.length);
                
                for (let i = 0; i < maxRows; i++) {
                  const standardSize = standardSizes[i];
                  const premiumSize = premiumSizes[i];
                  const standardPrice = standardSize ? qualities.Standard[standardSize] : null;
                  const premiumPrice = premiumSize ? qualities.Premium[premiumSize] : null;
                  
                  rows.push(
                    <tr key={`${glassType}-row-${i}`}>
                      {i === 0 && (
                        <td rowSpan={maxRows} className="AdGM-glassTypeCell">
                          {glassType}
                        </td>
                      )}
                      <td className="AdGM-sizeCell">
                        {standardSize ? (
                          <div className="AdGM-sizePriceCell">
                            <span className="AdGM-sizeValue">{standardSize}mm</span>
                            <span className="AdGM-priceValue">Rs {standardPrice.toFixed(2)}</span>
                            <div className="AdGM-buttonGroup">
                              <button
                                className="AdGM-editBtn"
                                onClick={() => openEditModal(glassType, "Standard", standardSize, standardPrice)}
                              >
                                Edit
                              </button>
                              <button
                                className="AdGM-deleteBtn"
                                onClick={() => openDeleteConfirm(glassType, "Standard", standardSize)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ) : null}
                      </td>
                      <td className="AdGM-sizeCell">
                        {premiumSize ? (
                          <div className="AdGM-sizePriceCell">
                            <span className="AdGM-sizeValue">{premiumSize}mm</span>
                            <span className="AdGM-priceValue">Rs {premiumPrice.toFixed(2)}</span>
                            <div className="AdGM-buttonGroup">
                              <button
                                className="AdGM-editBtn"
                                onClick={() => openEditModal(glassType, "Premium", premiumSize, premiumPrice)}
                              >
                                Edit
                              </button>
                              <button
                                className="AdGM-deleteBtn"
                                onClick={() => openDeleteConfirm(glassType, "Premium", premiumSize)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ) : null}
                      </td>
                      {i === 0 && (
                        <td rowSpan={maxRows} className="AdGM-actionsCell">
                          <button
                            className="AdGM-addItemBtn"
                            onClick={() => {
                              setAddFormData({ ...addFormData, glassType: glassType });
                              setShowAddModal(true);
                            }}
                          >
                            + Add Item
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                }
              });
              
              return rows;
            })()}
          </tbody>
        </table>
      </div>

      {showEditModal && (
        <div className="AdGM-modal">
          <div className="AdGM-modalContent">
            <h2>Edit Price</h2>
            <div className="AdGM-formGroup">
              <label>Glass Type:</label>
              <input type="text" value={editingItem?.glassType} disabled />
            </div>
            <div className="AdGM-formGroup">
              <label>Quality:</label>
              <input type="text" value={editingItem?.quality} disabled />
            </div>
            <div className="AdGM-formGroup">
              <label>Thickness:</label>
              <input type="text" value={editingItem?.thickness ? `${editingItem.thickness}mm` : ""} disabled />
            </div>
            <div className="AdGM-formGroup">
              <label>Price (Rs/ft²):</label>
              <input
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                step="1"
              />
            </div>
            <div className="AdGM-modalButtons">
              <button className="AdGM-updateBtn" onClick={handleEditItem}>
                Update Price
              </button>
              <button className="AdGM-cancelBtn" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="AdGM-modal">
          <div className="AdGM-modalContent AdGM-deleteModal">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this item?</p>
            <div className="AdGM-deleteInfo">
              <p><strong>Glass Type:</strong> {itemToDelete?.glassType}</p>
              <p><strong>Quality:</strong> {itemToDelete?.quality}</p>
              <p><strong>Thickness:</strong> {itemToDelete?.thickness}mm</p>
            </div>
            <div className="AdGM-modalButtons">
              <button className="AdGM-deleteConfirmBtn" onClick={handleDeleteItem}>
                Delete
              </button>
              <button className="AdGM-cancelBtn" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="AdGM-modal">
          <div className="AdGM-modalContent">
            <h2>Add New Price Item</h2>
            <div className="AdGM-formGroup">
              <label>Glass Type:</label>
              <select
                value={addFormData.glassType}
                onChange={(e) => setAddFormData({ ...addFormData, glassType: e.target.value })}
              >
                <option value="">Select Glass Type</option>
                {Object.keys(glassData.glassTypes).map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="AdGM-formGroup">
              <label>Quality:</label>
              <select
                value={addFormData.quality}
                onChange={(e) => setAddFormData({ ...addFormData, quality: e.target.value })}
              >
                <option value="">Select Quality</option>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
              </select>
            </div>
            <div className="AdGM-formGroup">
              <label>Thickness (mm):</label>
              <input
                type="number"
                value={addFormData.thickness}
                onChange={(e) => setAddFormData({ ...addFormData, thickness: e.target.value })}
                placeholder="Enter thickness"
                step="1"
              />
            </div>
            <div className="AdGM-formGroup">
              <label>Price (Rs/ft²):</label>
              <input
                type="number"
                value={addFormData.price}
                onChange={(e) => setAddFormData({ ...addFormData, price: e.target.value })}
                placeholder="Enter price"
                step="1"
              />
            </div>
            <div className="AdGM-modalButtons">
              <button className="AdGM-addConfirmBtn" onClick={handleAddItem}>
                Add Item
              </button>
              <button className="AdGM-cancelBtn" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdGlassManage;