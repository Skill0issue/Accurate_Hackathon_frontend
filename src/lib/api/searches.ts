import { api } from './api';

export interface Search {
  id: string;
  sub_order_id: string;
  package_requirement_id: string;
  search_type: string;
  search_cost: string; // Changed to string as per API spec
  search_status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  status_code: string;
  search_status_notes: any[]; // Changed to any[] as per API spec (empty array in example)
  subject_id: string;
  completion_date?: string;
  created_at: string;
  updated_at: string;
}

export interface SearchListResponse {
  total: number;
  limit: number;
  offset: number;
  has_next: boolean;
  has_previous: boolean;
  searches: Search[];
}


export const searchesAPI = {
  // Get all searches with pagination and filtering
  getSearches: async (params?: {
    skip?: number;
    limit?: number;
    sub_order_id?: string;
    subject_id?: string;
    search_type?: string;
    search_status?: string;
    company_id?: string;
  }): Promise<SearchListResponse> => {
    const response = await api.get('/searches/', { params });
    return response.data;
  },

  // Get specific search by ID
  getSearchById: async (searchId: string): Promise<Search> => {
    const response = await api.get(`/searches/${searchId}`);
    return response.data;
  },
};
