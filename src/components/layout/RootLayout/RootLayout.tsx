"use client";

import Link from "next/link";
import React, { ReactNode } from "react";

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-[#0b0c10] to-[#0f1013] text-gray-200">
      <div className="p-5 px-7 flex items-center justify-between">
        <Link href="/" className="flex items-center font-bold gap-3">
          <img src="/logo.png" alt="App Logo" className="w-8 h-8" />
          <span>My App</span>
        </Link>
        <div className="w-9 h-9 rounded-full bg-[#16324a] flex items-center justify-center text-white">
          G
        </div>
      </div>

      <main className="flex-1 p-6 px-7 overflow-auto">{children}</main>
    </div>
  );
};

export default RootLayout;
