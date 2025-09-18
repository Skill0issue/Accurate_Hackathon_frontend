"use client";

import React, { useState } from "react";

interface Props {
  data: any;
}

const NewPrompt: React.FC<Props> = ({ data }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/chats/${data.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        setText("");
      } else {
        console.error("Failed to send message");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="newPrompt">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="promptInput"
      />
      <button type="submit" disabled={loading} className="promptSubmit">
        {loading ? "Sending..." : "Send"}
      </button>
    </form>
  );
};

export default NewPrompt;
