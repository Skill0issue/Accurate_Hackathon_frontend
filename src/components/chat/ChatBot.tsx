"use client";
import React, { useState, useEffect, useRef } from "react";
import { FullScreenChat } from "./FullScreenChat";
import { NewChatInput } from "./NewChatInput";
import { DockedChatIcon } from "./DockedChatIcon";
import { CanvasModal } from "./CanvasModal";
import { VisualCanvas } from "../canvas/VisualCanvas";
import { ChatMessage, AssistantCanvasData, CanvasData, ChatSession, MessagePart } from "./types";
import { AssistantTurn } from "./streamTypes";
import { streamAgenticResponse } from "@/components/services/chatService";

/**
 * Transforms raw canvas data from backend into structured CanvasData
 */
const transformToCanvasData = (data: AssistantCanvasData | null): CanvasData | null => {
  if (!data) return null;

  const mainContent: MessagePart[] = [];

  const backendBase = (typeof process !== "undefined" && (process.env.NEXT_PUBLIC_FLASK_BACKEND_URL)) || "";

  const resolveChartUrl = (rawUrl: string) => {
    if (!rawUrl) return rawUrl;
    if (rawUrl.startsWith("http") || rawUrl.startsWith("data:image")) return rawUrl;
    const looksLikePath = rawUrl.startsWith("/") || rawUrl.includes("/static/plots/");
    if (looksLikePath) {
      const base = backendBase || (typeof window !== "undefined" ? window.location.origin : "");
      return base ? `${base.replace(/\/$/, "")}/${rawUrl.replace(/^\//, "")}` : rawUrl;
    }
    return rawUrl;
  };

  if (data.charts?.length) {
    data.charts.forEach((url) => {
      const resolved = resolveChartUrl(url);
      mainContent.push({ type: "chart_image", url: resolved });
    });
  }

  if (data.table?.length) {
    const headers = Object.keys(data.table[0]);
    const rows = data.table.map((item) => headers.map((header) => item[header]));
    mainContent.push({ type: "table", data: { headers, rows } });
  }

  if (mainContent.length === 0) return null;

  return {
    title: (data as any).canvas_title || "Data Visualization",
    mainContent,
    keyInsights: {
      summary: data.insight_text || "Here are the key insights from your data.",
      dataQuality: (data as any).data_quality || undefined,
      trend: (data as any).trend || undefined,
    },
  };
};

export default function ChatExperience() {
  const [session, setSession] = useState<ChatSession | null>(null);
  // MODIFIED: This state now holds the canvas data for the *currently selected* message, not just the live one.
  const [activeCanvasData, setActiveCanvasData] = useState<AssistantCanvasData | null>(null);
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  // MODIFIED: This function now sets the canvas data to be viewed and opens the modal.
  const handleOpenCanvas = (canvasData: AssistantCanvasData) => {
    setActiveCanvasData(canvasData);
    setIsCanvasOpen(true);
  };

  const handleSendMessage = async (text: string, currentSession = session) => {
    if (!text.trim() || !currentSession || isLoading) return;
    if (streamConnection.current) streamConnection.current();

    const userMessage: ChatMessage = {
      role: "user",
      parts: [{ type: "markdown", content: text }],
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // MODIFIED: Create a placeholder for the assistant's rich response.
    const assistantMessagePlaceholder: ChatMessage = {
      role: "assistant",
      time: "...",
      parts: [{ type: "agentic_turn", data: { agentSteps: [], isComplete: false, plan: "Thinking..." } }]
    };

    setSession({
      ...currentSession,
      messages: [...currentSession.messages, userMessage, assistantMessagePlaceholder]
    });
    
    setIsLoading(true);
    setError(null);
    setIsCanvasAvailable(false); // Reset canvas availability for the new message

    streamConnection.current = streamAgenticResponse(text,
      {
      onUpdate: (turn) => {
        setSession(s => {
          if (!s) return s;
          const newMessages = [...s.messages];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage?.role === 'assistant') {
            lastMessage.parts = [{ type: 'agentic_turn', data: turn }];
            // The canvas is available if the streaming turn indicates it
            if (turn.canvasData || (turn as any).canvasFlag) {
              setIsCanvasAvailable(true);
            }
          }
          return { ...s, messages: newMessages };
        });
      },
      onComplete: (turn) => {
        setIsLoading(false);
        streamConnection.current = null;
        
        // MODIFIED: Finalize the last message by saving the complete turn data.
        setSession(s => {
          if (!s) return s;
          const newMessages = [...s.messages];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage?.role === 'assistant') {
            lastMessage.parts = [{ type: "agentic_turn", data: { ...turn, isComplete: true } }];
            lastMessage.time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          }
          return { ...s, messages: newMessages };
        });
      },
      onError: (err) => {
        setIsLoading(false);
        setError(err.message);
        streamConnection.current = null;
        
        setSession(s => {
          if (!s) return s;
          const newMessages = [...s.messages];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage?.role === 'assistant') {
             lastMessage.parts = [{ type: "markdown", content: `An error occurred: ${err.message}` }];
             lastMessage.time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          }
          return { ...s, messages: newMessages };
        });
      },
    });
  };

  const handleToggleSession = () => {
    if (!session) return;
    const newStatus = session.status === "expanded" ? "minimized" : "expanded";
    setSession({ ...session, status: newStatus });
  };

  const handleEndChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSession(null);
    setIsCanvasOpen(false);
  };

  const canvasToRender = transformToCanvasData(activeCanvasData);

  return (
    <>
      {session && (
        <FullScreenChat
          session={session}
          onMinimize={handleToggleSession}
          onSend={handleSendMessage}
          onOpenCanvas={handleOpenCanvas}
          isCanvasAvailable={isCanvasAvailable} // This might now be redundant or need rethinking
          isLoading={isLoading}
        >
          {/* No children needed, MessageArea handles everything */}
        </FullScreenChat>
      )}

      <div className="fixed bottom-1 p-4 w-full right-0 z-40 flex items-center justify-center pointer-events-none backdrop-blur-xs">
        <div className="flex w-1/3 mx-auto justify-center items-center gap-4 pointer-events-auto">
          {session?.status === "minimized" && (
            <DockedChatIcon onExpand={handleToggleSession} onEndChat={handleEndChat} />
          )}
          {!session && <NewChatInput onSend={handleStartNewChat} />}
        </div>
      </div>

      <CanvasModal isOpen={isCanvasOpen} onClose={() => setIsCanvasOpen(false)}>
        {canvasToRender ? (
          <VisualCanvas data={canvasToRender} showTitle={true} />
        ) : (
          <div className="p-4 text-gray-500">No canvas data available.</div>
        )}
      </CanvasModal>
    </>
  );
}

