"use client";

import React, { useState } from "react";
import MessageList from "../../components/chat/MessageList";
import MessageInput from "../../components/chat/MessageInput";
import FloatingChat from "../../components/chat/FloatingChat";
import type { ChatMessage } from "../../components/chat/MessageBubble";
import Sidebar from "@/components/layout/Sidebar";
import {
  UserCircle,
  LayoutDashboard,
  Package,
  ShoppingBag,
  MessageCircle,  
  Menu,
  X,
} from "lucide-react";
import Header from "@/components/layout/Header";


// ===== Main Chat Page =====
export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatTitle, setChatTitle] = useState("Chat");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // handle sending new message
  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const newMsg: ChatMessage = {
      id: `${Date.now()}`,
      role: "user",
      parts: [{ text }],
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  // quick action handler
  const handleQuickAction = (text: string) => {
    handleSend(text);
  };

  return (
    <div className="flex min-h-screen bg-white text-gray-800">
      {/* Sidebar */}
      <Sidebar
        onOpenChat={() => setIsChatOpen(true)}
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* ===== HEADER ===== */}
        <Header onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

        {/* ===== LANDING PAGE (if no messages) ===== */}
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold mb-2">
                Welcome to Accurate Chat
              </h1>
              <p className="text-gray-500 max-w-xl mx-auto">
                Ask me anything about your data, metrics, or reports. I can help
                you understand trends, create visualizations, and answer
                questions.
              </p>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-2 gap-4 max-w-2xl">
              <button
                onClick={() =>
                  handleQuickAction("Show me order turnaround details.")
                }
                className="p-4 border rounded-lg hover:shadow transition cursor-pointer text-left bg-white"
              >
                <div className="text-blue-500 mb-2">⏱</div>
                <h3 className="font-medium">Order Turnaround</h3>
                <p className="text-sm text-gray-500">
                  Analyze delivery performance and timing
                </p>
              </button>

              <button
                onClick={() =>
                  handleQuickAction("Give me background check completion rates.")
                }
                className="p-4 border rounded-lg hover:shadow transition cursor-pointer text-left bg-white"
              >
                <div className="text-blue-500 mb-2">🛡</div>
                <h3 className="font-medium">Background Checks</h3>
                <p className="text-sm text-gray-500">
                  View completion rates by package type
                </p>
              </button>

              <button
                onClick={() =>
                  handleQuickAction("Show geographic dispute patterns.")
                }
                className="p-4 border rounded-lg hover:shadow transition cursor-pointer text-left bg-white"
              >
                <div className="text-blue-500 mb-2">📍</div>
                <h3 className="font-medium">Geographic Disputes</h3>
                <p className="text-sm text-gray-500">
                  Track dispute patterns by location
                </p>
              </button>

              <button
                onClick={() =>
                  handleQuickAction("What is the candidate pipeline summary?")
                }
                className="p-4 border rounded-lg hover:shadow transition cursor-pointer text-left bg-white"
              >
                <div className="text-blue-500 mb-2">👤</div>
                <h3 className="font-medium">Candidate Status</h3>
                <p className="text-sm text-gray-500">
                  Get weekly application pipeline summary
                </p>
              </button>
            </div>
          </div>
        ) : (
          /* ===== CHAT VIEW ===== */
          <>
            <div className="flex justify-center py-4">
              <div className="bg-gray-100 text-gray-700 px-5 py-3 rounded-lg inline-block">
                {chatTitle}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4">
              <MessageList messages={messages} />
            </div>
          </>
        )}

        {/* ===== INPUT BAR ===== */}
        <div className="border-t p-4 bg-white">
          <MessageInput onSend={handleSend} />
          <p className="text-center text-xs text-gray-400 mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>

      {/* Floating Chat for AIRA */}
      {isChatOpen && <FloatingChat onClose={() => setIsChatOpen(false)} />}
    </div>
  );
}
