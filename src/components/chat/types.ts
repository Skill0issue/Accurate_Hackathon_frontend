import { AssistantTurn } from "./streamTypes";

// --- Base data structures for rich content parts ---
export type TableData = {
  headers: string[];
  rows: (string | number)[][];
};

export type ChartData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
};

// Blueprint for dynamically rendering a registered component
export type DynamicComponentBlueprint = {
  component: string;
  props: Record<string, any>;
};

// --- Discriminated union for all possible message parts ---
export type MessagePart =
  | { type: "markdown"; content: string }
  | { type: "table"; data: TableData }
  | { type: "chart"; data: ChartData }
  | { type: "dynamic_component"; data: DynamicComponentBlueprint }
  // 1. ADDED: A new part type to hold the entire agentic turn data.
  | { type: "agentic_turn"; data: AssistantTurn };

// --- Main message and session objects ---
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

// --- Types for the structured Visual Canvas ---
// (CanvasData and related types remain unchanged)
export interface CanvasData {
    title: string;
    mainContent: MessagePart[];
    keyInsights: any;
    summaryStats: any;
}
