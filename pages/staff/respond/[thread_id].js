import Header from '/components/Header';
import Footer from '/components/Footer';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

export default function Respond() {
  const router = useRouter();
  const { thread_id, escalation_query } = router.query;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef(null);

  // Notify user that staff has joined the chat
  useEffect(() => {
    if (!thread_id) return;
    wsRef.current = new WebSocket(`ws://localhost:8000/query/ws/chat/${thread_id}/staff`);
    wsRef.current.onopen = () => {
      setWsConnected(true);

      console.log("WebSocket connected for staff");
      wsRef.current.send(JSON.stringify({
        role: "staff",
        content: "Staff has joined the chat."
      }));
      if (escalation_query) {
        setMessages((msgs) =>
          [
            ...msgs,
            {
              role: 'user',
              content: `${escalation_query}`
            }
          ]
        );
      }
    };
  }, [thread_id]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !wsRef.current) return;
    wsRef.current.send(JSON.stringify({ role: "staff", content: input }));
    setMessages((msgs) => [...msgs, { role: "staff", content: input }]);
    setInput("");
  };

  const markResolved = () => {
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({ role: "staff", status: "resolved", content: "Query marked as resolved by staff." }));
    }
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #c7d2fe 100%)' }}>
      <Header />
      <div className="max-w-5xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">Staff Response Page</h1>
        <div className="bg-white rounded shadow p-6 mb-4">
          <div className="mb-2 font-semibold">Chat Room (Thread: {thread_id})</div>
          <div className="border rounded p-2 h-64 overflow-y-auto mb-2 bg-blue-50">
            {messages.map((msg, i) => (
              <div key={i} className={`mb-2 ${msg.role === "staff" ? "text-blue-700" : "text-gray-800"}`}>
                <b>{msg.role === "staff" ? "Staff" : "User"}:</b> {msg.content}
                {msg.status === "resolved" && <span className="ml-2 text-green-600 font-bold">[Resolved]</span>}
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} className="flex gap-2 mb-2">
            <input
              type="text"
              className="border px-2 py-1 rounded flex-1"
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={!wsConnected}
              placeholder="Type your message..."
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded" disabled={!wsConnected || !input.trim()}>
              Send
            </button>
          </form>
          <button onClick={markResolved} className="bg-green-600 text-white px-4 py-1 rounded" disabled={!wsConnected}>
            Mark as Resolved
          </button>
        </div>
      </div>
      <Footer />
    </main>
  );
}