import React, { useState, useEffect, useCallback, createContext, useContext, useRef } from 'react';
import {
    BrowserRouter as Router, Routes, Route, useNavigate,
    useLocation, Navigate, Outlet, Link
} from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext); 

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
import Login from './Components/Login/Login';
import BOwnerForm from './Components/RegistrationForm/BOwnerForm';
import ClientForm from './Components/RegistrationForm/ClientForm';
import CollectorForm from './Components/RegistrationForm/CollectorForm';
import CollectorLogin from './Components/Login/CollectorLogin'

import Calculate from './Components/Calculate/Calculate';
import SaleForm from './Components/SaleForm/SaleForm';
import BuyCard from './Components/BuyCard/BuyCard';
import ProAddForm from './Components/Projects/ProAddForm';
import WastePickForm from './Components/WasteCollect/WastePickForm';
import UserCalendar from './Components/WasteCollect/UserCalendar';
import LocationMap from './Components/Maps/LocationMap';
import CalendarDisplay from './Components/UserCalendar/CalendarDisplay'; 

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
import BSHeader from './Components/BuyandSell/BSHeader';

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


function App() {
    const [authState, setAuthState] = useState({
        isLoggedIn: false, userInfo: null, isLoading: true,
    });
    const [logoutMessage, setLogoutMessage] = useState('');
    const navigateRef = useRef(null);

    // Logout 
    const handleLogout = useCallback((message = "You have been logged out.") => {
        console.log(`[App] handleLogout. Message: "${message}"`);
        localStorage.removeItem("token"); localStorage.removeItem("userInfo");
        setAuthState({ isLoggedIn: false, userInfo: null, isLoading: false });
        setLogoutMessage(message);
    }, []);

    // Auth Check
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

        // Storage setup
         const handleStorageChange = (event) => {
            if (event.key === 'token' || event.key === 'userInfo') {
                 console.log(`[App Storage Listener] Storage changed ('${event.key}'). Re-validating auth.`);
                 const currentToken = localStorage.getItem('token');
                 const currentUserInfo = parseUserInfoFromToken(currentToken);
                 setAuthState(prevState => { 
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

    }, []); 

    // Login Success 
    const handleLoginSuccess = useCallback((token, backendUserData) => {
        console.log('[App] handleLoginSuccess.');
        const parsedUser = parseUserInfoFromToken(token);
        if (parsedUser) {
            console.log('%c[App] Login OK. Updating AuthState.', 'color: green; font-weight: bold;', parsedUser);
            localStorage.setItem('token', token);
            localStorage.setItem('userInfo', JSON.stringify(parsedUser)); // Store parsedUser
            setAuthState({ isLoggedIn: true, userInfo: parsedUser, isLoading: false });
            setLogoutMessage('');
        } else {
            console.error("[App] Login token invalid after successful login!");
            handleLogout("Login failed: Invalid session data.");
        }
    }, [handleLogout]);

    useEffect(() => {
        const handleAuthErrorEvent = (event) => {
            setAuthState(currentState => {
                if (currentState.isLoggedIn) {
                    console.warn('[App] Global 401 listener: Triggering logout.');
                    const message = event.detail?.message || 'Session expired/invalid.';
                    handleLogout(message); 
                   
                }
                return currentState; 
            });
        };
        window.addEventListener('auth-error-401', handleAuthErrorEvent);
        return () => window.removeEventListener('auth-error-401', handleAuthErrorEvent);
    }, [handleLogout]); 

    // Loading Screen
    if (authState.isLoading) {
        return ( <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}> <ClipLoader size={60} color="#f97316" /> </div> );
    }

    return (
        <AuthContext.Provider value={{ ...authState, logout: handleLogout, login: handleLoginSuccess }}>
            <Router>
                <AppContentWrapper
                    logoutMessage={logoutMessage}
                    setLogoutMessage={setLogoutMessage}
                    navigateRef={navigateRef}
                />
            </Router
>        </AuthContext.Provider>
    );
}


// --- App Content Wrapper Component ---
function AppContentWrapper({ logoutMessage, setLogoutMessage, navigateRef }) {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useAuth();

    useEffect(() => { navigateRef.current = navigate; return () => { navigateRef.current = null; }; }, [navigate, navigateRef]);

    // Post-Login
    useEffect(() => {
        if (auth.isLoggedIn && auth.userInfo && location.pathname.toLowerCase() === '/login') {
            const fromPath = location.state?.from?.pathname;
            let redirectPath = '/';
            if (auth.userInfo.role === 'admin') redirectPath = '/Admin/Dashboard';
            else if (auth.userInfo.role === 'client') redirectPath = '/ClientProfile'; 
            else if (auth.userInfo.role === 'businessOwner') redirectPath = '/BOwnerHome';
            const destination = (fromPath && fromPath !== '/login' && fromPath !== '/') ? fromPath : redirectPath;
            console.log(`%c[AppContent PostLogin] Navigating from /login to: ${destination}`, 'color: blue;');
            navigate(destination, { replace: true });
        }
    }, [auth.isLoggedIn, auth.userInfo, navigate, location]);

    // Handle Logout Messages
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const msgParam = params.get('logoutMessage');
        if (msgParam) {
            if (msgParam !== logoutMessage) setLogoutMessage(msgParam);
            
            const newUrl = location.pathname; 
            window.history.replaceState({}, document.title, newUrl);
        }
    }, [location.search, location.pathname, setLogoutMessage, logoutMessage]);

    useEffect(() => {
        if (logoutMessage && location.pathname.toLowerCase() !== '/login') {
            console.log("[AppContent LogoutRedirect] Redirecting to login due to logout message.");
            navigate(`/login`, { replace: true, state: { logoutMessage: logoutMessage } });
        }
    }, [logoutMessage, location.pathname, navigate]);

    return (
        <div className="App"> 
            <Navbar isLoggedIn={auth.isLoggedIn} userInfo={auth.userInfo} handleLogout={auth.logout} />


            <main className="main-content">
                <Routes>
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
                    <Route path="/CollectorForm" element={<CollectorForm />} />
                    <Route path="/CollectorLogin" element={<CollectorLogin />} />
                    <Route path="/CalendarDisplay" element={<CalendarDisplay />} />

                    <Route path="/Login" element={
                            auth.isLoggedIn && auth.userInfo ? (
                                <Navigate to={ auth.userInfo.role === 'admin' ? '/Admin/Dashboard' : auth.userInfo.role === 'client' ? '/ClientProfile' : auth.userInfo.role === 'businessOwner' ? '/BOwnerHome' : '/' } replace />
                            ) : ( <Login onLoginSuccess={auth.login} /> )
                        }
                    />

                    <Route element={<ProtectedRoute requiredRole="client" />}>
                        <Route path="/UserCalendar" element={<UserCalendar userInfo={auth.userInfo} />} />
                        <Route path="/ClientProfile" element={<ClientProfile />} />
                        <Route path="/PickupReq" element={<PickupReq />} />
                        <Route path="/CheckBuySell" element={<CheckBuySell />} />
                        <Route path="/ClientEmail" element={<ClientEmail />} />
                        <Route path="/BSHeader" element={<BSHeader />} />
                        <Route path="/BuyCard" element={<BuyCard />} />
                        <Route path="/WastePickForm" element={<WastePickForm />} />
                        <Route path="/LocationMap" element={<LocationMap />} />
                    </Route>

                    <Route element={<ProtectedRoute requiredRole="businessOwner" />}>
                         <Route path="/BOwnerHome" element={<BOwnerHome userInfo={auth.userInfo} />} />
                         <Route path="/BusinessDashboard" element={<BOwnerHome />} />
                         <Route path="/BOwnerProfile" element={<BOwnerProfile />} />
                         <Route path="/ProAddForm" element={<ProAddForm />} />
                         <Route path="/SaleForm" element={<SaleForm />} />
                    </Route>

                     <Route element={<ProtectedRoute requiredRole="admin" />}>
                        <Route element={<AdminLayout handleLogout={auth.logout} />}>
                           <Route path="/Admin" element={<Navigate to="/Admin/Dashboard" replace />} /> 
                           <Route path="/Admin/Dashboard" element={<Dashboard />} />
                           <Route path="/Admin/Calendar" element={<AdCalendar />} /> 
                           <Route path="/Admin/Requests" element={<AdCheckReq />} />
                           <Route path="/Admin/Scrap" element={<AdScrap />} />
                           <Route path="/Admin/Emails" element={<EmailDisplay />} />
                           <Route path="/Admin/ManageOwners" element={<HandleBOwners />} />
                        </Route>
                     </Route>
                    </Routes>
            </main>

            <Footer1 />
        </div>
    );
}

export default App;