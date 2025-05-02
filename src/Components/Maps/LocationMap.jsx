import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import "./LocationMap.css";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const sriLankaCenter = {
  lat: 7.8731,
  lng: 80.7718,
};

function LocationMap() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);

  const locations = [
    {
      id: 1,
      name: "Vitamin Shoppe Colombo",
      address: "Colombo, Sri Lanka",
      phone: "+94 112 345 678",
      hours: "M-F 8-8 Sat 10-7 Sun 11-6",
      additional: "New Branch",
      distance: "2 km",
      position: { lat: 6.9271, lng: 79.8612 },
    },
    {
      id: 2,
      name: "Vitamin Shoppe Kandy",
      address: "Kandy, Sri Lanka",
      phone: "+94 812 345 678",
      hours: "M-F 7:30-8 Sat 10-7 Sun 11-6",
      additional: "New Branch",
      distance: "5 km",
      position: { lat: 7.2906, lng: 80.6337 },
    },
    {
      id: 3,
      name: "ABCD Kandy",
      address: "Kandy, Sri Lanka",
      phone: "+94 123 123 123",
      hours: "M-F 7:30-8 Sat 10-7 Sun 11-6",
      additional: "New Branch",
      distance: "15 km",
      position: { lat: 7.2950, lng: 80.6380 }, // slightly adjusted to avoid overlap
    },
  ];

  const filteredLocations = locations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
    if (filteredLocations.length > 0) {
      setSelectedLocation(filteredLocations[0].position);
    }
  };

  return (
    <div className="store-locator-container">
      <h2 className="locator-title">Store Locator - Find Bulletproof products near you.</h2>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search the location"
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
          {filteredLocations.map((location) => (
            <div className="store-item" key={location.id}>
              <h3 className="store-name">{location.name}</h3>
              <p className="store-address">{location.address}</p>
              <p className="store-phone">{location.phone}</p>
              <p className="store-hours">{location.hours}</p>
              <p className="store-additional">{location.additional}</p>
              <p className="store-distance">{location.distance}</p>
              <div className="store-actions">
                <button className="view-map-button" onClick={() => setSelectedLocation(location.position)}>
                  View On Map
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="map-area">
          <LoadScript googleMapsApiKey="AIzaSyBb_eKF3rpllpvWbYlfDHI1qyGKMjLhhYI">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={selectedLocation || sriLankaCenter}
              zoom={selectedLocation ? 12 : 7}
            >
              {filteredLocations.map((location) => (
                <Marker key={location.id} position={location.position} />
              ))}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </div>
  );
}

export default LocationMap;
