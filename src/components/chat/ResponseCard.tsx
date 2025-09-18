"use client";

import React from "react";
import ResponseHeader from "./ResponseHeader";
import ResponseChart from "./ResponseChart";
import ResponseInsights from "./ResponseInsights";
import ResponseTable from "./ResponseTable";
import ResponseFooter from "./ResponseFooter";

const ResponseCard: React.FC = () => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <ResponseHeader />

      {/* Chart + Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ResponseChart />
        <ResponseInsights />
      </div>

      {/* Table */}
      <ResponseTable />

      {/* Footer actions */}
      <ResponseFooter />
    </div>
  );
};

export default ResponseCard;
