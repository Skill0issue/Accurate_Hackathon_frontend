import React from 'react';
import { SummaryStatsData } from '../chat/types';
import { CheckCircle, TrendingUp, Clock } from 'lucide-react';

interface SummaryStatsProps {
  data: SummaryStatsData;
}

/**
 * A compact card to display summary statistics in a simple list format.
 * Ideal for showing metadata like data quality, overall trend, and update timestamp.
 */
export const SummaryStats: React.FC<SummaryStatsProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary Stats</h3>
      <ul className="space-y-3">
        <li className="flex justify-between items-center text-sm">
          <div className="flex items-center text-gray-500">
            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
            <span>{data.dataQuality.label}</span>
          </div>
          <span className="font-medium text-gray-700">{data.dataQuality.value}</span>
        </li>
        <li className="flex justify-between items-center text-sm">
          <div className="flex items-center text-gray-500">
            <TrendingUp className="h-4 w-4 mr-2 text-blue-500" />
            <span>{data.trend.label}</span>
          </div>
          <span className="font-medium text-gray-700">{data.trend.value}</span>
        </li>
        <li className="flex justify-between items-center text-sm">
          <div className="flex items-center text-gray-500">
            <Clock className="h-4 w-4 mr-2 text-gray-400" />
            <span>{data.lastUpdated.label}</span>
          </div>
          <span className="font-medium text-gray-700">{data.lastUpdated.value}</span>
        </li>
      </ul>
    </div>
  );
};
