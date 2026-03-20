import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send, User, Bot, Loader2 } from 'lucide-react';

const ChatComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! I am your AI waiter. What can I help you with from our menu today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await axios.post(`http://${window.location.hostname}:8000/ai/suggest`, {
        user_message: userMessage
      });
      
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response.data.reply }
      ]);
    } catch (error) {
      console.error('Error fetching AI suggestion:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Oops! I had trouble understanding that. Could you try asking again?' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white dark:bg-gray-800 w-80 sm:w-96 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 h-[32rem] sm:h-[36rem] transition-all transform ease-in-out duration-300 translate-y-0 opacity-100">
          
          {/* Header */}
          <div className="bg-red-600 p-4 text-white flex justify-between items-center shadow-md">
            <div className="flex items-center space-x-2">
              <Bot size={24} />
              <h3 className="font-bold text-lg">AI Waiter</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-red-100 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-2xl p-3 shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-red-600 text-white rounded-tr-none' 
                      : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-gray-600'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-700 rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center space-x-2 text-gray-500 border border-gray-100 dark:border-gray-600">
                  <Loader2 className="animate-spin" size={16} />
                  <span className="text-sm italic">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex flex-col">
            <form 
              onSubmit={handleSend} 
              className="p-3 flex items-center gap-2 pb-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask for a recommendation..."
                className="flex-1 bg-gray-100 dark:bg-gray-900 border-none rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 text-gray-900 dark:text-gray-100 outline-none w-full"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:dark:bg-gray-600 text-white p-2.5 rounded-full transition-colors flex flex-shrink-0 items-center justify-center focus:outline-none"
              >
                <Send size={18} />
              </button>
            </form>
            <div className="px-4 pb-3 text-center">
              <span className="text-[10px] text-gray-400 dark:text-gray-500">
                AI Waiter can make mistakes. Please verify allergy info with staff.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
