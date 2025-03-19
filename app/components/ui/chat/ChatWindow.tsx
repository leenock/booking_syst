'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatWindow = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! How can I assist you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setMessage('');

    // Simulate AI response (replace with actual AI integration later)
    setTimeout(() => {
      const aiMessage: Message = {
        id: messages.length + 2,
        text: "I'm a placeholder response. AI integration coming soon!",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-0 right-0 z-50 md:bottom-4 md:right-4">
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          ${isOpen ? 'hidden' : 'flex'}
          items-center justify-center
          w-12 h-12 md:w-14 md:h-14 rounded-full
          bg-[#654222] text-white
          shadow-lg hover:bg-[#654222]/90
          transition-all duration-300
          transform hover:scale-105
          fixed bottom-4 right-4 md:static
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
          fixed ${isMobile ? 'inset-0' : 'bottom-4 right-4'}
          transition-all duration-300 ease-in-out transform
          ${isOpen 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
          }
        `}
      >
        <div 
          className={`
            flex flex-col
            ${isMobile 
              ? 'h-screen w-screen' 
              : 'w-96 h-[600px] rounded-2xl'
            }
            bg-gradient-to-r from-[#211313] to-[#211313] shadow-2xl
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#211313] md:rounded-t-2xl">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <h3 className="text-white font-medium">Vicarage AI Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/10 rounded-lg p-1 transition-colors duration-200"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    max-w-[80%] rounded-2xl px-4 py-2
                    ${msg.isUser 
                      ? 'bg-white/10 text-white rounded-br-none' 
                      : 'bg-white/5 text-white rounded-bl-none'
                    }
                  `}
                >
                  <p className="text-sm">{msg.text}</p>
                  <span className="text-xs opacity-75 mt-1 block">
                    {msg.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
              <button
                type="submit"
                className="bg-white/10 text-white p-2 rounded-xl hover:bg-white/20 transition-colors duration-200"
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