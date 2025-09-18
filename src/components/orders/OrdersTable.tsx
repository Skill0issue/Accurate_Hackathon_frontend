"use client";

import React from "react";
import { Eye, Edit } from "lucide-react";
import { Order } from "./types"; // Import the updated Order type

// --- PROPS ---
interface OrdersTableProps {
  orders: Order[];
}

// --- STYLES (Updated with new statuses and priorities from your schema) ---
const statusColors: Record<string, string> = {
  in_progress: "bg-blue-100 text-blue-600",
  completed: "bg-green-100 text-green-600",
  pending: "bg-yellow-100 text-yellow-600",
  cancelled: "bg-gray-100 text-gray-600",
};

const priorityColors: Record<string, string> = {
  high: "bg-red-100 text-red-600",
  medium: "bg-orange-100 text-orange-600",
  low: "bg-gray-100 text-gray-600",
  urgent: "bg-purple-100 text-purple-600",
};

/**
 * Formats an ISO date string into a more readable 'YYYY-MM-DD' format.
 */
const formatDate = (dateString: string) => {
  try {
    if (!dateString) return "N/A";
    return new Date(dateString).toISOString().split('T')[0];
  } catch (error) {
    return "Invalid Date";
  }
};

/**
 * Formats a number into a currency string (e.g., 1250.5 => "$1,250.50").
 */
const formatCurrency = (amount: number, currency: string) => {
    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    } catch (error) {
        return "N/A";
    }
}

/**
 * A component dedicated to rendering the table of recent orders based on the DB schema.
 */
const OrdersTable: React.FC<OrdersTableProps> = ({ orders }) => {
  if (orders.length === 0) {
    return <p className="text-center text-gray-500">No recent orders found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left text-gray-500 text-sm border-b">
            <th className="py-3 px-4">ORDER ID</th>
            <th className="py-3 px-4">CUSTOMER</th>
            <th className="py-3 px-4">STATUS</th>
            <th className="py-3 px-4">CANDIDATES</th>
            <th className="py-3 px-4">PRIORITY</th>
            <th className="py-3 px-4">TOTAL</th>
            <th className="py-3 px-4">DUE DATE</th>
            <th className="py-3 px-4">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4 font-semibold">{order.id.substring(0, 8)}...</td>
              <td className="py-3 px-4">{order.company_name}</td>
              <td className="py-3 px-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.order_status]}`}>
                  {order.order_status.replace('_', ' ')}
                </span>
              </td>
              <td className="py-3 px-4">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                  {order.candidate_count}
                </span>
              </td>
              <td className="py-3 px-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${priorityColors[order.priority]}`}>
                  {order.priority}
                </span>
              </td>
              <td className="py-3 px-4 font-semibold">{formatCurrency(order.cost, order.currency)}</td>
              <td className="py-3 px-4">{formatDate(order.due_date)}</td>
              <td className="py-3 px-4 flex gap-2">
                <button className="text-blue-600 hover:text-blue-800">
                  <Eye size={18} />
                </button>
                <button className="text-blue-600 hover:text-blue-800">
                  <Edit size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;

