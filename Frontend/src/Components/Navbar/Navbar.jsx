import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, ShoppingCart, Bell, CheckCircle, XCircle, Clock } from 'lucide-react';
import "./Navbar.css";
import logo from "../../assets/logo.png";
import axiosInstance from '../../api/axiosInstance';
import API_ENDPOINTS from '../../apiConfig';

const Navbar = ({ isLoggedIn, userInfo, handleLogout, cartItemCount = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userBookings, setUserBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setShowNotifications(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && 
          !event.target.closest('.Nav-menu-toggle')) {
        setIsOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target) &&
          !event.target.closest('.Nav-notification-icon')) {
        setShowNotifications(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserBookings();
      const interval = setInterval(fetchUserBookings, 30000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  const fetchUserBookings = async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.BOOKINGS.GET_MY_BOOKINGS);
      if (response.data && response.data.success) {
        let bookingsData = response.data.data;
        if (Array.isArray(bookingsData)) {
          setUserBookings(bookingsData);
          const pendingCount = bookingsData.filter(booking => booking.status === 'pending').length;
          setUnreadCount(pendingCount);
        } else {
          setUserBookings([]);
          setUnreadCount(0);
        }
      }
    } catch (err) {
      console.error("Error fetching user bookings:", err);
      setUserBookings([]);
      setUnreadCount(0);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (showNotifications) setShowNotifications(false);
  };

  const toggleNotifications = async () => {
    setShowNotifications(!showNotifications);
    if (isOpen) setIsOpen(false);
    if (!showNotifications) {
      setLoadingBookings(true);
      await fetchUserBookings();
      setLoadingBookings(false);
    }
  };

  const handleLoginClick = () => {
    const currentPath = location.pathname;
    sessionStorage.setItem('redirectAfterLogin', currentPath);
    navigate('/Login');
  };

  const triggerLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      sessionStorage.removeItem('redirectAfterLogin');
      sessionStorage.removeItem('attemptedPath');
      sessionStorage.removeItem('requiredRole');
      handleLogout();
    }
  };

  const userRole = userInfo?.role;
  const displayName = userInfo?.name || userInfo?.ownerName || 'User';

  const getProfilePath = () => {
    if (!isLoggedIn) return '/';
    if (userRole === 'admin') return '/Admin';
    if (userRole === 'client') return '/ClientProfile';
    return '/Profile';
  };

  const getStatusDisplay = (status) => {
    switch(status) {
      case 'pending':
        return { text: 'Pending', class: 'notif-status-pending', icon: <Clock size={14} /> };
      case 'approved':
        return { text: 'Approved ✓', class: 'notif-status-approved', icon: <CheckCircle size={14} /> };
      case 'rejected':
        return { text: 'Rejected ✗', class: 'notif-status-rejected', icon: <XCircle size={14} /> };
      case 'completed':
        return { text: 'Completed', class: 'notif-status-completed', icon: <CheckCircle size={14} /> };
      default:
        return { text: 'Pending', class: 'notif-status-pending', icon: <Clock size={14} /> };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const phoneIconUrl = "https://cdn-icons-png.flaticon.com/128/9840/9840072.png";
  const locationIconUrl = "https://cdn-icons-png.flaticon.com/128/9131/9131546.png";

  return (
    <header className={`Nav-header-main ${scrolled ? 'Nav-header-scrolled' : ''}`} ref={headerRef}>
      <div className="Nav-header-container">
        <Link className="Nav-brand-logo" to="/">
          <img src={logo} alt="ALUX" className="Nav-brand-image" />
          <span className="Nav-brand-text">ALUX</span>
        </Link>

        <div className="Nav-menu-links">
          <NavLink to="/" className={({ isActive }) => `Nav-menu-item ${isActive ? 'Nav-active-menu-item' : ''}`}>
            Home
          </NavLink>
          
          <NavLink to="/AboutUs" className={({ isActive }) => `Nav-menu-item ${isActive ? 'Nav-active-menu-item' : ''}`}>
            About Us
          </NavLink>
          
          <NavLink to="/Service" className={({ isActive }) => `Nav-menu-item ${isActive ? 'Nav-active-menu-item' : ''}`}>
            Services
          </NavLink>
          
          <NavLink to="/ContactUs" className={({ isActive }) => `Nav-menu-item ${isActive ? 'Nav-active-menu-item' : ''}`}>
            Contact Us
          </NavLink>
          
          {isLoggedIn && userRole === 'admin' && (
            <NavLink to="/Admin" className={({ isActive }) => `Nav-menu-item ${isActive ? 'Nav-active-menu-item' : ''}`}>
              Admin Panel
            </NavLink>
          )}
        </div>

        <div className="Nav-contact-info">
          <div className="Nav-contact-item">
            <img src={locationIconUrl} alt="Location" className="Nav-contact-icon-img" />
            <span>PANADURA</span>
          </div>
        </div>

        <div className="Nav-auth-section">
          {isLoggedIn && userInfo ? (
            <div className="Nav-user-actions">
              <Link to="/ItemsCartManage" className="Nav-cart-icon">
                <ShoppingCart size={22} />
                {cartItemCount > 0 && (
                  <span className="Nav-cart-badge">{cartItemCount > 99 ? '99+' : cartItemCount}</span>
                )}
              </Link>

              <div className="Nav-notification-wrapper" ref={notificationRef}>
                <button onClick={toggleNotifications} className="Nav-notification-icon">
                  <Bell size={22} />
                  {unreadCount > 0 && (
                    <span className="Nav-notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="Nav-notification-dropdown">
                    <div className="Nav-notification-header">
                      <h4>Booking Status</h4>
                      <button onClick={() => setShowNotifications(false)} className="Nav-notification-close">✕</button>
                    </div>
                    <div className="Nav-notification-list">
                      {loadingBookings ? (
                        <div className="Nav-notification-loading">Loading...</div>
                      ) : userBookings.length === 0 ? (
                        <div className="Nav-notification-empty">
                          <Clock size={32} />
                          <p>No bookings yet</p>
                          <Link to="/Service" className="Nav-notification-book-now" onClick={() => setShowNotifications(false)}>
                            Book Now
                          </Link>
                        </div>
                      ) : (
                        userBookings.map(booking => {
                          const statusInfo = getStatusDisplay(booking.status);
                          return (
                            <div key={booking._id || booking.bookingId} className="Nav-notification-item">
                              <div className="Nav-notification-info">
                                <div className="Nav-notification-date">
                                  {formatDate(booking.selectedDate)}
                                </div>
                                <div className="Nav-notification-message">
                                  Pickup request
                                </div>
                                <div className="Nav-notification-time">
                                  {formatTimeAgo(booking.updatedAt || booking.createdAt)}
                                </div>
                              </div>
                              <div className={`Nav-notification-status ${statusInfo.class}`}>
                                {statusInfo.icon}
                                <span>{statusInfo.text}</span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                    <div className="Nav-notification-footer">
                      <Link to="/UserCalendar" className="Nav-view-all" onClick={() => setShowNotifications(false)}>
                        Schedule New Pickup
                      </Link>
                      <button onClick={fetchUserBookings} className="Nav-notification-refresh">
                        Refresh
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <button onClick={triggerLogout} className="Nav-logout-btn">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="Nav-auth-buttons">
              <button onClick={handleLoginClick} className="Nav-login-btn">Login</button>
              <Link to="/ClientForm" className="Nav-signup-btn">Sign Up</Link>
            </div>
          )}

          <button 
            className="Nav-menu-toggle" 
            onClick={toggleMenu} 
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div className={`Nav-mobile-menu ${isOpen ? 'active' : ''}`} ref={mobileMenuRef}>
        <div className="Nav-mobile-menu-items">
          {isLoggedIn && userInfo && (
            <div className="Nav-mobile-user-info">
              <div className="Nav-mobile-user-details">
                <div className="Nav-mobile-user-name">{displayName}</div>
                <div className="Nav-mobile-user-role">{userRole === 'admin' ? 'Administrator' : 'Client'}</div>
              </div>
            </div>
          )}
          
          <div className="Nav-mobile-contact">
            <div className="Nav-mobile-contact-item">
              <img src={locationIconUrl} alt="Location" className="Nav-mobile-contact-icon-img" />
              <span>Panadura</span>
            </div>
          </div>
          
          <NavLink 
            to="/" 
            className={({ isActive }) => `Nav-mobile-menu-item ${isActive ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            Home
          </NavLink>
          
          <NavLink 
            to="/AboutUs" 
            className={({ isActive }) => `Nav-mobile-menu-item ${isActive ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            About Us
          </NavLink>
          
          <NavLink 
            to="/Service" 
            className={({ isActive }) => `Nav-mobile-menu-item ${isActive ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            Services
          </NavLink>
          
          <NavLink 
            to="/ContactUs" 
            className={({ isActive }) => `Nav-mobile-menu-item ${isActive ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            Contact Us
          </NavLink>

          {isLoggedIn && userRole === 'admin' && (
            <NavLink 
              to="/Admin" 
              className={({ isActive }) => `Nav-mobile-menu-item ${isActive ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              Admin Panel
            </NavLink>
          )}
          
          {isLoggedIn && (
            <NavLink 
              to={getProfilePath()} 
              className="Nav-mobile-menu-item"
              onClick={() => setIsOpen(false)}
            >
              My Profile
            </NavLink>
          )}
          
          {isLoggedIn && (
            <button onClick={() => {
              setIsOpen(false);
              triggerLogout();
            }} className="Nav-mobile-logout-btn">
              <LogOut size={18} />
              Logout
            </button>
          )}
          
          {!isLoggedIn && (
            <div className="Nav-mobile-auth-buttons">
              <button 
                onClick={() => {
                  setIsOpen(false);
                  handleLoginClick();
                }} 
                className="Nav-mobile-login-btn"
              >
                Login
              </button>
              <Link 
                to="/ClientForm" 
                className="Nav-mobile-signup-btn"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;