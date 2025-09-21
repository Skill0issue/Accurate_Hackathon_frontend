"use client";
import React from "react";
import ResponseHeader from "../response/ResponseHeader";
import ResponseFooter from "../response/ResponseFooter";
import ThinkingComponent, { ThinkingData } from "../response/ThinkingDropDown"; // Import the thinking component and types

export type ChatMessage = {
  id?: string;
  role: "user" | "assistant" | "system" | string;
  parts?: { text?: string }[];
  img?: string;
  createdAt?: string;
  thinking?: ThinkingData; // Add thinking data to message type
};

export default function MessageBubble({ message }: { message: ChatMessage }) {
  const text = message.parts?.[0]?.text ?? "";
  const isUser = message.role === "user";
  
  // Only show header/footer for assistant messages
  const isAssistant = message.role === "assistant";
  
  return (
    <div
      className={`flex w-full my-2 ${isUser ? "justify-end" : "justify-start"}`}
      data-role={message.role}
    >
      <div
        className={`relative px-5 py-3 max-w-[70%] rounded-2xl text-base leading-relaxed shadow-sm border 
         ${isUser ? "bg-blue-600 text-white border-blue-500" : "bg-[#f8fbff] text-black border-white/5"} flex flex-col`}
      >
        {isAssistant && <ResponseHeader />}

        {message.img && (
          <img
            src={message.img}
            alt="image"
            className="max-w-full rounded-xl mb-2 border border-white/10"
          />
        )}

        {/* Show thinking component for assistant messages with thinking data */}
        {isAssistant && message.thinking && (
          <ThinkingComponent 
            thinking={message.thinking} 
            className="mb-3" 
          />
        )}

        <div className={`whitespace-pre-wrap ${isAssistant ? "my-2" : ""}`}>{text}</div>

        {isAssistant && <ResponseFooter />}

        {/* Timestamp */}
        {message.createdAt && (
          <div className={`text-xs mt-1 ${isUser ? "text-blue-200/70" : "text-gray-400/70"}`}>
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        )}
      </div>
    </div>
  );
}