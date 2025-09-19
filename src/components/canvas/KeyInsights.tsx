// KeyInsights.tsx
import React from "react";
import { KeyInsightsData } from "../chat/types";
import { ArrowUp, ArrowDown, Minus, Info, CheckCircle, TrendingUp } from "lucide-react";

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
    if (rawSummary == null) return [];

    // If it's already an array of lines, normalize directly
    if (Array.isArray(rawSummary)) {
      return rawSummary.map((l) => String(l).trim()).filter(Boolean);
    }

    // Coerce objects and non-string values to string safely
    let summary = typeof rawSummary === 'string' ? rawSummary : String(rawSummary);

    // If summary is empty after coercion, return empty list
    if (!summary) return [];

    const replaced = summary
      .replace(/\s*\*\s*/g, "\n")
      .replace(/\u2022/g, "\n")
      .replace(/\s*-\s*/g, "\n");
    return replaced
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
  };

  const bullets = normalizeToBullets(data.summary || "");

  return (
    <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center mb-4">
        <Info className="h-5 w-5 text-blue-500 mr-2" />
        <h2 className="text-lg font-semibold text-gray-800">Key Insights</h2>
      </div>

      {bullets.length > 1 ? (
        <ul className="list-disc list-inside text-gray-700 mb-5 space-y-2">
          {bullets.map((line, i) => (
            <li key={i} className="leading-relaxed">{line}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-700 mb-5 leading-relaxed">{data.summary}</p>
      )}

      {(data.dataQuality || data.trend) && (
        <div className="border-t border-gray-200 pt-4 space-y-3">
          {data.dataQuality && (
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center text-gray-500">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                <span>Data Quality</span>
              </div>
              <span className="font-semibold text-green-600">{data.dataQuality}</span>
            </div>
          )}
          {data.trend && (
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center text-gray-500">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span>Trend</span>
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