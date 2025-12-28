import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axiosInstance from "../../api/axiosInstance";
import "./LocationMap.css";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
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
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get("/shop-locations");

        if (
          response.data?.success &&
          Array.isArray(response.data.data)
        ) {
          const validLocations = response.data.data.filter(
            (loc) =>
              loc.position &&
              typeof loc.position.lat === "number" &&
              typeof loc.position.lng === "number"
          );
          setAllLocations(validLocations);
        } else {
          throw new Error(
            response.data?.message || "Invalid location data format."
          );
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
    }
  };

  const handleSearchClick = () => {
    if (filteredLocationsFromSearch.length > 0) {
      setFocusedLocationPosition(filteredLocationsFromSearch[0].position);
    } else {
      setFocusedLocationPosition(null);
    }
  };

  const handleFocusLocation = (location) => {
    setFocusedLocationPosition(location.position);

    const mapElement = document.querySelector(".map-area");
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const mapCenter = focusedLocationPosition || KALUTARA_DISTRICT_CENTER;
  const mapZoom = focusedLocationPosition ? 15 : KALUTARA_DISTRICT_ZOOM;

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
        <p>Loading store locations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="store-locator-container" style={{ textAlign: "center", padding: "50px", color: "red" }}>
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="store-locator-container">
      <h2 className="locator-title">Store Locator – Find Near You</h2>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name or address"
          className="search-input"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button className="search-button" onClick={handleSearchClick}>
          Search
        </button>
      </div>

      <div className="content-area">
        <div className="store-list">
          {filteredLocationsFromSearch.length > 0 ? (
            filteredLocationsFromSearch.map((location) => (
              <div className="store-item" key={location._id}>
                <h3 className="store-name">{location.name}</h3>
                {location.address && <p className="store-address">{location.address}</p>}
                {location.phone && <p className="store-phone">Phone: {location.phone}</p>}
                {location.hours && <p className="store-hours">Hours: {location.hours}</p>}
                {location.additional && <p className="store-additional">{location.additional}</p>}

                <div className="store-actions">
                  <button
                    className="view-map-button"
                    onClick={() => handleFocusLocation(location)}
                  >
                    View on Map
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ padding: "20px", textAlign: "center" }}>
              {searchTerm
                ? "No locations found matching your search."
                : allLocations.length === 0
                ? "No locations available."
                : "Enter a search term to find locations."}
            </p>
          )}
        </div>

        <div className="map-area">
          <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapCenter}
              zoom={mapZoom}
              onLoad={(map) => (mapRef.current = map)}
            >
              {allLocations.map((location) => (
                <Marker
                  key={location._id}
                  position={location.position}
                  title={location.name}
                  onClick={() => handleFocusLocation(location)}
                  icon={
                    focusedLocationPosition &&
                    location.position.lat === focusedLocationPosition.lat &&
                    location.position.lng === focusedLocationPosition.lng
                      ? "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                      : undefined
                  }
                />
              ))}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </div>
  );
}

export default LocationMap;
