import React, { useState } from "react";
import { TableData } from "../chat/types";
import { Download, Maximize2, X } from "lucide-react";

interface ResponseTableProps {
  data: TableData;
}

const ResponseTable: React.FC<ResponseTableProps> = ({ data }) => {
  const headers = data?.headers || [];
  const rows = data?.rows || [];

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!headers.length || !rows.length) {
    return (
      <div className="mt-6 p-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-500">
        No table data available.
      </div>
    );
  }

  // Pagination logic
  const totalPages = Math.ceil(rows.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRows = rows.slice(startIndex, startIndex + rowsPerPage);

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleExportCSV = () => {
    const csvContent = [
      headers.join(","), // header row
      ...rows.map((row) =>
        row
          .map((cell) =>
            typeof cell === "string" && cell.includes(",")
              ? `"${cell}"`
              : cell
          )
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "table_export.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Extracted table for reuse (normal + fullscreen)
  const renderTable = () => (
    <div className="overflow-x-auto ">
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
          {paginatedRows.map((row, rowIndex) => (
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

  // Extracted pagination for reuse (normal + fullscreen)
  const renderPagination = () => (
    <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-200 text-black">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">Rows per page:</span>
        <select
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
          className="border  border-gray-300 rounded px-2 py-1 text-sm"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          ← Prev
        </button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          Next →
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Normal Table */}
      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white">
        {/* Toolbar */}
        <div className="flex items-center justify-end px-4 py-2 border-b border-gray-200 bg-gray-50 space-x-2 text-black">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1 px-3 py-1 text-sm border rounded-md hover:bg-gray-100"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            onClick={() => setIsFullscreen(true)}
            className="p-2 border rounded-md hover:bg-gray-100"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>

        {renderTable()}
        {renderPagination()}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-white bg-opacity-70 flex items-center justify-center p-6 text-black">
          <div className="relative bg-white w-full h-full rounded-lg shadow-lg flex flex-col">
            {/* Close Button */}
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Fullscreen Table */}
            <div className="flex-1 overflow-auto">{renderTable()}</div>
            {renderPagination()}
          </div>
        </div>
      )}
    </>
  );
};

export default ResponseTable;
