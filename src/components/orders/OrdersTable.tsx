"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  User,
  DollarSign,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ordersAPI, subOrdersAPI, subjectsAPI, packagesAPI } from "@/lib/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface Order {
  id: string;
  order_code: string;
  employee_id: string;
  priority: string;
  due_date: string;
  notes: string;
  internal_notes: string;
  candidate_count: number;
  cost: string;
  currency: string;
  order_status: string;
  company_id: string;
  completion_date: string;
  candidate_complete_count: number;
  created_by: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface SubOrder {
  id: string;
  order_id: string;
  subject_id: string;
  package_id: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date: string;
  notes?: string;
  company_id: string;
  sub_order_status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'failed';
  completion_date?: string;
  cost: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Additional data we'll fetch
  subject_name?: string;
  subject_display_code?: string;
  subject_email?: string;
  package_name?: string;
  package_type?: string;
  search_count?: number;
  completed_searches?: number;
}

interface OrdersResponse {
  total: number;
  limit: number;
  offset: number;
  has_next: boolean;
  has_previous: boolean;
  orders: Order[];
}

interface SubOrdersResponse {
  sub_orders: SubOrder[];
}

const statusColors = {
  completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  in_progress: "bg-amber-100 text-amber-800 border-amber-200",
  pending: "bg-red-100 text-red-800 border-red-200",
  cancelled: "bg-gray-100 text-gray-800 border-gray-200",
  failed: "bg-red-100 text-red-800 border-red-200",
};

const priorityColors = {
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-green-100 text-green-800 border-green-200",
};

export default function OrdersTable() {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch orders
  const {
    data: ordersData,
    isLoading: ordersLoading,
    error: ordersError,
  } = useQuery({
    queryKey: ["orders", currentPage, pageSize, searchTerm, statusFilter, priorityFilter],
    queryFn: async () => {
      const params = {
        skip: (currentPage - 1) * pageSize,
        limit: pageSize,
      };

      if (searchTerm) (params as any).search = searchTerm;
      if (statusFilter !== "all") (params as any).status = statusFilter;
      if (priorityFilter !== "all") (params as any).priority = priorityFilter;

      const response = await ordersAPI.getOrders(params);
      return response as OrdersResponse;
    },
  });

  // Fetch sub-orders for expanded rows
  const expandedOrderIds = Array.from(expandedRows);
  const {
    data: subOrdersData,
    isLoading: subOrdersLoading,
  } = useQuery({
    queryKey: ["sub-orders", expandedOrderIds],
    queryFn: async () => {
      const subOrdersMap: { [key: string]: SubOrder[] } = {};
      
      for (const orderId of expandedOrderIds) {
        try {
          const response = await subOrdersAPI.getSubOrders({
            order_id: orderId,
            limit: 100, // Get all sub-orders for this order
          });
          
          // Fetch subject and package details for each sub-order
          const enrichedSubOrders = await Promise.all(
            (response.sub_orders || []).map(async (subOrder) => {
              try {
                // Fetch subject details
                const subjectResponse = await subjectsAPI.getSubjectById(subOrder.subject_id);
                const packageResponse = await packagesAPI.getPackageById(subOrder.package_id);
                
                return {
                  ...subOrder,
                  subject_name: subjectResponse.name,
                  subject_display_code: subjectResponse.display_code,
                  package_name: packageResponse.package_name,
                  package_type: packageResponse.package_type,
                };
              } catch (error) {
                console.error(`Error fetching details for sub-order ${subOrder.id}:`, error);
                return subOrder;
              }
            })
          );
          
          subOrdersMap[orderId] = enrichedSubOrders;
        } catch (error) {
          console.error(`Error fetching sub-orders for order ${orderId}:`, error);
          subOrdersMap[orderId] = [];
        }
      }
      
      return subOrdersMap;
    },
    enabled: expandedOrderIds.length > 0,
  });

  const toggleRow = (orderId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(orderId)) {
      newExpandedRows.delete(orderId);
    } else {
      newExpandedRows.add(orderId);
    }
    setExpandedRows(newExpandedRows);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "in_progress":
        return <Clock className="w-4 h-4" />;
      case "pending":
        return <AlertCircle className="w-4 h-4" />;
      case "cancelled":
      case "failed":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const totalPages = ordersData ? Math.ceil(ordersData.total / pageSize) : 0;

  if (ordersLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (ordersError) {
    return (
      <div className="text-center py-8">
        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600">Error loading orders. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
        }
      `}</style>
      {/* Header with Filters */}
      <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search orders by code, status, or priority..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-normal bg-white shadow-sm hover:shadow-md transition-all duration-200 placeholder-gray-400 text-gray-700"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none px-4 py-2.5 pr-8 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-normal bg-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer text-gray-700"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Priority Filter */}
            <div className="relative">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="appearance-none px-4 py-2.5 pr-8 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-normal bg-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer text-gray-700"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 text-sm font-normal border border-gray-200 hover:border-gray-300">
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 text-sm font-normal border border-gray-200 hover:border-gray-300">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8"></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ordersData?.orders.map((order) => (
              <React.Fragment key={order.id}>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleRow(order.id)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      {expandedRows.has(order.id) ? (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.order_code}
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.order_status as keyof typeof statusColors] || statusColors.pending}`}
                    >
                      {getStatusIcon(order.order_status)}
                      {order.order_status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityColors[order.priority as keyof typeof priorityColors] || priorityColors.medium}`}
                    >
                      {order.priority}
                    </span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">{order.candidate_complete_count}/{order.candidate_count}</span>
                      <div className="w-12 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-300"
                          style={{
                            width: `${(order.candidate_complete_count / order.candidate_count) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${order.cost}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-xs text-gray-700">
                    {formatDate(order.due_date)}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-xs text-gray-500">
                    {formatDate(order.updated_at)}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-medium items-center flex justfiy-center">
                    <button className="text-blue-600 hover:text-blue-900 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>

                {/* Sub-Orders Row */}
                <AnimatePresence>
                  {expandedRows.has(order.id) && (
                    <motion.tr
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <td colSpan={9} className="px-0 py-0">
                        <div className="bg-gradient-to-r from-slate-50 to-gray-50 border-t border-gray-200">
                          <div className="px-6 py-4">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                              <h4 className="text-sm font-semibold text-gray-800">
                                Sub-Orders ({subOrdersData?.[order.id]?.length || 0})
                              </h4>
                            </div>
                            {subOrdersLoading ? (
                              <div className="flex justify-center py-4">
                                <LoadingSpinner />
                              </div>
                            ) : subOrdersData?.[order.id]?.length ? (
                              <div className="space-y-2">
                                {subOrdersData[order.id].map((subOrder, index) => (
                                  <motion.div
                                    key={subOrder.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
                                  >
                                    <div className="p-4">
                                      <div className="grid grid-cols-12 gap-4 items-center">
                                        {/* Subject */}
                                        <div className="col-span-3">
                                          <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                              <span className="text-xs font-medium text-white">
                                                {(subOrder.subject_name || subOrder.subject_id).charAt(0).toUpperCase()}
                                              </span>
                                            </div>
                                            <div>
                                              <div className="text-sm font-medium text-gray-900">
                                                {subOrder.subject_name || `Subject ${subOrder.subject_id.slice(0, 8)}...`}
                                              </div>
                                              <div className="text-xs text-gray-500">
                                                {subOrder.subject_display_code || subOrder.subject_id}
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Package */}
                                        <div className="col-span-3">
                                          <div className="text-sm font-medium text-gray-900">
                                            {subOrder.package_name || `Package ${subOrder.package_id.slice(0, 8)}...`}
                                          </div>
                                          <div className="text-xs text-gray-500">
                                            {subOrder.package_type || subOrder.package_id}
                                          </div>
                                        </div>

                                        {/* Status */}
                                        <div className="col-span-2">
                                          <span
                                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColors[subOrder.sub_order_status as keyof typeof statusColors] || statusColors.pending}`}
                                          >
                                            {getStatusIcon(subOrder.sub_order_status)}
                                            {subOrder.sub_order_status.replace("_", " ")}
                                          </span>
                                        </div>

                                        {/* Cost */}
                                        <div className="col-span-2">
                                          <div className="text-sm font-medium text-gray-900">
                                            ${subOrder.cost}
                                          </div>
                                          <div className="text-xs text-gray-500">
                                            {subOrder.priority}
                                          </div>
                                        </div>

                                        {/* Updated */}
                                        <div className="col-span-2 text-right">
                                          <div className="text-xs text-gray-500">
                                            {formatDate(subOrder.updated_at)}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-8">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                  <Package className="w-6 h-6 text-gray-400" />
                                </div>
                                <p className="text-sm text-gray-500">No sub-orders found for this order.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-normal text-gray-600">
                Showing {((currentPage - 1) * pageSize) + 1} to{" "}
                {Math.min(currentPage * pageSize, ordersData?.total || 0)} of{" "}
                {ordersData?.total || 0} results
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-normal text-gray-600">Show:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-normal text-gray-700 items-center justify-center bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm font-normal text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />

              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 border rounded-md text-sm font-normal transition-colors ${
                        currentPage === page
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 text-gray-700 rounded-md text-sm font-normal bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
