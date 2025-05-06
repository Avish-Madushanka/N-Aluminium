import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { FileImage, AlertCircle } from 'lucide-react';
import './ClientForm.css'

// API Configuration (ensure this matches your backend)
const API_ENDPOINTS = {
  CLIENT: {
    REGISTER: 'http://localhost:5003/api/clients/register'
  }
};

const ClientForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    password: '',
    confirmPassword: '',
    address: '',
    district: 'colombo', // Default value
    province: 'western'  // Default value
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (profilePhotoPreview) URL.revokeObjectURL(profilePhotoPreview);
    };
  }, [profilePhotoPreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed (JPEG, PNG, GIF)');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setProfilePhoto(file);
    setProfilePhotoPreview(URL.createObjectURL(file));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'confirmPassword') {
          formDataToSend.append(key, value);
        }
      });
      
      if (profilePhoto) {
        formDataToSend.append('profilePhoto', profilePhoto);
      }

      const response = await axios.post(
        API_ENDPOINTS.CLIENT.REGISTER,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 10000 // 10 second timeout
        }
      );

      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApiError = (err) => {
    if (err.code === 'ECONNABORTED') {
      setError('Request timeout - server took too long to respond');
    } else if (err.response) {
      // Server responded with error status
      const { data } = err.response;
      setError(data.message || `Server error: ${err.response.status}`);
    } else if (err.request) {
      // No response received
      setError('No response from server - check your network connection');
    } else {
      // Other errors
      setError('Registration failed: ' + err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Client Registration</h2>
      
      {/* Error/Success Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded flex items-center">
          <AlertCircle className="mr-2" size={18} />
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block mb-1 font-medium">Full Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Email Field */}
        <div>
          <label className="block mb-1 font-medium">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Contact Number */}
        <div>
          <label className="block mb-1 font-medium">Contact Number *</label>
          <input
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Password Fields */}
        <div>
          <label className="block mb-1 font-medium">Password (min 6 chars) *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
            disabled={loading}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Confirm Password *</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block mb-1 font-medium">Address *</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            disabled={loading}
            rows="3"
            className="w-full p-2 border rounded"
          />
        </div>

        {/* District and Province */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">District *</label>
            <select
              name="district"
              value={formData.district}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full p-2 border rounded"
            >
              <option value="colombo">Colombo</option>
              <option value="kandy">Kandy</option>
              <option value="galle">Galle</option>
              {/* Add other districts */}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Province *</label>
            <select
              name="province"
              value={formData.province}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full p-2 border rounded"
            >
              <option value="western">Western</option>
              <option value="central">Central</option>
              <option value="southern">Southern</option>
              {/* Add other provinces */}
            </select>
          </div>
        </div>

        {/* Profile Photo Upload */}
        <div>
          <label className="block mb-1 font-medium">Profile Photo</label>
          <div className="flex items-center space-x-4">
            {profilePhotoPreview && (
              <img 
                src={profilePhotoPreview} 
                alt="Preview" 
                className="w-16 h-16 object-cover rounded-full border"
              />
            )}
            <label className="cursor-pointer">
              <div className="flex items-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                <FileImage className="mr-2" size={18} />
                <span>{profilePhoto ? profilePhoto.name : 'Choose Image'}</span>
              </div>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                disabled={loading}
              />
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded text-white font-medium ${
            loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? (
            <ClipLoader size={20} color="#ffffff" />
          ) : (
            'Register Account'
          )}
        </button>
      </form>
    </div>
  );
};

export default ClientForm;