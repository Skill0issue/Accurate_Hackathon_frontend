"use client";
import React, { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';

interface NewChatInputProps {
  onSend: (text: string) => void;
}

/**
 * A stylized input field for starting a new chat conversation.
 * It appears at the bottom of the screen when no active chat session exists.
 */
export const NewChatInput: React.FC<NewChatInputProps> = ({ onSend }) => {
  const [value, setValue] = useState("");

  const handleSend = () => {
    if (value.trim()) {
      onSend(value);
      setValue("");
    }
  };

  return (
    <div className="relative flex items-center w-full max-w-4xl bg-white rounded-full shadow-md shadow-gray-500 p-2">
      <MessageSquare className="absolute left-5 h-6 w-6 text-blue-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Ask me anything about your data..."
        className="w-full bg-transparent py-2 pl-14 pr-14 border-none focus:outline-none"
      />
      <button
        onClick={handleSend}
        className="absolute right-3 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-blue-300"
        disabled={!value.trim()}
      >
        <Send className="h-4 w-4" />
      </button>
    </div>
  );
};
export default NewChatInput;