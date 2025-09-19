"use client";

import React, { useState, useMemo } from "react";
import { Eye, Edit, Search, X } from "lucide-react";

// --- TYPES (Included for a self-contained component) ---
// This would typically be in a separate types.ts file
type OrderStatus = "in_progress" | "completed" | "pending" | "cancelled";
type OrderPriority = "high" | "medium" | "low" | "urgent";

export interface Order {
  id: string;
  company_name: string;
  order_status: OrderStatus;
  candidate_count: number;
  priority: OrderPriority;
  cost: number;
  currency: string;
  due_date: string;
}

// --- STYLES ---
const statusColors: Record<OrderStatus, string> = {
  in_progress: "bg-blue-100 text-blue-600",
  completed: "bg-green-100 text-green-600",
  pending: "bg-yellow-100 text-yellow-600",
  cancelled: "bg-gray-100 text-gray-600",
};

const priorityColors: Record<OrderPriority, string> = {
  high: "bg-red-100 text-red-600",
  medium: "bg-orange-100 text-orange-600",
  low: "bg-gray-100 text-gray-600",
  urgent: "bg-purple-100 text-purple-600",
};

// --- HELPER FUNCTIONS ---
const formatDate = (dateString: string) => {
  try {
    if (!dateString) return "N/A";
    return new Date(dateString).toISOString().split('T')[0];
  } catch (error) {
    return "Invalid Date";
  }
};

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

// --- PROPS ---
interface OrdersTableProps {
  orders: Order[];
}

// --- COMPONENT ---
const OrdersTable: React.FC<OrdersTableProps> = ({ orders }) => {
  const [customerFilter, setCustomerFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const [priorityFilter, setPriorityFilter] = useState<OrderPriority | "">("");
  
  // Get unique statuses and priorities from the data for filter options
  const uniqueStatuses = useMemo(() => Array.from(new Set(orders.map(o => o.order_status))), [orders]);
  const uniquePriorities = useMemo(() => Array.from(new Set(orders.map(o => o.priority))), [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const customerMatch = customerFilter === "" || order.company_name.toLowerCase().includes(customerFilter.toLowerCase());
      const statusMatch = statusFilter === "" || order.order_status === statusFilter;
      const priorityMatch = priorityFilter === "" || order.priority === priorityFilter;
      return customerMatch && statusMatch && priorityMatch;
    });
  }, [orders, customerFilter, statusFilter, priorityFilter]);

  const resetFilters = () => {
    setCustomerFilter("");
    setStatusFilter("");
    setPriorityFilter("");
  };

  return (
    <div className="">
        {/* --- FILTER CONTROLS --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-300">
            {/* Customer Search */}
            <div className="relative">
                <label htmlFor="customer-search" className="text-sm font-medium text-gray-600 block mb-1">Customer</label>
                <Search className="absolute left-3 top-9 text-gray-400" size={18} />
                <input
                    id="customer-search"
                    type="text"
                    value={customerFilter}
                    onChange={(e) => setCustomerFilter(e.target.value)}
                    placeholder="Search by customer..."
                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
            </div>
            
            {/* Status Filter */}
            <div>
                 <label htmlFor="status-filter" className="text-sm font-medium text-gray-600 block mb-1">Status</label>
                 <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "")}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
                >
                    <option value="">All Statuses</option>
                    {uniqueStatuses.map(status => (
                        <option key={status} value={status} className="capitalize">
                            {status.replace('_', ' ')}
                        </option>
                    ))}
                </select>
            </div>

            {/* Priority Filter */}
            <div>
                <label htmlFor="priority-filter" className="text-sm font-medium text-gray-600 block mb-1">Priority</label>
                <select
                    id="priority-filter"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value as OrderPriority | "")}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
                >
                    <option value="">All Priorities</option>
                    {uniquePriorities.map(priority => (
                        <option key={priority} value={priority} className="capitalize">
                            {priority}
                        </option>
                    ))}
                </select>
            </div>
            
            {/* Reset Button */}
            <div className="flex items-end">
                 <button 
                    onClick={resetFilters}
                    className="w-full flex items-center justify-center gap-2 p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition font-medium"
                >
                    <X size={16}/>
                    Reset Filters
                </button>
            </div>
        </div>

        {/* --- ORDERS TABLE --- */}
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
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                            <tr key={order.id} className="border-b hover:bg-gray-50 transition-colors">
                                <td className="py-3 px-4 font-semibold text-gray-700">{order.id.substring(0, 8)}...</td>
                                <td className="py-3 px-4 text-gray-600">{order.company_name}</td>
                                <td className="py-3 px-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.order_status]}`}>
                                        {order.order_status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                                        {order.candidate_count}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${priorityColors[order.priority]}`}>
                                        {order.priority}
                                    </span>
                                </td>
                                <td className="py-3 px-4 font-semibold text-gray-700">{formatCurrency(order.cost, order.currency)}</td>
                                <td className="py-3 px-4 text-gray-600">{formatDate(order.due_date)}</td>
                                <td className="py-3 px-4 flex gap-2">
                                    <button className="text-gray-500 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-100">
                                        <Eye size={18} />
                                    </button>
                                    <button className="text-gray-500 hover:text-green-600 transition-colors p-1 rounded-full hover:bg-green-100">
                                        <Edit size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                         <tr>
                            <td colSpan={8} className="text-center py-10 text-gray-500">
                                <p className="font-medium">No orders found.</p>
                                <p className="text-sm">Try adjusting your filters or clearing them to see all orders.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default OrdersTable;

