import React, { useState, useEffect, useRef } from 'react';
import './FloatingChatBot.css';

const BOT_NAME = 'ALUX AI';
const BOT_SUBTITLE = 'Aluminum Recycling Assistant';
const API_URL = 'http://localhost:5003/api/chatbot';

const QUICK_TOPICS = [
  { icon: '🗓️', label: 'Book Pickup', prompt: 'How do I book a pickup?' },
  { icon: '💰', label: 'Check Prices', prompt: 'What is the price per kg?' },
  { icon: '♻️', label: 'Accepted Materials', prompt: 'What materials are accepted?' },
  { icon: '📍', label: 'Service Areas', prompt: 'What areas do you cover?' },
  { icon: '🥤', label: 'Glass Orders', prompt: 'Glass prices' },
  { icon: '📋', label: 'My Quotes', prompt: 'My quotes' },
  { icon: '🛒', label: 'Marketplace', prompt: 'Marketplace items' },
  { icon: '📁', label: 'ALUX Projects', prompt: 'ALUX Projects' },
  { icon: '🎓', label: 'Training', prompt: 'Training program' },
  { icon: '💼', label: 'Buy & Sell', prompt: 'Buy and sell guide' }
];

const TypingDots = () => (
  <div className="typing-dots">
    <span></span>
    span<span></span>
  </div>
);

const FormattedText = ({ text }) => {
  const lines = text.split('\n');
  return (
    <span>
      {lines.map((line, i) => {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <React.Fragment key={i}>
            {parts.map((part, j) =>
              part.startsWith('**') && part.endsWith('**')
                ? <strong key={j}>{part.slice(2, -2)}</strong>
                : part
            )}
            {i < lines.length - 1 && <br />}
          </React.Fragment>
        );
      })}
    </span>
  );
};

const ChatIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const MinusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M5 12h14" />
  </svg>
);

const ExpandIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
  </svg>
);

const NewChatIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

const FloatingChatbot = ({ userRole = 'client', userId = null, userEmail = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showHome, setShowHome] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!showHome && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, showHome]);

  useEffect(() => {
    if (isOpen && !isMinimized && !showHome) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen, isMinimized, showHome]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    setShowHome(false);
    setInputValue('');
    
    const userMessage = { text: trimmed, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const storedUserInfo = localStorage.getItem('userInfo');
      let userEmailToSend = userEmail;
      let userRoleToSend = userRole;
      let userIdToSend = userId;
      
      if (storedUserInfo && !userEmailToSend) {
        try {
          const userInfo = JSON.parse(storedUserInfo);
          userEmailToSend = userInfo.email;
          userIdToSend = userInfo.id;
          userRoleToSend = userInfo.role === 'businessOwner' ? 'business' : userInfo.role;
        } catch (e) {
          console.error('Failed to parse userInfo:', e);
        }
      }

      const response = await fetch(`${API_URL}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: trimmed, 
          userRole: userRoleToSend,
          userId: userIdToSend,
          sessionId: sessionId,
          userEmail: userEmailToSend
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      setMessages(prev => [...prev, { 
        text: data.response, 
        sender: 'bot', 
        timestamp: new Date(),
        roleDetected: data.roleDetected 
      }]);
      
      if (data.suggestedQuestions && data.suggestedQuestions.length > 0) {
        setSuggestions(data.suggestedQuestions);
      }
    } catch (error) {
      console.error('Chatbot API error:', error);
      let errorMessage = "⚠️ Sorry, I'm having trouble connecting to the ALUX assistant.\n\n";
      
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage += "Make sure backend server is running on port 5003: cd backend && npm run dev";
      } else if (error.message.includes('HTTP 404')) {
        errorMessage += "The chatbot endpoint was not found.";
      } else if (error.message.includes('HTTP 500')) {
        errorMessage += "The server encountered an error. Please try again later.";
      } else {
        errorMessage += error.message;
      }
      
      setMessages(prev => [...prev, { 
        text: errorMessage, 
        sender: 'bot',
        timestamp: new Date(),
        isError: true 
      }]);
      
      setSuggestions([
        "What is the price per kg?",
        "How do I book a pickup?",
        "Glass prices",
        "Check server status"
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = () => sendMessage(inputValue);
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setMessages([]);
    setShowHome(true);
    setInputValue('');
    setSuggestions([]);
  };

  const handleNewChat = () => {
    setMessages([]);
    setShowHome(true);
    setInputValue('');
    setSuggestions([]);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) {
    return (
      <button className="alux-launcher" onClick={handleOpen} aria-label="Open ALUX AI">
        <ChatIcon />
        <span>ALUX AI</span>
      </button>
    );
  }

  return (
    <div className={`alux-chat ${isMinimized ? 'alux-minimized' : 'alux-expanded'}`}>
      <div className="alux-header">
        <div className="alux-header-left">
          <div className="alux-avatar">
            <ChatIcon />
          </div>
          <div className="alux-header-info">
            <span className="alux-name">{BOT_NAME}</span>
            <span className="alux-status">
              <span className="alux-dot"></span>
              Online
            </span>
          </div>
        </div>
        <div className="alux-header-actions">
          {!isMinimized && messages.length > 0 && (
            <button className="alux-ctrl" onClick={handleNewChat} title="New chat">
              <NewChatIcon />
            </button>
          )}
          <button className="alux-ctrl" onClick={() => setIsMinimized(!isMinimized)} title={isMinimized ? 'Expand' : 'Minimize'}>
            {isMinimized ? <ExpandIcon /> : <MinusIcon />}
          </button>
          <button className="alux-ctrl alux-close" onClick={() => setIsOpen(false)} title="Close">
            <CloseIcon />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="alux-body">
          {showHome ? (
            <div className="alux-home">
              <div className="alux-home-hero">
                <div className="alux-hero-icon">♻️</div>
                <p className="alux-hero-title">Hi, I'm {BOT_NAME}</p>
                <p className="alux-hero-sub">{BOT_SUBTITLE}</p>
                <p className="alux-hero-desc">
                  I can help you with prices, bookings, glass orders, quotations, marketplace, training, projects, and buy & sell!
                </p>
              </div>

              <p className="alux-section-label">Quick actions</p>
              <div className="alux-topics">
                {QUICK_TOPICS.map((topic, index) => (
                  <button 
                    key={index} 
                    className="alux-topic-btn" 
                    onClick={() => sendMessage(topic.prompt)}
                  >
                    <span className="topic-icon">{topic.icon}</span>
                    <span className="topic-label">{topic.label}</span>
                  </button>
                ))}
              </div>

              <div className="alux-divider">
                <span>or ask anything</span>
              </div>

              <div className="alux-input-bar">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  autoFocus
                />
                <button 
                  className="alux-send" 
                  onClick={handleSend} 
                  disabled={!inputValue.trim()}
                >
                  <SendIcon />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="alux-messages">
                {messages.map((msg, index) => (
                  <div key={index} className={`alux-message-row ${msg.sender}`}>
                    {msg.sender === 'bot' && (
                      <div className="alux-message-avatar">
                        <ChatIcon />
                      </div>
                    )}
                    <div className={`alux-message-bubble ${msg.isError ? 'alux-error' : ''}`}>
                      {msg.sender === 'bot' ? (
                        <FormattedText text={msg.text} />
                      ) : (
                        msg.text
                      )}
                      <div className="alux-message-time">
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="alux-message-row bot">
                    <div className="alux-message-avatar">
                      <ChatIcon />
                    </div>
                    <div className="alux-message-bubble alux-typing">
                      <TypingDots />
                    </div>
                  </div>
                )}
                
                {suggestions.length > 0 && !isTyping && messages.length > 0 && (
                  <div className="alux-suggestions">
                    <p className="alux-suggestions-title">Suggested questions:</p>
                    <div className="alux-suggestions-list">
                      {suggestions.slice(0, 6).map((suggestion, index) => (
                        <button 
                          key={index} 
                          className="alux-suggestion-chip" 
                          onClick={() => sendMessage(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              <div className="alux-input-bar">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask ALUX AI anything..."
                  disabled={isTyping}
                />
                <button 
                  className="alux-send" 
                  onClick={handleSend} 
                  disabled={isTyping || !inputValue.trim()}
                >
                  <SendIcon />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FloatingChatbot;