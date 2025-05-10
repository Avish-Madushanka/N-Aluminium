// src/App.jsx
// FINAL CONSOLIDATED VERSION (Reflecting Admin Layout Structure)

import React, { useState, useEffect, useCallback, createContext, useContext, useRef } from 'react';
import {
    BrowserRouter as Router, Routes, Route, useNavigate,
    useLocation, Navigate, Outlet, Link
} from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { jwtDecode } from 'jwt-decode';

// --- Context ---
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext); // Hook to consume auth context

// --- Core Layout & Routing Components ---
import Navbar from './Components/Navbar/Navbar';
import Footer1 from './Components/Footer1/Footer';
import ProtectedRoute from './routes/ProtectedRoute'; // Needs correct implementation using useAuth
import AdminLayout from './Layouts/AdminLayout';       // Renders AdNav + Outlet

// --- Page Components (Verify ALL import paths) ---
// Public Pages
import HomePage from './Pages/HomePage';
import SignUp from './Pages/SignUp';
import AboutUs from './Pages/AboutUS';
import BuyandSell from './Pages/BuyandSell';
import Project from './Pages/Project';
import Collection from './Pages/Collection';
import Service from './Pages/Service';
import Map from './Pages/Map';
import ContactUs from './Pages/ContactUs';
import Login from './Components/Login/Login';
import BOwnerForm from './Components/RegistrationForm/BOwnerForm';
import ClientForm from './Components/RegistrationForm/ClientForm';

// Functional Components
import Calculate from './Components/Calculate/Calculate';
import SaleForm from './Components/SaleForm/SaleForm';
import BuyCard from './Components/BuyCard/BuyCard';
import ProAddForm from './Components/Projects/ProAddForm';
import WastePickForm from './Components/WasteCollect/WastePickForm';
import UserCalendar from './Components/WasteCollect/UserCalendar';
import LocationMap from './Components/Maps/LocationMap';
import CalendarDisplay from './Components/UserCalendar/CalendarDisplay';

// Role-Specific Dashboards / Profiles
import BOwnerHome from './Pages/BOwnerHome';
import ClientProfile from './Components/Profile/ClientProfile';
import BOwnerProfile from './Components/Profile/BOwnerProfile';
import ClientEmail from './Components/Profile/ClientEmail';
import PickupReq from './Components/Profile/PickupReq';
import CheckBuySell from './Components/Profile/CheckBuySell';

// Admin Pages / Components
import AdCalendar from './Components/Admin/AdMinCalendar/AdCalendar';
import AdCheckReq from './Components/Admin/AdCheckReq/AdCheckReq';
import EmailDisplay from './Components/Admin/EmailDisplay/EmailDisplay';
import Dashboard from './Components/Admin/Dashboard/Dashboard'; // Admin Dashboard
import HandleBOwners from './Components/Admin/HandleBOwners/HandleBOwners';
import DisReview from './Components/Admin/DisReview/DisReview';

// --- Helper: Parse and Validate JWT ---
const parseUserInfoFromToken = (token) => {
    if (!token) return null;
    try {
        const decoded = jwtDecode(token);
        if (!decoded || typeof decoded !== 'object') {
             console.error("[parseUserInfo] Invalid token structure.");
             localStorage.removeItem('token'); localStorage.removeItem('userInfo'); return null;
        }
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
            console.warn("[parseUserInfo] Token expired.");
            localStorage.removeItem('token'); localStorage.removeItem('userInfo'); return null;
        }
        if (!decoded.id || !decoded.email || !decoded.role || !decoded.name) {
            console.error("[parseUserInfo] Token missing essential fields.", decoded);
             localStorage.removeItem('token'); localStorage.removeItem('userInfo'); return null;
        }
        console.log("[parseUserInfo] Token valid. Role:", decoded.role);
        return {
            id: decoded.id, name: decoded.name, email: decoded.email, role: decoded.role,
            ...(decoded.role === 'businessOwner' && decoded.businessName && { businessName: decoded.businessName }),
        };
    } catch (error) {
        console.error("[parseUserInfo] Error decoding:", error);
        localStorage.removeItem('token'); localStorage.removeItem('userInfo'); return null;
    }
};

// --- Root App Component ---
function App() {
    const [authState, setAuthState] = useState({
        isLoggedIn: false, userInfo: null, isLoading: true,
    });
    const [logoutMessage, setLogoutMessage] = useState('');
    const navigateRef = useRef(null);

    // --- Logout Handler ---
    const handleLogout = useCallback((message = "You have been logged out.") => {
        console.log(`[App] handleLogout. Message: "${message}"`);
        localStorage.removeItem("token"); localStorage.removeItem("userInfo");
        setAuthState({ isLoggedIn: false, userInfo: null, isLoading: false });
        setLogoutMessage(message);
    }, []);

    // --- Initial Auth Check ---
    useEffect(() => {
        console.log("[App CheckAuth] Running initial check...");
        const token = localStorage.getItem('token');
        const parsedUser = parseUserInfoFromToken(token);
        if (parsedUser) {
            console.log("[App CheckAuth] Valid session found.", parsedUser);
            const storedUserInfo = localStorage.getItem('userInfo');
            if (JSON.stringify(parsedUser) !== storedUserInfo) {
                localStorage.setItem('userInfo', JSON.stringify(parsedUser));
            }
            setAuthState({ isLoggedIn: true, userInfo: parsedUser, isLoading: false });
        } else {
            console.log("[App CheckAuth] No valid session.");
            if (authState.isLoggedIn || localStorage.getItem('token') || localStorage.getItem('userInfo')) {
                localStorage.removeItem('token'); localStorage.removeItem('userInfo');
            }
            setAuthState({ isLoggedIn: false, userInfo: null, isLoading: false });
        }
        // Storage listener setup (remains the same as previous version)
         const handleStorageChange = (event) => { /* ... (as before) ... */
            if (event.key === 'token' || event.key === 'userInfo') {
                 console.log(`[App Storage Listener] Storage changed ('${event.key}'). Re-validating auth.`);
                 const currentToken = localStorage.getItem('token');
                 const currentUserInfo = parseUserInfoFromToken(currentToken);
                 setAuthState(prevState => { /* ... (update logic as before) ... */
                    const newStateIsLoggedIn = !!currentUserInfo;
                    if (prevState.isLoggedIn !== newStateIsLoggedIn || JSON.stringify(prevState.userInfo) !== JSON.stringify(currentUserInfo)) {
                         console.log("[App Storage Listener] Auth state updated.");
                         if (currentUserInfo && JSON.stringify(currentUserInfo) !== localStorage.getItem('userInfo')) localStorage.setItem('userInfo', JSON.stringify(currentUserInfo));
                         else if (!currentUserInfo) localStorage.removeItem('userInfo');
                         return { isLoading: false, isLoggedIn: newStateIsLoggedIn, userInfo: currentUserInfo };
                    }
                    return prevState;
                 });
             }
         };
         window.addEventListener('storage', handleStorageChange);
         return () => window.removeEventListener('storage', handleStorageChange);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- Login Success Handler ---
    const handleLoginSuccess = useCallback((token, backendUserData) => {
        console.log('[App] handleLoginSuccess.');
        const parsedUser = parseUserInfoFromToken(token);
        if (parsedUser) {
            console.log('%c[App] Login OK. Updating AuthState.', 'color: green; font-weight: bold;', parsedUser);
            localStorage.setItem('token', token);
            localStorage.setItem('userInfo', JSON.stringify(parsedUser));
            setAuthState({ isLoggedIn: true, userInfo: parsedUser, isLoading: false });
            setLogoutMessage('');
        } else {
            console.error("[App] Login token invalid after successful login!");
            handleLogout("Login failed: Invalid session data.");
        }
    }, [handleLogout]);

    // --- Global 401 Listener ---
    useEffect(() => {
        const handleAuthErrorEvent = (event) => {
            setAuthState(currentState => {
                if (currentState.isLoggedIn) {
                    console.warn('[App] Global 401 listener: Triggering logout.');
                    const message = event.detail?.message || 'Session expired/invalid.';
                    handleLogout(message);
                    return { isLoggedIn: false, userInfo: null, isLoading: false };
                }
                return currentState;
            });
        };
        window.addEventListener('auth-error-401', handleAuthErrorEvent);
        return () => window.removeEventListener('auth-error-401', handleAuthErrorEvent);
    }, [handleLogout]);

    // --- Loading Screen ---
    if (authState.isLoading) {
        return ( <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}> <ClipLoader size={60} color="#f97316" /> </div> );
    }

    // --- Render App ---
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


// --- App Content Wrapper Component ---
function AppContentWrapper({ logoutMessage, setLogoutMessage, navigateRef }) {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useAuth();

    useEffect(() => { navigateRef.current = navigate; return () => { navigateRef.current = null; }; }, [navigate, navigateRef]);

    // --- Effect for Post-Login Redirect ---
    useEffect(() => {
        if (auth.isLoggedIn && auth.userInfo && location.pathname.toLowerCase() === '/login') {
            const fromPath = location.state?.from?.pathname;
            let redirectPath = '/';
            // *** Verify these role strings match your backend exactly ***
            if (auth.userInfo.role === 'admin') redirectPath = '/Admin/Dashboard';
            else if (auth.userInfo.role === 'client') redirectPath = '/ClientProfile'; // Or '/' maybe?
            else if (auth.userInfo.role === 'businessOwner') redirectPath = '/BOwnerHome';
            const destination = (fromPath && fromPath !== '/login' && fromPath !== '/') ? fromPath : redirectPath;
            console.log(`%c[AppContent PostLogin] Navigating from /login to: ${destination}`, 'color: blue;');
            navigate(destination, { replace: true });
        }
    }, [auth.isLoggedIn, auth.userInfo, navigate, location]);

    // --- Effect to Handle Logout Messages from URL ---
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const msgParam = params.get('logoutMessage');
        if (msgParam) {
            if (msgParam !== logoutMessage) setLogoutMessage(msgParam);
            window.history.replaceState({}, document.title, location.pathname);
        }
    }, [location.search, setLogoutMessage, logoutMessage]);

    // --- Effect to Redirect to Login if Logout Message is Set ---
    useEffect(() => {
        if (logoutMessage && location.pathname.toLowerCase() !== '/login') {
            console.log("[AppContent LogoutRedirect] Redirecting to login.");
            navigate(`/login`, { replace: true, state: { logoutMessage: logoutMessage } });
        }
    }, [logoutMessage, location.pathname, navigate]);

    return (
        <div className="App"> {/* General App container */}
            {/* Navbar visible for ALL users */}
            <Navbar isLoggedIn={auth.isLoggedIn} userInfo={auth.userInfo} handleLogout={auth.logout} />

            {/* Logout message display (only on Login page) */}
            {logoutMessage && location.pathname.toLowerCase() === '/login' && (
                 <div className="alert alert-warning global-message" onClick={() => setLogoutMessage('')} title="Click to dismiss"
                      style={{ textAlign: 'center', padding: '10px', margin: '10px auto', maxWidth: '600px', cursor: 'pointer', border: '1px solid', borderRadius: '4px' }}>
                    {logoutMessage}
                 </div>
            )}

            {/* Main content routing area */}
            <main className="main-content">
                <Routes>
                    {/* === Public Routes === */}
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

                    {/* === Login Route === */}
                    <Route path="/Login" element={
                            auth.isLoggedIn && auth.userInfo ? (
                                <Navigate to={ auth.userInfo.role === 'admin' ? '/Admin/Dashboard' : auth.userInfo.role === 'client' ? '/ClientProfile' : auth.userInfo.role === 'businessOwner' ? '/BOwnerHome' : '/' } replace />
                            ) : ( <Login onLoginSuccess={auth.login} /> )
                        }
                    />

                    {/* === Protected Client Routes === */}
                    <Route element={<ProtectedRoute requiredRole="client" />}>
                        <Route path="/ClientProfile" element={<ClientProfile />} />
                        <Route path="/PickupReq" element={<PickupReq />} />
                        <Route path="/CheckBuySell" element={<CheckBuySell />} />
                        <Route path="/ClientEmail" element={<ClientEmail />} />
                        <Route path="/UserCalendar" element={<UserCalendar userInfo={auth.userInfo} />} />
                        <Route path="/CalendarDisplay" element={<CalendarDisplay />} />
                        <Route path="/SaleForm" element={<SaleForm />} />
                        <Route path="/BuyCard" element={<BuyCard />} />
                        <Route path="/WastePickForm" element={<WastePickForm />} />
                        <Route path="/LocationMap" element={<LocationMap />} />
                    </Route>

                    {/* === Protected Business Owner Routes === */}
                    <Route element={<ProtectedRoute requiredRole="businessOwner" />}>
                         <Route path="/BOwnerHome" element={<BOwnerHome userInfo={auth.userInfo} />} />
                         <Route path="/BOwnerProfile" element={<BOwnerProfile />} />
                         <Route path="/ProAddForm" element={<ProAddForm />} />
                    </Route>

                     {/* === Protected Admin Routes === */}
                     <Route element={<ProtectedRoute requiredRole="admin" />}>
                        {/* Apply AdminLayout (with AdNav sidebar) to all routes within */}
                        <Route element={<AdminLayout handleLogout={auth.logout} />}>
                           {/* Define the specific paths for admin pages */}
                           {/* These paths MUST match the 'to' prop in AdNav.jsx */}
                           <Route path="/Admin" element={<Navigate to="/Admin/Dashboard" replace />} /> {/* Base redirect */}
                           <Route path="/Admin/Dashboard" element={<Dashboard />} />
                           <Route path="/Admin/Calendar" element={<AdCalendar />} /> {/* Changed from Settings */}
                           <Route path="/Admin/Requests" element={<AdCheckReq />} />
                           <Route path="/Admin/Emails" element={<EmailDisplay />} />
                           <Route path="/Admin/ManageOwners" element={<HandleBOwners />} />
                           <Route path="/Admin/DisReview" element={<DisReview />} />
                           {/* Add future admin routes here using the /Admin/ prefix */}
                           {/* <Route path="/Admin/Placeholder1" element={<PlaceholderComponent1 />} /> */}
                           {/* <Route path="/Admin/Placeholder2" element={<PlaceholderComponent2 />} /> */}
                        </Route>
                     </Route>
                    </Routes>
            </main>

            {/* Footer visible for ALL users */}
            <Footer1 />
        </div>
    );
}

// --- Export App Component ---
export default App;