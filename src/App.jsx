// src/App.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { jwtDecode } from 'jwt-decode';

// --- Core Components ---
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminLayout from './Layouts/AdminLayout';

// --- Public Pages ---
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

// --- Protected Pages ---
import SaleForm from './Components/SaleForm/SaleForm';
import BuyCard from './Components/BuyCard/BuyCard';
import BOwnerHome from './Pages/BOwnerHome';
import ProAddForm from './Components/Projects/ProAddForm';
import WastePickForm from './Components/WasteCollect/WastePickForm';
import UserCalendar from './Components/WasteCollect/UserCalendar';
import Admin from './Pages/Admin';
import AdCalendar from './Components/Admin/AdMinCalendar/AdCalendar';
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

const AppContent = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const checkAuthStatus = useCallback(() => {
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
                        role: decoded.role || (decoded.userType === 'bowner' ? 'bowner' : (decoded.userType === 'client' ? 'client' : 'unknown')),
                        businessName: decoded.businessName || null,
                    };
                } else {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userInfo');
                }
            } catch {
                localStorage.removeItem('token');
                localStorage.removeItem('userInfo');
            }
        }

        setIsLoggedIn(authenticated);
        setUserInfo(currentUserInfo);
        if (isLoading) setIsLoading(false);
    }, [isLoading]);

    useEffect(() => {
        checkAuthStatus();
    }, [location.key, checkAuthStatus]);

    const handleLoginSuccess = useCallback((token) => {
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

            if (currentUserInfo.role === 'admin') {
                defaultRedirectPath = '/Admin';
            } else if (currentUserInfo.userType === 'bowner') {
                defaultRedirectPath = '/BOwnerHome';
            } else if (currentUserInfo.userType === 'client') {
                defaultRedirectPath = '/ClientProfile';
            }

        } catch {
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
        }

        setIsLoggedIn(true);
        setUserInfo(currentUserInfo);

        const fromPath = location.state?.from?.pathname;
        const finalRedirect = (fromPath && fromPath !== '/Login') ? fromPath : defaultRedirectPath;
        navigate(finalRedirect, { replace: true });
    }, [navigate, location.state]);

    const handleLogout = useCallback(() => {
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

    const isAdmin = isLoggedIn && userInfo?.role === 'admin';

    return (
        <div>
            {!isAdmin && (
                <Navbar isLoggedIn={isLoggedIn} userInfo={userInfo} handleLogout={handleLogout} />
            )}

            <Routes>
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

                {/* Protected Routes */}
                <Route path="/UserCalendar" element={<ProtectedRoute><UserCalendar userInfo={userInfo} /></ProtectedRoute>} />
                <Route path="/SaleForm" element={<ProtectedRoute><SaleForm /></ProtectedRoute>} />
                <Route path="/BuyCard" element={<ProtectedRoute><BuyCard /></ProtectedRoute>} />
                <Route path="/WastePickForm" element={<ProtectedRoute><WastePickForm /></ProtectedRoute>} />
                <Route path="/ClientProfile" element={<ProtectedRoute><ClientProfile /></ProtectedRoute>} />
                <Route path="/BOwnerHome" element={<ProtectedRoute><BOwnerHome userInfo={userInfo} /></ProtectedRoute>} />
                <Route path="/ProAddForm" element={<ProtectedRoute><ProAddForm /></ProtectedRoute>} />
                <Route path="/BOwnerHeader" element={<ProtectedRoute><BOwnerHeader /></ProtectedRoute>} />
                <Route path="/BOwnerProfile" element={<ProtectedRoute><BOwnerProfile /></ProtectedRoute>} />

                {/* Admin Layout + Nested Admin Routes */}
                <Route
                    element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminLayout handleLogout={handleLogout} />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/Admin" element={<Admin userInfo={userInfo} />} />
                    <Route path="/AdCalendar" element={<AdCalendar />} />
                    <Route path="/AdCheckReq" element={<AdCheckReq />} />
                    <Route path="/EmailDisplay" element={<EmailDisplay />} />
                    <Route path="/EmailListItem" element={<EmailListItem />} />
                    <Route path="/DashBoard" element={<Dashboard />} />
                    <Route path="/HandleBOwners" element={<HandleBOwners />} />
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {!isAdmin && <Footer />}
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
