import React, { useState, useEffect, useRef } from 'react';
import './ChatBot.css'; // We'll create this CSS file next
import { MessageSquare, X, Send, Bot } from 'lucide-react'; // Using lucide-react for icons

const qaPairs = {
  "hey": "Hi there! How can I help you today?",
  "hi": "Hello! What can I do for you?",
  "how are you": "I'm just a bunch of code, but I'm doing great! Thanks for asking.",
  "what is your name": "I'm your friendly website assistant!",
  "what services do you offer": "We offer a range of fantastic services! Could you be more specific, or would you like me to direct you to our services page?",
  "how to contact support": "You can contact support via email at support@example.com or call us at 123-456-7890. There's also a contact form on our 'Contact Us' page.",
  "what are your opening hours": "Our team is available from 9 AM to 5 PM, Monday to Friday. Our website is available 24/7!",
  "tell me a joke": "Why don't scientists trust atoms? Because they make up everything!",
  "bye": "Goodbye! Have a great day!",
  "thank you": "You're welcome!",
  "thanks": "No problem at all!"
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your virtual assistant. How can I help you?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const userMessage = { sender: 'user', text: inputValue };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    // Simple matching (case-insensitive)
    const lowerInput = inputValue.toLowerCase().trim();
    let botResponseText = "I'm sorry, I didn't understand that. Can you try rephrasing, or ask something else?";

    // Look for an exact match or a partial match (keyword)
    for (const question in qaPairs) {
      if (lowerInput.includes(question)) { // Using .includes for partial match
        botResponseText = qaPairs[question];
        break;
      }
    }
    
    // Simulate bot thinking time
    setTimeout(() => {
      const botMessage = { sender: 'bot', text: botResponseText };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    }, 500);

    setInputValue('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="floating-chatbot">
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>Chat Assistant <Bot size={20} style={{ marginLeft: '5px' }} /></h3>
            <button onClick={toggleChat} className="close-chat-btn">
              <X size={20} />
            </button>
          </div>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <p>{msg.text}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input-area">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
            />
            <button onClick={handleSendMessage} className="send-chat-btn">
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
      <button onClick={toggleChat} className="chat-toggle-btn">
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
};

export default ChatBot;