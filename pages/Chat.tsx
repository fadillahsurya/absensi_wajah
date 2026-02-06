
import React, { useState, useRef, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { getChatResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Halo! Saya HR Assistant. Ada yang bisa saya bantu hari ini?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const responseText = await getChatResponse(history, input);
      const botMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText || 'Maaf, saya tidak mengerti.' };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      const errorMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: 'Oops, terjadi kesalahan koneksi.' };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Layout title="HR Assistant">
      <div className="flex flex-col h-[calc(100vh-140px)]">
        {/* Chat window */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[80%] items-end space-x-2 ${m.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-indigo-600' : 'bg-white border border-gray-200'}`}>
                  {m.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-indigo-600" />}
                </div>
                <div className={`p-4 rounded-3xl text-sm shadow-sm ${
                  m.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-white text-gray-800 border border-gray-50 rounded-bl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-50 flex space-x-1">
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="p-4 bg-white border-t border-gray-100 pb-8">
          <div className="flex items-center space-x-2 bg-gray-50 rounded-2xl p-2 pl-4 border border-gray-100">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Tanya sesuatu..."
              className="flex-1 bg-transparent border-none outline-none text-sm py-2"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="p-3 bg-indigo-600 text-white rounded-xl shadow-md disabled:bg-indigo-300 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};
