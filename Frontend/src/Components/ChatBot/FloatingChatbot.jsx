import React, { useState, useEffect } from 'react';
import './FloatingChatBot.css';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [position, setPosition] = useState({ x: window.innerWidth - 320, y: window.innerHeight - 400 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Common questions and answers
  const qaPairs = {
    "hello": "Hello! How can I help you with recycling today?",
    "hi": "Hi there! I'm here to help with all your recycling questions.",
    "pickup": "You can check pickup dates on our calendar page. Would you like me to take you there?",
    "recycle": "We accept various materials including paper, plastic, metal, and electronics. What would you like to recycle?",
    "schedule": "Regular pickups occur every Wednesday. You can check specific dates on our calendar.",
    "value": "Scrap values change daily. Please use our calculator tool for current prices.",
    "contact": "You can reach us at (555) 123-4567 or info@recyclecompany.com",
    "hours": "Our customer service is available Monday-Friday, 9am-5pm.",
    "location": "Our main facility is located at 123 Green Way, Eco City.",
    "thanks": "You're welcome! Is there anything else I can help with?",
    "thank you": "You're welcome! Is there anything else I can help with?",
    "default": "I'm sorry, I didn't understand that. Here are some things I can help with: pickup schedule, recycling guidelines, scrap values, or contact information."
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => ({
        x: Math.min(prev.x, window.innerWidth - 300),
        y: Math.min(prev.y, window.innerHeight - (isMinimized ? 50 : 400))
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMinimized]);

  // Drag and drop handlers
  const handleMouseDown = (e) => {
    if (e.target.className.includes('chatbot-header')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    setPosition({
      x: Math.max(0, Math.min(newX, window.innerWidth - 300)),
      y: Math.max(0, Math.min(newY, window.innerHeight - (isMinimized ? 50 : 400)))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage = { text: inputValue, sender: 'user' };
    setMessages([...messages, userMessage]);

    // Find the best matching answer
    const lowerInput = inputValue.toLowerCase();
    let response = qaPairs.default;

    for (const [question, answer] of Object.entries(qaPairs)) {
      if (lowerInput.includes(question)) {
        response = answer;
        break;
      }
    }

    // Add bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { text: response, sender: 'bot' }]);
    }, 500);

    setInputValue('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div 
      className={`floating-chatbot ${isOpen ? 'open' : ''} ${isMinimized ? 'minimized' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="chatbot-header">
        <h3>RecycleBot</h3>
        <div className="chatbot-controls">
          <button onClick={toggleMinimize}>
            {isMinimized ? '+' : '−'}
          </button>
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? '×' : ''}
          </button>
        </div>
      </div>
      
      {isOpen && !isMinimized && (
        <div className="chatbot-content">
          <div className="chatbot-messages">
            {messages.length === 0 ? (
              <div className="welcome-message">
                <p>Hello! I'm RecycleBot. Ask me about:</p>
                <ul>
                  <li>Pickup schedules</li>
                  <li>Recycling guidelines</li>
                  <li>Scrap metal values</li>
                  <li>Company contact info</li>
                </ul>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender}`}>
                  {msg.text}
                </div>
              ))
            )}
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your question..."
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingChatbot;