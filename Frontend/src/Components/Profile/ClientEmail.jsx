import { useState, useEffect } from 'react';
import { Star, StarOff, Flag, Trash2, Archive, Mail, MailOpen, Clock, Paperclip, ChevronDown } from 'lucide-react';
import "./ClientEmail.css"; // Import the CSS file

// Sample email data
const emailData = [
  {
    id: 1,
    sender: "John Smith",
    email: "john.smith@example.com",
    subject: "Project Update - Q2 Results",
    preview: "Hi team, I wanted to share the latest project metrics from Q2. We've seen a significant improvement in...",
    time: "10:23 AM",
    read: false,
    starred: true,
    hasAttachment: true,
    labels: ["Work", "Important"]
  },
  {
    id: 2,
    sender: "Marketing Team",
    email: "marketing@company.com",
    subject: "New Campaign Launch Details",
    preview: "The summer promotion is ready to launch! Please review the following materials and provide your feedback by...",
    time: "Yesterday",
    read: true,
    starred: false,
    hasAttachment: false,
    labels: ["Work"]
  },
  {
    id: 3,
    sender: "Sarah Wilson",
    email: "sarah.w@example.com",
    subject: "Coffee next week?",
    preview: "Hey! I was wondering if you'd like to grab coffee sometime next week? I'm free on Tuesday and Thursday...",
    time: "May 2",
    read: true,
    starred: true,
    hasAttachment: false,
    labels: ["Personal"]
  },
  {
    id: 4,
    sender: "Netflix",
    email: "info@netflix.com",
    subject: "New shows added to your list",
    preview: "We've just added new shows that match your interests. Check out these recommendations based on your viewing...",
    time: "Apr 29",
    read: false,
    starred: false,
    hasAttachment: false,
    labels: ["Updates"]
  },
  {
    id: 5,
    sender: "Alex Johnson",
    email: "alex.j@example.com",
    subject: "Meeting notes and action items",
    preview: "Attached are the notes from yesterday's strategy meeting. Key action items are highlighted in the document...",
    time: "Apr 28",
    read: true,
    starred: false,
    hasAttachment: true,
    labels: ["Work"]
  }
];

export default function ClientEmai() {
  const [emails, setEmails] = useState(emailData);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [newEmailId, setNewEmailId] = useState(null);

  // Simulate a new email arriving
  useEffect(() => {
    const timer = setTimeout(() => {
      const newEmail = {
        id: 6,
        sender: "Project Manager",
        email: "pm@company.com",
        subject: "Weekly status update required",
        preview: "Please submit your weekly status report by end of day Friday. The template is attached for your...",
        time: "Just now",
        read: false,
        starred: false,
        hasAttachment: true,
        labels: ["Work", "Important"]
      };
      
      setEmails(prevEmails => [newEmail, ...prevEmails]);
      setNewEmailId(newEmail.id);
      
      // Remove the "new email" effect after animation completes
      setTimeout(() => {
        setNewEmailId(null);
      }, 2000);
    }, 5000); // Show new email after 5 seconds
    
    return () => clearTimeout(timer);
  }, []);

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(emails.map(email => email.id));
    }
    setSelectAll(!selectAll);
  };

  const toggleSelectEmail = (id) => {
    if (selectedEmails.includes(id)) {
      setSelectedEmails(selectedEmails.filter(emailId => emailId !== id));
    } else {
      setSelectedEmails([...selectedEmails, id]);
    }
  };

  const toggleStar = (id) => {
    setEmails(emails.map(email => 
      email.id === id ? { ...email, starred: !email.starred } : email
    ));
  };

  const markAsRead = (id) => {
    setEmails(emails.map(email => 
      email.id === id ? { ...email, read: true } : email
    ));
  };

  const getLabelClass = (label) => {
    switch(label) {
      case 'Work': return 'email-label work';
      case 'Personal': return 'email-label personal';
      case 'Important': return 'email-label important';
      case 'Updates': return 'email-label updates';
      default: return 'email-label';
    }
  };

  const getEmailClasses = (email) => {
    let classes = 'email-item';
    if (!email.read) classes += ' unread';
    if (selectedEmails.includes(email.id)) classes += ' selected';
    if (email.id === newEmailId) classes += ' new-email';
    return classes;
  };

  return (
    <div className="profile-email-list-container">
      {/* Email toolbar */}
      <div className="email-toolbar">
        <div className="flex items-center mr-4">
          <input 
            type="checkbox" 
            checked={selectAll}
            onChange={toggleSelectAll}
            className="custom-checkbox"
          />
          <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
        </div>
        
        <div className="flex space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Archive className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Trash2 className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Mail className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Clock className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        
        <div className="ml-auto">
          <span className="toolbar-counter">1-{emails.length} of {emails.length}</span>
        </div>
      </div>
      
      {/* Email list */}
      <div className="flex-1 overflow-y-auto email-list">
        {emails.length > 0 ? (
          emails.map((email) => (
            <div 
              key={email.id}
              className={getEmailClasses(email)}
              onClick={() => markAsRead(email.id)}
            >
              <div className="flex items-center p-4">
                <div className="flex items-center space-x-4 w-full">
                  {/* Selection and star */}
                  <div className="flex items-center space-x-3">
                    <input 
                      type="checkbox" 
                      checked={selectedEmails.includes(email.id)}
                      onChange={() => toggleSelectEmail(email.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="custom-checkbox"
                    />
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(email.id);
                      }}
                      className="star-button"
                    >
                      {email.starred ? (
                        <Star className="star-icon starred" />
                      ) : (
                        <StarOff className="star-icon" />
                      )}
                    </button>
                  </div>
                  
                  {/* Email content */}
                  <div className="email-content">
                    <div className="email-content-row">
                      <div className="email-sender w-48 truncate">
                        {email.sender}
                      </div>
                      <div className="flex-1 truncate">
                        <span className="email-subject">
                          {email.subject}
                        </span>
                        <span className="email-preview-desktop"> - {email.preview}</span>
                      </div>
                    </div>
                    <div className="email-preview-mobile">
                      {email.preview}
                    </div>
                  </div>
                  
                  {/* Email metadata */}
                  <div className="flex items-center space-x-2">
                    {email.hasAttachment && (
                      <Paperclip className="attachment-icon h-4 w-4" />
                    )}
                    
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {email.labels && email.labels.map((label, idx) => (
                        <span 
                          key={idx} 
                          className={getLabelClass(label)}
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                    
                    <div className="email-time">
                      {email.time}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📥</div>
            <div className="empty-state-text">No emails in your inbox</div>
            <div className="empty-state-subtext">You're all caught up!</div>
          </div>
        )}
      </div>
    </div>
  );
}