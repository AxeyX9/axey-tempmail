import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [email, setEmail] = useState(null);
  const [token, setToken] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  async function generateMail() {
    setLoading(true);
    try {
      const res = await fetch("/api/proxy/generate");
      const data = await res.json();
      setEmail(data.address);
      setToken(data.token);
      setMessages([]);
    } catch {
      alert("Failed to generate email");
    }
    setLoading(false);
  }

  async function loadInbox() {
    if (!email || !token) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/proxy/get?email=${email}&key=${token}`);
      const data = await res.json();
      setMessages(data.email || []);
    } catch {
      alert("Inbox load failed");
    }

    setLoading(false);
  }

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2 style={{ color: "var(--text)" }}>TempMail</h2>
        <label style={{ color: "var(--text)" }}>
          <input
            type="checkbox"
            checked={theme === "dark"}
            onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
          />
          Dark
        </label>
      </div>

      <motion.button whileTap={{ scale: 0.97 }} onClick={generateMail}>
        {loading ? "Loading..." : "Generate Email"}
      </motion.button>

      <AnimatePresence>
        {email && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="email-box"
          >
            {email}
            <button
              style={{ width: "auto", padding: "6px 10px" }}
              onClick={() => navigator.clipboard.writeText(email)}
            >
              Copy
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {email && (
        <motion.button whileTap={{ scale: 0.97 }} onClick={loadInbox}>
          Check Inbox
        </motion.button>
      )}

      <div style={{ marginTop: "20px" }}>
        <h3 style={{ color: "var(--text)" }}>Inbox</h3>

        {messages.length === 0 && (
          <p style={{ color: "var(--text)" }}>No messages</p>
        )}

        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="message"
          >
            <strong>From:</strong> {m.from} <br />
            <strong>Subject:</strong> {m.subject} <br />
            <div dangerouslySetInnerHTML={{ __html: m.body }} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
