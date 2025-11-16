import React, { useState } from 'react';
import './GlassOrder.css'; // Import the CSS file

const glassProducts = [
  {
    id: 1,
    name: 'Clear Float Glass',
    image: 'https://i.imgur.com/kY3J18m.png', // Placeholder image
    prices: {
      Standard: {
        '4mm': 1500, '6mm': 2200, '8mm': 3000, '10mm': 4000
      },
      Premium: {
        '4mm': 1800, '6mm': 2600, '8mm': 3500, '10mm': 4800
      }
    }
  },
  {
    id: 2,
    name: 'Toughened Glass',
    image: 'https://i.imgur.com/j2m4xUo.png', // Placeholder image
    prices: {
      Standard: {
        '5mm': 2000, '6mm': 2800, '8mm': 3800, '12mm': 5500
      },
      Premium: {
        '5mm': 2400, '6mm': 3300, '8mm': 4500, '12mm': 6500
      }
    }
  },
  {
    id: 3,
    name: 'Laminated Glass',
    image: 'https://i.imgur.com/gK5D7Mh.png', // Placeholder image
    prices: {
      Standard: {
        '6.38mm': 3500, '8.38mm': 4500, '10.76mm': 6000
      },
      Premium: {
        '6.38mm': 4200, '8.38mm': 5400, '10.76mm': 7200
      }
    }
  },
  {
    id: 4,
    name: 'Tinted Glass',
    image: 'https://i.imgur.com/YwKqjVl.png', // Placeholder image
    prices: {
      Standard: {
        '4mm': 1800, '6mm': 2500, '8mm': 3400
      },
      Premium: {
        '4mm': 2100, '6mm': 3000, '8mm': 4000
      }
    }
  },
];

const lorryOptions = [
  { id: 'small', name: 'Small Lorry', capacity: '1 Ton', price: 5000 },
  { id: 'medium', name: 'Medium Lorry', capacity: '2.5 Ton', price: 8000 },
  { id: 'large', name: 'Large Lorry', capacity: '5 Ton', price: 12000 },
  { id: 'crane', name: 'Crane Lorry', capacity: '8 Ton', price: 25000 }
];

const GlassOrder = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedLorry, setSelectedLorry] = useState(null);

  const handleAddToOrder = (glass, selectedQuality, selectedSize) => {
    if (!selectedQuality || !selectedSize) return;

    const price = glass.prices[selectedQuality][selectedSize];
    const newItem = {
      glassId: glass.id,
      glassName: glass.name,
      quality: selectedQuality,
      size: selectedSize,
      price: price
    };
    setSelectedItems(prevItems => [...prevItems, newItem]);
  };

  const handleRemoveItem = (index) => {
    setSelectedItems(prevItems => prevItems.filter((_, i) => i !== index));
  };

  const totalGlassPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);
  const totalLorryPrice = selectedLorry ? lorryOptions.find(lorry => lorry.id === selectedLorry).price : 0;
  const grandTotal = totalGlassPrice + totalLorryPrice;

  return (
    <div className="GlaOrd-container">
      <h1 className="GlaOrd-mainTitle">Glass Ordering System</h1>

      <div className="GlaOrd-glassGrid">
        {glassProducts.map(glass => (
          <GlassCard key={glass.id} glass={glass} onAddToOrder={handleAddToOrder} />
        ))}
      </div>

      {selectedItems.length > 0 && (
        <div className="GlaOrd-orderSummary">
          <h2 className="GlaOrd-sectionTitle">Your Order</h2>
          <ul className="GlaOrd-itemList">
            {selectedItems.map((item, index) => (
              <li key={index} className="GlaOrd-item">
                <span className="GlaOrd-itemName">{item.glassName}</span>
                <span className="GlaOrd-itemDetails">
                  {item.size} / {item.quality} - Rs {item.price.toFixed(2)}
                </span>
                <button className="GlaOrd-removeItemBtn" onClick={() => handleRemoveItem(index)}>
                  &times;
                </button>
              </li>
            ))}
          </ul>
          <div className="GlaOrd-totalGlassPrice">
            Total Glass Price: <span className="GlaOrd-priceValue">Rs {totalGlassPrice.toFixed(2)}</span>
          </div>

          <h2 className="GlaOrd-sectionTitle GlaOrd-transportTitle">Transport Options</h2>
          <div className="GlaOrd-lorrySelection">
            {lorryOptions.map(lorry => (
              <label key={lorry.id} className="GlaOrd-lorryOption">
                <input
                  type="radio"
                  name="lorry"
                  value={lorry.id}
                  checked={selectedLorry === lorry.id}
                  onChange={(e) => setSelectedLorry(e.target.value)}
                />
                {lorry.name} ({lorry.capacity}) - Rs {lorry.price.toFixed(2)}
              </label>
            ))}
          </div>
          {selectedLorry && (
            <div className="GlaOrd-lorryPrice">
              Lorry Charge: <span className="GlaOrd-priceValue">Rs {totalLorryPrice.toFixed(2)}</span>
            </div>
          )}

          <div className="GlaOrd-grandTotal">
            Grand Total: <span className="GlaOrd-priceValue">Rs {grandTotal.toFixed(2)}</span>
          </div>

          <button className="GlaOrd-confirmOrderBtn" disabled={!selectedLorry}>
            Confirm Order
          </button>
        </div>
      )}
    </div>
  );
};

const GlassCard = ({ glass, onAddToOrder }) => {
  const [selectedQuality, setSelectedQuality] = useState(Object.keys(glass.prices)[0]);
  const [selectedSize, setSelectedSize] = useState(Object.keys(glass.prices[Object.keys(glass.prices)[0]])[0]);

  const availableSizes = Object.keys(glass.prices[selectedQuality] || {});
  const currentPrice = glass.prices[selectedQuality]?.[selectedSize] || 0;

  return (
    <div className="GlaOrd-glassCard">
      <img src={glass.image} alt={glass.name} className="GlaOrd-glassImage" />
      <h3 className="GlaOrd-glassName">{glass.name}</h3>

      <div className="GlaOrd-selectorGroup">
        <label htmlFor={`quality-${glass.id}`} className="GlaOrd-label">Quality:</label>
        <select
          id={`quality-${glass.id}`}
          className="GlaOrd-select"
          value={selectedQuality}
          onChange={(e) => {
            setSelectedQuality(e.target.value);
            setSelectedSize(Object.keys(glass.prices[e.target.value])[0]); // Reset size when quality changes
          }}
        >
          {Object.keys(glass.prices).map(quality => (
            <option key={quality} value={quality}>{quality}</option>
          ))}
        </select>
      </div>

      <div className="GlaOrd-selectorGroup">
        <label htmlFor={`size-${glass.id}`} className="GlaOrd-label">Size (mm):</label>
        <select
          id={`size-${glass.id}`}
          className="GlaOrd-select"
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
        >
          {availableSizes.map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>

      <div className="GlaOrd-priceDisplay">
        Price: <span className="GlaOrd-currentPrice">Rs {currentPrice.toFixed(2)}</span>
      </div>

      <button
        className="GlaOrd-addToOrderBtn"
        onClick={() => onAddToOrder(glass, selectedQuality, selectedSize)}
      >
        Add to Order
      </button>
    </div>
  );
};

export default GlassOrder;