import React, { useState, useEffect } from 'react';
import './Calculate.css';

const Calculate = () => {
  const [weight, setWeight] = useState('');
  const [selectedScrap, setSelectedScrap] = useState(0);
  const [resultUSD, setResultUSD] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);

  const exchangeRate = 300; // 1 USD = 300 LKR

  const scrapTypes = [
    { name: 'Clean Aluminum', price: 1.10 },
    { name: 'Cast Aluminum', price: 0.90 },
    { name: 'Aluminum Cans', price: 1.00 },
    { name: 'Aluminum Siding', price: 1.05 },
    { name: 'Aluminum Wire', price: 1.15 },
    { name: 'Aluminum Others', price: 1.20 },
  ];

  const handleCalculate = (e) => {
    e.preventDefault();
    const weightValue = parseFloat(weight);
    const priceValue = scrapTypes[selectedScrap].price;

    if (!isNaN(weightValue) && weightValue > 0) {
      const totalUSD = weightValue * priceValue;
      setResultUSD(totalUSD);
      setShowAnimation(true);
    }
  };

  useEffect(() => {
    if (showAnimation) {
      const timer = setTimeout(() => {
        setShowAnimation(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showAnimation]);

  return (
    <div className="scrap-calculator-container">
      <div className="calculator-card">
        <div className="calculator-header">
          <h2 className="calculator-title">Aluminum Scrap Calculator</h2>
          <p className="calculator-subtitle">Calculate the value of your aluminum scrap</p>
        </div>

        {resultUSD && (
          <div className={`result-container ${showAnimation ? 'show' : ''}`}>
            <h3 className="result-label">Total Value:</h3>
            <div className="result-value">
              USD: ${resultUSD.toFixed(2)} <br />
              LKR: Rs. {(resultUSD * exchangeRate).toFixed(2)}
            </div>
          </div>
        )}

        <form onSubmit={handleCalculate} className="calculator-form">
          <div className="input-focus-effect">
            <label className="form-label">Scrap Type</label>
            <select 
              className="scrap-form-control scrap-select"
              value={selectedScrap}
              onChange={(e) => setSelectedScrap(parseInt(e.target.value))}
            >
              {scrapTypes.map((type, index) => (
                <option key={index} value={index}>
                  {type.name} (${type.price.toFixed(2)}/kg)
                </option>
              ))}
            </select>
          </div>

          <div className="input-focus-effect">
            <label className="form-label">Weight (kg)</label>
            <input 
              type="number" 
              step="0.01"
              min="0"
              value={weight} 
              onChange={(e) => setWeight(e.target.value)}
              required
              placeholder="Enter weight in kg"
              className="scrap-form-control"
            />
          </div>

          <button type="submit" className="calculate-button">
            Calculate Value
          </button>
        </form>

        <div className="price-table">
          <h3 className="price-table-title">Current Scrap Prices (per kg)</h3>
          <div className="price-table-grid">
            {scrapTypes.map((type, index) => (
              <div key={index} className="price-table-item">
                <span className="price-table-name">{type.name}:</span>
                <span className="price-table-value">${type.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculate;
