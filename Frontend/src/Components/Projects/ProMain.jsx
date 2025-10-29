import React from 'react';
import './ProMain.css'; 

const ProMain = () => {
  return (
    <div className="Proj1-hero-container">
      <img
        src="https://images.adsttc.com/media/images/5a0e/c7f6/b22e/382f/e000/00b1/large_jpg/EXT_Bedroom.jpg?1510918117s"
        alt="Aluminum Windows"
        className="Proj1-hero-background"
      />
      <div className="Proj1-hero-content">
        <h1 className="Proj1-hero-title">WELCOME HOME</h1>
        <p className="Proj1-hero-subtitle">
          Rent unique places to stay from local hosts in 190 countries.
        </p>
      </div>
      <div className="Proj1-search-bar-container">
        <input
          type="text"
          placeholder="Search Projects"
          className="Proj1-search-input"
        />
        <select className="Proj1-search-select">
          <option>1 Guest</option>
          <option>2 Guests</option>
          <option>3 Guests</option>
          <option>4+ Guests</option>
        </select>
        <button className="Proj1-search-button">Search
        </button>
      </div>
    </div>
  );
};

export default ProMain;
