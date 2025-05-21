import React from 'react';
import { Paperclip, Star, User } from 'lucide-react'; 
import './EmailDisplay.css'; 

const formatShortDate = (dateString) => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();

        if (isToday) {
            return date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
        }
    } catch (e) {
        console.error("Error formatting short date:", dateString, e);
        return '';
    }
};


const EmailListItem = ({ email, isSelected, onSelect }) => {
    const safeEmail = {
        id: email?.id || 'unknown',
        from: email?.from || { name: 'Unknown', email: '' },
        subject: email?.subject || '(No Subject)',
        date: email?.date || new Date().toISOString(),
        isRead: email?.isRead ?? true, 
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
            aria-current={isSelected ? 'true' : 'false'} 
            role="listitem" 
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
            </div>
        </button>
    );
};

export default EmailListItem;