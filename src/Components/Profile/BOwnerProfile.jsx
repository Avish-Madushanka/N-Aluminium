// src/Components/Profile/BOwnerProfile.jsx (Updated)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // <-- Import useNavigate
import {
    User, Mail, Phone, Lock, MapPin, Home, FileImage, Building, CreditCard, // Core form icons
    LayoutDashboard, Package, Settings, LogOut // Icons for action buttons
} from "lucide-react";
import "./BOwnerProfile.css"; // Ensure this CSS file is updated

export default function BOwnerProfile() {
    // --- State for Profile Data (fetch from API in real app) ---
    const [profile, setProfile] = useState({
        businessId: "B12345", // Should likely be read-only from fetched data
        businessName: "Acme Corporation",
        ownerName: "Jane Smith", // Corresponds to 'name' in token/user info
        email: "jane@acmecorp.com",
        contactNumber: "0712345678",
        password: "", // Keep password empty or handle updates separately
        address: "456 Silicon Avenue, Tech Park",
        district: "colombo",
        province: "western",
        // Add fields for profile/cover photo paths if fetched
        // profilePhotoPath: '/uploads/...',
        // coverPhotoPath: '/uploads/...',
    });

    // --- State for File Uploads ---
    const [profilePhotoFile, setProfilePhotoFile] = useState(null);
    const [coverPhotoFile, setCoverPhotoFile] = useState(null);
    // Add preview state if needed
    // const [profilePreview, setProfilePreview] = useState(profile.profilePhotoPath ? `http://localhost:5003${profile.profilePhotoPath}` : null);
    // const [coverPreview, setCoverPreview] = useState(profile.coverPhotoPath ? `http://localhost:5003${profile.coverPhotoPath}` : null);

    // --- UI State ---
    const [saving, setSaving] = useState(false);
    const [activeButton, setActiveButton] = useState(null); // For button press effect

    const navigate = useNavigate(); // Hook for navigation

    // --- Fetch Profile Data (Example - replace with your actual fetch logic) ---
    useEffect(() => {
        // Simulate fetching user data based on stored info (e.g., from localStorage)
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            try {
                const parsedInfo = JSON.parse(storedUserInfo);
                // Update profile state only with relevant fields from stored info
                setProfile(prev => ({
                    ...prev, // Keep existing defaults/structure
                    businessId: parsedInfo.businessId || prev.businessId, // Might come from token/DB
                    businessName: parsedInfo.businessName || prev.businessName,
                    ownerName: parsedInfo.name || prev.ownerName, // Map 'name' from token to ownerName
                    email: parsedInfo.email || prev.email,
                    contactNumber: parsedInfo.contactNumber || prev.contactNumber, // Ensure contactNumber is in userInfo
                    address: parsedInfo.address || prev.address,
                    district: parsedInfo.district || prev.district,
                    province: parsedInfo.province || prev.province,
                    // Set previews if paths are available
                    // profilePhotoPath: parsedInfo.profilePhoto || null,
                    // coverPhotoPath: parsedInfo.coverPhoto || null,
                }));
                 // Update previews based on fetched paths
                // setProfilePreview(parsedInfo.profilePhoto ? `http://localhost:5003${parsedInfo.profilePhoto}` : null);
                // setCoverPreview(parsedInfo.coverPhoto ? `http://localhost:5003${parsedInfo.coverPhoto}` : null);
            } catch (error) {
                console.error("Failed to parse user info from storage", error);
                // Handle error, maybe redirect to login
            }
        } else {
             console.warn("No user info found in storage for BOwnerProfile.");
             // Optionally redirect to login if no user info
             // navigate('/login');
        }
    }, []); // Run once on mount


    // --- Event Handlers ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleProfilePhotoChange = (e) => {
        const file = e.target.files?.[0];
        setProfilePhotoFile(file || null);
        // Add preview logic if needed
    };

    const handleCoverPhotoChange = (e) => {
        const file = e.target.files?.[0];
        setCoverPhotoFile(file || null);
        // Add preview logic if needed
    };

    // --- Form Submission (Update Profile) ---
    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        // Create FormData for potential file uploads
        const updateData = new FormData();

        // Append changed text/select fields (compare with initial/fetched data if needed)
        Object.keys(profile).forEach(key => {
           // Only append if changed, or always append if backend handles it
           updateData.append(key, profile[key]);
        });

        // Append files if they were selected
        if (profilePhotoFile) {
           updateData.append('profilePhoto', profilePhotoFile);
        }
        if (coverPhotoFile) {
            updateData.append('coverPhoto', coverPhotoFile);
        }

        // --- TODO: Replace with actual API call to update profile ---
        console.log("Simulating profile update with data:", Object.fromEntries(updateData));
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

        // Example using axios (install if not already: npm install axios)
        /*
        try {
            const token = localStorage.getItem('token'); // Get auth token
            const response = await axios.put(
                'http://localhost:5003/api/bowners/profile', // Your update endpoint
                updateData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        // Content-Type is set automatically for FormData by axios
                    },
                }
            );

            if (response.data && response.data.success) {
                alert("Business profile updated successfully!");
                // Optionally update local storage userInfo if backend returns updated data
                // localStorage.setItem('userInfo', JSON.stringify(response.data.data));
                // setProfile(response.data.data); // Update state with response data
            } else {
                throw new Error(response.data?.message || "Update failed");
            }
        } catch (error) {
            console.error("Profile update failed:", error);
            alert(`Profile update failed: ${error.response?.data?.message || error.message}`);
        } finally {
            setSaving(false);
        }
        */
        // --- End of API call example ---

        setSaving(false); // Remove this if using the try/catch block above
        alert("Business profile saved successfully! (Simulated)"); // Remove this if using try/catch
    };


    // --- Action Button Navigation ---
    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName); // Set active state for visual feedback

        // Define navigation targets
        let targetPath = "/"; // Default path
        switch (buttonName) {
            case "dashboard":
                targetPath = "/BOwnerHome"; // Or specific dashboard route if different
                break;
            case "orders":
                targetPath = "/BOwnerOrders"; // Define this route in App.jsx
                break;
            case "settings":
                // Already on the settings page, maybe scroll to top or do nothing?
                window.scrollTo(0, 0);
                break;
            case "logout":
                // Trigger logout logic (usually handled in App.jsx via callback)
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

        // Navigate if it's not the logout or current page action
         if (buttonName !== 'logout' && buttonName !== 'settings') {
             navigate(targetPath);
         }

        // Reset active button state after a short delay (for visual effect)
        setTimeout(() => setActiveButton(null), 300);
    };


    return (
        <div className="BOwner-Pro-container">
            <h2 className="BOwner-Pro-main-title">Business Owner Profile</h2>

            <div className="BOwner-Pro-columns-wrapper">
                {/* Left Column - Profile Form */}
                <div className="BOwner-Pro-column BOwner-Pro-column-left">
                    <h3 className="BOwner-Pro-column-title">Business Profile Details</h3>
                    <form onSubmit={handleSave}>
                        {/* Business ID (Read-only usually) */}
                        <div className="BOwner-Pro-form-group">
                            <label className="BOwner-Pro-label">Business ID</label>
                             <div className="BOwner-Pro-input-wrapper">
                                 <input
                                    type="text"
                                    name="businessId"
                                    value={profile.businessId}
                                    // onChange={handleChange} // Usually not changeable
                                    className="BOwner-Pro-input"
                                    readOnly // Make it read-only
                                    />
                             </div>
                        </div>

                        {/* Business Name */}
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

                        {/* Owner's Name */}
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

                        {/* Email */}
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

                        {/* Contact Number */}
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

                        {/* Password - Consider a separate "Change Password" section */}
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
                                    // Do not mark as required if it's optional
                                />
                            </div>
                        </div>

                        {/* Address */}
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

                        {/* District & Province Row */}
                        <div className="BOwner-Pro-form-row">
                            <div className="BOwner-Pro-form-group BOwner-Pro-form-group-half">
                                <label className="BOwner-Pro-label">District</label>
                                <div className="BOwner-Pro-input-wrapper">
                                    <select
                                        name="district" value={profile.district} onChange={handleChange}
                                        className="BOwner-Pro-select" required
                                    >
                                        <option value="">Select District</option>
                                        {/* Add all districts */}
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
                                        {/* Add all provinces */}
                                        <option value="western">Western</option><option value="central">Central</option><option value="southern">Southern</option><option value="northern">Northern</option><option value="eastern">Eastern</option><option value="north-western">North Western</option><option value="north-central">North Central</option><option value="uva">Uva</option><option value="sabaragamuwa">Sabaragamuwa</option>
                                    </select>
                                 </div>
                            </div>
                        </div>

                        {/* File Uploads */}
                        <div className="BOwner-Pro-form-group">
                            <label className="BOwner-Pro-label">Profile Photo</label>
                            {/* Display current photo preview if available */}
                            {/* {profilePreview && <img src={profilePreview} alt="Current Profile" style={{maxWidth: '100px', marginBottom: '10px'}} />} */}
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
                             {/* Display current cover preview if available */}
                            {/* {coverPreview && <img src={coverPreview} alt="Current Cover" style={{maxWidth: '200px', marginBottom: '10px'}} />} */}
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

                        {/* Save Button */}
                        <button type="submit" className="BOwner-Pro-save-btn" disabled={saving}>
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </form>
                </div>

                 {/* Right Column - Action Buttons */}
                <div className="BOwner-Pro-column BOwner-Pro-column-right">
                    <h3 className="BOwner-Pro-column-title">Actions</h3>

                     {/* Add action buttons similar to ClientProfile */}
                     {/* Adjust icons, text, colors, and navigation targets as needed */}

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
                            <Package size={18} /> {/* Or ShoppingCart, etc. */}
                        </span>
                        Manage Items/Orders
                    </button>

                    <button
                        className={`BOwner-Pro-action-btn settings ${activeButton === 'settings' ? 'active' : ''}`}
                        onClick={() => handleButtonClick('settings')} // Stays on this page
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

                    {/* Remove the old navigation list and profile summary */}

                </div>
            </div>
        </div>
    );
}