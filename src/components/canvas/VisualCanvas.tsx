import React from 'react';
import { CanvasData, MessagePart } from '../chat/types';
import ResponseChart from '../response/ResponseChart';
import ResponseTable from '../response/ResponseTable';
import { KeyInsights } from './KeyInsights';
import { SummaryStats } from './SummaryStats';

interface VisualCanvasProps {
  data: CanvasData;
} 

/**
 * The main component for the visual canvas, which lays out all the
 * key insights, summary stats, and the main content like charts and tables.
 */
export const VisualCanvas: React.FC<VisualCanvasProps> = ({ data }) => {
  return (
    <div className="p-2">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">{data.title}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {data.mainContent.map((part, index) => (
            <div key={index}>
              {renderContentPart(part)}
            </div>
          ))}
        </div>

        {/* Sidebar with Insights and Stats */}
        <div className="space-y-6">
          <KeyInsights data={data.keyInsights} />
          <SummaryStats data={data.summaryStats} />
        </div>
      </div>
    </div>
  );
};

// Helper to render different message part types
const renderContentPart = (part: MessagePart) => {
  switch (part.type) {
    case 'chart_image':
      return <ResponseChart url={part.url} />;
    case 'table':
      return <ResponseTable data={part.data} />;
    default:
      return null;
  }
};
