import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { useNavigate } from 'react-router-dom'; // Uncomment if you use it for navigation

import axiosInstance from '../../../api/axiosInstance'; // Adjust path if needed
import API_ENDPOINTS from '../../../apiConfig';     // Adjust path if needed

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

// --- Initial Chart Data States (empty, to be filled by API) ---
const initialUserStatsData = {
    labels: ['Clients', 'Business Owners', 'Admins'],
    datasets: [{
        label: 'User Distribution',
        data: [0, 0, 0],
        backgroundColor: ['#4A90E2', '#F5A623', '#FF6B6B'],
        hoverBackgroundColor: ['#357ABD', '#D98C1F', '#E84A4A'],
        borderColor: '#fff',
        borderWidth: 2,
    }],
};

const initialBookingStatsData = {
    labels: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    datasets: [{
        label: 'Bookings by Status',
        data: [0, 0, 0, 0],
        backgroundColor: ['#FFCB2F', '#4CAF50', '#2196F3', '#F44336'],
        borderColor: ['#EDB60F', '#388E3C', '#1976D2', '#D32F2F'],
        borderWidth: 1,
    }],
};

const initialSalesOverviewData = {
    labels: [],
    datasets: [{
        label: 'Monthly Activity',
        data: [],
        fill: true,
        backgroundColor: 'rgba(74, 144, 226, 0.1)',
        borderColor: '#4A90E2',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointBackgroundColor: '#4A90E2',
    }],
};

// --- Chart Options ---
const userPieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
            labels: { padding: 20, boxWidth: 12, font: { size: 11 } }
        },
        title: {
            display: true,
            text: 'User Distribution',
            align: 'center',
            font: { size: 15, weight: '500' },
            color: '#333',
            padding: { top: 5, bottom: 15 }
        },
         tooltip: {
            callbacks: {
                label: function(context) {
                    let label = context.label || '';
                    if (label) { label += ': '; }
                    if (context.parsed !== null) { label += context.parsed; }
                    return label;
                }
            }
        }
    },
};

const bookingBarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        title: {
            display: true,
            text: 'Booking Trends',
            font: { size: 15, weight: '500', color: '#333' },
            padding: { top: 5, bottom: 15 }
        },
    },
    scales: { y: { beginAtZero: true, ticks: { precision: 0 } }, x: { grid: { display: false } } },
};

const salesLineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        title: {
            display: true,
            text: 'Activity Overview',
            font: { size: 15, weight: '500', color: '#333' },
            padding: { top: 5, bottom: 15 }
        },
    },
    scales: {
        y: {
            beginAtZero: false,
            ticks: { callback: function(value) { return '$' + value.toLocaleString(); }, color: '#555', font: { size: 10 } },
            grid: { borderColor: '#e0e0e0', color: '#f0f0f0' }
        },
        x: { grid: { display: false }, ticks: { color: '#555', font: {size: 10} } }
    },
};


function Dashboard() {
    // const navigate = useNavigate(); // For quick action navigation
    const [userStats, setUserStats] = useState(initialUserStatsData);
    const [bookingStats, setBookingStats] = useState(initialBookingStatsData);
    const [salesOverview, setSalesOverview] = useState(initialSalesOverviewData);
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null); // Clear previous errors
            let aggregatedErrorMessages = []; // Collect multiple error messages

            console.log("Dashboard: Fetching data...");
            // console.log("API Endpoints used by Dashboard:"); // Optional: keep for debugging
            // console.log("User Dist:", API_ENDPOINTS.ADMIN.STATS_USER_DISTRIBUTION);
            // console.log("Booking Sum:", API_ENDPOINTS.ADMIN.STATS_BOOKING_SUMMARY);
            // console.log("Sales Over:", API_ENDPOINTS.ADMIN.STATS_SALES_OVERVIEW);
            // console.log("Recent Bookings:", API_ENDPOINTS.BOOKINGS.GET_ALL + with params);


            try {
                const results = await Promise.allSettled([
                    axiosInstance.get(API_ENDPOINTS.ADMIN.STATS_USER_DISTRIBUTION),
                    axiosInstance.get(API_ENDPOINTS.ADMIN.STATS_BOOKING_SUMMARY),
                    axiosInstance.get(API_ENDPOINTS.ADMIN.STATS_SALES_OVERVIEW),
                    axiosInstance.get(API_ENDPOINTS.BOOKINGS.GET_ALL, { // <<< CORRECTED HERE
                        params: { 
                            limit: 5, 
                            sort: '-createdAt' 
                        } 
                    })
                ]);

                const [userDistResponse, bookingSumResponse, salesOverResponse, recentBookResponse] = results;

                // Process User Distribution
                if (userDistResponse.status === 'fulfilled' && userDistResponse.value.data.success) {
                    const data = userDistResponse.value.data.data;
                    setUserStats(prev => ({
                        ...prev,
                        datasets: [{ ...prev.datasets[0], data: [data.clients, data.businessOwners, data.admins] }]
                    }));
                } else {
                    const errorMsg = userDistResponse.reason?.response?.data?.message || userDistResponse.reason?.message || userDistResponse.value?.data?.message || "Failed to load user distribution.";
                    console.error("User dist fetch failed:", errorMsg, userDistResponse.reason || userDistResponse.value);
                    aggregatedErrorMessages.push(errorMsg);
                }

                // Process Booking Summary
                if (bookingSumResponse.status === 'fulfilled' && bookingSumResponse.value.data.success) {
                    const counts = bookingSumResponse.value.data.data.statusCounts;
                    setBookingStats(prev => ({
                        ...prev,
                        datasets: [{ ...prev.datasets[0], data: [counts.pending, counts.confirmed, counts.completed, counts.cancelled] }]
                    }));
                } else {
                    const errorMsg = bookingSumResponse.reason?.response?.data?.message || bookingSumResponse.reason?.message || bookingSumResponse.value?.data?.message || "Failed to load booking summary.";
                    console.error("Booking sum fetch failed:", errorMsg, bookingSumResponse.reason || bookingSumResponse.value);
                    aggregatedErrorMessages.push(errorMsg);
                }

                // Process Sales Overview
                if (salesOverResponse.status === 'fulfilled' && salesOverResponse.value.data.success) {
                    const data = salesOverResponse.value.data.data;
                    setSalesOverview(prev => ({
                        ...prev,
                        labels: data.labels || [],
                        datasets: [{ ...prev.datasets[0], data: data.data || [] }]
                    }));
                } else {
                     const errorMsg = salesOverResponse.reason?.response?.data?.message || salesOverResponse.reason?.message || salesOverResponse.value?.data?.message || "Failed to load activity overview.";
                    console.error("Sales over fetch failed:", errorMsg, salesOverResponse.reason || salesOverResponse.value);
                    aggregatedErrorMessages.push(errorMsg);
                }

                // Process Recent Bookings
                if (recentBookResponse.status === 'fulfilled' && recentBookResponse.value.data.success) {
                    setRecentBookings(recentBookResponse.value.data.data);
                } else {
                    const errorMsg = recentBookResponse.reason?.response?.data?.message || recentBookResponse.reason?.message || recentBookResponse.value?.data?.message || "Failed to load recent bookings.";
                    console.error("Recent book fetch failed:", errorMsg, recentBookResponse.reason || recentBookResponse.value);
                    aggregatedErrorMessages.push(errorMsg);
                }
                
                if (aggregatedErrorMessages.length > 0) {
                    setError(aggregatedErrorMessages.join("\n"));
                }

            } catch (err) { 
                // This catch block is for errors in Promise.allSettled itself or general setup, less likely.
                const generalErrorMsg = "An unexpected error occurred while initiating data fetch.";
                setError(generalErrorMsg);
                console.error("Dashboard fetch setup error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed': return 'status-confirmed';
            case 'pending': return 'status-pending';
            case 'completed': return 'status-completed';
            case 'cancelled': return 'status-cancelled';
            default: return 'status-unknown';
        }
    };

    // const handleQuickAction = (path) => { navigate(path); }; // Example

    if (loading) {
        return <div className="admin-dashboard-message">Loading Dashboard Data...</div>;
    }
    
    return (
        <div className="admin-dashboard-page">
            <h1 className="admin-dashboard-main-title">Admin Dashboard</h1>

            {error && (
                <div className="admin-dashboard-message admin-dashboard-error">
                    Could not load all dashboard data. Please check console for details.
                    <pre style={{ whiteSpace: 'pre-wrap', textAlign: 'left', maxHeight: '150px', overflowY: 'auto', marginTop: '10px', backgroundColor: '#fff0f0', padding: '10px', border: '1px solid #fcc' }}>
                        {error}
                    </pre>
                </div>
            )}


            <div className="admin-dashboard-section admin-dashboard-quick-actions">
                <h2 className="admin-dashboard-section-title">Quick Actions</h2>
                <div className="admin-dashboard-actions-container">
                    <button className="admin-dashboard-action-btn" onClick={() => useNavigate('/Admin/Calendar')} >Manage Pickup Schedule</button>
                    <button className="admin-dashboard-action-btn" onClick={() => useNavigate('/Admin/ManageOwners')} >Manage Business Owners</button>
                    <button className="admin-dashboard-action-btn" onClick={() => useNavigate('/Admin/AdminLocationManager')} >Add Shops</button>
                </div>
            </div>
            
            <div className="admin-dashboard-widgets-grid">
                <div className="admin-dashboard-widget chart-widget user-distribution-widget">
                    <div className="admin-dashboard-chart-container">
                         {userStats.datasets[0].data.some(d => d > 0) ? 
                            <Pie data={userStats} options={userPieChartOptions} /> : 
                            (!loading && <p className="no-data-message">No user data available</p>)}
                    </div>
                </div>

                <div className="admin-dashboard-widget chart-widget booking-trends-widget">
                    <div className="admin-dashboard-chart-container">
                        {bookingStats.datasets[0].data.some(d => d > 0) ?
                            <Bar data={bookingStats} options={bookingBarChartOptions} /> :
                            (!loading && <p className="no-data-message">No booking data available</p>)}
                    </div>
                </div>

                <div className="admin-dashboard-widget recent-bookings-widget full-width-widget">
                    <h2 className="admin-dashboard-widget-title">Recent Bookings</h2>
                    <div className="table-responsive-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Customer</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentBookings.length > 0 ? recentBookings.map((booking) => (
                                    <tr key={booking._id || booking.id}>
                                        <td>{booking.bookingId || booking.id}</td>
                                        <td>{booking.contactDetails?.name || booking.customerName || 'N/A'}</td>
                                        <td>{new Date(booking.selectedDate || booking.date).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`status-badge ${getStatusClass(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td><button className="view-details-btn" /* onClick={() => handleQuickAction(`/admin/booking/${booking._id}`)}*/>View</button></td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="5" className="no-data-message">{!loading ? 'No recent bookings found.' : 'Loading...'}</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="admin-dashboard-widget chart-widget sales-overview-widget full-width-widget">
                     <div className="admin-dashboard-chart-container sales-chart-container">
                        {salesOverview.datasets[0].data.length > 0 ?
                            <Line data={salesOverview} options={salesLineChartOptions} /> :
                            (!loading && <p className="no-data-message">No activity data available</p>)}
                    </div>
                </div>
                

                
            </div>
        </div>
    );
}

export default Dashboard;