import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners'; 
import { jwtDecode } from 'jwt-decode'; 
import Navbar from './Components/Navbar/Navbar';
import HomePage from './Pages/HomePage';
import Footer from './Components/Footer/Footer';
import SignUp from './Pages/SignUp';
import AboutUs from './Pages/AboutUS';
import BuyandSell from './Pages/BuyandSell';
import SaleForm from './Components/SaleForm/SaleForm';
import Login from './Components/Login/Login';
import BuyCard from './Components/BuyCard/BuyCard';
import BOwnerForm from './Components/RegistrationForm/BOwnerForm';
import ClientForm from './Components/RegistrationForm/ClientForm';
import BOwnerHome from './Pages/BOwnerHome';
import BOwnerHeader from './Components/BusinessOwner/BOwnerHeader';
import Project from './Pages/Project';
import Collection from './Pages/Collection';
import ProAddForm from './Components/Projects/ProAddForm';
import Service from './Pages/Service';
import WastePickForm from './Components/WasteCollect/WastePickForm';
import BSHeader from './Components/BuyandSell/BSHeader'
import Calendar from './Components/WasteCollect/Calendar';
import Admin from './Pages/Admin';
import Map from './Pages/Map';
import LocationMap from './Components/Maps/LocationMap';
import Calculate from './Components/Calculate/Calculate';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }

  try {
    const decoded = jwtDecode(token);
    if (decoded.exp < Date.now() / 1000) {
      localStorage.removeItem('token');
      return <Navigate to="/Login" state={{ from: location }} replace />;
    }
  } catch (error) {
    localStorage.removeItem('token');
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }

  return children;
};

const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp > Date.now() / 1000) {
          setIsLoggedIn(true);
        } else {
          handleLogout();
        }
      } catch (error) {
        handleLogout();
      }
    }

    return () => clearTimeout(timer);
  }, []);

  const handleLoginSuccess = (token) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
    const from = location.state?.from?.pathname || '/';
    navigate(from, { replace: true });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    navigate('/');
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <ClipLoader size={60} color="#123abc" />
      </div>
    );
  }

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/BuyandSell" element={<BuyandSell />} />
        <Route path="/SaleForm" element={<ProtectedRoute><SaleForm /></ProtectedRoute>} />
        <Route path="/Login" element={<Login />} />
        <Route path="/BuyCard" element={<ProtectedRoute><BuyCard /></ProtectedRoute>} />
        <Route path="/BOwnerForm" element={<BOwnerForm />} />
        <Route path="/ClientForm" element={<ClientForm />} />
        <Route path="/ProAddForm" element={<ProtectedRoute><ProAddForm /></ProtectedRoute>} />
        <Route path="/BOwnerHome" element={<ProtectedRoute><BOwnerHome /></ProtectedRoute>} />
        <Route path="/WastePickForm" element={<ProtectedRoute><WastePickForm /></ProtectedRoute>} />
        <Route path="/BOwnerHeader" element={<ProtectedRoute><BOwnerHeader /></ProtectedRoute>} />
        <Route path="/Project" element={<Project />} />
        <Route path="/Collection" element={<Collection />} />
        <Route path="/Service" element={<Service />} />
        <Route path="/BSHeader" element={<BSHeader />} />
        <Route path="/Calendar" element={<Calendar />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/Map" element={<Map />} />
        <Route path="/LocationMap" element={<LocationMap />} />
        <Route path="/Calculate" element={<Calculate />} />
      </Routes>
      <Footer />
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
