// VisualCanvas.tsx
import React from "react";
import { CanvasData, MessagePart } from "../chat/types";
import ResponseChart from "../response/ResponseChart";
import ResponseTable from "../response/ResponseTable";
import { KeyInsights } from "./KeyInsights";

interface VisualCanvasProps {
  data: CanvasData;
  showTitle?: boolean;
}

export const VisualCanvas: React.FC<VisualCanvasProps> = ({ data, showTitle = true }) => {
  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Always show heading unless explicitly disabled */}
      {showTitle && (
        <h1 className="text-2xl font-bold text-gray-800 mb-6">{data.title}</h1>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Charts & Tables */}
        <div className="lg:col-span-2 space-y-6">
          {data.mainContent.map((part, index) => (
            <div key={index}>{renderContentPart(part)}</div>
          ))}
        </div>

        {/* Right: Key Insights (sidebar) */}
        <div className="lg:col-span-1">
          <KeyInsights data={data.keyInsights} />
        </div>
      </div>
    </div>
  );
};

const renderContentPart = (part: MessagePart) => {
  switch (part.type) {
    case "chart_image":
      return <ResponseChart url={part.url} />;
    case "table":
      return <ResponseTable data={part.data} />;
    default:
      return null;
  }
};
