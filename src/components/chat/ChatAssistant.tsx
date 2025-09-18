"use client";
import React, { useState, useRef } from "react";
import { MessageCircle } from "lucide-react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import { CanvasModal } from "./CanvasModal";
import { VisualCanvas } from "../canvas/VisualCanvas";

// --- NEW: Import CanvasData type and the new mock canvas data ---
import { ChatMessage as ChatMsg, CanvasData } from "@/components/chat/types";
import { 
  WELCOME_MESSAGE, 
  MOCK_VISUALIZATION_RESPONSE, 
  MOCK_CANVAS_DATA 
} from "@/components/chat/mockData";

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(true); // Defaulting to true for easier testing
  const [isMinimized, setIsMinimized] = useState(false);
  const [width, setWidth] = useState(450);
  const [messages, setMessages] = useState<ChatMsg[]>([WELCOME_MESSAGE]);
  const isResizing = useRef(false);

  // --- NEW: State management updated for the structured canvas data ---
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [canvasData, setCanvasData] = useState<CanvasData | null>(null);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMsg = {
      role: "user",
      parts: [{ type: "markdown", content: text }],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);

    // --- NEW: Simulate the backend generating a full canvas blueprint ---
    setTimeout(() => {
      // The assistant's chat bubble response
      const assistantResp = MOCK_VISUALIZATION_RESPONSE; 
      setMessages((prev) => [...prev, assistantResp]);

      // The structured data for the canvas modal. In a real app, your AI
      // would generate this object based on the user's query.
      const newCanvasData = MOCK_CANVAS_DATA;
      setCanvasData(newCanvasData);
      
      // Automatically open the canvas for a better user experience
      setIsCanvasOpen(true);
    }, 1000);
  };

  const resetChat = () => {
    setMessages([WELCOME_MESSAGE]);
    setCanvasData(null);
    setIsCanvasOpen(false);
  };

  const startResize = () => {
    isResizing.current = true;
    document.addEventListener("mousemove", handleResize);
    document.addEventListener("mouseup", stopResize);
  };

  const handleResize = (e: MouseEvent) => {
    if (isResizing.current) {
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth > 320 && newWidth < 1200) setWidth(newWidth);
    }
  };

  const stopResize = () => {
    isResizing.current = false;
    document.removeEventListener("mousemove", handleResize);
    document.removeEventListener("mouseup", stopResize);
  };

  const showIndicator = isMinimized && messages.length > 1;

  return (
    <>
      {(!isOpen || isMinimized) && (
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => {
              setIsMinimized(false);
              setIsOpen(true);
            }}
            className="bg-blue-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110"
            aria-label="Open chat"
          >
            <MessageCircle className="h-6 w-6" />
          </button>
          {showIndicator && (
            <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white" />
          )}
        </div>
      )}

      {isOpen && !isMinimized && (
        <div className="fixed inset-0 flex justify-end z-50 ">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMinimized(true)}
          />
          <div
            className="relative h-full bg-white shadow-xl flex flex-col"
            style={{ width }}
          >
            <div
              onMouseDown={startResize}
              className="absolute left-0 top-0 h-full w-1 cursor-ew-resize bg-transparent hover:bg-gray-200 transition-colors "
            />
            <ChatHeader
              onToggle={() => setIsMinimized(true)}
              onClose={() => {
                setIsOpen(false);
                resetChat(); // Use the reset function for a clean close
              }}
              isExpanded={!isMinimized}
            />
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
              {messages.map((msg, i) => (
                <ChatMessage key={i} message={msg} />
              ))}
            </div>
            <ChatInput onSend={handleSend} />
          </div>
        </div>
      )}

      {/* --- FIXED: Pass VisualCanvas as children to the modal --- */}
      <CanvasModal
        isOpen={isCanvasOpen}
        onClose={() => setIsCanvasOpen(false)}
      >
        {canvasData && <VisualCanvas data={canvasData} />}
      </CanvasModal>
    </>
  );
}
