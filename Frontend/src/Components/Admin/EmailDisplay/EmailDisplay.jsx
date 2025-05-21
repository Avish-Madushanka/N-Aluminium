import React, { useState } from 'react';
import { Inbox } from 'lucide-react';
import EmailListItem from './EmailListItem'; 
import './EmailDisplay.css'; 

const EmailList = ({ emails = [], initialSelectedId = null }) => {

    const [selectedEmailId, setSelectedEmailId] = useState(initialSelectedId);

    const handleSelectEmail = (id) => {
        setSelectedEmailId(id);
        console.log("Selected email ID:", id);
    };

    const sortedEmails = [...emails].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="email-list-container" role="list" aria-label="Email list">
            {sortedEmails.length === 0 ? (
                <div className="no-emails-message">
                    <Inbox size={48} />
                    <p>No emails to display.</p>
                </div>
            ) : (
                sortedEmails.map(email => (
                    <EmailListItem
                        key={email.id}
                        email={email}
                        isSelected={email.id === selectedEmailId}
                        onSelect={handleSelectEmail}
                    />
                ))
            )}
        </div>
    );
};

EmailList.defaultProps = {
    emails: [
        {
            id: 'email_1',
            from: { name: 'Support Team', email: 'support@company.com' },
            to: [{ email: 'user@example.com' }],
            subject: 'Your recent inquiry (Case #12345)',
            date: new Date().toISOString(), // Today
            isRead: false,
            attachments: [{ name: 'log.txt', size: '10 KB'}]
        },
        {
            id: 'email_2',
            from: { name: 'Marketing Newsletter', email: 'news@offers.com' },
            to: [{ email: 'user@example.com' }],
            subject: 'Weekly Deals & Updates!',
            date: new Date(Date.now() - 86400000 * 1).toISOString(), 
            isRead: false,
            attachments: []
        },
        {
            id: 'email_3',
            from: { name: 'John Doe', email: 'john.doe@colleague.com' },
            to: [{ email: 'user@example.com' }],
            subject: 'Project Alpha Meeting Notes',
            date: new Date(Date.now() - 86400000 * 2).toISOString(), 
            isRead: true,
            attachments: [{ name: 'meeting_notes.pdf', size: '250 KB'}]
        },
        {
            id: 'email_4',
            from: { email: 'alert@monitoring.com' }, 
            to: [{ email: 'user@example.com' }],
            subject: 'System Alert: High CPU Usage on Server X',
            date: new Date(Date.now() - 86400000 * 5).toISOString(), 
            isRead: true,
            attachments: []
        },
         {
            id: 'email_5',
            from: { name: 'Example Sender', email: 'sender@example.com' },
            to: [
                { name: 'Recipient One', email: 'recipient1@example.com' },
                { email: 'recipient2@example.com' }
            ],
            cc: [{ name: 'CC Recipient', email: 'cc@example.com'}],
            subject: 'Sample Email Subject Line with a very very long text that should ideally be truncated',
            date: new Date(Date.now() - 86400000 * 10).toISOString(),
            body: `Hello Team,\n\nThis is a sample email body text to demonstrate the display component.\n\nIt includes line breaks and basic formatting.\n\nBest regards,\nSender`,
            bodyType: 'text',
            isRead: true,
            attachments: [
                { name: 'document_v1.pdf', size: '1.2 MB', url: '#' },
                { name: 'image_screenshot.png', size: '350 KB', url: '#' },
                { name: 'archive.zip', size: '5.8 MB' } 
            ]
        }
    ],
    initialSelectedId: null
};


export default EmailList;