import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../../../services/api';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am the GCCBA AI Assistant. How can I help you with your placement journey today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  const location = useLocation();
  const role = localStorage.getItem('role');


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Hide chatbot
  if (
    location.pathname.startsWith('/admin') || 
    location.pathname.startsWith('/company') ||
    role === 'admin' ||
    role === 'company'
  ) {
    return null;
  }

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await API.post('/ai/chat', { message: userText });
      setMessages(prev => [...prev, { sender: 'bot', text: response.data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'bot', text: "I'm having trouble connecting to the servers right now. Please check back later!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Widget Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-surface-container-lowest rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-outline-variant/20 flex flex-col overflow-hidden z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
          
          {/* Header */}
          <div className="bg-primary px-5 py-4 flex items-center justify-between shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-sm border border-white/30">
                <span className="material-symbols-outlined text-[20px]">smart_toy</span>
              </div>
              <div>
                <h3 className="font-bold font-headline text-white leading-tight">Career AI Assistant</h3>
                <p className="text-white/80 text-[11px] font-bold uppercase tracking-widest">Online</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors relative z-10">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Messages Area */}
          <div className="h-80 overflow-y-auto p-5 bg-surface flex flex-col gap-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-2 shrink-0 border border-primary/20">
                    <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                  </div>
                )}
                <div className={`max-w-[75%] p-3 text-sm rounded-2xl whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-primary text-white rounded-tr-sm' : 'bg-surface-container text-on-surface rounded-tl-sm border border-outline-variant/10'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-2 shrink-0">
                  <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                </div>
                <div className="bg-surface-container text-on-surface p-3 rounded-2xl rounded-tl-sm text-sm border border-outline-variant/10 flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                  <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form className="p-3 bg-surface-container-low border-t border-outline-variant/15 flex gap-2" onSubmit={sendMessage}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..." 
              className="flex-grow bg-white border border-outline-variant/30 rounded-full px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className="w-11 h-11 shrink-0 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-hover active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 shadow-md shadow-primary/20"
            >
              <span className="material-symbols-outlined text-[20px] ml-0.5">send</span>
            </button>
          </form>

        </div>
      )}

      {/* Floating Toggle Button */}
      <div 
        className="fixed bottom-6 right-6 z-[100] group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Helper Tooltip */}
        {!isOpen && isHovered && (
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-surface-container-highest text-on-surface font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-lg whitespace-nowrap shadow-md animate-in fade-in slide-in-from-right-2 hidden md:block">
            Need Help?
            <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-surface-container-highest rotate-45"></div>
          </div>
        )}

        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_8px_20px_rgba(0,0,0,0.2)] ${isOpen ? 'bg-surface-container-high text-on-surface-variant hover:bg-outline-variant/20 hover:text-on-surface scale-90' : 'bg-primary text-white hover:bg-primary-hover hover:scale-110 active:scale-95 hover:shadow-[0_12px_24px_rgba(221,20,119,0.4)]'}`}
        >
          <span className={`material-symbols-outlined text-[28px] transition-transform duration-300 ${isOpen ? 'rotate-90 scale-90' : 'scale-100'}`}>
            {isOpen ? 'expand_more' : 'smart_toy'}
          </span>
        </button>
      </div>
    </>
  );
};

export default AIChatbot;

