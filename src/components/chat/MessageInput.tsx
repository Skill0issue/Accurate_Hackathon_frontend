"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";

interface Props {
  onSend: (text: string) => Promise<void> | void;
  disabled?: boolean;
}

const MessageInput: React.FC<Props> = ({ onSend, disabled }) => {
  const [value, setValue] = useState("");

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = value.trim();
    if (!text) return;
    setValue("");
    await onSend(text);
  };

  return (
    <form
      onSubmit={submit}
      className="flex items-center w-full justify-center"
    >
      <div className="relative w-full max-w-3xl">
        <textarea
          className="w-full h-14 pl-5 pr-12 rounded-lg border border-gray-300 bg-white text-gray-800 text-base resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 shadow-sm"
          placeholder="Ask me anything about your data..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition disabled:opacity-50 shadow-sm"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
