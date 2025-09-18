"use client";

import React, { useState } from "react";
import MessageList from "../../components/chat/MessageList";
import MessageInput from "../../components/chat/MessageInput";
import type { ChatMessage } from "../../components/chat/MessageBubble";

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatTitle, setChatTitle] = useState("Chat");

  // handle sending new message
  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: `${Date.now()}`,
      role: "user",
      parts: [{ text }],
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);

    // Generate AI response with thinking process for every message
    const aiReply: ChatMessage = {
      id: `${Date.now()}-ai`,
      role: "assistant",
      parts: [
        { text: `This is a demo AI response to your message: "${text}"` },
      ],
      thinking: {
        steps: [
          {
            id: "1",
            title: "🎯 PLANNER: ANALYZING QUERY",
            description: `Processing user input: "${text}"`,
            status: "complete",
            duration: Math.floor(Math.random() * 200) + 100,
          },
          {
            id: "2",
            title: "🔍 NL2SQL: QUERY GENERATION",
            description: "Generating appropriate SQL query based on user intent",
            status: "complete",
            duration: Math.floor(Math.random() * 150) + 80,
          },
          {
            id: "3",
            title: "💾 DATABASE: EXECUTING QUERY",
            description: "Running query against database and retrieving results",
            status: "complete",
            duration: Math.floor(Math.random() * 300) + 150,
          },
          {
            id: "4",
            title: "📚 RAG: CONTEXT PROCESSING",
            description:
              "Processing retrieved data and generating contextual explanation",
            status: "complete",
            duration: Math.floor(Math.random() * 400) + 200,
          },
          {
            id: "5",
            title: "📝 RESPONSE: SYNTHESIS",
            description:
              "Combining query results with context to generate final response",
            status: "complete",
            duration: Math.floor(Math.random() * 200) + 100,
          },
        ],
        pythonCode: `# Query Processing Pipeline
user_query = "${text}"

# Step 1: Parse user intent
intent = parse_user_query(user_query)

# Step 2: Generate SQL
sql_query = generate_sql(intent)
# Example: SELECT * FROM table WHERE condition

# Step 3: Execute query
results = execute_query(sql_query)

# Step 4: RAG processing
context = retrieve_relevant_context(results)
explanation = generate_explanation(context)

# Step 5: Final response
response = synthesize_response(results, explanation)
print(f"Final response: {response}")`,
        isComplete: true,
      },
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => setMessages((prev) => [...prev, aiReply]), 800); // slight delay
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      {/* ===== CHAT HEADER ===== */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div className="text-blue-600 font-bold text-lg">logo</div>
      </div>

      {/* ===== CHAT VIEW ===== */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            Start a new conversation...
          </div>
        ) : (
          <MessageList messages={messages} />
        )}
      </div>

      {/* ===== INPUT BAR ===== */}
      <div className="border-t p-4 bg-white">
        <MessageInput onSend={handleSend} />
        <p className="text-center text-xs text-gray-400 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
