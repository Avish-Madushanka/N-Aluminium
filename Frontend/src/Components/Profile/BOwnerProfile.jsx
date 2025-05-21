import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import {
    User, Mail, Phone, Lock, MapPin, Home, FileImage, Building, CreditCard, 
    LayoutDashboard, Package, Settings, LogOut 
} from "lucide-react";
import "./BOwnerProfile.css"; 

export default function BOwnerProfile() {
    const [profile, setProfile] = useState({
        businessId: "B12345", 
        businessName: "Acme Corporation",
        ownerName: "Jane Smith", 
        email: "jane@acmecorp.com",
        contactNumber: "0712345678",
        password: "", 
        address: "456 Silicon Avenue, Tech Park",
        district: "colombo",
        province: "western",
    });

    const [profilePhotoFile, setProfilePhotoFile] = useState(null);
    const [coverPhotoFile, setCoverPhotoFile] = useState(null);

    const [saving, setSaving] = useState(false);
    const [activeButton, setActiveButton] = useState(null); 

    const navigate = useNavigate(); 

    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            try {
                const parsedInfo = JSON.parse(storedUserInfo);
                setProfile(prev => ({
                    ...prev, 
                    businessId: parsedInfo.businessId || prev.businessId,
                    businessName: parsedInfo.businessName || prev.businessName,
                    ownerName: parsedInfo.name || prev.ownerName, 
                    email: parsedInfo.email || prev.email,
                    contactNumber: parsedInfo.contactNumber || prev.contactNumber, 
                    address: parsedInfo.address || prev.address,
                    district: parsedInfo.district || prev.district,
                    province: parsedInfo.province || prev.province,

                }));

            } catch (error) {
                console.error("Failed to parse user info from storage", error);
            }
        } else {
             console.warn("No user info found in storage for BOwnerProfile.");

        }
    }, []); 


    // Event Handlers 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleProfilePhotoChange = (e) => {
        const file = e.target.files?.[0];
        setProfilePhotoFile(file || null);

    };

    const handleCoverPhotoChange = (e) => {
        const file = e.target.files?.[0];
        setCoverPhotoFile(file || null);

    };

    // Form Submission
    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        const updateData = new FormData();

        Object.keys(profile).forEach(key => {
           updateData.append(key, profile[key]);
        });

        if (profilePhotoFile) {
           updateData.append('profilePhoto', profilePhotoFile);
        }
        if (coverPhotoFile) {
            updateData.append('coverPhoto', coverPhotoFile);
        }

        console.log("Simulating profile update with data:", Object.fromEntries(updateData));
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay



        setSaving(false); 
        alert("Business profile saved successfully! (Simulated)"); 
    };


    // Action Button
    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName); 

        let targetPath = "/"; 
        switch (buttonName) {
            case "dashboard":
                targetPath = "/BOwnerHome"; 
                break;
            case "orders":
                targetPath = "/BOwnerOrders"; 
                break;
            case "settings":
                window.scrollTo(0, 0);
                break;
            case "logout":

                 if (window.confirm("Are you sure you want to log out?")) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userInfo');
                    navigate('/login', { replace: true });
                 }
                break;
            default:
                console.warn("Unknown button action:", buttonName);
                break;
        }

         if (buttonName !== 'logout' && buttonName !== 'settings') {
             navigate(targetPath);
         }

        setTimeout(() => setActiveButton(null), 300);
    };


    return (
        <div className="BOwner-Pro-container">
            <h2 className="BOwner-Pro-main-title">Business Owner Profile</h2>

            <div className="BOwner-Pro-columns-wrapper">
                <div className="BOwner-Pro-column BOwner-Pro-column-left">
                    <h3 className="BOwner-Pro-column-title">Business Profile Details</h3>
                    <form onSubmit={handleSave}>
                        <div className="BOwner-Pro-form-group">
                            <label className="BOwner-Pro-label">Business ID</label>
                             <div className="BOwner-Pro-input-wrapper">
                                 <input
                                    type="text"
                                    name="businessId"
                                    value={profile.businessId}
                                    className="BOwner-Pro-input"
                                    readOnly 
                                    />
                             </div>
                        </div>

                        <div className="BOwner-Pro-form-group">
                            <label className="BOwner-Pro-label">Business Name</label>
                             <div className="BOwner-Pro-input-wrapper">
                                 <input
                                    type="text"
                                    name="businessName"
                                    value={profile.businessName}
                                    onChange={handleChange}
                                    className="BOwner-Pro-input"
                                    required
                                />
                            </div>
                        </div>

                        <div className="BOwner-Pro-form-group">
                            <label className="BOwner-Pro-label">Owner's Full Name</label>
                             <div className="BOwner-Pro-input-wrapper">
                                <input
                                    type="text"
                                    name="ownerName"
                                    value={profile.ownerName}
                                    onChange={handleChange}
                                    className="BOwner-Pro-input"
                                    required
                                />
                             </div>
                        </div>

                        <div className="BOwner-Pro-form-group">
                            <label className="BOwner-Pro-label">Email Address</label>
                            <div className="BOwner-Pro-input-wrapper">
                                <span className="BOwner-Pro-input-icon"> <Mail size={18} /> </span>
                                <input
                                    type="email"
                                    name="email"
                                    value={profile.email}
                                    onChange={handleChange}
                                    className="BOwner-Pro-input"
                                    required
                                />
                            </div>
                        </div>

                        <div className="BOwner-Pro-form-group">
                            <label className="BOwner-Pro-label">Contact Number</label>
                             <div className="BOwner-Pro-input-wrapper">
                                <span className="BOwner-Pro-input-icon"> <Phone size={18} /> </span>
                                <input
                                    type="tel"
                                    name="contactNumber"
                                    value={profile.contactNumber}
                                    onChange={handleChange}
                                    className="BOwner-Pro-input"
                                    required
                                />
                            </div>
                        </div>

                        <div className="BOwner-Pro-form-group">
                            <label className="BOwner-Pro-label">New Password (Optional)</label>
                            <div className="BOwner-Pro-input-wrapper">
                                <span className="BOwner-Pro-input-icon"> <Lock size={18} /> </span>
                                <input
                                    type="password"
                                    name="password"
                                    value={profile.password}
                                    onChange={handleChange}
                                    className="BOwner-Pro-input"
                                    placeholder="Leave blank to keep current password"
                                />
                            </div>
                        </div>

                        <div className="BOwner-Pro-form-group">
                            <label className="BOwner-Pro-label">Business Address</label>
                             <div className="BOwner-Pro-input-wrapper">
                                <span className="BOwner-Pro-input-icon BOwner-Pro-textarea-icon"> <MapPin size={18} /> </span>
                                <textarea
                                    name="address"
                                    value={profile.address}
                                    onChange={handleChange}
                                    rows="3"
                                    className="BOwner-Pro-textarea"
                                    required
                                />
                            </div>
                        </div>

                        <div className="BOwner-Pro-form-row">
                            <div className="BOwner-Pro-form-group BOwner-Pro-form-group-half">
                                <label className="BOwner-Pro-label">District</label>
                                <div className="BOwner-Pro-input-wrapper">
                                    <select
                                        name="district" value={profile.district} onChange={handleChange}
                                        className="BOwner-Pro-select" required
                                    >
                                        <option value="">Select District</option>
                                        <option value="colombo">Colombo</option><option value="gampaha">Gampaha</option><option value="kalutara">Kalutara</option><option value="kandy">Kandy</option><option value="matale">Matale</option><option value="nuwara-eliya">Nuwara Eliya</option><option value="galle">Galle</option><option value="matara">Matara</option><option value="hambantota">Hambantota</option><option value="jaffna">Jaffna</option><option value="kilinochchi">Kilinochchi</option><option value="mannar">Mannar</option><option value="vavuniya">Vavuniya</option><option value="mullaitivu">Mullaitivu</option><option value="batticaloa">Batticaloa</option><option value="ampara">Ampara</option><option value="trincomalee">Trincomalee</option><option value="kurunegala">Kurunegala</option><option value="puttalam">Puttalam</option><option value="anuradhapura">Anuradhapura</option><option value="polonnaruwa">Polonnaruwa</option><option value="badulla">Badulla</option><option value="monaragala">Monaragala</option><option value="ratnapura">Ratnapura</option><option value="kegalle">Kegalle</option>
                                    </select>
                                </div>
                            </div>
                            <div className="BOwner-Pro-form-group BOwner-Pro-form-group-half">
                                <label className="BOwner-Pro-label">Province</label>
                                 <div className="BOwner-Pro-input-wrapper">
                                    <select
                                        name="province" value={profile.province} onChange={handleChange}
                                        className="BOwner-Pro-select" required
                                    >
                                        <option value="">Select Province</option>
                                        <option value="western">Western</option><option value="central">Central</option><option value="southern">Southern</option><option value="northern">Northern</option><option value="eastern">Eastern</option><option value="north-western">North Western</option><option value="north-central">North Central</option><option value="uva">Uva</option><option value="sabaragamuwa">Sabaragamuwa</option>
                                    </select>
                                 </div>
                            </div>
                        </div>

                        <div className="BOwner-Pro-form-group">
                            <label className="BOwner-Pro-label">Profile Photo</label>
                            <div className="BOwner-Pro-input-wrapper">
                                <input
                                    type="file" id="profile-photo" onChange={handleProfilePhotoChange}
                                    className="BOwner-Pro-file-input-hidden" accept="image/*"
                                />
                                <label htmlFor="profile-photo" className="BOwner-Pro-file-upload-btn">
                                    <FileImage size={18} />
                                    <span>{profilePhotoFile ? profilePhotoFile.name : "Choose New Photo"}</span>
                                </label>
                            </div>
                        </div>
                        <div className="BOwner-Pro-form-group">
                            <label className="BOwner-Pro-label">Cover Photo</label>
                            <div className="BOwner-Pro-input-wrapper">
                                <input
                                    type="file" id="cover-photo" onChange={handleCoverPhotoChange}
                                    className="BOwner-Pro-file-input-hidden" accept="image/*"
                                />
                                <label htmlFor="cover-photo" className="BOwner-Pro-file-upload-btn">
                                    <FileImage size={18} />
                                    <span>{coverPhotoFile ? coverPhotoFile.name : "Choose New Photo"}</span>
                                </label>
                            </div>
                        </div>

                        <button type="submit" className="BOwner-Pro-save-btn" disabled={saving}>
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </form>
                </div>

                <div className="BOwner-Pro-column BOwner-Pro-column-right">
                    <h3 className="BOwner-Pro-column-title">Actions</h3>

                    <button
                        className={`BOwner-Pro-action-btn dashboard ${activeButton === 'dashboard' ? 'active' : ''}`}
                        onClick={() => handleButtonClick('dashboard')}
                    >
                        <span className="BOwner-Pro-btn-icon dashboard">
                            <LayoutDashboard size={18} />
                        </span>
                        My Dashboard
                    </button>

                     <button
                        className={`BOwner-Pro-action-btn orders ${activeButton === 'orders' ? 'active' : ''}`}
                        onClick={() => handleButtonClick('orders')}
                    >
                        <span className="BOwner-Pro-btn-icon orders">
                            <Package size={18} /> 
                        </span>
                        Manage Items/Orders
                    </button>

                    <button
                        className={`BOwner-Pro-action-btn settings ${activeButton === 'settings' ? 'active' : ''}`}
                        onClick={() => handleButtonClick('settings')} 
                    >
                        <span className="BOwner-Pro-btn-icon settings">
                            <Settings size={18} />
                        </span>
                        Profile Settings
                    </button>

                    <button
                        className={`BOwner-Pro-action-btn logout ${activeButton === 'logout' ? 'active' : ''}`}
                        onClick={() => handleButtonClick('logout')}
                    >
                        <span className="BOwner-Pro-btn-icon logout">
                            <LogOut size={18} />
                        </span>
                        Log Out
                    </button>

                </div>
            </div>
        </div>
    );
}