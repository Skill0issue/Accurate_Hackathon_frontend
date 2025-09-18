import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface CanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode; // Accept children to render inside the modal
}

/**
 * A full-screen modal component to display the Visual Canvas.
 * It provides the basic layout and a close button.
 */
export const CanvasModal: React.FC<CanvasModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-gray-50 w-[95%] h-[95%] max-w-7xl rounded-xl shadow-2xl flex flex-col">
        <div className="flex justify-between items-center px-6 py-3 border-b bg-white rounded-t-xl">
          <h1 className="text-lg font-semibold text-gray-800">Visual Canvas</h1>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Close canvas">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
