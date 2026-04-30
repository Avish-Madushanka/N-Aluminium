import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useNavigate,
    useLocation,
    Navigate,
    Link
} from 'react-router-dom';
import ScrollToTop from "./ScrollToTop";

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
import AboutUSDiagram from './Components/AboutUs/AboutUSDiagram'
import BuyandSell from './Pages/BuyandSell';
import Project from './Pages/Project';
import Collection from './Pages/Collection';
import Service from './Pages/Service';
import Map from './Pages/Map';
import ContactUs from './Pages/ContactUs';
import UnauthorizedPage from './Pages/UnauthorizedPage';
import Login from './Components/Login/Login';
import ItemMarkert from './Components/ItemMarkert/ItemMarkert';
import ClientForm from './Components/RegistrationForm/ClientForm';
import Calculate from './Components/Calculate/Calculate';
import ProAddForm from './Components/Projects/ProAddForm';
import WastePickForm from './Components/WasteCollect/WastePickForm';
import UserCalendar from './Components/WasteCollect/UserCalendar';
import LocationMap from './Components/Maps/LocationMap';
import CalendarDisplay from './Components/UserCalendar/CalendarDisplay';
import BSHeader from './Components/BuyandSell/BSHeader';
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
import AdminLocationManager from './Components/Admin/AdMapUpdate/AdminLocationManager';
import FloatingChatbot from './Components/ChatBot/FloatingChatbot';
import AluTReg from './Pages/AluTReg';
import GlassOrder from './Components/ItemMarkert/GlassOrder';
import AluRegVideoUp from './Components/AluTReg/AluRegVideoUp';
import ItemAddForm from './Components/Admin/ItemsAddForm/ItemsAddForm';
import AluTRegForm from './Components/AluTReg/AluTRegForm';
import ItemsManage from './Components/Admin/ItemsAddForm/ItemsManage';
import ItemsCartManage from './Components/ItemMarkert/ItemsCartManage';
import AccItemReq from './Components/Admin/ItemsAddForm/AccItemReq';
import AdminAlumni from './Components/Admin/AluTRegManage/AdminAlumni';
import VideoManage from './Components/Admin/VideoManage/VideoManage';
import ProManage from './Components/Admin/ProjectManage/ProManage';
import SaleForm from './Components/BuyandSell/SaleForm';
import BuyandSellManage from './Components/Admin/BuyandSellManage/BuyandSellManage';
import Cookie from './Components/LegalPolicy/Cookie';
import Terms from './Components/LegalPolicy/Terms';
import Privacy from './Components/LegalPolicy/Privacy';
import GlassOrderCheckout from './Components/ItemMarkert/GlassOrderCheckout';
import AdGlassManage from './Components/Admin/AdGlassManage/AdGlassManage';
import AdminOrderManage from './Components/Admin/AdGlassManage/AdminOrderManage';
import MyOrders from './Components/ItemMarkert/MyOrders';
import AluminumQuotationSystem from './Components/AluminumQuotationSystem/AluminumQuotationSystem';
import AdQuotation from './Components/Admin/AdQuotation/AdQuotation';
import AluminumSystem3D from './Components/AluminumSystem3D/AluminumSystem3D';
import Items3Dview from './Components/Items3Dview/Items3Dview';

const parseUserInfoFromToken = (token) => {
    if (!token) {
        return null;
    }
    try {
        const decoded = jwtDecode(token);
        if (!decoded || typeof decoded !== 'object' || !decoded.exp || !decoded.id || !decoded.email || !decoded.role || typeof decoded.name === 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
            return null;
        }

        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
            return null;
        }

        return {
            id: decoded.id,
            name: decoded.name,
            email: decoded.email,
            role: decoded.role,
            ...(decoded.role === 'businessOwner' && decoded.businessName && { businessName: decoded.businessName }),
        };
    } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        return null;
    }
};

function App() {
    const [authState, setAuthState] = useState({
        isLoggedIn: false,
        userInfo: null,
        isLoading: true,
    });
    const [logoutMessage, setLogoutMessage] = useState('');
    const navigateRef = useRef(null);

    const handleLogout = useCallback((message = "You have been logged out.") => {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        sessionStorage.removeItem('redirectAfterLogin');
        sessionStorage.removeItem('attemptedPath');
        sessionStorage.removeItem('requiredRole');
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
                localStorage.removeItem('token');
                localStorage.removeItem('userInfo');
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
            handleLogout("Login failed: Invalid session data received from server. Please try again.");
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

function AppContentWrapper({ logoutMessage, setLogoutMessage, navigateRef }) {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useAuth();
    const [orderItems, setOrderItems] = useState([]);

    useEffect(() => {
        const storedItems = localStorage.getItem('glassOrderItems');
        if (storedItems) {
            try {
                setOrderItems(JSON.parse(storedItems));
            } catch (e) {
                console.error('Failed to parse glassOrderItems:', e);
                setOrderItems([]);
            }
        }
    }, []);

    const handleResetOrder = () => {
        localStorage.removeItem('glassOrderItems');
        setOrderItems([]);
        navigate('/ItemMarkert');
    };

    useEffect(() => {
        if (navigateRef) navigateRef.current = navigate;
        return () => { if (navigateRef) navigateRef.current = null; };
    }, [navigate, navigateRef]);

    useEffect(() => {
        const currentPath = location.pathname.toLowerCase();
        const storedRedirectPath = sessionStorage.getItem('redirectAfterLogin');
        
        if (auth.isLoggedIn && auth.userInfo && currentPath === '/login') {
            let redirectPath = null;
            
            if (storedRedirectPath && storedRedirectPath !== '/login' && storedRedirectPath !== '/Login') {
                redirectPath = storedRedirectPath;
                sessionStorage.removeItem('redirectAfterLogin');
            }
            
            const fromPath = location.state?.from?.pathname;
            if (!redirectPath && fromPath && fromPath !== '/login' && fromPath !== '/Login' && fromPath !== '/') {
                redirectPath = fromPath;
            }
            
            if (!redirectPath) {
                switch (auth.userInfo.role) {
                    case 'admin': 
                        redirectPath = '/Admin/Dashboard'; 
                        break;
                    case 'businessOwner': 
                        redirectPath = '/BOwnerHome'; 
                        break;
                    case 'client': 
                        redirectPath = '/'; 
                        break;
                    default: 
                        redirectPath = '/';
                }
            }
            
            navigate(redirectPath, { replace: true, state: {} });
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
        if (logoutMessage && currentPath !== '/login' && !auth.isLoggedIn) {
            navigate(`/login`, { replace: true, state: { logoutMessage: logoutMessage } });
        }
    }, [logoutMessage, location.pathname, navigate, auth.isLoggedIn]);

    const popupStyle = {
        position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)',
        padding: '15px 25px', backgroundColor: '#fff3cd', color: '#856404',
        border: '1px solid #ffeeba', borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', zIndex: 1050,
        textAlign: 'center', maxWidth: 'calc(100% - 40px)', width: 'auto', minWidth: '300px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    };
    const closeButtonStyle = {
        background: 'none', border: 'none', color: 'inherit',
        fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer',
        padding: '0 0.5rem', marginLeft: '15px', lineHeight: '1',
    };

    return (
        <div className="App-wrapper">
            <ScrollToTop />
            <Navbar isLoggedIn={auth.isLoggedIn} userInfo={auth.userInfo} handleLogout={auth.logout} />
            
            {logoutMessage && (location.pathname.toLowerCase() === '/login') && (
                 <div style={popupStyle} role="alert">
                    <span>{logoutMessage}</span>
                    <button onClick={() => setLogoutMessage('')} title="Dismiss message" style={closeButtonStyle} aria-label="Close message">×</button>
                 </div>
            )}

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
                    <Route path="/ClientForm" element={<ClientForm />} />
                    <Route path="/CalendarDisplay" element={<CalendarDisplay />} />
                    <Route path="/BSHeader" element={<BSHeader />} />
                    <Route path="/unauthorized" element={<UnauthorizedPage />} />
                    <Route path="/LocationMap" element={<LocationMap />} />
                    <Route path="/AboutUSDiagram" element={<AboutUSDiagram />} />
                    <Route path="/ItemMarkert" element={<ItemMarkert />} />
                    <Route path="/AluTReg" element={<AluTReg />} />
                    <Route path="/AluRegVideoUp" element={<AluRegVideoUp /> } />
                    <Route path="/AluTRegForm" element={<AluTRegForm /> } />
                    <Route path="/SaleForm" element={<SaleForm /> } />
                    <Route path="/Items3Dview" element={<Items3Dview /> } />
                    
                    <Route path="/Cookie" element={<Cookie />} />
                    <Route path="/Terms" element={<Terms />} />
                    <Route path="/Privacy" element={<Privacy />} />
                    <Route path="/test-items" element={<ItemsManage />} />

                    <Route path="/Login" element={
                        auth.isLoggedIn && auth.userInfo ? 
                        (<Navigate to="/" replace />) : 
                        (<Login />)
                    } />
                    
                    <Route element={<ProtectedRoute requiredRole="client" />}>
                        <Route path="/UserCalendar" element={<UserCalendar userInfo={auth.userInfo} />} />
                        <Route path="/PickupReq" element={<PickupReq />} />
                        <Route path="/CheckBuySell" element={<CheckBuySell />} />
                        <Route path="/ClientEmail" element={<ClientEmail />} />
                        <Route path="/WastePickForm" element={<WastePickForm />} />
                        <Route path="/GlassOrder" element={<GlassOrder /> } />
                        <Route path="/GlassOrderCheckout" element={<GlassOrderCheckout selectedItems={orderItems} onReset={handleResetOrder} /> } />
                        <Route path="/ItemsCartManage" element={<ItemsCartManage /> } />
                        <Route path="/MyOrders" element={<MyOrders /> } />
                        <Route path="/AluminumQuotationSystem" element={<AluminumQuotationSystem /> } />
                        <Route path="/AluminumSystem3D" element={<AluminumSystem3D /> } />
                    </Route>

                    <Route element={<ProtectedRoute requiredRole="admin" />}>
                        <Route element={<AdminLayout handleLogout={auth.logout} userInfo={auth.userInfo} />}>
                           <Route path="/Admin" element={<Navigate to="/Admin/Dashboard" replace />} /> 
                           <Route path="/Admin/Dashboard" element={<Dashboard />} />
                           <Route path="/Admin/Calendar" element={<AdCalendar />} /> 
                           <Route path="/Admin/Requests" element={<AdCheckReq />} />
                           <Route path="/Admin/Scrap" element={<AdScrap />} />
                           <Route path="/Admin/Emails" element={<EmailDisplay />} />
                           <Route path="/Admin/ManageOwners" element={<HandleBOwners />} />
                           <Route path="/ProAddForm" element={<ProAddForm />} />
                           <Route path="/Admin/AdminLocationManager" element={<AdminLocationManager />} />
                           <Route path="/Admin/ItemsManage" element={<ItemsManage /> } />
                           <Route path="/Admin/AccItemReq" element={<AccItemReq /> } />
                           <Route path="/Admin/AdminAlumni" element={<AdminAlumni /> } />
                           <Route path="/Admin/VideoManage" element={<VideoManage /> } />
                           <Route path="/Admin/ProManage" element={<ProManage /> } />
                           <Route path="/Admin/ItemsAddForm" element={<ItemAddForm onClose={() => navigate('/Admin/Dashboard')} /> } />
                           <Route path="/Admin/BuyandSellManage" element={<BuyandSellManage /> } />
                           <Route path="/Admin/AdGlassManage" element={<AdGlassManage /> } />
                           <Route path="/Admin/AdminOrderManage" element={<AdminOrderManage /> } />
                           <Route path="/Admin/AdQuotation" element={<AdQuotation /> } />
                           <Route path="/Admin/DisReview" element={<DisReview /> } />
                        </Route>
                     </Route>

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
            <FloatingChatbot /> 
        </div>
    );
}

export default App;