"use client";

import React, { useState, useEffect } from "react";
import { ListChecks, Clock, CheckCircle2 } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import OrderDetails from "@/components/orders/OrderDetails";
import Header from "@/components/layout/Header";
import ChatExperience from "@/components/chat/ChatExperience";
import OrdersTable from "@/components/orders/OrdersTable"; // Import the dedicated table component

// Import the service and types to fetch live data
import { getOrders } from "@/components/services/orderService";
import { Order } from "@/components/orders/types";

export default function DashboardPage() {

    const sampleOrders: Order[] = [
        {
            id: "ORD-001",
            company_name: "Acme Corporation",
            order_status: "in_progress",
            candidate_count: 3,
            priority: "high",
            cost: 2450.00,
            currency: "USD",
            due_date: "2024-01-15"
        },
        {
            id: "ORD-002",
            company_name: "Tech Solutions Inc",
            order_status: "completed",
            candidate_count: 1,
            priority: "medium",
            cost: 890.00,
            currency: "USD",
            due_date: "2024-01-14"
        },
        {
            id: "ORD-003",
            company_name: "Global Enterprises",
            order_status: "pending",
            candidate_count: 5,
            priority: "high",
            cost: 5670.00,
            currency: "USD",
            due_date: "2024-01-13"
        },
        {
            id: "ORD-004",
            company_name: "StartUp Hub",
            order_status: "in_progress",
            candidate_count: 2,
            priority: "low",
            cost: 1200.00,
            currency: "USD",
            due_date: "2024-01-12"
        },
    ];

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    // State for live orders, loading status, and potential errors
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleToggleSidebar = () => setIsSidebarOpen((prev) => !prev);

    // useEffect hook to fetch data from the API when the component mounts
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const fetchedOrders = await getOrders();
                setOrders(fetchedOrders);
            } catch (err) {
                setError("Failed to load orders. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []); // Empty dependency array means this runs once on mount

    // Dynamically calculate stats from the live order data
    const totalOrders = orders.length;
    const inProgressOrders = orders.filter(o => o.order_status === 'in_progress').length;
    const pendingOrders = orders.filter(o => o.order_status === 'pending').length;
    const completedOrders = orders.filter(o => o.order_status === 'completed').length;
    const cancelledOrders = orders.filter(o => o.order_status === 'cancelled').length;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header onToggleSidebar={handleToggleSidebar} />
            <div className="flex flex-1">
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={handleToggleSidebar} />
                <main className="flex-1 p-6">
                    <h1 className="text-2xl font-bold">Orders Management</h1>
                    <p className="text-gray-500 mb-6">
                        Track and manage all your orders with sub-orders and counts
                    </p>

                    {/* Info Cards now show calculated values from live data */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                        <OrderDetails title="Total Orders" value={totalOrders} icon={<ListChecks className="text-purple-600" />} color="bg-purple-100" />
                        <OrderDetails title="In Progress" value={inProgressOrders} icon={<Clock className="text-blue-600" />} color="bg-blue-100" />
                        <OrderDetails title="Pending" value={pendingOrders} icon={<Clock className="text-yellow-600" />} color="bg-yellow-100" />
                        <OrderDetails title="Completed" value={completedOrders} icon={<CheckCircle2 className="text-green-600" />} color="bg-green-100" />
                        <OrderDetails title="cancelled" value={cancelledOrders} icon={<CheckCircle2 className="text-gray-600" />} color="bg-gray-100" />
                    </div>

                    {/* Recent Orders Table Container */}
                    <div className="bg-white shadow rounded-xl p-6 mt-6">
                        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
                        {/* Conditionally render UI based on the data fetching state */}
                        {isLoading && <p className="text-center text-gray-500">Loading orders...</p>}
                        {error && <p className="text-center text-red-500">{error}</p>}
                        {!isLoading && !error && <OrdersTable orders={orders} />}
                    </div>
                </main>
            </div>

            <ChatExperience />
        </div>
    );
}

