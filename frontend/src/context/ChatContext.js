import React, { createContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

// 1️⃣ Create context
export const ChatContext = createContext();

// 2️⃣ Provider Component
export const ChatProvider = ({ children }) => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const [messages, setMessages] = useState([
    { from: "bot", text: t("chatbot_first_msg") }
  ]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [input, setInput] = useState("");
  const [lang, setLang] = useState("en-IN"); // default speech input language

  // 🔄 Sync mic language with site language
  useEffect(() => {
    if (i18n.language === "hi") setLang("hi-IN");
    else setLang("en-IN");
  }, [i18n.language]);

  // --- 🌐 Send message to backend ---
  const handleSend = async () => {
    if (!input.trim() || isBotTyping) return;

    const newMessages = [...messages, { from: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    setIsBotTyping(true);
    try {
      const res = await fetch("https://krushiraah.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      setMessages([...newMessages, { from: "bot", text: data.reply }]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { from: "bot", text: "⚠️ Sorry, I couldn't connect to the server." }
      ]);
    }
    setIsBotTyping(false);
  };

  // --- ⌨️ Handle Enter Key ---
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  // --- 🎙 Voice to Text ---
  const startVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Sorry, your browser does not support voice recognition.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev + " " + transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        isBotTyping,
        setIsBotTyping,
        input,
        setInput,
        handleSend,
        handleKeyDown,
        startVoiceInput,
        lang,
        setLang,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
