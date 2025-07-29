import { useState, useRef, useEffect } from 'react';

export default function ChatBot({ isOpen, onToggle }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! Welcome to Azure Grand Hotel. How can I help you?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await res.json();
      setMessages((msgs) => [...msgs, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages((msgs) => [...msgs, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={onToggle}
        className="bg-blue-600 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl hover:bg-blue-700 focus:outline-none"
        aria-label="Open chat"
      >
        <span role="img" aria-label="chat">💬</span>
      </button>
      {isOpen && (
        <div className="w-80 h-[32rem] bg-white rounded-3xl shadow-2xl flex flex-col p-4 absolute bottom-20 right-0 border border-blue-200">
          <div className="flex items-center mb-2">
            <img src="/chatbot-avatar.png" alt="Chatbot" className="w-8 h-8 rounded-full mr-2 border-2 border-blue-400" onError={e => e.target.style.display='none'} />
            <span className="font-bold text-blue-700">AI Receptionist</span>
            <button onClick={onToggle} className="ml-auto text-gray-400 hover:text-blue-600 text-xl">×</button>
          </div>
          <div className="flex-1 overflow-y-auto bg-blue-50 rounded-lg p-2 mb-2 border border-blue-100" style={{scrollbarWidth: 'thin'}}>
            {messages.map((msg, i) => (
              <div key={i} className={`mb-2 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-3 py-2 rounded-2xl max-w-xs text-sm shadow ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 border border-blue-200'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              className="flex-1 px-3 py-2 rounded-2xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-2xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              disabled={loading || !input.trim()}
            >
              {loading ? '...' : 'Send'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
