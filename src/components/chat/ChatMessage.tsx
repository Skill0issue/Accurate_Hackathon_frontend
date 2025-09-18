// ChatMessage.tsx

import { ChatMessage as ChatMsg } from "@/components/chat/types";
import MarkdownRenderer from "./renderers/MarkdownRenderer";
import TableRenderer from "./renderers/TableRenderer";
import ChartRenderer from "./renderers/ChartRenderer";
import DynamicComponentRenderer from "./renderers/DynamicComponentRenderer";

export default function ChatMessage({ message }: { message: ChatMsg }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex items-start gap-2.5 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {/* Optional: Add an avatar for the assistant */}
      {!isUser && (
        <div className="w-8 h-8 bg-gray-700 text-white text-sm rounded-full flex items-center justify-center flex-shrink-0">
          AI
        </div>
      )}

      <div
        className={`flex flex-col gap-2 max-w-lg ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        {message.parts.map((part, i) => {
          // This switch statement renders the correct component for each message part
          switch (part.type) {
            case "markdown":
              return (
                <MarkdownRenderer
                  key={i}
                  content={part.content}
                  isUser={isUser}
                />
              );
            case "table":
              return <TableRenderer key={i} data={part.data} />;
            case "chart":
              return <ChartRenderer key={i} data={part.data} />;
            case "dynamic_component":
              return <DynamicComponentRenderer key={i} data={part.data} />;
            default:
              return null; // Safely ignore any unknown part types
          }
        })}
      </div>
    </div>
  );
}