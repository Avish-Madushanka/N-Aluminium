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
import { LogIn } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/SignInform" state={{ from: location }} replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      localStorage.removeItem('token');
      return <Navigate to="/SignInform" state={{ from: location }} replace />;
    }
  } catch (error) {
    localStorage.removeItem('token');
    return <Navigate to="/SignInform" state={{ from: location }} replace />;
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
        const decoded = jwt_decode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp > currentTime) {
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
        <Route path="/SaleForm" element={<SaleForm />} />
        <Route path="/Login" element={<LogIn />} />
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
