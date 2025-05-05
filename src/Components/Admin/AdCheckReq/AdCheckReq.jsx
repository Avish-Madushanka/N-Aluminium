// src/Components/Admin/AdCheckReq/AdCheckReq.jsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  User, Phone, Mail, MapPin, Package, Weight, Clock, Calendar, Edit,
  CheckSquare, XSquare, Eye, Trash2, AlertTriangle, RefreshCw
} from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import EditBookingModal from './EditBookingModal';
import './AdCheckReq.css'; // Ensure CSS file exists

const API_BASE_URL = '/api/bookings';

// --- Helper Functions ---
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try { return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }); }
    catch (e) { return 'Invalid Date'; }
};
const formatTime = (dateString) => {
    if (!dateString) return '';
    try { return new Date(dateString).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true }); }
    catch (e) { return ''; }
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

// --- Main Component ---
const AdCheckReq = () => {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(null); // Tracks ID for row actions
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRequest, setEditingRequest] = useState(null);
    const [isSavingEdit, setIsSavingEdit] = useState(false);
    const [modalError, setModalError] = useState('');

    // Fetch requests
    const fetchRequests = useCallback(async (showLoadingSpinner = true) => {
        if (showLoadingSpinner) setIsLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("Admin token not found.");
            const response = await axios.get(API_BASE_URL, { headers: { Authorization: `Bearer ${token}` } });
            if (response.data?.success) {
                const sortedRequests = (response.data.data || []).sort((a, b) => {
                    const statusOrder = { 'pending': 1, 'confirmed': 2, 'cancelled': 3, 'completed': 4 };
                    const statusCompare = (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
                    if (statusCompare !== 0) return statusCompare;
                    return new Date(b.selectedDate) - new Date(a.selectedDate);
                });
                setRequests(sortedRequests);
            } else { throw new Error(response.data?.message || 'Failed to fetch requests'); }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Could not load requests');
        } finally {
            if (showLoadingSpinner) setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchRequests(); }, [fetchRequests]);

    // Update Status
    const handleUpdateStatus = async (id, newStatus) => {
        setActionLoading(id); setError('');
        const originalStatus = requests.find(req => req._id === id)?.status;
        setRequests(prev => prev.map(req => req._id === id ? { ...req, status: newStatus } : req));
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_BASE_URL}/${id}/status`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
            // Success: rely on optimistic update or call fetchRequests(false);
        } catch (err) {
            setError(err.response?.data?.message || `Failed to update status`);
            setRequests(prev => prev.map(req => req._id === id ? { ...req, status: originalStatus } : req)); // Revert
        } finally { setActionLoading(null); }
    };

    // Delete Request
    const handleDelete = async (id) => {
        if (!window.confirm(`DELETE request ${id}? This cannot be undone.`)) return;
        setActionLoading(id); setError('');
        const originalRequests = [...requests];
        setRequests(prev => prev.filter(req => req._id !== id));
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            // Success: optimistic delete is kept
        } catch (err) {
            setError(err.response?.data?.message || `Failed to delete request`);
            setRequests(originalRequests); // Revert
        } finally { setActionLoading(null); }
    };

    // --- Edit Modal Logic ---
    const handleOpenEditModal = (request) => {
        const localISODateTime = request.selectedDate
            ? new Date(new Date(request.selectedDate).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)
            : '';
        setEditingRequest({ ...request, selectedDate: localISODateTime, contactDetails: request.contactDetails || {} });
        setModalError(''); setIsModalOpen(true);
    };
    const handleCloseEditModal = () => { setIsModalOpen(false); setEditingRequest(null); setModalError(''); };
    const handleEditInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        const inputValue = type === 'checkbox' ? checked : value;
        setEditingRequest(prev => {
            if (!prev) return null;
            if (name.startsWith('contactDetails.')) {
                const field = name.split('.')[1];
                return { ...prev, contactDetails: { ...prev.contactDetails, [field]: inputValue } };
            } else { return { ...prev, [name]: inputValue }; }
        });
    };
    const handleSaveEdit = async () => {
        if (!editingRequest?._id) return;
        setIsSavingEdit(true); setModalError(''); setError('');
        try {
            const token = localStorage.getItem('token');
            const payload = { ...editingRequest };
            if (payload.selectedDate) {
                 try { payload.selectedDate = new Date(payload.selectedDate).toISOString(); }
                 catch { throw new Error("Invalid date format entered."); }
            } else { payload.selectedDate = null; } // Handle empty date
            payload.estimatedWeight = (payload.estimatedWeight === '' || payload.estimatedWeight === null || payload.estimatedWeight === undefined) ? undefined : Number(payload.estimatedWeight);
            // Remove fields backend shouldn't update directly in payload
            delete payload._id; delete payload.bookingId; delete payload.createdAt; delete payload.updatedAt;

            const response = await axios.put(`${API_BASE_URL}/${editingRequest._id}`, payload, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } });
            if (response.data?.success) {
                setRequests(prev => prev.map(req => req._id === editingRequest._id ? response.data.data : req));
                handleCloseEditModal();
            } else { throw new Error(response.data?.message || 'Failed to save changes'); }
        } catch (err) {
            setModalError(err.response?.data?.message || err.message || 'Could not save changes.');
        } finally { setIsSavingEdit(false); }
    };

    // View Details (Placeholder)
    const handleViewDetails = (id) => { alert(`View details for request ${id} - Implement modal.`); };

    // --- Render ---
    if (isLoading) return <div className="loading-container"><ClipLoader size={40} color="#f97316" /></div>;

    return (
        <div className="ad-check-req-container">
            <div className="header-section">
                <h2 className="page-title">Manage Pickup Requests</h2>
                <button onClick={() => fetchRequests(true)} className="refresh-button" title="Refresh List" disabled={isLoading}>
                    <RefreshCw size={16} /> Refresh
                </button>
            </div>

            {error && !isLoading && <div className="error-banner"><AlertTriangle size={18} /><span>{error}</span></div>}

            {requests.length === 0 && !isLoading && (
                <div className="empty-state-container">
                    <Package size={32} />
                    <p className="empty-state-title">No pickup requests found.</p>
                </div>
            )}

            {requests.length > 0 && (
                <div className="table-wrapper">
                    <table className="requests-table">
                        <thead>
                            <tr>
                                <th className="th-style"><Calendar size={14} className="icon" />Date / Time</th>
                                <th className="th-style"><User size={14} className="icon" />Customer</th>
                                <th className="th-style"><MapPin size={14} className="icon" />Location</th>
                                <th className="th-style"><Package size={14} className="icon" />Material</th>
                                <th className="th-style"><Weight size={14} className="icon" />Est. Wt.</th>
                                <th className="th-style">Status</th>
                                <th className="th-style">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req) => (
                                <tr key={req._id} className={`table-row ${actionLoading === req._id ? 'row-loading' : ''}`}>
                                    <td className="td-style"><div>{formatDate(req.selectedDate)}</div><div className="sub-text">{req.timeSlotId || formatTime(req.selectedDate)}</div></td>
                                    <td className="td-style"><div>{req.contactDetails?.name || 'N/A'}</div>{req.contactDetails?.phone && <div className="sub-text"><Phone size={12} className="icon" /> {req.contactDetails.phone}</div>}{req.contactDetails?.email && <div className="sub-text break-all"><Mail size={12} className="icon" /> {req.contactDetails.email}</div>}</td>
                                    <td className="td-style location-cell">{req.pickupLocation || 'N/A'}</td>
                                    <td className="td-style">{req.materialTypeId || 'N/A'}</td>
                                    <td className="td-style">{req.estimatedWeight ? `${req.estimatedWeight} kg` : 'N/A'}</td>
                                    <td className="td-style">{renderStatus(req.status)}</td>
                                    <td className="td-style">
                                        <div className="action-buttons-container">
                                            {(actionLoading === req._id && !isSavingEdit) ? (<ClipLoader size={18} color="#f97316" />) : (<>
                                                <button onClick={() => handleViewDetails(req._id)} className="action-btn view-btn" title="View Details" disabled={!!actionLoading}> <Eye size={16} /> </button>
                                                <button onClick={() => handleOpenEditModal(req)} className="action-btn edit-btn" title="Edit Request" disabled={!!actionLoading || req.status === 'completed' || req.status === 'cancelled'}> <Edit size={16} /> </button>
                                                {req.status === 'pending' && (<>
                                                    <button onClick={() => handleUpdateStatus(req._id, 'confirmed')} className="action-btn confirm-btn" title="Confirm Request" disabled={!!actionLoading}> <CheckSquare size={16} /> </button>
                                                    <button onClick={() => handleUpdateStatus(req._id, 'cancelled')} className="action-btn cancel-btn" title="Cancel Request" disabled={!!actionLoading}> <XSquare size={16} /> </button>
                                                </>)}
                                                {(req.status !== 'completed') && (<button onClick={() => handleDelete(req._id)} className="action-btn delete-btn" title="Delete Request" disabled={!!actionLoading}> <Trash2 size={16} /> </button>)}
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
                />
            )}
        </div>
    );
};

export default AdCheckReq;