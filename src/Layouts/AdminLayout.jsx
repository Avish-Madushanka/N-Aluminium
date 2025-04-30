// src/Layouts/AdminLayout.jsx (Example Path)
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom'; // Use Outlet to render nested routes
import AdNav from '../Components/Admin/AdminNav/AdNav'; // Adjust path to AdNav.jsx
import '../Components/Admin/AdminNav/AdNav.css'; // Import layout CSS

function AdminLayout() {
    const navigate = useNavigate();

    // Define the logout handler function HERE
    const handleLogout = () => {
        console.log("Admin logging out...");
        // Clear authentication tokens/user info from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        // Redirect to the login page
        navigate('/login', { replace: true }); // Use replace to prevent going back to admin pages
    };

    return (
        <div className="dashboard-container"> {/* Defined in AdNav.css */}
            <AdNav handleLogout={handleLogout} /> {/* Pass the logout handler */}

            <div className="content-wrapper"> {/* Defined in AdNav.css */}
                {/* Optional Top Navbar can go here */}
                {/* <div className="top-navbar">Admin Top Bar</div> */}

                <main className="main-content"> {/* Defined in AdNav.css - THIS PART SCROLLS */}
                    <Outlet /> {/* Child routes (Dashboard, AdCheckReq, etc.) render here */}
                </main>

                {/* Optional Footer can go here */}
                {/* <footer className="footer">Admin Footer © 2024</footer> */}
            </div>
        </div>
    );
}

export default AdminLayout;
// END OF FILE AdminLayout.jsx (Example)