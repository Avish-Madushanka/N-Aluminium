// frontend/src/components/admin/LocationMap/AdminLocationManager.jsx
import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Search, MapPin, Phone, Clock, Info, Edit, Trash2, Plus, X, Check, AlertTriangle, Loader2 } from "lucide-react";
import axiosInstance from '../../../api/axiosInstance'; // <<<< ADJUST PATH if needed
import "./LocationMap.css";

// Environment variables for Vite
// VITE_API_BASE_URL is used by axiosInstance.js
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const mapContainerStyle = { /* ... */ };
const sriLankaCenter = { /* ... */ };
const initialFormData = { /* ... */ };

// Placeholder for actual token retrieval.
const getAuthTokenBypass = () => { // Renamed to avoid conflict if you have a global getAuthToken
  // This is a BYPASS for testing IF your backend doesn't strictly require a valid token for GET /shop-locations
  // For POST, PUT, DELETE, you will need a REAL admin token.
  // return localStorage.getItem('token'); // Use your actual token key
  return "TEMPORARY_TEST_TOKEN_IF_NEEDED"; // REPLACE THIS
};

export default function AdminLocationManager() {
  const [locations, setLocations] = useState([]);
  const [selectedLocationOnMap, setSelectedLocationOnMap] = useState(null);
  const [editingLocation, setEditingLocation] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLocations = useCallback(async () => {
    setIsLoading(true); setError(null);
    try {
      // USE RELATIVE PATH with axiosInstance
      const response = await axiosInstance.get('/shop-locations'); // <<<< CORRECT
      setLocations(response.data.data.map(loc => ({ ...loc, id: loc._id })));
    } catch (err) {
      console.error("Failed to fetch locations:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || err.message || "Failed to fetch locations");
      setLocations([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (GOOGLE_MAPS_API_KEY) {
      fetchLocations();
    }
  }, [fetchLocations, GOOGLE_MAPS_API_KEY]);

  useEffect(() => {
    if (editingLocation) {
      setFormData({
        _id: editingLocation._id, name: editingLocation.name, address: editingLocation.address,
        phone: editingLocation.phone || "", hours: editingLocation.hours || "",
        additional: editingLocation.additional || "",
        lat: editingLocation.position.lat.toString(), lng: editingLocation.position.lng.toString(),
        type: editingLocation.type || "main",
      });
      setSelectedLocationOnMap(editingLocation.position);
    } else if (isAdding) {
      setFormData(initialFormData);
    }
  }, [editingLocation, isAdding]);


  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setError(null); setIsLoading(true);
    const position = { lat: parseFloat(formData.lat), lng: parseFloat(formData.lng) };
    if (isNaN(position.lat) || isNaN(position.lng)) {
      setError("Invalid latitude or longitude."); setIsLoading(false); return;
    }
    const typeLabels = { main: "Main Branch", partner: "Partner Store", outlet: "Outlet" };
    const payload = { ...formData, position, additional: formData.additional || typeLabels[formData.type] || formData.type };
    delete payload._id;

    let requestPromise;
    if (editingLocation) {
      // USE RELATIVE PATH with axiosInstance
      requestPromise = axiosInstance.put(`/shop-locations/${editingLocation._id}`, payload); // <<<< CORRECT
    } else {
      // USE RELATIVE PATH with axiosInstance
      requestPromise = axiosInstance.post('/shop-locations', payload); // <<<< CORRECT
    }

    try {
      const response = await requestPromise;
      const savedLoc = { ...response.data.data, id: response.data.data._id };
      if (isAdding) { setLocations((prev) => [...prev, savedLoc]); }
      else if (editingLocation) { setLocations((prev) => prev.map((loc) => loc._id === editingLocation._id ? savedLoc : loc)); }
      setIsAdding(false); setEditingLocation(null); setFormData(initialFormData);
      setSelectedLocationOnMap(savedLoc.position);
    } catch (err) {
      console.error("Failed to save location:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || err.message || "Failed to save location.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = async (locationId) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      setIsLoading(true); setError(null);
      try {
        // USE RELATIVE PATH with axiosInstance
        await axiosInstance.delete(`/shop-locations/${locationId}`); // <<<< CORRECT
        setLocations((prev) => prev.filter((loc) => loc._id !== locationId));
        if (editingLocation && editingLocation._id === locationId) {
          setEditingLocation(null); setFormData(initialFormData);
        }
        setSelectedLocationOnMap(null);
      } catch (err) {
        console.error("Failed to delete location:", err.response?.data?.message || err.message);
        setError(err.response?.data?.message || err.message || "Failed to delete location.");
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // handleFormChange, handleMapClick, handleAddNewClick, handleEditClick, handleCancelEdit, filteredLocations, formTitle
  // (These can remain largely the same as your previous version, ensure no direct 'fetch' calls remain if you intend to use axiosInstance for all)
  const handleFormChange = (event) => { /* ... your existing logic ... */ const { name, value } = event.target; setFormData((prevData) => ({ ...prevData, [name]: value })); };
  const handleMapClick = (event) => { /* ... your existing logic ... */ const lat = event.latLng.lat(); const lng = event.latLng.lng(); if (isAdding || editingLocation) { setFormData((prevData) => ({ ...prevData, lat: lat.toString(), lng: lng.toString() })); setSelectedLocationOnMap({ lat, lng }); } else { setSelectedLocationOnMap({ lat, lng }); }};
  const handleAddNewClick = () => { /* ... your existing logic ... */ setIsAdding(true); setEditingLocation(null); setFormData(initialFormData); setSelectedLocationOnMap(sriLankaCenter); setError(null); };
  const handleEditClick = (location) => { /* ... your existing logic ... */ setIsAdding(false); setEditingLocation(location); setError(null); };
  const handleCancelEdit = () => { /* ... your existing logic ... */ setIsAdding(false); setEditingLocation(null); setFormData(initialFormData); setSelectedLocationOnMap(null); setError(null);};
  const filteredLocations = locations.filter(location => { const searchTermLower = searchTerm.toLowerCase(); const matchesSearch = location.name.toLowerCase().includes(searchTermLower) || location.address.toLowerCase().includes(searchTermLower); if (activeTab === "all") return matchesSearch; return location.type === activeTab && matchesSearch; });
  const formTitle = isAdding ? "Add New Location" : editingLocation ? "Edit Location" : "";


  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="adshopmap-container error-state">
        <AlertTriangle size={48} color="orange" />
        <h2>Google Maps API Key Missing</h2>
        <p>Please ensure <code>VITE_GOOGLE_MAPS_API_KEY</code> is set in your frontend <code>.env</code> file and restart your dev server.</p>
      </div>
    );
  }

  return (
    <div className="adshopmap-container">
      <div className="adshopmap-content">
        {/* Header (same as your version) */}
        <div className="adshopmap-header">
          <div className="adshopmap-header-content">
            <h1 className="adshopmap-title">Store Locations Manager</h1>
            {!isAdding && !editingLocation && (
              <button onClick={handleAddNewClick} className="adshopmap-add-button" disabled={isLoading} >
                <Plus size={18} className="adshopmap-icon-mr" /> Add New Location
              </button>
            )}
          </div>
          <div className="adshopmap-stats">
            {/* Stats divs (same as your version) */}
            <div className="adshopmap-stat adshopmap-stat-blue"><p className="adshopmap-stat-label">Total Locations</p><p className="adshopmap-stat-value">{locations.length}</p></div>
            <div className="adshopmap-stat adshopmap-stat-green"><p className="adshopmap-stat-label">Main Branches</p><p className="adshopmap-stat-value">{locations.filter(loc => loc.type === "main").length}</p></div>
            <div className="adshopmap-stat adshopmap-stat-purple"><p className="adshopmap-stat-label">Partner Stores</p><p className="adshopmap-stat-value">{locations.filter(loc => loc.type === "partner").length}</p></div>
            <div className="adshopmap-stat adshopmap-stat-yellow"><p className="adshopmap-stat-label">Outlets</p><p className="adshopmap-stat-value">{locations.filter(loc => loc.type === "outlet").length}</p></div>
          </div>
        </div>

        {/* Global Error/Loading Messages (same as your version) */}
        {isLoading && !isAdding && !editingLocation && ( <div className="adshopmap-global-loader"> <Loader2 size={32} className="animate-spin" /> Loading locations... </div> )}
        {error && ( <div className="adshopmap-global-error"> <AlertTriangle size={18} /> Error: {error} <button onClick={() => setError(null)} className="adshopmap-close-error-button"><X size={16}/></button> </div> )}

        {/* Form Container (same structure, ensure disabled={isLoading} on inputs/buttons) */}
        {(isAdding || editingLocation) && (
          <div className="adshopmap-form-container">
            <div className="adshopmap-form-header"> <h2 className="adshopmap-form-title">{formTitle}</h2> <button onClick={handleCancelEdit} className="adshopmap-close-button" disabled={isLoading} > <X size={20} /> </button> </div>
            <p className="adshopmap-form-instructions"> Click on the map to set/update coordinates or manually enter them below. </p>
            {error && (isAdding || editingLocation) && ( <div className="adshopmap-form-error"> <AlertTriangle size={16} /> {error} </div> )}
            <form onSubmit={handleFormSubmit} className="adshopmap-form">
              <div className="adshopmap-form-grid">
                <div> <label className="adshopmap-form-label">Store Name</label> <input type="text" name="name" value={formData.name} onChange={handleFormChange} className="adshopmap-form-input" required disabled={isLoading}/> </div>
                <div> <label className="adshopmap-form-label">Address</label> <input type="text" name="address" value={formData.address} onChange={handleFormChange} className="adshopmap-form-input" required disabled={isLoading}/> </div>
                <div> <label className="adshopmap-form-label">Phone Number</label> <input type="text" name="phone" value={formData.phone} onChange={handleFormChange} className="adshopmap-form-input" disabled={isLoading}/> </div>
                <div> <label className="adshopmap-form-label">Opening Hours</label> <input type="text" name="hours" value={formData.hours} onChange={handleFormChange} className="adshopmap-form-input" disabled={isLoading}/> </div>
                <div> <label className="adshopmap-form-label">Location Type</label> <select name="type" value={formData.type} onChange={handleFormChange} className="adshopmap-form-input" disabled={isLoading}> <option value="main">Main Branch</option> <option value="partner">Partner Store</option> <option value="outlet">Outlet</option> </select> </div>
                <div> <label className="adshopmap-form-label">Additional Info</label> <input type="text" name="additional" value={formData.additional} onChange={handleFormChange} className="adshopmap-form-input" placeholder="E.g., Main Branch, Near City Hall" disabled={isLoading}/> </div>
                <div className="adshopmap-coord-grid">
                  <div> <label className="adshopmap-form-label">Latitude</label> <input type="number" step="any" name="lat" value={formData.lat} onChange={handleFormChange} className="adshopmap-form-input" required disabled={isLoading}/> </div>
                  <div> <label className="adshopmap-form-label">Longitude</label> <input type="number" step="any" name="lng" value={formData.lng} onChange={handleFormChange} className="adshopmap-form-input" required disabled={isLoading}/> </div>
                </div>
              </div>
              <div className="adshopmap-form-actions">
                <button type="button" onClick={handleCancelEdit} className="adshopmap-cancel-button" disabled={isLoading}> Cancel </button>
                <button type="submit" className="adshopmap-save-button" disabled={isLoading}> {isLoading ? <Loader2 size={18} className="animate-spin adshopmap-icon-mr" /> : <Check size={18} className="adshopmap-icon-mr" />} {isAdding ? "Save Location" : "Update Location"} </button>
              </div>
            </form>
          </div>
        )}

        {/* Main Content (Locations List & Map - same structure as your version) */}
        <div className="adshopmap-main-content">
          <div className="adshopmap-locations-container"> {/* Locations List card */}
            <div className="adshopmap-locations-card">
              <div className="adshopmap-locations-header">
                <div className="adshopmap-search-container"> <Search size={18} className="adshopmap-search-icon" /> <input type="text" placeholder="Search locations..." className="adshopmap-search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} disabled={isLoading && !isAdding && !editingLocation} /> </div>
                <div className="adshopmap-tabs"> {['all', 'main', 'partner', 'outlet'].map(tabType => ( <button key={tabType} className={`adshopmap-tab ${activeTab === tabType ? 'adshopmap-tab-active' : ''}`} onClick={() => setActiveTab(tabType)} disabled={isLoading && !isAdding && !editingLocation} > {tabType.charAt(0).toUpperCase() + tabType.slice(1)} {tabType !== 'all' && `s`} </button> ))} </div>
              </div>
              <div className="adshopmap-locations-list">
                {isLoading && locations.length === 0 && ( <div className="adshopmap-no-locations"> <Loader2 size={24} className="animate-spin" /> Loading... </div> )}
                {!isLoading && filteredLocations.length === 0 && ( <div className="adshopmap-no-locations"> No locations found matching your criteria. </div> )}
                {filteredLocations.map((location) => (
                  <div key={location._id} className={`adshopmap-location-item ${selectedLocationOnMap && selectedLocationOnMap.lat === location.position.lat && selectedLocationOnMap.lng === location.position.lng ? 'adshopmap-location-selected' : ''}`} onClick={() => setSelectedLocationOnMap(location.position)} >
                    <div className="adshopmap-location-header"> <h3 className="adshopmap-location-name">{location.name}</h3> <div className="adshopmap-location-actions"> <button className="adshopmap-edit-button" onClick={(e) => { e.stopPropagation(); handleEditClick(location); }} disabled={isLoading} > <Edit size={16} /> </button> <button className="adshopmap-delete-button" onClick={(e) => { e.stopPropagation(); handleDeleteClick(location._id);}} disabled={isLoading} > <Trash2 size={16} /> </button> </div> </div>
                    <div className="adshopmap-location-details"> <div className="adshopmap-location-detail"><MapPin size={14} className="adshopmap-detail-icon" /><span>{location.address}</span></div> {location.phone && <div className="adshopmap-location-detail"><Phone size={14} className="adshopmap-detail-icon" /><span>{location.phone}</span></div>} {location.hours && <div className="adshopmap-location-detail"><Clock size={14} className="adshopmap-detail-icon" /><span>{location.hours}</span></div>} {location.additional && <div className="adshopmap-location-detail"><Info size={14} className="adshopmap-detail-icon" /><span className={`adshopmap-additional-info ${location.type === 'main' ? 'adshopmap-info-main' : location.type === 'partner' ? 'adshopmap-info-partner' : location.type === 'outlet' ? 'adshopmap-info-outlet' : 'adshopmap-info-other'}`}>{location.additional}</span></div>} </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="adshopmap-map-container"> {/* Map card */}
            <div className="adshopmap-map-card">
              <h2 className="adshopmap-map-title">Store Locations Map</h2>
              <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} loadingElement={<div style={{height: `100%`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Loader2 size={32} className="animate-spin"/> Loading Map...</div>} >
                <GoogleMap mapContainerStyle={mapContainerStyle} center={selectedLocationOnMap || sriLankaCenter} zoom={selectedLocationOnMap ? 14 : 7} onClick={handleMapClick} options={{ gestureHandling: 'cooperative' }} >
                  {locations.map((location) => ( <Marker key={`marker-${location._id}`} position={location.position} label={{ text: location.name.substring(0, 1), color: "white" }} onClick={() => { if (!isAdding && !editingLocation) { setSelectedLocationOnMap(location.position); } else if (editingLocation && editingLocation._id === location._id) { setSelectedLocationOnMap(location.position); } }} icon={ selectedLocationOnMap && location.position.lat === selectedLocationOnMap.lat && location.position.lng === selectedLocationOnMap.lng ? { url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" } : { url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" } } /> ))}
                  {(isAdding || editingLocation) && formData.lat && formData.lng && parseFloat(formData.lat) && parseFloat(formData.lng) && !locations.some(l => l.position.lat === parseFloat(formData.lat) && l.position.lng === parseFloat(formData.lng) && (!editingLocation || (editingLocation && l._id !== editingLocation._id)) ) && ( <Marker position={{ lat: parseFloat(formData.lat), lng: parseFloat(formData.lng), }} icon={{ url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png" }} /> )}
                </GoogleMap>
              </LoadScript>
              <div className="adshopmap-map-instructions"> {isAdding || editingLocation ? "Click on the map to set the store location, or enter coordinates manually." : "Click on a store in the list or map to view its location."} </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}