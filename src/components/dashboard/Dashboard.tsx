"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Package,
  Users,
  Building2,
  Search,
  FileText,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  Zap,
  Target,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Eye,
  Filter,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  RadialBarChart,
  RadialBar,
  ComposedChart,
} from "recharts";
import { useDashboardData } from "@/hooks/useDashboardData";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function Dashboard() {
  const {
    stats,
    chartData,
    recentActivities,
    statsCards,
    orderStatusDistribution,
    monthlyOrderTrends,
    searchStatusDistribution,
    monthlySearchTrends,
    loading,
    error,
    backendAvailable,
  } = useDashboardData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  const getTrendIcon = (trend: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return <ArrowUpRight className="w-4 h-4 text-emerald-500" />;
      case "down":
        return <ArrowDownRight className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTrendColor = (trend: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return "text-emerald-600";
      case "down":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
      in_progress: "bg-amber-50 text-amber-700 border-amber-200",
      pending: "bg-red-50 text-red-700 border-red-200",
      cancelled: "bg-gray-50 text-gray-700 border-gray-200",
      failed: "bg-red-50 text-red-700 border-red-200",
    };
    return colors[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  // Custom tooltip for charts - simplified
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Disable tooltips for pie charts
  const DisabledTooltip = () => null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");

        * {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif;
        }

        .recharts-wrapper {
          user-select: none !important;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
        }
        .recharts-cartesian-axis-tick-value {
          user-select: none !important;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
        }
        .recharts-tooltip-wrapper {
          user-select: none !important;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
        }
        .recharts-legend-wrapper {
          user-select: none !important;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
        }

        /* Fix input text color */
        input[type="text"] {
          color: #1f2937 !important;
        }

        input[type="text"]::placeholder {
          color: #9ca3af !important;
        }

        /* Center charts */
        .recharts-wrapper {
          margin: 0 auto;
        }
      `}</style>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navbar */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Dashboard
              </h1>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-128 text-gray-900 placeholder-gray-500 text-sm font-medium"
                    />
                  </div>
                </div>
            </div>
            <div className="flex items-center gap-3">
              {backendAvailable ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-400">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                  Live Data
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                  Demo Data
                </span>
              )}
              <button className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs">
                <Filter className="w-3 h-3" />
                Filters
              </button>
            </div>
          </div>
        </motion.nav>

        {/* Enhanced Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {statsCards.map((card, index) => {
            const Icon =
              card.icon === "📋"
                ? FileText
                : card.icon === "👥"
                ? Users
                : card.icon === "🔍"
                ? Search
                : card.icon === "✅"
                ? Target
                : Package;

            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="group relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl ${
                        card.color === "blue"
                          ? "bg-blue-50 group-hover:bg-blue-100"
                          : card.color === "green"
                          ? "bg-emerald-50 group-hover:bg-emerald-100"
                          : card.color === "purple"
                          ? "bg-purple-50 group-hover:bg-purple-100"
                          : "bg-emerald-50 group-hover:bg-emerald-100"
                      } transition-colors duration-300`}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          card.color === "blue"
                            ? "text-blue-600"
                            : card.color === "green"
                            ? "text-emerald-600"
                            : card.color === "purple"
                            ? "text-purple-600"
                            : "text-emerald-600"
                        }`}
                      />
                    </div>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(card.trend)}
                      <span
                        className={`text-xs font-medium ${getTrendColor(
                          card.trend
                        )}`}
                      >
                        {card.change > 0 ? "+" : ""}
                        {card.change}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">
                      {card.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {card.value.toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Order Status Distribution - Modern Donut Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <PieChartIcon className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                  Order Status
                </h2>
              </div>
              <div className="text-xs text-gray-500">Distribution</div>
            </div>
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={orderStatusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    isAnimationActive={false}
                  >
                    {orderStatusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<DisabledTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {orderStatusDistribution.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Monthly Trends - Modern Area Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                  Order Trends
                </h2>
              </div>
              <div className="text-xs text-gray-500">6M</div>
            </div>
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart
                  data={monthlyOrderTrends}
                  margin={{ top: 10, right: 0, left: -40, bottom: 10 }}
                >
                  <defs>
                    <linearGradient
                      id="colorOrders"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="month"
                    axisLine={true}
                    tickLine={true}
                    stroke="#64748b"
                    tick={{ fontSize: 12, fill: "#64748b" }}
                  />
                  <YAxis
                    axisLine={true}
                    tickLine={true}
                    stroke="#64748b"
                    tick={{ fontSize: 12, fill: "#64748b" }}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={false}
                    allowEscapeViewBox={{ x: false, y: false }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fill="url(#colorOrders)"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-start">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-gray-600">Orders</span>
              </div>
            </div>
          </motion.div>

          {/* Search Performance - Radial Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Search Rate</h2>
              </div>
              <div className="text-xs text-gray-500">Performance</div>
            </div>
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="90%"
                  data={[
                    { name: "Completed", value: 75, fill: "#10B981" },
                    { name: "In Progress", value: 20, fill: "#F59E0B" },
                    { name: "Pending", value: 5, fill: "#EF4444" },
                  ]}
                >
                  <RadialBar
                    dataKey="value"
                    cornerRadius={4}
                    isAnimationActive={false}
                  />
                  <Tooltip content={<DisabledTooltip />} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-gray-600">Done</span>
                </div>
                <span className="font-medium text-gray-900">75%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <span className="text-gray-600">Active</span>
                </div>
                <span className="font-medium text-gray-900">20%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-gray-600">Pending</span>
                </div>
                <span className="font-medium text-gray-900">5%</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Row - Search Trends and Recent Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Search Trends - Line Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <Search className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                  Search Activity
                </h2>
              </div>
              <div className="text-xs text-gray-500">6M</div>
            </div>
            <div className="flex justify-center cursor-no-select select-none">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlySearchTrends}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f1f5f9"
                    cursor="no-select"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={true}
                    tickLine={true}
                    stroke="#64748b"
                    tick={{ fontSize: 12, fill: "#64748b" }}
                  />
                  <YAxis
                    axisLine={true}
                    tickLine={true}
                    stroke="#64748b"
                    tick={{ fontSize: 12, fill: "#64748b" }}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={false}
                    allowEscapeViewBox={{ x: false, y: false }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#F59E0B"
                    strokeWidth={3}
                    dot={{ fill: "#F59E0B", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#F59E0B", strokeWidth: 2 }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-start">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span className="text-gray-600">Searches</span>
              </div>
            </div>
          </motion.div>

          {/* Recent Activity - Compact */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Activity className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                  Recent Updates
                </h2>
              </div>
              <button className="text-indigo-600 hover:text-indigo-700 text-xs font-medium">
                View all
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {recentActivities.length > 0 ? (
                recentActivities.slice(0, 6).map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        activity.status === "completed"
                          ? "bg-emerald-500"
                          : activity.status === "in_progress"
                          ? "bg-amber-500"
                          : "bg-red-500"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-900 font-medium line-clamp-2">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                            activity.status
                          )}`}
                        >
                          {activity.status.replace("_", " ")}
                        </span>
                        {activity.type === "order" && activity.cost && (
                          <span className="text-xs text-gray-500 font-medium">
                            {activity.cost}
                          </span>
                        )}
                        {activity.type === "search" && activity.searchCost && (
                          <span className="text-xs text-gray-500 font-medium">
                            {activity.searchCost}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-6">
                  <Activity className="w-6 h-6 text-gray-300 mx-auto mb-1" />
                  <p className="text-gray-500 text-xs">No activity</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
