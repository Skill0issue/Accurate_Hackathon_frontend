"use client";

import React from "react";
import ResponseHeader from "./ResponseHeader";
import ResponseFooter from "./ResponseFooter";

interface Props {
  text: string;
}

const ResponseText: React.FC<Props> = ({ text }) => {
  return (
    <div className="w-full max-w-3xl bg-gray-100 text-gray-800 p-4 rounded-lg shadow-sm mb-3 flex flex-col">
      {/* Header */}
      <ResponseHeader />

      {/* Body text */}
      <div className="my-2 text-gray-800">{text}</div>

      {/* Footer actions */}
      <ResponseFooter />
    </div>
  );
};

export default ResponseText;
