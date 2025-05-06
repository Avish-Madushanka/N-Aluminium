// src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

// Helper function (can be moved to a utils file)
const getUserInfoFromStorage = () => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
        try {
            const parsed = JSON.parse(storedUserInfo);
            if (parsed && parsed.id && parsed.role) { return parsed; }
             console.warn("[ProtectedRoute] Parsed userInfo from storage is missing id or role:", parsed);
             return null;
        } catch (e) { console.error("[ProtectedRoute] Error parsing userInfo from storage:", e); return null; }
    } return null;
};

const ProtectedRoute = ({ isLoggedIn, requiredRole = null }) => { // Receive isLoggedIn from App state
    const location = useLocation();
    const userInfo = getUserInfoFromStorage();
    const currentUserRole = userInfo?.role;

    // --- DETAILED LOGGING ---
    console.log('%c[ProtectedRoute] Checking Access', 'color: blue; font-weight: bold;', {
        pathname: location.pathname,
        requiredRole: requiredRole,
        isLoggedIn_Prop: isLoggedIn, // Check prop passed from App
        currentUserRole_Storage: currentUserRole,
        userInfo_Storage: userInfo
    });
    // --- END LOGGING ---

    // 1. Check if user is logged in (using the state prop from App.jsx)
    if (!isLoggedIn) {
        console.log(`%c[ProtectedRoute] Decision for ${location.pathname}: NOT LOGGED IN (isLoggedIn prop is false). Redirecting to login.`, 'color: red;');
        return <Navigate
                    to={`/login?sessionExpired=true`}
                    state={{ from: location }}
                    replace
                />;
    }

    // 2. Check if a specific role is required
    if (requiredRole) {
        if (!userInfo) {
             console.warn(`%c[ProtectedRoute] Decision for ${location.pathname}: ROLE CHECK FAILED (userInfo missing from storage despite isLoggedIn=true). Redirecting to login (data mismatch).`, 'color: orange;');
             return <Navigate to={`/login?logoutMessage=${encodeURIComponent("User data missing. Please log in.")}`} replace />;
        }
        if (currentUserRole !== requiredRole) {
             console.warn(`%c[ProtectedRoute] Decision for ${location.pathname}: ROLE MISMATCH (Required: ${requiredRole}, User has: ${currentUserRole}). Redirecting to unauthorized.`, 'color: orange;');
             return <Navigate to="/unauthorized" replace />;
        }
    }

    // 3. If logged in and role (if required) matches, allow access
    console.log(`%c[ProtectedRoute] Decision for ${location.pathname}: ACCESS GRANTED. Rendering Outlet.`, 'color: green;');
    return <Outlet />;
};

export default ProtectedRoute;