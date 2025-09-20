// KeyInsights.tsx
import React from "react";
import { KeyInsightsData } from "../chat/types";
import {
  ArrowUp,
  ArrowDown,
  Minus,
  Info,
  CheckCircle,
  TrendingUp,
} from "lucide-react";

interface KeyInsightsProps {
  data: KeyInsightsData;
}

const trendIcons = {
  up: <ArrowUp className="h-4 w-4 text-green-500" />,
  down: <ArrowDown className="h-4 w-4 text-red-500" />,
  neutral: <Minus className="h-4 w-4 text-gray-400" />,
};

export const KeyInsights: React.FC<KeyInsightsProps> = ({ data }) => {
const normalizeToBullets = (rawSummary: any) => {
  if (!rawSummary) return [];

  if (Array.isArray(rawSummary)) return rawSummary.map(String).filter(Boolean);

  let summary = typeof rawSummary === "string" ? rawSummary : String(rawSummary);
  if (!summary) return [];

  // Split only on real newlines
  return summary
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);
};


  const bullets = normalizeToBullets(data.summary || "");

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-300">
      {/* Header */}
      <div className="flex items-center mb-4">
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-50 mr-2">
          <Info className="h-4 w-4 text-blue-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800">Key Insights</h2>
      </div>

      {/* Summary */}
      {bullets.length > 1 ? (
        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          {bullets.map((line, i) => (
            <li key={i} className="leading-relaxed">
              {line}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-700 mb-6 leading-relaxed">{data.summary}</p>
      )}

      {/* Additional Info */}
      {(data.dataQuality || data.trend) && (
        <div className="border-t border-gray-200 pt-4 space-y-4">
          {data.dataQuality && (
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center text-gray-600">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                <span className="font-medium">Data Quality</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-green-50 text-green-700 text-xs font-semibold">
                {data.dataQuality}
              </span>
            </div>
          )}
          {data.trend && (
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center text-gray-600">
                <TrendingUp className="h-4 w-4 mr-2 text-indigo-500" />
                <span className="font-medium">Trend</span>
              </div>
              <div className="flex items-center font-semibold text-gray-700">
                {trendIcons[data.trend.direction]}
                <span className="ml-1">{data.trend.value}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
