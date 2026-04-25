import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, X, Send } from 'lucide-react';

const Chatbot = ({ apiUrl, onAction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your virtual ARchitect assistant. You can ask me to 'add a kitchen' or 'remove the bedroom' and I'll update your plan!", isUser: false }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await axios.post(`${apiUrl}/chat`, { message: userMessage });

      // Handle any state-changing actions returned from the NLP logic
      if (res.data.action && onAction) {
        onAction(res.data.action);
      }

      // Simulate slight delay for more natural feel
      setTimeout(() => {
        setMessages(prev => [...prev, { text: res.data.reply, isUser: false }]);
        setIsTyping(false);
      }, 600);

    } catch (err) {
      console.error("Error sending message", err);
      setIsTyping(false);
      setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting right now.", isUser: false }]);
    }
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : 'closed'}`}>
      <div className="chatbot-header" onClick={() => setIsOpen(!isOpen)}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, color: 'white' }}>
          <MessageSquare size={18} /> ARchitect Assistant
        </h3>
        {isOpen ? <X size={18} color="white" /> : null}
      </div>

      <div className="chatbot-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.isUser ? 'user' : 'bot'}`} style={{ color: msg.isUser ? 'white' : 'var(--text-primary)' }}>
            {msg.text}
          </div>
        ))}
        {isTyping && (
          <div className="message bot" style={{ display: 'flex', gap: '4px', alignItems: 'center', width: 'fit-content' }}>
            <span className="dot" style={dotStyle}>.</span>
            <span className="dot" style={dotStyle}>.</span>
            <span className="dot" style={dotStyle}>.</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chatbot-input" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="e.g. Add a kitchen..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" disabled={isTyping || !input.trim()}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

const dotStyle = {
  animation: 'blink 1.4s infinite both',
  fontSize: '1.2rem',
  lineHeight: '10px'
};

export default Chatbot;
