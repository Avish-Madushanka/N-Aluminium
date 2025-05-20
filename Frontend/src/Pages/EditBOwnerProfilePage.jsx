import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import API_ENDPOINTS from '../apiConfig';
import { useAuth } from '../context/AuthContext';
import '../Components/BusinessOwner/EditBOwnerProfilePage.css';
import { ClipLoader } from 'react-spinners';
import { User, Briefcase, Phone, MapPin, Lock, Camera, Image, Save, XCircle, Mail, Building } from 'lucide-react';

const EditBOwnerProfilePage = () => {
    const { userInfo, login: updateAuthContextInfo } = useAuth();
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
    });
    const [originalData, setOriginalData] = useState({});
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
            if (!API_ENDPOINTS.BOWNERS?.GET_MY_PROFILE) {
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
                };
                setFormData(fetchedData);
                setOriginalData(fetchedData);
                setDisplayEmail(bData.email || '');
                setDisplayBusinessId(bData.businessId || '');
                if (bData.profilePhoto) setExistingProfilePhotoUrl(`${BACKEND_ASSET_URL}${bData.profilePhoto}`);
                if (bData.coverPhoto) setExistingCoverPhotoUrl(`${BACKEND_ASSET_URL}${bData.coverPhoto}`);
            } else {
                setFormWideError(response.data?.message || "Failed to fetch profile data.");
            }
        } catch (err) {
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
            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({ ...prev, [name]: 'Invalid file type. Please select an image.' }));
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
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
        if (formData.district.trim() === '') newErrors.district = "District cannot be empty if provided.";
        if (formData.province.trim() === '') newErrors.province = "Province cannot be empty if provided.";

        if (formData.newPassword) {
            if (!VALIDATION_PATTERNS.PASSWORD.test(formData.newPassword)) {
                newErrors.newPassword = "New Password: min 6 chars, with uppercase, lowercase, and number."; isValid = false;
            }
            if (formData.newPassword !== formData.confirmNewPassword) {
                newErrors.confirmNewPassword = "New passwords do not match."; isValid = false;
            }
        } else if (formData.confirmNewPassword && !formData.newPassword) {
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

        Object.keys(formData).forEach(key => {
            if (key.startsWith('newPassword') || key.startsWith('confirmNewPassword')) return;
            if (formData[key] !== originalData[key] && formData[key].trim() !== '') {
                submissionData.append(key, formData[key].trim());
                changesMade = true;
            } else if (formData[key].trim() !== '' && originalData[key] === '') {
                submissionData.append(key, formData[key].trim());
                changesMade = true;
            }
        });

        if (formData.newPassword) {
            submissionData.append('newPassword', formData.newPassword);
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
            if (!API_ENDPOINTS.BOWNERS?.UPDATE_MY_PROFILE) {
                throw new Error("Configuration error: Update profile endpoint missing.");
            }
            const response = await axiosInstance.put(API_ENDPOINTS.BOWNERS.UPDATE_MY_PROFILE, submissionData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data && response.data.success) {
                setSuccessMessage('Profile updated successfully!');
                const updatedUserDataFromServer = response.data.data;
                const currentToken = localStorage.getItem('token');
                if (currentToken && updateAuthContextInfo) {
                    const newAuthUserInfo = {
                        id: userInfo.id,
                        email: displayEmail,
                        role: userInfo.role,
                        name: updatedUserDataFromServer.ownerName || updatedUserDataFromServer.name,
                        businessName: updatedUserDataFromServer.businessName,
                        contactNumber: updatedUserDataFromServer.contactNumber,
                        profilePhoto: updatedUserDataFromServer.profilePhoto,
                        coverPhoto: updatedUserDataFromServer.coverPhoto,
                    };
                    updateAuthContextInfo(currentToken, newAuthUserInfo);
                }
                setProfilePhotoFile(null); setCoverPhotoFile(null);
                setProfilePhotoPreview(null); setCoverPhotoPreview(null);
                if(profilePhotoRef.current) profilePhotoRef.current.value = null;
                if(coverPhotoRef.current) coverPhotoRef.current.value = null;
                fetchBOwnerData();
                setFormData(prev => ({...prev, newPassword: '', confirmNewPassword: ''}));
                setTimeout(() => setSuccessMessage(''), 4000);
            } else {
                setFormWideError(response.data?.message || 'Failed to update profile.');
            }
        } catch (err) {
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

    return <div>Edit Business Owner Profile Page</div>;
};

export default EditBOwnerProfilePage;
