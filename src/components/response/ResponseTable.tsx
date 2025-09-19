import React from 'react';
import { TableData } from '../chat/types';

interface ResponseTableProps {
  data: TableData;
}

const ResponseTable: React.FC<ResponseTableProps> = ({ data }) => {
  const headers = data?.headers || [];
  const rows = data?.rows || [];

  if (!headers.length || !rows.length) {
    return (
      <div className="mt-6 p-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-500">
        No table data available.
      </div>
    );
  }

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResponseTable;
