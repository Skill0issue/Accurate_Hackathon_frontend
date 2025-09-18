"use client";

import React, { useEffect, useRef } from "react";
import MessageBubble, { ChatMessage } from "./MessageBubble";

interface Props {
  messages: ChatMessage[];
}

const MessageList: React.FC<Props> = ({ messages }) => {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col gap-4">
      {messages.map((m) => (
        <MessageBubble key={m.id ?? Math.random()} message={m} />
      ))}
      <div ref={endRef} />
    </div>
  );
};

export default MessageList;
