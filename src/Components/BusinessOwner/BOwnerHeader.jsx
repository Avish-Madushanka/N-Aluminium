// src/Components/BusinessOwner/BOwnerHeader.jsx

import React, { useState, useEffect } from 'react';
import './BOwnerHeader.css'; // Ensure your CSS file exists and styles elements correctly

// Default images in case the user hasn't uploaded any or paths are broken/missing
const defaultCoverPhoto = 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFjZWJvb2slMjBjb3ZlcnxlbnwwfHwwfHx8MA%3D%3D'; // Placeholder cover
const defaultProfilePhoto = 'https://i.pinimg.com/736x/71/b3/e4/71b3e4159892bb319292ab3b76900930.jpg'; // Placeholder profile

// Your backend URL - Make sure this points to where your backend server is running
const BACKEND_URL = 'http://localhost:5002'; // Default, adjust port if you changed it

const BOwnerHeader = () => {
  const [businessData, setBusinessData] = useState(null); // State to hold the loaded user info
  const [loading, setLoading] = useState(true);       // Loading state for initial fetch
  const [error, setError] = useState(null);         // Error state for feedback

  useEffect(() => {
    // Function to load data from localStorage when the component mounts
    const loadBusinessData = () => {
      console.log("BOwnerHeader: Attempting to load user info from localStorage...");
      setLoading(true);
      setError(null); // Reset error state on load attempt

      try {
        // Get the stored string from localStorage (set by App.jsx after login)
        const storedDataString = localStorage.getItem('userInfo');

        if (storedDataString) {
          // Parse the JSON string back into an object
          const parsedData = JSON.parse(storedDataString);
          console.log("BOwnerHeader: Parsed userInfo from localStorage:", parsedData);

          // --- Validate User Type ---
          // Check if the parsed data is for a 'bowner' or 'admin'
          if (parsedData && (parsedData.userType === 'bowner' || parsedData.role === 'admin')) {
            // If valid, update the component's state
            setBusinessData(parsedData);
          } else {
            // If data exists but isn't the correct type
            console.warn("BOwnerHeader: Loaded userInfo is not for a bowner/admin. User type:", parsedData?.userType, "Role:", parsedData?.role);
            setError('Access denied. Invalid user type loaded.'); // Set appropriate error message
            setBusinessData(null); // Clear potentially incorrect data
            // Consider clearing the bad localStorage data here if desired
            // localStorage.removeItem('userInfo');
            // localStorage.removeItem('token');
          }
        } else {
          // No 'userInfo' found in localStorage
          console.log("BOwnerHeader: No 'userInfo' found in localStorage. User likely not logged in or data cleared.");
          setError('Business information not found. Please log in.');
          setBusinessData(null);
        }
      } catch (parseError) {
        // Handle potential errors during JSON.parse (if data in localStorage is corrupted)
        console.error("BOwnerHeader: Error parsing userInfo from localStorage:", parseError);
        setError('Failed to load user information. Data might be corrupted.');
        setBusinessData(null);
        // Consider clearing the corrupted item: localStorage.removeItem('userInfo');
      } finally {
        // Stop the loading indicator whether successful or not
        setLoading(false);
      }
    };

    loadBusinessData(); // Execute the function

  }, []); // Empty dependency array ensures this runs only once on mount

  // --- Construct Image URLs ---
  // Safely access photo paths from the businessData state using optional chaining (?.)
  const coverPhotoPath = businessData?.coverPhoto; // e.g., "/uploads/b_owner_covers/file.jpg" or null/undefined
  const profilePhotoPath = businessData?.profilePhoto; // e.g., "/uploads/b_owner_profiles/file.jpg" or null/undefined

  // Build the full image URL only if a path exists, otherwise fallback to the default image
  // Ensure paths from DB/Token start with '/'
  const coverPhotoUrl = coverPhotoPath && coverPhotoPath.startsWith('/')
    ? `${BACKEND_URL}${coverPhotoPath}`
    : defaultCoverPhoto;

  const profilePhotoUrl = profilePhotoPath && profilePhotoPath.startsWith('/')
    ? `${BACKEND_URL}${profilePhotoPath}`
    : defaultProfilePhoto;

  // --- Render Logic ---

  // 1. Show Loading State
  if (loading) {
    return <div className="loading-placeholder" style={{ padding: '40px', textAlign: 'center', color: '#555' }}>Loading Business Information...</div>;
  }

  // 2. Show Error State (if error occurred or no valid data found)
  if (error || !businessData) {
     return (
        // Use CSS classes for styling the error message box
        <div className="business-data-missing error-message" style={{ padding: '20px', border: '1px solid #dc2626', margin: '20px', borderRadius: '5px', backgroundColor: '#fee2e2', color: '#dc2626', textAlign: 'center' }}>
            <p><strong>Error:</strong> {error || 'Could not load business information. Please try logging in again.'}</p>
            {/* Optionally add a button/link to redirect to login */}
            {/* <button onClick={() => window.location.href='/Login'}>Go to Login</button> */}
        </div>
     );
  }

  // 3. Render Header with Business Data (Success)
  return (
    <div className="business1-card"> {/* Ensure class names match your CSS */}
      {/* Cover Photo Section */}
      <div className="cover1-photo">
        <img
            src={coverPhotoUrl}
            alt={`${businessData.businessName || 'Business'} Cover Photo`} // Descriptive alt text
            className="cover1-image"
            // onError fallback: If the constructed image URL fails (404, etc.), display the default cover photo
            onError={(e) => {
                console.warn(`Failed to load cover image from ${coverPhotoUrl}. Using default.`);
                e.target.onerror = null; // Prevent infinite loop if the default also fails
                e.target.src = defaultCoverPhoto;
            }}
        />
        {/* Profile Photo overlaid on Cover Photo */}
        <div className="profile1-photo">
          <img
            src={profilePhotoUrl}
            alt={`${businessData.name || 'Owner'} Profile Photo`} // Descriptive alt text
            className="profile1-image"
            // onError fallback for profile photo
            onError={(e) => {
                console.warn(`Failed to load profile image from ${profilePhotoUrl}. Using default.`);
                e.target.onerror = null; // Prevent infinite loop
                e.target.src = defaultProfilePhoto;
            }}
          />
        </div>
      </div>

      {/* Business Info Section */}
      <div className="business1-info">
        {/* Display data from businessData state, using fallbacks for safety */}
        <h2 className="business1-name">{businessData?.businessName || 'Business Name N/A'}</h2>
        {/* 'name' in userInfo corresponds to 'ownerName' for BOwner */}
        <p className="owner1-name">{businessData?.name || 'Owner Name N/A'}</p>
        {/* 'contactNumber' should now be available from the token */}
        <p className="contact1-number">{businessData?.contactNumber || 'Contact N/A'}</p>
        <p className="email1">{businessData?.email || 'Email N/A'}</p>
      </div>
    </div>
  );
};

export default BOwnerHeader;