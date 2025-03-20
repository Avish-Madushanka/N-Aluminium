import React, { useState } from 'react';
import './ClientForm.css'; 
function ClientForm() {
    const [district, setDistrict] = useState('');
    const [province, setProvince] = useState('');

    const handleDistrictChange = (event) => {
        setDistrict(event.target.value);
    };

    const handleProvinceChange = (event) => {
        setProvince(event.target.value);
    };

    return (
        <div className="clientreg-form-container">
            <h2 className="form-title">Client Registration Form</h2>
            <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" placeholder="Username" />
            </div>
            <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea id="address" rows="4" placeholder="Address"></textarea>
            </div>
            <div className="form-group">
                <label htmlFor="profilePhoto">Upload a Profile photo</label>
                <input type="file" id="profilePhoto" style={{ display: 'none' }} />
                <label htmlFor="profilePhoto" className="upload-button">Choose File</label>
            </div>
            <div className="form-group">
                <label htmlFor="contactNumber">Contact Number</label>
                <input type="tel" id="contactNumber" placeholder="Contact Number" />
            </div>
            <div className="form-group horizontal">
                <div>
                    <label htmlFor="district">District</label>
                    <select id="district" value={district} onChange={handleDistrictChange}>
                        <option value="">Select District</option>
                        <option value="colombo">Colombo</option>
                        <option value="kandy">Kandy</option>
                        {/* Add more districts as needed */}
                    </select>
                </div>
                <div>
                    <label htmlFor="province">Province</label>
                    <select id="province" value={province} onChange={handleProvinceChange}>
                        <option value="">Select Province</option>
                        <option value="western">Western</option>
                        <option value="central">Central</option>
                        {/* Add more provinces as needed */}
                    </select>
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Email" />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="Password" />
            </div>
            <button type="submit" className="submit-button">Register</button>
        </div>
    );
}

export default ClientForm;