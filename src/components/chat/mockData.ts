// @/components/chat/mockData.ts

import { ChatMessage, CanvasData } from "./types";

const getCurrentTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

/**
 * A generic, simple response from the assistant.
 */
export const MOCK_ASSISTANT_RESPONSE: ChatMessage = {
  role: "assistant",
  time: getCurrentTime(),
  parts: [{ type: "markdown", content: "Thank you for the message. How can I assist you further?" }],
};

/**
 * The initial message displayed when the chat assistant opens.
 */
export const WELCOME_MESSAGE: ChatMessage = {
  role: "assistant",
  time: getCurrentTime(),
  parts: [
    {
      type: "markdown",
      content:
        "Welcome to your AI Assistant! Feel free to ask me anything. \n\nTry asking: **'Show me the quarterly sales report'** to see a response with visualizations.",
    },
  ],
};

/**
 * A mock response that includes multiple parts (markdown, chart, table)
 * to simulate a rich data response from a backend.
 */
export const MOCK_VISUALIZATION_RESPONSE: ChatMessage = {
  role: "assistant",
  time: getCurrentTime(),
  parts: [
    {
      type: "markdown",
      content:
        "Of course! Here is the sales report for Q1. I have prepared a chart and a data table for you. \n\nYou can view the full details in the **Canvas Mode**.",
    },
    {
      type: "chart",
      data: {
        labels: ["January", "February", "March", "April"],
        datasets: [
          {
            label: "Revenue (in USD)",
            data: [150000, 185000, 220000, 195000],
            backgroundColor: [
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 99, 132, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(255, 206, 86, 0.6)",
            ],
            borderColor: [
              "rgba(54, 162, 235, 1)",
              "rgba(255, 99, 132, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(255, 206, 86, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
    },
    {
      type: "table",
      data: {
        headers: ["Month", "Revenue", "Units Sold", "YoY Growth"],
        rows: [
          ["January", "150,000", 450, "12%"],
          ["February", "185,000", 510, "15%"],
          ["March", "220,000", 600, "18%"],
          ["April", "195,000", 540, "14%"],
        ],
      },
    },
  ],
};

/**
 * A mock response that includes a dynamically rendered component.
 */
export const MOCK_DYNAMIC_COMPONENT_RESPONSE: ChatMessage = {
  role: "assistant",
  time: getCurrentTime(),
  parts: [
    {
      type: "markdown",
      content: "I've analyzed the recent sales data and created a summary card for you."
    },
    {
      // This is the JSON blueprint our AI would generate
      type: "dynamic_component",
      data: {
        component: "SalesCard", // This string MUST match a key in the component registry
        props: {
          title: "Total Revenue",
          value: "$405,302",
          change: "+12.5%",
          period: "month"
        }
      }
    },
    {
      type: "markdown",
      content: "Let me know if you need a more detailed breakdown!"
    }
  ]
};

/**
 * A mock data structure for the full-screen Visual Canvas.
 */
export const MOCK_CANVAS_DATA: CanvasData = {
  title: "Daily Turnaround Trend",
  keyInsights: {
    summary: "West Coast shows a 12% dispute rate, while East Coast maintains 8% and Midwest is at 6%.",
    dataQuality: "98%",
    trend: { value: "12% Increase", direction: 'up' },
    lastUpdated: "2 hours ago",
  },
  summaryStats: {
    dataQuality: { label: "Data Quality", value: "98%" },
    trend: { label: "Trend", value: "12%" },
    lastUpdated: { label: "Updated", value: "2h ago" },
  },
  mainContent: [
    {
      type: "chart",
      data: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [{ label: 'Avg. Turnaround (Days)', data: [3.1, 2.8, 3.5, 2.9], backgroundColor: 'rgba(59, 130, 246, 0.2)', borderColor: 'rgba(59, 130, 246, 1)', borderWidth: 1 }],
      },
    },
    {
      type: "table",
      data: {
        headers: ["Region", "Total Cases", "Disputes", "Rate"],
        rows: [
          ["West Coast", 2456, 295, "12%"],
          ["East Coast", 3123, 250, "8%"],
          ["Midwest", 1789, 107, "6%"],
          ["Southwest", 1345, 121, "9%"],
        ],
      },
    },
  ],
};
