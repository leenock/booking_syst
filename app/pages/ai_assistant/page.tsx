"use client";

import Sidebar from '@/app/components/user_dash/Sidebar';
import { Send, ArrowRight, MessageSquare } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

// Define types for our chat messages and queries
interface Message {
  type: 'user' | 'bot';
  content: string;
}

interface Query {
  id: number;
  question: string;
  answer: string;
}

export default function UserNotifications() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { type: 'bot', content: 'Hello! I\'m your AI assistant. How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const commonQueries: Query[] = [
    { id: 1, question: "How do I reset my password?", 
      answer: "To reset your password, click on the 'Forgot Password' link on the login page. You'll receive an email with instructions to create a new password." },
    { id: 2, question: "What are your business hours?", 
      answer: "Our customer service team is available Monday through Sunday from 7 AM to 7 Am EST. On weekends, we are open 24 hours from Monday to Sunday." },
    { id: 3, question: "Generate my bookings?", 
      answer: "You can view and manage your bookings by logging into your account and visiting the 'My Bookings' section. There, you'll find all your reservation details including status, dates, and payment history." }
  ];

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: inputValue }]);
    setInputValue('');
    
    // Simulate bot typing
    setIsTyping(true);
    
    // Simulate bot response after delay
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: `Thank you for your question. Our team is working to provide you with the best answer regarding "${inputValue}".`
      }]);
    }, 1500);
  };

  const handleQueryClick = (query: Query) => {
    // Add the question as user message
    setMessages(prev => [...prev, { type: 'user', content: query.question }]);
    
    // Simulate bot typing
    setIsTyping(true);
    
    // Simulate bot response after delay
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { type: 'bot', content: query.answer }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onOpenChange={setIsSidebarOpen} />

      {/* Main Content */}
      <div className="md:pl-64 min-h-screen transition-all duration-200">
        {/* Page Header */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4 flex items-center justify-center md:justify-start gap-3">
              <MessageSquare className="w-6 h-6 text-gray-700" />
              <h1 className="text-xl font-semibold text-gray-900">
                AI Support Chat
              </h1>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="grid md:grid-cols-4">
              {/* Common Queries Sidebar */}
              <div className="md:col-span-1 bg-gray-50 p-4 border-r border-gray-100">
                <h2 className="font-medium text-gray-700 mb-4">Frequently Asked Questions</h2>
                <div className="space-y-3">
                  {commonQueries.map(query => (
                    <div 
                      key={query.id}
                      className="p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-gray-200 hover:shadow-md cursor-pointer transition-all"
                      onClick={() => handleQueryClick(query)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{query.question}</span>
                        <ArrowRight className="w-4 h-4 text-gray-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Area */}
              <div className="md:col-span-3 flex flex-col h-[600px]">
                {/* Messages Container */}
                <div className="flex-grow overflow-y-auto">
                  {messages.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`px-4 py-6 ${msg.type === 'user' ? 'bg-white' : 'bg-gray-50'} border-b border-gray-100`}
                    >
                      <div className="max-w-3xl mx-auto flex">
                        <div className="w-8 h-8 rounded-full mr-4 flex-shrink-0 flex items-center justify-center">
                          {msg.type === 'user' ? (
                            <div className="bg-gray-300 w-full h-full rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-800">You</span>
                            </div>
                          ) : (
                            <div className="bg-green-600 w-full h-full rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-white">AI</span>
                            </div>
                          )}
                        </div>
                        <div className="text-gray-800">
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="px-4 py-6 bg-gray-50 border-b border-gray-100">
                      <div className="max-w-3xl mx-auto flex">
                        <div className="w-8 h-8 rounded-full mr-4 flex-shrink-0 bg-green-600 flex items-center justify-center">
                          <span className="text-xs font-medium text-white">AI</span>
                        </div>
                        <div className="flex space-x-1 items-center">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Centered Input Area */}
                <div className="border-t border-gray-100 p-4">
                  <div className="max-w-2xl mx-auto">
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Message AI support..."
                        className="flex-grow bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      />
                      <button
                        type="submit"
                        disabled={!inputValue.trim()}
                        className={`${
                          inputValue.trim() ? 'bg-gray-700 hover:bg-gray-800' : 'bg-gray-300'
                        } text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors`}
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </form>
                    <div className="text-xs text-center mt-2 text-gray-500">
                      AI support may produce inaccurate information. Ask for clarification if needed.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}