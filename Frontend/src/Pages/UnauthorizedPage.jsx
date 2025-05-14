// Frontend/src/Pages/UnauthorizedPage.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const UnauthorizedPage = () => {
    const location = useLocation();
    const { requiredRole, userRole, from } = location.state || {}; // Get state passed from ProtectedRoute

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: 'calc(100vh - 120px)', // Adjust based on navbar/footer height
            padding: '40px 20px',
            textAlign: 'center',
            backgroundColor: '#f8f9fa'
        }}>
            <h1 style={{ color: '#dc3545', fontSize: '3rem', marginBottom: '20px' }}>
                🚫 403 - Access Denied
            </h1>
            <p style={{ fontSize: '1.2rem', color: '#343a40', marginBottom: '15px' }}>
                Sorry, you do not have the necessary permissions to access this page.
            </p>
            {requiredRole && userRole && (
                <p style={{ fontSize: '1rem', color: '#6c757d', marginBottom: '25px' }}>
                    This page requires the role: <strong>{requiredRole}</strong>. <br />
                    Your current role is: <strong>{userRole}</strong>.
                </p>
            )}
            {from?.pathname && (
                 <p style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '10px' }}>
                    You were trying to access: <code>{from.pathname}</code>
                </p>
            )}
            <Link 
                to="/" 
                style={{ 
                    display: 'inline-block',
                    padding: '10px 20px', 
                    backgroundColor: '#007bff', 
                    color: 'white', 
                    textDecoration: 'none', 
                    borderRadius: '5px',
                    fontSize: '1rem',
                    transition: 'background-color 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
            >
                Go to Homepage
            </Link>
        </div>
    );
};

export default UnauthorizedPage;