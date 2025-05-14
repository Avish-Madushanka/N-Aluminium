// src/App.jsx
// FINAL CONSOLIDATED VERSION (Reflecting Admin Layout Structure and Collector Role)

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
import ProtectedRoute from './routes/ProtectedRoute';
import AdminLayout from './Layouts/AdminLayout';

// --- Page Components (Verify ALL import paths) ---
// Public Pages
import HomePage from './Pages/HomePage';
import SignUp from './Pages/SignUp'; // General SignUp page
import AboutUs from './Pages/AboutUS';
import BuyandSell from './Pages/BuyandSell';
import Project from './Pages/Project';
import Collection from './Pages/Collection';
import Service from './Pages/Service';
import Map from './Pages/Map';
import ContactUs from './Pages/ContactUs';

// Registration Forms
import BOwnerForm from './Components/RegistrationForm/BOwnerForm';
import ClientForm from './Components/RegistrationForm/ClientForm';
import CollectorForm from './Components/RegistrationForm/CollectorForm'; // Added

// Login Components
import Login from './Components/Login/Login'; // General Login
import CollectorLogin from './Components/Login/CollectorLogin'; // Added

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
// FIXME: Add CollectorDashboard import if you have one
// import CollectorDashboard from './Pages/CollectorDashboard';


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
        // Ensure core fields exist for any role
        if (!decoded.id || !decoded.email || !decoded.role || !decoded.name) {
            console.error("[parseUserInfo] Token missing essential fields.", decoded);
             localStorage.removeItem('token'); localStorage.removeItem('userInfo'); return null;
        }
        console.log("[parseUserInfo] Token valid. Role:", decoded.role);
        // Add role-specific fields if they exist in the token
        const userInfo = {
            id: decoded.id, name: decoded.name, email: decoded.email, role: decoded.role,
        };
        if (decoded.role === 'businessOwner' && decoded.businessName) {
            userInfo.businessName = decoded.businessName;
        }
        // Example: if collectors have a 'collectorId' in token
        // if (decoded.role === 'collector' && decoded.collectorId) {
        //     userInfo.collectorId = decoded.collectorId;
        // }
        return userInfo;
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
    const navigateRef = useRef(null); // For potential imperative navigation from outside React Router context

    // --- Logout Handler ---
    const handleLogout = useCallback((message = "You have been logged out.") => {
        console.log(`[App] handleLogout. Message: "${message}"`);
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        setAuthState({ isLoggedIn: false, userInfo: null, isLoading: false });
        setLogoutMessage(message);
    }, []);

    // --- Initial Auth Check & Storage Listener ---
    useEffect(() => {
        console.log("[App CheckAuth] Running initial check...");
        const token = localStorage.getItem('token');
        const parsedUser = parseUserInfoFromToken(token);

        if (parsedUser) {
            console.log("[App CheckAuth] Valid session found.", parsedUser);
            const storedUserInfo = localStorage.getItem('userInfo');
            // Sync localStorage.userInfo if parsedUser is different (e.g., updated token fields)
            if (JSON.stringify(parsedUser) !== storedUserInfo) {
                localStorage.setItem('userInfo', JSON.stringify(parsedUser));
            }
            setAuthState({ isLoggedIn: true, userInfo: parsedUser, isLoading: false });
        } else {
            console.log("[App CheckAuth] No valid session. Clearing any residual auth data.");
            // Ensure consistency if token was invalid or not present
            if (localStorage.getItem('token') || localStorage.getItem('userInfo')) {
                localStorage.removeItem('token');
                localStorage.removeItem('userInfo');
            }
            setAuthState({ isLoggedIn: false, userInfo: null, isLoading: false });
        }

        const handleStorageChange = (event) => {
            if (event.key === 'token' || event.key === 'userInfo') {
                 console.log(`[App Storage Listener] Storage changed ('${event.key}'). Re-validating auth.`);
                 const currentToken = localStorage.getItem('token');
                 const currentUserInfo = parseUserInfoFromToken(currentToken);

                 setAuthState(prevState => {
                    const newStateIsLoggedIn = !!currentUserInfo;
                    // Update if login status or user info object identity changes
                    if (prevState.isLoggedIn !== newStateIsLoggedIn || JSON.stringify(prevState.userInfo) !== JSON.stringify(currentUserInfo)) {
                         console.log("[App Storage Listener] Auth state updated due to storage change.");
                         if (currentUserInfo && JSON.stringify(currentUserInfo) !== localStorage.getItem('userInfo')) {
                             localStorage.setItem('userInfo', JSON.stringify(currentUserInfo));
                         } else if (!currentUserInfo && localStorage.getItem('userInfo')) {
                             localStorage.removeItem('userInfo'); // Clean up if user becomes null
                         }
                         return { isLoading: false, isLoggedIn: newStateIsLoggedIn, userInfo: currentUserInfo };
                    }
                    return {...prevState, isLoading: false }; // Ensure isLoading is false
                 });
             }
         };
         window.addEventListener('storage', handleStorageChange);
         return () => window.removeEventListener('storage', handleStorageChange);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Removed authState.isLoggedIn from deps to prevent potential loops if not careful

    // --- Login Success Handler ---
    const handleLoginSuccess = useCallback((token) => { // Removed backendUserData as parseUserInfoFromToken handles it
        console.log('[App] handleLoginSuccess.');
        const parsedUser = parseUserInfoFromToken(token);
        if (parsedUser) {
            console.log('%c[App] Login OK. Updating AuthState.', 'color: green; font-weight: bold;', parsedUser);
            localStorage.setItem('token', token);
            localStorage.setItem('userInfo', JSON.stringify(parsedUser));
            setAuthState({ isLoggedIn: true, userInfo: parsedUser, isLoading: false });
            setLogoutMessage(''); // Clear any previous logout messages
        } else {
            console.error("[App] Login token invalid after successful login attempt!");
            handleLogout("Login failed: Invalid session data received."); // Use handleLogout for consistency
        }
    }, [handleLogout]);

    // --- Global 401 Listener (e.g., for API interceptors) ---
    useEffect(() => {
        const handleAuthErrorEvent = (event) => {
            // Only logout if user was considered logged in by the context
            setAuthState(currentState => {
                if (currentState.isLoggedIn) {
                    console.warn('[App] Global 401 auth-error-event listener: Triggering logout.');
                    const message = event.detail?.message || 'Your session has expired or is invalid. Please log in again.';
                    handleLogout(message); // handleLogout now sets authState
                    return { isLoggedIn: false, userInfo: null, isLoading: false }; // Explicitly return new state
                }
                return currentState; // No change if already logged out
            });
        };
        window.addEventListener('auth-error-401', handleAuthErrorEvent);
        return () => window.removeEventListener('auth-error-401', handleAuthErrorEvent);
    }, [handleLogout]);

    // --- Loading Screen ---
    if (authState.isLoading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <ClipLoader size={60} color="#f97316" />
                <p style={{ marginTop: '20px', color: '#333' }}>Loading application...</p>
            </div>
        );
    }

    // --- Render App ---
    return (
        <AuthContext.Provider value={{ ...authState, logout: handleLogout, login: handleLoginSuccess }}>
            <Router>
                <AppContentWrapper
                    logoutMessage={logoutMessage}
                    setLogoutMessage={setLogoutMessage}
                    // navigateRef={navigateRef} // navigateRef is not used in AppContentWrapper in this version
                />
            </Router>
        </AuthContext.Provider>
    );
}


// --- App Content Wrapper Component ---
function AppContentWrapper({ logoutMessage, setLogoutMessage }) {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useAuth(); // Contains isLoggedIn, userInfo, login, logout

    // --- Effect for Post-Login Redirect (When user is already logged in and hits a login page) ---
    useEffect(() => {
        if (auth.isLoggedIn && auth.userInfo) {
            const currentPath = location.pathname.toLowerCase();
            // Check if on /login or /collectorlogin page
            if (currentPath === '/login' || currentPath === '/collectorlogin') {
                const fromPath = location.state?.from?.pathname;
                let redirectPath = '/'; // Default redirect

                // Determine redirect based on role
                switch (auth.userInfo.role) {
                    case 'admin': redirectPath = '/Admin/Dashboard'; break;
                    case 'client': redirectPath = '/ClientProfile'; break;
                    case 'businessOwner': redirectPath = '/BOwnerHome'; break;
                    case 'collector': redirectPath = '/CollectorDashboard'; break; // FIXME: Ensure /CollectorDashboard exists
                    default: redirectPath = '/'; // Fallback for unknown roles
                }
                
                // Prefer 'fromPath' if it's valid and not a login page itself
                const destination = (fromPath && fromPath !== '/' && fromPath !== '/login' && fromPath !== '/collectorlogin') ? fromPath : redirectPath;
                
                console.log(`%c[AppContent PostLoginRedirect] User already logged in. Navigating from ${currentPath} to: ${destination}`, 'color: blue;');
                navigate(destination, { replace: true });
            }
        }
    }, [auth.isLoggedIn, auth.userInfo, navigate, location]);

    // --- Effect to Handle Logout Messages from URL Query Param ---
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const msgParam = params.get('logoutMessage');
        if (msgParam) {
            if (msgParam !== logoutMessage) { // Avoid re-setting if already set by internal logout
                setLogoutMessage(decodeURIComponent(msgParam));
            }
            // Clean the URL
            const newPath = location.pathname;
            window.history.replaceState({}, document.title, newPath);
        }
    }, [location.search, location.pathname, setLogoutMessage, logoutMessage]);

    // --- Effect to Redirect to Login if Logout Message is Set (and not already on a login page) ---
    useEffect(() => {
        const currentPath = location.pathname.toLowerCase();
        if (logoutMessage && currentPath !== '/login' && currentPath !== '/collectorlogin') {
            console.log(`[AppContent LogoutRedirect] Logout message detected ("${logoutMessage}"). Redirecting to /login.`);
            // Redirect to generic login, user can choose specific login if needed.
            // Pass the logout message to the state of the login route.
            navigate(`/login`, { replace: true, state: { logoutMessage: logoutMessage } });
        }
    }, [logoutMessage, location.pathname, navigate]);

    // Helper function to determine redirect path for logged-in users
    const getRedirectPathForRole = (role) => {
        switch (role) {
            case 'admin': return '/Admin/Dashboard';
            case 'client': return '/ClientProfile';
            case 'businessOwner': return '/BOwnerHome';
            case 'collector': return '/CollectorDashboard'; // FIXME: Ensure /CollectorDashboard exists
            default: return '/';
        }
    };

    return (
        <div className="App"> {/* General App container */}
            <Navbar isLoggedIn={auth.isLoggedIn} userInfo={auth.userInfo} handleLogout={auth.logout} />

            {/* Logout message display (only on Login pages if message exists in state) */}
            {(location.pathname.toLowerCase() === '/login' || location.pathname.toLowerCase() === '/collectorlogin') &&
             location.state?.logoutMessage && (
                 <div className="alert alert-warning global-message"
                      style={{ textAlign: 'center', padding: '10px', margin: '10px auto', maxWidth: '600px', cursor: 'default', border: '1px solid', borderRadius: '4px' }}>
                    {location.state.logoutMessage}
                 </div>
            )}
            {/* Display logoutMessage from AuthContext if on a login page and no state message (e.g. after direct logout action) */}
            {(location.pathname.toLowerCase() === '/login' || location.pathname.toLowerCase() === '/collectorlogin') &&
             logoutMessage && !location.state?.logoutMessage && (
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
                    
                    {/* Registration Forms */}
                    <Route path="/SignUp" element={<SignUp />} /> {/* General sign-up, might lead to role choice */}
                    <Route path="/BOwnerForm" element={<BOwnerForm />} />
                    <Route path="/ClientForm" element={<ClientForm />} />
                    <Route path="/CollectorForm" element={<CollectorForm />} />

                    {/* === Login Routes === */}
                    <Route path="/Login" element={
                        auth.isLoggedIn && auth.userInfo ? (
                            <Navigate to={getRedirectPathForRole(auth.userInfo.role)} replace />
                        ) : ( <Login onLoginSuccess={auth.login} /> )
                    }/>
                    <Route path="/CollectorLogin" element={
                        auth.isLoggedIn && auth.userInfo ? ( // If any user is logged in
                            auth.userInfo.role === 'collector' ? // And they are a collector
                            <Navigate to="/CollectorDashboard" replace /> // Go to collector dashboard
                            : <Navigate to={getRedirectPathForRole(auth.userInfo.role)} replace /> // Else, go to their own dashboard
                        ) : ( <CollectorLogin onLoginSuccess={auth.login} /> ) // Not logged in, show collector login
                    }/>
                        
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

                    {/* === Protected Collector Routes === */}
                    {/* FIXME: Add collector-specific routes here if needed */}
                    {/* Example:
                    <Route element={<ProtectedRoute requiredRole="collector" />}>
                        <Route path="/CollectorDashboard" element={<CollectorDashboard />} />
                        <Route path="/CollectorTasks" element={<CollectorTasks />} />
                    </Route>
                    */}


                     {/* === Protected Admin Routes === */}
                     <Route element={<ProtectedRoute requiredRole="admin" />}>
                        <Route element={<AdminLayout handleLogout={auth.logout} />}>
                           <Route path="/Admin" element={<Navigate to="/Admin/Dashboard" replace />} />
                           <Route path="/Admin/Dashboard" element={<Dashboard />} />
                           <Route path="/Admin/Calendar" element={<AdCalendar />} />
                           <Route path="/Admin/Requests" element={<AdCheckReq />} />
                           <Route path="/Admin/Emails" element={<EmailDisplay />} />
                           <Route path="/Admin/ManageOwners" element={<HandleBOwners />} />
                           <Route path="/Admin/DisReview" element={<DisReview />} />
                        </Route>
                     </Route>

                    {/* Fallback for unmatched routes (Optional: Add a 404 Page) */}
                    {/* <Route path="*" element={<NotFoundPage />} /> */}
                </Routes>
            </main>

            <Footer1 />
        </div>
    );
}

// --- Export App Component ---
export default App;