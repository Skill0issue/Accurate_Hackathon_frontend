// import { AssistantTurn } from "@/components/chat/streamTypes";

// // --- Base data structures for rich content parts ---
// export type TableData = {
//   headers: string[];
//   rows: (string | number)[][];
// };

// export type ChartData = {
//   labels: string[];
//   datasets: { label: string; data: number[] /* ... */ }[];
// };

// // --- NEW: Type for the raw API response containing canvas data ---
// export interface AssistantCanvasData {
//   iscanvas: boolean;
//   text: string;
//   table?: Record<string, any>[];
//   charts?: string[];
//   insight_text?: string;
// }

// // --- Discriminated union for all possible message parts ---
// export type MessagePart =
//   | { type: "markdown"; content: string }
//   | { type: "table"; data: TableData }
//   | { type: "chart_image"; url: string }
//   | { type: "agentic_turn"; data: AssistantTurn };

// // --- Main message and session objects ---
// export interface ChatMessage {
//   role: "user" | "assistant";
//   parts: MessagePart[];
//   time: string;
// }

// export interface ChatSession {
//   id: string;
//   messages: ChatMessage[];
//   status: "expanded" | "minimized";
// }

// // --- Types for the structured Visual Canvas (data transformed for rendering) ---
// export type KeyInsightsData = {
//   summary: string;
//   dataQuality?: string;
//   trend?: { value: string; direction: 'up' | 'down' | 'neutral' };
//   lastUpdated?: string;
// };

// export type SummaryStatsData = {
//   dataQuality: { label: string; value: string };
//   trend: { label: string; value: string };
//   lastUpdated: { label: string; value: string };
// };

// export interface CanvasData {
//   title: string;
//   mainContent: MessagePart[]; 
//   keyInsights: KeyInsightsData;
//   summaryStats?: SummaryStatsData;
// }

import { AssistantTurn } from "../streamTypes";

export type TableData = {
  headers: string[];
  rows: (string | number)[][];
};

export type ChartData = {
  labels: string[];
  datasets: { label: string; data: number[] }[];
};

export interface AssistantCanvasData {
  iscanvas?: boolean; // made optional
  text?: string;
  canvas_title?: string;
  table?: Record<string, any>[];
  charts?: string[];
  insight_text?: string;
}

export type MessagePart =
  | { type: "markdown"; content: string }
  | { type: "table"; data: TableData }
  | { type: "chart_image"; url: string }
  | { type: "agentic_turn"; data: AssistantTurn };

export interface ChatMessage {
  role: "user" | "assistant";
  parts: MessagePart[];
  time: string;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  status: "expanded" | "minimized";
}

export type KeyInsightsData = {
  summary: string;
  dataQuality?: string;
  trend?: { value: string; direction: "up" | "down" | "neutral" };
  lastUpdated?: string;
};

export type SummaryStatsData = {
  dataQuality: { label: string; value: string };
  trend: { label: string; value: string };
  lastUpdated: { label: string; value: string };
};

export interface CanvasData {
  title: string;
  mainContent: MessagePart[];
  keyInsights: KeyInsightsData;
  summaryStats?: SummaryStatsData;
}
