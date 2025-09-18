"use client";

import { Rnd } from "react-rnd";

function FloatingChat({ onClose }: { onClose: () => void }) {
  return (
    <Rnd
      default={{
        x: window.innerWidth - 450, // initial right alignment
        y: window.innerHeight - 500, // initial bottom alignment
        width: 384, // w-96
        height: 384, // h-96
      }}
      minWidth={300}
      minHeight={350}
      bounds="window"
      dragHandleClassName="chat-header" // only drag from header
      className="fixed bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden z-50 border"
    >
      {/* Header */}
      <div className="chat-header flex justify-between items-center p-3 bg-gray-900 text-white cursor-move">
        <span className="font-semibold">AIRA Assistant</span>
        <button onClick={onClose}>✖</button>
      </div>

      {/* Messages placeholder */}
      <div className="flex-1 p-4 overflow-y-auto text-gray-800">
        <p className="text-sm text-gray-500">
          Your conversation with AIRA will appear here...
        </p>
      </div>

      {/* Input */}
      <div className="p-3 border-t flex gap-2">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <button className="bg-gray-900 text-white px-4 py-2 rounded-lg">
          Send
        </button>
      </div>
    </Rnd>
  );
}

export default FloatingChat;
