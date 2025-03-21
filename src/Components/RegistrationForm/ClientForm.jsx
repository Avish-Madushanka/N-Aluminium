import React, { useState } from "react";
import "./ClientForm.css";

function ClientForm() {
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("");

  return (
    <div className="client-form-container">
      <h2 className="form-title">Fill the form for waste items</h2>
      <div className="form-group-row">
        <input type="text" placeholder="Name" className="form-input small" />
        <input
          type="tel"
          placeholder="Contact no"
          className="form-input small"
        />
      </div>
      <input type="text" placeholder="Address" className="form-input" />
      <textarea placeholder="Message" className="form-input textarea" />

      <div className="form-group-row">
        <input type="text" placeholder="Type" className="form-input small" />
        <select
          className="form-input small"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
        >
          <option value="">District</option>
          <option value="colombo">Colombo</option>
          <option value="kandy">Kandy</option>
        </select>
        <select
          className="form-input small"
          value={province}
          onChange={(e) => setProvince(e.target.value)}
        >
          <option value="">Province</option>
          <option value="western">Western</option>
          <option value="central">Central</option>
        </select>
      </div>

      <label className="file-upload">
        Upload a photo
        <input type="file" className="hidden-file-input" />
      </label>

      <button type="submit" className="submit-button">
        Submit
      </button>
    </div>
  );
}

export default ClientForm;
