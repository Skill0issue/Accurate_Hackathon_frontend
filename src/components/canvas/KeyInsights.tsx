import React from 'react';
import { KeyInsightsData } from '../chat/types';
import { ArrowUp, ArrowDown, Minus, Info, CheckCircle, TrendingUp } from 'lucide-react';

interface KeyInsightsProps {
  data: KeyInsightsData;
}

// A map to render trend icons based on the direction
const trendIcons = {
  up: <ArrowUp className="h-5 w-5 text-green-500" />,
  down: <ArrowDown className="h-5 w-5 text-red-500" />,
  neutral: <Minus className="h-5 w-5 text-gray-500" />,
};

/**
 * A card component to display the key insights derived from the data.
 * It includes a textual summary, data quality metric, and a directional trend.
 */
export const KeyInsights: React.FC<KeyInsightsProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center mb-4">
        <Info className="h-6 w-6 text-blue-500 mr-3" />
        <h2 className="text-xl font-semibold text-gray-800">Key Insights</h2>
      </div>
      <p className="text-gray-600 mb-5 leading-relaxed">{data.summary}</p>
      
      <div className="border-t border-gray-200 pt-4 space-y-3">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center text-gray-500">
            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
            <span>Data Quality</span>
          </div>
          <span className="font-medium text-gray-700">{data.dataQuality}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center text-gray-500">
            <TrendingUp className="h-4 w-4 mr-2" />
            <span>Trend</span>
          </div>
          <div className="flex items-center font-medium text-gray-700">
            {trendIcons[data.trend.direction]}
            <span className="ml-1">{data.trend.value}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
