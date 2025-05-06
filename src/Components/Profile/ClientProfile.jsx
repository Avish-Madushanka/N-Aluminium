// src/Components/ClientProfile/ClientProfile.jsx (or wherever it is)
import React, { useState, useEffect } from "react";
import { FileImage, Mail, Truck, ShoppingCart, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./ClientProfile.css"; // Ensure CSS path is correct

// Helper function to get user info from localStorage
const getUserInfoFromStorage = () => {
  const storedUserInfo = localStorage.getItem("userInfo");
  if (storedUserInfo) {
    try {
      return JSON.parse(storedUserInfo);
    } catch (e) {
      console.error("Error parsing userInfo from localStorage:", e);
      return null;
    }
  }
  return null;
};


export default function ClientProfile() {
  // --- State ---
  // Initialize profile state from localStorage or with defaults
  const [profile, setProfile] = useState(() => {
      const userInfo = getUserInfoFromStorage();
      return {
        name: userInfo?.name || "", // Use name for client
        email: userInfo?.email || "",
        contactNumber: userInfo?.contactNumber || "",
        password: "", // Don't display or pre-fill password
        address: userInfo?.address || "",
        district: userInfo?.district || "",
        province: userInfo?.province || "",
        // Add profilePhoto path if it's in userInfo
        profilePhotoUrl: userInfo?.profilePhoto || null
      };
  });

  const [profilePhotoFile, setProfilePhotoFile] = useState(null); // For new file selection
  const [isEditing, setIsEditing] = useState(false); // To toggle edit mode (optional)
  const [isLoading, setIsLoading] = useState(false); // For future API calls
  const [error, setError] = useState('');
  const [activeButton, setActiveButton] = useState(null); // For button click effect

  const navigate = useNavigate();

  // --- Effect to load data on mount or if userInfo changes ---
  // (Redundant if initialized directly, but useful if props were used)
  useEffect(() => {
    const userInfo = getUserInfoFromStorage();
    if (!userInfo) {
      // If no user info found, maybe redirect to login
      setError("User data not found. Please log in.");
      // navigate('/login?redirect=/ClientProfile'); // Example redirect
    } else {
        // Update state if needed (e.g., if localStorage might update externally)
        setProfile({
            name: userInfo.name || "",
            email: userInfo.email || "",
            contactNumber: userInfo.contactNumber || "",
            password: "",
            address: userInfo.address || "",
            district: userInfo.district || "",
            province: userInfo.province || "",
            profilePhotoUrl: userInfo.profilePhoto || null
        });
    }
  }, []); // Run once on mount

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle new profile photo selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
        setProfilePhotoFile(e.target.files[0]);
        // Optional: Show preview immediately
         setProfile(prev => ({
             ...prev,
             profilePhotoUrl: URL.createObjectURL(e.target.files[0]) // Temporary preview URL
         }));
    }
  };

  // --- Handle Form Submit (Placeholder for API call) ---
  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    console.log("Saving profile data (API call needed)...", profile);
    console.log("New profile photo file:", profilePhotoFile);

    // ** Placeholder for future API call to update profile **
    // Example structure:
    // try {
    //   const formData = new FormData();
    //   formData.append('name', profile.name);
    //   formData.append('email', profile.email);
    //   // ... append other fields ...
    //   if (profilePhotoFile) {
    //     formData.append('profilePhoto', profilePhotoFile);
    //   }
    //   const token = localStorage.getItem('token');
    //   const response = await axios.put(`/api/clients/${userInfo._id}`, formData, { // Assuming you have userInfo._id
    //       headers: {
    //           Authorization: `Bearer ${token}`,
    //          'Content-Type': 'multipart/form-data'
    //        }
    //   });
    //   if(response.data.success) {
    //      alert('Profile updated successfully!');
    //      // Update localStorage userInfo if backend sends updated data
    //      localStorage.setItem('userInfo', JSON.stringify(response.data.data));
    //       setProfilePhotoFile(null); // Clear file input state
    //   } else {
    //      throw new Error(response.data.message || 'Failed to update profile');
    //   }
    // } catch (err) {
    //      console.error("Profile save error:", err);
    //      setError(err.response?.data?.message || err.message || "Could not save profile.");
    // } finally {
    //      setIsLoading(false);
    // }

    // --- Remove Temporary Simulation ---
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    alert("Save functionality needs backend integration.");
    setIsLoading(false);
    // --- End Remove ---
  };

  // Handle navigation button clicks
  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);

    switch (buttonName) {
      case "email":
        navigate("/ClientEmail"); // Make sure this route exists
        break;
      case "pickup":
        navigate("/PickupReq"); // Make sure this route exists
        break;
      case "buy":
        navigate("/CheckBuySell"); // Make sure this route exists
        break;
      case "logout":
        // Trigger logout through Navbar's handler via App.jsx is preferred
        // This direct navigation might not clear state properly
        // Instead, maybe call a logout function passed as prop?
        // For now, just navigate, but this needs review in App structure
        alert("Logout should ideally be handled by the Navbar/App.");
        navigate("/"); // Go home after logging out
        // Consider: props.handleLogout() if passed down
        break;
      default:
        break;
    }

    // Reset button active state after a short delay
    setTimeout(() => setActiveButton(null), 300);
  };

  const getProfilePhotoSource = () => {
    // If a new file is selected, use its temporary URL
    if (profilePhotoFile) {
        return URL.createObjectURL(profilePhotoFile);
    }
    // If existing photo URL starts with '/', assume it's relative to backend host
    if (profile.profilePhotoUrl && profile.profilePhotoUrl.startsWith('/')) {
      // Use the backend base URL from config if available, otherwise assume same origin
      const backendUrl = API_ENDPOINTS.BASE_URL || window.location.origin;
      return `${backendUrl}${profile.profilePhotoUrl}`;
    }
    // If it's a full URL (less likely from backend), use it directly
    if (profile.profilePhotoUrl) {
        return profile.profilePhotoUrl;
    }
    // Fallback placeholder (optional)
    return null; // Or path to a default avatar image
  };

  const profilePhotoSrc = getProfilePhotoSource();


  return (
    <div className="Client-Pro-container">
      <h2 className="Client-Pro-main-title">User Profile</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="Client-Pro-columns-wrapper">
        {/* Column 1: Profile Form */}
        <div className="Client-Pro-column Client-Pro-column-left">
          <h3 className="Client-Pro-column-title">Profile Details</h3>
          <form onSubmit={handleSave}>
            {/* Profile Photo Display & Upload */}
            <div className="Client-Pro-form-group Client-Pro-photo-section">
                <label className="Client-Pro-label">Profile Photo</label>
                <div className="Client-Pro-photo-area">
                    <div className="Client-Pro-photo-preview-container">
                       {profilePhotoSrc ? (
                           <img
                               src={profilePhotoSrc}
                               alt="Profile"
                               className="Client-Pro-photo-preview"
                           />
                       ) : (
                           <div className="Client-Pro-photo-placeholder">
                               <User size={40} color="#ccc" />
                           </div>
                       )}
                   </div>
                   <input
                        type="file"
                        id="profile-photo-input" // Changed ID
                        accept="image/*" // Accept only images
                        onChange={handleFileChange}
                        className="Client-Pro-file-input-hidden" // Hide default input
                   />
                   <label htmlFor="profile-photo-input" className="Client-Pro-file-upload-btn">
                        <FileImage size={18} />
                        <span>{profilePhotoFile ? profilePhotoFile.name : "Change Photo"}</span>
                   </label>
                </div>
            </div>

            {/* Form Fields */}
            <div className="Client-Pro-form-group">
              <label className="Client-Pro-label" htmlFor="client-name">Full Name</label>
              <input
                id="client-name"
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="Client-Pro-input"
                required
              />
            </div>

            <div className="Client-Pro-form-group">
              <label className="Client-Pro-label" htmlFor="client-email">Email Address</label>
              <input
                id="client-email"
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="Client-Pro-input"
                required
                // Consider making email read-only if it's the identifier
                // readOnly
              />
            </div>

            <div className="Client-Pro-form-group">
              <label className="Client-Pro-label" htmlFor="client-contact">Contact Number</label>
              <input
                 id="client-contact"
                type="tel"
                name="contactNumber"
                value={profile.contactNumber}
                onChange={handleChange}
                className="Client-Pro-input"
                required
              />
            </div>

            <div className="Client-Pro-form-group">
              <label className="Client-Pro-label" htmlFor="client-password">New Password (Optional)</label>
              <input
                id="client-password"
                type="password"
                name="password"
                value={profile.password}
                onChange={handleChange}
                className="Client-Pro-input"
                placeholder="Leave blank to keep current password"
                // Not required for update
              />
            </div>

            <div className="Client-Pro-form-group">
              <label className="Client-Pro-label" htmlFor="client-address">Address</label>
              <textarea
                id="client-address"
                name="address"
                value={profile.address}
                onChange={handleChange}
                rows="3"
                className="Client-Pro-textarea"
                required
              />
            </div>

            <div className="Client-Pro-form-row">
              <div className="Client-Pro-form-group Client-Pro-form-group-half">
                <label className="Client-Pro-label" htmlFor="client-district">District</label>
                {/* Consider fetching districts/provinces from an API or constants file */}
                <select
                  id="client-district"
                  name="district"
                  value={profile.district}
                  onChange={handleChange}
                  className="Client-Pro-select"
                  required
                >
                  <option value="">Select District</option>
                  <option value="colombo">Colombo</option>
                  <option value="gampaha">Gampaha</option>
                  <option value="kalutara">Kalutara</option>
                  <option value="kandy">Kandy</option>
                  <option value="matale">Matale</option>
                  <option value="nuwara-eliya">Nuwara Eliya</option>
                  <option value="galle">Galle</option>
                  <option value="matara">Matara</option>
                  <option value="hambantota">Hambantota</option>
                  <option value="jaffna">Jaffna</option>
                  <option value="kilinochchi">Kilinochchi</option>
                  <option value="mannar">Mannar</option>
                  <option value="vavuniya">Vavuniya</option>
                  <option value="mullaitivu">Mullaitivu</option>
                  <option value="batticaloa">Batticaloa</option>
                  <option value="ampara">Ampara</option>
                  <option value="trincomalee">Trincomalee</option>
                  <option value="kurunegala">Kurunegala</option>
                  <option value="puttalam">Puttalam</option>
                  <option value="anuradhapura">Anuradhapura</option>
                  <option value="polonnaruwa">Polonnaruwa</option>
                  <option value="badulla">Badulla</option>
                  <option value="monaragala">Monaragala</option>
                  <option value="ratnapura">Ratnapura</option>
                  <option value="kegalle">Kegalle</option>
                </select>
              </div>

              <div className="Client-Pro-form-group Client-Pro-form-group-half">
                <label className="Client-Pro-label" htmlFor="client-province">Province</label>
                <select
                  id="client-province"
                  name="province"
                  value={profile.province}
                  onChange={handleChange}
                  className="Client-Pro-select"
                  required
                >
                  <option value="">Select Province</option>
                  <option value="western">Western</option>
                  <option value="central">Central</option>
                  <option value="southern">Southern</option>
                  <option value="northern">Northern</option>
                  <option value="eastern">Eastern</option>
                  <option value="north-western">North Western</option>
                  <option value="north-central">North Central</option>
                  <option value="uva">Uva</option>
                  <option value="sabaragamuwa">Sabaragamuwa</option>
                </select>
              </div>
            </div>


            <button type="submit" className="Client-Pro-save-btn" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Column 2: Action Buttons */}
        <div className="Client-Pro-column Client-Pro-column-right">
          <h3 className="Client-Pro-column-title">Actions</h3>

          <button
            className={`Client-Pro-action-btn email ${activeButton === "email" ? "active" : ""}`}
            onClick={() => handleButtonClick("email")}
          >
            <span className="Client-Pro-btn-icon email"><Mail size={18} /></span>
            Check Emails
          </button>

          <button
            className={`Client-Pro-action-btn pickup ${activeButton === "pickup" ? "active" : ""}`}
            onClick={() => handleButtonClick("pickup")}
          >
            <span className="Client-Pro-btn-icon pickup"><Truck size={18} /></span>
            My Pickup Requests
          </button>

          <button
            className={`Client-Pro-action-btn buy-sell ${activeButton === "buy" ? "active" : ""}`}
            onClick={() => handleButtonClick("buy")}
          >
            <span className="Client-Pro-btn-icon buy-sell"><ShoppingCart size={18} /></span>
            Check Buy & Sell
          </button>

          {/* Logout button here might be redundant if it's in the Navbar dropdown */}
          {/* Consider removing this or ensuring it calls the main handleLogout function */}
          {/* <button
            className={`Client-Pro-action-btn logout ${activeButton === "logout" ? "active" : ""}`}
            onClick={() => handleButtonClick("logout")}
          >
            <span className="Client-Pro-btn-icon logout"><LogOut size={18} /></span>
            Log Out
          </button> */}
        </div>
      </div>
    </div>
  );
}