import React from 'react';
import './BSheader.css'; 


function BSHeader() {
    const imageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTz2aMzWJxHdWx3rNbTDBR3KXXL0kClJwPSjg&s";
  return (

      <div className="door-listing-container">
        {/* Search and Filter */}
        <div className="search-filter-container">
          <input type="text" placeholder="Search" className="search-input" />
          <div className="filter-dropdown">
            <button className="filter-button">Filter</button>
            <div className="filter-options">
              <a href="#">Filter 1</a>
              <a href="#">Filter 2</a>
              <a href="#">Filter 3</a>
            </div>
          </div>
          <button className="main-button">Button</button>
        </div>
  
        {/* Door Listings */}
        <div className="door-grid">
          {/* Single Door Listing (Repeat this block for each door) */}
          <div className="door-item">
            <img src={imageUrl} alt="Aluminum Door" className="door-image" />
            <h3 className="door-title">Aluminum Door</h3>
            <p className="door-description">Use, good quality blue color</p>
            <p className="door-location">colombo, srilanka</p>
            <p className="door-phone">0785728115</p>
          </div>
  
          <div className="door-item">
            <img src={imageUrl} alt="Aluminum Door" className="door-image" />
            <h3 className="door-title">Aluminum Door</h3>
            <p className="door-description">Use, good quality blue color</p>
            <p className="door-location">colombo, srilanka</p>
            <p className="door-phone">0785728115</p>
          </div>
  
          <div className="door-item">
            <img src={imageUrl} alt="Aluminum Door" className="door-image" />
            <h3 className="door-title">Aluminum Door</h3>
            <p className="door-description">Use, good quality blue color</p>
            <p className="door-location">colombo, srilanka</p>
            <p className="door-phone">0785728115</p>
          </div>
  
          <div className="door-item">
            <img src={imageUrl} alt="Aluminum Door" className="door-image" />
            <h3 className="door-title">Aluminum Door</h3>
            <p className="door-description">Use, good quality blue color</p>
            <p className="door-location">colombo, srilanka</p>
            <p className="door-phone">0785728115</p>
          </div>
          {/* End Single Door Listing */}
        </div>
      </div>
    );
  }

export default BSHeader;