import React, { useState } from 'react';
import './Calculate.css';

const Calculate = () => {
  const [weight, setWeight] = useState('');
  const [selectedScrap, setSelectedScrap] = useState({ name: 'Clean Aluminum', price: 0.50 });
  const [unit, setUnit] = useState('lbs');
  const [result, setResult] = useState(null);

  const scrapTypes = [
    { name: 'Clean Aluminum', price: 0.50 },
    { name: 'Cast Aluminum', price: 0.40 },
    { name: 'Aluminum Cans', price: 0.45 },
    { name: 'Aluminum Siding', price: 0.48 },
    { name: 'Aluminum Wheels', price: 0.60 }
  ];

  const kgToLbs = 2.20462;
  const lbsToKg = 0.453592;

  const handleCalculate = (e) => {
    e.preventDefault();
    const weightValue = parseFloat(weight);
    const priceValue = selectedScrap.price;
    
    if (!isNaN(weightValue) && !isNaN(priceValue)) {
      const weightInLbs = unit === 'kg' ? weightValue * kgToLbs : weightValue;
      const totalValue = weightInLbs * priceValue;
      
      setResult({
        weight: weightValue,
        unit: unit,
        weightInLbs: unit === 'kg' ? weightInLbs : weightValue,
        weightInKg: unit === 'lbs' ? weightValue * lbsToKg : weightValue,
        pricePerPound: priceValue,
        totalValue: totalValue
      });
    }
  };

  const toggleUnit = () => {
    if (weight && !isNaN(parseFloat(weight))) {
      const weightValue = parseFloat(weight);
      let newWeight;
      
      if (unit === 'lbs') {
        newWeight = (weightValue * lbsToKg).toFixed(2);
        setUnit('kg');
      } else {
        newWeight = (weightValue * kgToLbs).toFixed(2);
        setUnit('lbs');
      }
      
      setWeight(newWeight);
    } else {
      setUnit(unit === 'lbs' ? 'kg' : 'lbs');
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
              {type.name} (${type.price.toFixed(2)}/lb)
            </option>
          ))}
        </select>
        
        <label>Weight ({unit})</label>
        <div className="input-group">
          <input 
            type="number" 
            value={weight} 
            onChange={(e) => setWeight(e.target.value)}
            required
          />
          <button type="button" onClick={toggleUnit} className="unit-toggle">Switch to {unit === 'lbs' ? 'kg' : 'lbs'}</button>
        </div>
        
        <label>Price Per Pound ($)</label>
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
