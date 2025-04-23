import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { jwtDecode } from 'jwt-decode';
import Navbar from './Components/Navbar/Navbar';
import HomePage from './Pages/HomePage';
import Footer from './Components/Footer/Footer';
import SignUp from './Pages/SignUp';
import AboutUs from './Pages/AboutUS';
import BuyandSell from './Pages/BuyandSell';
import SaleForm from './Components/SaleForm/SaleForm';
import Login from './Components/Login/Login'; 
import BuyCard from './Components/BuyCard/BuyCard';
import BOwnerForm from './Components/RegistrationForm/BOwnerForm';
import ClientForm from './Components/RegistrationForm/ClientForm';
import BOwnerHome from './Pages/BOwnerHome';
import BOwnerHeader from './Components/BusinessOwner/BOwnerHeader';
import Project from './Pages/Project';
import Collection from './Pages/Collection';
import ProAddForm from './Components/Projects/ProAddForm';
import Service from './Pages/Service';
import WastePickForm from './Components/WasteCollect/WastePickForm';
import BSHeader from './Components/BuyandSell/BSHeader';
import UserCalendar from './Components/WasteCollect/UserCalendar'; 
import Admin from './Pages/Admin';
import Map from './Pages/Map';
import LocationMap from './Components/Maps/LocationMap';
import Calculate from './Components/Calculate/Calculate';
import AdCalendar from './Components/Admin/AdMinCalendar/AdCalendar';
import FloatingChatbot from './Components/Chatbot/ChatBox';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';

const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null); // Optional: Store user ID
  const navigate = useNavigate();
  const location = useLocation();

  // Check token validity on initial load and location change
  useEffect(() => {
    console.log("AppContent Effect: Checking token...");
    const token = localStorage.getItem('token');
    let authenticated = false;
    let currentUserId = null;

    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded Token:", decoded); // Log decoded token
        if (decoded.exp > Date.now() / 1000) {
          authenticated = true;
          // Assuming your JWT payload has user ID in 'id' or 'userId' field
          currentUserId = decoded.id || decoded.userId || null;
          console.log("Token valid, User ID:", currentUserId);
        } else {
          console.log("Token expired.");
          handleLogout(false); // Logout without navigating immediately if needed elsewhere
        }
      } catch (error) {
        console.error("Token decode/check error:", error);
        handleLogout(false); // Logout without navigating immediately
      }
    } else {
        console.log("No token found.");
    }

    setIsLoggedIn(authenticated);
    setUserId(currentUserId); // Set the user ID state

     // Only run the loading indicator once on initial mount
     const timer = setTimeout(() => setIsLoading(false), 800); // Slightly shorter delay
     return () => clearTimeout(timer);

  // Re-run check when location changes, useful after login/logout actions trigger navigation
  }, [location.key]); // Use location.key to re-trigger on navigation


  const handleLoginSuccess = (token) => {
    console.log("handleLoginSuccess called");
    localStorage.setItem('token', token);
    try {
        const decoded = jwtDecode(token);
        const currentUserId = decoded.id || decoded.userId || null;
        setUserId(currentUserId); // Set user ID on login
         if (currentUserId) {
            localStorage.setItem('userId', currentUserId); // Store userId too if needed elsewhere
         }
    } catch (e) { console.error("Error decoding token on login:", e); }
    setIsLoggedIn(true);
    // Redirect back to the page the user was trying to access, or default to '/'
    const from = location.state?.from?.pathname || '/';
    console.log("Navigating to:", from);
    navigate(from, { replace: true });
  };

  // Updated handleLogout to accept navigation flag
  const handleLogout = (shouldNavigate = true) => {
    console.log("handleLogout called, navigate:", shouldNavigate);
    localStorage.removeItem('token');
    localStorage.removeItem('userId'); // Remove user ID on logout
    setIsLoggedIn(false);
    setUserId(null);
    if (shouldNavigate) {
        navigate('/'); // Navigate to home page on manual logout
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <ClipLoader size={60} color="#f97316" /> {/* Use accent color */}
      </div>
    );
  }

  return (
    <div>
      {/* Pass userId to Navbar if it needs it */}
      <Navbar isLoggedIn={isLoggedIn} handleLogout={() => handleLogout(true)} /* Pass true to navigate on Navbar logout */ />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/BuyandSell" element={<BuyandSell />} />
         {/* Pass handleLoginSuccess to the Login component */}
        <Route path="/Login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/BOwnerForm" element={<BOwnerForm />} />
        <Route path="/ClientForm" element={<ClientForm />} />
        <Route path="/Project" element={<Project />} />
        <Route path="/Collection" element={<Collection />} />
        <Route path="/Service" element={<Service />} />
        <Route path="/BSHeader" element={<BSHeader />} />
        <Route path="/Map" element={<Map />} />
        <Route path="/LocationMap" element={<LocationMap />} />
        <Route path="/Calculate" element={<Calculate />} />
        <Route path="/ProtectedRoute" element={<ProtectedRoute />} />

        {/* Protected Routes */}
        <Route path="/SaleForm" element={<ProtectedRoute><SaleForm /></ProtectedRoute>} />
        <Route path="/BuyCard" element={<ProtectedRoute><BuyCard /></ProtectedRoute>} />
        <Route path="/ProAddForm" element={<ProtectedRoute><ProAddForm /></ProtectedRoute>} />
        <Route path="/BOwnerHome" element={<ProtectedRoute><BOwnerHome /></ProtectedRoute>} />
        <Route path="/WastePickForm" element={<ProtectedRoute><WastePickForm /></ProtectedRoute>} />
        <Route path="/BOwnerHeader" element={<ProtectedRoute><BOwnerHeader /></ProtectedRoute>} />
        <Route path="/UserCalendar" element={
            <ProtectedRoute>
              {/* Pass userId or other props if UserCalendar needs them */}
              <UserCalendar userId={userId} />
            </ProtectedRoute>
          } />
        <Route path="/Admin" element={<ProtectedRoute>{/* Add Role Check Here if Needed */}<Admin /></ProtectedRoute>} />
        <Route path="/AdCalendar" element={<ProtectedRoute>{/* Add Role Check Here if Needed */}<AdCalendar /></ProtectedRoute>} />

         {/* Fallback Route - Optional */}
         <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
      <FloatingChatbot />
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;