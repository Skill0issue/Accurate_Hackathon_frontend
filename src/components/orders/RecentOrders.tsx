"use client";
import React from "react";
import { Eye, Edit } from "lucide-react";

const orders = [
  {
    id: "ORD-001",
    customer: "Acme Corporation",
    status: "In Progress",
    subOrders: 3,
    priority: "High",
    total: "$2,450.00",
    date: "2024-01-15",
  },
  {
    id: "ORD-002",
    customer: "Tech Solutions Inc",
    status: "Completed",
    subOrders: 1,
    priority: "Medium",
    total: "$890.00",
    date: "2024-01-14",
  },
  {
    id: "ORD-003",
    customer: "Global Enterprises",
    status: "Pending",
    subOrders: 5,
    priority: "High",
    total: "$5,670.00",
    date: "2024-01-13",
  },
  {
    id: "ORD-004",
    customer: "StartUp Hub",
    status: "In Progress",
    subOrders: 2,
    priority: "Low",
    total: "$1,200.00",
    date: "2024-01-12",
  },
];

const statusColors: Record<string, string> = {
  "In Progress": "bg-blue-100 text-blue-600",
  Completed: "bg-green-100 text-green-600",
  Pending: "bg-yellow-100 text-yellow-600",
};

const priorityColors: Record<string, string> = {
  High: "bg-red-100 text-red-600",
  Medium: "bg-orange-100 text-orange-600",
  Low: "bg-gray-100 text-gray-600",
};

export default function RecentOrders() {
  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-gray-500 text-sm border-b">
              <th className="py-3 px-4">ORDER ID</th>
              <th className="py-3 px-4">CUSTOMER</th>
              <th className="py-3 px-4">STATUS</th>
              <th className="py-3 px-4">SUB-ORDERS</th>
              <th className="py-3 px-4">PRIORITY</th>
              <th className="py-3 px-4">TOTAL</th>
              <th className="py-3 px-4">DATE</th>
              <th className="py-3 px-4">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-semibold">{order.id}</td>
                <td className="py-3 px-4">{order.customer}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                    {order.subOrders}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[order.priority]}`}
                  >
                    {order.priority}
                  </span>
                </td>
                <td className="py-3 px-4 font-semibold">{order.total}</td>
                <td className="py-3 px-4">{order.date}</td>
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
    </div>
  );
}
