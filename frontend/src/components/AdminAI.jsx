import React, { useState } from 'react';
import axios from 'axios';
import { Bot, Send, Sparkles } from 'lucide-react';

const AdminAI = () => {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!message.trim()) return;

    try {
      setLoading(true);
      setReply('');

      const res = await axios.post('/api/ai/suggest', {
        user_message: message
      });

      setReply(res.data.reply);
    } catch (error) {
      console.error(error);
      setReply('AI assistant could not respond right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-red-100 text-red-600 p-3 rounded-xl">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-black">AI Restaurant Assistant</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Ask for menu suggestions, sales ideas, or restaurant recommendations.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Example: What should we recommend today?"
          className="flex-1 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 outline-none focus:ring-4 focus:ring-red-500/20"
        />

        <button
          onClick={askAI}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Sparkles className="w-5 h-5 animate-pulse" />
              Thinking...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Ask AI
            </>
          )}
        </button>
      </div>

      {reply && (
        <div className="mt-5 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl p-4">
          <p className="text-sm font-bold text-red-600 mb-2">AI Response</p>
          <p className="text-gray-700 dark:text-gray-200 whitespace-pre-line">{reply}</p>
        </div>
      )}
    </div>
  );
};

export default AdminAI;