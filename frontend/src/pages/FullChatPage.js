import React, { useContext, useRef, useEffect } from "react";
import { ChatContext } from "../context/ChatContext";
import { useTranslation } from "react-i18next";

const FullChatPage = () => {
  const { t } = useTranslation();
  const { messages, input, setInput, handleSend, handleKeyDown, startVoiceInput, isBotTyping } =
    useContext(ChatContext);

  const messagesEndRef = useRef(null);

  // 🔄 Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "20px auto",
        border: "1px solid #ccc",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        height: "80vh",
        background: "#fff",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "10px",
          background: "#4CAF50",
          color: "white",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
        }}
      >
        🌱 {t("chatbot_title")}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, padding: "10px", overflowY: "auto", background: "#f9f9f9" }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{ margin: "5px 0", textAlign: msg.from === "user" ? "right" : "left" }}
          >
            <span
              style={{
                background: msg.from === "user" ? "#DCF8C6" : "#EEE",
                padding: "8px 12px",
                borderRadius: "10px",
                display: "inline-block",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
        {isBotTyping && <p>🤖 typing...</p>}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div
        style={{
          padding: "10px",
          display: "flex",
          borderTop: "1px solid #ccc",
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ flex: 1, padding: "8px" }}
          placeholder={t("type_your_msg")}
        />
        <button onClick={startVoiceInput} style={{ marginLeft: "5px" }}>
          🎙
        </button>
        <button onClick={handleSend} disabled={isBotTyping} style={{ marginLeft: "5px" }}>
          ➤
        </button>
      </div>
    </div>
  );
};

export default FullChatPage;
