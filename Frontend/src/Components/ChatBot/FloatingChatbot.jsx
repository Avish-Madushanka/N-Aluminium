import React, { useState, useEffect } from 'react';
import './FloatingChatBot.css';

const DEFAULT_BOT_NAME = "Support Pro";
const LAUNCHER_TEXT = "Chat";
const CHAT_WIDTH = 320;
const CHAT_HEADER_HEIGHT = 60;
const CHAT_FULL_HEIGHT = 450;
const LAUNCHER_DIAMETER = 60;
const CHAT_DEFAULT_OFFSET = 20;

const CHATBOT_CONFIG_API_URL = '/api/chatbot-config';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [botConfig, setBotConfig] = useState({
    botName: DEFAULT_BOT_NAME,
    qaPairs: { default: "I'm still loading my responses..." },
    exampleQuestions: []
  });
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [configError, setConfigError] = useState(null);
  const [showInitialQuestionsView, setShowInitialQuestionsView] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      setIsLoadingConfig(true);
      setConfigError(null);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const data = {
          botName: "ALUX-Bot",
          qaPairs: {
            "features": "We offer amazing features like real-time collaboration and advanced analytics.",
            "pricing": "Our pricing starts at $10/month. Visit our pricing page for more!",
            "support": "You can contact support via email at support@example.com.",
            "hello": "Hello there! How can I help you today?",
            "default": "I'm not sure about that. Can you try asking differently or pick a topic?"
          },
          exampleQuestions: [
            "What are your features?",
            "Tell me about pricing.",
            "How can I contact support?",
          ]
        };

        const processedQaPairs = {};
        for (const key in data.qaPairs) {
          processedQaPairs[key] = data.qaPairs[key].replace('{BOT_NAME}', data.botName || DEFAULT_BOT_NAME);
        }
        setBotConfig({
          botName: data.botName || DEFAULT_BOT_NAME,
          qaPairs: processedQaPairs,
          exampleQuestions: data.exampleQuestions || []
        });
        setShowInitialQuestionsView(data.exampleQuestions && data.exampleQuestions.length > 0);
      } catch (error) {
        console.error("Error fetching chatbot config:", error);
        setConfigError(error.message);
        setBotConfig(prev => ({ ...prev, qaPairs: { default: "Sorry, I'm having trouble loading my responses." }}));
        setShowInitialQuestionsView(false);
      } finally {
        setIsLoadingConfig(false);
      }
    };
    
    if (isOpen) {
      fetchConfig();
    } else {
      setIsLoadingConfig(true);
    }
  }, [isOpen]);

  const getBotResponse = (userInput) => {
    if (isLoadingConfig) return "Just a moment, loading...";
    if (configError) return botConfig.qaPairs.default;

    const lowerInput = userInput.toLowerCase();
    let responseText = botConfig.qaPairs.default;
    const sortedQaKeys = Object.keys(botConfig.qaPairs).sort((a, b) => b.length - a.length);
    for (const key of sortedQaKeys) {
      if (lowerInput.includes(key.toLowerCase())) {
        responseText = botConfig.qaPairs[key];
        break;
      }
    }
    return responseText;
  };

  const addDelayedBotMessage = (text) => {
    setTimeout(() => {
      setMessages(prevMessages => [...prevMessages, { text, sender: 'bot' }]);
    }, 600);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    const userMessage = { text: inputValue, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    const botResponseText = getBotResponse(inputValue);
    addDelayedBotMessage(botResponseText);
    setInputValue('');
  };

  const handleQuestionClick = (questionText) => {
    setShowInitialQuestionsView(false);
    const userMessage = { text: questionText, sender: 'user' };
    const botResponseText = getBotResponse(questionText);
    const botMessage = { text: botResponseText, sender: 'bot' };
    setMessages([userMessage, botMessage]);
  };

  const handleBackToQuestions = () => {
    setShowInitialQuestionsView(true);
    setMessages([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  const toggleOpen = () => {
    const willOpen = !isOpen;
    setIsOpen(willOpen);
    if (willOpen) {
      setIsMinimized(false);
      setMessages([]);
      setInputValue('');
    } else {
      setShowInitialQuestionsView(false);
      setIsLoadingConfig(true);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  useEffect(() => {
    if (!showInitialQuestionsView) {
      const messagesContainer = document.querySelector('.chat-messages');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
  }, [messages, showInitialQuestionsView]);

  if (!isOpen) {
    return (
      <button
        className="chat-launcher"
        onClick={toggleOpen}
        title={`Open ${botConfig.botName}`}
      >
        {LAUNCHER_TEXT}
      </button>
    );
  }

  return (
    <div className={`floating-chat ${isMinimized ? 'minimized' : 'expanded'}`}>
      <div className="chat-header">
        <h3>{botConfig.botName}</h3>
        <div className="chat-controls">
          {!isMinimized && !showInitialQuestionsView && botConfig.exampleQuestions.length > 0 && (
            <button 
              onClick={handleBackToQuestions} 
              title="Back to Questions"
              className="back-to-questions"
            >
              ←
            </button>
          )}
          <button onClick={toggleMinimize} title={isMinimized ? "Expand" : "Minimize"}>
            {isMinimized ? '❐' : '−'}
          </button>
          <button onClick={toggleOpen} title="Close Chat">×</button>
        </div>
      </div>
      
      {!isMinimized && (
        <div className="chat-content">
          {isLoadingConfig ? (
            <div className="initial-message"><p>Loading chatbot...</p></div>
          ) : configError ? (
            <div className="initial-message error"><p>Error: {configError}. Please try again later.</p></div>
          ) : showInitialQuestionsView && botConfig.exampleQuestions.length > 0 ? (
            <div className="questions-container">
              <p className="welcome-message">Hi! I'm {botConfig.botName}. Please select a question to start:</p>
              <ul className="questions-list">
                {botConfig.exampleQuestions.map((q, index) => (
                  <li key={index} onClick={() => handleQuestionClick(q)}>{q}</li>
                ))}
              </ul>
            </div>
          ) : (
            <>
              <div className="chat-messages">
                {messages.length === 0 && (
                  <div className="welcome-message">
                    <p>Hi! I'm {botConfig.botName}. How can I assist you?</p>
                  </div>
                )}
                {messages.map((msg, index) => (
                  <div key={index} className={`message ${msg.sender}`}>{msg.text}</div>
                ))}
              </div>
              <div className="chat-input-container">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoadingConfig || !!configError}
                />
                <button 
                  className="send-button"
                  onClick={handleSendMessage} 
                  disabled={isLoadingConfig || !!configError}
                >
                  Send
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