import { api } from './api';

export interface Order {
  id: string;
  order_code: string;
  order_package_id: string;
  employee_id: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date: string;
  notes?: string;
  internal_notes?: string;
  candidate_count: number;
  candidate_complete_count: number;
  cost: string; // Changed to string as per API spec
  currency: string;
  order_status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'failed';
  company_id: string;
  completion_date?: string;
  created_by: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderListResponse {
  total: number;
  limit: number;
  offset: number;
  has_next: boolean;
  has_previous: boolean;
  orders: Order[];
}


export interface OrderStats {
  total_sub_orders: number;
  completed_sub_orders: number;
  total_searches: number;
  completed_searches: number;
  total_cost: string; // Changed to string as per API spec
  completion_rate: number;
}

export interface SubOrder {
  id: string;
  order_id: string;
  subject_id: string;
  package_id: string;
  sub_order_status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'failed';
  created_at: string;
  updated_at: string;
  subject_name?: string;
  subject_email?: string;
  package_name?: string;
  package_type?: string;
  search_count?: number;
  completed_searches?: number;
}

export const ordersAPI = {
  // Get all orders with pagination and filtering
  getOrders: async (params?: {
    skip?: number;
    limit?: number;
    company_id?: string;
    status?: string;
    employee_id?: string;
  }): Promise<OrderListResponse> => {
    const response = await api.get('/orders/', { params });
    return response.data;
  },

  // Get specific order by ID
  getOrderById: async (orderId: string): Promise<Order> => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  // Get order statistics
  getOrderStats: async (orderId: string): Promise<OrderStats> => {
    const response = await api.get(`/orders/${orderId}/stats`);
    return response.data;
  },

  // Get sub-orders for a specific order
  getSubOrders: async (orderId: string): Promise<SubOrder[]> => {
    const response = await api.get(`/orders/${orderId}/sub-orders`);
    return response.data;
  },
};
