// src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

// Helper function (can be moved to a utils file)
const getUserInfoFromStorage = () => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
        try {
            const parsed = JSON.parse(storedUserInfo);
            if (parsed && parsed.id && parsed.role) { return parsed; } // Basic check
             console.warn("[ProtectedRoute] Parsed userInfo from storage is missing id or role:", parsed);
             return null;
        } catch (e) { console.error("[ProtectedRoute] Error parsing userInfo from storage:", e); return null; }
    } return null;
};

const ProtectedRoute = ({ isLoggedIn, requiredRole = null }) => { // Receive isLoggedIn from App state
    const location = useLocation();
    const userInfo = getUserInfoFromStorage(); // Get role/info for role check
    const currentUserRole = userInfo?.role;

    // --- DETAILED LOGGING ---
    // Log every time this component checks a route
    console.log('%c[ProtectedRoute] Checking Access', 'color: blue; font-weight: bold;', {
        pathname: location.pathname, // The route being checked
        requiredRole: requiredRole, // The role required by the Route definition
        isLoggedIn_Prop: isLoggedIn, // The state passed down from App.jsx
        currentUserRole_Storage: currentUserRole, // Role found directly from localStorage
        userInfo_Storage: userInfo // Full userInfo from localStorage
    });
    // --- END LOGGING ---

    // 1. Check if user is logged in (using the state prop from App.jsx)
    if (!isLoggedIn) {
        console.log(`%c[ProtectedRoute] Decision for ${location.pathname}: NOT LOGGED IN (isLoggedIn prop is false). Redirecting to login.`, 'color: red;');
        // Redirect to login, preserving intended destination and adding session expired flag
        return <Navigate
                    to={`/login?sessionExpired=true`}
                    state={{ from: location }} // Pass original location so user can be redirected back after login
                    replace // Replace history entry so back button doesn't go here
                />;
    }

    // 2. Check if a specific role is required for this route
    if (requiredRole) {
        // If role is required, we MUST have userInfo and the role must match
        if (!userInfo) {
             // This case is less likely if isLoggedIn is true, but could happen if localStorage cleared between renders
             console.warn(`%c[ProtectedRoute] Decision for ${location.pathname}: ROLE CHECK FAILED (userInfo missing from storage despite isLoggedIn=true). Redirecting to login (data mismatch).`, 'color: orange;');
             return <Navigate to={`/login?logoutMessage=${encodeURIComponent("User data missing. Please log in.")}`} replace />;
        }
        if (currentUserRole !== requiredRole) {
             // Role doesn't match the required role
             console.warn(`%c[ProtectedRoute] Decision for ${location.pathname}: ROLE MISMATCH (Required: ${requiredRole}, User has: ${currentUserRole}). Redirecting to unauthorized.`, 'color: orange;');
             return <Navigate to="/unauthorized" replace />; // Send to an "Unauthorized" page
        }
    }

    // 3. If logged in and role (if required) matches, allow access
    console.log(`%c[ProtectedRoute] Decision for ${location.pathname}: ACCESS GRANTED. Rendering Outlet.`, 'color: green;');
    return <Outlet />; // Renders the nested Route's element (e.g., <ClientProfile />)
};

export default ProtectedRoute;