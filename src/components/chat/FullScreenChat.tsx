"use client";
import React, { useState, useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageArea from "./MessageArea";
import ChatInput from "./ChatInput";
import { ChatSession, MessagePart } from "./types";

interface FullScreenChatProps {
  session: ChatSession;
  onMinimize: () => void;
  onSend: (text: string) => void;
  onOpenCanvas: () => void;
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
    }, [session.messages, children, isLoading]);
    
    const handleSendClick = () => {
        if (isLoading || !inputValue.trim()) return;
        onSend(inputValue);
        setInputValue("");
    }

    return (
        <div className={`fixed inset-0 z-50 flex flex-col bg-white transition-transform duration-500 ease-in-out ${session.status === 'expanded' ? 'transform translate-y-0' : 'transform translate-y-full'}`}>
            <ChatHeader onToggle={onMinimize} isExpanded={session.status === 'expanded'}/>
            
            <div ref={messageAreaRef} className="flex-1 overflow-y-auto">
              {/* This new container centers the content and sets its width */}
              <div className="w-3/4 mx-auto">
                <MessageArea 
                  messages={session.messages} 
                  onOpenCanvas={onOpenCanvas}
                  isCanvasAvailable={isCanvasAvailable}
                />
                {/* The live agent response is also inside the centered container */}
                {children && <div className="px-6 pb-4">{children}</div>}
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

