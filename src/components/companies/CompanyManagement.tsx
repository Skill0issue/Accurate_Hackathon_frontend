'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Users,
  Package,
  Search,
  TrendingUp,
  Settings,
  UserPlus,
  Shield,
  Activity,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Edit,
  MoreVertical,
  Filter,
  Search as SearchIcon,
  Download,
  RefreshCw
} from 'lucide-react';

import { companiesAPI, usersAPI, ordersAPI, searchesAPI, subjectsAPI } from '@/lib/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface CompanyStats {
  total_employees: number;
  total_users: number;
  total_subjects: number;
  total_orders: number;
  total_searches: number;
  active_orders: number;
  completed_orders: number;
  pending_searches: number;
  completed_searches: number;
  total_billing_cost: number;
  average_order_value: number;
  last_activity: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  job_title?: string;
  employee_id?: string;
  phone?: string;
  is_active: boolean;
  is_verified: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

interface Company {
  id: string;
  company_name: string;
  company_code: string;
  description?: string;
  website_url?: string;
  logo_url?: string;
  timezone: string;
  currency: string;
  is_active: boolean;
  is_verified: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state_province?: string;
  postal_code?: string;
  country?: string;
  primary_phone?: string;
  primary_email?: string;
  billing_email?: string;
  employee_count?: number;
  founded_year?: number;
}

const roleColors = {
  system_admin: 'bg-red-100 text-red-800 border-red-200',
  company_admin: 'bg-blue-100 text-blue-800 border-blue-200',
  hr: 'bg-green-100 text-green-800 border-green-200',
  manager: 'bg-purple-100 text-purple-800 border-purple-200',
  employee: 'bg-gray-100 text-gray-800 border-gray-200',
};

const statusColors = {
  active: 'bg-green-100 text-green-800 border-green-200',
  inactive: 'bg-gray-100 text-gray-800 border-gray-200',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  verified: 'bg-blue-100 text-blue-800 border-blue-200',
};

export default function CompanyManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Fetch company data
  const { data: company, isLoading: companyLoading } = useQuery({
    queryKey: ['company'],
    queryFn: async () => {
      // Mock company data - replace with actual API call
      return {
        id: 'c202614e-c36f-4d1f-b02a-7edb5d5eec6f',
        company_name: 'Acme Corporation',
        company_code: 'ACME001',
        description: 'Leading background check services provider',
        address_line1: '123 Business Street',
        address_line2: 'Suite 100',
        city: 'New York',
        state_province: 'NY',
        postal_code: '10001',
        country: 'United States',
        timezone: 'America/New_York',
        primary_phone: '+1-555-0123',
        primary_email: 'contact@acme.com',
        billing_email: 'billing@acme.com',
        website_url: 'https://acme.com',
        logo_url: 'https://acme.com/logo.png',
        employee_count: 150,
        founded_year: 2010,
        currency: 'USD',
        is_active: true,
        is_verified: true,
        last_login_at: '2024-01-15T10:30:00Z',
        created_at: '2010-01-15T09:00:00Z',
        updated_at: '2024-01-15T10:30:00Z',
        created_by: 'system',
      } as Company;
    },
  });

  // Fetch company stats with fake data
  const { data: companyStats, isLoading: statsLoading } = useQuery({
    queryKey: ['company-stats'],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        total_employees: 1247,
        total_users: 24,
        total_subjects: 1223,
        total_orders: 156,
        total_searches: 1240,
        active_orders: 23,
        completed_orders: 133,
        pending_searches: 45,
        completed_searches: 1195,
        total_billing_cost: 45230.50,
        average_order_value: 290.00,
        last_activity: '2024-01-15T10:30:00Z',
      };
    },
  });

  // Fetch users with fake data
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users', searchTerm, roleFilter, statusFilter],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const mockUsers = [
        {
          id: '1',
          name: 'John Smith',
          email: 'john.smith@company.com',
          role: 'company_admin',
          department: 'IT',
          job_title: 'IT Director',
          employee_id: 'EMP001',
          phone: '+1-555-0123',
          is_active: true,
          is_verified: true,
          last_login_at: '2024-01-15T10:30:00Z',
          created_at: '2023-06-15T09:00:00Z',
          updated_at: '2024-01-15T10:30:00Z',
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@company.com',
          role: 'hr',
          department: 'Human Resources',
          job_title: 'HR Manager',
          employee_id: 'EMP002',
          phone: '+1-555-0124',
          is_active: true,
          is_verified: true,
          last_login_at: '2024-01-14T16:45:00Z',
          created_at: '2023-07-20T11:30:00Z',
          updated_at: '2024-01-14T16:45:00Z',
        },
        {
          id: '3',
          name: 'Mike Wilson',
          email: 'mike.wilson@company.com',
          role: 'manager',
          department: 'Operations',
          job_title: 'Operations Manager',
          employee_id: 'EMP003',
          phone: '+1-555-0125',
          is_active: true,
          is_verified: false,
          last_login_at: '2024-01-13T14:20:00Z',
          created_at: '2023-08-10T08:15:00Z',
          updated_at: '2024-01-13T14:20:00Z',
        },
        {
          id: '4',
          name: 'Lisa Brown',
          email: 'lisa.brown@company.com',
          role: 'employee',
          department: 'Finance',
          job_title: 'Financial Analyst',
          employee_id: 'EMP004',
          phone: '+1-555-0126',
          is_active: false,
          is_verified: true,
          last_login_at: '2023-12-20T09:10:00Z',
          created_at: '2023-09-05T13:45:00Z',
          updated_at: '2023-12-20T09:10:00Z',
        },
        {
          id: '5',
          name: 'David Chen',
          email: 'david.chen@company.com',
          role: 'employee',
          department: 'Marketing',
          job_title: 'Marketing Specialist',
          employee_id: 'EMP005',
          phone: '+1-555-0127',
          is_active: true,
          is_verified: true,
          last_login_at: '2024-01-12T11:15:00Z',
          created_at: '2023-10-15T14:30:00Z',
          updated_at: '2024-01-12T11:15:00Z',
        },
        {
          id: '6',
          name: 'Emily Davis',
          email: 'emily.davis@company.com',
          role: 'hr',
          department: 'Human Resources',
          job_title: 'HR Coordinator',
          employee_id: 'EMP006',
          phone: '+1-555-0128',
          is_active: true,
          is_verified: true,
          last_login_at: '2024-01-11T09:45:00Z',
          created_at: '2023-11-20T10:20:00Z',
          updated_at: '2024-01-11T09:45:00Z',
        },
      ] as User[];

      // Apply filters
      return mockUsers.filter((user) => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             user.employee_id?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = !roleFilter || user.role === roleFilter;
        const matchesStatus = !statusFilter || 
                             (statusFilter === 'active' && user.is_active) ||
                             (statusFilter === 'inactive' && !user.is_active) ||
                             (statusFilter === 'verified' && user.is_verified);
        
        return matchesSearch && matchesRole && matchesStatus;
      });
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoleDisplayName = (role: string) => {
    const roleMap: { [key: string]: string } = {
      system_admin: 'System Admin',
      company_admin: 'Company Admin',
      hr: 'HR Manager',
      manager: 'Manager',
      employee: 'Employee',
    };
    return roleMap[role] || role;
  };


  if (companyLoading || statsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Company Overview Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* GitHub-style header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{company?.company_name}</h2>
              <p className="text-sm text-gray-500">{company?.company_code}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              company?.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {company?.is_active ? 'Active' : 'Inactive'}
            </span>
            {company?.is_verified && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Verified
              </span>
            )}
          </div>
        </div>

        {/* GitHub-style stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsLoading ? '...' : companyStats?.total_employees || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {companyStats?.total_users || 0} users + {companyStats?.total_subjects || 0} subjects
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsLoading ? '...' : companyStats?.total_orders || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {companyStats?.active_orders || 0} active, {companyStats?.completed_orders || 0} completed
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600">Total Searches</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsLoading ? '...' : companyStats?.total_searches || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {companyStats?.pending_searches || 0} pending, {companyStats?.completed_searches || 0} completed
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600">Billing Cost</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsLoading ? '...' : `$${(companyStats?.total_billing_cost || 0).toLocaleString()}`}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Avg: ${(companyStats?.average_order_value || 0).toFixed(2)} per order
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* GitHub-style activity section */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Activity Overview</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Order Distribution</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Completed</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {companyStats?.completed_orders || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Active</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {companyStats?.active_orders || 0}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Search Distribution</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Completed</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {companyStats?.completed_searches || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Pending</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {companyStats?.pending_searches || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Users Management Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
              <p className="text-sm text-gray-500">{users?.length || 0} users in this company</p>
            </div>
          </div>
        </div>
          {/* Search and Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Roles</option>
                  <option value="system_admin">System Admin</option>
                  <option value="company_admin">Company Admin</option>
                  <option value="hr">HR Manager</option>
                  <option value="manager">Manager</option>
                  <option value="employee">Employee</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="verified">Verified</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {usersLoading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <LoadingSpinner />
                      </td>
                    </tr>
                  ) : (
                    users?.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-sm font-semibold text-white">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${roleColors[user.role as keyof typeof roleColors]}`}>
                            {getRoleDisplayName(user.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.department || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                              user.is_active ? statusColors.active : statusColors.inactive
                            }`}>
                              {user.is_active ? 'Active' : 'Inactive'}
                            </span>
                            {user.is_verified && (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors.verified}`}>
                                Verified
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.last_login_at ? formatDateTime(user.last_login_at) : 'Never'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

      {/* Company Settings Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Company Settings</h2>
              <p className="text-sm text-gray-500">Company information and configuration</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Company Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={company?.company_name || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Code</label>
                <input
                  type="text"
                  value={company?.company_code || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={company?.description || ''}
                  disabled
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input
                  type="url"
                  value={company?.website_url || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Email</label>
                <input
                  type="email"
                  value={company?.primary_email || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Billing Email</label>
                <input
                  type="email"
                  value={company?.billing_email || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Phone</label>
                <input
                  type="tel"
                  value={company?.primary_phone || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                <input
                  type="text"
                  value={company?.timezone || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                <input
                  type="text"
                  value={company?.address_line1 || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                <input
                  type="text"
                  value={company?.address_line2 || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={company?.city || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                  <input
                    type="text"
                    value={company?.state_province || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={company?.postal_code || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={company?.country || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee Count</label>
                <input
                  type="number"
                  value={company?.employee_count || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Founded Year</label>
                <input
                  type="number"
                  value={company?.founded_year || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <input
                  type="text"
                  value={company?.currency || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={company?.is_active || false}
                    disabled
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700">Active</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={company?.is_verified || false}
                    disabled
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700">Verified</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
