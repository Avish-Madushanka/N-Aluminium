import React from 'react';
import { Paperclip, Star, User } from 'lucide-react'; // Add icons as needed
import './EmailDisplay.css'; // Reuse the CSS file

// Helper function for short date format (adjust as needed)
const formatShortDate = (dateString) => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();

        if (isToday) {
            // Format as time if today
            return date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        } else {
            // Format as short date if older
            return date.toLocaleDateString('en-US', {
                month: 'short', // e.g., "Sep"
                day: 'numeric'    // e.g., "20"
            });
        }
    } catch (e) {
        console.error("Error formatting short date:", dateString, e);
        return ''; // Return empty string on error
    }
};


const EmailListItem = ({ email, isSelected, onSelect }) => {
    // Basic default for safety
    const safeEmail = {
        id: email?.id || 'unknown',
        from: email?.from || { name: 'Unknown', email: '' },
        subject: email?.subject || '(No Subject)',
        date: email?.date || new Date().toISOString(),
        isRead: email?.isRead ?? true, // Default to read if not specified
        hasAttachments: email?.attachments && email.attachments.length > 0,
    };

    const senderName = safeEmail.from.name || safeEmail.from.email || 'Unknown Sender';

    const handleSelect = () => {
        if (onSelect) {
            onSelect(safeEmail.id);
        }
    };

    return (
        <button
            className={`email-list-item ${isSelected ? 'selected' : ''} ${safeEmail.isRead ? 'read' : 'unread'}`}
            onClick={handleSelect}
            aria-current={isSelected ? 'true' : 'false'} // Indicate selection for screen readers
            role="listitem" // Explicit role as it's inside a list-like structure
        >
            <div className="item-main-content">
                <span className="item-sender">{senderName}</span>
                <span className="item-subject">{safeEmail.subject}</span>
            </div>
            <div className="item-meta">
                 {safeEmail.hasAttachments && (
                    <Paperclip size={14} className="item-icon attachment-indicator" title="Has attachments" />
                 )}
                <span className="item-date">{formatShortDate(safeEmail.date)}</span>
                {/* Optional: Add other icons like Star for flagged emails */}
                {/* {email.isStarred && <Star size={14} className="item-icon star-indicator" />} */}
            </div>
        </button>
    );
};

export default EmailListItem;