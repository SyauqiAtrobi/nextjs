// components/ChatBot.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageSquare, FiX, FiSend, FiChevronUp } from "react-icons/fi";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    Array<{ text: string; isUser: boolean }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { text: message, isUser: true }]);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { text: data.response, isUser: false }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: "Maaf, terjadi kesalahan. Silakan coba lagi.", isUser: false },
      ]);
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2 group"
      >
        {isOpen ? (
          <FiX
            size={24}
            className="transition-transform group-hover:rotate-90"
          />
        ) : (
          <>
            <FiMessageSquare size={24} />
            <span className="text-sm hidden lg:inline">Chat with AI</span>
          </>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <div style={{ position: "absolute", right: "0", bottom: "0" }}>
            {/* Header */}
            <div
              className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-blue-500 text-white flex items-center justify-between rounded-t-xl"
              style={{
                position: "relative",
                zIndex: "50",
                bottom: "24.5rem",
                background: "#075E54",
              }}
            >
              <div className="flex items-center gap-2">
                <FiMessageSquare className="text-white" size={18} />
                <h2 className="font-semibold">Dzull AI Assistant</h2>
              </div>
              <FiX
                size={20}
                className="cursor-pointer hover:text-gray-200"
                onClick={() => setIsOpen(false)}
              />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute w-80 dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col"
              style={{
                height: "400px",
                width: "300px",
                overflowY: "auto",
                bottom: "3.5rem",
                background: "#ECE5DD",
              }}
            >
              {/* Chat Body */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50 dark:bg-gray-900">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      msg.isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-lg text-sm ${
                        msg.isUser
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-bl-none"
                      }`}
                    >
                      <p className="break-words">{msg.text}</p>
                      <div className="flex items-center justify-end mt-1">
                        <span className="text-xs opacity-70">
                          {new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-bl-none">
                      <div className="flex space-x-2 items-center">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </motion.div>
            {/* Input Area */}
            <form
              onSubmit={handleSubmit}
              className="border-t border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800"
              style={{ width: "18.7rem", background: "#075E54" }}
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message"
                  style={{ width: "90%", marginRight: "1rem" }}
                  className="flex-1 py-2 px-4 rounded-full border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-white text-sm"
                />
                <button
                  type="submit"
                  style={{
                    background: "#25D366",
                    width: "30px",
                    height: "30px",
                  }}
                  className="p-2 rounded-full text-white hover:bg-blue-700 transition-colors"
                >
                  <FiSend size={24} />
                </button>
              </div>
            </form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
