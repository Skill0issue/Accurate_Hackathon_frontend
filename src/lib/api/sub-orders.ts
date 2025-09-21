import { api } from './api';

export interface SubOrder {
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
}

export interface SubOrderListResponse {
  total: number;
  limit: number;
  offset: number;
  has_next: boolean;
  has_previous: boolean;
  sub_orders: SubOrder[];
}


export interface Search {
  id: string;
  sub_order_id: string;
  package_requirement_id: string;
  search_type: string;
  search_cost: number;
  search_status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  status_code: string;
  search_status_notes: Array<{
    status_code: string;
    reason: string;
    timestamp: string;
    changed_by: string;
  }>;
  subject_id: string;
  completion_date?: string;
  created_at: string;
  updated_at: string;
}

export const subOrdersAPI = {
  // Get all sub-orders with pagination and filtering
  getSubOrders: async (params?: {
    skip?: number;
    limit?: number;
    company_id?: string;
    order_id?: string;
    subject_id?: string;
    package_id?: string;
    status?: string;
    priority?: string;
  }): Promise<SubOrderListResponse> => {
    const response = await api.get('/sub-orders/', { params });
    return response.data;
  },

  // Get specific sub-order by ID
  getSubOrderById: async (subOrderId: string): Promise<SubOrder> => {
    const response = await api.get(`/sub-orders/${subOrderId}`);
    return response.data;
  },

  // Get searches for a sub-order
  getSubOrderSearches: async (subOrderId: string): Promise<Search[]> => {
    const response = await api.get(`/sub-orders/${subOrderId}/searches`);
    return response.data;
  },
};
