"use client";

import { useState, useEffect, useRef } from "react";
import {
  XMarkIcon,
  PaperAirplaneIcon,
  BookmarkIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  role: "user" | "assistant"; // Added role property for API compatibility
}

interface SavedChat {
  messages: Message[];
  savedAt: Date;
}

const CHAT_STORAGE_KEY = "vicarage_chat_history";
const CHAT_EXPIRY_DAYS = 7; // Chats expire after 7 days
const API_ENDPOINT = "http://192.168.100.3:1234/v1/chat/completions"; // The API endpoint from the second example

const ChatWindow = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! How can I assist you today?",
      isUser: false,
      timestamp: new Date(),
      role: "assistant",
    },
  ]);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load saved chat on component mount
  useEffect(() => {
    loadSavedChat();
    setMounted(true);
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const loadSavedChat = () => {
    try {
      const savedChats = JSON.parse(
        localStorage.getItem(CHAT_STORAGE_KEY) || "[]"
      );
      if (savedChats.length > 0) {
        // Get the most recent chat that hasn't expired
        const now = new Date();
        const validChats = savedChats.filter((chat: SavedChat) => {
          const chatDate = new Date(chat.savedAt);
          const diffDays =
            (now.getTime() - chatDate.getTime()) / (1000 * 3600 * 24);
          return diffDays <= CHAT_EXPIRY_DAYS;
        });

        if (validChats.length > 0) {
          const latestChat = validChats[validChats.length - 1];
          setMessages(
            latestChat.messages.map((msg: Message) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            }))
          );
        }

        // Clean up expired chats
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(validChats));
      }
    } catch (error) {
      console.error("Error loading saved chat:", error);
    }
  };

  const saveChat = () => {
    try {
      const savedChats = JSON.parse(
        localStorage.getItem(CHAT_STORAGE_KEY) || "[]"
      );
      const newSavedChat: SavedChat = {
        messages,
        savedAt: new Date(),
      };

      savedChats.push(newSavedChat);

      // Keep only chats from the last CHAT_EXPIRY_DAYS days
      const now = new Date();
      const validChats = savedChats.filter((chat: SavedChat) => {
        const chatDate = new Date(chat.savedAt);
        const diffDays =
          (now.getTime() - chatDate.getTime()) / (1000 * 3600 * 24);
        return diffDays <= CHAT_EXPIRY_DAYS;
      });

      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(validChats));

      // Show save confirmation (you could add a toast notification here)
      alert("Chat saved! Will be available for 7 days.");
    } catch (error) {
      console.error("Error saving chat:", error);
      alert("Failed to save chat.");
    }
  };

  const clearSavedChats = () => {
    if (window.confirm("Are you sure you want to clear all saved chats?")) {
      localStorage.removeItem(CHAT_STORAGE_KEY);
      setMessages([
        {
          id: 1,
          text: "Hello! How can I assist you today?",
          isUser: false,
          timestamp: new Date(),
          role: "assistant",
        },
      ]);
    }
  };

  // Format message for API request
  const formatMessagesForAPI = (msgs: Message[]) => {
    return msgs.map((msg) => ({
      role: msg.role,
      content: msg.text,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: message,
      isUser: true,
      timestamp: new Date(),
      role: "user",
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setMessage("");
    setIsLoading(true);

    try {
      // Call the LLaMA API
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama-3.2-1b-instruct",
          messages: formatMessagesForAPI(updatedMessages),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      // Add AI response
      const aiMessage: Message = {
        id: updatedMessages.length + 1,
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
        role: "assistant",
      };

      setMessages([...updatedMessages, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
      // Add error message
      const errorMessage: Message = {
        id: updatedMessages.length + 1,
        text: "Sorry, I encountered an error while processing your request.",
        isUser: false,
        timestamp: new Date(),
        role: "assistant",
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Format message text with markdown-like features
  const formatMessageText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
      .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italics
      .replace(/\n/g, "<br />") // Line breaks
      .replace(/\+ (.*?)<br \/>/g, "✅ $1<br />") // Bullet points with checkmarks
      .replace(/- (.*?)<br \/>/g, "🔹 $1<br />"); // Alternative bullet style
  };

  return (
    <div className="fixed bottom-0 right-0 z-50 md:bottom-4 md:right-4">
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          ${isOpen ? "hidden" : "flex"}
          items-center justify-center
          w-12 h-12 md:w-14 md:h-14 rounded-full
          bg-[#654222] text-white
          shadow-lg hover:bg-[#654222]/90
          transition-all duration-300
          transform hover:scale-105
          fixed bottom-6 right-4 z-50
        `}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 md:w-6 md:h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
          />
        </svg>
      </button>

      {/* Chat Window */}
      <div
        className={`
          fixed ${isMobile ? "bottom-20 right-4 left-4" : "bottom-4 right-4"}
          transition-all duration-300 ease-in-out transform
          ${
            isOpen
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-4 scale-95 pointer-events-none"
          }
        `}
      >
        <div
          className={`
            flex flex-col
            ${isMobile ? "h-[80vh] w-full" : "w-96 h-[600px]"}
            rounded-2xl
            bg-gradient-to-r from-[#211313] to-[#211313] shadow-2xl
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#211313] md:rounded-t-2xl">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <h3 className="text-white font-medium">Vicarage AI Assistant</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={saveChat}
                className="text-white hover:bg-white/10 rounded-lg p-1.5 transition-colors duration-200"
                title="Save chat (available for 7 days)"
              >
                <BookmarkIcon className="w-5 h-5" />
              </button>
              <button
                onClick={clearSavedChats}
                className="text-white hover:bg-white/10 rounded-lg p-1.5 transition-colors duration-200"
                title="Clear saved chats"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/10 rounded-lg p-1.5 transition-colors duration-200"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`
                    max-w-[80%] rounded-2xl px-4 py-2
                    ${
                      msg.isUser
                        ? "bg-white/10 text-white rounded-br-none"
                        : "bg-white/5 text-white rounded-bl-none"
                    }
                  `}
                >
                  <div
                    className="text-sm"
                    dangerouslySetInnerHTML={{
                      __html: formatMessageText(msg.text),
                    }}
                  />
                  <span className="text-xs opacity-75 mt-1 block">
                    {mounted
                      ? msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl px-4 py-2 bg-white/5 text-white rounded-bl-none">
                  <p className="text-sm">⏳ Loading...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="p-4 border-t border-white/10"
          >
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                disabled={isLoading}
              />
              <button
                type="submit"
                className={`bg-white/10 text-white p-2 rounded-xl hover:bg-white/20 transition-colors duration-200 ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
                disabled={isLoading}
              >
                <PaperAirplaneIcon className="w-6 h-6" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
