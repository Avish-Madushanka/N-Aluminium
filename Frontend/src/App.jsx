// src/App.jsx
// FINAL CONSOLIDATED VERSION

import React, { useState, useEffect, useCallback, createContext, useContext, useRef } from 'react';
import {
    BrowserRouter as Router, Routes, Route, useNavigate,
    useLocation, Navigate, Outlet, Link
} from 'react-router-dom';
import { ClipLoader } from 'react-spinners'; // Ensure installed: npm install react-spinners
import { jwtDecode } from 'jwt-decode';     // Ensure installed: npm install jwt-decode

// --- Context ---
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext); // Hook to consume auth context

// --- Core Layout & Routing Components ---
import Navbar from './Components/Navbar/Navbar';
import Footer1 from './Components/Footer1/Footer';
import ProtectedRoute from './routes/ProtectedRoute'; // Needs to exist and use useAuth()
import AdminLayout from './Layouts/AdminLayout';       // Needs to exist (renders AdNav + Outlet)

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

// Forms & Auth
import Login from './Components/Login/Login';
import BOwnerForm from './Components/RegistrationForm/BOwnerForm';
import ClientForm from './Components/RegistrationForm/ClientForm';

// Functional Components (often used on pages)
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
// import Admin from './Pages/Admin'; // Often the Dashboard is the main Admin landing
import AdCalendar from './Components/Admin/AdMinCalendar/AdCalendar';
import AdCheckReq from './Components/Admin/AdCheckReq/AdCheckReq';
import EmailDisplay from './Components/Admin/EmailDisplay/EmailDisplay';
import Dashboard from './Components/Admin/Dashboard/Dashboard'; // Admin Dashboard
import HandleBOwners from './Components/Admin/HandleBOwners/HandleBOwners';


// --- Helper: Parse and Validate JWT ---
const parseUserInfoFromToken = (token) => {
    if (!token) {
        // console.debug("[parseUserInfo] No token provided.");
        return null;
    }
    try {
        const decoded = jwtDecode(token);
        if (!decoded || typeof decoded !== 'object') {
             console.error("[parseUserInfo] Failed to decode token or decoded value is not an object.");
             localStorage.removeItem('token'); localStorage.removeItem('userInfo'); return null;
        }
        // Check expiration (time in seconds)
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
            console.warn("[parseUserInfo] Token expired at:", new Date(decoded.exp * 1000).toLocaleString());
            localStorage.removeItem('token'); localStorage.removeItem('userInfo'); return null;
        }
        // Check essential fields required by frontend logic
        // *** Ensure your backend JWT consistently includes these fields ***
        if (!decoded.id || !decoded.email || !decoded.role || !decoded.name) {
            console.error("[parseUserInfo] Token missing essential fields (id, email, role, name). Payload:", decoded);
             localStorage.removeItem('token'); localStorage.removeItem('userInfo'); return null;
        }
        console.log("[parseUserInfo] Token successfully decoded and validated. Role:", decoded.role);
        // Return standardized user info object
        return {
            id: decoded.id,
            name: decoded.name, // Expect 'name' (Admin/Client) or derived name (BOwner) from backend
            email: decoded.email,
            role: decoded.role, // Should be 'admin', 'client', or 'businessOwner'
            // Include optional fields if present in token
            ...(decoded.role === 'businessOwner' && decoded.businessName && { businessName: decoded.businessName }),
        };
    } catch (error) {
        // Catch errors from jwtDecode (e.g., malformed token)
        console.error("[parseUserInfo] Error during token decoding:", error);
        localStorage.removeItem('token'); localStorage.removeItem('userInfo'); return null;
    }
};


// --- Root App Component ---
function App() {
    // Centralized authentication state
    const [authState, setAuthState] = useState({
        isLoggedIn: false,
        userInfo: null,
        isLoading: true, // Start loading until initial auth check is done
    });
    // State for displaying temporary messages (like after logout)
    const [logoutMessage, setLogoutMessage] = useState('');
    // Ref to potentially pass navigate function to non-component modules (e.g., axios interceptor)
    const navigateRef = useRef(null);

    // --- Logout Handler ---
    const handleLogout = useCallback((message = "You have been logged out.") => {
        console.log(`[App] handleLogout called. Message: "${message}"`);
        localStorage.removeItem("token");       // Clear token from storage
        localStorage.removeItem("userInfo");    // Clear user info from storage
        setAuthState({ isLoggedIn: false, userInfo: null, isLoading: false }); // Reset auth state
        setLogoutMessage(message);              // Set message to trigger redirect in wrapper
    }, []); // No external dependencies, useCallback is stable

    // --- Initial Authentication Check Effect ---
    useEffect(() => {
        console.log("[App CheckAuth Effect] Performing initial authentication check...");
        const token = localStorage.getItem('token');
        const parsedUser = parseUserInfoFromToken(token); // Validate token from storage

        if (parsedUser) {
            // Valid token found
            console.log("[App CheckAuth Effect] Valid session found. Setting auth state. User:", parsedUser);
            // Ensure localStorage 'userInfo' is consistent with parsed token
            const storedUserInfo = localStorage.getItem('userInfo');
            if (JSON.stringify(parsedUser) !== storedUserInfo) {
                localStorage.setItem('userInfo', JSON.stringify(parsedUser));
            }
            setAuthState({ isLoggedIn: true, userInfo: parsedUser, isLoading: false });
        } else {
            // No valid token found (or expired/invalid)
            console.log("[App CheckAuth Effect] No valid session found.");
            // Clean up any potentially inconsistent state/storage
            if (authState.isLoggedIn || localStorage.getItem('token') || localStorage.getItem('userInfo')) {
                localStorage.removeItem('token');
                localStorage.removeItem('userInfo');
            }
            setAuthState({ isLoggedIn: false, userInfo: null, isLoading: false });
        }

        // Listener for storage events (sync across tabs)
        const handleStorageChange = (event) => {
            if (event.key === 'token' || event.key === 'userInfo') {
                console.log(`[App Storage Listener] Storage key '${event.key}' changed. Re-validating auth.`);
                const currentToken = localStorage.getItem('token');
                const currentUserInfo = parseUserInfoFromToken(currentToken);
                // Update state only if it has actually changed compared to current state
                setAuthState(prevState => {
                    const newStateIsLoggedIn = !!currentUserInfo;
                    if (prevState.isLoggedIn !== newStateIsLoggedIn || JSON.stringify(prevState.userInfo) !== JSON.stringify(currentUserInfo)) {
                         console.log("[App Storage Listener] Auth state updated due to storage event.");
                         // Ensure storage is synced
                         if (currentUserInfo && JSON.stringify(currentUserInfo) !== localStorage.getItem('userInfo')) {
                             localStorage.setItem('userInfo', JSON.stringify(currentUserInfo));
                         } else if (!currentUserInfo) {
                             localStorage.removeItem('userInfo');
                         }
                         // Return new state object
                         return { isLoading: false, isLoggedIn: newStateIsLoggedIn, userInfo: currentUserInfo };
                    }
                    // If no change, return previous state to avoid unnecessary re-render
                    return prevState;
                });
            }
        };
        window.addEventListener('storage', handleStorageChange);

        // Cleanup listener on component unmount
        return () => {
            console.log("[App CheckAuth Effect] Cleaning up storage listener.");
            window.removeEventListener('storage', handleStorageChange);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // IMPORTANT: Run only ONCE on initial mount to prevent loops


    // --- Login Success Handler ---
    const handleLoginSuccess = useCallback((token, backendUserData) => {
        console.log('[App] handleLoginSuccess received token.');
        // Always parse the token received as the source of truth for user info state
        const parsedUser = parseUserInfoFromToken(token);

        if (parsedUser) {
            console.log('%c[App] Login successful. Updating AuthState.', 'color: green; font-weight: bold;', parsedUser);
            localStorage.setItem('token', token);
            localStorage.setItem('userInfo', JSON.stringify(parsedUser)); // Store parsed info
            setAuthState({ isLoggedIn: true, userInfo: parsedUser, isLoading: false });
            setLogoutMessage(''); // Clear any previous logout messages
        } else {
            // This indicates a problem with the token received from backend
            console.error("[App] FATAL: Login successful (received token) but token is invalid or missing required fields upon parsing!");
            handleLogout("Login failed: Invalid session data received from server."); // Force logout
        }
    }, [handleLogout]); // Dependency on handleLogout (which is stable due to its own useCallback)


    // --- Global Logout Event Listener for 401s ---
    useEffect(() => {
        const handleAuthErrorEvent = (event) => {
            // Use functional update form of setState to get the latest state
            setAuthState(currentState => {
                // Only trigger logout if we are currently logged in, prevents loops
                if (currentState.isLoggedIn) {
                    console.warn('[App] Global auth-error-401 listener: Triggering logout due to event.');
                    const message = event.detail?.message || 'Your session has expired or is invalid. Please log in again.';
                    // Call handleLogout (outside of setState scope)
                    handleLogout(message);
                    // Return the new logged-out state immediately
                    return { isLoggedIn: false, userInfo: null, isLoading: false };
                }
                // If already logged out, just return the current state
                console.log('[App] Global auth-error-401 listener: Ignored, already logged out.');
                return currentState;
            });
        };

        window.addEventListener('auth-error-401', handleAuthErrorEvent);
        // Cleanup listener on component unmount
        return () => {
            console.log("[App 401 Listener] Cleaning up auth-error-401 listener.");
            window.removeEventListener('auth-error-401', handleAuthErrorEvent);
        };
    }, [handleLogout]); // Depends only on the stable handleLogout function


    // --- Initial Loading Display ---
    if (authState.isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', backgroundColor: '#f8f8f8' }}>
                <ClipLoader size={60} color="#f97316" loading={authState.isLoading} />
                <p style={{ marginTop: '20px', color: '#555', fontSize: '1.1em' }}>Initializing Application...</p>
            </div>
        );
    }

    // --- Render App with Context and Router ---
    return (
        // Provide the current auth state and the login/logout functions via context
        <AuthContext.Provider value={{ ...authState, logout: handleLogout, login: handleLoginSuccess }}>
            <Router>
                {/* AppContentWrapper handles routing and needs access to router hooks */}
                <AppContentWrapper
                    logoutMessage={logoutMessage}
                    setLogoutMessage={setLogoutMessage}
                    navigateRef={navigateRef} // Pass ref for potential external navigation
                />
            </Router>
        </AuthContext.Provider>
    );
}


// --- App Content Wrapper Component ---
// Handles Routing and Effects that need access to Router context (useNavigate, useLocation)
function AppContentWrapper({ logoutMessage, setLogoutMessage, navigateRef }) {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useAuth(); // Consume authentication context provided by App

    // Effect to assign navigate function to the ref passed from App
    useEffect(() => {
        navigateRef.current = navigate;
        return () => { navigateRef.current = null; }; // Clean up ref on unmount
    }, [navigate, navigateRef]);

    // --- Effect for Post-Login Redirect ---
    // Redirects the user away from /login page AFTER successful login state update
    useEffect(() => {
        if (auth.isLoggedIn && auth.userInfo && location.pathname.toLowerCase() === '/login') {
            const fromPath = location.state?.from?.pathname; // Original path user tried to access (if any)
            let redirectPath = '/'; // Default redirect

            // Determine redirect based on role
            // *** Ensure these role strings match your backend JWT payload exactly ***
            if (auth.userInfo.role === 'admin') {
                redirectPath = '/Admin/Dashboard';
            } else if (auth.userInfo.role === 'client') {
                redirectPath = '/ClientProfile';
            } else if (auth.userInfo.role === 'businessOwner') {
                redirectPath = '/BOwnerHome';
            } else {
                 console.warn(`[AppContent PostLogin] Unknown user role: ${auth.userInfo.role}. Redirecting to default.`);
            }

            // Use 'from' path if valid and not login/root, else use role default
            const destination = (fromPath && fromPath !== '/login' && fromPath !== '/') ? fromPath : redirectPath;
            console.log(`%c[AppContent PostLogin] Conditions met. Navigating from /login to: ${destination}`, 'color: blue; font-weight: bold;');
            navigate(destination, { replace: true }); // `replace: true` prevents login page in history
        }
    }, [auth.isLoggedIn, auth.userInfo, navigate, location]); // Re-run when auth state or location changes


    // --- Effect to Handle Logout Messages from URL Query Parameters ---
    // This handles the initial display of a message after a redirect to /login
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const msgParam = params.get('logoutMessage');
        if (msgParam) {
            // Set the message state only if it's different from current message
            if (msgParam !== logoutMessage) {
                console.log("[AppContent Message Check] Setting logout message from URL param:", msgParam)
                setLogoutMessage(msgParam);
            }
            // Clean the URL (remove query param) after processing
            window.history.replaceState({}, document.title, location.pathname);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search, setLogoutMessage]); // Run only when query params change


    // --- Effect to Redirect to Login if Logout Message is Set (e.g., after handleLogout call) ---
    useEffect(() => {
        // If a logout message exists and we are NOT already on the login page, force redirect to login
        if (logoutMessage && location.pathname.toLowerCase() !== '/login') {
            console.log("[AppContent Logout Redirect] Logout message exists and not on login page. Redirecting to /login.");
            // Pass the message via location state so the login page can display it after redirect
            navigate(`/login`, { replace: true, state: { logoutMessage: logoutMessage } });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [logoutMessage, location.pathname, navigate]); // Run when message or path changes


    return (
        <div className="App"> {/* Apply general app styling */}
            {/* Render Navbar always */}
            <Navbar isLoggedIn={auth.isLoggedIn} userInfo={auth.userInfo} handleLogout={auth.logout} />

            {/* Display logout message ONLY when on the /login page */}
            {logoutMessage && location.pathname.toLowerCase() === '/login' && (
                 <div
                    className="alert alert-warning global-message" // Use appropriate CSS classes
                    onClick={() => setLogoutMessage('')} // Allow dismissing message
                    title="Click to dismiss"
                    style={{ /* Basic styles for visibility */
                        textAlign: 'center', padding: '10px 15px', backgroundColor: '#fff3cd',
                        color: '#856404', border: '1px solid #ffeeba', margin: '15px auto',
                        maxWidth: '800px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.95em'
                    }}
                >
                    {logoutMessage}
                </div>
            )}

            {/* Main Content Area for Page Rendering */}
            <main className="main-content"> {/* Ensure this class allows space for header/footer */}
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
                    <Route path="/SignUp" element={<SignUp />} /> {/* Page linking to registration forms */}
                    <Route path="/BOwnerForm" element={<BOwnerForm />} />
                    <Route path="/ClientForm" element={<ClientForm />} />

                    {/* --- Login Route --- */}
                    <Route
                        path="/Login"
                        element={
                            auth.isLoggedIn && auth.userInfo ? (
                                // If logged in, redirect away from login page
                                <Navigate to={
                                    auth.userInfo.role === 'admin' ? '/Admin/Dashboard' :
                                    auth.userInfo.role === 'client' ? '/ClientProfile' :
                                    auth.userInfo.role === 'businessOwner' ? '/BOwnerHome' :
                                    '/' // Fallback
                                } replace />
                            ) : (
                                // If not logged in, show Login component
                                <Login onLoginSuccess={auth.login} />
                            )
                        }
                    />

                    {/* === Protected Client Routes === */}
                    <Route element={<ProtectedRoute requiredRole="client" />}>
                        {/* Add all client-only routes here */}
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
                         {/* Add all business-owner-only routes here */}
                         <Route path="/BOwnerHome" element={<BOwnerHome userInfo={auth.userInfo} />} />
                         <Route path="/BOwnerProfile" element={<BOwnerProfile />} />
                         <Route path="/ProAddForm" element={<ProAddForm />} />
                    </Route>

                     {/* === Protected Admin Routes === */}
                     <Route element={<ProtectedRoute requiredRole="admin" />}>
                        {/* Use AdminLayout to provide sidebar for these routes */}
                        <Route element={<AdminLayout handleLogout={auth.logout} />}>
                           {/* Add all admin-only routes here */}
                           {/* Redirect base /Admin path to dashboard */}
                           <Route path="/Admin" element={<Navigate to="/Admin/Dashboard" replace />} />
                           <Route path="/Admin/Dashboard" element={<Dashboard />} />
                           <Route path="/Admin/Settings" element={<AdCalendar />} /> {/* Rename path if needed */}
                           <Route path="/Admin/Requests" element={<AdCheckReq />} />
                           <Route path="/Admin/Emails" element={<EmailDisplay />} />
                           <Route path="/Admin/ManageOwners" element={<HandleBOwners />} />
                        </Route>
                     </Route>

                </Routes>
            </main>

            {/* Render Footer always */}
            <Footer1 />
        </div>
    );
}

// --- Export App Component ---
export default App;