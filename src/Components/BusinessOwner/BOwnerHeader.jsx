import React, { useState, useEffect } from 'react';
import './BOwnerHeader.css';

const defaultCoverPhoto = 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFjZWJvb2slMjBjb3ZlcnxlbnwwfHwwfHx8MA%3D%3D';
const defaultProfilePhoto = 'https://i.pinimg.com/736x/71/b3/e4/71b3e4159892bb319292ab3b76900930.jpg';

const BACKEND_URL = 'http://localhost:5002';

const BOwnerHeader = () => {
  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBusinessData = () => {
      setLoading(true);
      try {
        const storedDataString = localStorage.getItem('bOwnerInfo');
        if (storedDataString) {
          const parsedData = JSON.parse(storedDataString);
          setBusinessData(parsedData);
        } else {
          setBusinessData(null);
        }
      } catch (error) {
        setBusinessData(null);
      } finally {
        setLoading(false);
      }
    };

    loadBusinessData();
  }, []);

  const coverPhotoUrl = businessData?.coverPhoto
    ? `${BACKEND_URL}${businessData.coverPhoto}`
    : defaultCoverPhoto;

  const profilePhotoUrl = businessData?.profilePhoto
    ? `${BACKEND_URL}${businessData.profilePhoto}`
    : defaultProfilePhoto;

  if (loading) {
    return <div className="loading-placeholder">Loading Business Info...</div>;
  }

  if (!businessData) {
     return (
        <div className="business-data-missing">
            <p>Could not load business information. Please log in.</p>
        </div>
     );
  }

  return (
    <div className="business1-card">
      <div className="cover1-photo">
        <img
            src={coverPhotoUrl}
            alt="Cover"
            className="cover1-image"
            onError={(e) => { e.target.onerror = null; e.target.src=defaultCoverPhoto }}
        />
        <div className="profile1-photo">
          <img
            src={profilePhotoUrl}
            alt="Profile"
            className="profile1-image"
            onError={(e) => { e.target.onerror = null; e.target.src=defaultProfilePhoto }}
          />
        </div>
      </div>
      <div className="business1-info">
        <h2 className="business1-name">{businessData?.businessName || 'N/A'}</h2>
        <p className="owner1-name">{businessData?.ownerName || 'N/A'}</p>
        <p className="contact1-number">{businessData?.contactNumber || 'N/A'}</p>
        <p className="email1">{businessData?.email || 'N/A'}</p>
      </div>
    </div>
  );
};

export default BOwnerHeader;
