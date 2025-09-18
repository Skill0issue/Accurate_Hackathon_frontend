"use client";

import React from "react";

export default function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        {/* Logo */}
        <div className="inline-block mb-4 text-2xl font-bold text-blue-600">
          logo
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl font-bold text-gray-800">
          Accurate Chat Dashboard
        </h1>

        {/* Subheading */}
        <p className="mt-2 text-md text-gray-500">
          The Data You Need. When You Need It.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <a
            href="/login"
            className="w-full max-w-xs px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
          >
            Get Started
          </a>
          <a
            href="/dashboard"
            className="w-full max-w-xs px-6 py-3 font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition"
          >
            View Demo
          </a>
        </div>
      </div>
    </div>
  );
}
