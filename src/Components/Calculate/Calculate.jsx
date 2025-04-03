import React, { useState } from 'react';
import './Calculate.css';

const Calculate = () => {
  const [weight, setWeight] = useState('');
  const [selectedScrap, setSelectedScrap] = useState({ name: 'Clean Aluminum', price: 1.10 });
  const [result, setResult] = useState(null);

  const scrapTypes = [
    { name: 'Clean Aluminum', price: 1.10 },
    { name: 'Cast Aluminum', price: 0.90 },
    { name: 'Aluminum Cans', price: 1.00 },
    { name: 'Aluminum Siding', price: 1.05 },
    { name: 'Aluminum Wheels', price: 1.20 }
  ];

  const handleCalculate = (e) => {
    e.preventDefault();
    const weightValue = parseFloat(weight);
    const priceValue = selectedScrap.price;
    
    if (!isNaN(weightValue) && !isNaN(priceValue)) {
      const totalValue = weightValue * priceValue;
      setResult({
        weight: weightValue,
        pricePerKg: priceValue,
        totalValue: totalValue
      });
    }
  };

  return (
    <div className="calculator-container">
      <h2 className="calculator-title">Aluminum Scrap Calculator</h2>
      
      {result && (
        <div className="result-container">
          <h3>Total Value: <span className="result-value">${result.totalValue.toFixed(2)}</span></h3>
        </div>
      )}
      
      <form onSubmit={handleCalculate} className="calculator-form">
        <label>Scrap Type</label>
        <select onChange={(e) => setSelectedScrap(scrapTypes[e.target.selectedIndex])}>
          {scrapTypes.map((type, index) => (
            <option key={index} value={type.price}>
              {type.name} (${type.price.toFixed(2)}/kg)
            </option>
          ))}
        </select>

        <label>Weight (kg)</label>
        <input 
          type="number" 
          value={weight} 
          onChange={(e) => setWeight(e.target.value)}
          required
          placeholder="Enter weight in kg"
        />
        
        <label>Price Per Kg ($)</label>
        <input 
          type="text" 
          value={selectedScrap.price.toFixed(2)} 
          readOnly
        />
        
        <button type="submit" className="calculate-btn">Calculate Value</button>
      </form>
    </div>
  );
};

export default Calculate;
