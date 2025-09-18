"use client";

import React from "react";
import { Plus, UserCircle } from "lucide-react";

interface RootLayoutProps {
  children: React.ReactNode;
  onNewChat?: () => void;
  showNewChatButton?: boolean;
}

export default function RootLayout({ 
  children, 
  onNewChat,
  showNewChatButton = true 
}: RootLayoutProps) {
  const handleNewChat = () => {
    if (onNewChat) {
      onNewChat();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="text-blue-600 font-bold text-lg">logo</div>
          {showNewChatButton && (
            <button
              className="ml-4 flex items-center space-x-2 px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-100 transition"
              onClick={handleNewChat}
            >
              <Plus className="h-4 w-4" />
              <span>New Chat</span>
            </button>
          )}
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <UserCircle className="h-7 w-7 text-gray-500" />
        </button>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}