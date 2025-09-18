import React from "react";
import ResponseHeader from "./ResponseHeader";
import ResponseFooter from "./ResponseFooter";
import { MessagePart } from "../chat/types";
import FormattedResponse from "./FormattedResponse";

interface Props {
  parts: MessagePart[];
  onOpenCanvas: () => void;
}

const ResponseCard: React.FC<Props> = ({ parts, onOpenCanvas }) => {
  const isCanvasAvailable = parts.some(
    (part) => part.type === "table" || part.type === "chart_image"
  );
  return (
    <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-4xl mx-auto space-y-6">
      <ResponseHeader text="Summary" />
      <FormattedResponse content={parts} />
      <ResponseFooter isCanvas={isCanvasAvailable} onOpenCanvas={onOpenCanvas} />
    </div>
  );
};

export default ResponseCard;
