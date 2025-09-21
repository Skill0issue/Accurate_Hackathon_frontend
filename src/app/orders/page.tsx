"use client";

import React from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import OrdersTable from "@/components/orders/OrdersTable";

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-600 mt-1">Manage and track all orders</p>
          </div>
          <OrdersTable />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}