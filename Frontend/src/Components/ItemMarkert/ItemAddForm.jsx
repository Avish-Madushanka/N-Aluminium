import React, { useState } from "react";
import "./ItemAddForm.css";

export default function ItemAddForm() {
  const [selectedColors, setSelectedColors] = useState([]);

  const colors = [
    "#000000",
    "#FFFFFF",
    "#C0C0C0",
    "#B87333",
    "#A52A2A",
    "#1E90FF",
    "#228B22",
    "#FFD700"
  ];

  const toggleColor = (color) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter((c) => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  return (
    <div className="ItAddF-container">
      <h2 className="ItAddF-title">Add Aluminum Construction Item</h2>

      <form className="ItAddF-form">
        <div className="ItAddF-field">
          <label>Item Name</label>
          <input type="text" className="ItAddF-input" placeholder="Enter item name" />
        </div>

        <div className="ItAddF-field">
          <label>Category</label>
          <select className="ItAddF-input">
            <option value="">Select category</option>
            <option>Aluminum Rivet Nuts</option>
            <option>Aluminum Bars</option>
            <option>Channels</option>
            <option>Frames</option>
            <option>Panels</option>
            <option>Pipes & Tubes</option>
          </select>
        </div>

        <div className="ItAddF-field">
          <label>Material Grade</label>
          <input type="text" className="ItAddF-input" placeholder="e.g. 6061, 7075" />
        </div>

        <div className="ItAddF-field">
          <label>Colors</label>

          <div className="ItAddF-color-box">
            {colors.map((color) => (
              <button
                type="button"
                key={color}
                className={`ItAddF-color-btn ${
                  selectedColors.includes(color) ? "ItAddF-color-selected" : ""
                }`}
                style={{ backgroundColor: color }}
                onClick={() => toggleColor(color)}
              ></button>
            ))}
          </div>
        </div>

        <div className="ItAddF-field">
          <label>Length (cm)</label>
          <input type="number" className="ItAddF-input" placeholder="Enter length" />
        </div>

        <div className="ItAddF-field">
          <label>Quantity</label>
          <input type="number" className="ItAddF-input" placeholder="Enter quantity" />
        </div>

        <div className="ItAddF-field">
          <label>Item Image</label>
          <input type="file" className="ItAddF-input-file" />
        </div>

        <button className="ItAddF-submit">Add Item</button>
      </form>
    </div>
  );
}
