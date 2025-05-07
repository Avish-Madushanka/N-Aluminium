// src/App.jsx
import React, { useState, useEffect, useCallback, createContext, useContext, useRef } from 'react';
import {
    BrowserRouter as Router, Routes, Route, useNavigate,
    useLocation, Navigate, Outlet, Link
} from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { jwtDecode } from 'jwt-decode'; // Ensure this is installed

// --- Context ---
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// --- Core Components & Pages ---
// (Assuming all your imports for Navbar, Footer1, ProtectedRoute, AdminLayout, Pages, and Components are correct)
import Navbar from './Components/Navbar/Navbar';
import Footer1 from './Components/Footer1/Footer';
import ProtectedRoute from './routes/ProtectedRoute'; // Assuming this handles role checking
import AdminLayout from './Layouts/AdminLayout';
// import API_ENDPOINTS from "./apiConfig"; // Not directly used in App.jsx, but likely by Login or other components
// import axiosInstance from './api/axiosInstance'; // Not directly used in App.jsx

// Pages (ensure all imports are correct - this is a long list, verify paths)
import HomePage from './Pages/HomePage';
import SignUp from './Pages/SignUp';
import AboutUs from './Pages/AboutUS';
import BuyandSell from './Pages/BuyandSell';
import Login from './Components/Login/Login'; // This component will use axiosInstance and API_ENDPOINTS
import BOwnerForm from './Components/RegistrationForm/BOwnerForm';
import ClientForm from './Components/RegistrationForm/ClientForm';
import Project from './Pages/Project';
import Collection from './Pages/Collection';
import Service from './Pages/Service';
import Map from './Pages/Map';
import Calculate from './Components/Calculate/Calculate';
import ContactUs from './Pages/ContactUs';
import SaleForm from './Components/SaleForm/SaleForm';
import BuyCard from './Components/BuyCard/BuyCard';
import BOwnerHome from './Pages/BOwnerHome';
import ProAddForm from './Components/Projects/ProAddForm';
import WastePickForm from './Components/WasteCollect/WastePickForm';
import UserCalendar from './Components/WasteCollect/UserCalendar';
// Admin Pages
import Admin from './Pages/Admin'; // Likely an alias for Dashboard or an Admin landing
import AdCalendar from './Components/Admin/AdMinCalendar/AdCalendar';
import LocationMap from './Components/Maps/LocationMap';
// Client Profile related
// const ClientProfile = () => { /* ... your simplified version ... */ }; // Keep simplified for now
import ClientProfile from './Components/Profile/ClientProfile'; // Assuming this is the full component
import ClientEmail from './Components/Profile/ClientEmail';
import CalendarDisplay from './Components/UserCalendar/CalendarDisplay';
import BOwnerProfile from './Components/Profile/BOwnerProfile';
// More Admin Pages
import AdCheckReq from './Components/Admin/AdCheckReq/AdCheckReq';
import EmailDisplay from './Components/Admin/EmailDisplay/EmailDisplay';
import Dashboard from './Components/Admin/Dashboard/Dashboard';
import HandleBOwners from './Components/Admin/HandleBOwners/HandleBOwners';
// More Client Profile Pages
import PickupReq from './Components/Profile/PickupReq';
import CheckBuySell from './Components/Profile/CheckBuySell';


// --- Helper ---
// Enhanced parseUserInfo to be more robust and consistent with backend JWT payload
const parseUserInfoFromToken = (token) => {
    if (!token) return null;
    try {
        const decoded = jwtDecode(token); // id, email, role, name should come from backend JWT
        // Check for expiration
        if (decoded.exp * 1000 < Date.now()) {
            console.warn("[parseUserInfo] Token expired.");
            localStorage.removeItem('token'); // Clean up expired token
            localStorage.removeItem('userInfo');
            return null;
        }
        // Validate essential fields
        if (!decoded.id || !decoded.email || !decoded.role || !decoded.name) {
            console.error("[parseUserInfo] Token is missing essential fields (id, email, role, name).");
            return null;
        }
        return {
            id: decoded.id,
            name: decoded.name,
            email: decoded.email,
            role: decoded.role, // 'admin', 'client', 'businessOwner'
            // Add other fields from token if needed, e.g., businessName for businessOwner
            ...(decoded.role === 'businessOwner' && decoded.businessName && { businessName: decoded.businessName }),
        };
    } catch (error) {
        console.error("[parseUserInfo] Error decoding token:", error);
        localStorage.removeItem('token'); // Clean up invalid token
        localStorage.removeItem('userInfo');
        return null;
    }
};


// --- Main App Component ---
function App() {
    // State for auth status, user info, and initial loading
    const [authState, setAuthState] = useState({
        isLoggedIn: false,
        userInfo: null,
        isLoading: true, // Start with loading true
    });
    const [logoutMessage, setLogoutMessage] = useState('');
    const navigateRef = useRef(null); // To use navigate outside Router context if needed (e.g. in axios interceptor)

    // --- Logout Function ---
    // useCallback ensures this function's identity is stable if passed as prop
    const handleLogout = useCallback((message = "You have been logged out.") => {
        console.log('[App] handleLogout initiated. Message:', message);
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        setAuthState({ isLoggedIn: false, userInfo: null, isLoading: false }); // Update auth state
        // Redirect to login page with a message.
        // This navigation should happen within a component that has access to useNavigate.
        // We'll handle this in AppContent or by passing navigate.
        // For now, setting a message that AppContent can pick up.
        setLogoutMessage(message);
        // Direct window.location.href is a hard redirect, might be better to use react-router's navigation
        // If navigateRef.current is set, it can be used: navigateRef.current('/login', { state: { logoutMessage: message }});
    }, []);


    // --- Authentication Check on Mount and Storage Changes ---
    useEffect(() => {
        console.log("[App CheckAuth Effect] Running initial auth check...");
        const token = localStorage.getItem('token');
        const storedUserInfo = localStorage.getItem('userInfo'); // Get stored user info
        let userFromToken = null;
        let userFromStorage = null;

        if (token) {
            userFromToken = parseUserInfoFromToken(token);
        }
        if(storedUserInfo) {
            try {
                userFromStorage = JSON.parse(storedUserInfo);
            } catch(e) {
                console.error("Error parsing stored userInfo:", e);
                localStorage.removeItem('userInfo'); // Clear corrupted data
            }
        }

        if (userFromToken) {
            // If token is valid, it's the source of truth. Update localStorage if different.
            if (JSON.stringify(userFromToken) !== JSON.stringify(userFromStorage)) {
                localStorage.setItem('userInfo', JSON.stringify(userFromToken));
            }
            console.log("[App CheckAuth Effect] Valid session. User:", userFromToken);
            setAuthState({ isLoggedIn: true, userInfo: userFromToken, isLoading: false });
        } else {
            // No valid token, or token parsing failed
            console.log("[App CheckAuth Effect] No valid session found or token expired.");
            if (authState.isLoggedIn || localStorage.getItem('token') || localStorage.getItem('userInfo')) {
                // If state or storage indicates logged in, but token is invalid, perform cleanup
                localStorage.removeItem('token');
                localStorage.removeItem('userInfo');
            }
            setAuthState({ isLoggedIn: false, userInfo: null, isLoading: false });
        }

        // Listener for storage events (logout/login in other tabs)
        const handleStorageChange = (event) => {
            if (event.key === 'token' || event.key === 'userInfo') {
                console.log(`[App Storage Listener] Detected '${event.key}' change in another tab. Re-checking auth.`);
                const currentToken = localStorage.getItem('token');
                const parsedUserAgain = parseUserInfoFromToken(currentToken);
                if (parsedUserAgain) {
                    setAuthState({ isLoggedIn: true, userInfo: parsedUserAgain, isLoading: false });
                    if (JSON.stringify(parsedUserAgain) !== localStorage.getItem('userInfo')) {
                        localStorage.setItem('userInfo', JSON.stringify(parsedUserAgain));
                    }
                } else {
                    if (authState.isLoggedIn) { // Only update if current tab thought it was logged in
                        setAuthState({ isLoggedIn: false, userInfo: null, isLoading: false });
                    }
                }
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []); // Run once on mount. authState.isLoggedIn removed to prevent re-runs unless logout logic needs it


    // --- Login Success Handler ---
    const handleLoginSuccess = useCallback((token, backendUserData) => {
        // backendUserData is the { id, name, email, role, ... } object from the backend login response
        console.log('[App] handleLoginSuccess triggered. Backend User Data:', backendUserData);
        // The token itself contains the primary user info, parse it for consistency
        const parsedUserFromNewToken = parseUserInfoFromToken(token);

        if (parsedUserFromNewToken) {
            localStorage.setItem('token', token);
            // Use parsed info from token as the source of truth for userInfo state and localStorage.
            localStorage.setItem('userInfo', JSON.stringify(parsedUserFromNewToken));
            setAuthState({ isLoggedIn: true, userInfo: parsedUserFromNewToken, isLoading: false });
            setLogoutMessage(''); // Clear any previous logout message
            console.log('%c[App] Login successful. AuthState UPDATED.', 'color: green; font-weight: bold;', { userInfo: parsedUserFromNewToken, isLoggedIn: true });
            // Navigation will be handled by AppContent's redirect logic
        } else {
            console.error("[App] Login successful but new token was invalid or data missing!");
            handleLogout("Login failed: Invalid session data received.");
        }
    }, [handleLogout]); // handleLogout is a stable dependency


    // --- Global Logout Event Listener for 401s from axiosInstance ---
    useEffect(() => {
        const handleAuthErrorEvent = (event) => {
            console.warn('[App] Caught global auth-error-401 event from axios interceptor.');
            const message = event.detail?.message || 'Your session has expired or is invalid. Please log in again.';
            // Check current auth state before logging out to prevent loops if already logged out
            if (authState.isLoggedIn) {
                handleLogout(message);
            }
        };
        window.addEventListener('auth-error-401', handleAuthErrorEvent);
        return () => window.removeEventListener('auth-error-401', handleAuthErrorEvent);
    }, [handleLogout, authState.isLoggedIn]); // Add authState.isLoggedIn


    if (authState.isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
                <ClipLoader size={60} color="#f97316" loading={authState.isLoading} />
                <p style={{ marginTop: '20px', color: '#555' }}>Loading Application...</p>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ ...authState, logout: handleLogout, login: handleLoginSuccess }}>
            <Router>
                <AppContentWrapper // Use a new wrapper to get navigate context
                    logoutMessage={logoutMessage}
                    setLogoutMessage={setLogoutMessage}
                    navigateRef={navigateRef} // Pass ref to AppContentWrapper
                />
            </Router>
        </AuthContext.Provider>
    );
}

// New Wrapper to get access to useNavigate for the AppContent
function AppContentWrapper({ logoutMessage, setLogoutMessage, navigateRef }) {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useAuth(); // Get auth state from context

    useEffect(() => {
        navigateRef.current = navigate; // Set the navigate function to the ref
    }, [navigate, navigateRef]);

    // --- Effect for Post-Login Redirect ---
    useEffect(() => {
        if (auth.isLoggedIn && auth.userInfo && location.pathname.toLowerCase() === '/login') {
            const fromPath = location.state?.from?.pathname; // Path user was trying to access before redirect to login
            let redirectPath = '/'; // Default redirect

            if (auth.userInfo.role === 'admin') redirectPath = '/Admin/Dashboard';
            else if (auth.userInfo.role === 'client') redirectPath = '/ClientProfile';
            else if (auth.userInfo.role === 'businessOwner') redirectPath = '/BOwnerHome'; // Corrected 'bowner' to 'businessOwner'
            // else if (auth.userInfo.role === 'bowner') redirectPath = '/BOwnerHome'; // Example for consistency

            const destination = (fromPath && fromPath !== '/login' && fromPath !== '/') ? fromPath : redirectPath;
            console.log(`%c[AppContent PostLogin] Logged in & on /login. Navigating to: ${destination}`, 'color: green; font-weight: bold;');
            navigate(destination, { replace: true });
        }
    }, [auth.isLoggedIn, auth.userInfo, navigate, location]);


    // --- Effect to Handle Session Expired/Logout Messages from URL ---
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const msgParam = params.get('logoutMessage');
        const expiredParam = params.get('sessionExpired'); // If you use this param elsewhere
        let messageToShow = '';

        if (msgParam) messageToShow = msgParam;
        else if (expiredParam === 'true' && !logoutMessage) messageToShow = 'Your session has expired. Please log in again.';

        if (messageToShow) {
            setLogoutMessage(messageToShow);
            // Clean the URL to remove the message query params
            window.history.replaceState({}, document.title, location.pathname);
        }
    }, [location.search, setLogoutMessage, logoutMessage]); // location.search for direct dependency

    // --- Handle logout message display and auto-redirect from other pages if logged out ---
    useEffect(() => {
        if (logoutMessage && location.pathname !== '/login') {
            // If there's a logout message and user is not on login page, redirect them to login with the message
            console.log("[AppContent] Logout message present, redirecting to login with message.");
            navigate(`/login?logoutMessage=${encodeURIComponent(logoutMessage)}`, { replace: true });
        }
    }, [logoutMessage, location.pathname, navigate]);


    const isAdmin = auth.isLoggedIn && auth.userInfo?.role === 'admin';

    return (
        <div className={`App ${isAdmin ? 'admin-view' : ''}`}>
            {!isAdmin && (
                <Navbar isLoggedIn={auth.isLoggedIn} userInfo={auth.userInfo} handleLogout={auth.logout} />
            )}

            {logoutMessage && location.pathname.toLowerCase() === '/login' && ( // Only show on login page
                 <div
                    className="alert alert-warning global-message" // Ensure these CSS classes exist
                    onClick={() => setLogoutMessage('')}
                    title="Click to dismiss"
                    style={{ textAlign: 'center', padding: '10px', backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffeeba', margin: '10px auto', maxWidth: '600px', cursor: 'pointer' }}
                >
                    {logoutMessage}
                </div>
            )}

            <main className={`main-content ${isAdmin ? 'admin-main' : ''}`}>
                <Routes>
                    {/* --- Public Routes --- */}
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

                    {/* Login Route: If logged in, redirect based on role, else show Login component */}
                    <Route
                        path="/Login"
                        element={
                            auth.isLoggedIn && auth.userInfo ? (
                                auth.userInfo.role === 'admin' ? <Navigate to="/Admin/Dashboard" replace /> :
                                auth.userInfo.role === 'client' ? <Navigate to="/ClientProfile" replace /> :
                                auth.userInfo.role === 'businessOwner' ? <Navigate to="/BOwnerHome" replace /> :
                                <Navigate to="/" replace /> // Fallback
                            ) : (
                                <Login onLoginSuccess={auth.login} />
                            )
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
                        <Route element={<AdminLayout handleLogout={auth.logout} />}>
                           {/* <Route index element={<Navigate to="/Admin/Dashboard" replace />} /> Redirect from /Admin to /Admin/Dashboard */}
                           <Route path="/Admin" element={<Navigate to="/Admin/Dashboard" replace />} /> {/* Explicit redirect */}
                           <Route path="/Admin/Dashboard" element={<Dashboard />} />
                           <Route path="/Admin/Settings" element={<AdCalendar />} /> {/* Assuming AdCalendar is settings or rename route */}
                           <Route path="/Admin/Requests" element={<AdCheckReq />} />
                           <Route path="/Admin/Emails" element={<EmailDisplay />} />
                           <Route path="/Admin/ManageOwners" element={<HandleBOwners />} />
                        </Route>
                     </Route>

                    {/* Unauthorized Page - Can be navigated to by ProtectedRoute */}
                    <Route path="/unauthorized" element={
                        <div style={{ textAlign: 'center', padding: '50px' }}>
                            <h2>Unauthorized Access</h2>
                            <p>You do not have permission to view this page.</p>
                            <Link to="/" style={{ color: '#f97316', textDecoration: 'underline' }}>Go Home</Link>
                        </div>
                    }/>

                    {/* Catch-all 404 */}
                    <Route path="*" element={
                        <div style={{ textAlign: 'center', padding: '50px' }}>
                            <h2>404 Not Found</h2>
                            <p>Sorry, the page you requested does not exist.</p>
                            <Link to="/" style={{ color: '#f97316', textDecoration: 'underline' }}>Go Home</Link>
                        </div>
                    }/>
                </Routes>
            </main>

            {!isAdmin && <Footer1 />}
        </div>
    );
}


export default App;