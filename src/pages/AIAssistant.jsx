import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const QUICK_ACTIONS = [
  "I am being followed, what should I do?",
  "I feel unsafe right now",
  "How do I use self defense?",
  "I need mental support",
  "What are my legal rights?",
  "How do I use the SOS feature?",
];

const SAFETY_TIPS = [
  "Always share your live location with a trusted contact when travelling alone at night.",
  "Trust your instincts. If something feels wrong, it probably is.",
  "Keep emergency numbers saved and accessible quickly.",
  "Walk in well-lit areas and stay aware of your surroundings.",
  "The SafeCampus SOS button can be triggered in under 2 seconds.",
];

function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hello! I am SafeGuard AI, your personal safety assistant. How can I help you stay safe today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [disguised, setDisguised] = useState(false);
  const [secretInput, setSecretInput] = useState("");
  const [secretCode, setSecretCode] = useState("homework");
  const [tip] = useState(SAFETY_TIPS[Math.floor(Math.random() * SAFETY_TIPS.length)]);
  const [sosDetected, setSosDetected] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    API.get("/auth/profile")
      .then((res) => {
        if (res.data?.secretCode) setSecretCode(res.data.secretCode);
      })
      .catch(() => {});
  }, []);

  const EMERGENCY_WORDS = ["help", "scared", "following", "unsafe", "danger", "attack", "hurt", "afraid", "emergency"];

  const checkEmergency = (text) => {
    const lower = text.toLowerCase();
    return EMERGENCY_WORDS.some((word) => lower.includes(word));
  };

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    if (checkEmergency(userText)) setSosDetected(true);
    setLoading(true);
    try {
      const res = await API.post("/ai/chat", { message: userText });
      setMessages((prev) => [...prev, { role: "ai", text: res.data.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "ai", text: "Sorry, I am having trouble connecting. If this is an emergency, please press the SOS button immediately." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSecretChange = (e) => {
    const value = e.target.value;
    setSecretInput(value);
    if (value.trim().toLowerCase() === secretCode.trim().toLowerCase()) {
      setDisguised(false);
      setSecretInput("");
    }
  };

  if (disguised) {
    return (
      <div className="min-h-screen bg-white p-6 flex flex-col">
        <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
          <h1 className="text-2xl font-semibold text-gray-700 mb-4">My Notes</h1>
          <textarea
            autoFocus
            className="w-full h-64 border border-gray-200 rounded-lg p-4 text-gray-600 focus:outline-none focus:border-gray-300 resize-none"
            placeholder="Write your notes here..."
            value={secretInput}
            onChange={handleSecretChange}
          />
          <p className="text-gray-300 text-xs mt-3 text-center">
            Type your disguise code from Profile to return to the assistant.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col">

      <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-pink-700">SafeGuard AI</h1>
          <p className="text-gray-400 text-sm">Your personal safety assistant</p>
        </div>
        <button
          onClick={() => setDisguised(true)}
          className="bg-gray-100 text-gray-500 px-3 py-1 rounded-lg text-sm hover:bg-gray-200 transition"
          title="Disguise app"
        >
          Hide App
        </button>
      </div>

      <div className="bg-pink-100 px-6 py-3 text-pink-700 text-sm">
        Tip: {tip}
      </div>

      {sosDetected && (
        <div className="bg-red-100 border border-red-300 px-6 py-3 flex justify-between items-center">
          <p className="text-red-600 font-medium">Are you in danger? Trigger SOS immediately!</p>
          <button onClick={() => navigate("/sos")} className="bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-700 transition">
            SOS Now
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
        {messages.map((msg, index) => (
          <div key={index} className={"flex " + (msg.role === "user" ? "justify-end" : "justify-start")}>
            <div className={"max-w-xs md:max-w-md px-4 py-3 rounded-2xl text-sm " + (msg.role === "user" ? "bg-pink-600 text-white rounded-br-none" : "bg-white text-gray-700 shadow rounded-bl-none")}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-400 px-4 py-3 rounded-2xl shadow text-sm">
              SafeGuard is thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-6 py-2 flex gap-2 overflow-x-auto">
        {QUICK_ACTIONS.map((action, index) => (
          <button key={index} onClick={() => sendMessage(action)} className="bg-white border border-pink-300 text-pink-600 text-xs px-3 py-2 rounded-full whitespace-nowrap hover:bg-pink-50 transition">
            {action}
          </button>
        ))}
      </div>

      <div className="bg-white px-6 py-4 flex gap-3 shadow-inner">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-pink-500"
        />
        <button onClick={() => sendMessage()} disabled={loading} className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition">
          Send
        </button>
      </div>

    </div>
  );
}

export default AIAssistant;
