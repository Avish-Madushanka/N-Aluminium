import React, { useState } from "react";
import "./GlassOrder.css";

const glassData = [
  {
    id: 1,
    name: "Clear Tempered Glass",
    qualities: {
      Standard: { "4mm": 3500, "6mm": 5200, "8mm": 6800, "10mm": 8200 },
      Premium: { "4mm": 4200, "6mm": 6000, "8mm": 7800, "10mm": 9200 }
    },
    image: "/images/glass1.jpg"
  },
  {
    id: 2,
    name: "Frosted Glass",
    qualities: {
      Standard: { "4mm": 4500, "6mm": 6300, "8mm": 7900, "10mm": 9400 },
      Premium: { "4mm": 5200, "6mm": 7100, "8mm": 8800, "10mm": 10800 }
    },
    image: "/images/glass2.jpg"
  },
  {
    id: 3,
    name: "Laminated Safety Glass",
    qualities: {
      Standard: { "6mm": 7800, "8mm": 9500, "10mm": 11800 },
      Premium: { "6mm": 9200, "8mm": 11200, "10mm": 13800 }
    },
    image: "/images/glass3.jpg"
  }
];

const lorryOptions = [
  "Small Lorry – 1 Ton",
  "Medium Lorry – 2.5 Ton",
  "Large Lorry – 5 Ton",
  "Crane Lorry – 8 Ton"
];

export default function GlassOrder() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [lorry, setLorry] = useState("");

  const handleSelectGlass = (glass, size, quality) => {
    if (!size || !quality) return;
    const price = glass.qualities[quality][size];
    const newItem = {
      id: Date.now(),
      glassId: glass.id,
      name: glass.name,
      size,
      quality,
      price
    };
    setSelectedItems([...selectedItems, newItem]);
  };

  const handleRemoveItem = (id) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== id));
  };

  const total = selectedItems.reduce((sum, i) => sum + i.price, 0);

  return (
    <div className="GlaOrd-container">
      <h1 className="GlaOrd-title">Construction Glass Ordering</h1>

      <div className="GlaOrd-grid">
        {glassData.map((glass) => (
          <GlassCard
            key={glass.id}
            glass={glass}
            onSelect={handleSelectGlass}
          />
        ))}
      </div>

      <div className="GlaOrd-selected-section">
        <h2 className="GlaOrd-subtitle">Selected Glass Items</h2>

        {selectedItems.length === 0 && (
          <p className="GlaOrd-empty">No glasses selected yet.</p>
        )}

        {selectedItems.map((item) => (
          <div key={item.id} className="GlaOrd-selected-card">
            <div className="GlaOrd-selected-info">
              <h3>{item.name}</h3>
              <p>Size: {item.size}</p>
              <p>Quality: {item.quality}</p>
              <p className="GlaOrd-price">Rs {item.price.toLocaleString()}</p>
            </div>
            <button
              className="GlaOrd-remove-btn"
              onClick={() => handleRemoveItem(item.id)}
            >
              Remove
            </button>
          </div>
        ))}

        {selectedItems.length > 0 && (
          <>
            <div className="GlaOrd-total">
              Total Price: Rs {total.toLocaleString()}
            </div>

            <div className="GlaOrd-lorry-section">
              <label>Select Transport Lorry</label>
              <select
                className="GlaOrd-select"
                value={lorry}
                onChange={(e) => setLorry(e.target.value)}
              >
                <option value="">Select Lorry</option>
                {lorryOptions.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <button className="GlaOrd-order-btn">
              Confirm Order
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function GlassCard({ glass, onSelect }) {
  const [size, setSize] = useState("");
  const [quality, setQuality] = useState("");

  return (
    <div className="GlaOrd-card">
      <img src={glass.image} alt={glass.name} className="GlaOrd-image" />
      <h3 className="GlaOrd-name">{glass.name}</h3>

      <div className="GlaOrd-select-group">
        <label>Quality</label>
        <select
          className="GlaOrd-select"
          value={quality}
          onChange={(e) => {
            setQuality(e.target.value);
            setSize("");
          }}
        >
          <option value="">Select Quality</option>
          {Object.keys(glass.qualities).map((q) => (
            <option key={q} value={q}>
              {q}
            </option>
          ))}
        </select>
      </div>

      {quality && (
        <div className="GlaOrd-select-group">
          <label>Size (mm)</label>
          <select
            className="GlaOrd-select"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          >
            <option value="">Select Size</option>
            {Object.keys(glass.qualities[quality]).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      )}

      {size && quality && (
        <p className="GlaOrd-price">
          Rs {glass.qualities[quality][size].toLocaleString()}
        </p>
      )}

      <button
        className="GlaOrd-add-btn"
        onClick={() => onSelect(glass, size, quality)}
        disabled={!size || !quality}
      >
        Add to Order
      </button>
    </div>
  );
}
