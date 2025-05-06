// src/Components/Profile/ClientProfile.jsx
// Allows updating profile, but form starts empty. Shows current email/photo.

import React, { useState, useEffect } from "react";
import { FileImage, Mail, Truck, ShoppingCart, User, AlertCircle, CheckCircle } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from '../../api/axiosInstance'; // Use the interceptor instance
import API_ENDPOINTS from '../../apiConfig'; // Ensure this path is correct
import "./ClientProfile.css"; // Ensure CSS path is correct

// --- Helper Functions ---
const getTokenFromStorage = () => localStorage.getItem("token");

const getUserInfoFromStorage = (field = null) => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
        try {
            const parsedInfo = JSON.parse(storedUserInfo);
            return field ? parsedInfo?.[field] : parsedInfo;
        } catch (e) { console.error("Error parsing userInfo:", e); return null; }
    } return null;
};

// --- Component ---
export default function ClientProfile() {
    // State for the editable form fields - initialized empty/default
    const [profileUpdateData, setProfileUpdateData] = useState({
        name: "",
        contactNumber: "",
        password: "", // For entering a *new* password only
        address: "",
        district: "colombo", // Default selection
        province: "western", // Default selection
    });
    // State for the currently selected file (for upload)
    const [profilePhotoFile, setProfilePhotoFile] = useState(null);
    // State for displaying a preview of the selected/current photo
    const [photoPreviewUrl, setPhotoPreviewUrl] = useState(null);

    // State for non-editable but essential info
    const [currentEmail, setCurrentEmail] = useState('');
    const [userId, setUserId] = useState('');
    const [currentSavedPhotoPath, setCurrentSavedPhotoPath] = useState(null); // Store path of currently saved photo

    // UI States
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(''); // General error message
    const [errors, setErrors] = useState({}); // Field-specific validation errors
    const [success, setSuccess] = useState('');
    const [activeButton, setActiveButton] = useState(null);

    const navigate = useNavigate();

    // --- Effect to load non-editable info and set initial photo preview ---
    useEffect(() => {
        const id = getUserInfoFromStorage('id');
        const email = getUserInfoFromStorage('email');
        const savedPhoto = getUserInfoFromStorage('profilePhoto');

        if (!id) { // ID is essential for updates
            setError("User identification failed. Please log in again.");
            const timer = setTimeout(() => navigate('/login?sessionExpired=true'), 3000);
            return () => clearTimeout(timer);
        } else {
            setUserId(id);
            setCurrentEmail(email || 'N/A'); // Set email for display
            setCurrentSavedPhotoPath(savedPhoto); // Store the path of the currently saved photo
            setPhotoPreviewUrl(constructPhotoUrl(savedPhoto)); // Set initial preview URL
            setError(''); // Clear potential error
        }
    }, [navigate]); // Run once on mount

    // --- Construct Photo URL Helper ---
    const constructPhotoUrl = (photoPath) => {
        if (!photoPath || photoPath === 'default.jpg') return null; // No photo or default
        if (photoPath.startsWith('http') || photoPath.startsWith('blob:')) {
             return photoPath; // Already a full URL or blob
        }
        // Assume relative path needs base URL and /uploads prefix
        const backendUrl = API_ENDPOINTS.BASE_URL || '';
        const separator = backendUrl.endsWith('/') ? '' : '/';
        return `${backendUrl}${separator}uploads/${photoPath}`;
    };


    // --- Input Handlers ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileUpdateData((prev) => ({ ...prev, [name]: value }));
        setError(''); setSuccess('');
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setError(''); setSuccess(''); setErrors({}); // Clear all errors on new file select
        setProfilePhotoFile(null); // Clear previous file selection state
         // Revoke previous blob URL if it exists
         if (photoPreviewUrl && photoPreviewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(photoPreviewUrl);
            setPhotoPreviewUrl(constructPhotoUrl(currentSavedPhotoPath)); // Revert preview to saved photo
         }


        if (file) {
            if (!file.type.startsWith("image/")) {
                setErrors({ profilePhoto: "Please select a valid image file." });
                e.target.value = null; return;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB Limit
                setErrors({ profilePhoto: "Image file size should not exceed 5MB." });
                e.target.value = null; return;
            }
            setProfilePhotoFile(file); // Stage the file for upload
            const newPreviewUrl = URL.createObjectURL(file); // Create temporary preview
            setPhotoPreviewUrl(newPreviewUrl); // Set preview state
        }
    };


    // --- Form Submit Logic ---
    const handleSave = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(''); setSuccess(''); setErrors({});

        // --- Client-Side Validation (Only on fields the user actually filled) ---
        let formIsValid = true;
        const validationErrors = {};
        // Check required fields only if they have been filled by the user
        if (!profileUpdateData.name?.trim()) { validationErrors.name = 'Name cannot be empty if updating.'; formIsValid = false; }
        if (!profileUpdateData.contactNumber?.trim() || !/^[0-9]{10}$/.test(profileUpdateData.contactNumber.trim())) { validationErrors.contactNumber = 'Valid 10-digit contact is required if updating.'; formIsValid = false; }
        if (!profileUpdateData.address?.trim() || profileUpdateData.address.trim().length < 10) { validationErrors.address = 'Address (min 10 chars) is required if updating.'; formIsValid = false; }
        if (!profileUpdateData.district) { validationErrors.district = 'District is required.'; formIsValid = false; }
        if (!profileUpdateData.province) { validationErrors.province = 'Province is required.'; formIsValid = false; }
        if (profileUpdateData.password && profileUpdateData.password.length < 6) { validationErrors.password = 'New password must be at least 6 characters.'; formIsValid = false; }
        // Photo file validation is done in handleFileChange

        if (!formIsValid) {
            setErrors(validationErrors);
            setError("Please correct the highlighted errors.");
            setIsLoading(false);
            return;
        }
        // --- End Client-Side Validation ---

        const token = getTokenFromStorage();
        if (!token || !userId) { /* ... handle auth error ... */ setIsLoading(false); return; }

        // --- Prepare FormData with ONLY the fields user entered ---
        const updateData = new FormData();
        let hasDataToUpdate = false;
        // Add fields only if they have a value (user typed something)
        if (profileUpdateData.name.trim()) { updateData.append('name', profileUpdateData.name.trim()); hasDataToUpdate = true; }
        if (profileUpdateData.contactNumber.trim()) { updateData.append('contactNumber', profileUpdateData.contactNumber.trim()); hasDataToUpdate = true; }
        if (profileUpdateData.address.trim()) { updateData.append('address', profileUpdateData.address.trim()); hasDataToUpdate = true; }
        if (profileUpdateData.district) { updateData.append('district', profileUpdateData.district); hasDataToUpdate = true; } // Always send selected district/province
        if (profileUpdateData.province) { updateData.append('province', profileUpdateData.province); hasDataToUpdate = true; }
        if (profileUpdateData.password) { updateData.append('password', profileUpdateData.password); hasDataToUpdate = true; } // Send password only if user typed one
        if (profilePhotoFile) { updateData.append('profilePhoto', profilePhotoFile); hasDataToUpdate = true; }

        // If nothing was changed or entered, don't make the API call
        if (!hasDataToUpdate) {
            setError("No changes detected to save.");
            setIsLoading(false);
            return;
        }
        // --- End Prepare FormData ---

        const UPDATE_PROFILE_URL = API_ENDPOINTS.CLIENT.UPDATE_PROFILE(userId); // Use function if defined like this
        // OR const UPDATE_PROFILE_URL = `${API_ENDPOINTS.BASE_URL}/api/clients/${userId}`;
        console.log("Attempting to update profile at:", UPDATE_PROFILE_URL);

        try {
            // --- API Call ---
            const response = await axiosInstance.put(UPDATE_PROFILE_URL, updateData, {
                // Headers added by interceptor
                timeout: 15000
            });

            if (response.data?.success && response.data?.data) {
                setSuccess('Profile updated successfully!');
                const updatedUserInfo = response.data.data;
                // Update localStorage
                localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
                // Update local state for display (email/id shouldn't change)
                setCurrentEmail(updatedUserInfo.email);
                setCurrentSavedPhotoPath(updatedUserInfo.profilePhoto); // Update saved photo path
                setPhotoPreviewUrl(constructPhotoUrl(updatedUserInfo.profilePhoto)); // Update preview

                // Reset the FORM fields back to empty/defaults
                setProfileUpdateData({
                    name: "", contactNumber: "", password: "", address: "",
                    district: updatedUserInfo.district || "colombo", // Use updated or default
                    province: updatedUserInfo.province || "western",
                    profilePhotoUrl: null // Clear this part of the form state
                });
                setProfilePhotoFile(null); // Clear staged file
                setErrors({}); // Clear any previous validation errors

                setTimeout(() => setSuccess(''), 4000);
            } else {
                throw new Error(response.data?.message || response.data?.error || 'Update failed.');
            }
        } catch (err) {
            console.error("Profile save error:", err);
            let errMsg = "Could not save profile changes.";
            const serverFieldErrors = {};
            if (err.response) {
                errMsg = err.response.data?.error || err.response.data?.message || `Update failed (${err.response.status}).`;
                if(err.response.status === 401 || err.response.status === 403) navigate('/login?sessionExpired=true');
                if(err.response.data?.errors) {
                   for (const fieldKey in err.response.data.errors) { /* ... */ serverFieldErrors[fieldKey] = err.response.data.errors[fieldKey].message || err.response.data.errors[fieldKey]; }
                }
            } else if (err.request) errMsg = "Network error."; else errMsg = err.message || errMsg;
            setError(errMsg); setErrors(serverFieldErrors);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Action Button Navigation ---
    const handleButtonClick = (buttonName) => { /* ... (same as before) ... */
        setActiveButton(buttonName);
        let path = "/";
        switch (buttonName) {
          case "email": path = "/ClientEmail"; break;
          case "pickup": path = "/PickupReq"; break;
          case "buy": path = "/CheckBuySell"; break;
          default: break;
        }
        navigate(path);
    };

    // --- Render Loading or Error if essential data missing ---
    if (!userId) {
        return ( <div className="Client-Pro-container loading-state"> {error ? <div className="alert alert-danger profile-alert"><AlertCircle size={18} /> {error}</div> : <div>Loading...</div>} </div> );
    }

    // --- Main Render ---
    return (
        <div className="Client-Pro-container">
            <h2 className="Client-Pro-main-title">Update Profile</h2>
            <p className="Client-Pro-subtitle">Enter only the information you wish to change.</p>

            {/* Messages */}
            {error && !Object.keys(errors).length && <div className="alert alert-danger profile-alert"><AlertCircle size={18} /> {error}</div>}
            {success && <div className="alert alert-success profile-alert"><CheckCircle size={18} /> {success}</div>}
            {Object.keys(errors).length > 0 && !errors.profilePhoto && <div className="alert alert-warning profile-alert"><AlertCircle size={18} /> Please correct the errors below.</div>}


            <div className="Client-Pro-columns-wrapper">
                {/* Column 1: Profile Update Form */}
                <div className="Client-Pro-column Client-Pro-column-left">
                    <h3 className="Client-Pro-column-title">Your Details</h3>
                    <form onSubmit={handleSave}>
                        {/* Profile Photo */}
                        <div className="Client-Pro-form-group Client-Pro-photo-section">
                            <label className="Client-Pro-label">Current Profile Photo</label>
                            <div className="Client-Pro-photo-area">
                               <div className="Client-Pro-photo-preview-container">
                                   {photoPreviewUrl ? (
                                       <img src={photoPreviewUrl} alt="Profile Preview" className="Client-Pro-photo-preview" />
                                   ) : (
                                       <div className="Client-Pro-photo-placeholder"><User size={40} color="#ccc" /></div>
                                   )}
                               </div>
                               <input type="file" id="profile-photo-input" accept="image/*" onChange={handleFileChange} className="Client-Pro-file-input-hidden" disabled={isLoading} />
                                <label htmlFor="profile-photo-input" className="Client-Pro-file-upload-btn">
                                     <FileImage size={18} />
                                     <span>{profilePhotoFile ? profilePhotoFile.name : "Upload New Photo"}</span>
                                </label>
                             </div>
                             {errors && errors.profilePhoto && <div className="error-message">{errors.profilePhoto}</div>}
                        </div>

                        {/* Name */}
                        <div className="Client-Pro-form-group">
                            <label className="Client-Pro-label" htmlFor="client-name">Full Name</label>
                            {/* Use profileUpdateData for value */}
                            <input id="client-name" type="text" name="name" value={profileUpdateData.name} onChange={handleChange} placeholder="Enter new name (optional)" className={`Client-Pro-input ${errors && errors.name ? 'input-error' : ''}`} disabled={isLoading}/>
                            {errors && errors.name && <div className="error-message">{errors.name}</div>}
                        </div>

                        {/* Email (Display Only) */}
                        <div className="Client-Pro-form-group">
                            <label className="Client-Pro-label" htmlFor="client-email-display">Email Address</label>
                            <input id="client-email-display" type="email" value={currentEmail} className="Client-Pro-input" readOnly disabled title="Email cannot be changed" />
                        </div>

                        {/* Contact Number */}
                        <div className="Client-Pro-form-group">
                            <label className="Client-Pro-label" htmlFor="client-contact">Contact Number</label>
                            {/* Use profileUpdateData for value */}
                            <input id="client-contact" type="tel" name="contactNumber" value={profileUpdateData.contactNumber} onChange={handleChange} placeholder="Enter new 10-digit number" className={`Client-Pro-input ${errors && errors.contactNumber ? 'input-error' : ''}`} disabled={isLoading}/>
                            {errors && errors.contactNumber && <div className="error-message">{errors.contactNumber}</div>}
                        </div>

                         {/* New Password */}
                         <div className="Client-Pro-form-group">
                           <label className="Client-Pro-label" htmlFor="client-password">New Password</label>
                           {/* Use profileUpdateData for value */}
                           <input id="client-password" type="password" name="password" value={profileUpdateData.password} onChange={handleChange} className={`Client-Pro-input ${errors && errors.password ? 'input-error' : ''}`} placeholder="Leave blank to keep current" disabled={isLoading}/>
                           {errors && errors.password && <div className="error-message">{errors.password}</div>}
                         </div>

                         {/* Address */}
                         <div className="Client-Pro-form-group">
                           <label className="Client-Pro-label" htmlFor="client-address">Address</label>
                           {/* Use profileUpdateData for value */}
                           <textarea id="client-address" name="address" value={profileUpdateData.address} onChange={handleChange} rows="3" placeholder="Enter new full address" className={`Client-Pro-textarea ${errors && errors.address ? 'input-error' : ''}`} disabled={isLoading}/>
                           {errors && errors.address && <div className="error-message">{errors.address}</div>}
                         </div>

                        {/* District / Province */}
                        <div className="Client-Pro-form-row">
                             <div className="Client-Pro-form-group Client-Pro-form-group-half">
                               <label className="Client-Pro-label" htmlFor="client-district">District</label>
                               {/* Use profileUpdateData for value */}
                               <select id="client-district" name="district" value={profileUpdateData.district} onChange={handleChange} className={`Client-Pro-select ${errors && errors.district ? 'input-error' : ''}`} required disabled={isLoading}>
                                   <option value="">Select District</option>
                                    <option value="colombo">Colombo</option><option value="gampaha">Gampaha</option>
                                    {/* ... other districts ... */}
                               </select>
                                {errors && errors.district && <div className="error-message">{errors.district}</div>}
                             </div>
                             <div className="Client-Pro-form-group Client-Pro-form-group-half">
                               <label className="Client-Pro-label" htmlFor="client-province">Province</label>
                               {/* Use profileUpdateData for value */}
                               <select id="client-province" name="province" value={profileUpdateData.province} onChange={handleChange} className={`Client-Pro-select ${errors && errors.province ? 'input-error' : ''}`} required disabled={isLoading}>
                                  <option value="">Select Province</option>
                                   <option value="western">Western</option><option value="central">Central</option>
                                    {/* ... other provinces ... */}
                               </select>
                                {errors && errors.province && <div className="error-message">{errors.province}</div>}
                             </div>
                        </div>

                        <button type="submit" className="Client-Pro-save-btn" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Changes"}
                        </button>
                    </form>
                </div>

                {/* Column 2: Action Buttons */}
                <div className="Client-Pro-column Client-Pro-column-right">
                    <h3 className="Client-Pro-column-title">Quick Actions</h3>
                    <button className={`Client-Pro-action-btn email ${activeButton === "email" ? "active" : ""}`} onClick={() => handleButtonClick("email")}> <span className="Client-Pro-btn-icon"><Mail size={18} /></span> Check Emails </button>
                    <button className={`Client-Pro-action-btn pickup ${activeButton === "pickup" ? "active" : ""}`} onClick={() => handleButtonClick("pickup")}> <span className="Client-Pro-btn-icon"><Truck size={18} /></span> My Pickup Requests </button>
                    <button className={`Client-Pro-action-btn buy-sell ${activeButton === "buy" ? "active" : ""}`} onClick={() => handleButtonClick("buy")}> <span className="Client-Pro-btn-icon"><ShoppingCart size={18} /></span> Check Buy & Sell </button>
                </div>
            </div>
        </div>
    );
}