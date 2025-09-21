import React from 'react';
import { MessageSquare, X } from 'lucide-react';

interface DockedChatIconProps {
  onExpand: () => void;
  onEndChat: (e: React.MouseEvent) => void;
}

/**
 * A floating icon representing a minimized chat session.
 * Allows users to expand the chat or end the session completely.
 */
export const DockedChatIcon: React.FC<DockedChatIconProps> = ({ onExpand, onEndChat }) => (
  <div className="relative">
    <button
      onClick={onExpand}
      className="w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-transform hover:scale-110"
      aria-label="Expand chat"
    >
      <MessageSquare size={32} />
    </button>
    <button
      onClick={onEndChat}
      className="absolute -top-1 -right-1 w-6 h-6 bg-gray-700 text-white rounded-full flex items-center justify-center text-xs border-2 border-white hover:bg-red-500"
      aria-label="End chat"
    >
      <X size={14} />
    </button>
  </div>
);
