import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import axiosInstance from "../../api/axiosInstance";
import "./LocationMap.css";

const mapContainerStyle = {
  width: "100%",
  height: "600px",
};

const KALUTARA_DISTRICT_CENTER = { lat: 6.5853, lng: 79.9607 };
const KALUTARA_DISTRICT_ZOOM = 10;

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function LocationMap() {
  const [searchTerm, setSearchTerm] = useState("");
  const [focusedLocationPosition, setFocusedLocationPosition] = useState(null);
  const [allLocations, setAllLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(KALUTARA_DISTRICT_CENTER);
  const [mapZoom, setMapZoom] = useState(KALUTARA_DISTRICT_ZOOM);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get("/shop-locations");

        if (response.data?.success && Array.isArray(response.data.data)) {
          const validLocations = response.data.data.filter(
            (loc) =>
              loc.position &&
              typeof loc.position.lat === "number" &&
              typeof loc.position.lng === "number"
          );
          setAllLocations(validLocations);
        } else {
          throw new Error(response.data?.message || "Invalid location data format.");
        }
      } catch (err) {
        console.error("Error fetching locations:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch locations."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const filteredLocationsFromSearch = allLocations.filter((location) =>
    (location.name &&
      location.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (location.address &&
      location.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (!e.target.value.trim()) {
      setFocusedLocationPosition(null);
      setMapCenter(KALUTARA_DISTRICT_CENTER);
      setMapZoom(KALUTARA_DISTRICT_ZOOM);
    }
  };

  const handleSearchClick = () => {
    if (filteredLocationsFromSearch.length > 0) {
      const firstLocation = filteredLocationsFromSearch[0];
      setFocusedLocationPosition(firstLocation.position);
      setMapCenter(firstLocation.position);
      setMapZoom(15);
      setSelectedLocation(firstLocation);
      
      const mapElement = document.querySelector(".map-area");
      if (mapElement) {
        mapElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      setFocusedLocationPosition(null);
      setMapCenter(KALUTARA_DISTRICT_CENTER);
      setMapZoom(KALUTARA_DISTRICT_ZOOM);
      setSelectedLocation(null);
    }
  };

  const handleFocusLocation = (location) => {
    setFocusedLocationPosition(location.position);
    setMapCenter(location.position);
    setMapZoom(15);
    setSelectedLocation(location);

    const mapElement = document.querySelector(".map-area");
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleMarkerClick = (location) => {
    setSelectedLocation(location);
    setFocusedLocationPosition(location.position);
    setMapCenter(location.position);
    setMapZoom(15);
  };

  const handleInfoWindowClose = () => {
    setSelectedLocation(null);
  };

  const getDirectionsUrl = (location) => {
    const destination = `${location.position.lat},${location.position.lng}`;
    return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
  };

  const getMarkerIcon = (location, isFocused) => {
    if (!isMapLoaded || !window.google) {
      return undefined;
    }
    
    if (isFocused) {
      return {
        url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
        scaledSize: new window.google.maps.Size(40, 40)
      };
    }
    
    return {
      url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
      scaledSize: new window.google.maps.Size(32, 32)
    };
  };

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div style={{ color: "red", textAlign: "center", padding: "50px" }}>
        <h2>Error</h2>
        <p>
          Google Maps API key is missing.  
          Add <code>VITE_GOOGLE_MAPS_API_KEY</code> to your <code>.env</code> file.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="store-locator-container" style={{ textAlign: "center", padding: "50px" }}>
        <div className="loading-spinner"></div>
        <p>Loading store locations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="store-locator-container" style={{ textAlign: "center", padding: "50px", color: "red" }}>
        <h2>Error</h2>
        <p>{error}</p>
        <button className="retry-button" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="store-locator-container">
      <div className="locator-header">
        <h2 className="locator-title">Find Collection Centers Near You</h2>
        <p className="locator-subtitle">Locate the nearest recycling centers and scrap collection points in your area</p>
      </div>

      <div className="search-container">
        <div className="search-input-wrapper">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="M21 21l-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Search by center name or address..."
            className="search-input"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={(e) => e.key === 'Enter' && handleSearchClick()}
          />
        </div>
        <button className="search-button" onClick={handleSearchClick}>
          Search
        </button>
      </div>

      <div className="stats-container">
        <div className="stat-item">
          <span className="stat-number">{allLocations.length}</span>
          <span className="stat-label">Collection Centers</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{filteredLocationsFromSearch.length}</span>
          <span className="stat-label">Search Results</span>
        </div>
      </div>

      <div className="content-area">
        <div className="store-list">
          <div className="store-list-header">
            <h3>Collection Centers</h3>
            <span>{filteredLocationsFromSearch.length} centers found</span>
          </div>
          {filteredLocationsFromSearch.length > 0 ? (
            filteredLocationsFromSearch.map((location) => (
              <div className={`store-item ${selectedLocation?._id === location._id ? 'active' : ''}`} key={location._id}>
                <div className="store-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div className="store-info">
                  <h3 className="store-name">{location.name}</h3>
                  {location.address && (
                    <p className="store-address">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2a8 8 0 0 0-8 8c0 6 8 12 8 12s8-6 8-12a8 8 0 0 0-8-8z"></path>
                      </svg>
                      {location.address}
                    </p>
                  )}
                  {location.phone && (
                    <p className="store-phone">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      {location.phone}
                    </p>
                  )}
                  {location.hours && (
                    <p className="store-hours">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      {location.hours}
                    </p>
                  )}
                  {location.additional && (
                    <p className="store-additional">{location.additional}</p>
                  )}
                </div>
                <div className="store-actions">
                  <button
                    className="view-map-button"
                    onClick={() => handleFocusLocation(location)}
                  >
                    View on Map
                  </button>
                  <a
                    href={getDirectionsUrl(location)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="directions-button"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="M21 21l-4.35-4.35"></path>
              </svg>
              <p>
                {searchTerm
                  ? "No centers found matching your search."
                  : allLocations.length === 0
                  ? "No collection centers available."
                  : "Enter a search term to find centers."}
              </p>
            </div>
          )}
        </div>

        <div className="map-area">
          <LoadScript 
            googleMapsApiKey={GOOGLE_MAPS_API_KEY}
            onLoad={() => setIsMapLoaded(true)}
          >
            {isMapLoaded && (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={mapZoom}
                onLoad={(map) => (mapRef.current = map)}
              >
                {allLocations.map((location) => {
                  const isFocused = focusedLocationPosition &&
                    location.position.lat === focusedLocationPosition.lat &&
                    location.position.lng === focusedLocationPosition.lng;
                  
                  return (
                    <Marker
                      key={location._id}
                      position={location.position}
                      title={location.name}
                      onClick={() => handleMarkerClick(location)}
                      icon={getMarkerIcon(location, isFocused)}
                    />
                  );
                })}
                {selectedLocation && (
                  <InfoWindow
                    position={selectedLocation.position}
                    onCloseClick={handleInfoWindowClose}
                  >
                    <div className="info-window">
                      <h4>{selectedLocation.name}</h4>
                      {selectedLocation.address && <p>{selectedLocation.address}</p>}
                      {selectedLocation.phone && <p>📞 {selectedLocation.phone}</p>}
                      {selectedLocation.hours && <p>🕒 {selectedLocation.hours}</p>}
                      <a
                        href={getDirectionsUrl(selectedLocation)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="info-directions"
                      >
                        Get Directions →
                      </a>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            )}
          </LoadScript>
        </div>
      </div>
    </div>
  );
}

export default LocationMap;