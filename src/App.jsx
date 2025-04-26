// src/App.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { jwtDecode } from 'jwt-decode';

// --- Core & Helper Component Imports ---
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import FloatingChatbot from './Components/Chatbot/ChatBox';
import ProtectedRoute from './routes/ProtectedRoute'; // Assuming path is src/routes/ProtectedRoute.js

// --- Page Imports ---
import HomePage from './Pages/HomePage';
import SignUp from './Pages/SignUp';
import AboutUs from './Pages/AboutUS';
import BuyandSell from './Pages/BuyandSell';
import Login from './Components/Login/Login'; // Login Page Component
import BOwnerForm from './Components/RegistrationForm/BOwnerForm';
import ClientForm from './Components/RegistrationForm/ClientForm';
import Project from './Pages/Project';
import Collection from './Pages/Collection';
import Service from './Pages/Service';
import Map from './Pages/Map';
import Calculate from './Components/Calculate/Calculate';

// --- Protected Page Imports ---
import SaleForm from './Components/SaleForm/SaleForm';
import BuyCard from './Components/BuyCard/BuyCard';
import BOwnerHome from './Pages/BOwnerHome';          // Business Owner Dashboard/Profile
import ProAddForm from './Components/Projects/ProAddForm';
import WastePickForm from './Components/WasteCollect/WastePickForm';
import UserCalendar from './Components/WasteCollect/UserCalendar';
import Admin from './Pages/Admin';    // Admin Dashboard Page (Ensure this component exists)
{/* import ClientProfile from './Pages/ClientProfile';      // Client Profile Page (Ensure this component exists) */}
import AdCalendar from './Components/Admin/AdMinCalendar/AdCalendar'; // Admin's Calendar view

// --- Specific Component Imports (Used as standalone pages/sections) ---
import BOwnerHeader from './Components/BusinessOwner/BOwnerHeader';
import BSHeader from './Components/BuyandSell/BSHeader';
import LocationMap from './Components/Maps/LocationMap';
import ClientProfile from './Components/Profile/ClientProfile';
import CalendarDisplay from './Components/UserCalendar/CalendarDisplay';

// --- Main App Content Component ---
const AppContent = () => {
  // --- State ---
  const [isLoading, setIsLoading] = useState(true); // Loading state for initial auth check
  const [isLoggedIn, setIsLoggedIn] = useState(false); // User authentication status
  const [userInfo, setUserInfo] = useState(null); // Decoded user information from JWT

  // --- React Router Hooks ---
  const navigate = useNavigate();
  const location = useLocation();

  // --- Authentication Check Function ---
  // Memoized with useCallback to maintain stable identity across renders
  const checkAuthStatus = useCallback(() => {
    console.log("Running checkAuthStatus...");
    const token = localStorage.getItem('token'); // Get token from storage
    let authenticated = false;
    let currentUserInfo = null;

    if (token) {
      try {
        const decoded = jwtDecode(token); // Decode the JWT
        // Check if the token expiration time (in seconds) is in the future
        if (decoded.exp * 1000 > Date.now()) {
          authenticated = true;
          // --- Extract User Info from Token Payload ---
          // **IMPORTANT**: Adjust these fields based on the actual payload your backend sends!
          currentUserInfo = {
            id: decoded.id || null, // MongoDB _id
            name: decoded.name || decoded.ownerName || 'User', // Client name or BOwner ownerName
            email: decoded.email || null,
            userType: decoded.userType || 'unknown', // 'client' or 'bowner' from backend
            // Determine role: Check 'role' field first, then infer from 'userType' as fallback
            role: decoded.role || (decoded.userType === 'bowner' ? 'bowner' : (decoded.userType === 'client' ? 'client' : 'unknown')),
            businessName: decoded.businessName || null, // Specific to BOwner
          };
          // console.log("Token valid. User Info:", currentUserInfo);
        } else {
          // Token is expired
          console.log("Token expired.");
          localStorage.removeItem('token'); // Remove the expired token
          localStorage.removeItem('userInfo'); // Clear any stale stored user info
        }
      } catch (error) {
        // Token is invalid or corrupted
        console.error("Invalid token:", error);
        localStorage.removeItem('token'); // Remove the invalid token
        localStorage.removeItem('userInfo');
      }
    } else {
      // No token found in local storage
      // console.log("No token found.");
    }

    // Update component state
    setIsLoggedIn(authenticated);
    setUserInfo(currentUserInfo);
    // Set loading to false only after the *initial* check
    if (isLoading) {
        setIsLoading(false);
    }
  }, [isLoading]); // Dependency array includes isLoading

  // --- Effect for Initial Auth Check ---
  // Runs once on mount and whenever location changes (to re-verify auth state after navigation)
  useEffect(() => {
    checkAuthStatus();
  }, [location.key, checkAuthStatus]); // location.key changes reliably on navigation

  // --- Login Handler Callback ---
  // Passed down to the Login component
  const handleLoginSuccess = useCallback((token) => {
    console.log("handleLoginSuccess called in App.jsx");
    localStorage.setItem('token', token); // Store the fresh token

    let currentUserInfo = null;
    let defaultRedirectPath = '/'; // Default redirect path after login

    try {
        const decoded = jwtDecode(token);
        // Extract info - **ADJUST FIELDS BASED ON YOUR JWT PAYLOAD**
         currentUserInfo = {
            id: decoded.id || null,
            name: decoded.name || decoded.ownerName || 'User',
            email: decoded.email || null,
            userType: decoded.userType || 'unknown',
            role: decoded.role || (decoded.userType === 'bowner' ? 'bowner' : (decoded.userType === 'client' ? 'client' : 'unknown')),
            businessName: decoded.businessName || null,
         };
        // Optionally store basic info stringified in localStorage (token is the source of truth)
        localStorage.setItem('userInfo', JSON.stringify(currentUserInfo));

        // --- Determine Default Redirect Path Based on Role/Type ---
        if (currentUserInfo.role === 'admin') {
            defaultRedirectPath = '/Admin'; // Admin dashboard route
        } else if (currentUserInfo.userType === 'bowner') {
            defaultRedirectPath = '/BOwnerHome'; // Business owner home/profile
        } else if (currentUserInfo.userType === 'client') {
            defaultRedirectPath = '/ClientProfile'; // Client profile page (ensure component exists)
        }
        // Add more specific role/type checks if needed

    } catch (e) {
        console.error("Error decoding token on login:", e);
        localStorage.removeItem('token'); // Remove bad token if decode fails
        localStorage.removeItem('userInfo');
        // Keep defaultRedirectPath as '/' or maybe show an error
    }

    // Update application state
    setIsLoggedIn(true);
    setUserInfo(currentUserInfo);

    // --- Navigation Logic ---
    // Where was the user trying to go before being redirected to Login?
    const fromPath = location.state?.from?.pathname;
    // Redirect to original destination unless it was the login page itself, otherwise use default role-based path
    const finalRedirect = (fromPath && fromPath !== '/Login') ? fromPath : defaultRedirectPath;

    console.log(`Navigating post-login to: ${finalRedirect} (Role: ${currentUserInfo?.role}, From: ${fromPath})`);
    navigate(finalRedirect, { replace: true }); // `replace: true` prevents Login page in browser history

  }, [navigate, location.state]); // Dependencies

  // --- Logout Handler Callback ---
  // Passed down to the Navbar component
  const handleLogout = useCallback(() => {
    console.log("handleLogout called in App.jsx");
    // Clear authentication state and stored data
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setIsLoggedIn(false);
    setUserInfo(null);
    navigate('/'); // Redirect to the home page after logout
  }, [navigate]); // Dependency

  // --- Loading State ---
  // Show a spinner during the initial authentication check
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <ClipLoader size={60} color="#f97316" /> {/* Or your theme color */}
      </div>
    );
  }

  // --- Render Application Structure ---
  return (
    <div>
      {/* Render Navbar, passing authentication state and handlers */}
      <Navbar
        isLoggedIn={isLoggedIn}
        userInfo={userInfo}
        handleLogout={handleLogout}
      />

      {/* --- Define Application Routes --- */}
      <Routes>
        {/* == Public Routes == */}
        <Route path="/" element={<HomePage />} />
        <Route path="/Login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/Service" element={<Service />} />
        <Route path="/Collection" element={<Collection />} />
        <Route path="/Project" element={<Project />} />
        <Route path="/BuyandSell" element={<BuyandSell />} />
        <Route path="/BOwnerForm" element={<BOwnerForm />} />
        <Route path="/ClientForm" element={<ClientForm />} />
        <Route path="/Map" element={<Map />} />
        <Route path="/LocationMap" element={<LocationMap />} />
        <Route path="/Calculate" element={<Calculate />} />
        {/* Standalone component routes (check if they should be public/protected) */}
        <Route path="/BSHeader" element={<BSHeader />} />
        <Route path="/CalendarDisplay" element={<CalendarDisplay />} />

        {/* == Protected Routes (Require Login) == */}
        {/* Use the ProtectedRoute component to wrap elements */}

        {/* General Protected Routes (Accessible by any logged-in user type unless further restricted) */}
        <Route path="/UserCalendar" element={<ProtectedRoute><UserCalendar userInfo={userInfo} /></ProtectedRoute>} />
        <Route path="/SaleForm" element={<ProtectedRoute><SaleForm /></ProtectedRoute>} />
        <Route path="/BuyCard" element={<ProtectedRoute><BuyCard /></ProtectedRoute>} />
        <Route path="/WastePickForm" element={<ProtectedRoute><WastePickForm /></ProtectedRoute>} />

        {/* Client Specific Profile/Dashboard */}
        {/* <Route path="/ClientProfile" element={<ProtectedRoute><ClientProfile userInfo={userInfo}/></ProtectedRoute>} /> */}
        <Route path="/ClientProfile" element={<ProtectedRoute><ClientProfile /></ProtectedRoute>} />

        {/* Business Owner Specific Routes */}
        <Route path="/BOwnerHome" element={<ProtectedRoute><BOwnerHome userInfo={userInfo} /></ProtectedRoute>} />
        <Route path="/ProAddForm" element={<ProtectedRoute><ProAddForm /></ProtectedRoute>} />
        <Route path="/BOwnerHeader" element={<ProtectedRoute><BOwnerHeader /></ProtectedRoute>} />

        {/* Admin Specific Routes */}
        {/* Note: ProtectedRoute only checks login. Enhance it or add checks here/in component for role='admin' */}
        <Route path="/Admin" element={<ProtectedRoute><Admin userInfo={userInfo}/></ProtectedRoute>} />
        <Route path="/AdCalendar" element={<ProtectedRoute><AdCalendar /></ProtectedRoute>} />

        {/* == Fallback Route == */}
        {/* Redirects any unmatched URL to the home page */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>

      {/* --- Other Global Components --- */}
      <FloatingChatbot />
      <Footer />
    </div>
  );
};

// --- Root App Component ---
function App() {
  return (
    // BrowserRouter enables routing capabilities
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;