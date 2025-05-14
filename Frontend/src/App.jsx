// Frontend/src/App.jsx

// ... (all imports and App function including parseUserInfoFromToken, useState, useCallback, useEffects for auth as before) ...
// MAKE SURE ALL YOUR IMPORTS AT THE TOP ARE CORRECT FOR YOUR FILE STRUCTURE

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    BrowserRouter as Router, Routes, Route, useNavigate,
    useLocation, Navigate, Outlet, Link
} from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { jwtDecode } from 'jwt-decode';

import { AuthContext, useAuth } from './context/AuthContext';

import Navbar from './Components/Navbar/Navbar';
import Footer1 from './Components/Footer1/Footer';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminLayout from './Layouts/AdminLayout';

import HomePage from './Pages/HomePage';
import SignUp from './Pages/SignUp';
import AboutUs from './Pages/AboutUS';
import BuyandSell from './Pages/BuyandSell';
import Project from './Pages/Project';
import Collection from './Pages/Collection';
import Service from './Pages/Service';
import Map from './Pages/Map';
import ContactUs from './Pages/ContactUs';
import UnauthorizedPage from './Pages/UnauthorizedPage';

import Login from './Components/Login/Login';
import BOwnerForm from './Components/RegistrationForm/BOwnerForm';
import ClientForm from './Components/RegistrationForm/ClientForm';

import Calculate from './Components/Calculate/Calculate';
import SaleForm from './Components/SaleForm/SaleForm';
import BuyCard from './Components/BuyCard/BuyCard';
import ProAddForm from './Components/Projects/ProAddForm';
import WastePickForm from './Components/WasteCollect/WastePickForm';
import UserCalendar from './Components/WasteCollect/UserCalendar';
import LocationMap from './Components/Maps/LocationMap';
import CalendarDisplay from './Components/UserCalendar/CalendarDisplay';
import BSHeader from './Components/BuyandSell/BSHeader';

import BOwnerHome from './Pages/BOwnerHome';
import ClientProfile from './Components/Profile/ClientProfile';
import BOwnerProfile from './Components/Profile/BOwnerProfile';
import ClientEmail from './Components/Profile/ClientEmail';
import PickupReq from './Components/Profile/PickupReq';
import CheckBuySell from './Components/Profile/CheckBuySell';

import AdCalendar from './Components/Admin/AdMinCalendar/AdCalendar';
import AdCheckReq from './Components/Admin/AdCheckReq/AdCheckReq';
import EmailDisplay from './Components/Admin/EmailDisplay/EmailDisplay';
import Dashboard from './Components/Admin/Dashboard/Dashboard';
import HandleBOwners from './Components/Admin/HandleBOwners/HandleBOwners';
import DisReview from './Components/Admin/DisReview/DisReview';
import AdScrap from './Components/Admin/AdScrap/AdScrap';

const parseUserInfoFromToken = (token) => {
    if (!token) return null;
    try {
        const decoded = jwtDecode(token);
        if (!decoded || typeof decoded !== 'object' || !decoded.exp) {
            localStorage.removeItem('token'); localStorage.removeItem('userInfo'); return null;
        }
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
            localStorage.removeItem('token'); localStorage.removeItem('userInfo'); return null;
        }
        if (!decoded.id || !decoded.email || !decoded.role || typeof decoded.name === 'undefined') {
            localStorage.removeItem('token'); localStorage.removeItem('userInfo'); return null;
        }
        return {
            id: decoded.id, name: decoded.name, email: decoded.email, role: decoded.role,
            ...(decoded.role === 'businessOwner' && decoded.businessName && { businessName: decoded.businessName }),
        };
    } catch (error) {
        localStorage.removeItem('token'); localStorage.removeItem('userInfo'); return null;
    }
};

function App() {
    const [authState, setAuthState] = useState({ isLoggedIn: false, userInfo: null, isLoading: true });
    const [logoutMessage, setLogoutMessage] = useState('');
    const navigateRef = useRef(null);

    const handleLogout = useCallback((message = "You have been logged out.") => {
        localStorage.removeItem("token"); localStorage.removeItem("userInfo");
        setAuthState({ isLoggedIn: false, userInfo: null, isLoading: false });
        setLogoutMessage(message);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const parsedUser = parseUserInfoFromToken(token);
        if (parsedUser) {
            if (JSON.stringify(parsedUser) !== localStorage.getItem('userInfo')) {
                localStorage.setItem('userInfo', JSON.stringify(parsedUser));
            }
            setAuthState({ isLoggedIn: true, userInfo: parsedUser, isLoading: false });
        } else {
            if (localStorage.getItem('token') || localStorage.getItem('userInfo')) {
                localStorage.removeItem('token'); localStorage.removeItem('userInfo');
            }
            setAuthState({ isLoggedIn: false, userInfo: null, isLoading: false });
        }
        const handleStorageChange = (event) => {
             if (event.key === 'token' || event.key === 'userInfo') {
                 const currentToken = localStorage.getItem('token');
                 const currentUserInfo = parseUserInfoFromToken(currentToken);
                 setAuthState(prevState => {
                    const newStateIsLoggedIn = !!currentUserInfo;
                    if (prevState.isLoggedIn !== newStateIsLoggedIn || JSON.stringify(prevState.userInfo) !== JSON.stringify(currentUserInfo)) {
                        if (currentUserInfo && JSON.stringify(currentUserInfo) !== localStorage.getItem('userInfo')) {
                             localStorage.setItem('userInfo', JSON.stringify(currentUserInfo));
                        } else if (!currentUserInfo) {
                             localStorage.removeItem('userInfo');
                        }
                        return { isLoading: false, isLoggedIn: newStateIsLoggedIn, userInfo: currentUserInfo };
                    }
                    return { ...prevState, isLoading: false };
                });
             }
         };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleLoginSuccess = useCallback((token, backendUserData) => {
        const parsedUser = parseUserInfoFromToken(token);
        if (parsedUser) {
            localStorage.setItem('token', token);
            localStorage.setItem('userInfo', JSON.stringify(parsedUser));
            setAuthState({ isLoggedIn: true, userInfo: parsedUser, isLoading: false });
            setLogoutMessage('');
        } else {
            handleLogout("Login failed due to invalid session data. Please try again.");
        }
    }, [handleLogout]);

    useEffect(() => {
        const handleAuthErrorEvent = (event) => {
            setAuthState(currentState => {
                if (currentState.isLoggedIn) {
                    const message = event.detail?.message || 'Your session has expired or is invalid. Please log in again.';
                    handleLogout(message);
                }
                return currentState.isLoggedIn ? currentState : { ...currentState, isLoading: false };
            });
        };
        window.addEventListener('auth-error-401', handleAuthErrorEvent);
        return () => window.removeEventListener('auth-error-401', handleAuthErrorEvent);
    }, [handleLogout]);

    if (authState.isLoading) {
        return ( 
            <div className="app-loading-container"> 
                <ClipLoader size={70} color="#f97316" />
                <p className="app-loading-text">Loading Application...</p>
            </div> 
        );
    }

    return (
        <AuthContext.Provider value={{ ...authState, logout: handleLogout, login: handleLoginSuccess }}>
            <Router>
                <AppContentWrapper
                    logoutMessage={logoutMessage}
                    setLogoutMessage={setLogoutMessage}
                    navigateRef={navigateRef}
                />
            </Router>
        </AuthContext.Provider>
    );
}


// ====================================================================
// AppContentWrapper - with INLINE STYLES for logout message popup
// ====================================================================
function AppContentWrapper({ logoutMessage, setLogoutMessage, navigateRef }) {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useAuth();

    useEffect(() => { if (navigateRef) navigateRef.current = navigate; return () => { if (navigateRef) navigateRef.current = null; }; }, [navigate, navigateRef]);

    useEffect(() => {
        const currentPath = location.pathname.toLowerCase();
        const isLoginPage = currentPath === '/login';
        if (auth.isLoggedIn && auth.userInfo && isLoginPage) {
            let redirectPath = '/';
            switch (auth.userInfo.role) {
                case 'admin': redirectPath = '/Admin/Dashboard'; break;
                case 'client': redirectPath = '/ClientProfile'; break;
                case 'businessOwner': redirectPath = '/BOwnerHome'; break;
                default: redirectPath = '/';
            }
            const fromPath = location.state?.from?.pathname;
            const destination = (fromPath && !['/login', '/'].includes(fromPath.toLowerCase())) ? fromPath : redirectPath;
            navigate(destination, { replace: true, state: {} });
        }
    }, [auth.isLoggedIn, auth.userInfo, navigate, location]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const msgParam = params.get('logoutMessage');
        if (msgParam) {
            const decodedMsg = decodeURIComponent(msgParam);
            if (decodedMsg !== logoutMessage) {
                setLogoutMessage(decodedMsg);
            }
            const newUrl = location.pathname;
            window.history.replaceState({}, document.title, newUrl);
        }
    }, [location.search, location.pathname, logoutMessage, setLogoutMessage]);

    useEffect(() => {
        const currentPath = location.pathname.toLowerCase();
        const isLoginPage = currentPath === '/login';
        if (logoutMessage && !isLoginPage && !auth.isLoggedIn) {
            navigate(`/login`, { replace: true, state: { logoutMessage: logoutMessage } });
        }
    }, [logoutMessage, location.pathname, navigate, auth.isLoggedIn]);

    // --- Inline styles for the logout message popup ---
    const popupStyle = {
        position: 'fixed', // Or 'absolute' depending on desired behavior relative to scroll
        top: '20px',       // Distance from the top
        left: '50%',
        transform: 'translateX(-50%)', // Center horizontally
        padding: '15px 25px',
        backgroundColor: '#fff3cd', // A light yellow, typical for warnings
        color: '#856404',          // Dark yellow/brown text
        border: '1px solid #ffeeba',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: 1050, // Ensure it's above most other content
        textAlign: 'center',
        maxWidth: '90%',
        width: 'auto', // Adjusts to content
        minWidth: '300px', // Minimum width
        display: 'flex', // For aligning text and close button
        alignItems: 'center',
        justifyContent: 'space-between', // Puts text left, button right
    };

    const closeButtonStyle = {
        background: 'none',
        border: 'none',
        color: '#856404', // Same as text for consistency
        fontSize: '1.5rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        padding: '0 0.5rem',
        marginLeft: '15px',
        lineHeight: '1',
    };
    // --- End of inline styles ---

    return (
        <div className="App-wrapper"> {/* Changed from "App" to avoid potential style conflicts if App.css targets .App */}
            <Navbar isLoggedIn={auth.isLoggedIn} userInfo={auth.userInfo} handleLogout={auth.logout} />
            
            {logoutMessage && (location.pathname.toLowerCase() === '/login') && (
                 <div 
                    style={popupStyle} // Apply inline styles here
                    role="alert"
                 >
                    <span>{logoutMessage}</span>
                    <button 
                        onClick={() => setLogoutMessage('')} 
                        title="Dismiss message"
                        style={closeButtonStyle} // Apply inline styles here
                        aria-label="Close message"
                    >
                        × {/* HTML entity for 'x' or close symbol */}
                    </button>
                 </div>
            )}
            <main className="main-content"> 
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/AboutUs" element={<AboutUs />} />
                    <Route path="/Service" element={<Service />} />
                    <Route path="/Collection" element={<Collection />} />
                    <Route path="/Project" element={<Project />} />
                    <Route path="/BuyandSell" element={<BuyandSell />} />
                    <Route path="/Map" element={<Map />} />
                    <Route path="/Calculate" element={<Calculate />} />
                    <Route path="/ContactUs" element={<ContactUs />} />
                    <Route path="/SignUp" element={<SignUp />} />
                    <Route path="/BOwnerForm" element={<BOwnerForm />} />
                    <Route path="/ClientForm" element={<ClientForm />} />
                    <Route path="/CalendarDisplay" element={<CalendarDisplay />} />
                    <Route path="/BSHeader" element={<BSHeader />} />
                    <Route path="/unauthorized" element={<UnauthorizedPage />} />

                    {/* Login Route */}
                    <Route path="/Login" element={ auth.isLoggedIn && auth.userInfo ? (<Navigate to={ (auth.userInfo.role === 'admin' && '/Admin/Dashboard') || (auth.userInfo.role === 'client' && '/ClientProfile') || (auth.userInfo.role === 'businessOwner' && '/BOwnerHome') || '/' } replace /> ) : ( <Login /> )} />
                    
                    {/* Protected Client Routes */}
                    <Route element={<ProtectedRoute requiredRole="client" />}>
                        <Route path="/UserCalendar" element={<UserCalendar userInfo={auth.userInfo} />} />
                        <Route path="/ClientProfile" element={<ClientProfile />} />
                        <Route path="/PickupReq" element={<PickupReq />} />
                        <Route path="/CheckBuySell" element={<CheckBuySell />} />
                        <Route path="/ClientEmail" element={<ClientEmail />} />
                        <Route path="/BuyCard" element={<BuyCard />} />
                        <Route path="/WastePickForm" element={<WastePickForm />} />
                        <Route path="/LocationMap" element={<LocationMap />} />
                    </Route>

                    {/* Protected Business Owner Routes */}
                    <Route element={<ProtectedRoute requiredRole="businessOwner" />}>
                         <Route path="/BOwnerHome" element={<BOwnerHome userInfo={auth.userInfo} />} />
                         <Route path="/BusinessDashboard" element={<Navigate to="/BOwnerHome" replace />} />
                         <Route path="/BOwnerProfile" element={<BOwnerProfile />} />
                         <Route path="/ProAddForm" element={<ProAddForm />} />
                         <Route path="/SaleForm" element={<SaleForm />} />
                    </Route>

                     {/* Protected Admin Routes */}
                     <Route element={<ProtectedRoute requiredRole="admin" />}>
                        <Route element={<AdminLayout handleLogout={auth.logout} userInfo={auth.userInfo} />}>
                           <Route path="/Admin" element={<Navigate to="/Admin/Dashboard" replace />} /> 
                           <Route path="/Admin/Dashboard" element={<Dashboard />} />
                           <Route path="/Admin/Calendar" element={<AdCalendar />} /> 
                           <Route path="/Admin/Requests" element={<AdCheckReq />} />
                           <Route path="/Admin/Scrap" element={<AdScrap />} />
                           <Route path="/Admin/Emails" element={<EmailDisplay />} />
                           <Route path="/Admin/ManageOwners" element={<HandleBOwners />} />
                           <Route path="/Admin/Reviews" element={<DisReview />} />
                        </Route>
                     </Route>

                    {/* Fallback for unmatched routes */}
                    <Route path="*" element={ 
                        <div className="page-not-found-container">
                            <h1 className="page-not-found-title">404 - Page Not Found</h1>
                            <p className="page-not-found-message">The page you are looking for does not exist.</p>
                            <Link to="/" className="page-not-found-link">Go to Homepage</Link>
                        </div>
                    } />
                </Routes>
            </main>
            <Footer1 />
        </div>
    );
}

export default App;