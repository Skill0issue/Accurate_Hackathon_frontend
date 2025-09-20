"use client";
import React from "react";
import { ChatMessage as ChatMsg, AssistantCanvasData } from "@/components/chat/types";
import { AgenticResponse } from "./streaming/AgenticResponse";

interface MessageAreaProps {
  messages: ChatMsg[];
  // MODIFIED: onOpenCanvas now expects the specific canvas data for the message.
  onOpenCanvas: (canvasData: AssistantCanvasData) => void;
}

const MessageArea: React.FC<MessageAreaProps> = ({ messages, onOpenCanvas }) => {
  return (
    <div className="p-6 space-y-4">
      {messages.map((msg, i) => {
        return (
          <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`flex items-end gap-3 w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {/* User message rendering */}
              {msg.role === 'user' && (
                <>
                  <div className="max-w-full space-y-2">
                    {msg.parts.map((part, partIndex) => (
                      part.type === 'markdown' &&
                      <div key={partIndex} className="px-4 py-3 rounded-2xl bg-blue-600 text-white rounded-br-none">
                        <p className="text-sm">{part.content}</p>
                      </div>
                    ))}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
                </>
              )}

              {/* Assistant message rendering */}
              {msg.role === 'assistant' && msg.parts.map((part, partIndex) => {
                // MODIFIED: This is now the primary way to render assistant responses.
                if (part.type === 'agentic_turn') {
                  return (
                    <AgenticResponse
                      key={partIndex}
                      turn={part.data}
                      // MODIFIED: Pass a callback that includes the specific canvas data for this turn.
                      onOpenCanvas={() => {
                        if (part.data.canvasData) {
                          onOpenCanvas(part.data.canvasData);
                        }
                      }}
                    />
                  );
                }
                
                // Fallback for simple markdown messages (e.g., error messages)
                if (part.type === 'markdown') {
                  return (
                    <div key={partIndex} className="flex items-end gap-3 w-full justify-start">
                       <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex-shrink-0" />
                       <div className="px-4 py-3 rounded-2xl bg-gray-100 text-gray-800 rounded-bl-none">
                          <p className="text-sm">{part.content}</p>
                       </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
            
            <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-right w-full pr-12' : 'text-left pl-12'} text-gray-400`}>{msg.time}</p>
          </div>
        )
      })}
    </div>
  );
};

export default MessageArea;

