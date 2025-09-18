// @/components/chat/componentRegistry.tsx

import React from "react";
import { Bar } from 'react-chartjs-2';
import { ChartData } from "@/components/chat/types";

// --- Define your library of safe, dynamic components ---

// Example 1: A special card for displaying key sales metrics
const SalesCard = ({ title, value, change, period }: { title: string, value: string, change: string, period: string }) => (
  <div className="bg-white border rounded-lg p-4 my-2 shadow-sm text-gray-800">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-3xl font-bold my-1">{value}</p>
    <div className="flex items-center text-sm">
      <span className={`font-semibold ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{change}</span>
      <span className="text-gray-500 ml-1">vs. last {period}</span>
    </div>
  </div>
);

// Example 2: A component that combines a chart with a summary
const TrendChart = ({ title, summary, chartData }: { title: string, summary: string, chartData: ChartData }) => (
    <div className="bg-white p-4 rounded-lg border shadow-sm my-2 w-full text-gray-800">
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{summary}</p>
        <div className="h-64">
            <Bar options={{ responsive: true, maintainAspectRatio: false }} data={chartData} />
        </div>
    </div>
);

// --- Create the Component Registry ---
// This maps the string names the AI will use to the actual React components.
export const componentRegistry: Record<string, React.ComponentType<any>> = {
  SalesCard,
  TrendChart,
  // Add any other dynamic components you want your AI to be able to use
};