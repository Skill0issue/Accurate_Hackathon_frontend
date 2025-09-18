"use client";

import React from "react";
import { Layers } from "lucide-react"; // 1. Import the canvas icon

// 2. Add props to handle canvas button visibility and actions
interface ResponseFooterProps {
  isCanvas?: boolean;
  onOpenCanvas?: () => void;
}

export default function ResponseFooter({ isCanvas, onOpenCanvas }: ResponseFooterProps) {
  return (
    <div className="flex items-center justify-start gap-6 mt-2 text-gray-500 text-sm">
      <button className="flex items-center gap-1 hover:text-gray-700">
        🔄 Rethink
      </button>

      {/* 2. Conditionally render the "Open in Canvas" button */}
      {/* {isCanvas && ( */}
      {true && (
        <button 
          onClick={onOpenCanvas} 
          className="flex items-center gap-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <Layers size={16}/> View in Canvas
        </button>
      )}
    </div>
  );
}
