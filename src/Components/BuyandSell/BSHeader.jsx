import React, { useState } from 'react';
import './BSHeader.css';

function BSHeader({ onSearch, onClear }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    onSearch(newSearchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onClear(); 
  };


  return (
    <div className="search-bar">
      <div className="search-bar__icon-container">
        <svg
          className="search-bar__search-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
      <input
        type="text"
        className="search-bar__input"
        placeholder="Search Products"
        value={searchTerm}
        onChange={handleInputChange}
        aria-label="Search Products"
      />
      {searchTerm && (
        <button className="search-bar__clear-button" onClick={handleClear} aria-label="Clear Search">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
    </div>
  );
}

export default BSHeader;