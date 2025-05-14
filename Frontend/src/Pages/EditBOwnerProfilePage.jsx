// Frontend/src/Pages/EditBOwnerProfilePage.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance'; // VERIFY PATH
import API_ENDPOINTS from '../apiConfig';   // VERIFY PATH
import { useAuth } from '../context/AuthContext'; // VERIFY PATH
import '../Components/BusinessOwner/EditBOwnerProfilePage.css'; // You'll need to create/style this
import { ClipLoader } from 'react-spinners';
import { User, Briefcase, Phone, MapPin, Lock, Camera, Image, Save, XCircle, Mail, Building } from 'lucide-react';

const EditBOwnerProfilePage = () => {
    const { userInfo, login: updateAuthContextInfo } = useAuth(); // 'login' from context updates userInfo
    const navigate = useNavigate();

    const [initialDataLoading, setInitialDataLoading] = useState(true);
    const [formData, setFormData] = useState({
        businessName: '',
        ownerName: '',
        address: '',
        contactNumber: '',
        district: '',
        province: '',
        newPassword: '',
        confirmNewPassword: '',
        // currentPassword: '', // Only needed if backend requires it for password change
    });
    const [originalData, setOriginalData] = useState({}); // To compare for changes

    // For displaying non-editable fields
    const [displayEmail, setDisplayEmail] = useState('');
    const [displayBusinessId, setDisplayBusinessId] = useState('');

    const [profilePhotoFile, setProfilePhotoFile] = useState(null);
    const [coverPhotoFile, setCoverPhotoFile] = useState(null);
    const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
    const [coverPhotoPreview, setCoverPhotoPreview] = useState(null);
    const [existingProfilePhotoUrl, setExistingProfilePhotoUrl] = useState('');
    const [existingCoverPhotoUrl, setExistingCoverPhotoUrl] = useState('');

    const [errors, setErrors] = useState({});
    const [formWideError, setFormWideError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    const profilePhotoRef = useRef(null);
    const coverPhotoRef = useRef(null);
    
    const BACKEND_ASSET_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003/api').replace('/api', '');

    const fetchBOwnerData = useCallback(async () => {
        setInitialDataLoading(true);
        setFormWideError('');
        try {
            if (!API_ENDPOINTS.BOWNERS?.GET_MY_PROFILE) { // Changed from GET_PROFILE_ME for consistency
                throw new Error("Configuration error: Get profile endpoint missing.");
            }
            const response = await axiosInstance.get(API_ENDPOINTS.BOWNERS.GET_MY_PROFILE);
            if (response.data && response.data.success) {
                const bData = response.data.data;
                const fetchedData = {
                    businessName: bData.businessName || '',
                    ownerName: bData.ownerName || '',
                    address: bData.address || '',
                    contactNumber: bData.contactNumber || '',
                    district: bData.district || '',
                    province: bData.province || '',
                    newPassword: '', 
                    confirmNewPassword: '',
                    // currentPassword: '',
                };
                setFormData(fetchedData);
                setOriginalData(fetchedData); // Store original fetched data for comparison
                setDisplayEmail(bData.email || '');
                setDisplayBusinessId(bData.businessId || '');
                if (bData.profilePhoto) setExistingProfilePhotoUrl(`${BACKEND_ASSET_URL}${bData.profilePhoto}`);
                if (bData.coverPhoto) setExistingCoverPhotoUrl(`${BACKEND_ASSET_URL}${bData.coverPhoto}`);
            } else {
                setFormWideError(response.data?.message || "Failed to fetch profile data.");
            }
        } catch (err) {
            console.error("Error fetching B-Owner profile:", err);
            setFormWideError(err.response?.data?.message || err.message || "Could not load your profile.");
        } finally {
            setInitialDataLoading(false);
        }
    }, [BACKEND_ASSET_URL]);

    useEffect(() => {
        fetchBOwnerData();
    }, [fetchBOwnerData]);

    const VALIDATION_PATTERNS = {
        NAME: /^[a-zA-Z\s.'-]{2,50}$/,
        PHONE: /^[0-9]{10}$/,
        PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/,
        ADDRESS_MIN_LENGTH: 10,
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };
    
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            const file = files[0];
            // Basic client-side validation (optional)
            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({ ...prev, [name]: 'Invalid file type. Please select an image.' }));
                return;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB
                setErrors(prev => ({ ...prev, [name]: 'File too large. Max 5MB.' }));
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                if (name === 'profilePhotoFile') {
                    setProfilePhotoFile(file);
                    setProfilePhotoPreview(reader.result);
                } else if (name === 'coverPhotoFile') {
                    setCoverPhotoFile(file);
                    setCoverPhotoPreview(reader.result);
                }
            };
            reader.readAsDataURL(file);
            setErrors(prev => ({ ...prev, [name.replace('File', '')]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        if (formData.businessName.trim() && !VALIDATION_PATTERNS.NAME.test(formData.businessName.trim())) {
            newErrors.businessName = "Valid business name (2-50 chars)."; isValid = false;
        }
        if (formData.ownerName.trim() && !VALIDATION_PATTERNS.NAME.test(formData.ownerName.trim())) {
            newErrors.ownerName = "Valid owner name (2-50 chars)."; isValid = false;
        }
        if (formData.contactNumber.trim() && !VALIDATION_PATTERNS.PHONE.test(formData.contactNumber.trim())) {
            newErrors.contactNumber = "Valid 10-digit contact number."; isValid = false;
        }
        if (formData.address.trim() && formData.address.trim().length < VALIDATION_PATTERNS.ADDRESS_MIN_LENGTH) {
            newErrors.address = `Address min ${VALIDATION_PATTERNS.ADDRESS_MIN_LENGTH} characters.`; isValid = false;
        }
        // District and Province are usually required if provided, but not necessarily required to be changed
        // Add !formData.district.trim() if they must be non-empty during update
        if (formData.district.trim() === '') newErrors.district = "District cannot be empty if provided."; 
        if (formData.province.trim() === '') newErrors.province = "Province cannot be empty if provided.";

        if (formData.newPassword) {
            if (!VALIDATION_PATTERNS.PASSWORD.test(formData.newPassword)) {
                newErrors.newPassword = "New Password: min 6 chars, with uppercase, lowercase, and number."; isValid = false;
            }
            if (formData.newPassword !== formData.confirmNewPassword) {
                newErrors.confirmNewPassword = "New passwords do not match."; isValid = false;
            }
            // If your backend requires currentPassword to change password:
            // if (!formData.currentPassword) {
            //     newErrors.currentPassword = "Current password required to set a new one."; isValid = false;
            // }
        } else if (formData.confirmNewPassword && !formData.newPassword) { // User typed confirm but not new
            newErrors.newPassword = "Please enter the new password first."; isValid = false;
        }
        
        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormWideError('');
        setSuccessMessage('');
        if (!validateForm()) {
            setFormWideError("Please correct the errors below.");
            return;
        }

        setIsUpdating(true);
        const submissionData = new FormData();
        let changesMade = false;

        // Append textual fields only if they've changed from original or are newly filled
        Object.keys(formData).forEach(key => {
            if (key.startsWith('newPassword') || key.startsWith('confirmNewPassword') /* || key === 'currentPassword' */) return; // Handle passwords separately
            if (formData[key] !== originalData[key] && formData[key].trim() !== '') {
                submissionData.append(key, formData[key].trim());
                changesMade = true;
            } else if (formData[key].trim() !== '' && originalData[key] === '') { // Field was empty, now filled
                 submissionData.append(key, formData[key].trim());
                 changesMade = true;
            }
        });
        
        if (formData.newPassword) {
            submissionData.append('newPassword', formData.newPassword); // Backend's bOwnerController uses 'newPassword'
            // if (formData.currentPassword) submissionData.append('currentPassword', formData.currentPassword); // If backend needs it
            changesMade = true;
        }

        if (profilePhotoFile) { submissionData.append('profilePhoto', profilePhotoFile); changesMade = true; }
        if (coverPhotoFile) { submissionData.append('coverPhoto', coverPhotoFile); changesMade = true; }
        
        if (!changesMade) {
            setSuccessMessage("No changes were made to your profile.");
            setIsUpdating(false);
            setTimeout(() => setSuccessMessage(''), 3000);
            return;
        }

        try {
            if (!API_ENDPOINTS.BOWNERS?.UPDATE_MY_PROFILE) { // Changed from UPDATE_PROFILE_ME
                throw new Error("Configuration error: Update profile endpoint missing.");
            }
            
            const response = await axiosInstance.put(API_ENDPOINTS.BOWNERS.UPDATE_MY_PROFILE, submissionData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data && response.data.success) {
                setSuccessMessage('Profile updated successfully!');
                const updatedUserDataFromServer = response.data.data;

                // Update AuthContext and localStorage with the new user data from server
                const currentToken = localStorage.getItem('token');
                if (currentToken && updateAuthContextInfo) {
                    // Construct a userInfo object that mirrors what JWT parse would create
                    const newAuthUserInfo = {
                        id: userInfo.id,
                        email: displayEmail, // Email doesn't change
                        role: userInfo.role,
                        name: updatedUserDataFromServer.ownerName || updatedUserDataFromServer.name, // 'name' in JWT
                        businessName: updatedUserDataFromServer.businessName,
                        contactNumber: updatedUserDataFromServer.contactNumber, // Assuming these are returned
                        profilePhoto: updatedUserDataFromServer.profilePhoto,   // New path from backend
                        coverPhoto: updatedUserDataFromServer.coverPhoto,     // New path from backend
                    };
                    updateAuthContextInfo(currentToken, newAuthUserInfo); // This updates App's authState and localStorage
                }
                
                // Reset form and previews for file inputs
                setProfilePhotoFile(null); setCoverPhotoFile(null);
                setProfilePhotoPreview(null); setCoverPhotoPreview(null);
                if(profilePhotoRef.current) profilePhotoRef.current.value = null;
                if(coverPhotoRef.current) coverPhotoRef.current.value = null;
                
                // Re-fetch data to ensure form and existing image URLs reflect the absolute latest state
                fetchBOwnerData(); 
                setFormData(prev => ({...prev, newPassword: '', confirmNewPassword: '', /* currentPassword: '' */})); // Clear password fields

                setTimeout(() => setSuccessMessage(''), 4000);
            } else {
                setFormWideError(response.data?.message || 'Failed to update profile.');
            }
        } catch (err) {
            console.error("Error updating profile:", err);
            setFormWideError(err.response?.data?.message || err.message || "An error occurred while updating.");
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            }
        } finally {
            setIsUpdating(false);
        }
    };
    
    if (initialDataLoading) {
        return <div className="profile-update-loading"><ClipLoader size={50} color="#f97316" /> <p>Loading Your Profile...</p></div>;
    }
    if (typeof API_ENDPOINTS === 'undefined') {
        return <div className="form-container error-state">Critical Configuration Error: API Endpoints not loaded.</div>;
    }

    return (
        <div className="bowner-profile-update-container">
            <div className="bowner-profile-update-card">
                <h2 className="bowner-profile-update-title">Update Your Business Profile</h2>

                {formWideError && <div className="form-alert error-alert"><AlertCircle size={18} /> {formWideError}</div>}
                {successMessage && <div className="form-alert success-alert"><span>{successMessage}</span></div>}

                <form onSubmit={handleSubmit} noValidate encType="multipart/form-data">
                    <div className="form-group read-only-group">
                        <label><Building size={16}/> Business ID</label>
                        <p>{displayBusinessId || 'N/A (Not Set)'}</p>
                    </div>
                    <div className="form-group read-only-group">
                        <label><Mail size={16}/> Email Address</label>
                        <p>{displayEmail || 'N/A (Not Set)'}</p>
                    </div>
                    
                    <hr className="form-divider"/>

                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="businessName"><Briefcase size={16}/> Business Name *</label>
                            <input id="businessName" type="text" name="businessName" value={formData.businessName} onChange={handleInputChange} required disabled={isUpdating} className={errors.businessName ? 'input-error' : ''} />
                            {errors.businessName && <div className="error-message">{errors.businessName}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="ownerName"><User size={16}/> Owner's Name *</label>
                            <input id="ownerName" type="text" name="ownerName" value={formData.ownerName} onChange={handleInputChange} required disabled={isUpdating} className={errors.ownerName ? 'input-error' : ''} />
                            {errors.ownerName && <div className="error-message">{errors.ownerName}</div>}
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="contactNumber"><Phone size={16}/> Contact Number *</label>
                        <input id="contactNumber" type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} required disabled={isUpdating} className={errors.contactNumber ? 'input-error' : ''} />
                        {errors.contactNumber && <div className="error-message">{errors.contactNumber}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="address"><MapPin size={16}/> Address *</label>
                        <textarea id="address" name="address" value={formData.address} onChange={handleInputChange} required disabled={isUpdating} rows="3" className={errors.address ? 'input-error' : ''}></textarea>
                        {errors.address && <div className="error-message">{errors.address}</div>}
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="district">District *</label>
                            <input id="district" type="text" name="district" value={formData.district} onChange={handleInputChange} required disabled={isUpdating} className={errors.district ? 'input-error' : ''} />
                            {errors.district && <div className="error-message">{errors.district}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="province">Province *</label>
                            <input id="province" type="text" name="province" value={formData.province} onChange={handleInputChange} required disabled={isUpdating} className={errors.province ? 'input-error' : ''} />
                            {errors.province && <div className="error-message">{errors.province}</div>}
                        </div>
                    </div>

                    <hr className="form-divider" />
                    <h3 className="form-section-title">Update Photos (Optional)</h3>
                    <div className="form-grid file-inputs">
                        <div className="form-group">
                            <label htmlFor="profilePhotoFile"><Camera size={16}/> New Profile Photo</label>
                            {profilePhotoPreview ? 
                                <img src={profilePhotoPreview} alt="New Profile Preview" className="image-preview"/> : 
                                existingProfilePhotoUrl && <img src={existingProfilePhotoUrl} alt="Current Profile" className="image-preview existing-image-preview"/>
                            }
                            <input id="profilePhotoFile" type="file" name="profilePhotoFile" accept="image/*" onChange={handleFileChange} ref={profilePhotoRef} disabled={isUpdating} />
                            {errors.profilePhotoFile && <div className="error-message">{errors.profilePhotoFile}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="coverPhotoFile"><Image size={16}/> New Cover Photo</label>
                            {coverPhotoPreview ? 
                                <img src={coverPhotoPreview} alt="New Cover Preview" className="image-preview"/> : 
                                existingCoverPhotoUrl && <img src={existingCoverPhotoUrl} alt="Current Cover" className="image-preview existing-image-preview"/>
                            }
                            <input id="coverPhotoFile" type="file" name="coverPhotoFile" accept="image/*" onChange={handleFileChange} ref={coverPhotoRef} disabled={isUpdating} />
                            {errors.coverPhotoFile && <div className="error-message">{errors.coverPhotoFile}</div>}
                        </div>
                    </div>

                    <hr className="form-divider" />
                    <h3 className="form-section-title">Change Password (Optional)</h3>
                     <p className="form-note">Leave blank if you don't want to change your password.</p>
                    {/* If requiring current password for new password:
                    <div className="form-group">
                        <label htmlFor="currentPassword"><Lock size={16}/> Current Password (Required to change password)</label>
                        <input id="currentPassword" type="password" name="currentPassword" value={formData.currentPassword} onChange={handleInputChange} disabled={isUpdating || !formData.newPassword} className={errors.currentPassword ? 'input-error' : ''} placeholder="Enter current password"/>
                        {errors.currentPassword && <div className="error-message">{errors.currentPassword}</div>}
                    </div>
                    */}
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="newPassword"><Lock size={16}/> New Password</label>
                            <input id="newPassword" type="password" name="newPassword" value={formData.newPassword} onChange={handleInputChange} disabled={isUpdating} className={errors.newPassword ? 'input-error' : ''} placeholder="Enter new password"/>
                            {errors.newPassword && <div className="error-message">{errors.newPassword}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmNewPassword"><Lock size={16}/> Confirm New Password</label>
                            <input id="confirmNewPassword" type="password" name="confirmNewPassword" value={formData.confirmNewPassword} onChange={handleInputChange} disabled={isUpdating || !formData.newPassword} className={errors.confirmNewPassword ? 'input-error' : ''} placeholder="Confirm new password"/>
                            {errors.confirmNewPassword && <div className="error-message">{errors.confirmNewPassword}</div>}
                        </div>
                    </div>
                    
                    <div className="form-actions">
                        <button type="button" onClick={() => navigate(-1)} className="cancel-btn" disabled={isUpdating}>
                            <XCircle size={18}/> Cancel
                        </button>
                        <button type="submit" className="submit-btn" disabled={isUpdating}>
                            {isUpdating ? <ClipLoader size={20} color="#fff"/> : <Save size={18}/>} Update Profile
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditBOwnerProfilePage;