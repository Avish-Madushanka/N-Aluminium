import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
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
  return token || "";
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
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [infoWindowOpen, setInfoWindowOpen] = useState(null);

  const ensureNumericPosition = (position) => {
    if (position && typeof position.lat !== 'undefined' && typeof position.lng !== 'undefined') {
      const lat = parseFloat(position.lat);
      const lng = parseFloat(position.lng);
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    }
    return sriLankaCenter;
  };

  const fetchLocations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
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
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Failed to fetch locations";
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
    }
  }, [fetchLocations]);

  useEffect(() => {
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
      setSelectedMarker(editingLocation);
    } else if (isAdding) {
      setFormData({ ...initialFormData });
      setSelectedLocationOnMap(sriLankaCenter);
      setSelectedMarker(null);
    }
  }, [editingLocation, isAdding]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleMapClick = (event) => {
    const latNum = event.latLng.lat();
    const lngNum = event.latLng.lng();
    
    if (typeof latNum === 'number' && typeof lngNum === 'number') {
      if (isAdding || editingLocation) {
        setFormData((prevData) => ({
          ...prevData,
          lat: latNum.toString(),
          lng: lngNum.toString(),
        }));
      }
      setSelectedLocationOnMap({ lat: latNum, lng: lngNum });
      setSelectedMarker(null);
      setInfoWindowOpen(null);
    }
  };

  const handleMarkerClick = (location) => {
    setSelectedMarker(location);
    setInfoWindowOpen(location._id);
    setSelectedLocationOnMap(location.position);
    if (!isAdding && !editingLocation) {
      setFormData({
        _id: location._id,
        name: location.name || "",
        address: location.address || "",
        phone: location.phone || "",
        hours: location.hours || "",
        additional: location.additional || "",
        lat: location.position.lat.toString(),
        lng: location.position.lng.toString(),
        type: location.type || "main",
      });
    }
  };

  const handleInfoWindowClose = () => {
    setInfoWindowOpen(null);
    setSelectedMarker(null);
  };

  const handleAddNewClick = () => {
    setIsAdding(true);
    setEditingLocation(null);
    setError(null);
    setSelectedMarker(null);
    setInfoWindowOpen(null);
  };

  const handleEditClick = (location) => {
    setIsAdding(false);
    setEditingLocation(location);
    setError(null);
    setSelectedMarker(location);
    setInfoWindowOpen(location._id);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

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
      requestPromise = axiosInstance.put(`/shop-locations/${formData._id}`, payload, requestConfig);
    } else {
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

      if (editingLocation) {
        setLocations(prevLocs => prevLocs.map(l => l._id === savedLocWithNumericPos._id ? savedLocWithNumericPos : l));
      } else {
        setLocations(prevLocs => [...prevLocs, savedLocWithNumericPos]);
      }

      setIsAdding(false);
      setEditingLocation(null);
      setFormData({ ...initialFormData });
      setSelectedLocationOnMap(savedLocWithNumericPos.position);
      setSelectedMarker(savedLocWithNumericPos);
      setInfoWindowOpen(savedLocWithNumericPos._id);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Failed to save location";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = async (locationId) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      setIsLoading(true);
      setError(null);
      try {
        await axiosInstance.delete(`/shop-locations/${locationId}`, {
          headers: { Authorization: `Bearer ${getAuthToken()}` }
        });
        setLocations((prev) => prev.filter((loc) => loc._id !== locationId));
        if (editingLocation && editingLocation._id === locationId) {
          setEditingLocation(null);
          setFormData({ ...initialFormData });
        }
        if (selectedMarker && selectedMarker._id === locationId) {
          setSelectedMarker(null);
          setInfoWindowOpen(null);
        }
        setSelectedLocationOnMap(sriLankaCenter);
      } catch (err) {
        const errMsg = err.response?.data?.message || err.message || "Failed to delete location";
        setError(errMsg);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setIsAdding(false);
    setEditingLocation(null);
    setFormData({ ...initialFormData });
    setError(null);
    setSelectedMarker(null);
    setInfoWindowOpen(null);
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
        <p>Please ensure <code>VITE_GOOGLE_MAPS_API_KEY</code> is set in your frontend <code>.env</code> file.</p>
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
              <button onClick={handleAddNewClick} className="adshopmap-add-button" disabled={isLoading}>
                <Plus size={18} className="adshopmap-icon-mr" /> Add New Location
              </button>
            )}
          </div>
          <div className="adshopmap-stats">
            <div className="adshopmap-stat adshopmap-stat-blue">
              <p className="adshopmap-stat-label">Total Locations</p>
              <p className="adshopmap-stat-value">{locations.length}</p>
            </div>
            <div className="adshopmap-stat adshopmap-stat-green">
              <p className="adshopmap-stat-label">Main Branches</p>
              <p className="adshopmap-stat-value">{locations.filter(loc => loc.type === "main").length}</p>
            </div>
            <div className="adshopmap-stat adshopmap-stat-purple">
              <p className="adshopmap-stat-label">Partner Stores</p>
              <p className="adshopmap-stat-value">{locations.filter(loc => loc.type === "partner").length}</p>
            </div>
            <div className="adshopmap-stat adshopmap-stat-yellow">
              <p className="adshopmap-stat-label">Outlets</p>
              <p className="adshopmap-stat-value">{locations.filter(loc => loc.type === "outlet").length}</p>
            </div>
          </div>
        </div>

        {isLoading && !isAdding && !editingLocation && (
          <div className="adshopmap-global-loader">
            <Loader2 size={32} className="animate-spin" /> Loading locations...
          </div>
        )}

        {(isAdding || editingLocation) && (
          <div className="adshopmap-form-container">
            <div className="adshopmap-form-header">
              <h2 className="adshopmap-form-title">{formTitle}</h2>
              <button onClick={handleCancelEdit} className="adshopmap-close-button" disabled={isLoading}>
                <X size={20} />
              </button>
            </div>
            <p className="adshopmap-form-instructions">Click on the map to set/update coordinates or manually enter them below.</p>
            {error && (isAdding || editingLocation) && (
              <div className="adshopmap-form-error">
                <AlertTriangle size={16} /> {error}
              </div>
            )}
            <form onSubmit={handleFormSubmit} className="adshopmap-form">
              <div className="adshopmap-form-grid">
                <div>
                  <label className="adshopmap-form-label">Store Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleFormChange} className="adshopmap-form-input" required disabled={isLoading}/>
                </div>
                <div>
                  <label className="adshopmap-form-label">Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleFormChange} className="adshopmap-form-input" required disabled={isLoading}/>
                </div>
                <div>
                  <label className="adshopmap-form-label">Phone Number</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleFormChange} className="adshopmap-form-input" disabled={isLoading}/>
                </div>
                <div>
                  <label className="adshopmap-form-label">Opening Hours</label>
                  <input type="text" name="hours" value={formData.hours} onChange={handleFormChange} className="adshopmap-form-input" disabled={isLoading}/>
                </div>
                <div>
                  <label className="adshopmap-form-label">Location Type</label>
                  <select name="type" value={formData.type} onChange={handleFormChange} className="adshopmap-form-input" disabled={isLoading}>
                    <option value="main">Main Branch</option>
                    <option value="partner">Partner Store</option>
                    <option value="outlet">Outlet</option>
                  </select>
                </div>
                <div>
                  <label className="adshopmap-form-label">Additional Info</label>
                  <input type="text" name="additional" value={formData.additional} onChange={handleFormChange} className="adshopmap-form-input" placeholder="E.g., Main Branch, Near City Hall" disabled={isLoading}/>
                </div>
                <div className="adshopmap-coord-grid">
                  <div>
                    <label className="adshopmap-form-label">Latitude</label>
                    <input type="number" step="any" name="lat" value={formData.lat} onChange={handleFormChange} className="adshopmap-form-input" required disabled={isLoading}/>
                  </div>
                  <div>
                    <label className="adshopmap-form-label">Longitude</label>
                    <input type="number" step="any" name="lng" value={formData.lng} onChange={handleFormChange} className="adshopmap-form-input" required disabled={isLoading}/>
                  </div>
                </div>
              </div>
              <div className="adshopmap-form-actions">
                <button type="button" onClick={handleCancelEdit} className="adshopmap-cancel-button" disabled={isLoading}>Cancel</button>
                <button type="submit" className="adshopmap-save-button" disabled={isLoading}>
                  {isLoading ? <Loader2 size={18} className="animate-spin adshopmap-icon-mr" /> : <Check size={18} className="adshopmap-icon-mr" />}
                  {isAdding ? "Save Location" : "Update Location"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="adshopmap-main-content">
          <div className="adshopmap-locations-container">
            <div className="adshopmap-locations-card">
              <div className="adshopmap-locations-header">
                <div className="adshopmap-search-container">
                  <Search size={18} className="adshopmap-search-icon" />
                  <input type="text" placeholder="Search locations..." className="adshopmap-search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="adshopmap-tabs">
                  {['all', 'main', 'partner', 'outlet'].map(tabType => (
                    <button key={tabType} className={`adshopmap-tab ${activeTab === tabType ? 'adshopmap-tab-active' : ''}`} onClick={() => setActiveTab(tabType)}>
                      {tabType.charAt(0).toUpperCase() + tabType.slice(1)} {tabType !== 'all' && `s`}
                    </button>
                  ))}
                </div>
              </div>
              <div className="adshopmap-locations-list">
                {isLoading && locations.length === 0 && (
                  <div className="adshopmap-no-locations">
                    <Loader2 size={24} className="animate-spin" /> Loading...
                  </div>
                )}
                {!isLoading && filteredLocations.length === 0 && (
                  <div className="adshopmap-no-locations">No locations found matching your criteria.</div>
                )}
                {filteredLocations.map((location) => (
                  <div
                    key={location._id}
                    className={`adshopmap-location-item ${selectedMarker && selectedMarker._id === location._id ? 'adshopmap-location-selected' : ''}`}
                    onClick={() => handleMarkerClick(location)}
                  >
                    <div className="adshopmap-location-header">
                      <h3 className="adshopmap-location-name">{location.name}</h3>
                      <div className="adshopmap-location-actions">
                        <button className="adshopmap-edit-button" onClick={(e) => { e.stopPropagation(); handleEditClick(location); }} disabled={isLoading}>
                          <Edit size={16} />
                        </button>
                        <button className="adshopmap-delete-button" onClick={(e) => { e.stopPropagation(); handleDeleteClick(location._id);}} disabled={isLoading}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="adshopmap-location-details">
                      <div className="adshopmap-location-detail"><MapPin size={14} className="adshopmap-detail-icon" /><span>{location.address}</span></div>
                      {location.phone && <div className="adshopmap-location-detail"><Phone size={14} className="adshopmap-detail-icon" /><span>{location.phone}</span></div>}
                      {location.hours && <div className="adshopmap-location-detail"><Clock size={14} className="adshopmap-detail-icon" /><span>{location.hours}</span></div>}
                      {location.additional && <div className="adshopmap-location-detail"><Info size={14} className="adshopmap-detail-icon" /><span className={`adshopmap-additional-info ${location.type === 'main' ? 'adshopmap-info-main' : location.type === 'partner' ? 'adshopmap-info-partner' : 'adshopmap-info-other'}`}>{location.additional}</span></div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="adshopmap-map-container">
            <div className="adshopmap-map-card">
              <h2 className="adshopmap-map-title">Store Locations Map</h2>
              <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} loadingElement={<div style={{height: `100%`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Loader2 size={32} className="animate-spin"/> Loading Map...</div>}>
                <GoogleMap mapContainerStyle={mapContainerStyle} center={currentMapCenter} zoom={currentZoom} onClick={handleMapClick} options={{ gestureHandling: 'cooperative' }}>
                  {locations.map((location) => (
                    location.position && typeof location.position.lat === 'number' && typeof location.position.lng === 'number' && (
                      <Marker
                        key={`marker-${location._id}`}
                        position={location.position}
                        onClick={() => handleMarkerClick(location)}
                        icon={{
                          url: selectedMarker && location._id === selectedMarker._id
                            ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                            : location.type === 'main'
                            ? "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                            : location.type === 'partner'
                            ? "http://maps.google.com/mapfiles/ms/icons/purple-dot.png"
                            : "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
                          scaledSize: new window.google.maps.Size(32, 32)
                        }}
                      />
                    )
                  ))}
                  {(isAdding || editingLocation) && formData.lat && formData.lng && !isNaN(parseFloat(formData.lat)) && !isNaN(parseFloat(formData.lng)) && (
                    <Marker
                      position={{ lat: parseFloat(formData.lat), lng: parseFloat(formData.lng) }}
                      icon={{ url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png", scaledSize: new window.google.maps.Size(32, 32) }}
                    />
                  )}
                  {infoWindowOpen && selectedMarker && (
                    <InfoWindow
                      position={selectedMarker.position}
                      onCloseClick={handleInfoWindowClose}
                    >
                      <div className="adshopmap-info-window">
                        <h4>{selectedMarker.name}</h4>
                        <p><MapPin size={12} /> {selectedMarker.address}</p>
                        {selectedMarker.phone && <p><Phone size={12} /> {selectedMarker.phone}</p>}
                        {selectedMarker.hours && <p><Clock size={12} /> {selectedMarker.hours}</p>}
                        {selectedMarker.additional && <p><Info size={12} /> {selectedMarker.additional}</p>}
                        <div className="adshopmap-info-window-actions">
                          <button onClick={() => handleEditClick(selectedMarker)} className="adshopmap-info-edit">
                            <Edit size={14} /> Edit
                          </button>
                          <button onClick={() => handleDeleteClick(selectedMarker._id)} className="adshopmap-info-delete">
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              </LoadScript>
              <div className="adshopmap-map-instructions">
                {isAdding || editingLocation ? "Click on the map to set the store location, or enter coordinates manually." : "Click on a marker or store in the list to view location details."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}