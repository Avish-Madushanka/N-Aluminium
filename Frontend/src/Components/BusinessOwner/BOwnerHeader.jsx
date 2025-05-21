import React, { useState, useEffect } from 'react';
import './BOwnerHeader.css'; 

const defaultCoverPhoto = 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFjZWJvb2slMjBjb3ZlcnxlbnwwfHwwfHx8MA%3D%3D'; // Placeholder cover
const defaultProfilePhoto = 'https://i.pinimg.com/736x/71/b3/e4/71b3e4159892bb319292ab3b76900930.jpg'; 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003/api';
const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || API_BASE_URL.replace('/api', ''));

console.log("BOwnerHeader: Using BACKEND_URL:", BACKEND_URL); 

const BOwnerHeader = () => {
  const [businessData, setBusinessData] = useState(null); 
  const [loading, setLoading] = useState(true);      
  const [error, setError] = useState(null);   

  useEffect(() => {
    const loadBusinessData = () => {
      console.log("BOwnerHeader: Attempting to load user info from localStorage...");
      setLoading(true);
      setError(null); 

      try {
        const storedDataString = localStorage.getItem('userInfo');

        if (storedDataString) {
          const parsedData = JSON.parse(storedDataString);
          console.log("BOwnerHeader: Parsed userInfo from localStorage:", parsedData);

          if (parsedData && (parsedData.role === 'businessOwner' || parsedData.role === 'admin')) {
            setBusinessData(parsedData);
            console.log("BOwnerHeader: User role validated. Data set for role:", parsedData.role);
          } else {
            console.warn("BOwnerHeader: Loaded userInfo is not for a businessOwner/admin. User role:", parsedData?.role);
            setError('Access denied. Invalid user role loaded.');
            setBusinessData(null);
          }
        } else {
          console.log("BOwnerHeader: No 'userInfo' found in localStorage. User likely not logged in or data cleared.");
          setError('Business information not found. Please log in.');
          setBusinessData(null);
        }
      } catch (parseError) {
        console.error("BOwnerHeader: Error parsing userInfo from localStorage:", parseError);
        setError('Failed to load user information. Data might be corrupted.');
        setBusinessData(null);
      } finally {
        setLoading(false);
      }
    };

    loadBusinessData();

  }, []);

  const coverPhotoPath = businessData?.coverPhoto;
  const profilePhotoPath = businessData?.profilePhoto;

  const coverPhotoUrl = coverPhotoPath && coverPhotoPath.startsWith('/')
    ? `${BACKEND_URL}${coverPhotoPath}`
    : defaultCoverPhoto;

  const profilePhotoUrl = profilePhotoPath && profilePhotoPath.startsWith('/')
    ? `${BACKEND_URL}${profilePhotoPath}`
    : defaultProfilePhoto;

  if (loading) {
    return <div className="loading-placeholder" style={{ padding: '40px', textAlign: 'center', color: '#555' }}>Loading Business Information...</div>;
  }

  if (error || !businessData) {
     return (
        <div className="business-data-missing error-message" style={{ padding: '20px', border: '1px solid #dc2626', margin: '20px', borderRadius: '5px', backgroundColor: '#fee2e2', color: '#dc2626', textAlign: 'center' }}>
            <p><strong>Error:</strong> {error || 'Could not load business information. Please try logging in again.'}</p>
        </div>
     );
  }

  return (
    <div className="business1-card">
      <div className="cover1-photo">
        <img
            src={coverPhotoUrl}
            alt={`${businessData.businessName || 'Business'} Cover Photo`}
            className="cover1-image"
            onError={(e) => {
                console.warn(`Failed to load cover image from ${coverPhotoUrl}. Using default.`);
                e.target.onerror = null;
                e.target.src = defaultCoverPhoto;
            }}
        />
        <div className="profile1-photo">
          <img
            src={profilePhotoUrl}
            alt={`${businessData.name || 'Owner'} Profile Photo`}
            className="profile1-image"
            onError={(e) => {
                console.warn(`Failed to load profile image from ${profilePhotoUrl}. Using default.`);
                e.target.onerror = null;
                e.target.src = defaultProfilePhoto;
            }}
          />
        </div>
      </div>

      <div className="business1-info">
        <h2 className="business1-name">{businessData?.businessName || 'Business Name N/A'}</h2>
        <p className="owner1-name">{businessData?.name || 'Owner Name N/A'}</p>
        <p className="contact1-number">{businessData?.contactNumber || 'Contact N/A'}</p> {/* Ensure contactNumber is in JWT payload */}
        <p className="email1">{businessData?.email || 'Email N/A'}</p>
      </div>
    </div>
  );
};

export default BOwnerHeader;