// src/Layouts/AdminLayout.jsx
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
// Import AdNav (assuming default export is set up in AdNav.jsx)
import AdNav from '../Components/Admin/AdminNav/AdNav'; // Adjust path if needed
// Footer Import is correctly REMOVED
// import Footer from '../Components/Footer/Footer';
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
        // This container uses Flexbox to arrange sidebar and content wrapper
        <div className="dashboard-container"> {/* Defined in AdNav.css */}

            {/* Render the Sidebar component */}
            <AdNav handleLogout={handleLogout} /> {/* Pass the logout handler */}

            {/* This wrapper takes the remaining space and arranges content vertically */}
            <div className="content-wrapper"> {/* Defined in AdNav.css */}

                {/* Optional Top Navbar could go here */}
                {/* <header className="top-navbar">Admin Top Bar</header> */}

                {/* Main Content Area - This part scrolls */}
                <main className="main-content"> {/* Defined in AdNav.css */}
                    <Outlet /> {/* Child admin pages (Dashboard, AdCalendar, etc.) render here */}
                </main>

                {/* Footer Rendering is correctly REMOVED */}
                {/* <Footer /> */}

            </div> {/* End content-wrapper */}
        </div> /* End dashboard-container */
    );
}

// Use export default
export default AdminLayout;
// END OF FILE AdminLayout.jsx