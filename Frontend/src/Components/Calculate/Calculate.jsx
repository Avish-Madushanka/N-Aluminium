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
    const weightValue = parseFloat(weight);
    const selectedScrapType = scrapTypes.find(type => type._id === selectedScrapId);

    if (!selectedScrapType) {
      setError('Please select a valid scrap type.');
      setResultUSD(null);
      return;
    }

    const priceValue = selectedScrapType.price;

    if (!isNaN(weightValue) && weightValue > 0) {
      const totalUSD = weightValue * priceValue;
      setResultUSD(totalUSD);
      setShowAnimation(true);
      setError(null);
    } else {
      setResultUSD(null);
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

        {resultUSD !== null && (
          <div className={`result-container ${showAnimation ? 'show' : ''}`}>
            <h3 className="result-label">Total Value:</h3>
            <div className="result-value">
              USD: ${resultUSD.toFixed(2)} <br />
              LKR: Rs. {(resultUSD * exchangeRate).toFixed(2)}
            </div>
          </div>
        )}

        {isLoading && <p className="loading-message">Loading scrap prices...</p>}
        {error && <p className="error-message">{error}</p>}

        {!isLoading && scrapTypes.length > 0 && (
          <form onSubmit={handleCalculate} className="calculator-form">
            <div className="input-focus-effect">
              <label className="form-label">Scrap Type</label>
              <select
                className="scrap-form-control scrap-select"
                value={selectedScrapId}
                onChange={(e) => setSelectedScrapId(e.target.value)}
                disabled={isLoading || scrapTypes.length === 0}
              >
                {scrapTypes.map((type) => (
                  <option key={type._id} value={type._id}>
                    {type.name} (${type.price.toFixed(2)}/{type.unit || 'kg'})
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
                disabled={isLoading || scrapTypes.length === 0}
              />
            </div>

            <button type="submit" className="calculate-button" disabled={isLoading || scrapTypes.length === 0 || !weight}>
              Calculate Value
            </button>
          </form>
        )}

        {!isLoading && scrapTypes.length === 0 && !error && (
          <p className="info-message">Scrap price information is currently unavailable. Please check back later.</p>
        )}

        {!isLoading && scrapTypes.length > 0 && (
          <div className="price-table">
            <h3 className="price-table-title">Current Scrap Prices (per {scrapTypes[0]?.unit || 'kg'})</h3>
            <div className="price-table-grid">
              {scrapTypes.map((type) => (
                <div key={type._id} className="price-table-item">
                  <span className="price-table-name">{type.name}:</span>
                  <span className="price-table-value">${type.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calculate;
