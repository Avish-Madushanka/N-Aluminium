import React, { useState, useEffect, useCallback } from 'react';
import './Calculate.css';
import axiosInstance from '../../api/axiosInstance';

const Calculate = () => {
  const [weight, setWeight] = useState('');
  const [scrapTypes, setScrapTypes] = useState([]);
  const [selectedScrapId, setSelectedScrapId] = useState('');
  const [resultUSD, setResultUSD] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState('kg'); 

  const exchangeRate = 300; 

  const fetchActiveScrapTypes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/scrap-types');
      const activeTypes = response.data.data.filter(type => type.isActive);
      if (activeTypes.length > 0) {
        setScrapTypes(activeTypes);
        setSelectedScrapId(activeTypes[0]._id);
      } else {
        setScrapTypes([]);
        setError('No active scrap types available at the moment.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load scrap prices.');
      setScrapTypes([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveScrapTypes();
  }, [fetchActiveScrapTypes]);

  const handleCalculate = (e) => {
    e.preventDefault();
    let weightValue = parseFloat(weight);
    const selectedScrapType = scrapTypes.find(type => type._id === selectedScrapId);

    if (!selectedScrapType) {
      setError('Please select a valid scrap type.');
      setResultUSD(null);
      return;
    }

    if (selectedUnit === 'lbs') {
      weightValue = weightValue * 0.453592; 
    } else if (selectedUnit === 'tons') {
      weightValue = weightValue * 907.185; 
    }

    const priceValue = selectedScrapType.price; 

    if (!isNaN(weightValue) && weightValue > 0) {
      const totalUSD = weightValue * priceValue;
      setResultUSD(totalUSD);
      setShowAnimation(true);
      setError(null);
    } else {
      setResultUSD(null);
      setError('Please enter a valid weight.');
    }
  };

  useEffect(() => {
    if (showAnimation) {
      const timer = setTimeout(() => setShowAnimation(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [showAnimation]);

  const selectedScrapType = scrapTypes.find(type => type._id === selectedScrapId);
  const currentPriceDisplay = selectedScrapType ? selectedScrapType.price.toFixed(2) : 'N/A';
  const currentUnit = selectedScrapType ? (selectedScrapType.unit || 'kg') : 'kg';

  return (
    <div className="calculate-container">
      <div className="calculate-wrapper">
        <div className="calculate-quote-section">
          <h1>Know Your <br></br> Scrap’s Worth</h1>
          <div className="calculate-image-placeholder"></div>
        </div>

        <div className="calculate-form-section">
          <div className="calculate-form-container">
            <div className="scrap-calculator-header">
              <i className="fas fa-calculator-alt"></i>
              <h2>Scrap Metal Calculator</h2>
            </div>
            <p className="calculator-subtitle">Calculate scrap metal value and estimated payout</p>

            {isLoading && <p className="loading-message">Loading scrap prices...</p>}
            {error && <p className="error-message">{error}</p>}

            {!isLoading && scrapTypes.length > 0 && (
              <form onSubmit={handleCalculate} className="calculator-form">
                <div className="input-group">
                  <label htmlFor="scrap-type">Scrap Type</label>
                  <select
                    id="scrap-type"
                    value={selectedScrapId}
                    onChange={(e) => setSelectedScrapId(e.target.value)}
                  >
                    {scrapTypes.map((type) => (
                      <option key={type._id} value={type._id}>
                        {type.name} 
                      </option>
                    ))}
                  </select>
                  {selectedScrapType && (
                    <p className="typical-price">Typical price: ${selectedScrapType.price.toFixed(2)}/{currentUnit}</p>
                  )}
                </div>

                <div className="input-group">
                  <label htmlFor="weight">Weight</label>
                  <div className="weight-input-group">
                    <input
                      id="weight"
                      type="number"
                      step="0.01"
                      min="0"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="Enter weight"
                    />
                    <select
                      value={selectedUnit}
                      onChange={(e) => setSelectedUnit(e.target.value)}
                      className="unit-select"
                    >
                      <option value="kg">Kilograms (kg)</option>
                      <option value="lbs">Pounds (lbs)</option>
                      <option value="tons">Tons</option>
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label>Current Price per {currentUnit === 'kg' ? 'Kilogram' : (currentUnit === 'lbs' ? 'Pound' : 'Ton')}</label>
                  <input
                    type="text"
                    value={`$ ${currentPriceDisplay}`}
                    readOnly
                    className="current-price-input"
                  />
                  <p className="check-local">Check local scrap yard for current prices</p>
                </div>

                <button type="submit" disabled={!weight || !selectedScrapId || isLoading}>
                  <i className="fas fa-calculator-alt button-icon"></i> Calculate Scrap Value
                </button>
              </form>
            )}

            {resultUSD !== null && (
              <div className={`result-section ${showAnimation ? 'show' : ''}`}>
                <h3>Scrap Value Results</h3>
                <div className="total-value-row">
                  <p>Total Scrap Value</p>
                  <p className="value">${resultUSD.toFixed(2)}</p>
                </div>
                <div className="lkr-value">
                  <p>LKR: Rs. {(resultUSD * exchangeRate).toFixed(2)}</p>
                </div>
                <button className="request-custom-btn">Request Custom Quote</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculate;