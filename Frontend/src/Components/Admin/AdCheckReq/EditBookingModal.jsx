// src/Components/Admin/AdCheckReq/EditBookingModal.jsx
import React from 'react';
import { X, Save } from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import './EditBookingModal.css';

// Add timeSlots to props (serviceAreas is optional if you also change that field)
function EditBookingModal({
    isOpen,
    onClose,
    requestData,
    onInputChange,
    onSave,
    isSaving,
    error,
    timeSlots = [], // Default to empty array if not provided
    // serviceAreas = []
}) {
    if (!isOpen || !requestData) return null;

    const handleModalContentClick = (e) => e.stopPropagation();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isSaving) onSave();
    };

    const activeTimeSlots = timeSlots.filter(slot => slot.active);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={handleModalContentClick}>
                <div className="modal-header">
                    <h2 className="modal-title">Edit Booking Request ({requestData.bookingId || requestData._id?.slice(-6)})</h2>
                    <button onClick={onClose} className="modal-close-button" aria-label="Close modal" disabled={isSaving}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    {error && <div className="modal-error-banner">{error}</div>}

                    <div className="form-grid">
                        {/* Column 1 */}
                        <div className="form-group">
                            <label htmlFor="selectedDate" className="form-label">Pickup Date & Time*</label>
                            <input type="datetime-local" id="selectedDate" name="selectedDate" value={requestData.selectedDate || ''} onChange={onInputChange} className="form-input" required disabled={isSaving} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="timeSlotId" className="form-label">Time Slot*</label>
                            {/* Change to select dropdown */}
                            <select
                                id="timeSlotId"
                                name="timeSlotId"
                                value={requestData.timeSlotId || ''}
                                onChange={onInputChange}
                                className="form-select" // Use form-select for consistent styling
                                required
                                disabled={isSaving || activeTimeSlots.length === 0}
                            >
                                <option value="">Select Time Slot</option>
                                {/* Ensure the currently selected timeSlotId is an option, even if not in activeTimeSlots (e.g., if it was deactivated) */}
                                {requestData.timeSlotId && !activeTimeSlots.some(ts => ts.time === requestData.timeSlotId) && (
                                    <option value={requestData.timeSlotId} disabled>
                                        {requestData.timeSlotId} (Current)
                                    </option>
                                )}
                                {activeTimeSlots.map(slot => (
                                    <option key={slot.id} value={slot.time}> {/* VALUE is slot.time */}
                                        {slot.label} ({slot.time})
                                    </option>
                                ))}
                            </select>
                            {activeTimeSlots.length === 0 && !isSaving && (
                                <small className="form-text text-muted" style={{color: 'red'}}>
                                    No active time slots available. Check calendar settings.
                                </small>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="contactName" className="form-label">Contact Name*</label>
                            <input type="text" id="contactName" name="contactDetails.name" value={requestData.contactDetails?.name || ''} onChange={onInputChange} className="form-input" required disabled={isSaving} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="contactPhone" className="form-label">Contact Phone*</label>
                            <input type="tel" id="contactPhone" name="contactDetails.phone" value={requestData.contactDetails?.phone || ''} onChange={onInputChange} className="form-input" required disabled={isSaving} />
                        </div>
                         <div className="form-group full-width">
                            <label htmlFor="contactEmail" className="form-label">Contact Email*</label>
                            <input type="email" id="contactEmail" name="contactDetails.email" value={requestData.contactDetails?.email || ''} onChange={onInputChange} className="form-input" required disabled={isSaving} />
                        </div>

                        {/* Column 2 */}
                        <div className="form-group">
                            <label htmlFor="materialTypeId" className="form-label">Material Type ID*</label>
                            <input type="text" id="materialTypeId" name="materialTypeId" value={requestData.materialTypeId || ''} onChange={onInputChange} className="form-input" placeholder="e.g., cans-id" required disabled={isSaving} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="estimatedWeight" className="form-label">Est. Weight (kg)</label>
                            <input type="number" id="estimatedWeight" name="estimatedWeight" step="0.1" min="0" value={requestData.estimatedWeight ?? ''} onChange={onInputChange} className="form-input" placeholder="Optional" disabled={isSaving} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="serviceAreaId" className="form-label">Service Area ID*</label>
                            {/* Keeping serviceAreaId as text for now, but could be a dropdown similar to timeSlotId */}
                            <input type="text" id="serviceAreaId" name="serviceAreaId" value={requestData.serviceAreaId || ''} onChange={onInputChange} className="form-input" placeholder="e.g., downtown-id" required disabled={isSaving} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="status" className="form-label">Status*</label>
                            <select id="status" name="status" value={requestData.status || 'pending'} onChange={onInputChange} className="form-select" required disabled={isSaving}>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div className="form-group full-width">
                            <label htmlFor="pickupLocation" className="form-label">Pickup Location*</label>
                            <textarea id="pickupLocation" name="pickupLocation" rows="3" value={requestData.pickupLocation || ''} onChange={onInputChange} className="form-input" required disabled={isSaving} />
                        </div>
                        <div className="form-group full-width">
                            <label htmlFor="adminNotes" className="form-label">Admin Notes (for user email on cancellation)</label>
                            <textarea id="adminNotes" name="adminNotes" rows="3" value={requestData.adminNotes || ''} onChange={onInputChange} className="form-input" placeholder="Optional notes for the user, e.g., reason for cancellation." disabled={isSaving} />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" onClick={onClose} disabled={isSaving} className="button secondary-button">Cancel</button>
                        <button type="submit" disabled={isSaving} className="button primary-button">
                            {isSaving ? <ClipLoader size={18} color="#fff" /> : <Save size={16} />}
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditBookingModal;