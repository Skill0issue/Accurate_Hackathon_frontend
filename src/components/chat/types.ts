import { AssistantTurn } from "@/components/chat/streamTypes";

// --- Base data structures for rich content parts ---
export type TableData = {
  headers: string[];
  rows: (string | number)[][];
};

// This type can be kept for potential future client-side rendering
export type ChartData = {
  labels: string[];
  datasets: { label: string; data: number[] /* ... */ }[];
};

// --- Discriminated union for all possible message parts ---
export type MessagePart =
  | { type: "markdown"; content: string }
  | { type: "table"; data: TableData }
  | { type: "chart_image"; url: string }
  | { type: "agentic_turn"; data: AssistantTurn };

// --- Main message and session objects ---
export interface ChatMessage {
  role: "user" | "assistant";
  parts: MessagePart[];
  time: string;
  // NEW: A flag to easily check if canvas data is available
  isCanvasAvailable?: boolean;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  status: "expanded" | "minimized";
}

// --- Types for the structured Visual Canvas ---
export type KeyInsightsData = {
  summary: string;
  dataQuality: string;
  trend: { value: string; direction: 'up' | 'down' | 'neutral' };
  lastUpdated: string;
};

export type SummaryStatsData = {
  dataQuality: { label: string; value: string };
  trend: { label: string; value: string };
  lastUpdated: { label: string; value: string };
};

export interface CanvasData {
  title: string;
  mainContent: MessagePart[]; // Holds charts and tables
  keyInsights: KeyInsightsData;
  summaryStats: SummaryStatsData;
}
