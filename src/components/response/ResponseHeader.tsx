"use client";
import React from "react";

// The component now accepts the header text as a prop
interface Props {
  text?: string;
}

const ResponseHeader: React.FC<Props> = ({ text }) => {
  // If no text is provided, the component renders nothing.
  if (!text) {
    return null;
  }

  return (
    <div className="text-gray-700 font-medium">
      📊 {text}
    </div>
  );
};

export default ResponseHeader;
