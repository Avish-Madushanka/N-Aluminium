import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Search, MapPin, Phone, Clock, Info, Edit, Trash2, Plus, X, Check, AlertTriangle, Loader2 } from "lucide-react";
import axiosInstance from '../../../api/axiosInstance';
import "./LocationMap.css";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const mapContainerStyle = {
  width: "100%",
  height: "500px",
  borderRadius: "8px"
};

const sriLankaCenter = { lat: 7.8731, lng: 80.7718 };

const initialFormData = {
  _id: null,
  name: "",
  address: "",
  phone: "",
  hours: "",
  additional: "",
  lat: "",
  lng: "", 
  type: "main",
};

const getAuthToken = () => {
  const token = localStorage.getItem('token'); 
  if (!token) {
    console.warn("getAuthToken: No token found in localStorage. API calls requiring auth might fail.");
  }
  return token || "FALLBACK_TOKEN_FOR_UNPROTECTED_GET_TESTING_ONLY"; 
};


export default function AdminLocationManager() {
  const [locations, setLocations] = useState([]);
  const [selectedLocationOnMap, setSelectedLocationOnMap] = useState(sriLankaCenter); 
  const [editingLocation, setEditingLocation] = useState(null); 
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ ...initialFormData }); 

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const ensureNumericPosition = (position) => {
    if (position && typeof position.lat !== 'undefined' && typeof position.lng !== 'undefined') {
      const lat = parseFloat(position.lat);
      const lng = parseFloat(position.lng);
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    }
    console.warn("ensureNumericPosition: Invalid position data provided, using default.", position);
    return sriLankaCenter; 
  };

  const fetchLocations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    console.log("[AdminLocationManager] Fetching locations...");
    try {
      const response = await axiosInstance.get('/shop-locations');
      const fetchedData = response.data.data.map(loc => {
        const numericPosition = ensureNumericPosition(loc.position);
        return {
          ...loc,
          id: loc._id,
          position: numericPosition,
        };
      });
      setLocations(fetchedData);
      console.log(`[AdminLocationManager] Fetched ${fetchedData.length} locations.`);
     
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Failed to fetch locations";
      console.error("[AdminLocationManager] Failed to fetch locations:", errMsg, err);
      setError(errMsg);
      setLocations([]);
      setSelectedLocationOnMap(sriLankaCenter); 
    } finally {
      setIsLoading(false);
    }
  }, []); 

  useEffect(() => {
    if (GOOGLE_MAPS_API_KEY) {
      fetchLocations();
    } else {
      setError("Google Maps API Key is missing. Map functionality disabled.");
      console.error("Google Maps API Key is not available from VITE_GOOGLE_MAPS_API_KEY.");
    }
  }, [fetchLocations]); 

  useEffect(() => {
    console.log("[AdminLocationManager] Editing/Adding Effect. Editing:", editingLocation, "Adding:", isAdding);
    if (editingLocation) {
      const pos = ensureNumericPosition(editingLocation.position);
      setFormData({
        _id: editingLocation._id,
        name: editingLocation.name || "",
        address: editingLocation.address || "",
        phone: editingLocation.phone || "",
        hours: editingLocation.hours || "",
        additional: editingLocation.additional || "",
        lat: pos.lat.toString(), 
        lng: pos.lng.toString(), 
        type: editingLocation.type || "main",
      });
      setSelectedLocationOnMap(pos);
    } else if (isAdding) {
      setFormData({ ...initialFormData }); 
      setSelectedLocationOnMap(sriLankaCenter);
    }

  }, [editingLocation, isAdding]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleMapClick = (event) => {
    const latNum = event.latLng.lat();
    const lngNum = event.latLng.lng();
    console.log("[AdminLocationManager] Map click coords:", { lat: latNum, lng: lngNum });

    if (typeof latNum === 'number' && typeof lngNum === 'number') {
      if (isAdding || editingLocation) {
        setFormData((prevData) => ({
          ...prevData,
          lat: latNum.toString(),
          lng: lngNum.toString(),
        }));
      }
      setSelectedLocationOnMap({ lat: latNum, lng: lngNum });
    } else {
      console.error("[AdminLocationManager] Map click returned non-numeric lat/lng!");
    }
  };

  const handleAddNewClick = () => {
    setIsAdding(true); setEditingLocation(null); setError(null);
  };

  const handleEditClick = (location) => {
    setIsAdding(false); setEditingLocation(location); setError(null);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setError(null); setIsLoading(true);

    const latNum = parseFloat(formData.lat);
    const lngNum = parseFloat(formData.lng);

    if (isNaN(latNum) || isNaN(lngNum)) {
      setError("Invalid latitude or longitude. Please enter valid numbers or click on the map.");
      setIsLoading(false);
      return;
    }
    const position = { lat: latNum, lng: lngNum };

    const typeLabels = { main: "Main Branch", partner: "Partner Store", outlet: "Outlet" };
    const payload = {
      name: formData.name,
      address: formData.address,
      phone: formData.phone,
      hours: formData.hours,
      additional: formData.additional || typeLabels[formData.type] || formData.type,
      type: formData.type,
      position,
    };

    let requestPromise;
    const requestConfig = { headers: { Authorization: `Bearer ${getAuthToken()}` } };

    if (editingLocation && formData._id) {
      console.log(`[AdminLocationManager] Updating location ${_id}:`, payload);
      requestPromise = axiosInstance.put(`/shop-locations/${formData._id}`, payload, requestConfig);
    } else {
      console.log("[AdminLocationManager] Creating new location:", payload);
      requestPromise = axiosInstance.post('/shop-locations', payload, requestConfig);
    }

    try {
      const response = await requestPromise;
      const savedData = response.data.data;
      const savedLocWithNumericPos = {
        ...savedData,
        id: savedData._id,
        position: ensureNumericPosition(savedData.position)
      };

      console.log("[AdminLocationManager] Save successful:", savedLocWithNumericPos);

      if (editingLocation) {
        setLocations(prevLocs => prevLocs.map(l => l._id === savedLocWithNumericPos._id ? savedLocWithNumericPos : l));
      } else {
        setLocations(prevLocs => [...prevLocs, savedLocWithNumericPos]);
      }

      setIsAdding(false); setEditingLocation(null); setFormData({ ...initialFormData });
      setSelectedLocationOnMap(savedLocWithNumericPos.position);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Failed to save location";
      console.error("[AdminLocationManager] Failed to save location:", errMsg, err);
      setError(errMsg); 
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = async (locationId) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      setIsLoading(true); setError(null);
      try {
        console.log(`[AdminLocationManager] Deleting location ${locationId}`);
        await axiosInstance.delete(`/shop-locations/${locationId}`, {
          headers: { Authorization: `Bearer ${getAuthToken()}` }
        });
        console.log(`[AdminLocationManager] Location ${locationId} deleted successfully.`);
        setLocations((prev) => prev.filter((loc) => loc._id !== locationId));
        if (editingLocation && editingLocation._id === locationId) {
          setEditingLocation(null); setFormData({ ...initialFormData });
        }
        setSelectedLocationOnMap(sriLankaCenter); 
      } catch (err) {
        const errMsg = err.response?.data?.message || err.message || "Failed to delete location";
        console.error("[AdminLocationManager] Failed to delete location:", errMsg, err);
        setError(errMsg);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setIsAdding(false); setEditingLocation(null);
    setFormData({ ...initialFormData }); 
    setError(null);
  };

  const filteredLocations = locations.filter(location => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = (location.name || "").toLowerCase().includes(searchTermLower) ||
                          (location.address || "").toLowerCase().includes(searchTermLower);
    if (activeTab === "all") return matchesSearch;
    return location.type === activeTab && matchesSearch;
  });

  const formTitle = isAdding ? "Add New Location" : (editingLocation ? "Edit Location" : "");


  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="adshopmap-container error-state">
        <AlertTriangle size={48} color="orange" />
        <h2>Google Maps API Key Missing</h2>
        <p>Please ensure <code>VITE_GOOGLE_MAPS_API_KEY</code> is set in your frontend <code>.env</code> file and restart your dev server.</p>
      </div>
    );
  }

  const currentMapCenter = (selectedLocationOnMap && typeof selectedLocationOnMap.lat === 'number' && typeof selectedLocationOnMap.lng === 'number')
                           ? selectedLocationOnMap
                           : sriLankaCenter;
  const currentZoom = (selectedLocationOnMap && typeof selectedLocationOnMap.lat === 'number') ? 14 : 7;


  return (
    <div className="adshopmap-container">
      <div className="adshopmap-content">
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
            <div className="adshopmap-stat adshopmap-stat-blue"><p className="adshopmap-stat-label">Total Locations</p><p className="adshopmap-stat-value">{locations.length}</p></div>
            <div className="adshopmap-stat adshopmap-stat-green"><p className="adshopmap-stat-label">Main Branches</p><p className="adshopmap-stat-value">{locations.filter(loc => loc.type === "main").length}</p></div>
            <div className="adshopmap-stat adshopmap-stat-purple"><p className="adshopmap-stat-label">Partner Stores</p><p className="adshopmap-stat-value">{locations.filter(loc => loc.type === "partner").length}</p></div>
            <div className="adshopmap-stat adshopmap-stat-yellow"><p className="adshopmap-stat-label">Outlets</p><p className="adshopmap-stat-value">{locations.filter(loc => loc.type === "outlet").length}</p></div>
          </div>
        </div>

        {isLoading && !isAdding && !editingLocation && ( <div className="adshopmap-global-loader"> <Loader2 size={32} className="animate-spin" /> Loading locations... </div> )}
        {error && (isAdding || editingLocation ? null : <div className="adshopmap-global-error"> <AlertTriangle size={18} /> Error: {error} <button onClick={() => setError(null)} className="adshopmap-close-error-button"><X size={16}/></button> </div> )}

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

        <div className="adshopmap-main-content">
          <div className="adshopmap-locations-container">
            <div className="adshopmap-locations-card">
              <div className="adshopmap-locations-header">
                <div className="adshopmap-search-container"> <Search size={18} className="adshopmap-search-icon" /> <input type="text" placeholder="Search locations..." className="adshopmap-search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} disabled={isLoading && !isAdding && !editingLocation} /> </div>
                <div className="adshopmap-tabs"> {['all', 'main', 'partner', 'outlet'].map(tabType => ( <button key={tabType} className={`adshopmap-tab ${activeTab === tabType ? 'adshopmap-tab-active' : ''}`} onClick={() => setActiveTab(tabType)} disabled={isLoading && !isAdding && !editingLocation} > {tabType.charAt(0).toUpperCase() + tabType.slice(1)} {tabType !== 'all' && `s`} </button> ))} </div>
              </div>
              <div className="adshopmap-locations-list">
                {isLoading && locations.length === 0 && ( <div className="adshopmap-no-locations"> <Loader2 size={24} className="animate-spin" /> Loading... </div> )}
                {!isLoading && filteredLocations.length === 0 && ( <div className="adshopmap-no-locations"> No locations found matching your criteria. </div> )}
                {filteredLocations.map((location) => (
                  <div key={location._id} className={`adshopmap-location-item ${selectedLocationOnMap && selectedLocationOnMap.lat === location.position.lat && selectedLocationOnMap.lng === location.position.lng ? 'adshopmap-location-selected' : ''}`} onClick={() => location.position && typeof location.position.lat === 'number' && typeof location.position.lng === 'number' ? setSelectedLocationOnMap(location.position) : console.warn("Clicked location has invalid position", location)} >
                    <div className="adshopmap-location-header"> <h3 className="adshopmap-location-name">{location.name}</h3> <div className="adshopmap-location-actions"> <button className="adshopmap-edit-button" onClick={(e) => { e.stopPropagation(); handleEditClick(location); }} disabled={isLoading} > <Edit size={16} /> </button> <button className="adshopmap-delete-button" onClick={(e) => { e.stopPropagation(); handleDeleteClick(location._id);}} disabled={isLoading} > <Trash2 size={16} /> </button> </div> </div>
                    <div className="adshopmap-location-details"> <div className="adshopmap-location-detail"><MapPin size={14} className="adshopmap-detail-icon" /><span>{location.address}</span></div> {location.phone && <div className="adshopmap-location-detail"><Phone size={14} className="adshopmap-detail-icon" /><span>{location.phone}</span></div>} {location.hours && <div className="adshopmap-location-detail"><Clock size={14} className="adshopmap-detail-icon" /><span>{location.hours}</span></div>} {location.additional && <div className="adshopmap-location-detail"><Info size={14} className="adshopmap-detail-icon" /><span className={`adshopmap-additional-info ${location.type === 'main' ? 'adshopmap-info-main' : location.type === 'partner' ? 'adshopmap-info-partner' : location.type === 'outlet' ? 'adshopmap-info-outlet' : 'adshopmap-info-other'}`}>{location.additional}</span></div>} </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="adshopmap-map-container">
            <div className="adshopmap-map-card">
              <h2 className="adshopmap-map-title">Store Locations Map</h2>
              <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} loadingElement={<div style={{height: `100%`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Loader2 size={32} className="animate-spin"/> Loading Map...</div>} >
                <GoogleMap mapContainerStyle={mapContainerStyle} center={currentMapCenter} zoom={currentZoom} onClick={handleMapClick} options={{ gestureHandling: 'cooperative' }} >
                  {locations.map((location) => (
                      location.position && typeof location.position.lat === 'number' && typeof location.position.lng === 'number' && (
                        <Marker key={`marker-${location._id}`} position={location.position} label={{ text: (location.name || "L").substring(0, 1), color: "white" }} onClick={() => setSelectedLocationOnMap(location.position)} icon={ selectedLocationOnMap && location.position.lat === selectedLocationOnMap.lat && location.position.lng === selectedLocationOnMap.lng ? { url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" } : { url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" } } />
                      )
                  ))}
                  {(isAdding || editingLocation) && formData.lat && formData.lng && !isNaN(parseFloat(formData.lat)) && !isNaN(parseFloat(formData.lng)) && !locations.some(l => l.position.lat === parseFloat(formData.lat) && l.position.lng === parseFloat(formData.lng) && (!editingLocation || (editingLocation && l._id !== formData._id)) ) && ( <Marker position={{ lat: parseFloat(formData.lat), lng: parseFloat(formData.lng), }} icon={{ url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png" }} /> )}
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