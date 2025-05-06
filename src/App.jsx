// src/App.jsx
import React, { useState, useEffect, useCallback, createContext, useContext, useRef } from 'react'; // Added useRef
import {
    BrowserRouter as Router, Routes, Route, useNavigate,
    useLocation, Navigate, Outlet, Link
} from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { jwtDecode } from 'jwt-decode';

// --- Context ---
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// --- Core Components & Pages ---
import Navbar from './Components/Navbar/Navbar';
import Footer1 from './Components/Footer1/Footer';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminLayout from './Layouts/AdminLayout';
import API_ENDPOINTS from "./apiConfig";
import axiosInstance from './api/axiosInstance';

// Pages (ensure all imports are correct)
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
import ContactUs from './Pages/ContactUs';
import SaleForm from './Components/SaleForm/SaleForm';
import BuyCard from './Components/BuyCard/BuyCard';
import BOwnerHome from './Pages/BOwnerHome';
import ProAddForm from './Components/Projects/ProAddForm';
import WastePickForm from './Components/WasteCollect/WastePickForm';
import UserCalendar from './Components/WasteCollect/UserCalendar';
import Admin from './Pages/Admin';
import AdCalendar from './Components/Admin/AdMinCalendar/AdCalendar';
import LocationMap from './Components/Maps/LocationMap';
// Use the SIMPLIFIED ClientProfile for debugging first
// import ClientProfile from './Components/Profile/ClientProfile';
const ClientProfile = () => { // TEMPORARY SIMPLIFIED COMPONENT
    useEffect(() => { console.log('%c--- Simple ClientProfile Component Mounted ---', 'color: green; font-weight: bold;'); }, []);
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    return (<div style={{ border: '3px solid blue', padding: '20px', margin: '20px', backgroundColor: '#eef' }}>
            <h1>Client Profile Page Reached! (Simplified)</h1>
            <pre>{JSON.stringify(userInfo, null, 2)}</pre>
            <Link to="/">Go Home</Link>
        </div>);
};
import ClientEmail from './Components/Profile/ClientEmail';
import CalendarDisplay from './Components/UserCalendar/CalendarDisplay';
import BOwnerProfile from './Components/Profile/BOwnerProfile';
import AdCheckReq from './Components/Admin/AdCheckReq/AdCheckReq';
import EmailDisplay from './Components/Admin/EmailDisplay/EmailDisplay';
import Dashboard from './Components/Admin/Dashboard/Dashboard';
import HandleBOwners from './Components/Admin/HandleBOwners/HandleBOwners';
import PickupReq from './Components/Profile/PickupReq';
import CheckBuySell from './Components/Profile/CheckBuySell';


// --- Helper ---
const parseUserInfo = (token) => { /* ... (keep as is from previous version) ... */
    if (!token) return null;
    try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now() && decoded.id) {
            return { id: decoded.id, name: decoded.name || decoded.ownerName || 'User', email: decoded.email || null, role: decoded.role || (decoded.userType === 'bowner' ? 'bowner' : (decoded.userType === 'client' ? 'client' : 'unknown')), businessName: decoded.businessName || null, };
        } else { console.log("[parseUserInfo] Token expired."); }
    } catch (error) { console.error("[parseUserInfo] Error decoding token:", error); }
    return null;
};

// --- Main App Component ---
function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [logoutMessage, setLogoutMessage] = useState('');

    // Ref to track previous login state to prevent multiple logout triggers
    const isLoggedInRef = useRef(isLoggedIn);
    useEffect(() => { isLoggedInRef.current = isLoggedIn; }, [isLoggedIn]);

    // --- Logout Function ---
    const handleLogout = useCallback((message = "You have been logged out successfully.") => {
        console.log('[App] handleLogout called. Message:', message);
        localStorage.removeItem("token"); localStorage.removeItem("userInfo");
        setIsLoggedIn(false); setUserInfo(null);
        window.location.href = `/login?logoutMessage=${encodeURIComponent(message)}`;
    }, []);

    // --- Silent Logout ---
    const handleLogoutSilently = useCallback(() => {
        console.log('[App] handleLogoutSilently called.');
        localStorage.removeItem("token"); localStorage.removeItem("userInfo");
        setIsLoggedIn(false); setUserInfo(null);
    }, []);

    // --- Authentication Check ---
    const checkAuthStatus = useCallback(() => {
        console.log("[App CheckAuth] Running check...");
        // Don't set loading true here if already false, prevents flicker on hot reload
        // setAuthLoading(true);
        const token = localStorage.getItem('token');
        const parsedUser = parseUserInfo(token);

        if (parsedUser) {
            if (!isLoggedInRef.current || JSON.stringify(userInfo) !== JSON.stringify(parsedUser)) { // Update only if needed
                console.log("[App CheckAuth] Valid token found. Setting state. User:", parsedUser);
                setUserInfo(parsedUser); setIsLoggedIn(true);
                localStorage.setItem('userInfo', JSON.stringify(parsedUser));
            } else {
                 console.log("[App CheckAuth] Valid token found, state already up-to-date.");
            }
        } else {
            if (isLoggedInRef.current) { // Only logout if previously logged in
                console.log("[App CheckAuth] No valid token, logging out silently.");
                handleLogoutSilently();
            } else {
                 console.log("[App CheckAuth] No valid token, already logged out.");
                  // Ensure state is correct if somehow inconsistent
                 if (isLoggedIn || userInfo) {
                    setIsLoggedIn(false); setUserInfo(null);
                 }
            }
        }
        // Ensure loading is set to false *after* state is potentially updated
        if (authLoading) setAuthLoading(false);
        console.log("[App CheckAuth] Check complete.");
    }, [handleLogoutSilently, authLoading, userInfo]); // Dependencies refined

    // --- Run Auth Check on Initial Load & Token Changes (e.g., login/logout) ---
    useEffect(() => {
        checkAuthStatus();
        // Optional: Add listener for storage changes from other tabs (more complex)
        // window.addEventListener('storage', checkAuthStatus);
        // return () => window.removeEventListener('storage', checkAuthStatus);
    }, []); // Run only once on initial mount

    // --- Login Success Handler ---
    const handleLoginSuccess = useCallback((token) => {
        console.log('[App] handleLoginSuccess called.');
        const parsedUser = parseUserInfo(token);
        if (parsedUser) {
            localStorage.setItem('token', token);
            localStorage.setItem('userInfo', JSON.stringify(parsedUser));
            setUserInfo(parsedUser);
            setIsLoggedIn(true);
            setLogoutMessage(''); // Clear any previous logout message
             // --- LOGGING STATE UPDATE ---
             console.log('%c[App] Login successful. STATE UPDATED.', 'color: green; font-weight: bold;', { userInfo: parsedUser, isLoggedIn: true });
             // --- END LOGGING ---
             // Navigation is handled by AppContent's useEffect after this state update completes
        } else {
            console.error("[App] Login successful but received invalid token!");
            handleLogout("Login failed due to invalid token data.");
        }
    }, [handleLogout]);

    // --- Global Logout Event Listener ---
    useEffect(() => {
        const handleAuthError = (event) => {
            console.log('[App] Caught global auth-error-401 event');
            const message = event.detail?.message || 'Your session has expired. Please log in again.';
            if (isLoggedInRef.current) { // Use ref to check state at time of event
                handleLogout(message);
            } else {
                 console.log('[App] Ignored auth-error-401 as user is already logged out.');
            }
        };
        window.addEventListener('auth-error-401', handleAuthError);
        return () => window.removeEventListener('auth-error-401', handleAuthError);
    }, [handleLogout]); // handleLogout is stable

    // --- Display loading spinner ---
    if (authLoading) {
        return ( <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}> <ClipLoader size={60} color="#f97316" loading={authLoading} /> </div> );
    }

    return (
        // Provide auth state via context if desired
        // <AuthContext.Provider value={{ isLoggedIn, userInfo, authLoading }}>
            <Router>
                <AppContent
                    isLoggedIn={isLoggedIn} // Pass current state
                    userInfo={userInfo} // Pass current state
                    handleLogout={handleLogout}
                    handleLoginSuccess={handleLoginSuccess}
                    logoutMessage={logoutMessage}
                    setLogoutMessage={setLogoutMessage}
                />
            </Router>
        // </AuthContext.Provider>
    );
}


// --- AppContent Component (Handles Routing & Message Display) ---
function AppContent({ isLoggedIn, userInfo, handleLogout, handleLoginSuccess, logoutMessage, setLogoutMessage }) {
    const navigate = useNavigate();
    const location = useLocation();

     // --- LOGGING STATE RECEIVED FROM APP ---
     console.log('%c[AppContent Render]', 'color: purple; font-weight: bold;', {
         pathname: location.pathname,
         isLoggedIn_Prop: isLoggedIn, // Log the prop value
         userInfo_Prop: userInfo, // Log the prop value
         locationState: location.state // Log the state passed during navigation (e.g., from ProtectedRoute)
     });
     // --- END LOGGING ---

    // --- Effect for Post-Login Redirect ---
    useEffect(() => {
        console.log('%c[AppContent PostLogin Check Effect] Running...', 'color: orange;', { isLoggedIn, userInfo, pathname: location.pathname });
        if (isLoggedIn && userInfo && location.pathname.toLowerCase() === '/login') {
            const fromPath = location.state?.from?.pathname;
            let redirectPath = '/'; // Default
            if (userInfo.role === 'admin') redirectPath = '/Admin/Dashboard';
            else if (userInfo.role === 'client') redirectPath = '/ClientProfile'; // <<< Target Path
            // else if (userInfo.role === 'bowner') redirectPath = '/BOwnerHome';

            const destination = (fromPath && fromPath !== '/login') ? fromPath : redirectPath;
            console.log(`%c[AppContent PostLogin Check Effect] Conditions MET. Navigating to: ${destination}`, 'color: green;');
            navigate(destination, { replace: true });
        } else {
             console.log(`%c[AppContent PostLogin Check Effect] Conditions NOT MET for redirect.`, 'color: grey;');
        }
    }, [isLoggedIn, userInfo, navigate, location]); // Dependencies are correct


    // --- Effect to Handle Session Expired/Logout Messages ---
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const msgParam = params.get('logoutMessage');
        const expiredParam = params.get('sessionExpired');
        let messageToShow = '';
        if (msgParam) messageToShow = msgParam;
        else if (expiredParam === 'true') messageToShow = 'Your session has expired. Please log in again.';

        if (messageToShow && messageToShow !== logoutMessage) { // Update only if message changes
            console.log("[AppContent Message Check] Setting message from URL:", messageToShow)
            setLogoutMessage(messageToShow);
            window.history.replaceState({}, document.title, location.pathname);
        }
         // Maybe clear the message after a delay if desired?
         // if (messageToShow) { setTimeout(() => setLogoutMessage(''), 7000); }

    }, [location, setLogoutMessage, logoutMessage]); // Add logoutMessage to dependency

    const isAdmin = isLoggedIn && userInfo?.role === 'admin';

    return (
        <div className={`App ${isAdmin ? 'admin-view' : ''}`}>
            {!isAdmin && ( <Navbar isLoggedIn={isLoggedIn} userInfo={userInfo} handleLogout={handleLogout} /> )}

            {logoutMessage && (
                 <div className="alert alert-warning global-message" onClick={() => setLogoutMessage('')} title="Click to dismiss"> {logoutMessage} </div>
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
                    {/* Login Route */}
                    <Route path="/Login" element={isLoggedIn ? <Navigate to="/" replace /> : <Login onLoginSuccess={handleLoginSuccess} />} />

                    {/* === Protected Client Routes === */}
                    <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="client" />}>
                        {/* Using the simplified ClientProfile for testing */}
                        <Route path="/ClientProfile" element={<ClientProfile />} />
                        <Route path="/PickupReq" element={<PickupReq />} />
                        <Route path="/CheckBuySell" element={<CheckBuySell />} />
                        <Route path="/ClientEmail" element={<ClientEmail />} />
                        <Route path="/UserCalendar" element={<UserCalendar userInfo={userInfo} />} />
                        <Route path="/CalendarDisplay" element={<CalendarDisplay />} />
                        <Route path="/SaleForm" element={<SaleForm />} />
                        <Route path="/BuyCard" element={<BuyCard />} />
                        <Route path="/WastePickForm" element={<WastePickForm />} />
                        <Route path="/LocationMap" element={<LocationMap />} />
                    </Route>

                    {/* === Protected Business Owner Routes === */}
                    <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="bowner" />}>
                         <Route path="/BOwnerHome" element={<BOwnerHome userInfo={userInfo} />} />
                         <Route path="/BOwnerProfile" element={<BOwnerProfile />} />
                         <Route path="/ProAddForm" element={<ProAddForm />} />
                    </Route>

                     {/* === Protected Admin Routes === */}
                     <Route element={ <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin" /> }>
                        <Route element={<AdminLayout handleLogout={handleLogout} />}>
                           <Route index path="/Admin" element={<Dashboard />} />
                           <Route path="/Admin/Dashboard" element={<Dashboard />} />
                           <Route path="/Admin/Settings" element={<AdCalendar />} />
                           <Route path="/Admin/Requests" element={<AdCheckReq />} />
                           <Route path="/Admin/Emails" element={<EmailDisplay />} />
                           <Route path="/Admin/ManageOwners" element={<HandleBOwners />} />
                        </Route>
                     </Route>

                    {/* Unauthorized Page */}
                    <Route path="/unauthorized" element={<div><h2>Unauthorized Access</h2><p>You do not have permission to view this page.</p><Link to="/">Go Home</Link></div>} />

                    {/* Catch-all 404 */}
                    <Route path="*" element={<div><h2>404 Not Found</h2><p>Sorry, the page you requested does not exist.</p><Link to="/">Go Home</Link></div>} />
                </Routes>
            </main>

            {!isAdmin && <Footer1 />}
        </div>
    );
}

export default App;