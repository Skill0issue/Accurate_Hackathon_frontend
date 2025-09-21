import { api } from './api';

export interface Company {
  id: string;
  company_name: string;
  company_code: string;
  description?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state_province?: string;
  postal_code?: string;
  country?: string;
  timezone?: string;
  primary_phone?: string;
  primary_email?: string;
  billing_email?: string;
  website_url?: string;
  logo_url?: string;
  employee_count?: number;
  founded_year?: number;
  currency: string;
  is_active: boolean;
  is_verified: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface CompanyListResponse {
  total: number;
  limit: number;
  offset: number;
  has_next: boolean;
  has_previous: boolean;
  companies: Company[];
}


export interface CompanyStats {
  total_users: number;
  total_orders: number;
  total_subjects: number;
  total_searches: number;
  active_orders: number;
  completed_orders: number;
  pending_searches: number;
  completed_searches: number;
  total_revenue: string; // Changed to string as per API spec
  average_order_value: string; // Changed to string as per API spec
  last_activity: string;
}

export const companiesAPI = {
  // Get all companies with pagination
  getCompanies: async (params?: {
    skip?: number;
    limit?: number;
  }): Promise<CompanyListResponse> => {
    const response = await api.get('/companies/', { params });
    return response.data;
  },

  // Get specific company by ID
  getCompanyById: async (companyId: string): Promise<Company> => {
    const response = await api.get(`/companies/${companyId}`);
    return response.data;
  },

  // Get company statistics
  getCompanyStats: async (companyId: string): Promise<CompanyStats> => {
    const response = await api.get(`/companies/${companyId}/stats`);
    return response.data;
  },
};
