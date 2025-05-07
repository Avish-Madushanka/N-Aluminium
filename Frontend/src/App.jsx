// src/App.jsx
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

// --- Core Components & Pages ---
import Navbar from './Components/Navbar/Navbar';
import Footer1 from './Components/Footer1/Footer';
import ProtectedRoute from './routes/ProtectedRoute'; // *** UNCOMMENTED: Assuming this file exists and is correct ***
import AdminLayout from './Layouts/AdminLayout'; // Layout specifically for Admin section

// Pages (Ensure all these import paths are correct for your project structure)
import HomePage from './Pages/HomePage';
import SignUp from './Pages/SignUp'; // Likely your page linking to ClientForm/BOwnerForm
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
import ContactUs from './Pages/ContactUs';
// Functional Components (might be pages or components used on pages)
import SaleForm from './Components/SaleForm/SaleForm';
import BuyCard from './Components/BuyCard/BuyCard';
import ProAddForm from './Components/Projects/ProAddForm';
import WastePickForm from './Components/WasteCollect/WastePickForm';
import UserCalendar from './Components/WasteCollect/UserCalendar';
import LocationMap from './Components/Maps/LocationMap';
import CalendarDisplay from './Components/UserCalendar/CalendarDisplay';
// Profile/Dashboard Pages
import BOwnerHome from './Pages/BOwnerHome';
import ClientProfile from './Components/Profile/ClientProfile';
import BOwnerProfile from './Components/Profile/BOwnerProfile';
import ClientEmail from './Components/Profile/ClientEmail';
import PickupReq from './Components/Profile/PickupReq';
import CheckBuySell from './Components/Profile/CheckBuySell';
// Admin Pages/Components
// import Admin from './Pages/Admin'; // Often the Dashboard is the main Admin landing
import AdCalendar from './Components/Admin/AdMinCalendar/AdCalendar';
import AdCheckReq from './Components/Admin/AdCheckReq/AdCheckReq';
import EmailDisplay from './Components/Admin/EmailDisplay/EmailDisplay';
import Dashboard from './Components/Admin/Dashboard/Dashboard';
import HandleBOwners from './Components/Admin/HandleBOwners/HandleBOwners';


// --- Helper ---
const parseUserInfoFromToken = (token) => {
    if (!token) {
        // console.log("[parseUserInfo] No token provided.");
        return null;
    }
    try {
        const decoded = jwtDecode(token);
        if (!decoded || typeof decoded !== 'object') {
             console.error("[parseUserInfo] Failed to decode token or decoded value is not an object.");
             localStorage.removeItem('token'); localStorage.removeItem('userInfo'); return null;
        }
        // Check expiration
        if (decoded.exp * 1000 < Date.now()) {
            console.warn("[parseUserInfo] Token expired at:", new Date(decoded.exp * 1000).toLocaleString());
            localStorage.removeItem('token'); localStorage.removeItem('userInfo'); return null;
        }
        // Check essential fields - ADJUST 'name' based on your JWT payload consistency
        if (!decoded.id || !decoded.email || !decoded.role || !decoded.name) {
            console.error("[parseUserInfo] Token is missing essential fields (id, email, role, name). Payload:", decoded);
             localStorage.removeItem('token'); localStorage.removeItem('userInfo'); return null;
        }
        console.log("[parseUserInfo] Token successfully decoded and validated. Role:", decoded.role);
        // Return consistent user object structure
        return {
            id: decoded.id,
            name: decoded.name, // Assumes backend always includes 'name' field in JWT for all roles
            email: decoded.email,
            role: decoded.role, // Should be 'admin', 'client', or 'businessOwner'
            ...(decoded.role === 'businessOwner' && decoded.businessName && { businessName: decoded.businessName }),
        };
    } catch (error) {
        console.error("[parseUserInfo] Error during token decoding:", error);
        localStorage.removeItem('token'); localStorage.removeItem('userInfo'); return null;
    }
};


// --- Main App Component ---
function App() {
    const [authState, setAuthState] = useState({
        isLoggedIn: false,
        userInfo: null,
        isLoading: true, // Start true until initial check completes
    });
    const [logoutMessage, setLogoutMessage] = useState('');
    const navigateRef = useRef(null); // For potential use by interceptors

    // --- Logout Function ---
    const handleLogout = useCallback((message = "You have been logged out.") => {
        console.log(`[App] handleLogout called. Message: "${message}"`);
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        setAuthState({ isLoggedIn: false, userInfo: null, isLoading: false }); // Update state
        setLogoutMessage(message); // Set message for AppContent to potentially redirect
        // Note: Actual navigation is handled by useEffect in AppContentWrapper based on logoutMessage
    }, []); // Empty dependency array as it doesn't depend on state/props


    // --- Authentication Check on Mount & Storage Changes ---
    useEffect(() => {
        console.log("[App CheckAuth Effect] Running initial auth check...");
        const token = localStorage.getItem('token');
        const parsedUser = parseUserInfoFromToken(token); // Centralized parsing and validation

        if (parsedUser) {
            // Token is valid and parsed correctly
            const storedUserInfo = localStorage.getItem('userInfo');
            if (JSON.stringify(parsedUser) !== storedUserInfo) {
                localStorage.setItem('userInfo', JSON.stringify(parsedUser)); // Sync storage if needed
            }
            console.log("[App CheckAuth Effect] Valid session found. Setting auth state. User:", parsedUser);
            setAuthState({ isLoggedIn: true, userInfo: parsedUser, isLoading: false });
        } else {
            // No valid token found (or expired/invalid)
            console.log("[App CheckAuth Effect] No valid session found.");
            // Ensure cleanup if state somehow became inconsistent
            if (authState.isLoggedIn || localStorage.getItem('token') || localStorage.getItem('userInfo')) {
                localStorage.removeItem('token');
                localStorage.removeItem('userInfo');
            }
            setAuthState({ isLoggedIn: false, userInfo: null, isLoading: false });
        }

        // Listener for storage events (sync across tabs)
        const handleStorageChange = (event) => {
            if (event.key === 'token' || event.key === 'userInfo') {
                console.log(`[App Storage Listener] Storage changed ('${event.key}'). Re-validating auth state.`);
                const currentToken = localStorage.getItem('token');
                const currentUserInfo = parseUserInfoFromToken(currentToken);
                // Update state only if it has actually changed compared to current state
                setAuthState(prevState => {
                    const newStateIsLoggedIn = !!currentUserInfo;
                    if (prevState.isLoggedIn !== newStateIsLoggedIn || JSON.stringify(prevState.userInfo) !== JSON.stringify(currentUserInfo)) {
                         console.log("[App Storage Listener] Auth state changed based on storage event. New state:", { isLoggedIn: newStateIsLoggedIn, userInfo: currentUserInfo });
                         if (currentUserInfo && JSON.stringify(currentUserInfo) !== localStorage.getItem('userInfo')) {
                             localStorage.setItem('userInfo', JSON.stringify(currentUserInfo)); // Keep storage synced
                         } else if (!currentUserInfo) {
                             localStorage.removeItem('userInfo'); // Ensure userInfo is removed if token invalidates
                         }
                         return { ...prevState, isLoggedIn: newStateIsLoggedIn, userInfo: currentUserInfo, isLoading: false };
                    }
                    return prevState; // No change needed
                });
            }
        };
        window.addEventListener('storage', handleStorageChange);

        return () => {
            console.log("[App CheckAuth Effect] Cleaning up storage listener.");
            window.removeEventListener('storage', handleStorageChange);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only once on initial mount


    // --- Login Success Handler ---
    const handleLoginSuccess = useCallback((token, backendUserData) => {
        console.log('[App] handleLoginSuccess triggered.');
        const parsedUser = parseUserInfoFromToken(token); // Use the token as the primary source of truth

        if (parsedUser) {
            console.log('%c[App] Login successful. Parsed user from token:', 'color: green; font-weight: bold;', parsedUser);
            localStorage.setItem('token', token);
            localStorage.setItem('userInfo', JSON.stringify(parsedUser));
            setAuthState({ isLoggedIn: true, userInfo: parsedUser, isLoading: false });
            setLogoutMessage(''); // Clear any prior logout message
            // Navigation is handled by AppContentWrapper's useEffect reacting to auth state change
        } else {
            console.error("[App] Login seemed successful (got token) but token was invalid upon parsing!");
            handleLogout("Login failed: Invalid session data received from server."); // Force logout
        }
    }, [handleLogout]); // Dependency on handleLogout


    // --- Global Logout Event Listener for 401s ---
    useEffect(() => {
        const handleAuthErrorEvent = (event) => {
            // Check if we are already logged out before triggering logout again
            setAuthState(currentState => {
                if (currentState.isLoggedIn) {
                    console.warn('[App] Global auth-error-401 listener: Triggering logout.');
                    const message = event.detail?.message || 'Your session has expired or is invalid. Please log in again.';
                    handleLogout(message); // Call logout
                    return { isLoggedIn: false, userInfo: null, isLoading: false }; // Immediately reflect logout state
                }
                // If already logged out, do nothing.
                console.log('[App] Global auth-error-401 listener: Ignored, user already logged out.');
                return currentState;
            });
        };
        window.addEventListener('auth-error-401', handleAuthErrorEvent);
        return () => {
            console.log("[App 401 Listener] Cleaning up auth-error-401 listener.");
            window.removeEventListener('auth-error-401', handleAuthErrorEvent);
        };
    }, [handleLogout]); // Depends on handleLogout


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
                <AppContentWrapper
                    logoutMessage={logoutMessage}
                    setLogoutMessage={setLogoutMessage}
                    navigateRef={navigateRef}
                />
            </Router>
        </AuthContext.Provider>
    );
}


// --- App Content Wrapper (Handles Routing and Effects needing Router context) ---
function AppContentWrapper({ logoutMessage, setLogoutMessage, navigateRef }) {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useAuth(); // Consume authentication context

    // Effect to set the navigate function for potential external use (e.g., interceptors)
    useEffect(() => {
        navigateRef.current = navigate;
    }, [navigate, navigateRef]);

    // --- Effect for Post-Login Redirect ---
    useEffect(() => {
        // Only run if user is logged in, has user info, and is currently on the login page
        if (auth.isLoggedIn && auth.userInfo && location.pathname.toLowerCase() === '/login') {
            const fromPath = location.state?.from?.pathname; // Path user was trying to access
            let redirectPath = '/'; // Default redirect path

            // Determine redirect path based on user role
            // *** IMPORTANT: Ensure these role strings ('admin', 'client', 'businessOwner')
            // *** exactly match the 'role' field coming from your backend JWT payload ***
            if (auth.userInfo.role === 'admin') {
                redirectPath = '/Admin/Dashboard';
            } else if (auth.userInfo.role === 'client') {
                redirectPath = '/ClientProfile'; // Redirect client to their profile
            } else if (auth.userInfo.role === 'businessOwner') {
                redirectPath = '/BOwnerHome'; // Redirect business owner to their home/dashboard
            } else {
                 console.warn(`[AppContent PostLogin] Unknown user role encountered: ${auth.userInfo.role}. Redirecting to default.`);
            }

            // Redirect to the intended 'from' path if it exists and isn't login/root, otherwise use role-based default
            const destination = (fromPath && fromPath !== '/login' && fromPath !== '/') ? fromPath : redirectPath;
            console.log(`%c[AppContent PostLogin] Conditions met. Navigating from /login to: ${destination}`, 'color: blue; font-weight: bold;');
            navigate(destination, { replace: true }); // Use replace to avoid login page in history
        }
    }, [auth.isLoggedIn, auth.userInfo, navigate, location]); // Dependencies


    // --- Effect to Handle Logout Messages from URL ---
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const msgParam = params.get('logoutMessage');
        if (msgParam) {
             // Avoid setting the message if it's already the same one
            if (msgParam !== logoutMessage) {
                console.log("[AppContent Message Check] Setting logout message from URL param:", msgParam)
                setLogoutMessage(msgParam);
            }
            // Clean the URL query parameters after processing the message
            window.history.replaceState({}, document.title, location.pathname);
        }
    }, [location.search, setLogoutMessage, logoutMessage]);


    // --- Effect to Redirect to Login if Logout Message Appears ---
    useEffect(() => {
        // If a logout message is set (meaning a logout just occurred) and we are NOT on the login page, redirect there.
        if (logoutMessage && location.pathname.toLowerCase() !== '/login') {
            console.log("[AppContent Logout Redirect] Logout message exists and not on login page. Redirecting to /login.");
            // Pass the message again via state, as query params were cleaned
            navigate(`/login`, { replace: true, state: { logoutMessage: logoutMessage } });
        }
    }, [logoutMessage, location.pathname, navigate]);


    // Determine if the admin view is active (for layout purposes)
    const isAdminView = auth.isLoggedIn && auth.userInfo?.role === 'admin';

    return (
        <div className={`App ${isAdminView ? 'admin-view' : 'user-view'}`}> {/* Added user-view class */}
            {/* Render Navbar only if not in admin view */}
            {!isAdminView && (
                <Navbar isLoggedIn={auth.isLoggedIn} userInfo={auth.userInfo} handleLogout={auth.logout} />
            )}

            {/* Show logout message ONLY on the login page */}
            {logoutMessage && location.pathname.toLowerCase() === '/login' && (
                 <div
                    className="alert alert-warning global-message" // Ensure CSS for this exists
                    onClick={() => setLogoutMessage('')} // Allow dismissing
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

            {/* Main content area where routes are rendered */}
            <main className={`main-content ${isAdminView ? 'admin-main' : ''}`}>
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
                    <Route path="/SignUp" element={<SignUp />} /> {/* Links to specific reg forms */}
                    <Route path="/BOwnerForm" element={<BOwnerForm />} />
                    <Route path="/ClientForm" element={<ClientForm />} />

                    {/* --- Login Route --- */}
                    {/* If already logged in, redirect away from login based on role */}
                    {/* Otherwise, render the Login component */}
                    <Route
                        path="/Login"
                        element={
                            auth.isLoggedIn && auth.userInfo ? (
                                <Navigate to={
                                    auth.userInfo.role === 'admin' ? '/Admin/Dashboard' :
                                    auth.userInfo.role === 'client' ? '/ClientProfile' :
                                    auth.userInfo.role === 'businessOwner' ? '/BOwnerHome' :
                                    '/' // Fallback redirect
                                } replace />
                            ) : (
                                <Login onLoginSuccess={auth.login} /> // Pass login handler from context
                            )
                        }
                    />

                    {/* === Protected Client Routes === */}
                    {/* All routes within this element require the 'client' role */}
                    <Route element={<ProtectedRoute requiredRole="client" />}>
                        <Route path="/ClientProfile" element={<ClientProfile />} />
                        <Route path="/PickupReq" element={<PickupReq />} />
                        <Route path="/CheckBuySell" element={<CheckBuySell />} />
                        <Route path="/ClientEmail" element={<ClientEmail />} />
                        <Route path="/UserCalendar" element={<UserCalendar userInfo={auth.userInfo} />} /> {/* Pass userInfo if needed */}
                        <Route path="/CalendarDisplay" element={<CalendarDisplay />} />
                        <Route path="/SaleForm" element={<SaleForm />} />
                        <Route path="/BuyCard" element={<BuyCard />} />
                        <Route path="/WastePickForm" element={<WastePickForm />} />
                        <Route path="/LocationMap" element={<LocationMap />} />
                    </Route>

                    {/* === Protected Business Owner Routes === */}
                     {/* All routes within this element require the 'businessOwner' role */}
                    <Route element={<ProtectedRoute requiredRole="businessOwner" />}>
                         <Route path="/BOwnerHome" element={<BOwnerHome userInfo={auth.userInfo} />} />
                         <Route path="/BOwnerProfile" element={<BOwnerProfile />} />
                         <Route path="/ProAddForm" element={<ProAddForm />} />
                         {/* Add any other Business Owner specific routes here */}
                    </Route>

                     {/* === Protected Admin Routes === */}
                     {/* All routes within this element require the 'admin' role */}
                     <Route element={<ProtectedRoute requiredRole="admin" />}>
                        {/* Use the AdminLayout for consistent sidebar/header */}
                        <Route element={<AdminLayout handleLogout={auth.logout} />}>
                           {/* Redirect base /Admin path to the dashboard */}
                           <Route path="/Admin" element={<Navigate to="/Admin/Dashboard" replace />} />
                           <Route path="/Admin/Dashboard" element={<Dashboard />} />
                           <Route path="/Admin/Settings" element={<AdCalendar />} /> {/* Example: Using AdCalendar for settings path */}
                           <Route path="/Admin/Requests" element={<AdCheckReq />} />
                           <Route path="/Admin/Emails" element={<EmailDisplay />} />
                           <Route path="/Admin/ManageOwners" element={<HandleBOwners />} />
                           {/* Add other Admin-specific routes here */}
                        </Route>
                     </Route>
                </Routes>
            </main>

             {/* Render Footer only if not in admin view */}
            {!isAdminView && <Footer1 />}
        </div>
    );
}

export default App;