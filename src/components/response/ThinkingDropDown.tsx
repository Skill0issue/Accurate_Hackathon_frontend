import React, { useState } from "react";
import { Brain, ChevronDown, ChevronUp, Code, Zap } from "lucide-react";

// Types
export interface ThinkingStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "processing" | "complete";
  duration?: number;
}

export interface ThinkingData {
  steps: ThinkingStep[];
  pythonCode?: string;
  isComplete: boolean;
}

export interface ThinkingComponentProps {
  thinking: ThinkingData;
  className?: string;
}

// Main Thinking Component
const ThinkingComponent: React.FC<ThinkingComponentProps> = ({ 
  thinking, 
  className = "" 
}) => {
  const [showThinking, setShowThinking] = useState(false);
  // console.log(thinking.steps);
  return (
    <div className={className}>
      {/* Thinking Button */}
      <div className="mb-2">
        <button
          onClick={() => setShowThinking(!showThinking)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
        >
          <Brain className="h-4 w-4" />
          <span>Thinking</span>
          {showThinking ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Thinking Process Dropdown */}
      {showThinking && (
        <div className="mb-3 border border-gray-200 rounded-lg bg-white shadow-sm">
          <div className="p-4 space-y-4">
            {/* Process Steps */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Zap className="h-4 w-4" />
                Process Steps
              </div>
              {thinking.steps.map((step) => (
                <div key={step.id} className="flex items-start gap-3 pl-6">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      step.status === "complete"
                        ? "bg-green-500"
                        : step.status === "processing"
                        ? "bg-blue-500 animate-pulse"
                        : "bg-gray-300"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {step.description}
                    </div>
                    {step.duration && step.status === "complete" && (
                      <div className="text-xs text-gray-500 mt-1">
                        Completed in {step.duration}ms
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Python Code */}
            {thinking.pythonCode && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Code className="h-4 w-4" />
                  Generated Python Code
                </div>
                <div className="bg-gray-900 text-gray-100 p-3 rounded-md text-sm font-mono overflow-x-auto">
                  <pre>{thinking.pythonCode}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThinkingComponent;