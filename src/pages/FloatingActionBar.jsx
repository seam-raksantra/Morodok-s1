import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, Bot, X, Send } from "lucide-react";
// 1. Import useLocation to read the current URL page path route
import { useLocation } from "react-router-dom"; 
import "../styles/floatingaction/FloatingActionBar.css"; 

export default function FloatingActionBar() {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hello! 👋 I'm your HiddenTravel Assistant. How can I help you plan your journey today?" }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // 2. Initialize location tracking hook
  const location = useLocation();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // 3. ADMIN BLOCK CHECK: If current path matches the admin view, render nothing!
  if (location.pathname === "/admin") {
    return null;
  }

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInputMessage("");
    setIsTyping(true);

    try {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev, 
          { sender: "ai", text: `Thanks for checking in! I received your inquiry about "${userText}". Our booking system and live agents are standing by to process your selection.` }
        ]);
        setIsTyping(false);
      }, 1200);

    } catch (error) {
      console.error("AI Interface processing failure:", error);
      setIsTyping(false);
    }
  };

  return (
    <div className="floating-container">
      
      {/* 1. THE SLIDING AI CHATWINDOW MODULE CONTAINER */}
      {isAiOpen && (
        <div className="ai-chat-window">
          
          {/* Header Bar */}
          <div className="chat-header">
            <div className="header-info-block">
              <div className="header-icon-badge">
                <Bot size={20} style={{ color: "#a7f3d0" }} />
              </div>
              <div className="header-text">
                <h3>HiddenTravel AI</h3>
                <p>Online & Ready to help</p>
              </div>
            </div>
            <button onClick={() => setIsAiOpen(false)} className="close-header-btn">
              <X size={18} />
            </button>
          </div>

          {/* Messages Stream Render Frame */}
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`msg-row ${msg.sender === "user" ? "user" : "ai"}`}>
                <div className="msg-bubble">
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Dynamic Typing Indicator bubble */}
            {isTyping && (
              <div className="msg-row ai">
                <div className="msg-bubble" style={{ backgroundColor: "#ffffff" }}>
                  <div className="typing-dots">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Form Controls Footer Action area */}
          <form onSubmit={handleSendMessage} className="chat-footer">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about trips, tours, payments..."
              className="chat-input"
            />
            <button type="submit" className="send-btn">
              <Send size={16} />
            </button>
          </form>

        </div>
      )}

      {/* 2. THE FLOATING INTERACTIVE DESKTOP ACTION BUTTONS BUTTONS */}
      {/* AI Toggle Activation Button */}
      <button
        onClick={() => setIsAiOpen(!isAiOpen)}
        className={`floating-btn ${isAiOpen ? "ai-btn-active" : "ai-btn-gradient"}`}
        title="Chat with Travel AI"
      >
        {isAiOpen ? <X size={24} /> : <Bot size={24} />}
      </button>

      {/* Outbound Direct Telegram Account Router Anchor Link */}
      <a
        href="https://t.me/san2shine" 
        target="_blank"
        rel="noopener noreferrer"
        className="floating-btn telegram-btn"
        title="Talk to Live Support on Telegram"
      >
        <MessageCircle size={24} />
      </a>

    </div>
  );
}