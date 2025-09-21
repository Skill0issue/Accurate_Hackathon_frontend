import React from "react";
import ResponseHeader from "./ResponseHeader";
import ResponseFooter from "./ResponseFooter";
import ResponseText from "./ResponseText";
import { ChatMessage } from "../chat/types";
import { AgenticResponse } from "../chat/streaming/AgenticResponse";

interface Props {
  message: ChatMessage;
  onOpenCanvas: () => void;
  isCanvasAvailable: boolean;
}




const ResponseMessage: React.FC<Props> = ({
  message,
  onOpenCanvas,
  isCanvasAvailable,
}) => {
  return (
    <div className="w-full">
      {message.parts.map((part, index) => {
        switch (part.type) {
          case "markdown":
            return (
              <div
                key={index}
                className="w-full max-w-3xl bg-white text-gray-800 p-4 rounded-2xl shadow-sm border border-gray-300 mb-3 flex flex-col"
              >
                <div className="text-sm text-gray-700">{part.content}</div>
                <div className="my-3 border-t border-gray-200" />
                {/* <ResponseFooter
                  isCanvas={isCanvasAvailable}
                  onOpenCanvas={onOpenCanvas}
                /> */}
              </div>
            );
          case "agentic_turn":
            return <AgenticResponse key={index} turn={part.data} onOpenCanvas={onOpenCanvas}/>;
          default:
            return null;
        }
      })}
    </div>
  );
};

export default ResponseMessage;
