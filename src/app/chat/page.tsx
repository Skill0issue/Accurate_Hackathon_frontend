"use client";

import React, { useState } from "react";
import MessageList from "../../components/chat/MessageList";
import MessageInput from "../../components/chat/MessageInput";
import type { ChatMessage } from "../../components/chat/MessageBubble";
import { Plus, UserCircle } from "lucide-react";
import RootLayout from "../layout";

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatTitle, setChatTitle] = useState("Chat");

  // handle sending new message
  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const newMsg: ChatMessage = {
      id: `${Date.now()}`,
      role: "user",
      parts: [{ text }],
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  // quick action handler
  const handleQuickAction = (text: string) => {
    handleSend(text);
  };

  return (
      <div className="min-h-screen flex flex-col bg-white text-gray-800">
        {/* ===== HEADER ===== */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="text-blue-600 font-bold text-lg">logo</div>
            <button
              className="ml-4 flex items-center space-x-2 px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-100 transition"
              onClick={() => {
                setMessages([]);
                setChatTitle("Chat");
              }}
            >
              <Plus className="h-4 w-4" />
              <span>New Chat</span>
            </button>
          </div>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <UserCircle className="h-7 w-7 text-gray-500" />
          </button>
        </div>

        {/* ===== LANDING PAGE (if no messages) ===== */}
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
            <div className="mb-6">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4h9M4 12h16M4 4h4v4H4V4zm0 12h4v4H4v-4z"
                    />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl font-semibold mb-2">Welcome to Accurate Chat</h1>
              <p className="text-gray-500 max-w-xl mx-auto">
                Ask me anything about your data, metrics, or reports. I can help you
                understand trends, create visualizations, and answer questions.
              </p>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-2 gap-4 max-w-2xl">
              <button
                onClick={() => handleQuickAction("Show me order turnaround details.")}
                className="p-4 border rounded-lg hover:shadow transition cursor-pointer text-left bg-white"
              >
                <div className="text-blue-500 mb-2">⏱</div>
                <h3 className="font-medium">Order Turnaround</h3>
                <p className="text-sm text-gray-500">
                  Analyze delivery performance and timing
                </p>
              </button>

              <button
                onClick={() => handleQuickAction("Give me background check completion rates.")}
                className="p-4 border rounded-lg hover:shadow transition cursor-pointer text-left bg-white"
              >
                <div className="text-blue-500 mb-2">🛡</div>
                <h3 className="font-medium">Background Checks</h3>
                <p className="text-sm text-gray-500">
                  View completion rates by package type
                </p>
              </button>

              <button
                onClick={() => handleQuickAction("Show geographic dispute patterns.")}
                className="p-4 border rounded-lg hover:shadow transition cursor-pointer text-left bg-white"
              >
                <div className="text-blue-500 mb-2">📍</div>
                <h3 className="font-medium">Geographic Disputes</h3>
                <p className="text-sm text-gray-500">
                  Track dispute patterns by location
                </p>
              </button>

              <button
                onClick={() => handleQuickAction("What is the candidate pipeline summary?")}
                className="p-4 border rounded-lg hover:shadow transition cursor-pointer text-left bg-white"
              >
                <div className="text-blue-500 mb-2">👤</div>
                <h3 className="font-medium">Candidate Status</h3>
                <p className="text-sm text-gray-500">
                  Get weekly application pipeline summary
                </p>
              </button>
            </div>
          </div>
        ) : (
          /* ===== CHAT VIEW ===== */
          <>
            {/* Chat Header inside app */}
            <div className="flex justify-center py-4">
              <div className="bg-gray-100 text-gray-700 px-5 py-3 rounded-lg inline-block">
                {chatTitle}
              </div>
            </div>

            {/* Scrollable Messages */}
            <div className="flex-1 overflow-y-auto px-4">
              <MessageList messages={messages} />
            </div>
          </>
        )}

        {/* ===== INPUT BAR (always visible) ===== */}
        <div className="border-t p-4 bg-white">
          <MessageInput onSend={handleSend} />
          <p className="text-center text-xs text-gray-400 mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
  );
}










// "use client";

// import React from "react";
// import ResponseChart from "../../components/chat/ResponseChart";
// import ResponseInsights from "../../components/chat/ResponseInsights";
// import ResponseTable from "../../components/chat/ResponseTable";
// import MessageInput from "../../components/chat/MessageInput";
// import { Download, RotateCcw, ThumbsUp, ThumbsDown, Plus, UserCircle } from "lucide-react";

// export default function VisualCanvas() {
//   const handleSendMessage = (message: string) => {
//     console.log("Message sent:", message);
//   };

//   const handleNewChat = () => {
//     console.log("New chat started");
//     // if you want to reset messages or title, handle it here later
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* ===== HEADER ===== */}
//       <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
//         <div className="flex items-center space-x-2">
//           <div className="text-blue-600 font-bold text-lg">logo</div>
//           <button
//             className="ml-4 flex items-center space-x-2 px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-100 transition"
//             onClick={handleNewChat}
//           >
//             <Plus className="h-4 w-4" />
//             <span>New Chat</span>
//           </button>
//         </div>
//         <button className="p-2 rounded-full hover:bg-gray-100">
//           <UserCircle className="h-7 w-7 text-gray-500" />
//         </button>
//       </div>

//       {/* ===== MAIN CONTENT ===== */}
//       <div className="flex gap-6 max-w-7xl mx-auto p-6">
//         {/* Left Panel - Chat Interface */}
//         <div className="w-80 bg-white rounded-xl shadow-sm p-4 flex flex-col h-[calc(100vh-6rem)]">
//           {/* Chat Messages - Scrollable Area */}
//           <div className="flex-1 overflow-y-auto mb-4">
//             {/* Chat Message */}
//             <div className="mb-4">
//               <div className="bg-blue-500 text-white px-4 py-2 rounded-lg inline-block mb-4">
//                 Show me the order turnaround time for last month
//               </div>
//             </div>

//             {/* Response */}
//             <div className="mb-4">
//               <div className="flex items-start gap-2 mb-2">
//                 <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">
//                   🤖
//                 </div>
//                 <div className="text-sm text-gray-700">
//                   Here's the order turnaround time analysis for last month. I can
//                   see some interesting patterns in delivery performance.
//                 </div>
//               </div>

//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
//                 <div className="flex items-center gap-2 text-blue-600">
//                   <span className="text-xs">ℹ️</span>
//                   Visualization displayed in canvas panel →
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex items-center gap-3 text-gray-500">
//               <button className="flex items-center gap-1 text-xs hover:text-gray-700">
//                 <RotateCcw size={14} />
//                 Rethink
//               </button>
//               <button className="hover:text-gray-700">
//                 <ThumbsUp size={14} />
//               </button>
//               <button className="hover:text-gray-700">
//                 <ThumbsDown size={14} />
//               </button>
//               <button className="flex items-center gap-1 text-xs hover:text-gray-700">
//                 <Download size={14} />
//                 Export
//               </button>
//             </div>
//           </div>

//           {/* Message Input - Fixed at Bottom */}
//           <div className="border-t pt-4">
//             <MessageInput onSend={handleSendMessage} />
//           </div>
//         </div>

//         {/* Right Panel - Visual Canvas */}
//         <div className="flex-1 bg-white rounded-xl shadow-sm p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h1 className="text-xl font-semibold text-gray-800">
//               Visual Canvas
//             </h1>
//             <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
//               <Download size={16} />
//               Export
//             </button>
//           </div>

//           <div className="mb-6">
//             <h2 className="text-lg font-medium text-gray-800 mb-4">
//               Daily Turnaround Trend
//             </h2>

//             {/* Chart and Insights Container */}
//             <div className="flex gap-6 mb-6">
//               {/* Chart Component */}
//               <div className="flex-1">
//                 <ResponseChart />
//                 <p className="text-center text-sm text-gray-500 mt-2">
//                   Average turnaround time improved by 15% with 90% on-time
//                   delivery rate maintained.
//                 </p>
//               </div>

//               {/* Insights Component */}
//               <ResponseInsights />
//             </div>

//             {/* Summary Stats */}
//             <div className="bg-gray-50 rounded-lg p-4 mb-6">
//               <p className="text-sm text-gray-700 mb-3">
//                 Average turnaround time improved by 15% with 90% on-time
//                 delivery rate maintained.
//               </p>

//               <div className="flex items-center gap-8">
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-green-600">98%</div>
//                   <div className="text-xs text-gray-500">Data Quality</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-blue-600 flex items-center gap-1">
//                     📈 12%
//                   </div>
//                   <div className="text-xs text-gray-500">Trend</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-purple-600">2h ago</div>
//                   <div className="text-xs text-gray-500">Updated</div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Data Table Section */}
//           <div>
//             <h3 className="text-lg font-medium text-gray-800 mb-4">
//               Data Table
//             </h3>
//             <ResponseTable />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
