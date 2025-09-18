import React from 'react';
import { TableData } from '../types';

interface TableRendererProps {
  data: TableData;
}

/**
 * Renders a structured data table with headers and rows.
 */
export const TableRenderer: React.FC<TableRendererProps> = ({ data }) => (
  <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
    <table className="w-full text-sm text-left">
      <thead className="bg-gray-50">
        <tr>
          {data.headers.map(header => (
            <th key={header} className="p-2 font-semibold text-gray-600">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, i) => (
          <tr key={i} className="border-t hover:bg-gray-50">
            {row.map((cell, j) => (
              <td key={j} className="p-2 text-gray-700">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
