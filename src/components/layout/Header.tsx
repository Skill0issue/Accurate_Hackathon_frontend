"use client";

import React, { useState } from "react";
import { Menu, Search, Bell, User } from "lucide-react";

export default function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between">
      {/* Left Section - Logo + Sidebar Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100 transition"
        >
          <Menu className="h-5 w-5 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Phi-Star</h1>
      </div>


      {/* Right Section - Notifications + Profile */}
      <div className="flex items-center gap-4" aria-disabled>
        <button className="p-2 rounded-full hover:bg-gray-100 transition relative">
          <Bell className="h-5 w-5 text-gray-700" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <User className="h-5 w-5 text-gray-700" />
            <span className="hidden md:block">John wick</span>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border">
              <ul className="py-2 text-sm text-gray-700">
                <li>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                    Profile
                  </button>
                </li>
                <li>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                    Settings
                  </button>
                </li>
                <li>
                  <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
