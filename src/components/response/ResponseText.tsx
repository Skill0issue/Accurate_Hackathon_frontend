"use client";

import React from "react";
import ResponseHeader from "./ResponseHeader";
import ResponseFooter from "./ResponseFooter";
import FormattedResponse from "./FormattedResponse";

// 1. Add the new props to the interface
interface Props {
  text: string;
  header?: string;
  isCanvas?: boolean;
  onOpenCanvas?: () => void;
}

const ResponseText: React.FC<Props> = ({ header, text, isCanvas, onOpenCanvas }) => {
  return (
    <div className="w-full max-w-3xl bg-white text-gray-800 p-4 rounded-2xl shadow-sm border border-gray-300 mb-3 flex flex-col">
      <ResponseHeader text={header} />
      <div className="my-3 border-t border-gray-200" />
      <div className="text-sm text-gray-700">
        <FormattedResponse content={text} />
      </div>
      <div className="my-3 border-t border-gray-200" />
      {/* 2. Pass the props down to the ResponseFooter */}
      {/* <ResponseFooter isCanvas={isCanvas} onOpenCanvas={onOpenCanvas} /> */}
      <ResponseFooter
        isCanvas={isCanvas && !!text}  // ensure text exists too
        onOpenCanvas={onOpenCanvas}
      />
    </div>
  );
};

export default ResponseText;

