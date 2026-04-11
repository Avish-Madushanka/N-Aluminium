import React, { useState, useEffect, useRef } from 'react';
import './FloatingChatBot.css';

const OPENROUTER_API_KEY = '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';

const FREE_MODEL = 'meta-llama/llama-3.3-8b-instruct:free';

const BOT_NAME    = 'ALUX AI';
const BOT_SUBTITLE = 'Aluminum Recycling Assistant';

const SYSTEM_PROMPT = `You are ALUX AI, the intelligent assistant for an aluminum recycling and reuse platform.
Your job is to help users understand and use all services available on the website. You should behave like a professional digital assistant similar to ChatGPT.
The platform focuses on aluminum sustainability, recycling, and reuse.

The website includes the following main sections:

• Aluminum Scrap Collection – Users can schedule pickups for aluminum waste such as cans, frames, sheets, and industrial scrap.
• Aluminum Recycling Information – Explain recycling processes, environmental benefits, energy savings, and sustainability practices.
• Aluminum Training Programs – Provide information about training courses related to aluminum recycling, processing techniques, and sustainable material management.
• Project Upload Platform – Users can upload aluminum-related projects, research ideas, innovations, or case studies.
• Reuse Marketplace – A marketplace where users can buy or sell reusable aluminum products such as windows, doors, furniture components, and scrap materials.
• Item Marketplace – Users can list aluminum products for sale and browse items uploaded by other sellers.
• User Account Assistance – Help users with registration, login, profile management, scheduling pickups, uploading projects, and posting marketplace items.

Assistant behavior rules:
1. Respond naturally like an intelligent AI assistant.
2. Do not rely on predefined answers — generate helpful explanations based on the user's question.
3. Encourage aluminum recycling, reuse, and sustainable practices in your answers.
4. Guide users to relevant website sections when needed.
5. Keep responses clear, friendly, and easy to understand.
6. If a question is unrelated to the platform, politely redirect the conversation toward aluminum recycling or website services.
7. Support users in both learning about aluminum sustainability and using platform features.
8. Use short paragraphs and line breaks when explaining multiple points for readability.

Your goal is to act as the official AI guide for the platform and help users explore the website effectively.`;

const QUICK_TOPICS = [
  { icon: '🗓️', label: 'Schedule a Pickup',    prompt: 'How do I schedule an aluminum scrap pickup?' },
  { icon: '🛒', label: 'Marketplace',           prompt: 'What can I buy or sell on the ALUX marketplace?' },
  { icon: '🎓', label: 'Training Programs',     prompt: 'Tell me about the aluminum training programs available.' },
  { icon: '♻️', label: 'Why Recycle Aluminum?', prompt: 'Why is recycling aluminum important for the environment?' },
  { icon: '📤', label: 'Upload a Project',      prompt: 'How do I upload an aluminum project or research idea?' },
  { icon: '👤', label: 'Account Help',          prompt: 'How do I register and manage my ALUX account?' },
];


const TypingDots = () => (
  <div className="typing-dots"><span /><span /><span /></div>
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

const TrendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);


const FloatingChatbot = () => {
  const [isOpen,      setIsOpen]      = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages,    setMessages]    = useState([]);
  const [inputValue,  setInputValue]  = useState('');
  const [isTyping,    setIsTyping]    = useState(false);
  const [showHome,    setShowHome]    = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  /* auto-scroll to latest message */
  useEffect(() => {
    if (!showHome && messagesEndRef.current)
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, showHome]);

  /* focus input when chat view opens */
  useEffect(() => {
    if (isOpen && !isMinimized && !showHome)
      setTimeout(() => inputRef.current?.focus(), 80);
  }, [isOpen, isMinimized, showHome]);

  /* ── Call OpenRouter API (FREE) ── */
  const callAI = async (history) => {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer':  window.location.origin,
        'X-Title':       'ALUX AI Assistant',
      },
      body: JSON.stringify({
        model:      FREE_MODEL,
        max_tokens: 1000,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...history,
        ],
      }),
    });

    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      throw new Error(e?.error?.message || `API Error ${res.status}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim()
      || "I'm sorry, I couldn't generate a response. Please try again.";
  };

  /* ── Send a message ── */
  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    setShowHome(false);
    setInputValue('');

    const history = [
      ...messages.map(m => ({
        role:    m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      })),
      { role: 'user', content: trimmed },
    ];

    setMessages(prev => [...prev, { text: trimmed, sender: 'user' }]);
    setIsTyping(true);

    try {
      const reply = await callAI(history);
      setMessages(prev => [...prev, { text: reply, sender: 'bot' }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        text: `Connection error: ${err.message}. Please try again.`,
        sender: 'bot',
        isError: true,
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend    = ()  => sendMessage(inputValue);
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setMessages([]);
    setShowHome(true);
    setInputValue('');
  };

  const handleNewChat = () => {
    setMessages([]);
    setShowHome(true);
    setInputValue('');
  };

  /* ── Launcher button ── */
  if (!isOpen) {
    return (
      <button className="ALUX-launcher" onClick={handleOpen} aria-label="Open ALUX AI">
        <TrendIcon />
        <span>ALUX AI</span>
      </button>
    );
  }

  /* ── Chat window ── */
  return (
    <div className={`ALUX-chat ${isMinimized ? 'ALUX-minimized' : 'ALUX-expanded'}`}>

      {/* Header */}
      <div className="ALUX-header">
        <div className="ALUX-header-left">
          <div className="ALUX-avatar"><TrendIcon /></div>
          <div className="ALUX-header-info">
            <span className="ALUX-name">{BOT_NAME}</span>
            <span className="ALUX-status"><span className="ALUX-dot" />Online</span>
          </div>
        </div>
        <div className="ALUX-header-actions">
          {!isMinimized && messages.length > 0 && (
            <button className="ALUX-ctrl" onClick={handleNewChat} title="New chat">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          )}
          <button className="ALUX-ctrl" onClick={() => setIsMinimized(m => !m)} title={isMinimized ? 'Expand' : 'Minimize'}>
            {isMinimized
              ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
              : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14" /></svg>
            }
          </button>
          <button className="ALUX-ctrl ALUX-close" onClick={() => setIsOpen(false)} title="Close">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Body */}
      {!isMinimized && (
        <div className="ALUX-body">

          {/* ── Home screen ── */}
          {showHome ? (
            <div className="ALUX-home">
              <div className="ALUX-home-hero">
                <div className="ALUX-hero-icon">♻️</div>
                <p className="ALUX-hero-title">Hi, I'm {BOT_NAME}</p>
                <p className="ALUX-hero-sub">{BOT_SUBTITLE} — ask me anything about the platform or aluminum sustainability.</p>
              </div>

              <p className="ALUX-section-label">Quick topics</p>
              <div className="ALUX-topics">
                {QUICK_TOPICS.map((t, i) => (
                  <button key={i} className="ALUX-topic-btn" onClick={() => sendMessage(t.prompt)}>
                    <span className="topic-icon">{t.icon}</span>
                    <span className="topic-label">{t.label}</span>
                    <svg className="topic-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>

              <div className="ALUX-divider"><span>or ask your own question</span></div>

              <div className="ALUX-input-bar">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message…"
                />
                <button className="ALUX-send" onClick={handleSend} disabled={!inputValue.trim()}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
                  </svg>
                </button>
              </div>
            </div>

          ) : (

            /* ── Chat messages screen ── */
            <>
              <div className="ALUX-messages">
                {messages.map((msg, i) => (
                  <div key={i} className={`ALUX-row ${msg.sender}`}>
                    {msg.sender === 'bot' && (
                      <div className="ALUX-msg-avatar"><TrendIcon /></div>
                    )}
                    <div className={`ALUX-bubble${msg.isError ? ' ALUX-error' : ''}`}>
                      {msg.sender === 'bot'
                        ? <FormattedText text={msg.text} />
                        : msg.text
                      }
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="ALUX-row bot">
                    <div className="ALUX-msg-avatar"><TrendIcon /></div>
                    <div className="ALUX-bubble"><TypingDots /></div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="ALUX-input-bar">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask ALUX AI anything…"
                  disabled={isTyping}
                />
                <button className="ALUX-send" onClick={handleSend} disabled={isTyping || !inputValue.trim()}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
                  </svg>
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