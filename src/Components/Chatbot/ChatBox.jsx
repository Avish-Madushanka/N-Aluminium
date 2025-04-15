import { useState, useRef, useEffect } from 'react';
import './ChatBox.css'; 

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! How can I help you today?", sender: "bot" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  const buttonRef = useRef(null);
  
  const botResponses = [
    "I'm here to help! What would you like to know?",
    "That's an interesting question. Let me think about that.",
    "Thanks for sharing that with me.",
    "I'm sorry, I don't have information about that specific topic.",
    "Could you tell me more about what you're looking for?",
    "I understand. Is there anything else you'd like to discuss?"
  ];
  
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;
    
    const newMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user"
    };
    
    setMessages([...messages, newMessage]);
    setInputValue("");
    
    setTimeout(() => {
      const botResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      setMessages(prevMessages => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          text: botResponse,
          sender: "bot"
        }
      ]);
    }, 1000);
  };
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    
    const rect = buttonRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };
  
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);
  
  return (
    <div 
      className="chatbot-container" 
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      <button
        ref={buttonRef}
        className={`chat-button ${isDragging ? 'dragging' : ''}`}
        onClick={toggleChat}
        onMouseDown={handleMouseDown}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="chat-popup">
          <div className="chat-header">
            <h2>Chat Support</h2>
            <button 
              className="close-button"
              onClick={toggleChat}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="messages-container">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.sender}`}
              >
                <div className="message-bubble">
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSubmit} className="chat-form">
            <div className="input-container">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type a message..."
                className="chat-input"
              />
              <button 
                type="submit" 
                className="send-button"
                disabled={!inputValue.trim()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}