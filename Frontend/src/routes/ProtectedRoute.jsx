import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ requiredRole, children }) => {
    const auth = useAuth();
    const location = useLocation();

    if (!auth) {
        console.error("[ProtectedRoute] Auth context is null or undefined.");
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column' }}>
                <p>Authentication System Error. Please try again later.</p>
                <ClipLoader size={50} color="#f97316" />
            </div>
        );
    }

    const { isLoggedIn, userInfo, isLoading: authIsLoading } = auth;

    if (authIsLoading) {
        console.log("[ProtectedRoute] Auth context is loading...");
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column' }}>
                <ClipLoader size={50} color="#f97316" />
                <p style={{ marginLeft: '10px', marginTop: '10px' }}>Verifying session...</p>
            </div>
        );
    }

    if (!isLoggedIn) {
        console.log(`[ProtectedRoute] User not logged in for path: ${location.pathname}. Storing redirect path.`);
        sessionStorage.setItem('redirectAfterLogin', location.pathname);
        return <Navigate to="/Login" state={{ from: location, message: "Please log in to access this page." }} replace />;
    }

    if (requiredRole) {
        if (!userInfo) {
            console.warn(`[ProtectedRoute] User is logged in, but userInfo is missing.`);
            return <Navigate to="/Login" state={{ from: location, message: "Session data incomplete. Please log in again." }} replace />;
        }

        if (userInfo.role === 'admin') {
            console.log(`[ProtectedRoute] Admin user accessing route.`);
        }
        else if (userInfo.role !== requiredRole) {
            console.warn(`[ProtectedRoute] Role mismatch. User role: '${userInfo.role}', Required role: '${requiredRole}'.`);
            return <Navigate to="/unauthorized" state={{ from: location, requiredRole: requiredRole, userRole: userInfo.role }} replace />;
        }
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;