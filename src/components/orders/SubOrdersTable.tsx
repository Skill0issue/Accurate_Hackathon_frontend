"use client";

import React from "react";
// Import the necessary types from your central types file
import { SubOrder, OrderStatus, OrderPriority } from "./types";

// --- STYLES (Scoped to this component) ---
const statusColors: Record<OrderStatus, string> = {
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-gray-100 text-gray-700",
};

const subOrderStatusColors: Record<string, string> = {
    ...statusColors,
    'new': "bg-indigo-100 text-indigo-700",
};

// --- HELPER FUNCTIONS ---
const formatDate = (dateString: string) => {
  try {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    return "Invalid Date";
  }
};

// --- PROPS ---
interface SubOrdersTableProps {
  suborders: SubOrder[];
  parentOrderId: string;
}

// --- COMPONENT ---
const SubOrdersTable: React.FC<SubOrdersTableProps> = ({ suborders, parentOrderId }) => {
  return (
    <tr className="bg-slate-50/75">
      <td colSpan={8} className="p-0">
        <div className="px-6 py-4">
          <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
            <h4 className="text-sm font-semibold p-4 bg-slate-100 text-slate-700 border-b border-slate-200">
              Sub-Orders for #{parentOrderId.substring(0, 8)}...
            </h4>
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr className="text-left text-slate-600 text-xs">
                  <th className="py-2 px-4 font-semibold uppercase tracking-wider">ID</th>
                  {/* <th className="py-2 px-4 font-semibold uppercase tracking-wider">Subject Name</th> */}
                  <th className="py-2 px-4 font-semibold uppercase tracking-wider">Status</th>
                  <th className="py-2 px-4 font-semibold uppercase tracking-wider">Due Date</th>
                  <th className="py-2 px-4 font-semibold uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {suborders.map(sub => {
                    const statusClass = subOrderStatusColors[sub.sub_order_status.toLowerCase()] || 'bg-gray-100 text-gray-700';
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4 text-sm text-slate-700 font-mono">#{sub.id.toString().slice(0, 6) + "-"} <b>{ sub.subject_name.toString()}</b> </td>
                      {/* ADDED: New cell to display the Subject Name */}
                      {/* <td className="py-3 px-4 text-sm text-slate-800 font-medium">{sub.subject_name}</td> */}
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusClass}`}>
                          {sub.sub_order_status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">{formatDate(sub.due_date)}</td>
                      <td className="py-3 px-4 text-sm text-slate-500 italic">
                        {sub.notes || <span className="text-slate-400">No notes provided</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default SubOrdersTable;

