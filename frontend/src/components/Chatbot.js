import React, { useContext, useState, useRef, useEffect } from "react";
import { ChatContext } from "../context/ChatContext";
import { useNavigate, useLocation } from "react-router-dom";
import "./Chatbot.css"; // ✅ for styles & animation

const Chatbot = () => {
  const { messages, input, setInput, handleSend, handleKeyDown, startVoiceInput, isBotTyping } =
    useContext(ChatContext);

  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 🔄 Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🚫 Hide chatbot on full chat page
  if (location.pathname === "/chat") return null;

  return (
    <>
      {/* Floating Bubble (only when closed) */}
      {!isOpen && (
        <div className="chat-bubble" onClick={() => setIsOpen(true)}>
          💬
        </div>
      )}

      {/* Sidebar Chatbox */}
      <div className={`chatbox-container ${isOpen ? "open" : ""}`}>
        <div className="chatbox-header">
          <span>🌱 AgriBot</span>
          <div>
            <button onClick={() => navigate("/chat")} className="expand-btn">⛶</button>
            <button onClick={() => setIsOpen(false)} className="close-btn">✖</button>
          </div>
        </div>

        <div className="chatbox-messages">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-message ${msg.from === "user" ? "user" : "bot"}`}
            >
              {msg.text}
            </div>
          ))}
          {isBotTyping && <p>🤖 typing...</p>}
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbox-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
          />
          <button onClick={startVoiceInput}>🎙</button>
          <button onClick={handleSend} disabled={isBotTyping}>➤</button>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
