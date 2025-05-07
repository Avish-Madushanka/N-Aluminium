// src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { ClipLoader } from 'react-spinners'; // For loading state
import { useAuth } from '../App'; // Assuming AuthContext is exported from App.jsx

const ProtectedRoute = ({ requiredRole, children }) => {
    const { isLoggedIn, userInfo, isLoading: authIsLoading, logout } = useAuth();
    const location = useLocation();

    // 1. Handle Auth Loading State from Context
    if (authIsLoading) {
        console.log("[ProtectedRoute] Auth context is loading...");
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <ClipLoader size={50} color="#f97316" />
                <p style={{ marginLeft: '10px' }}>Verifying session...</p>
            </div>
        );
    }

    // 2. Check if User is Logged In
    if (!isLoggedIn) {
        console.log(`[ProtectedRoute] User not logged in. Redirecting to /Login from ${location.pathname}.`);
        // If there was a token but it's now considered invalid by the context,
        // ensure it's cleared (though App.jsx's main auth check should handle this)
        if (localStorage.getItem('token')) {
            // This indicates a discrepancy, App.jsx's logout should ideally handle this.
            // For robustness, we can trigger a logout here if context says not loggedIn but token exists.
            // logout('Session invalid or expired.'); // This will trigger App.jsx's handleLogout
        }
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. Check for Required Role (if specified)
    if (requiredRole) {
        if (!userInfo || userInfo.role !== requiredRole) {
            console.warn(`[ProtectedRoute] Role mismatch. User role: '${userInfo?.role}', Required role: '${requiredRole}'. Redirecting to /unauthorized from ${location.pathname}.`);
            return <Navigate to="/unauthorized" state={{ from: location }} replace />;
        }
        console.log(`[ProtectedRoute] User role '${userInfo?.role}' matches required role '${requiredRole}'. Access granted to ${location.pathname}.`);
    } else {
        // If no requiredRole is specified, just being authenticated is enough
        console.log(`[ProtectedRoute] Authenticated user accessing ${location.pathname} (no specific role required for this route).`);
    }

    // 4. If all checks pass, render the children or Outlet
    // If you use <ProtectedRoute><SpecificPage /></ProtectedRoute>, then 'children' is SpecificPage
    // If you use <Route element={<ProtectedRoute ... />}><Route path="..." element={<Page />} /></Route>, then use <Outlet />
    return children ? children : <Outlet />;
};

export default ProtectedRoute;