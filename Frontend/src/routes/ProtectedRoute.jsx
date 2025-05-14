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
        if (localStorage.getItem('token')) {
            // This case should ideally be handled by App.jsx's auth check,
            // but as a fallback, ensure logout if context says not loggedIn but token exists.
            // auth.logout('Session invalid or expired.'); // Trigger App.jsx's handleLogout
        }
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. Check for Required Role (if specified)
    if (requiredRole) {
        // If the logged-in user is an admin, they have access to any role-protected route.
        if (userInfo && userInfo.role === 'admin') {
            console.log(`[ProtectedRoute] Admin user (Role: ${userInfo.role}) accessing route that requires '${requiredRole}'. Access GRANTED to ${location.pathname}.`);
        }
        // Else, if the user is not an admin, their role must match the requiredRole.
        else if (!userInfo || userInfo.role !== requiredRole) {
            console.warn(`[ProtectedRoute] Role mismatch. User role: '${userInfo?.role}', Required role: '${requiredRole}'. Redirecting to /unauthorized from ${location.pathname}.`);
            return <Navigate to="/unauthorized" state={{ from: location }} replace />;
        }
        // If user is not admin, but their role matches requiredRole, access is granted.
        else if (userInfo && userInfo.role === requiredRole) {
             console.log(`[ProtectedRoute] User role '${userInfo.role}' matches required role '${requiredRole}'. Access granted to ${location.pathname}.`);
        }
    } else {
        // If no requiredRole is specified, just being authenticated is enough
        console.log(`[ProtectedRoute] Authenticated user (Role: ${userInfo?.role}) accessing ${location.pathname} (no specific role required for this route).`);
    }

    // 4. If all checks pass, render the children or Outlet
    return children ? children : <Outlet />;
};

export default ProtectedRoute;