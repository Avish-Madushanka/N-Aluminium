// src/Layouts/AdminLayout.jsx (Example Path - Updated)
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdNav from '../Components/Admin/AdminNav/AdNav'; // Adjust path
import Footer from '../Components/Footer/Footer'; // --- IMPORT YOUR FOOTER ---
import '../Components/Admin/AdminNav/AdNav.css'; // Import layout CSS (contains .content-wrapper, .main-content)
// import '../Components/Footer/Footer.css'; // Footer's own styles (optional here if imported in Footer.jsx)

function AdminLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        console.log("Admin logging out...");
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        navigate('/login', { replace: true });
    };

    return (
        <div className="dashboard-container"> {/* From AdNav.css */}
            <AdNav handleLogout={handleLogout} /> {/* Sidebar */}

            {/* Content Wrapper takes remaining space and handles column layout */}
            <div className="content-wrapper"> {/* From AdNav.css */}

                {/* Optional Top Navbar */}
                {/* <header className="top-navbar">Admin Top Bar</header> */}

                {/* Main Scrollable Content Area */}
                <main className="main-content"> {/* From AdNav.css */}
                    <Outlet /> {/* Child admin pages render here */}
                </main>

                {/* --- FOOTER PLACED HERE --- */}
                {/* It's inside content-wrapper but AFTER main-content */}
                <Footer /> {/* Render the Footer component */}

            </div> {/* End content-wrapper */}
        </div> /* End dashboard-container */
    );
}

export default AdminLayout;