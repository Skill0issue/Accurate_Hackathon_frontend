"use client";

import React from "react";

export default function ResponseInsights() {
  return (
    <div className="w-64 p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm">
      <h3 className="font-semibold text-gray-800 mb-2">Key Insights</h3>
      <p className="text-gray-600 mb-3">
        West Coast shows <b>12%</b> dispute rate, while East Coast maintains
        <b> 8%</b> with Midwest at <b>6%</b>.
      </p>

      <div className="space-y-1 text-gray-500 text-xs">
        <p>Data Quality: <span className="text-green-600 font-medium">98%</span></p>
        <p>Last Updated: 2 hours ago</p>
        <p>Trend: <span className="text-blue-600">📈 Improving</span></p>
      </div>
    </div>
  );
}
