import React, { useState, useEffect, useRef } from "react"; 
import { FileImage, Mail, Truck, ShoppingCart, User, AlertCircle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from '../../api/axiosInstance';
import API_ENDPOINTS from '../../apiConfig';
import "./ClientProfile.css";

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

export default function ClientProfile() {
    const [profileUpdateData, setProfileUpdateData] = useState({
        name: "",
        contactNumber: "",
        password: "",
        address: "",
        district: "colombo",
        province: "western",
    });
    const [profilePhotoFile, setProfilePhotoFile] = useState(null);
    const [photoPreviewUrl, setPhotoPreviewUrl] = useState(null);
    const [currentBlobUrl, setCurrentBlobUrl] = useState(null);

    const [currentEmail, setCurrentEmail] = useState('');
    const [userId, setUserId] = useState('');
    const [currentSavedPhotoPath, setCurrentSavedPhotoPath] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldValidationErrors, setFieldValidationErrors] = useState({}); 
    const [success, setSuccess] = useState('');
    const [activeButton, setActiveButton] = useState(null);

    const navigate = useNavigate();
    const fileInputRef = useRef(null); 

    useEffect(() => {
        const id = getUserInfoFromStorage('id');
        const email = getUserInfoFromStorage('email');
        const savedPhoto = getUserInfoFromStorage('profilePhoto');

        if (!id) {
            setError("User identification failed. Please log in again.");
            const timer = setTimeout(() => navigate('/login?sessionExpired=true'), 3000);
            return () => clearTimeout(timer);
        } else {
            setUserId(id);
            setCurrentEmail(email || 'N/A');
            setCurrentSavedPhotoPath(savedPhoto);
            setPhotoPreviewUrl(constructPhotoUrl(savedPhoto));
            setError('');
        }
    }, [navigate]);

    useEffect(() => {
        return () => {
            if (currentBlobUrl) {
                URL.revokeObjectURL(currentBlobUrl);
            }
        };
    }, [currentBlobUrl]);

    const constructPhotoUrl = (photoPath) => {
        if (!photoPath || photoPath === 'default.jpg') return null;
        if (photoPath.startsWith('http') || photoPath.startsWith('blob:')) {
             return photoPath;
        }
        const backendUrl = API_ENDPOINTS.BACKEND_ROOT_URL || ''; 
        const separator = backendUrl.endsWith('/') ? '' : '/';
        return `${backendUrl}${photoPath.startsWith('/') ? photoPath.substring(1) : photoPath}`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileUpdateData((prev) => ({ ...prev, [name]: value }));
        setError(''); setSuccess('');
        if (fieldValidationErrors[name]) setFieldValidationErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setError(''); setSuccess(''); 
        setFieldValidationErrors(prevErrors => ({ ...prevErrors, profilePhoto: '' })); 

        if (currentBlobUrl) {
            URL.revokeObjectURL(currentBlobUrl);
            setCurrentBlobUrl(null);
        }
        
        setProfilePhotoFile(null);

        if (file) {
            if (!file.type.startsWith("image/")) {
                setFieldValidationErrors({ profilePhoto: "Please select a valid image file." });
                setPhotoPreviewUrl(constructPhotoUrl(currentSavedPhotoPath)); 
                if(fileInputRef.current) fileInputRef.current.value = ""; 
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setFieldValidationErrors({ profilePhoto: "Image file size should not exceed 5MB." });
                setPhotoPreviewUrl(constructPhotoUrl(currentSavedPhotoPath)); 
                if(fileInputRef.current) fileInputRef.current.value = ""; 
                return;
            }
            setProfilePhotoFile(file);
            const newBlobUrl = URL.createObjectURL(file);
            setPhotoPreviewUrl(newBlobUrl);
            setCurrentBlobUrl(newBlobUrl);
        } else {
            setPhotoPreviewUrl(constructPhotoUrl(currentSavedPhotoPath)); 
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(''); setSuccess(''); 

        const photoErr = fieldValidationErrors.profilePhoto;
        setFieldValidationErrors(photoErr ? { profilePhoto: photoErr } : {});


        let formIsValid = true;
        const newValidationErrors = {};

        if (profileUpdateData.name.trim() && profileUpdateData.name.trim().length < 2) {
            newValidationErrors.name = 'If providing a name, it must be at least 2 characters.';
            formIsValid = false;
        }
        if (profileUpdateData.contactNumber.trim() && !/^[0-9]{10}$/.test(profileUpdateData.contactNumber.trim())) {
            newValidationErrors.contactNumber = 'If providing a contact number, it must be a valid 10-digit number.';
            formIsValid = false;
        }
        if (profileUpdateData.address.trim() && profileUpdateData.address.trim().length < 10) {
            newValidationErrors.address = 'If providing an address, it must be at least 10 characters long.';
            formIsValid = false;
        }
        if (profileUpdateData.password && profileUpdateData.password.length < 6) {
            newValidationErrors.password = 'New password must be at least 6 characters.';
            formIsValid = false;
        }

        if (!formIsValid || fieldValidationErrors.profilePhoto) { 
            setFieldValidationErrors(prev => ({...prev, ...newValidationErrors}));
            setError("Please correct the highlighted errors.");
            setIsLoading(false);
            return;
        }

        const token = getTokenFromStorage();
        if (!token || !userId) { 
            setError("Authentication error. Please log in again.");
            setIsLoading(false); 
            return; 
        }

        const updateData = new FormData();
        let hasDataToUpdate = false;

        if (profileUpdateData.name.trim()) { updateData.append('name', profileUpdateData.name.trim()); hasDataToUpdate = true; }
        if (profileUpdateData.contactNumber.trim()) { updateData.append('contactNumber', profileUpdateData.contactNumber.trim()); hasDataToUpdate = true; }
        if (profileUpdateData.address.trim()) { updateData.append('address', profileUpdateData.address.trim()); hasDataToUpdate = true; }
        
        if (profileUpdateData.district) { updateData.append('district', profileUpdateData.district); hasDataToUpdate = true; }
        if (profileUpdateData.province) { updateData.append('province', profileUpdateData.province); hasDataToUpdate = true; }
        
        if (profileUpdateData.password) { updateData.append('password', profileUpdateData.password); hasDataToUpdate = true; }
        if (profilePhotoFile) { updateData.append('profilePhoto', profilePhotoFile); hasDataToUpdate = true; }

        if (!hasDataToUpdate) {
            setError("No changes detected to save.");
            setIsLoading(false);
            return;
        }
        
        const UPDATE_PROFILE_URL = API_ENDPOINTS.CLIENT.UPDATE(userId);
        console.log("Attempting to update profile at:", UPDATE_PROFILE_URL);

        try {
            const response = await axiosInstance.put(UPDATE_PROFILE_URL, updateData, { timeout: 15000 });

            if (response.data?.success && response.data?.data) {
                setSuccess('Profile updated successfully!');
                const updatedUserInfo = response.data.data;
                localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
                
                setCurrentEmail(updatedUserInfo.email);
                setCurrentSavedPhotoPath(updatedUserInfo.profilePhoto);

                if (currentBlobUrl) {
                    URL.revokeObjectURL(currentBlobUrl);
                    setCurrentBlobUrl(null);
                }
                setPhotoPreviewUrl(constructPhotoUrl(updatedUserInfo.profilePhoto));

                setProfileUpdateData({
                    name: "", contactNumber: "", password: "", address: "",
                    district: updatedUserInfo.district || "colombo",
                    province: updatedUserInfo.province || "western",
                });
                setProfilePhotoFile(null);
                if(fileInputRef.current) fileInputRef.current.value = ""; 
                setFieldValidationErrors({});

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
                   for (const fieldKey in err.response.data.errors) { serverFieldErrors[fieldKey] = err.response.data.errors[fieldKey].message || err.response.data.errors[fieldKey]; }
                }
            } else if (err.request) errMsg = "Network error. Please check your connection."; else errMsg = err.message || errMsg;
            setError(errMsg); setFieldValidationErrors(serverFieldErrors);
        } finally {
            setIsLoading(false);
        }
    };

    const handleButtonClick = (buttonName) => {
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

    if (!userId && !error) { 
        return ( <div className="Client-Pro-container loading-state"><div>Loading user data...</div></div> );
    }
    if (!userId && error) { 
         return ( <div className="Client-Pro-container loading-state"><div className="alert alert-danger profile-alert"><AlertCircle size={18} /> {error}</div></div> );
    }


    return (
        <div className="Client-Pro-container">
            <h2 className="Client-Pro-main-title">Update Profile</h2>
            <p className="Client-Pro-subtitle">Enter only the information you wish to change. Your email cannot be changed.</p>

            {error && !Object.keys(fieldValidationErrors).length && <div className="alert alert-danger profile-alert"><AlertCircle size={18} /> {error}</div>}
            {success && <div className="alert alert-success profile-alert"><CheckCircle size={18} /> {success}</div>}
            {Object.keys(fieldValidationErrors).length > 0 && <div className="alert alert-warning profile-alert"><AlertCircle size={18} /> Please correct the errors below.</div>}


            <div className="Client-Pro-columns-wrapper">
                <div className="Client-Pro-column Client-Pro-column-left">
                    <h3 className="Client-Pro-column-title">Your Details</h3>
                    <form onSubmit={handleSave}>
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
                               <input 
                                   type="file" 
                                   id="profile-photo-input" 
                                   accept="image/*" 
                                   onChange={handleFileChange} 
                                   className="Client-Pro-file-input-hidden" 
                                   disabled={isLoading}
                                   ref={fileInputRef}
                                />
                                <label htmlFor="profile-photo-input" className="Client-Pro-file-upload-btn">
                                     <FileImage size={18} />
                                     <span>{profilePhotoFile ? profilePhotoFile.name : "Upload New Photo"}</span>
                                </label>
                             </div>
                             {fieldValidationErrors && fieldValidationErrors.profilePhoto && <div className="error-message">{fieldValidationErrors.profilePhoto}</div>}
                        </div>

                        <div className="Client-Pro-form-group">
                            <label className="Client-Pro-label" htmlFor="client-name">Full Name</label>
                            <input id="client-name" type="text" name="name" value={profileUpdateData.name} onChange={handleChange} placeholder="Enter new name (optional)" className={`Client-Pro-input ${fieldValidationErrors && fieldValidationErrors.name ? 'input-error' : ''}`} disabled={isLoading}/>
                            {fieldValidationErrors && fieldValidationErrors.name && <div className="error-message">{fieldValidationErrors.name}</div>}
                        </div>

                        <div className="Client-Pro-form-group">
                            <label className="Client-Pro-label" htmlFor="client-email-display">Email Address</label>
                            <input id="client-email-display" type="email" value={currentEmail} className="Client-Pro-input" readOnly disabled title="Email cannot be changed" />
                        </div>

                        <div className="Client-Pro-form-group">
                            <label className="Client-Pro-label" htmlFor="client-contact">Contact Number</label>
                            <input id="client-contact" type="tel" name="contactNumber" value={profileUpdateData.contactNumber} onChange={handleChange} placeholder="Enter new 10-digit number" className={`Client-Pro-input ${fieldValidationErrors && fieldValidationErrors.contactNumber ? 'input-error' : ''}`} disabled={isLoading}/>
                            {fieldValidationErrors && fieldValidationErrors.contactNumber && <div className="error-message">{fieldValidationErrors.contactNumber}</div>}
                        </div>

                         <div className="Client-Pro-form-group">
                           <label className="Client-Pro-label" htmlFor="client-password">New Password</label>
                           <input id="client-password" type="password" name="password" value={profileUpdateData.password} onChange={handleChange} className={`Client-Pro-input ${fieldValidationErrors && fieldValidationErrors.password ? 'input-error' : ''}`} placeholder="Leave blank to keep current" disabled={isLoading}/>
                           {fieldValidationErrors && fieldValidationErrors.password && <div className="error-message">{fieldValidationErrors.password}</div>}
                         </div>

                         <div className="Client-Pro-form-group">
                           <label className="Client-Pro-label" htmlFor="client-address">Address</label>
                           <textarea id="client-address" name="address" value={profileUpdateData.address} onChange={handleChange} rows="3" placeholder="Enter new full address" className={`Client-Pro-textarea ${fieldValidationErrors && fieldValidationErrors.address ? 'input-error' : ''}`} disabled={isLoading}/>
                           {fieldValidationErrors && fieldValidationErrors.address && <div className="error-message">{fieldValidationErrors.address}</div>}
                         </div>

                        <div className="Client-Pro-form-row">
                             <div className="Client-Pro-form-group Client-Pro-form-group-half">
                               <label className="Client-Pro-label" htmlFor="client-district">District</label>
                               <select id="client-district" name="district" value={profileUpdateData.district} onChange={handleChange} className={`Client-Pro-select ${fieldValidationErrors && fieldValidationErrors.district ? 'input-error' : ''}`} disabled={isLoading}>
                                    <option value="colombo">Colombo</option>
                                    <option value="gampaha">Gampaha</option>
                                    <option value="kalutara">Kalutara</option>
                                    <option value="kandy">Kandy</option>
                               </select>
                                {fieldValidationErrors && fieldValidationErrors.district && <div className="error-message">{fieldValidationErrors.district}</div>}
                             </div>
                             <div className="Client-Pro-form-group Client-Pro-form-group-half">
                               <label className="Client-Pro-label" htmlFor="client-province">Province</label>
                               <select id="client-province" name="province" value={profileUpdateData.province} onChange={handleChange} className={`Client-Pro-select ${fieldValidationErrors && fieldValidationErrors.province ? 'input-error' : ''}`} disabled={isLoading}>
                                   <option value="western">Western</option>
                                   <option value="central">Central</option>
                                   <option value="southern">Southern</option>
                                   <option value="northern">Northern</option>
                                   <option value="eastern">Eastern</option>
                                   <option value="north western">North Western</option>
                                   <option value="north central">North Central</option>
                                   <option value="uva">Uva</option>
                                   <option value="sabaragamuwa">Sabaragamuwa</option>
                               </select>
                                {fieldValidationErrors && fieldValidationErrors.province && <div className="error-message">{fieldValidationErrors.province}</div>}
                             </div>
                        </div>

                        <button type="submit" className="Client-Pro-save-btn" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Changes"}
                        </button>
                    </form>
                </div>

                <div className="Client-Pro-column Client-Pro-column-right">
                    <h3 className="Client-Pro-column-title">Quick Actions</h3>
                    <button className={`Client-Pro-action-btn pickup ${activeButton === "pickup" ? "active" : ""}`} onClick={() => handleButtonClick("pickup")}> <span className="Client-Pro-btn-icon"><Truck size={18} /></span> My Pickup Requests </button>
                    <button className={`Client-Pro-action-btn buy-sell ${activeButton === "buy" ? "active" : ""}`} onClick={() => handleButtonClick("buy")}> <span className="Client-Pro-btn-icon"><ShoppingCart size={18} /></span> Check Buy & Sell </button>
                </div>
            </div>
        </div>
    );
}