import { useEffect, useState } from "react";
import "./App.css";
import ThinkingEntity from "./AISimulation/ThinkingEntity";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "jarvis", text: "Hello sir, Jarvis online." }
  ]);

  const [thinkingState, setThinkingState] = useState("idle");

  // ===========================
  // SEND MESSAGE TO JARVIS
  // ===========================
  async function askJarvis() {
    const trimmed = input.trim();
    if (!trimmed) return;

    // Add your message to UI
    setMessages(prev => [...prev, { sender: "you", text: trimmed }]);
    setInput("");

    try {
      const reply = await window.jarvis.sendMessage(trimmed);

      setMessages(prev => [...prev, { sender: "jarvis", text: reply }]);

    } catch (err) {
      setMessages(prev => [
        ...prev,
        { sender: "jarvis", text: "⚠️ Error communicating with backend." }
      ]);
    }
  }

  // ===========================
  // TIMER EVENT FROM BACKEND
  // ===========================
  useEffect(() => {
    if (!window.jarvis?.onTimer) return;

    window.jarvis.onTimer((msg) => {
      setMessages(prev => [...prev, { sender: "jarvis", text: msg }]);
    });
  }, []);

  // ===========================
  // THINKING STATE EVENT
  // ===========================
  useEffect(() => {
    if (!window.jarvis?.onThinking) return;

    window.jarvis.onThinking((stage) => {
      setThinkingState(stage);
    });
  }, []);

  return (
    <div className="app-container">
      {/* AI Thinking Avatar */}
      <ThinkingEntity state={thinkingState} />

      <h1 className="title">Jarvis Desktop Assistant</h1>

      <div className="chat-area">
        {messages.map((m, i) => (
          <div key={i} className={`chat-row ${m.sender}`}>
            <div className={`chat-bubble ${m.sender}`}>
              <strong className="chat-label">
                {m.sender === "you" ? "You" : "Jarvis"}
              </strong>
              <div>{m.text}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 🔵 Animated Thinking Indicator */}
      {thinkingState !== "idle" && (
        <div className="thinking-indicator">
          Jarvis is {thinkingState.replace("_", " ")}...
        </div>
      )}

      {/* Input Row */}
      <div className="input-row">
        <input
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") askJarvis();
          }}
          placeholder="Ask Jarvis anything..."
        />

        <button className="send-button" onClick={askJarvis}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
