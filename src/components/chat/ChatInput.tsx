"use client";

import React from "react";
// MODIFIED: Imported both Send and MessageSquare icons
import { Send, MessageSquare } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  placeholder: string;
  disabled: boolean;
}

export default function ChatInput({ value, onChange, onSend, placeholder, disabled }: ChatInputProps) {
  const handleSendMessage = () => {
    if (!value.trim() || disabled) return;
    onSend();
  };

  return (
    // MODIFIED: Changed the wrapper to be a single, relative container
    <div className="relative flex items-center w-full max-w-2xl mx-auto bg-white rounded-full shadow-md shadow-gray-500 p-2">
      {/* ADDED: MessageSquare icon for visual consistency */}
      <MessageSquare className="absolute left-5 h-6 w-6 text-blue-500" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        // MODIFIED: Updated input styles to match NewChatInput
        className="w-full bg-transparent py-2 pl-14 pr-14 border-none focus:outline-none disabled:bg-transparent"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
      />
      <button
        onClick={handleSendMessage}
        aria-label="Send"
        // MODIFIED: Positioned the button absolutely and adjusted padding/styles
        className="absolute right-3 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-blue-300"
        disabled={disabled || !value.trim()}
      >
        <Send className="h-4 w-4" />
      </button>
    </div>
  );
}
