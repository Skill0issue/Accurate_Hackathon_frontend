'use client';

import { useState, useEffect } from 'react';
import { 
  companiesAPI, 
  ordersAPI, 
  subjectsAPI, 
  packagesAPI,
  searchesAPI,
  subOrdersAPI 
} from '@/lib/api';

export interface DashboardStats {
  totalCompanies: number;
  totalOrders: number;
  totalSubjects: number;
  totalPackages: number;
  totalSearches: number;
  totalSubOrders: number;
  activeOrders: number;
  completedOrders: number;
  pendingOrders: number;
}

export interface StatsCard {
  title: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
  color: string;
}

export interface ChartData {
  name?: string;
  value?: number;
  color?: string;
  month?: string;
  count?: number;
  orders?: number;
  searches?: number;
  [key: string]: any; // Allow additional properties for Recharts
}

export interface RecentActivity {
  id: string;
  type: string;
  description: string;
  time: string;
  status: string;
  orderCode?: string;
  candidateCount?: number;
  cost?: string;
  searchType?: string;
  searchCost?: string;
}

export function useDashboardData() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCompanies: 0,
    totalOrders: 0,
    totalSubjects: 0,
    totalPackages: 0,
    totalSearches: 0,
    totalSubOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
  });
  
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [statsCards, setStatsCards] = useState<StatsCard[]>([]);
  const [orderStatusDistribution, setOrderStatusDistribution] = useState<ChartData[]>([]);
  const [monthlyOrderTrends, setMonthlyOrderTrends] = useState<ChartData[]>([]);
  const [searchStatusDistribution, setSearchStatusDistribution] = useState<ChartData[]>([]);
  const [monthlySearchTrends, setMonthlySearchTrends] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backendAvailable, setBackendAvailable] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check backend availability first
        try {
          const backendCheck = await fetch('http://localhost:8000/', { 
            method: 'GET',
            timeout: 5000 
          } as any);
          setBackendAvailable(backendCheck.ok);
        } catch {
          setBackendAvailable(false);
        }

        if (backendAvailable) {
          // Fetch real data from backend
          console.log('Fetching real data from backend');
          
          // Fetch all data in parallel
          const [
            companiesRes,
            ordersRes,
            subjectsRes,
            packagesRes,
            searchesRes,
            subOrdersRes
          ] = await Promise.all([
            companiesAPI.getCompanies({ limit: 1 }),
            ordersAPI.getOrders({ limit: 1 }),
            subjectsAPI.getSubjects({ limit: 1 }),
            packagesAPI.getPackages({ limit: 1 }),
            searchesAPI.getSearches({ limit: 1 }),
            subOrdersAPI.getSubOrders({ limit: 1 })
          ]);

          // Calculate stats
          const totalCompanies = companiesRes.total;
          const totalOrders = ordersRes.total;
          const totalSubjects = subjectsRes.total;
          const totalPackages = packagesRes.total;
          const totalSearches = searchesRes.total;
          const totalSubOrders = subOrdersRes.total;

          // Get detailed data for charts
          const [allOrders, allSearches] = await Promise.all([
            ordersAPI.getOrders({ limit: 100 }),
            searchesAPI.getSearches({ limit: 100 })
          ]);

          // Process order status distribution
          const orderStatusCounts = allOrders.orders.reduce((acc: any, order: any) => {
            acc[order.order_status] = (acc[order.order_status] || 0) + 1;
            return acc;
          }, {});

          const orderStatusData = Object.entries(orderStatusCounts).map(([status, count]) => ({
            name: status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '),
            value: count as number,
            color: getStatusColor(status)
          }));

          // Process search status distribution
          const searchStatusCounts = allSearches.searches.reduce((acc: any, search: any) => {
            acc[search.search_status] = (acc[search.search_status] || 0) + 1;
            return acc;
          }, {});

          const searchStatusData = Object.entries(searchStatusCounts).map(([status, count]) => ({
            name: status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '),
            value: count as number,
            color: getStatusColor(status)
          }));

          // Generate monthly trends (last 6 months)
          const monthlyOrderTrends = generateMonthlyTrends(allOrders.orders, 'created_at');
          const monthlySearchTrends = generateMonthlyTrends(allSearches.searches, 'created_at');

          // Calculate completion rates
          const completedOrders = orderStatusCounts.completed || 0;
          const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

          // Create stats cards with trends
          const statsCardsData = [
            {
              title: 'Total Orders',
              value: totalOrders,
              change: 5.2,
              trend: 'up' as const,
              icon: '📋',
              color: 'blue'
            },
            {
              title: 'Total Subjects',
              value: totalSubjects,
              change: 12.8,
              trend: 'up' as const,
              icon: '👥',
              color: 'green'
            },
            {
              title: 'Total Searches',
              value: totalSearches,
              change: -2.1,
              trend: 'down' as const,
              icon: '🔍',
              color: 'purple'
            },
            {
              title: 'Completion Rate',
              value: Math.round(completionRate),
              change: 8.5,
              trend: 'up' as const,
              icon: '✅',
              color: 'emerald'
            }
          ];

          // Generate recent activities from orders and searches, sorted by updated_at
          const orderActivities = allOrders.orders
            .sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
            .slice(0, 5)
            .map((order: any) => ({
              id: order.id,
              type: 'order',
              description: `Order ${order.order_code} - ${order.order_status === 'completed' ? 'Completed' : order.order_status === 'in_progress' ? 'In Progress' : 'Pending'} (${order.candidate_count} candidates)`,
              time: formatTimeAgo(order.updated_at),
              status: order.order_status,
              orderCode: order.order_code,
              candidateCount: order.candidate_count,
              cost: order.cost
            }));

          const searchActivities = allSearches.searches
            .filter((search: any) => search.search_status_notes && search.search_status_notes.length > 0)
            .sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
            .slice(0, 5)
            .map((search: any) => ({
              id: search.id,
              type: 'search',
              description: `${search.search_type} - ${search.search_status_notes[search.search_status_notes.length - 1]?.note || 'Status updated'}`,
              time: formatTimeAgo(search.updated_at),
              status: search.search_status,
              searchType: search.search_type,
              searchCost: search.search_cost
            }));

          // Combine and sort all activities by updated_at
          const recentActivitiesData = [...orderActivities, ...searchActivities]
            .sort((a: any, b: any) => new Date(b.updated_at || b.time).getTime() - new Date(a.updated_at || a.time).getTime())
            .slice(0, 8);

          setStats({
            totalCompanies,
            totalOrders,
            totalSubjects,
            totalPackages,
            totalSearches,
            totalSubOrders,
            activeOrders: orderStatusCounts.in_progress || 0,
            completedOrders: orderStatusCounts.completed || 0,
            pendingOrders: orderStatusCounts.pending || 0,
          });

          setOrderStatusDistribution(orderStatusData);
          setSearchStatusDistribution(searchStatusData);
          setMonthlyOrderTrends(monthlyOrderTrends);
          setMonthlySearchTrends(monthlySearchTrends);
          setStatsCards(statsCardsData);
          setRecentActivities(recentActivitiesData);
          setChartData(orderStatusData);

        } else {
          // Use mock data as fallback
          console.log('Using mock data for dashboard');
          
          setStats({
            totalCompanies: 5,
            totalOrders: 23,
            totalSubjects: 45,
            totalPackages: 8,
            totalSearches: 67,
            totalSubOrders: 34,
            activeOrders: 8,
            completedOrders: 12,
            pendingOrders: 3,
          });

          const mockStatsCards = [
            {
              title: 'Total Orders',
              value: 23,
              change: 5.2,
              trend: 'up' as const,
              icon: '📋',
              color: 'blue'
            },
            {
              title: 'Total Subjects',
              value: 45,
              change: 12.8,
              trend: 'up' as const,
              icon: '👥',
              color: 'green'
            },
            {
              title: 'Total Searches',
              value: 67,
              change: -2.1,
              trend: 'down' as const,
              icon: '🔍',
              color: 'purple'
            },
            {
              title: 'Completion Rate',
              value: 78,
              change: 8.5,
              trend: 'up' as const,
              icon: '✅',
              color: 'emerald'
            }
          ];

          const mockOrderStatusData = [
            { name: 'Completed', value: 12, color: '#10B981' },
            { name: 'In Progress', value: 8, color: '#F59E0B' },
            { name: 'Pending', value: 3, color: '#EF4444' },
          ];

          const mockSearchStatusData = [
            { name: 'Completed', value: 45, color: '#10B981' },
            { name: 'In Progress', value: 15, color: '#F59E0B' },
            { name: 'Pending', value: 7, color: '#EF4444' },
          ];

          const mockMonthlyOrderTrends: ChartData[] = [
            { month: 'Aug', count: 12 },
            { month: 'Sep', count: 18 },
            { month: 'Oct', count: 15 },
            { month: 'Nov', count: 22 },
            { month: 'Dec', count: 19 },
            { month: 'Jan', count: 23 },
          ];

          const mockMonthlySearchTrends: ChartData[] = [
            { month: 'Aug', count: 45 },
            { month: 'Sep', count: 52 },
            { month: 'Oct', count: 48 },
            { month: 'Nov', count: 61 },
            { month: 'Dec', count: 58 },
            { month: 'Jan', count: 67 },
          ];

          const mockRecentActivities = [
            {
              id: '1',
              type: 'order',
              description: 'Order ORD-2024-001 - Completed (5 candidates)',
              time: '2 minutes ago',
              status: 'completed',
              orderCode: 'ORD-2024-001',
              candidateCount: 5,
              cost: '$2,500'
            },
            {
              id: '2',
              type: 'search',
              description: 'Criminal Background Check - Status updated to completed',
              time: '15 minutes ago',
              status: 'completed',
              searchType: 'Criminal Background Check',
              searchCost: '$150'
            },
            {
              id: '3',
              type: 'order',
              description: 'Order ORD-2024-002 - In Progress (3 candidates)',
              time: '1 hour ago',
              status: 'in_progress',
              orderCode: 'ORD-2024-002',
              candidateCount: 3,
              cost: '$1,800'
            },
            {
              id: '4',
              type: 'search',
              description: 'Employment Verification - Additional documents required',
              time: '2 hours ago',
              status: 'in_progress',
              searchType: 'Employment Verification',
              searchCost: '$200'
            },
            {
              id: '5',
              type: 'order',
              description: 'Order ORD-2024-003 - Pending (2 candidates)',
              time: '3 hours ago',
              status: 'pending',
              orderCode: 'ORD-2024-003',
              candidateCount: 2,
              cost: '$1,200'
            },
            {
              id: '6',
              type: 'search',
              description: 'Education Verification - Verification in progress',
              time: '1 day ago',
              status: 'pending',
              searchType: 'Education Verification',
              searchCost: '$100'
            },
            {
              id: '7',
              type: 'search',
              description: 'Reference Check - All references contacted successfully',
              time: '1 day ago',
              status: 'completed',
              searchType: 'Reference Check',
              searchCost: '$75'
            },
            {
              id: '8',
              type: 'order',
              description: 'Order ORD-2024-004 - Completed (4 candidates)',
              time: '2 days ago',
              status: 'completed',
              orderCode: 'ORD-2024-004',
              candidateCount: 4,
              cost: '$2,000'
            }
          ];

          setOrderStatusDistribution(mockOrderStatusData);
          setSearchStatusDistribution(mockSearchStatusData);
          setMonthlyOrderTrends(mockMonthlyOrderTrends);
          setMonthlySearchTrends(mockMonthlySearchTrends);
          setStatsCards(mockStatsCards);
          setRecentActivities(mockRecentActivities);
          setChartData(mockOrderStatusData);
        }

        setLoading(false);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [backendAvailable]);

  // Helper functions
  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      completed: '#10B981',
      in_progress: '#F59E0B',
      pending: '#EF4444',
      cancelled: '#6B7280',
      failed: '#DC2626'
    };
    return colors[status] || '#6B7280';
  };

  const generateMonthlyTrends = (data: any[], dateField: string) => {
    const last6Months: ChartData[] = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      const count = data.filter((item: any) => {
        const itemDate = new Date(item[dateField]);
        return itemDate.getMonth() === date.getMonth() && 
               itemDate.getFullYear() === date.getFullYear();
      }).length;
      
      last6Months.push({ month: monthName, count });
    }
    
    return last6Months;
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  return {
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
  };
}
