"use client";
import React, { useState, useEffect, useRef } from "react";
import { FullScreenChat } from "./FullScreenChat";
import { NewChatInput } from "./NewChatInput";
import { DockedChatIcon } from "./DockedChatIcon";
import { CanvasModal } from "./CanvasModal";
import { VisualCanvas } from "../canvas/VisualCanvas";
import { ChatMessage, CanvasData, ChatSession } from "./types";
import { AssistantTurn } from "./streamTypes";
import { streamAgenticResponse } from "@/components/services/chatService";
import { AgenticResponse } from "./streaming/AgenticResponse";

export default function ChatExperience() {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [canvasData, setCanvasData] = useState<CanvasData | null>(null);
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assistantTurn, setAssistantTurn] = useState<AssistantTurn | null>(null);
  
  // This state explicitly controls the button's visibility
  const [isCanvasAvailable, setIsCanvasAvailable] = useState(false);

  const streamConnection = useRef<(() => void) | null>(null);
  
  useEffect(() => {
    return () => {
      if (streamConnection.current) streamConnection.current();
    };
  }, []);

  const handleStartNewChat = (text: string) => {
    const newSession: ChatSession = { id: `chat_${Date.now()}`, status: "expanded", messages: [] };
    setSession(newSession);
    handleSendMessage(text, newSession);
  };

  const handleSendMessage = async (text: string, currentSession = session) => {
    if (!text.trim() || !currentSession) return;
    if (streamConnection.current) streamConnection.current();

    const userMessage: ChatMessage = {
      role: "user",
      parts: [{ type: "markdown", content: text }],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setSession({ ...currentSession, messages: [...currentSession.messages, userMessage] });
    setIsLoading(true);
    setError(null);
    setIsCanvasAvailable(false); 
    setCanvasData(null);

    streamConnection.current = streamAgenticResponse(text, {
      onUpdate: (turn) => setAssistantTurn(turn),
      onComplete: (turn) => {
        setIsLoading(false);
        setAssistantTurn(null);
        streamConnection.current = null;
        
        const finalMessage: ChatMessage = {
          role: 'assistant',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          parts: [{ type: 'agentic_turn', data: turn }]
        };

        // Check if the final turn contained any canvas data from your backend
        if (turn.canvasData) {
          setCanvasData(turn.canvasData);
          setIsCanvasAvailable(true); 
        }

        setSession(s => ({
          ...s!,
          messages: [...s!.messages, finalMessage],
        }));
      },
      onError: (err) => {
        setIsLoading(false);
        setError(err.message);
        setAssistantTurn(null);
        streamConnection.current = null;
      }
    });
  };

  const handleOpenCanvas = () => {
    if (canvasData) {
      setIsCanvasOpen(true);
    }
  };

  const handleToggleSession = () => {
    if (!session) return;
    const newStatus = session.status === 'expanded' ? 'minimized' : 'expanded';
    setSession({ ...session, status: newStatus });
  };

  const handleEndChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSession(null);
    setIsCanvasOpen(false);
  };

  return (
    <>
      {session && (
        <FullScreenChat
          session={session}
          onMinimize={handleToggleSession}
          onSend={handleSendMessage}
          onOpenCanvas={handleOpenCanvas}
          isCanvasAvailable={isCanvasAvailable} // This prop is now correctly passed
          isLoading={isLoading}
        >
          {assistantTurn && <AgenticResponse turn={assistantTurn} />}
        </FullScreenChat>
      )}

      <div className="fixed bottom-6 left-0 right-0 z-40 flex items-center justify-center pointer-events-none">
        <div className="flex items-end gap-4 pointer-events-auto">
          {session?.status === 'minimized' && (
            <DockedChatIcon onExpand={handleToggleSession} onEndChat={handleEndChat} />
          )}
          {!session && <NewChatInput onSend={handleStartNewChat} />}
        </div>
      </div>

      <CanvasModal isOpen={isCanvasOpen} onClose={() => setIsCanvasOpen(false)}>
        {canvasData && <VisualCanvas data={canvasData} />}
      </CanvasModal>
    </>
  );
}

