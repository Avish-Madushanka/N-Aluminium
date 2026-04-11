// FloatingChatBot.jsx - FULLY OFFLINE VERSION (No API Required)
import React, { useState, useEffect, useRef } from 'react';
import './FloatingChatBot.css';

const BOT_NAME = 'ALUX AI';
const BOT_SUBTITLE = 'Aluminum Recycling Assistant';

const QUICK_TOPICS = [
  { icon: '🗓️', label: 'Schedule a Pickup', prompt: 'How do I schedule an aluminum scrap pickup?' },
  { icon: '🛒', label: 'Marketplace', prompt: 'What can I buy or sell on the ALUX marketplace?' },
  { icon: '🎓', label: 'Training Programs', prompt: 'Tell me about the aluminum training programs available.' },
  { icon: '♻️', label: 'Why Recycle Aluminum?', prompt: 'Why is recycling aluminum important for the environment?' },
  { icon: '📤', label: 'Upload a Project', prompt: 'How do I upload an aluminum project or research idea?' },
  { icon: '👤', label: 'Account Help', prompt: 'How do I register and manage my ALUX account?' },
];

const getAIResponse = (userMessage, conversationHistory) => {
  const msg = userMessage.toLowerCase();
  
  if (msg.includes('schedule') || msg.includes('pickup') || msg.includes('collect')) {
    return `**📅 Scheduling an Aluminum Scrap Pickup**

Here's how to schedule a pickup on ALUX:

**Step 1:** Log into your ALUX account
**Step 2:** Navigate to "Aluminum Scrap Collection" section
**Step 3:** Click "Schedule New Pickup"
**Step 4:** Select your pickup location on the map
**Step 5:** Choose date and time (available slots shown)
**Step 6:** Describe your scrap (type, estimated weight, condition)
**Step 7:** Confirm and submit

✅ You'll receive SMS/email confirmation within minutes
💰 Pricing depends on quantity and aluminum grade

Need help with anything specific about the pickup process?`;
  }
  
  if (msg.includes('marketplace') || (msg.includes('buy') && msg.includes('sell')) || msg.includes('item')) {
    return `**🛒 ALUX Marketplace Guide**

The platform has two marketplaces:

**1. Reuse Marketplace**
- Buy/sell reusable aluminum products
- Examples: windows, doors, frames, furniture components
- Items must be in reusable condition

**2. Item Marketplace**  
- List aluminum products for sale
- Browse items from other sellers
- Direct messaging with buyers/sellers

**To get started:**
1. Complete your profile verification
2. Click "List an Item" in your preferred marketplace
3. Add photos, description, price
4. Set pickup/delivery options
5. Publish your listing

**Pro tip:** Include clear photos and detailed condition notes for faster sales!

Would you like help with listing an item?`;
  }
  
  if (msg.includes('training') || msg.includes('course') || msg.includes('program') || msg.includes('learn')) {
    return `**🎓 ALUX Training Programs**

We offer specialized training for all skill levels:

**♻️ Basic Aluminum Recycling** (2 days)
- Fundamentals of aluminum recycling
- Sorting and identification
- Environmental impact awareness

**🔧 Advanced Processing** (5 days)  
- Industrial recycling techniques
- Quality control standards
- Equipment operation

**📊 Sustainable Management** (3 days)
- Business applications
- Supply chain optimization
- Circular economy principles

**💡 Innovation Lab** (ongoing)
- Research opportunities
- New reuse applications
- Industry networking

**Upcoming sessions:** Check the Training Calendar
**Pricing:** $49 - $299 depending on program
**Certification:** Earn ALUX Certified Recycler badge

Which program interests you most?`;
  }
  
  if (msg.includes('environment') || msg.includes('important') || msg.includes('benefit') || msg.includes('why recycle')) {
    return `**🌍 Why Aluminum Recycling Matters**

**Environmental Impact:**
⚡ **95% less energy** than primary production
💨 **92% less CO2 emissions**  
🏭 **97% less water pollution**
⛏️ **Preserves bauxite ore** for future generations

**Economic Benefits:**
💰 Creates local recycling jobs
📈 Stable secondary material market
🏭 Reduces manufacturing costs

**Fun Facts:**
♾️ Aluminum can be recycled infinitely with no quality loss
🥤 A recycled can becomes a new can in just 60 days
🚗 90% of automotive aluminum is recycled

**At ALUX, we've recycled over 50,000 tons of aluminum - saving enough energy to power 15,000 homes for a year!**

Want to learn about our specific recycling process?`;
  }
  
  if (msg.includes('upload') || msg.includes('project') || msg.includes('submit') || msg.includes('share')) {
    return `**📤 Upload Your Project to ALUX**

Share your aluminum innovation with our community!

**Guidelines:**
1. Project must relate to aluminum recycling/reuse
2. Original work or properly credited
3. Clear description and purpose
4. Supporting images/documents (max 10MB)

**Upload process:**
1. Go to "Project Upload Platform"
2. Click "New Project Submission"
3. Fill in title, category, description
4. Upload files (PDF, images, videos)
5. Add tags for discoverability
6. Submit for review

**Review time:** 24-48 hours
**Visibility:** Community + industry partners
**Recognition:** Featured projects get ALUX Innovation Badge

**Project categories:**
- Research & Studies
- Product Designs  
- Process Improvements
- Case Studies
- Educational Materials

Ready to share your work with the world?`;
  }
  
  if (msg.includes('account') || msg.includes('register') || msg.includes('login') || msg.includes('sign') || msg.includes('profile')) {
    return `**👤 ALUX Account Management**

**New User Registration:**
1. Click "Sign Up" on homepage
2. Enter email and create password
3. Verify email (check spam folder!)
4. Complete profile (name, location, phone)
5. Choose notification preferences

**Login Help:**
- Forgot password? Use "Reset Password" link
- Account locked? Contact support after 5 attempts
- Need 2FA? Available in Security Settings

**Profile Management:**
📝 Edit personal info
🔔 Manage notifications
📍 Update pickup addresses
💳 Add payment methods
📜 View transaction history

**Account Types:**
🏠 **Residential** - Home recycling
🏭 **Business** - Commercial accounts
🎓 **Educational** - Schools/universities
🔧 **Industrial** - Large volume pickups

What specific account help do you need?`;
  }
  
  if (msg.includes('price') || msg.includes('cost') || msg.includes('rate')) {
    return `**💰 Aluminum Pricing Information**

Current market rates (updated weekly):

**Scrap Aluminum:**
- Clean cans: $0.45 - $0.65/lb
- Sheet aluminum: $0.35 - $0.55/lb  
- Cast aluminum: $0.30 - $0.50/lb
- Extruded: $0.50 - $0.70/lb

**Reusable Items (Marketplace):**
- Window frames: $20 - $150
- Doors: $50 - $300
- Furniture: $25 - $500
- Industrial scrap: Negotiable

**Pickup fees:**
- Free for 50+ lbs
- Small quantity: $5-$15 fee
- Business accounts: Volume discounts

💡 **Pro tip:** Separate clean aluminum from mixed metals for best prices!

Want a specific price quote? Tell me what you have!`;
  }
  
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('greeting')) {
    return `**👋 Hello! Welcome to ALUX AI!**

I'm your aluminum recycling assistant. I can help you with:

♻️ **Schedule pickups** for scrap aluminum
🛒 **Navigate marketplaces** to buy/sell
🎓 **Find training programs** for all skill levels
📤 **Upload projects** to share innovations
👤 **Manage your account** and preferences
💡 **Learn about** aluminum sustainability

What would you like to explore today? Just type your question or click any topic above!`;
  }
  
  return `**♻️ How can I help with aluminum recycling?**

I'm ALUX AI, your dedicated assistant for the ALUX platform. I can assist with:

• **Schedule Pickups** - Arrange aluminum scrap collection
• **Marketplace** - Buy/sell aluminum products
• **Training** - Find recycling courses
• **Projects** - Upload innovations
• **Account** - Manage your profile
• **Info** - Learn about recycling benefits

Could you please rephrase your question or select one of the quick topics above? I'm here to help with anything aluminum recycling related!

**Example questions:**
- "How do I schedule a pickup?"
- "Tell me about training programs"
- "What can I sell on marketplace?"
- "Why recycle aluminum?"`;
};

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
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showHome, setShowHome] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!showHome && messagesEndRef.current)
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, showHome]);

  useEffect(() => {
    if (isOpen && !isMinimized && !showHome)
      setTimeout(() => inputRef.current?.focus(), 80);
  }, [isOpen, isMinimized, showHome]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    setShowHome(false);
    setInputValue('');
    
    const userMessage = { text: trimmed, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const reply = getAIResponse(trimmed, messages);
      setMessages(prev => [...prev, { text: reply, sender: 'bot' }]);
      setIsTyping(false);
    }, 500 + Math.random() * 400);
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
  };

  const handleNewChat = () => {
    setMessages([]);
    setShowHome(true);
    setInputValue('');
  };

  if (!isOpen) {
    return (
      <button className="ALUX-launcher" onClick={handleOpen} aria-label="Open ALUX AI">
        <TrendIcon />
        <span>ALUX AI</span>
      </button>
    );
  }

  return (
    <div className={`ALUX-chat ${isMinimized ? 'ALUX-minimized' : 'ALUX-expanded'}`}>
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

      {!isMinimized && (
        <div className="ALUX-body">
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
            <>
              <div className="ALUX-messages">
                {messages.map((msg, i) => (
                  <div key={i} className={`ALUX-row ${msg.sender}`}>
                    {msg.sender === 'bot' && (
                      <div className="ALUX-msg-avatar"><TrendIcon /></div>
                    )}
                    <div className="ALUX-bubble">
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