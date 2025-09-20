"use client";
import React, { useState, useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageArea from "./MessageArea";
import ChatInput from "./ChatInput";
import { ChatSession, AssistantCanvasData } from "./types";

interface FullScreenChatProps {
  session: ChatSession;
  onMinimize: () => void;
  onSend: (text: string) => void;
  // MODIFIED: onOpenCanvas now takes the specific canvas data for that message
  onOpenCanvas: (canvasData: AssistantCanvasData) => void;
  isCanvasAvailable: boolean;
  isLoading: boolean;
  children?: React.ReactNode;
}

export const FullScreenChat = ({
  session,
  onMinimize,
  onSend,
  onOpenCanvas,
  isCanvasAvailable,
  isLoading,
  children
}: FullScreenChatProps) => {
  const [inputValue, setInputValue] = useState("");
  const messageAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  }, [session.messages, isLoading]);

  const handleSendClick = () => {
    if (isLoading || !inputValue.trim()) return;
    onSend(inputValue);
    setInputValue("");
  }

  return (
    <div className={`fixed inset-0 z-50 flex flex-col bg-white transition-transform duration-500 ease-in-out ${session.status === 'expanded' ? 'transform translate-y-0' : 'transform translate-y-full'}`}>
      <ChatHeader onToggle={onMinimize} isExpanded={session.status === 'expanded'} />

      <div ref={messageAreaRef} className="flex-1 overflow-y-auto">
        <div className="w-3/4 mx-auto">
          {/* MODIFIED: children is no longer needed here */}
          <MessageArea
            messages={session.messages}
            onOpenCanvas={onOpenCanvas}
          />
        </div>
      </div>

      <div className="p-4 bg-white border-t flex justify-center">
        <div className="w-full md:w-3/5">
          <ChatInput
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onSend={handleSendClick}
            placeholder={isLoading ? "Assistant is processing..." : "Continue the conversation..."}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  )
};

