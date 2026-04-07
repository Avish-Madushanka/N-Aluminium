import React, { useState, useEffect, useCallback } from 'react';
import './Calculate.css';
import axiosInstance from '../../api/axiosInstance';

const Calculate = () => {
  const [weight, setWeight] = useState('');
  const [scrapTypes, setScrapTypes] = useState([]);
  const [calculations, setCalculations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState('kg');
  const [exchangeRate, setExchangeRate] = useState(300);

  const fetchActiveScrapTypes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/scrap-types');
      const activeTypes = response.data.data.filter(type => type.isActive);
      setScrapTypes(activeTypes || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load scrap prices.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchExchangeRate = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/exchange-rate');
      if (response.data && response.data.rate) {
        setExchangeRate(response.data.rate);
      }
    } catch (err) {
      console.error('Failed to fetch exchange rate:', err);
    }
  }, []);

  useEffect(() => {
    fetchActiveScrapTypes();
    fetchExchangeRate();
  }, [fetchActiveScrapTypes, fetchExchangeRate]);

  const getWeightInKg = (val) => {
    const numVal = parseFloat(val);
    if (isNaN(numVal)) return 0;
    if (selectedUnit === 'lbs') return numVal * 0.453592;
    if (selectedUnit === 'tons') return numVal * 907.185;
    return numVal;
  };

  const handleCalculate = (e) => {
    if (e) e.preventDefault();
    const weightVal = parseFloat(weight);
    if (isNaN(weightVal) || weightVal <= 0) return;

    const kgWeight = getWeightInKg(weightVal);
    const results = scrapTypes.map(scrap => ({
      id: scrap._id,
      name: scrap.name,
      price: scrap.price,
      unit: scrap.unit || 'kg',
      totalUSD: kgWeight * scrap.price,
      totalLKR: kgWeight * scrap.price * exchangeRate
    }));
    setCalculations(results);
  };

  const handleSingleCalc = (scrap) => {
    const weightVal = parseFloat(weight);
    if (isNaN(weightVal) || weightVal <= 0) return;

    const kgWeight = getWeightInKg(weightVal);
    setCalculations([{
      id: scrap._id,
      name: scrap.name,
      price: scrap.price,
      unit: scrap.unit || 'kg',
      totalLKR: kgWeight * scrap.price * exchangeRate,
      totalUSD: kgWeight * scrap.price
    }]);
  };

  const handleClear = () => {
    setWeight('');
    setCalculations([]);
  };

  const totalSumLKR = calculations.reduce((acc, curr) => acc + curr.totalLKR, 0);
  const totalSumUSD = calculations.reduce((acc, curr) => acc + curr.totalUSD, 0);

  return (
    <div className="layout-container">
      <div className="section-1">
        <div className="price-display-header">
          <h2>Market Rates</h2>
          <p>Real-time scrap metal market rates updated daily. Know your scrap's worth before you sell for maximum profit.</p>
        </div>
        {isLoading && <div className="status-msg">Loading scrap types...</div>}
        {error && <div className="status-msg error">{error}</div>}
        <div className="price-grid">
          {scrapTypes.map((scrap) => (
            <div key={scrap._id} className="price-item-card">
              <span className="scrap-name">{scrap.name}</span>
              <span className="scrap-price-lkr">
                Rs. {(scrap.price * exchangeRate).toLocaleString()} /{scrap.unit || 'kg'}
              </span>
              <span className="scrap-price">
                ${scrap.price.toFixed(2)} 
                <sub>/{scrap.unit || 'kg'}</sub>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="right-panel">
        <div className="section-3">
          <div className="total-display-box">
            <div className="total-main">
              <label>Total Estimated Value</label>
              <h1>Rs. {totalSumLKR.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h1>
              <p className="usd-total">${totalSumUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="calculation-breakdown">
              {calculations.length === 0 && "No calculation yet"}
              {calculations.length === 1 && `${calculations[0]?.name}`}
              {calculations.length > 1 && `${calculations.length} items selected`}
            </div>
          </div>
        </div>

        <div className="section-2">
          <div className="calc-process-card">
            <h3>Value Calculator</h3>
            <form onSubmit={handleCalculate} className="input-row">
              <div className="field-group">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Enter weight"
                  step="0.01"
                  min="0"
                />
                <select value={selectedUnit} onChange={(e) => setSelectedUnit(e.target.value)}>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="lbs">Pounds (lbs)</option>
                  <option value="tons">Tons</option>
                </select>
              </div>
              <button type="submit" disabled={!weight || scrapTypes.length === 0}>
                Calculate All
              </button>
              {calculations.length > 0 && (
                <button type="button" onClick={handleClear} className="clear-btn">
                  Clear
                </button>
              )}
            </form>

            <div className="quick-actions">
              <label>Quick Estimate Per Type:</label>
              <div className="action-btns">
                {scrapTypes.map(scrap => (
                  <button 
                    key={scrap._id} 
                    onClick={() => handleSingleCalc(scrap)}
                    disabled={!weight}
                    className="quick-btn"
                  >
                    {scrap.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculate;