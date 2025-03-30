import React, { useState } from 'react';
import './LocationMap.css'; 

function LocationMap() {
    const [searchTerm, setSearchTerm] = useState('');
    const [locations, setLocations] = useState([
        {
            id: 1,
            name: "Vitamin Shoppe Chambers",
            address: "108 Chambers Street New York NY 10007",
            phone: "(917) 363-9256",
            hours: "M-F 8-8 Sat 10-7 Sun 11-6",
            additional: "BDS New",
            distance: "0.19 mi",
        },
        {
            id: 2,
            name: "Vitamin Shoppe 174 Broadway",
            address: "174 Broadway New York NY 10038",
            phone: "(212) 608-1540",
            hours: "M-F 7:30-8 Sat 10-7 Sun 11-6",
            additional: "(212) 608-2094",
            distance: "0.29 mi",
        },
    ]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredLocations = locations.filter((location) =>
        location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="store-locator-container">
            <h2 className="locator-title">Store Locator - Find Bulletproof products near you.</h2>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="new york"
                    className="search-input"
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <button className="search-button">Search</button>
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
                                <button className="view-map-button">View On Map</button>
                                <button className="directions-button">Directions</button>
                            </div>
                        </div>
                    ))}
                </div>


                <div className="map-area">
                </div>
            </div>
        </div>
    );
}

export default LocationMap;