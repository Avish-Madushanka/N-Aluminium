// src/Components/Admin/AdCheckReq/AdCheckReq.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import API_ENDPOINTS from '../../../apiConfig';
import {
  User, Phone, Mail, MapPin, Package, Weight, Clock, Calendar, Edit,
  CheckSquare, XSquare, Eye, Trash2, AlertTriangle, RefreshCw, Map
} from 'lucide-react'; // Removed Tags, not used.
import { ClipLoader } from 'react-spinners';
import EditBookingModal from './EditBookingModal';
import './AdCheckReq.css';

// --- Helper Functions ---
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try { return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }); }
    catch (e) { console.warn("Invalid Date for formatDate:", dateString); return 'Invalid Date'; }
};

const renderStatus = (status) => {
    const statusMap = {
        pending: { text: 'Pending', classes: 'bg-yellow-100 text-yellow-800' },
        confirmed: { text: 'Confirmed', classes: 'bg-green-100 text-green-800' },
        completed: { text: 'Completed', classes: 'bg-blue-100 text-blue-800' },
        cancelled: { text: 'Cancelled', classes: 'bg-red-100 text-red-800' },
    };
    const statusInfo = statusMap[status?.toLowerCase()] || { text: status || 'Unknown', classes: 'bg-gray-100 text-gray-800' };
    return <span className={`status-badge ${statusInfo.classes}`}>{statusInfo.text}</span>;
};

const formatWeightDisplay = (weight) => {
    if (weight === null || weight === undefined || isNaN(Number(weight))) return 'N/A';
    return `${Number(weight).toFixed(1)} kg`;
};

// --- Main Component ---
const AdCheckReq = () => {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRequest, setEditingRequest] = useState(null);
    const [isSavingEdit, setIsSavingEdit] = useState(false);
    const [modalError, setModalError] = useState('');
    const [calendarSettings, setCalendarSettings] = useState({ timeSlots: [], serviceAreas: [] });

    const fetchCalendarSettings = useCallback(async () => {
        console.log("[AdCheckReq] Fetching calendar settings for modal...");
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.CALENDAR_SETTINGS.GET);
            if (response.data?.success && response.data.data) {
                setCalendarSettings({
                    timeSlots: response.data.data.timeSlots || [],
                    serviceAreas: response.data.data.serviceAreas || [],
                });
            } else {
                setError(prev => prev + " (Warning: Could not load dropdown options for editing time/area).");
            }
        } catch (err) {
            console.error("[AdCheckReq] Error fetching calendar settings:", err);
            setError(prev => prev + " (Error: Failed to load settings for editing).");
        }
    }, []);

    const fetchRequests = useCallback(async (showLoadingSpinner = true) => {
        if (showLoadingSpinner) setIsLoading(true);
        setError('');
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.BOOKINGS.GET_ALL || '/bookings');
            if (response.data?.success) {
                const sortedRequests = (response.data.data || []).sort((a, b) => {
                    const statusOrder = { 'pending': 1, 'confirmed': 2, 'cancelled': 3, 'completed': 4 };
                    const statusCompare = (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
                    if (statusCompare !== 0) return statusCompare;
                    return new Date(a.selectedDate) - new Date(b.selectedDate);
                });
                setRequests(sortedRequests);
            } else {
                throw new Error(response.data?.message || 'Failed to fetch requests.');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Could not load requests.');
        } finally {
            if (showLoadingSpinner) setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRequests();
        fetchCalendarSettings();
    }, [fetchRequests, fetchCalendarSettings]);

    const handleUpdateStatus = async (id, newStatus) => {
        setActionLoading(id); setError('');
        const originalRequests = requests.map(r => ({...r})); // Simple deep copy for status
        setRequests(prev => prev.map(req => req._id === id ? { ...req, status: newStatus } : req));
        
        let payload = { status: newStatus };
        // If cancelling, allow adding a default note if none exists
        // This part is optional for quick actions. The edit modal is better for notes.
        // if (newStatus === 'cancelled') {
        //     const currentReq = originalRequests.find(r => r._id === id);
        //     payload.adminNotes = currentReq?.adminNotes || "Request cancelled by admin.";
        // }

        try {
            await axiosInstance.put(`${API_ENDPOINTS.BOOKINGS.UPDATE_STATUS_BASE || '/bookings'}/${id}/status`, payload);
            // Optionally re-fetch for consistency if backend modifies more than just status/notes
            // fetchRequests(false); 
        } catch (err) {
            setError(err.response?.data?.message || `Failed to update status for request ${id}.`);
            setRequests(originalRequests);
        } finally { setActionLoading(null); }
    };

    const handleDelete = async (id, bookingIdToDisplay) => {
        if (!window.confirm(`Are you sure you want to DELETE booking request ${bookingIdToDisplay || id}?`)) return;
        setActionLoading(id); setError('');
        const originalRequests = [...requests];
        setRequests(prev => prev.filter(req => req._id !== id));
        try {
            await axiosInstance.delete(`${API_ENDPOINTS.BOOKINGS.DELETE_BASE || '/api/bookings'}/${id}`);
        } catch (err) {
            setError(err.response?.data?.message || `Failed to delete request ${id}.`);
            setRequests(originalRequests);
        } finally { setActionLoading(null); }
    };

    const handleOpenEditModal = (request) => {
        const localISODateTime = request.selectedDate
            ? new Date(new Date(request.selectedDate).getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16)
            : '';
        
        setEditingRequest({
            ...request,
            initialStatus: request.status, // Store initial status for comparison on save
            selectedDate: localISODateTime,
            contactDetails: request.contactDetails || { name: '', phone: '', email: '' },
            adminNotes: request.adminNotes || '',
            estimatedWeight: request.estimatedWeight !== null && request.estimatedWeight !== undefined ? String(request.estimatedWeight) : ""
        });
        setModalError('');
        setIsModalOpen(true);
    };

    const handleCloseEditModal = () => { setIsModalOpen(false); setEditingRequest(null); setModalError(''); };

    const handleEditInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        const inputValue = type === 'checkbox' ? checked : value;

        setEditingRequest(prev => {
            if (!prev) return null;
            if (name.startsWith('contactDetails.')) {
                const field = name.split('.')[1];
                return { ...prev, contactDetails: { ...(prev.contactDetails || {}), [field]: inputValue } };
            } else {
                return { ...prev, [name]: inputValue };
            }
        });
    };

    const handleSaveEdit = async () => {
        if (!editingRequest?._id) {
            setModalError("No request selected for editing."); return;
        }
        setIsSavingEdit(true); setModalError(''); setError('');

        try {
            const payload = { ...editingRequest };

            if (payload.selectedDate) {
                 try {
                    payload.selectedDate = new Date(payload.selectedDate).toISOString();
                 } catch(dateError) {
                    throw new Error("Invalid date format for pickup date.");
                 }
            } else { payload.selectedDate = null; }

            if (payload.estimatedWeight === '' || payload.estimatedWeight === null || payload.estimatedWeight === undefined) {
                payload.estimatedWeight = null;
            } else {
                const numWeight = parseFloat(payload.estimatedWeight);
                if (isNaN(numWeight) || numWeight < 0) {
                    throw new Error("Estimated weight must be a valid non-negative number.");
                }
                payload.estimatedWeight = numWeight;
            }
            
            payload.adminNotes = payload.adminNotes || ""; // Ensure adminNotes is at least an empty string

            const initialStatusBeforeEdit = payload.initialStatus; // Get the status before edits in modal
            delete payload.initialStatus; // Don't send this to backend

            delete payload._id;
            delete payload.bookingId;
            delete payload.createdAt;
            delete payload.updatedAt;
            delete payload.userId;
            delete payload.userModel;

            const response = await axiosInstance.put(
                `${API_ENDPOINTS.BOOKINGS.UPDATE_BASE || '/api/bookings'}/${editingRequest._id}`,
                payload
            );

            if (response.data?.success) {
                setRequests(prevRequests =>
                    prevRequests.map(req =>
                        req._id === editingRequest._id ? response.data.data : req
                    )
                );
                handleCloseEditModal();
                // Optional: Add toast/notification about email being sent if status changed
                if (payload.status !== initialStatusBeforeEdit && (payload.status === 'confirmed' || payload.status === 'cancelled')) {
                    console.log("Booking status changed and relevant for email, user will be notified.");
                    // You can set a temporary message here or use a toast library.
                    // setError(`Booking ${payload.status}. User will be notified.`);
                    // setTimeout(() => setError(''), 4000);
                }
            } else {
                throw new Error(response.data?.message || 'Failed to save changes.');
            }
        } catch (err) {
            let detailedMessage = err.message || 'Could not save changes.';
            if (err.response?.data?.message) detailedMessage = err.response.data.message;
            if (err.response?.data?.errors) {
                const validationErrors = Object.values(err.response.data.errors).map(e => e.message).join('; ');
                detailedMessage += ` Details: ${validationErrors}`;
            }
            setModalError(detailedMessage);
        } finally {
            setIsSavingEdit(false);
        }
    };

    const handleViewDetails = (request) => {
        handleOpenEditModal(request); // Re-using edit modal for view, could be a read-only version later
    };

    if (isLoading && requests.length === 0) {
        return <div className="adcr-loading-container"><ClipLoader size={50} color="#f97316" /><p>Loading Requests...</p></div>;
    }

    return (
        <div className="ad-check-req-container">
            <div className="adcr-header-section">
                <h2 className="adcr-page-title">Manage Pickup Requests</h2>
                <button onClick={() => fetchRequests(true)} className="adcr-refresh-button" title="Refresh List" disabled={isLoading}>
                    <RefreshCw size={16} /> {isLoading && actionLoading !== 'refresh' ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {error && !isModalOpen && <div className="adcr-error-banner"><AlertTriangle size={18} /><span>{error}</span></div>}

            {requests.length === 0 && !isLoading && (
                <div className="adcr-empty-state-container">
                    <Package size={48} className="adcr-empty-icon" />
                    <p className="adcr-empty-state-title">No pickup requests found.</p>
                </div>
            )}

            {requests.length > 0 && (
                <div className="adcr-table-wrapper">
                    <table className="adcr-requests-table">
                        <thead>
                            <tr>
                                <th className="adcr-th-style"><User size={14} /> Customer</th>
                                <th className="adcr-th-style"><Calendar size={14} /> Date & Time Slot</th>
                                <th className="adcr-th-style"><MapPin size={14} /> Location & Area</th>
                                <th className="adcr-th-style"><Weight size={14} /> Est. Wt.</th>
                                <th className="adcr-th-style">Status</th>
                                <th className="adcr-th-style">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req) => (
                                <tr key={req._id} className={`adcr-table-row ${actionLoading === req._id ? 'row-loading-overlay' : ''}`}>
                                    <td className="adcr-td-style">
                                        <div><strong>{req.contactDetails?.name || 'N/A'}</strong> ({req.bookingId})</div>
                                        {req.contactDetails?.phone && <div className="adcr-sub-text"><Phone size={12} /> {req.contactDetails.phone}</div>}
                                        {req.contactDetails?.email && <div className="adcr-sub-text adcr-break-all"><Mail size={12} /> {req.contactDetails.email}</div>}
                                        {req.userId && <div className="adcr-sub-text">User ID: {typeof req.userId === 'object' ? req.userId.name || req.userId._id : req.userId}</div>}
                                    </td>
                                    <td className="adcr-td-style">
                                        <div>{formatDate(req.selectedDate)}</div>
                                        {/* req.timeSlotId will now display the time string directly */}
                                        <div className="adcr-sub-text"><Clock size={12} /> {req.timeSlotId || 'N/A'}</div>
                                    </td>
                                    <td className="adcr-td-style adcr-location-cell">
                                        <div>{req.pickupLocation || 'N/A'}</div>
                                        <div className="adcr-sub-text"><Map size={12} /> Area: {req.serviceAreaId || 'N/A'}</div>
                                    </td>
                                    <td className="adcr-td-style">{formatWeightDisplay(req.estimatedWeight)}</td>
                                    <td className="adcr-td-style">{renderStatus(req.status)}</td>
                                    <td className="adcr-td-style">
                                        <div className="adcr-action-buttons-container">
                                            {(actionLoading === req._id && !isSavingEdit) ? (<ClipLoader size={18} color="#f97316" />) : (<>
                                                <button onClick={() => handleViewDetails(req)} className="adcr-action-btn adcr-view-btn" title="View Details" disabled={!!actionLoading}> <Eye size={16} /> </button>
                                                <button onClick={() => handleOpenEditModal(req)} className="adcr-action-btn adcr-edit-btn" title="Edit Request" disabled={!!actionLoading || req.status === 'completed' || req.status === 'cancelled'}> <Edit size={16} /> </button>
                                                
                                                {req.status === 'pending' && (<>
                                                    <button onClick={() => handleUpdateStatus(req._id, 'confirmed')} className="adcr-action-btn adcr-confirm-btn" title="Confirm Request" disabled={!!actionLoading}> <CheckSquare size={16} /> </button>
                                                    <button onClick={() => handleUpdateStatus(req._id, 'cancelled')} className="adcr-action-btn adcr-cancel-btn" title="Cancel Request" disabled={!!actionLoading}> <XSquare size={16} /> </button>
                                                </>)}
                                                {req.status === 'confirmed' && req.status !== 'completed' && (
                                                    <button onClick={() => handleUpdateStatus(req._id, 'completed')} className="adcr-action-btn adcr-complete-btn" title="Mark as Completed" disabled={!!actionLoading}> <CheckSquare size={16} /> Mark Done </button>
                                                )}
                                                {(req.status !== 'completed') && ( // Allow deleting pending/confirmed/cancelled
                                                    <button onClick={() => handleDelete(req._id, req.bookingId)} className="adcr-action-btn adcr-delete-btn" title="Delete Request" disabled={!!actionLoading}> <Trash2 size={16} /> </button>
                                                )}
                                            </>)}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && editingRequest && (
                <EditBookingModal
                    isOpen={isModalOpen}
                    onClose={handleCloseEditModal}
                    requestData={editingRequest}
                    onInputChange={handleEditInputChange}
                    onSave={handleSaveEdit}
                    isSaving={isSavingEdit}
                    error={modalError}
                    timeSlots={calendarSettings.timeSlots}
                    serviceAreas={calendarSettings.serviceAreas}
                />
            )}
        </div>
    );
};

export default AdCheckReq;