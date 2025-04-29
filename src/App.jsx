// src/App.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate, Outlet } from 'react-router-dom'; // Import Outlet
import { ClipLoader } from 'react-spinners';
import { jwtDecode } from 'jwt-decode';

// --- Core & Helper Component Imports ---
import Navbar from './Components/Navbar/Navbar'; // Standard Navbar
import Footer from './Components/Footer/Footer';
import FloatingChatbot from './Components/Chatbot/ChatBox';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminLayout from './Layouts/AdminLayout'; // Import Admin Layout

// --- Page Imports ---
import HomePage from './Pages/HomePage';
import SignUp from './Pages/SignUp';
import AboutUs from './Pages/AboutUS';
import BuyandSell from './Pages/BuyandSell';
import Login from './Components/Login/Login';
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
import BOwnerHome from './Pages/BOwnerHome';
import ProAddForm from './Components/Projects/ProAddForm';
import WastePickForm from './Components/WasteCollect/WastePickForm';
import UserCalendar from './Components/WasteCollect/UserCalendar';
import Admin from './Pages/Admin'; // Admin Dashboard Page
import AdCalendar from './Components/Admin/AdMinCalendar/AdCalendar'; // Admin's Calendar view

// --- Specific Component Imports (Used as standalone pages/sections) ---
import BOwnerHeader from './Components/BusinessOwner/BOwnerHeader';
import BSHeader from './Components/BuyandSell/BSHeader';
import LocationMap from './Components/Maps/LocationMap';
import ClientProfile from './Components/Profile/ClientProfile';
import CalendarDisplay from './Components/UserCalendar/CalendarDisplay';
import BOwnerProfile from './Components/Profile/BOwnerProfile';
import AdCheckReq from './Components/Admin/AdCheckReq/AdCheckReq';
import EmailDisplay from './Components/Admin/EmailDisplay/EmailDisplay';
import EmailListItem from './Components/Admin/EmailDisplay/EmailListItem';
import Dashboard from './Components/Admin/Dashboard/Dashboard';
import HandleBOwners from './Components/Admin/HandleBOwners/HandleBOwners';

// --- Placeholder Admin Pages (Create these components later) ---
const PlaceholderAdminPage = ({ title }) => <h2>{title}</h2>;

// --- Main App Content Component ---
const AppContent = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const checkAuthStatus = useCallback(() => {
        console.log("Running checkAuthStatus...");
        const token = localStorage.getItem('token');
        let authenticated = false;
        let currentUserInfo = null;

        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 > Date.now()) {
                    authenticated = true;
                    currentUserInfo = {
                        id: decoded.id || null,
                        name: decoded.name || decoded.ownerName || 'User',
                        email: decoded.email || null,
                        userType: decoded.userType || 'unknown',
                        // **CRITICAL**: Ensure 'role' exists in your JWT payload for admin check
                        role: decoded.role || (decoded.userType === 'bowner' ? 'bowner' : (decoded.userType === 'client' ? 'client' : 'unknown')),
                        businessName: decoded.businessName || null,
                    };
                    // console.log("Token valid. User Info:", currentUserInfo);
                } else {
                    console.log("Token expired.");
                    localStorage.removeItem('token');
                    localStorage.removeItem('userInfo');
                }
            } catch (error) {
                console.error("Invalid token:", error);
                localStorage.removeItem('token');
                localStorage.removeItem('userInfo');
            }
        }

        setIsLoggedIn(authenticated);
        setUserInfo(currentUserInfo);
        if (isLoading) {
            setIsLoading(false);
        }
    }, [isLoading]);

    useEffect(() => {
        checkAuthStatus();
    }, [location.key, checkAuthStatus]);

    const handleLoginSuccess = useCallback((token) => {
        console.log("handleLoginSuccess called in App.jsx");
        localStorage.setItem('token', token);

        let currentUserInfo = null;
        let defaultRedirectPath = '/';

        try {
            const decoded = jwtDecode(token);
            currentUserInfo = {
                id: decoded.id || null,
                name: decoded.name || decoded.ownerName || 'User',
                email: decoded.email || null,
                userType: decoded.userType || 'unknown',
                role: decoded.role || (decoded.userType === 'bowner' ? 'bowner' : (decoded.userType === 'client' ? 'client' : 'unknown')),
                businessName: decoded.businessName || null,
            };
            localStorage.setItem('userInfo', JSON.stringify(currentUserInfo));

            // --- Determine Redirect Path Based on Role ---
            if (currentUserInfo.role === 'admin') {
                 // Redirect to the main admin dashboard route
                defaultRedirectPath = '/Admin'; // Match the route defined below
            } else if (currentUserInfo.userType === 'bowner') {
                defaultRedirectPath = '/BOwnerHome';
            } else if (currentUserInfo.userType === 'client') {
                defaultRedirectPath = '/ClientProfile';
            }

        } catch (e) {
            console.error("Error decoding token on login:", e);
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
        }

        setIsLoggedIn(true);
        setUserInfo(currentUserInfo);

        const fromPath = location.state?.from?.pathname;
        const finalRedirect = (fromPath && fromPath !== '/Login') ? fromPath : defaultRedirectPath;

        console.log(`Navigating post-login to: ${finalRedirect} (Role: ${currentUserInfo?.role}, From: ${fromPath})`);
        navigate(finalRedirect, { replace: true });

    }, [navigate, location.state]);

    const handleLogout = useCallback(() => {
        console.log("handleLogout called in App.jsx");
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        setIsLoggedIn(false);
        setUserInfo(null);
        navigate('/');
    }, [navigate]);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <ClipLoader size={60} color="#f97316" />
            </div>
        );
    }

    // Determine if the current user is an admin
    const isAdmin = isLoggedIn && userInfo?.role === 'admin';

    return (
        // The main div wraps everything
        <div>
            {/* Conditionally render Navbar only if NOT admin */}
            {!isAdmin && (
                <Navbar
                    isLoggedIn={isLoggedIn}
                    userInfo={userInfo}
                    handleLogout={handleLogout}
                />
            )}

            {/* --- Define Application Routes --- */}
            <Routes>
                {/* == Public Routes (No Layout or Default Layout) == */}
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
                <Route path="/BSHeader" element={<BSHeader />} />
                <Route path="/CalendarDisplay" element={<CalendarDisplay />} />

                {/* == General Protected Routes (Any logged-in user, NOT admin layout) == */}
                <Route path="/UserCalendar" element={<ProtectedRoute><UserCalendar userInfo={userInfo} /></ProtectedRoute>} />
                <Route path="/SaleForm" element={<ProtectedRoute><SaleForm /></ProtectedRoute>} />
                <Route path="/BuyCard" element={<ProtectedRoute><BuyCard /></ProtectedRoute>} />
                <Route path="/WastePickForm" element={<ProtectedRoute><WastePickForm /></ProtectedRoute>} />
                <Route path="/ClientProfile" element={<ProtectedRoute><ClientProfile /></ProtectedRoute>} /> {/* Removed userInfo prop, component likely fetches its own data */}
                <Route path="/BOwnerHome" element={<ProtectedRoute><BOwnerHome userInfo={userInfo} /></ProtectedRoute>} />
                <Route path="/ProAddForm" element={<ProtectedRoute><ProAddForm /></ProtectedRoute>} />
                <Route path="/BOwnerHeader" element={<ProtectedRoute><BOwnerHeader /></ProtectedRoute>} />
                <Route path="/BOwnerProfile" element={<ProtectedRoute><BOwnerProfile /></ProtectedRoute>} />

                 <Route
                    element={
                        <ProtectedRoute requiredRole="admin">
                            {/* Pass handleLogout to the layout, which passes it to AdNav */}
                            <AdminLayout handleLogout={handleLogout} />
                        </ProtectedRoute>
                    }
                >
                    {/* Child routes render inside AdminLayout's <Outlet /> */}
                    {/* Ensure paths match the <Link to="..."> paths in AdNav.jsx */}
                    <Route path="/Admin" element={<Admin userInfo={userInfo} />} /> {/* Admin Dashboard */}
                    <Route path="/AdCalendar" element={<AdCalendar />} /> 
                    <Route path="/AdCheckReq" element={<AdCheckReq />} />   
                    <Route path="/EmailDisplay" element={<EmailDisplay />} />  
                    <Route path="/EmailListItem" element={<EmailListItem />} /> 
                    <Route path="/DashBoard" element={<Dashboard />} />
                    <Route path="/HandleBOwners" element={<HandleBOwners />} />

            
                </Route>

                {/* == Fallback Route == */}
                <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>

            {/* Conditionally render Footer only if NOT admin */}
            {!isAdmin && <Footer />}

            {/* Keep Chatbot globally? Or disable for admin? */}
            <FloatingChatbot />
        </div>
    );
};

// --- Root App Component ---
function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;