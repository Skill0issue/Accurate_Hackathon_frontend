"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

function Sidebar({
  isOpen,
  toggleSidebar,
}: {
  isOpen: boolean;
  toggleSidebar: () => void;
}) {
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  return (
    <div
      className={`h-screen ${
        isOpen ? "w-56" : "w-16"
      } bg-white text-gray-800 flex flex-col p-4 border-r border-gray-200 transition-all duration-300`}
    >
      {/* Dashboard dropdown */}
      <div className="mb-2">
        <button
          onClick={() => setIsDashboardOpen(!isDashboardOpen)}
          className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-200 transition w-full"
        >
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5" />
            {isOpen && <span>Dashboard</span>}
          </div>
          {isOpen &&
            (isDashboardOpen ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            ))}
        </button>

        {isDashboardOpen && isOpen && (
          <div className="ml-6 mt-2 flex flex-col gap-2">
            <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200 transition">
              <ShoppingBag className="h-5 w-5" />
              <span>Orders</span>
            </button>
            <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200 transition">
              <Package className="h-5 w-5" />
              <span>Packages</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;

