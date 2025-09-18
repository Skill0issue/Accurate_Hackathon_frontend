"use client";

import React from "react";
import { Send } from "lucide-react";

// Define the props the component will accept from its parent
interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  placeholder: string;
  disabled: boolean;
}

/**
 * A controlled input component for the chat interface.
 * Its state (value, disabled state) is managed by the parent component.
 */
export default function ChatInput({ value, onChange, onSend, placeholder, disabled }: ChatInputProps) {
  
  const handleSendMessage = () => {
    // Prevent sending if the input is empty or if it's in a disabled state (e.g., loading)
    if (!value.trim() || disabled) return;
    onSend();
  };

  return (
    <div className="relative flex items-center">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-[70%] mx-auto py-3 pl-4 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        onKeyDown={(e) => {
          // Send message on Enter key press, but not with Shift+Enter
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
      />
      <button
        onClick={handleSendMessage}
        aria-label="Send"
        className="absolute right-3 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
        disabled={disabled || !value.trim()}
      >
        <Send className="h-4 w-4" />
      </button>
    </div>
  );
}
