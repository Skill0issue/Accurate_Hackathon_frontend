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
import { AgenticResponse } from "./streaming/AgenticResponse";

/**
 * Transforms raw canvas data from backend into structured CanvasData
 */
const transformToCanvasData = (data: AssistantCanvasData | null): CanvasData | null => {
  if (!data) return null;

  const mainContent: MessagePart[] = [];

  const backendBase = (typeof process !== "undefined" && process.env.NEXT_PUBLIC_FLASK_BACKEND_URL) || "";

  const resolveChartUrl = (rawUrl: string) => {
    if (!rawUrl) return rawUrl;
    if (rawUrl.startsWith("http") || rawUrl.startsWith("data:image")) return rawUrl;
    const looksLikePath = rawUrl.startsWith("/") || rawUrl.includes("/static/");
    if (looksLikePath) {
      const base = backendBase || (typeof window !== "undefined" ? window.location.origin : "");
      return base ? `${base.replace(/\/$/, "")}/${rawUrl.replace(/^\//, "")}` : rawUrl;
    }
    return rawUrl;
  };

  // Handle charts
  if (data.charts?.length) {
    data.charts.forEach((url) => {
      const resolved = resolveChartUrl(url);
      mainContent.push({ type: "chart_image", url: resolved });
    });
  }

  // Handle tables
  if (data.table?.length) {
    const headers = Object.keys(data.table[0]);
    const rows = data.table.map((item) => headers.map((header) => item[header]));
    mainContent.push({ type: "table", data: { headers, rows } });
  }

  if (mainContent.length === 0) return null;

  return {
    // ✅ Title comes only from canvas_title
    title: (data as any).canvas_title || "Data Visualization",

    mainContent,

    // ✅ Key Insights summary comes only from insight_text (no duplication)
    keyInsights: {
      summary: data.insight_text || "Here are the key insights from your data.",
      dataQuality: (data as any).data_quality || undefined,
      trend: (data as any).trend || undefined,
    },
  };
};

export default function ChatExperience() {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [rawCanvasData, setRawCanvasData] = useState<AssistantCanvasData | null>(null);
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assistantTurn, setAssistantTurn] = useState<AssistantTurn | null>(null);
  const [isCanvasAvailable, setIsCanvasAvailable] = useState(false);

  const streamConnection = useRef<(() => void) | null>(null);

  // Debug incoming canvas payloads
  useEffect(() => {
    if (rawCanvasData) {
      console.log("[ChatExperience] rawCanvasData received:", rawCanvasData);
    }
  }, [rawCanvasData]);

  // Handle assistant streaming updates
  useEffect(() => {
    if (!assistantTurn) return;

    if (assistantTurn.canvasData) {
      setRawCanvasData(assistantTurn.canvasData as AssistantCanvasData);
      setIsCanvasAvailable(true);
      console.log("[ChatExperience] assistantTurn.canvasData set from streaming update");
      return;
    }

    const flag = (assistantTurn as any).canvasFlag;
    if (flag) {
      setIsCanvasAvailable(true);
      console.log("[ChatExperience] assistantTurn.canvasFlag true (waiting for final_payload)");
    }

    if ((assistantTurn as any).assets) {
      console.log("[ChatExperience] assistantTurn.assets:", (assistantTurn as any).assets);
    }
  }, [assistantTurn]);

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
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setSession({ ...currentSession, messages: [...currentSession.messages, userMessage] });
    setIsLoading(true);
    setError(null);
    setIsCanvasAvailable(false);
    setRawCanvasData(null);

    streamConnection.current = streamAgenticResponse(text, {
      onUpdate: (turn) => setAssistantTurn(turn),
      onComplete: (turn) => {
        setIsLoading(false);
        setAssistantTurn(null);
        streamConnection.current = null;

        console.log("Canvas data from backend:", turn.canvasData);

        const finalMessage: ChatMessage = {
          role: "assistant",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          parts: [{ type: "agentic_turn", data: turn }],
        };

        if (turn.canvasData) {
          setRawCanvasData(turn.canvasData);
          setIsCanvasAvailable(true);
        }

        setSession((s) => ({
          ...s!,
          messages: [...s!.messages, finalMessage],
        }));
      },
      onError: (err) => {
        setIsLoading(false);
        setError(err.message);
        setAssistantTurn(null);
        streamConnection.current = null;
      },
    });
  };

  const handleOpenCanvas = () => {
    setIsCanvasOpen(true);
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

  const canvasToRender = transformToCanvasData(rawCanvasData);

  return (
    <>
      {session && (
        <FullScreenChat
          session={session}
          onMinimize={handleToggleSession}
          onSend={handleSendMessage}
          onOpenCanvas={handleOpenCanvas}
          isCanvasAvailable={isCanvasAvailable}
          isLoading={isLoading}
        >
          {assistantTurn && <AgenticResponse turn={assistantTurn} onOpenCanvas={() => setIsCanvasOpen(true)} />}
        </FullScreenChat>
      )}

      <div className="fixed bottom-6 left-0 right-0 z-40 flex items-center justify-center pointer-events-none">
        <div className="flex items-end gap-4 pointer-events-auto">
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
